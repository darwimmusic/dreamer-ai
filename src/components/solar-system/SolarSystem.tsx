'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import Sun from './Sun';
import Planet from './Planet';
import OrbitRing from './OrbitRing';
import StarField from './StarField';
import { PLANETS, GALAXY_CAMERA_POSITION } from '@/lib/planets-data';
import { useNavigationStore } from '@/stores/navigation';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';

function SceneContent() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const planetRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  const { camera } = useThree();

  const {
    currentView,
    selectedPlanet,
    isTransitioning,
    selectPlanet,
    onZoomComplete,
    onReturnComplete,
  } = useNavigationStore();

  const { zoomToPlanet, returnToGalaxy: animateReturn } = useCameraAnimation();

  const isGalaxy = currentView === 'GALAXY_VIEW';
  const isInteractive = isGalaxy && !isTransitioning;

  // Track planet Object3D references each frame
  useFrame((state) => {
    PLANETS.forEach((planet) => {
      const group = state.scene.getObjectByName(`planet-orbit-${planet.id}`);
      if (group) {
        planetRefs.current.set(planet.id, group);
      }
    });
  });

  // Handle zoom transitions
  useEffect(() => {
    if (currentView === 'TRANSITIONING_TO_PLANET' && selectedPlanet) {
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
      const obj = planetRefs.current.get(selectedPlanet);
      if (obj) {
        const pos = obj.position;
        zoomToPlanet([pos.x, pos.y, pos.z], obj, onZoomComplete);
      }
    }

    if (currentView === 'TRANSITIONING_TO_GALAXY') {
      animateReturn(() => {
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
          controlsRef.current.target.set(0, 0, 0);
        }
        onReturnComplete();
      });
    }
  }, [currentView, selectedPlanet, zoomToPlanet, animateReturn, onZoomComplete, onReturnComplete]);

  // Set initial camera
  useEffect(() => {
    camera.position.set(...GALAXY_CAMERA_POSITION);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const handlePlanetClick = useCallback(
    (planetId: string) => {
      if (isInteractive) {
        selectPlanet(planetId);
      }
    },
    [isInteractive, selectPlanet]
  );

  return (
    <>
      <ambientLight intensity={0.6} color="#ffffff" />
      <Sun />
      <StarField />

      {PLANETS.map((planet) => (
        <group key={planet.id}>
          <Planet
            data={planet}
            onClick={handlePlanetClick}
            isSelected={selectedPlanet === planet.id}
            isInteractive={isInteractive}
          />
        </group>
      ))}

      {PLANETS.map((planet) => (
        <OrbitRing key={`orbit-${planet.id}`} radius={planet.orbitRadius} />
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
        autoRotate={isGalaxy}
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export default SceneContent;
