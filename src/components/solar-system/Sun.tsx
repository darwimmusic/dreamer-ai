'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.0008) * 0.05;
      glowRef.current.scale.setScalar(pulse);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(Date.now() * 0.001) * 0.4;
    }
  });

  return (
    <group>
      {/* Core sun */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#f0abcf"
          emissive="#e879b8"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Primary light — warm white to preserve texture colors */}
      <pointLight
        ref={lightRef}
        color="#fff0f5"
        intensity={3}
        distance={80}
        decay={2}
      />
      {/* Secondary fill — soft lavender */}
      <pointLight
        color="#e8d5f5"
        intensity={1}
        distance={100}
        decay={2}
      />
    </group>
  );
}
