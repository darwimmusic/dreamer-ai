'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '@/stores/navigation';
import { PLANETS } from '@/lib/planets-data';

export default function PlanetSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentView, selectedPlanet, selectPlanet, switchPlanet } = useNavigationStore();

  const isGalaxy = currentView === 'GALAXY_VIEW';

  return (
    <>
      {/* Toggle tab — always visible on left edge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 cursor-pointer group"
        style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'translateX(88px)' : 'translateX(0)' }}
      >
        <div
          className="flex items-center justify-center w-6 h-16 rounded-r-xl transition-all"
          style={{
            background: 'rgba(26, 11, 46, 0.7)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(224, 176, 255, 0.1)',
            borderRight: '1px solid rgba(224, 176, 255, 0.1)',
            borderBottom: '1px solid rgba(224, 176, 255, 0.1)',
          }}
        >
          <svg
            className="w-3 h-3 text-white/40 group-hover:text-white/70 transition-all"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
            viewBox="0 0 16 16" fill="none"
          >
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -88 }}
            animate={{ x: 0 }}
            exit={{ x: -88 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 bottom-0 z-45 w-[88px] flex flex-col items-center py-6 gap-1"
            style={{
              background: 'rgba(11, 4, 20, 0.92)',
              backdropFilter: 'blur(24px)',
              borderRight: '1px solid rgba(224, 176, 255, 0.06)',
            }}
          >
            {/* Logo mark */}
            <div
              className="mb-3 w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(224, 176, 255, 0.08)', border: '1px solid rgba(224, 176, 255, 0.12)' }}
            >
              <Image
                src="/logo/logo-dreamer-ai.png"
                alt="DreamerAI"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>

            {/* Divider */}
            <div className="w-10 h-px mb-2" style={{ background: 'rgba(224, 176, 255, 0.08)' }} />

            {/* Planet icons with labels */}
            {PLANETS.map((planet) => {
              const isActive = selectedPlanet === planet.id && !isGalaxy;
              return (
                <button
                  key={planet.id}
                  onClick={() => {
                    if (isGalaxy) {
                      selectPlanet(planet.id);
                    } else {
                      switchPlanet(planet.id);
                    }
                    setIsOpen(false);
                  }}
                  className="group cursor-pointer relative flex flex-col items-center py-1"
                  title={`${planet.name} — ${planet.label}`}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isActive
                        ? `${planet.accentColor}10`
                        : 'rgba(26, 11, 46, 0.15)',
                      border: isActive
                        ? `1px solid ${planet.accentColor}40`
                        : '1px solid rgba(224, 176, 255, 0.06)',
                      boxShadow: isActive ? `0 0 12px ${planet.accentColor}25` : 'none',
                    }}
                  >
                    <Image
                      src={planet.icon}
                      alt={planet.name}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>

                  {/* Label */}
                  <span
                    className="text-[8px] font-semibold uppercase tracking-wider mt-1 text-center leading-tight w-full px-0.5 truncate"
                    style={{
                      color: isActive ? planet.accentColor : 'rgba(157, 122, 193, 0.45)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {planet.label.length > 10 ? planet.label.split(' ')[0] : planet.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ backgroundColor: planet.accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
