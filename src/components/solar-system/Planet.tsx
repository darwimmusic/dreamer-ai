'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { PlanetData } from '@/lib/planets-data';

interface PlanetProps {
  data: PlanetData;
  onClick: (id: string) => void;
  isSelected: boolean;
  isInteractive: boolean;
}

/* ── Textured sphere: uses useLoader (suspends until texture is ready) ── */
function TexturedSphere({ texturePath, size, hovered, onClick, onPointerOver, onPointerOut }: {
  texturePath: string;
  size: number;
  hovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, texturePath);
  const scale = hovered ? 1.25 : 1;

  // Configure texture once on mount
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      scale={[scale, scale, scale]}
    >
      <sphereGeometry args={[size, 64, 64]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

/* ── Solid-color fallback sphere ── */
function SolidSphere({ color, size, hovered, onClick, onPointerOver, onPointerOut }: {
  color: string;
  size: number;
  hovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = hovered ? 1.25 : 1;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      scale={[scale, scale, scale]}
    >
      <sphereGeometry args={[size, 64, 64]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

/* ── Main Planet component ── */
export default function Planet({ data, onClick, isSelected, isInteractive }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(data.initialAngle);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    angleRef.current += data.orbitSpeed * delta;

    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * data.orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * data.orbitRadius;
    }
  });

  const handlePointerOver = useCallback(() => {
    if (!isInteractive) return;
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, [isInteractive]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const handleClick = useCallback(() => {
    if (!isInteractive) return;
    onClick(data.id);
  }, [isInteractive, onClick, data.id]);

  const sphereProps = {
    size: data.size,
    hovered,
    onClick: handleClick,
    onPointerOver: handlePointerOver,
    onPointerOut: handlePointerOut,
  };

  return (
    <group ref={groupRef} name={`planet-orbit-${data.id}`}>
      {/* Textured planet with Suspense → falls back to solid color while loading */}
      {data.texture ? (
        <Suspense fallback={<SolidSphere color={data.color} {...sphereProps} />}>
          <TexturedSphere texturePath={data.texture} {...sphereProps} />
        </Suspense>
      ) : (
        <SolidSphere color={data.color} {...sphereProps} />
      )}

      {/* Subtle glow ring on hover */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.size * 1.4, data.size * 1.8, 32]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {hovered && !isSelected && (
        <Html
          position={[0, data.size + 1, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="whitespace-nowrap text-center px-5 py-3 rounded-2xl"
            style={{
              background: 'rgba(26, 11, 46, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(224, 176, 255, 0.15)',
              boxShadow: '0 0 24px rgba(224, 176, 255, 0.15)',
            }}
          >
            <p className="text-sm font-bold text-moon-white" style={{ fontFamily: 'var(--font-display)' }}>{data.name}</p>
            <p className="text-xs mt-1" style={{ color: '#9D7AC1' }}>{data.label}</p>
            <p className="text-[10px] mt-1 text-moon-white/25 max-w-[180px] leading-relaxed">{data.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
