'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface OrbitRingProps {
  radius: number;
}

export default function OrbitRing({ radius }: OrbitRingProps) {
  const ref = useRef<THREE.Line>(null);

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#9333ea', transparent: true, opacity: 0.06 }),
    []
  );

  const lineObj = useMemo(() => {
    return new THREE.Line(geometry, material);
  }, [geometry, material]);

  return <primitive ref={ref} object={lineObj} />;
}
