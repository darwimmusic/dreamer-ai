'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNavigationStore } from '@/stores/navigation';

export default function PostProcessing() {
  const qualityLevel = useNavigationStore((s) => s.qualityLevel);

  if (qualityLevel === 'low') return null;

  if (qualityLevel === 'high') {
    return (
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          intensity={2}
          mipmapBlur
        />
        <Vignette offset={0.25} darkness={0.8} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
        intensity={1.2}
        mipmapBlur
      />
    </EffectComposer>
  );
}
