'use client';

import { motion } from 'framer-motion';
import { useNavigationStore } from '@/stores/navigation';

export default function BackButton() {
  const returnToGalaxy = useNavigationStore((s) => s.returnToGalaxy);
  const isTransitioning = useNavigationStore((s) => s.isTransitioning);

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: 0.6, duration: 0.3 }}
      onClick={returnToGalaxy}
      disabled={isTransitioning}
      className="fixed top-6 left-6 z-50 glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm text-moon-white/80 hover:text-moon-white hover:bg-orchid/15 transition-all disabled:opacity-50 cursor-pointer glow-purple"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="tracking-wide">Voltar ao Cosmos</span>
    </motion.button>
  );
}
