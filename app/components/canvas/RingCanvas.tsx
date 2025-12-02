"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const RotatingRingParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5.9;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    containerRef.current.appendChild(renderer.domElement);

    // Particle system
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
      spreadDistances[i] = 0.5 + Math.random() * 2.0; // 0.5 ~ 2.5 범위로 큰 차이
      spreadSpeeds[i] = 0.03 + Math.random() * 0.1;
      spreadAngles[i] = (Math.random() - 0.5) * 1.0; // 각도 변화도 증가

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

    // Mouse tracking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isMouseInside = false;

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = (event.clientX / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current = { x: mouse.x, y: mouse.y };

      raycaster.setFromCamera(mouse, camera);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(
        new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
        intersectPoint,
      );

      const distanceFromCenter = Math.sqrt(
        intersectPoint.x ** 2 + intersectPoint.y ** 2,
      );

      isMouseInside =
        distanceFromCenter < ringRadius + 1.5 &&
        distanceFromCenter > ringRadius - ringThickness - 1.5;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Animation with smooth transition
    let time = 0;
    const currentSpreadFactors = new Float32Array(particleCount).fill(0);

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      const positions = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Individual smooth transition for each particle
        const targetSpreadFactor = isMouseInside ? 1 : 0;
        const individualSpeed = spreadSpeeds[i];
        currentSpreadFactors[i] +=
          (targetSpreadFactor - currentSpreadFactors[i]) * individualSpeed;

        const speed = rotationSpeeds[i];
        const angleOffset = spreadAngles[i] * currentSpreadFactors[i];
        const currentAngle = originalAngles[i] + time * speed + angleOffset;
        const spreadDist = spreadDistances[i] * currentSpreadFactors[i];
        const currentRadius = originalRadii[i] + spreadDist;

        positions[i * 3] = Math.cos(currentAngle) * currentRadius;
        positions[i * 3 + 1] = Math.sin(currentAngle) * currentRadius;
      }

      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // 화면 비율에 맞춰 카메라 거리 조정
      const aspect = width / height;
      if (aspect < 1) {
        // 세로가 더 긴 경우 (모바일 등)
        camera.position.z = 5 / aspect;
      } else {
        camera.position.z = 5;
      }

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
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
