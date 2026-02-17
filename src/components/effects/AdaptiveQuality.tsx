'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { useNavigationStore } from '@/stores/navigation';

export default function AdaptiveQuality() {
  const setQualityLevel = useNavigationStore((s) => s.setQualityLevel);

  return (
    <PerformanceMonitor
      onDecline={() => {
        const current = useNavigationStore.getState().qualityLevel;
        if (current === 'high') setQualityLevel('medium');
        else if (current === 'medium') setQualityLevel('low');
      }}
      onIncline={() => {
        const current = useNavigationStore.getState().qualityLevel;
        if (current === 'low') setQualityLevel('medium');
        else if (current === 'medium') setQualityLevel('high');
      }}
    />
  );
}
