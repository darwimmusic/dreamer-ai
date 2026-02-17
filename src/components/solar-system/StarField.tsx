'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createFourPointStar(): THREE.Shape {
  const shape = new THREE.Shape();
  const outer = 0.12;
  const inner = 0.03;
  const points = 4;

  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

export default function StarField() {
  const groupRef = useRef<THREE.Group>(null);

  const stars = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number; opacity: number; twinkleSpeed: number }[] = [];
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 50 + Math.random() * 50;
      items.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        scale: 0.3 + Math.random() * 1.2,
        opacity: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.5 + Math.random() * 2,
      });
    }
    return items;
  }, []);

  const starShape = useMemo(() => createFourPointStar(), []);
  const starGeometry = useMemo(() => new THREE.ShapeGeometry(starShape), [starShape]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.00005;
    }
  });

  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <mesh
          key={i}
          position={star.pos}
          scale={star.scale}
          geometry={starGeometry}
        >
          <meshBasicMaterial
            color={i % 5 === 0 ? '#ffc8e6' : '#e0d0ff'}
            transparent
            opacity={star.opacity * (0.6 + Math.sin(Date.now() * 0.001 * star.twinkleSpeed + i) * 0.4)}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Additional tiny point particles for density */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[(() => {
              const arr = new Float32Array(1500 * 3);
              for (let i = 0; i < 1500; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 30 + Math.random() * 70;
                arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                arr[i * 3 + 2] = r * Math.cos(phi);
              }
              return arr;
            })(), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c4b5fd"
          size={0.08}
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
