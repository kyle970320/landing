"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const RotatingRingParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseInsideRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ==== 기본 세팅 ====
    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5.9;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // ==== 파티클 세팅 ====
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalAngles = new Float32Array(particleCount);
    const originalRadii = new Float32Array(particleCount);
    const rotationSpeeds = new Float32Array(particleCount);
    const spreadDistances = new Float32Array(particleCount);
    const spreadSpeeds = new Float32Array(particleCount);
    const spreadAngles = new Float32Array(particleCount);

    const ringRadius = 3;
    const ringThickness = 0.2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = ringRadius + (Math.random() - 0.5) * ringThickness;

      originalAngles[i] = angle;
      originalRadii[i] = radius;
      rotationSpeeds[i] = 0.3 + Math.random() * 0.7;
      spreadDistances[i] = 0.5 + Math.random() * 2.0;
      spreadSpeeds[i] = 0.03 + Math.random() * 0.1;
      spreadAngles[i] = (Math.random() - 0.5) * 1.0;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * (Math.random() * 3.5);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x4f39f6,
      size: 0.022,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ==== 마우스 트래킹 (window 기준) ====
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();

    const handleMouseMove = (event: MouseEvent) => {
      // 전체 뷰포트 기준 NDC
      const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(event.clientY / window.innerHeight) * 2 + 1;

      mouse.set(ndcX, ndcY);

      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.ray.intersectPlane(plane, intersectPoint);
      if (!hit) {
        isMouseInsideRef.current = false;
        return;
      }

      const distanceFromCenter = Math.hypot(intersectPoint.x, intersectPoint.y);

      const inside =
        distanceFromCenter < ringRadius + 1.5 &&
        distanceFromCenter > ringRadius - ringThickness - 1.5;

      isMouseInsideRef.current = inside;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ==== 애니메이션 ====
    let time = 0;
    const currentSpreadFactors = new Float32Array(particleCount).fill(0);

    const animate = () => {
      rafIdRef.current = requestAnimationFrame(animate);
      time += 0.01;

      const posArray = geometry.attributes.position.array as Float32Array;
      const targetSpreadFactor = isMouseInsideRef.current ? 1 : 0;

      for (let i = 0; i < particleCount; i++) {
        const individualSpeed = spreadSpeeds[i];
        currentSpreadFactors[i] +=
          (targetSpreadFactor - currentSpreadFactors[i]) * individualSpeed;

        const speed = rotationSpeeds[i];
        const angleOffset = spreadAngles[i] * currentSpreadFactors[i];
        const currentAngle = originalAngles[i] + time * speed + angleOffset;
        const spreadDist = spreadDistances[i] * currentSpreadFactors[i];
        const currentRadius = originalRadii[i] + spreadDist;

        posArray[i * 3] = Math.cos(currentAngle) * currentRadius;
        posArray[i * 3 + 1] = Math.sin(currentAngle) * currentRadius;
        // z는 초기값 그대로 유지
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // ==== 리사이즈 ====
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const aspect = w / h;
      if (aspect < 1) {
        camera.position.z = 5 / aspect;
      } else {
        camera.position.z = 5;
      }

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // ==== 클린업 ====
    let disposed = false;

    return () => {
      if (disposed) return;
      disposed = true;

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      try {
        container.removeChild(renderer.domElement);
      } catch {
        // 이미 제거된 경우 대비
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        background: "transparent",
      }}
    />
  );
};

export default RotatingRingParticles;
