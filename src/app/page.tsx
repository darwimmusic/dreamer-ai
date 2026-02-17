'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import SceneContent from '@/components/solar-system/SolarSystem';
import PostProcessing from '@/components/effects/PostProcessing';
import AdaptiveQuality from '@/components/effects/AdaptiveQuality';
import PlanetView from '@/components/navigation/PlanetView';
import PlanetSidebar from '@/components/navigation/PlanetSidebar';
import { CAMERA } from '@/lib/constants';
import { useNavigationStore } from '@/stores/navigation';

function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, #1a0030 0%, #0d0015 70%)' }}>
      <div className="relative animate-float">
        <div className="w-20 h-20 rounded-full border-2 border-orchid/20 border-t-rose-glow animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-rose-glow/60 animate-pulse" style={{ boxShadow: '0 0 20px rgba(232,121,184,0.5)' }} />
        </div>
      </div>
      <p className="mt-8 text-sm text-moon-white/40 tracking-[0.3em] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
        Alinhando os astros...
      </p>
    </div>
  );
}

function TitleOverlay() {
  const currentView = useNavigationStore((s) => s.currentView);
  const isGalaxy = currentView === 'GALAXY_VIEW';

  if (!isGalaxy) return null;

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center flex flex-col items-center">
      <Image
        src="/logo/logo-dreamer-ai.png"
        alt="DreamerAI Logo"
        width={64}
        height={64}
        className="mb-3 drop-shadow-[0_0_15px_rgba(224,176,255,0.4)]"
        priority
      />
      <h1
        className="text-3xl md:text-4xl font-bold tracking-[0.15em] text-moon-white/90 glow-text"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        DreamerAI
      </h1>
      <p className="text-xs text-lavender/40 tracking-[0.4em] mt-2 uppercase">
        Explore o Cosmos Interior
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="w-screen h-screen relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0030 0%, #0d0015 60%)' }}>
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{
            fov: CAMERA.fov,
            near: CAMERA.near,
            far: CAMERA.far,
            position: CAMERA.galaxyPosition,
          }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          className="!absolute inset-0"
        >
          <color attach="background" args={['#0d0015']} />
          <fog attach="fog" args={['#0d0015', 40, 100]} />
          <SceneContent />
          <PostProcessing />
          <AdaptiveQuality />
        </Canvas>
      </Suspense>

      <PlanetView />
      <PlanetSidebar />
      <TitleOverlay />
    </main>
  );
}
