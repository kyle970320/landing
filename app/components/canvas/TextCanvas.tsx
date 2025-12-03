/*eslint-disable */

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import PoissonDiskSampling from "poisson-disk-sampling";

// ===== Simplex 3D Noise (Ashima) =====
const NOISE_GLSL = `
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}
float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

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

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
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

const TEXT_SIZE = 800;
const HALF_SIZE = TEXT_SIZE / 2;
const MAX_PARTICLE_COUNT = 60000;
const TEXTS = ["FREE", "PRO", "PREMIUM"];

function createTextImageData(text: string): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = TEXT_SIZE;
  canvas.height = TEXT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not supported");

  ctx.clearRect(0, 0, TEXT_SIZE, TEXT_SIZE);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  // ✅ 글씨 크기 60px 로 축소
  ctx.font =
    "bold 140px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

  // ✅ 항상 TEXT_SIZE/2, TEXT_SIZE/2 기준이라 정중앙
  ctx.fillText(text, TEXT_SIZE / 2, TEXT_SIZE / 2);

  return ctx.getImageData(0, 0, TEXT_SIZE, TEXT_SIZE);
}
class TextParticleSystem {
  sceneWrapper: any;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;

  lastTime = 0;
  everRendered = false;
  particleScale: number;

  pointsBaseData: number[][] = [];
  pointsData: number[] = [];
  nearestPointsData: number[][] = [];
  texts: string[] = [];

  count = 0;
  size = 128; // ⭐ 텍스처 크기 절반으로 (128 → 64)
  length = this.size * this.size;

  posTex!: THREE.DataTexture;
  posNearestTex!: THREE.DataTexture;
  rt1!: THREE.WebGLRenderTarget;
  rt2!: THREE.WebGLRenderTarget;

  simScene!: THREE.Scene;
  simCamera!: THREE.OrthographicCamera;
  simMaterial!: THREE.ShaderMaterial;

  mesh!: THREE.Points;
  renderMaterial!: THREE.ShaderMaterial;

  // 전환 관련
  textTransition = 0;
  textTransitionActive = false;

  constructor(sceneWrapper: any, texts: string[]) {
    this.sceneWrapper = sceneWrapper;
    this.renderer = sceneWrapper.renderer;
    this.camera = sceneWrapper.camera;

    this.particleScale =
      (this.sceneWrapper.renderer.domElement.width /
        this.sceneWrapper.pixelRatio /
        2000) *
      this.sceneWrapper.particlesScale;

    this.createPoints();
    this.createPointsFromTexts(texts);
    this.init();
  }

  createPoints() {
    const pds = new PoissonDiskSampling({
      shape: [TEXT_SIZE, TEXT_SIZE],
      minDistance: 5,
      maxDistance: 13,
      tries: 10,
    });

    const points = pds.fill() as number[][];

    // ✅ 텍스처에서 표현 가능한 최대 개수까지로 제한
    const maxCount = Math.min(MAX_PARTICLE_COUNT, this.length);

    let selected: number[][] = points;
    if (points.length > maxCount) {
      const step = Math.floor(points.length / maxCount);
      selected = [];
      for (
        let i = 0;
        i < points.length && selected.length < maxCount;
        i += step
      ) {
        selected.push(points[i]);
      }
    }

    this.pointsBaseData = selected;
    this.pointsData = [];

    for (let i = 0; i < selected.length; i++) {
      this.pointsData.push(
        selected[i][0] - HALF_SIZE,
        selected[i][1] - HALF_SIZE,
      );
    }

    this.count = Math.min(this.pointsData.length / 2, maxCount); // ✅ 안전하게
  }

  createPointsFromTexts(texts: string[]) {
    const imageDatas = texts.map((t) => createTextImageData(t));
    this.nearestPointsData = [];

    const results = imageDatas.map((imageData, index) =>
      this.createPointsDistanceData(imageData, this.pointsBaseData, index),
    );

    results
      .sort((a, b) => a.index - b.index)
      .forEach((r) => {
        this.nearestPointsData.push(r.nearestPoints);
      });
  }

  createPointsDistanceData(
    imageData: ImageData,
    pointsBase: number[][],
    index: number,
  ): { nearestPoints: number[]; index: number } {
    const distanceFunction = (point: number[], img: ImageData) => {
      const px = Math.round(point[0]);
      const py = Math.round(point[1]);
      if (px < 0 || py < 0 || px >= img.width || py >= img.height) {
        return 1;
      }
      const baseIndex = (px + py * img.width) * 4;

      // ✅ 알파 채널을 사용해서 글자 영역 인식
      const alpha = img.data[baseIndex + 3] / 255; // 0 = 배경, 1 = 글자

      // ✅ 글자일수록 0, 배경일수록 1이 되도록 반전
      const v = 1.0 - alpha;

      // 너무 극단적이지 않게 약간 곡선 적용 (원하면 생략 가능)
      return v * v * v;
    };

    const poissonDisk = new PoissonDiskSampling({
      shape: [TEXT_SIZE, TEXT_SIZE],
      minDistance: 1,
      maxDistance: 30,
      tries: 10,
      distanceFunction: (point: number[]) => distanceFunction(point, imageData),
    });

    const points = poissonDisk.fill() as number[][];
    const nearestPoints: number[] = [];

    const baseCount = Math.min(pointsBase.length, MAX_PARTICLE_COUNT);

    for (let i = 0; i < baseCount; i++) {
      let nearestPoint: number[] | null = null;
      let nearestDistance = Infinity;

      // ⭐ 샘플링 비율 증가로 연산 감소
      for (let j = 0; j < points.length; j++) {
        if (Math.random() < 0.9) continue; // 90% 스킵

        const dx = points[j][0] - pointsBase[i][0];
        const dy = points[j][1] - pointsBase[i][1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        const pixelRedValue = distanceFunction(points[j], imageData);

        if (pixelRedValue < 1 && distance < nearestDistance) {
          nearestDistance = distance;
          nearestPoint = points[j];
        }
      }

      if (!nearestPoint) {
        nearestPoint = [pointsBase[i][0], pointsBase[i][1]];
      }

      nearestPoints.push(
        nearestPoint[0] - HALF_SIZE, // ✅
        nearestPoint[1] - HALF_SIZE, // ✅
      );
    }

    return { nearestPoints, index };
  }

  createDataTexturePosition(arr: number[]) {
    const data = new Float32Array(this.length * 4);
    for (let i = 0; i < this.count; i++) {
      const idx = i * 4;
      // ✅ HALF_SIZE 로 나눠서 [-1, 1] 범위에 가깝게 맞추기
      data[idx + 0] = (arr[i * 2 + 0] ?? 0) * (1 / HALF_SIZE);
      data[idx + 1] = (arr[i * 2 + 1] ?? 0) * (1 / HALF_SIZE);
      data[idx + 2] = 0;
      data[idx + 3] = 0;
    }

    const tex = new THREE.DataTexture(
      data,
      this.size,
      this.size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    tex.needsUpdate = true;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;

    return tex;
  }

  createRenderTarget() {
    const rt = new THREE.WebGLRenderTarget(this.size, this.size, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      type: THREE.FloatType,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
    });

    return rt;
  }
  setActiveText(index: number) {
    if (!this.nearestPointsData[index]) return;

    // 기존 텍스처 정리
    if (this.posNearestTex) {
      this.posNearestTex.dispose();
    }

    // 선택한 텍스트의 nearestPoint로 텍스처 생성
    this.posNearestTex = this.createDataTexturePosition(
      this.nearestPointsData[index],
    );
    this.simMaterial.uniforms.uPosNearest.value = this.posNearestTex;

    // 텍스트 전환 애니메이션 트리거
    this.textTransition = 0;
    this.textTransitionActive = true;
  }

  init() {
    this.posTex = this.createDataTexturePosition(this.pointsData);
    this.posNearestTex = this.createDataTexturePosition(
      this.nearestPointsData[0],
    );

    this.rt1 = this.createRenderTarget();
    this.rt2 = this.createRenderTarget();

    this.renderer.setRenderTarget(this.rt1);
    this.renderer.setClearColor(0, 0);
    this.renderer.clear();
    this.renderer.setRenderTarget(this.rt2);
    this.renderer.setClearColor(0, 0);
    this.renderer.clear();
    this.renderer.setRenderTarget(null);

    this.simScene = new THREE.Scene();
    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // ⭐ 시뮬레이션 셰이더 최적화
    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: this.posTex },
        uPosRefs: { value: this.posTex },
        uPosNearest: { value: this.posNearestTex },
        uIsHovering: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float; // ⭐ highp → mediump

        uniform sampler2D uPosition;
        uniform sampler2D uPosRefs;
        uniform sampler2D uPosNearest;
        uniform float uIsHovering;
        uniform float uTime;

        void main() {
          vec2 simTexCoords = gl_FragCoord.xy / vec2(${this.size}.0, ${this.size}.0);
          vec4 pFrame = texture2D(uPosition, simTexCoords);

          float scale = pFrame.z;
          float velocity = pFrame.w;

          vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;
          vec2 nearestPos = texture2D(uPosNearest, simTexCoords).xy;
          vec2 pos = pFrame.xy;

          vec2 targetPos = mix(refPos, nearestPos, uIsHovering * uIsHovering);
          float dist = length(targetPos - pos);

          // ⭐ 간단한 보간만 사용
          if (dist > 0.005) {
            vec2 direction = normalize(targetPos - pos + 1e-5) * 0.01;
            float distStrength = smoothstep(0.15, 0.0, dist);
            pos += direction * distStrength;
          }

          float baseScale = 0.8;
          float hoverBoost = smoothstep(0.1, 0.0, smoothstep(0.001, 0.1, dist)) * 1.0 * uIsHovering;
          float targetScale = baseScale + hoverBoost;

          scale += (targetScale - scale) * 0.15;
          velocity = smoothstep(0.15, 0.001, dist) * uIsHovering;

          vec2 diff = pos - pFrame.xy;
          gl_FragColor = vec4(pFrame.xy + diff * 0.2, scale, velocity);
        }
      `,
    });

    const simQuadGeo = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(simQuadGeo, this.simMaterial);
    this.simScene.add(simQuad);

    // ⭐ 렌더 셰이더 최적화
    const geometry = new THREE.BufferGeometry();
    const uv = new Float32Array(this.count * 2);
    const seeds = new Float32Array(this.count * 4);
    const dummyPos = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      const x = i % this.size;
      const y = Math.floor(i / this.size);
      uv[i * 2 + 0] = x / this.size;
      uv[i * 2 + 1] = y / this.size;

      seeds[i * 4 + 0] = Math.random();
      seeds[i * 4 + 1] = Math.random();
      seeds[i * 4 + 2] = Math.random();
      seeds[i * 4 + 3] = Math.random();
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dummyPos, 3),
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geometry.setAttribute("seeds", new THREE.Float32BufferAttribute(seeds, 4));

    this.renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: this.posTex },
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#4f39f6") },
        uColor2: { value: new THREE.Color("#4f39f6") },
        uColor3: { value: new THREE.Color("#4f39f6") },
        uAlpha: { value: 1 },
        uIsHovering: { value: 0 },
        uPulseProgress: { value: 0 },
        uParticleScale: { value: this.particleScale },
        uPixelRatio: { value: this.sceneWrapper.pixelRatio },
      },
      vertexShader: `
        precision mediump float; // ⭐ highp → mediump
        attribute vec4 seeds;

        uniform sampler2D uPosition;
        uniform float uTime;
        uniform float uParticleScale;
        uniform float uPixelRatio;
        uniform float uIsHovering;
        uniform float uPulseProgress;

        varying vec4 vSeeds;
        varying float vVelocity;
        varying vec2 vLocalPos;
        varying float vScale;

        ${NOISE_GLSL}

        void main() {
          vec4 pos = texture2D(uPosition, uv);
          vSeeds = seeds;

          // ⭐ 노이즈 연산 단순화 (2개만 사용)
          float noiseX = snoise(vec3(pos.xy * 10.0, uTime * 0.2));
          float noiseY = snoise(vec3(pos.xy * 10.0, uTime * 0.2 + 100.0));

          float cDist = length(pos.xy);
          float progress = uPulseProgress;
          float t = smoothstep(progress - 0.25, progress, cDist) - 
                    smoothstep(progress, progress + 0.25, cDist);
          t *= smoothstep(1.0, 0.0, cDist);
          pos.xy *= 1.0 + (t * 0.02);

          float dist = smoothstep(0.0, 0.9, pos.w) * uIsHovering;
          pos.y += noiseY * 0.005 * dist;
          pos.x += noiseX * 0.005 * dist;

          vVelocity = pos.w;
          vScale = pos.z;
          vLocalPos = pos.xy;

          vec4 viewSpace = modelViewMatrix * vec4(vec3(pos.xy, 0.0), 1.0);
          gl_Position = projectionMatrix * viewSpace;

          gl_PointSize = ((vScale * 2.0) * (uPixelRatio * 0.5) * uParticleScale) + 
                         (0.05 * uPixelRatio);
        }
      `,
      fragmentShader: `
        precision mediump float; // ⭐ highp → mediump

        varying vec4 vSeeds;
        varying vec2 vLocalPos;
        varying float vScale;
        varying float vVelocity;

        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uAlpha;

        void main() {
          float h = 0.8;
          float progress = vVelocity;

          vec3 col = mix(
            mix(uColor1, uColor2, progress / h),
            mix(uColor2, uColor3, (progress - h) / (1.0 - h)),
            step(h, progress)
          );

          gl_FragColor = vec4(clamp(col, 0.0, 1.0), uAlpha);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new THREE.Points(geometry, this.renderMaterial);
    this.mesh.position.set(0, 0, 0);
    const s = 4.0;
    this.mesh.scale.set(s, -s, s);

    this.sceneWrapper.scene.add(this.mesh);
  }

  resize() {
    this.renderMaterial.uniforms.uPixelRatio.value =
      this.sceneWrapper.pixelRatio;
    this.renderMaterial.needsUpdate = true;
  }

  update(hoverNum: number) {
    const now = this.sceneWrapper.clock.getElapsedTime();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.particleScale =
      (this.sceneWrapper.renderer.domElement.width /
        this.sceneWrapper.pixelRatio /
        2000) *
      this.sceneWrapper.particlesScale;

    const hover = hoverNum;

    if (this.textTransitionActive) {
      const duration = 0.8;
      this.textTransition += delta / duration;
      if (this.textTransition >= 1.0) {
        this.textTransition = 1.0;
        this.textTransitionActive = false;
      }
    }

    this.simMaterial.uniforms.uPosition.value = this.everRendered
      ? this.rt1.texture
      : this.posTex;
    this.simMaterial.uniforms.uTime.value = now;
    this.simMaterial.uniforms.uIsHovering.value = hover;

    this.renderer.setRenderTarget(this.rt2);
    this.renderer.render(this.simScene, this.simCamera);
    this.renderer.setRenderTarget(null);

    const tmp = this.rt1;
    this.rt1 = this.rt2;
    this.rt2 = tmp;
    this.everRendered = true;

    this.renderMaterial.uniforms.uPosition.value = this.rt1.texture;
    this.renderMaterial.uniforms.uTime.value = now;
    this.renderMaterial.uniforms.uParticleScale.value = this.particleScale;
    this.renderMaterial.uniforms.uIsHovering.value = hover;
    this.renderMaterial.uniforms.uPulseProgress.value =
      (Math.sin(now * 0.7) + 1.0) * 0.5;
  }
}

interface Props {
  activeIndex: number;
  hoverNum: number;
}
export default function TextCanvas(props: Props) {
  const { hoverNum, activeIndex } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef(hoverNum);
  const systemRef = useRef<TextParticleSystem | null>(null); // ✅ 추가

  useEffect(() => {
    hoverRef.current = hoverNum;
  }, [hoverNum]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const width = el.clientWidth || window.innerWidth;
    const height = el.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // ⭐ 안티앨리어싱 끄기
      alpha: true,
      powerPreference: "high-performance", // ⭐ 고성능 모드
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // ⭐ pixelRatio 제한
    renderer.setSize(width, height);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const baseAspect = (width / height) * 0.9;
    const baseZ = 4.8;

    const camera = new THREE.PerspectiveCamera(45, baseAspect, 0.1, 100);
    camera.position.z = baseZ;

    const clock = new THREE.Clock();

    const sceneWrapper = {
      scene,
      renderer,
      camera,
      pixelRatio: renderer.getPixelRatio(),
      density: 150,
      ringDisplacement: 1.0,
      colorControls: {
        color1: "#4f39f6",
        color2: "#4f39f6",
        color3: "#4f39f6",
      },
      ringWidth: 0.05,
      ringWidth2: 0.015,
      hoverProgress: 0,
      pushProgress: 0,
      time: 0,
      intersectionPoint: new THREE.Vector2(0, 0),
      isIntersecting: false,
      particlesScale: 1.0,
      clock,
    };

    const system = new TextParticleSystem(sceneWrapper, TEXTS);
    systemRef.current = system; // ✅ 저장

    let animId: number;
    const animate = () => {
      sceneWrapper.time = clock.getElapsedTime();
      system.update(hoverRef.current);
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      const aspect = (w / h) * 0.9;
      renderer.setSize(w, h);
      camera.aspect = aspect;
      camera.position.z = baseZ * (baseAspect / aspect);
      camera.updateProjectionMatrix();
      const zDiff = camera.position.z - baseZ;
      system.mesh.position.y = zDiff * 0.22;
      sceneWrapper.pixelRatio = renderer.getPixelRatio();
      system.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);

      scene.remove(system.mesh);
      system.mesh.geometry.dispose();
      system.renderMaterial.dispose();
      system.simMaterial.dispose();
      system.rt1.dispose();
      system.rt2.dispose();
      system.posTex.dispose();
      system.posNearestTex.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      systemRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!systemRef.current) return;
    let timeoutId;
    hoverRef.current = 0;
    timeoutId = setTimeout(() => {
      hoverRef.current = hoverNum;
    }, 500);
    systemRef.current.setActiveText(activeIndex);
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "0%",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    />
  );
}
