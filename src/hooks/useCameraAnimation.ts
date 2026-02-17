'use client';

import { useCallback, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { GALAXY_CAMERA_POSITION } from '@/lib/planets-data';
import { ANIMATION } from '@/lib/constants';

export function useCameraAnimation() {
  const { camera } = useThree();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Track the planet we're following — stores a reference to its Object3D
  const followTargetRef = useRef<THREE.Object3D | null>(null);
  const isFollowingRef = useRef(false);

  // Camera offset values — planet centered in LEFT 50% of screen
  // Panel takes right 50%, so we shift camera so planet sits at ~25% from left
  const camDistance = 3.5;
  const rightOffset = 6;   // Push camera right so planet appears centered in left half
  const camY = 2;

  // Each frame, if following a planet, move camera to track it
  useFrame(() => {
    if (!isFollowingRef.current || !followTargetRef.current) return;

    const target = followTargetRef.current;
    const px = target.position.x;
    const pz = target.position.z;

    const angle = Math.atan2(pz, px);
    const desiredX = px + Math.cos(angle) * camDistance + rightOffset * Math.cos(angle + Math.PI / 2);
    const desiredZ = pz + Math.sin(angle) * camDistance + rightOffset * Math.sin(angle + Math.PI / 2);

    // Smooth follow with lerp
    camera.position.x += (desiredX - camera.position.x) * 0.06;
    camera.position.z += (desiredZ - camera.position.z) * 0.06;
    camera.position.y += (camY - camera.position.y) * 0.06;

    // Camera looks at a point shifted LEFT of planet so planet appears centered in the 50% area
    const lookShift = rightOffset * 0.3;
    const lookAtX = px - lookShift * Math.cos(angle + Math.PI / 2);
    const lookAtZ = pz - lookShift * Math.sin(angle + Math.PI / 2);
    camera.lookAt(lookAtX, 0, lookAtZ);
  });

  const zoomToPlanet = useCallback(
    (planetPosition: [number, number, number], planetObject: THREE.Object3D | null, onComplete: () => void) => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const [px, , pz] = planetPosition;

      const angle = Math.atan2(pz, px);
      const targetX = px + Math.cos(angle) * camDistance + rightOffset * Math.cos(angle + Math.PI / 2);
      const targetZ = pz + Math.sin(angle) * camDistance + rightOffset * Math.sin(angle + Math.PI / 2);

      const lookShift = rightOffset * 0.3;
      const lookAtX = px - lookShift * Math.cos(angle + Math.PI / 2);
      const lookAtZ = pz - lookShift * Math.sin(angle + Math.PI / 2);

      const tl = gsap.timeline({
        onComplete: () => {
          // After zoom animation, start following the planet each frame
          followTargetRef.current = planetObject;
          isFollowingRef.current = true;
          onComplete();
        },
      });

      tl.to(camera.position, {
        x: targetX,
        y: camY,
        z: targetZ,
        duration: ANIMATION.zoomDuration,
        ease: ANIMATION.zoomEase,
        onUpdate: () => {
          camera.lookAt(lookAtX, 0, lookAtZ);
        },
      });

      timelineRef.current = tl;
    },
    [camera, camDistance, rightOffset, camY]
  );

  const returnToGalaxy = useCallback(
    (onComplete: () => void) => {
      // Stop following
      isFollowingRef.current = false;
      followTargetRef.current = null;

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({ onComplete });

      tl.to(camera.position, {
        x: GALAXY_CAMERA_POSITION[0],
        y: GALAXY_CAMERA_POSITION[1],
        z: GALAXY_CAMERA_POSITION[2],
        duration: ANIMATION.zoomDuration,
        ease: ANIMATION.zoomEase,
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
      });

      timelineRef.current = tl;
    },
    [camera]
  );

  return { zoomToPlanet, returnToGalaxy };
}
