"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import PoissonDiskSampling from "poisson-disk-sampling";

const NOISE_GLSL = `
//
// Simplex 3D Noise
//  by Ian McEwan, Ashima Arts
//
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}
float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1),
                                 dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1),
                          dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

// Simple noise class for ring movement
class SimpleNoise {
  getVal(t: number) {
    return (
      (Math.sin(t * 1.234) * 0.5 +
        Math.sin(t * 2.456) * 0.3 +
        Math.sin(t * 0.789) * 0.2 +
        1) /
      2
    );
  }
}

const linearMap = (x: number, a: number, b: number, c: number, d: number) => {
  return ((x - a) * (d - c)) / (b - a) + c;
};

const ParticleCanvas = ({
  theme = "dark",
  density = 250,
  particlesScale = 0.75,
  ringWidth = 0.107,
  ringWidth2 = 0.05,
  ringDisplacement = 0.15,
}: {
  theme?: "dark" | "light";
  density?: number;
  particlesScale?: number;
  ringWidth?: number;
  ringWidth2?: number;
  ringDisplacement?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const pixelRatio = window.devicePixelRatio || 1;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
      stencil: false,
      precision: "highp",
    });
    renderer.extensions.get("EXT_color_buffer_float");
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create points using Poisson Disk Sampling
    const pds = new PoissonDiskSampling({
      shape: [500, 500],
      minDistance: linearMap(density, 0, 300, 10, 2),
      maxDistance: linearMap(density, 0, 300, 11, 3),
      tries: 20,
    });

    const samples = pds.fill();
    const pointsData: number[] = [];
    for (let i = 0; i < samples.length; i++) {
      pointsData.push(samples[i][0] - 250, samples[i][1] - 250);
    }

    const size = 256;
    const length = size * size;
    let count = pointsData.length / 2;
    if (count > length) {
      count = length;
    }

    // Create position texture
    const posData = new Float32Array(length * 4);
    for (let i = 0; i < count; i++) {
      const r = i * 4;
      const px = pointsData[i * 2 + 0] / 250;
      const py = pointsData[i * 2 + 1] / 250;
      posData[r + 0] = px;
      posData[r + 1] = py;
      posData[r + 2] = 0.0; // scale
      posData[r + 3] = 0.0; // velocity
    }
    const posTex = new THREE.DataTexture(
      posData,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    posTex.needsUpdate = true;

    // Create render targets
    const createRenderTarget = () =>
      new THREE.WebGLRenderTarget(size, size, {
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        depthBuffer: false,
        stencilBuffer: false,
      });

    let rt1 = createRenderTarget();
    let rt2 = createRenderTarget();

    renderer.setRenderTarget(rt1);
    renderer.setClearColor(0, 0);
    renderer.clear();
    renderer.setRenderTarget(rt2);
    renderer.clear();
    renderer.setRenderTarget(null);

    // Simulation scene
    const simScene = new THREE.Scene();
    const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const ringPos = new THREE.Vector2(0, 0);
    const cursorPos = new THREE.Vector2(0, 0);
    const noise = new SimpleNoise();

    // 👇 마우스 속도 계산용
    const mouseNDC = new THREE.Vector2(0, 0);
    const prevMouseNDC = new THREE.Vector2(0, 0);
    let mouseVelocity = 0;

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: posTex },
        uPosRefs: { value: posTex },
        uRingPos: { value: ringPos },
        uRingRadius: { value: 0.2 },
        uDeltaTime: { value: 0 },
        uRingWidth: { value: ringWidth },
        uRingWidth2: { value: ringWidth2 },
        uRingDisplacement: { value: ringDisplacement },
        uTime: { value: 0 },
        uMouseVelocity: { value: 0 }, // 👈 추가
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uPosition;
        uniform sampler2D uPosRefs;
        uniform vec2 uRingPos;
        uniform float uTime;
        uniform float uDeltaTime;
        uniform float uRingRadius;
        uniform float uRingWidth;
        uniform float uRingWidth2;
        uniform float uRingDisplacement;
        uniform float uMouseVelocity; // 👈 추가

        ${NOISE_GLSL}

        void main() {
          vec2 simTexCoords = gl_FragCoord.xy / vec2(${size.toFixed(
            1,
          )}, ${size.toFixed(1)});
          vec4 pFrame = texture2D(uPosition, simTexCoords);

          float scale = pFrame.z;
          float velocity = pFrame.w;
          vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;

          float time = uTime * .5;
          vec2 curentPos = refPos;

          vec2 pos = pFrame.xy;
          pos *= .8;

          float dist = distance(curentPos.xy, uRingPos);
          float noise0 = snoise(vec3(curentPos.xy * .2 + vec2(18.4924, 72.9744), time * 0.5));
          float dist1 = distance(curentPos.xy + (noise0 * .005), uRingPos);

          float t = smoothstep(uRingRadius - (uRingWidth * 2.), uRingRadius, dist) 
                  - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
          float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.), uRingRadius, dist) 
                   - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
          float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

          t = pow(t, 2.);
          t2 = pow(t2, 3.);

          t += t2 * 3.;
          t += t3 * .4;
          t += snoise(vec3(curentPos.xy * 30. + vec2(11.4924, 12.9744), time * 0.5)) * t3 * .5;

          float nS = snoise(vec3(curentPos.xy * 2. + vec2(18.4924, 72.9744), time * 0.5));
          t += pow((nS + 1.5) * .5, 2.) * .6;

          // Multi-scale noise displacement
          float noise1 = snoise(vec3(curentPos.xy * 4. + vec2(88.494, 32.4397), time * 0.35));
          float noise2 = snoise(vec3(curentPos.xy * 4. + vec2(50.904, 120.947), time * 0.35));
          float noise3 = snoise(vec3(curentPos.xy * 20. + vec2(18.4924, 72.9744), time * .5));
          float noise4 = snoise(vec3(curentPos.xy * 20. + vec2(50.904, 120.947), time * .5));

          vec2 disp = vec2(noise1, noise2) * .03;
          disp += vec2(noise3, noise4) * .005;

          // Sin wave
          disp.x += sin((refPos.x * 20.) + (time * 4.)) * .02 * clamp(dist, 0., 1.);
          disp.y += cos((refPos.y * 20.) + (time * 3.)) * .02 * clamp(dist, 0., 1.);

          // ====== 🟣 마우스 속도 기반 꼬리(트레일) 방향 ======
          float lenToRing = length(curentPos.xy - uRingPos);
          vec2 dir = lenToRing > 0.0001
            ? (curentPos.xy - uRingPos) / lenToRing
            : vec2(0.0);
          // 마우스 속도가 빠를수록 더 뒤로 끌어당김
          float trailStrength = clamp(uMouseVelocity * 0.25, 0.0, 2.0);
          // t2(링 경계 부근에서만 더 강하게) 기반으로 꼬리 효과 적용
          pos += dir * trailStrength * t2 * 0.15;

          // Scale
          float scaleDiff = t - scale;
          scaleDiff *= .2;
          scale += scaleDiff;

          // 속도에 따른 추가 scale 부스트 (꼬리 구간을 조금 더 크게)
          scale += trailStrength * t2 * 0.1;
          scale = clamp(scale, 0.0, 3.0);

          // Final position
          vec2 finalPos = curentPos + disp + (pos * .25);

          velocity *= .5;
          velocity += scale * .25;

          vec4 frame = vec4(finalPos, scale, velocity);
          gl_FragColor = frame;
        }
      `,
    });

    const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    simScene.add(simQuad);

    // Particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    const uvArray = new Float32Array(count * 2);
    const positionArray = new Float32Array(count * 3);
    const seedsArray = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const x = i % size;
      const y = Math.floor(i / size);
      uvArray[i * 2 + 0] = x / size;
      uvArray[i * 2 + 1] = y / size;

      seedsArray[i * 4 + 0] = Math.random();
      seedsArray[i * 4 + 1] = Math.random();
      seedsArray[i * 4 + 2] = Math.random();
      seedsArray[i * 4 + 3] = Math.random();
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3),
    );
    particleGeometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));
    particleGeometry.setAttribute(
      "seeds",
      new THREE.BufferAttribute(seedsArray, 4),
    );

    const colorControls = {
      color1: theme === "dark" ? "#4f39f6" : "#4f39f6",
      color2: theme === "dark" ? "#4f39f6" : "#4f39f6",
      color3: theme === "dark" ? "#4f39f6" : "#4f39f6",
    };

    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: posTex },
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(colorControls.color1) },
        uColor2: { value: new THREE.Color(colorControls.color2) },
        uColor3: { value: new THREE.Color(colorControls.color3) },
        uAlpha: { value: 1 },
        uRingPos: { value: ringPos },
        uRez: {
          value: new THREE.Vector2(
            renderer.domElement.width,
            renderer.domElement.height,
          ),
        },
        uParticleScale: {
          value:
            (renderer.domElement.width / pixelRatio / 2000) * particlesScale,
        },
        uPixelRatio: { value: pixelRatio },
        uColorScheme: { value: theme === "dark" ? 0 : 1 },
        uMouseVelocity: { value: 0 }, // 👈 추가
      },
      vertexShader: `
        precision highp float;
        attribute vec4 seeds;

        uniform sampler2D uPosition;
        uniform float uTime;
        uniform float uParticleScale;
        uniform float uPixelRatio;
        uniform int uColorScheme;
        uniform float uMouseVelocity; // 👈 추가

        varying vec4 vSeeds;
        varying float vVelocity;
        varying vec2 vLocalPos;
        varying vec2 vScreenPos;
        varying float vScale;

        void main() {
          vec4 pos = texture2D(uPosition, uv);
          vSeeds = seeds;

          vVelocity = pos.w;
          vScale = pos.z;
          vLocalPos = pos.xy;
          vec4 viewSpace = modelViewMatrix * vec4(vec3(pos.xy, 0.), 1.0);

          gl_Position = projectionMatrix * viewSpace;
          vScreenPos = gl_Position.xy;

          float baseSize = (vScale * 7.) * (uPixelRatio * 0.5) * uParticleScale;

          // 🟣 마우스 속도 + 파티클 속도 기반 사이즈 부스트 (꼬리/스파크 느낌)
          float velFactor = clamp(vVelocity, 0.0, 1.0);
          float mouseFactor = clamp(uMouseVelocity * 0.5, 0.0, 2.0);
          float tailBoost = 1.0 + (mouseFactor * velFactor) * 0.4;

          gl_PointSize = baseSize * tailBoost;
        }
      `,
      fragmentShader: `
        precision highp float;

        varying vec4 vSeeds;
        varying vec2 vScreenPos;
        varying vec2 vLocalPos;
        varying float vScale;
        varying float vVelocity;

        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec2 uRingPos;
        uniform vec2 uRez;
        uniform float uAlpha;
        uniform float uTime;
        uniform int uColorScheme;
        uniform float uMouseVelocity; // 👈 추가

        ${NOISE_GLSL}

        #define PI 3.1415926535897932384626433832795

        float sdRoundBox(in vec2 p, in vec2 b, in vec4 r) {
          r.xy = (p.x>0.0)?r.xy : r.zw;
          r.x = (p.y>0.0)?r.x  : r.y;
          vec2 q = abs(p)-b+r.x;
          return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
        }

        vec2 rotate(vec2 v, float a) {
          float s = sin(a);
          float c = cos(a);
          mat2 m = mat2(c, s, -s, c);
          return m * v;
        }

        void main() {
          float uBorderSize = 0.2;
          float ratio = uRez.x / uRez.y;

          // Noise
          float noiseAngle = snoise(vec3(vLocalPos * 10. + vec2(18.4924, 72.9744), uTime * .85));
          float noiseColor = snoise(vec3(vLocalPos * 2. + vec2(74.664, 91.556), uTime * .5));
          noiseColor = (noiseColor + 1.) * .5;

          // Angle to ring
          float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

          vec2 uv = gl_PointCoord.xy;
          uv -= vec2(0.5);
          uv.y *= -1.;
          uv = rotate(uv, -angle + (noiseAngle * .5));

          float h = 0.8;
          float progress = smoothstep(0., .75, pow(noiseColor, 2.));
          vec3 col = mix(
            mix(uColor1, uColor2, progress/h), 
            mix(uColor2, uColor3, (progress - h)/(1.0 - h)), 
            step(h, progress)
          );
          vec3 color = col;

          float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(.25));
          rounded = smoothstep(.1, 0., rounded);

          float a = uAlpha * rounded * smoothstep(0.1, 0.2, vScale);

          if(a < 0.01) {
            discard;
          }

          color = clamp(color, 0., 1.);

          // 마우스 속도 + 파티클 속도 기반 하이라이트/글로우
          float velFactor = clamp(vVelocity, 0.0, 1.0);
          float mouseFactor = clamp(uMouseVelocity * 0.4, 0.0, 1.0);
          float glow = velFactor * mouseFactor;

          // 속도가 빠른 구간일수록 살짝 더 밝고 화이트에 가깝게
          color = mix(color, vec3(1.0), glow * 0.7);

          // 다크/라이트 스킴에 따라 약간의 대비 보정
          color = mix(color, color * clamp(vVelocity, 0., 1.), float(uColorScheme));

          // 꼬리 구간은 알파도 조금 더 세게
          a *= (0.7 + 0.3 * glow);

          gl_FragColor = vec4(color, clamp(a, 0., 1.));
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, renderMaterial);
    particles.position.set(0, 0, 0);
    particles.scale.set(5, 5, 5);
    scene.add(particles);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const intersectionPoint = new THREE.Vector3();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let isIntersecting = false;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseNDC.set(x, y);
    };

    const handleMouseLeave = () => {
      isIntersecting = false;
    };

    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const clock = new THREE.Clock();
    let lastTime = 0;
    let everRendered = false;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const dt = elapsed - lastTime;
      lastTime = elapsed;

      // ====== 🟣 마우스 속도 계산 ======
      const dx = mouseNDC.x - prevMouseNDC.x;
      const dy = mouseNDC.y - prevMouseNDC.y;
      let instVel = 0;
      if (dt > 0) {
        instVel = Math.sqrt(dx * dx + dy * dy) / dt;
      }
      // 부드럽게 보간 & 클램프
      mouseVelocity += (instVel - mouseVelocity) * 0.05;
      mouseVelocity = Math.min(mouseVelocity, 50);
      prevMouseNDC.copy(mouseNDC);

      // Ring movement (기존 로직)
      const noiseX = (noise.getVal(elapsed * 0.66 + 94.234) - 0.5) * 2;
      const noiseY = (noise.getVal(elapsed * 0.75 + 21.028) - 0.5) * 2;

      raycaster.setFromCamera(mouseNDC, camera);
      const hit = raycaster.ray.intersectPlane(plane, intersectionPoint);

      if (hit) {
        isIntersecting = true;
        cursorPos.set(
          intersectionPoint.x * 0.175 + noiseX * 0.1,
          intersectionPoint.y * 0.175 + noiseY * 0.1,
        );
        ringPos.set(
          ringPos.x + (cursorPos.x - ringPos.x) * 0.02,
          ringPos.y + (cursorPos.y - ringPos.y) * 0.02,
        );
      } else {
        isIntersecting = false;
        cursorPos.set(noiseX * 0.2, noiseY * 0.1);
        ringPos.set(
          ringPos.x + (cursorPos.x - ringPos.x) * 0.01,
          ringPos.y + (cursorPos.y - ringPos.y) * 0.01,
        );
      }

      // Simulation pass
      simMaterial.uniforms.uPosition.value = everRendered
        ? rt1.texture
        : posTex;
      simMaterial.uniforms.uTime.value = elapsed;
      simMaterial.uniforms.uDeltaTime.value = dt;
      simMaterial.uniforms.uMouseVelocity.value = mouseVelocity; // 👈 전달
      simMaterial.uniforms.uRingRadius.value =
        0.175 + Math.sin(elapsed * 1) * 0.03 + Math.cos(elapsed * 3) * 0.02;
      simMaterial.uniforms.uRingPos.value.copy(ringPos);
      simMaterial.uniforms.uRingWidth.value = ringWidth;
      simMaterial.uniforms.uRingWidth2.value = ringWidth2;
      simMaterial.uniforms.uRingDisplacement.value = ringDisplacement;
      renderer.setRenderTarget(rt2);
      renderer.render(simScene, simCamera);
      renderer.setRenderTarget(null);

      // Render pass
      renderMaterial.uniforms.uPosition.value = everRendered
        ? rt2.texture
        : posTex;
      renderMaterial.uniforms.uTime.value = clock.getElapsedTime();
      renderMaterial.uniforms.uRingPos.value.copy(ringPos);
      renderMaterial.uniforms.uParticleScale.value =
        (renderer.domElement.width / pixelRatio / 2000) * particlesScale;
      renderMaterial.uniforms.uMouseVelocity.value = mouseVelocity; // 👈 전달

      renderer.autoClear = true;
      renderer.clear();
      renderer.render(scene, camera);

      // Swap render targets
      const tmp = rt1;
      rt1 = rt2;
      rt2 = tmp;
      everRendered = true;
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderMaterial.uniforms.uRez.value.set(
        renderer.domElement.width,
        renderer.domElement.height,
      );
      renderMaterial.uniforms.uPixelRatio.value = pixelRatio;
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseleave", handleMouseLeave);

      particleGeometry.dispose();
      renderMaterial.dispose();
      simMaterial.dispose();
      posTex.dispose();
      rt1.dispose();
      rt2.dispose();
      simQuad.geometry.dispose();

      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [theme, density, particlesScale, ringWidth, ringWidth2, ringDisplacement]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    />
  );
};

export default ParticleCanvas;
