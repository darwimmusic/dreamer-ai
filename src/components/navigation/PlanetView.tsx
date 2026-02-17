'use client';

import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '@/stores/navigation';
import { PLANETS } from '@/lib/planets-data';
import type { PlanetFeature, PlanetData } from '@/lib/planets-data';
import { glassCard, DS_COLORS } from '@/lib/design-system';

const HoroscopeModule = lazy(() => import('@/features/horoscope/HoroscopeModule'));
const NatalChartModule = lazy(() => import('@/features/natal-chart/NatalChartModule'));
const TarotModule = lazy(() => import('@/features/tarot/TarotModule'));
const DreamsModule = lazy(() => import('@/features/dreams/DreamsModule'));
const CompatibilityModule = lazy(() => import('@/features/compatibility/CompatibilityModule'));
const MoonModule = lazy(() => import('@/features/moon/MoonModule'));
const MeditationModule = lazy(() => import('@/features/meditation/MeditationModule'));

const FEATURE_MAP: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  mercury: HoroscopeModule,
  venus: NatalChartModule,
  mars: TarotModule,
  jupiter: DreamsModule,
  saturn: CompatibilityModule,
  moon: MoonModule,
  neptune: MeditationModule,
};

/* ─── Loading ─── */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-transparent rounded-full animate-spin" style={{ borderTopColor: '#E0B0FF' }} />
        <p className="text-xs" style={{ color: `${DS_COLORS.primaryText}80` }}>Carregando...</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Feature Carousel Card
   ───────────────────────────────────────────────── */
function FeatureCarouselCard({
  feature,
  planet,
  isActive,
  onClick,
}: {
  feature: PlanetFeature;
  planet: PlanetData;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer group active:scale-[0.96] transition-all duration-200"
    >
      <div
        className="w-full h-[120px] rounded-3xl flex flex-col items-center justify-center gap-2.5 relative overflow-hidden transition-all duration-300"
        style={
          isActive
            ? {
                background: `linear-gradient(135deg, ${feature.gradient[0]}20, ${feature.gradient[1]}10)`,
                backdropFilter: 'blur(12px)',
                border: `1px solid ${feature.gradient[0]}40`,
                boxShadow: `0 0 24px ${feature.gradient[0]}20`,
              }
            : glassCard
        }
      >
        {/* Ghost icon bg */}
        <div className="absolute -right-1 -bottom-1 opacity-[0.06] text-5xl pointer-events-none">
          {feature.icon}
        </div>

        <span
          className={`text-4xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
        >
          {feature.icon}
        </span>
        <span
          className={`text-sm font-semibold text-center leading-tight px-2 transition-colors ${
            isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {feature.title}
        </span>

        {/* Active indicator dot */}
        {isActive && (
          <div
            className="absolute bottom-2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: feature.gradient[0] }}
          />
        )}
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────
   Main PlanetView — 60% right panel
   ───────────────────────────────────────────────── */
export default function PlanetView() {
  const { currentView, selectedPlanet } = useNavigationStore();
  const returnToGalaxy = useNavigationStore((s) => s.returnToGalaxy);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const showPanel = currentView === 'PLANET_VIEW' || currentView === 'TRANSITIONING_TO_GALAXY';
  const planet = PLANETS.find((p) => p.id === selectedPlanet);
  const FeatureComponent = selectedPlanet ? FEATURE_MAP[selectedPlanet] : null;

  const isUnifiedModule = selectedPlanet === 'mercury' || selectedPlanet === 'venus' || selectedPlanet === 'mars' || selectedPlanet === 'moon';

  const prevPlanetRef = useRef(selectedPlanet);
  useEffect(() => {
    if (prevPlanetRef.current !== selectedPlanet) {
      setActiveFeature(null);
      prevPlanetRef.current = selectedPlanet;
    }
  }, [selectedPlanet]);

  // Auto-select first feature when planet loads
  useEffect(() => {
    if (planet && !activeFeature) {
      setActiveFeature(planet.features[0]?.id ?? null);
    }
  }, [planet, activeFeature]);

  const activeFeatureData = planet?.features.find((f) => f.id === activeFeature);

  return (
    <AnimatePresence onExitComplete={() => setActiveFeature(null)}>
      {showPanel && planet && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 right-0 z-40 h-full flex flex-col"
          style={{
            width: '50vw',
            minWidth: '480px',
            background: 'linear-gradient(180deg, rgba(11, 4, 20, 0.94) 0%, rgba(11, 4, 20, 0.98) 100%)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderLeft: '1px solid rgba(224, 176, 255, 0.05)',
          }}
        >
          {/* ─── Sticky Header ─── */}
          <div
            className="shrink-0 px-10 pt-6 pb-4"
            style={{
              background: 'rgba(11, 4, 20, 0.8)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(224, 176, 255, 0.05)',
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-4">
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `${planet.accentColor}08`,
                      border: `1px solid ${planet.accentColor}15`,
                    }}
                  >
                    <Image
                      src={planet.icon}
                      alt={planet.name}
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h1
                      className="text-3xl font-bold tracking-wide uppercase"
                      style={{ fontFamily: 'var(--font-display)', color: '#E0B0FF' }}
                    >
                      {planet.name}
                    </h1>
                    <p className="text-lg font-medium tracking-tight" style={{ color: '#E0B0FF' }}>
                      {planet.label}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={returnToGalaxy}
                className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
                style={{
                  ...glassCard,
                  color: '#E0B0FF',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ─── Scrollable Content ─── */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="px-10 py-6 space-y-6">

              {/* ═══ Unified module (no feature cards) for planets with single-page modules ═══ */}
              {isUnifiedModule ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    {FeatureComponent && <FeatureComponent />}
                  </Suspense>
                </motion.div>
              ) : (
                <>
                  {/* ═══ SECTION 1: Feature Carousel ═══ */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold flex items-center gap-2 uppercase tracking-widest" style={{ color: DS_COLORS.primaryText }}>
                        <span style={{ color: '#E0B0FF' }}>&#x2726;</span>
                        Funcoes
                      </h2>
                      <span className="text-sm font-medium" style={{ color: `${DS_COLORS.primaryText}80` }}>
                        {planet.features.length} disponivel
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {planet.features.map((feature) => (
                        <FeatureCarouselCard
                          key={feature.id}
                          feature={feature}
                          planet={planet}
                          isActive={activeFeature === feature.id}
                          onClick={() => setActiveFeature(feature.id)}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* ═══ SECTION 2: Details ═══ */}
                  <AnimatePresence mode="wait">
                    {activeFeature && activeFeatureData && (
                      <motion.div
                        key={activeFeature}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div
                          className="p-7 rounded-3xl relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${activeFeatureData.gradient[0]}10, rgba(26, 11, 46, 0.6))`,
                            backdropFilter: 'blur(12px)',
                            border: `1px solid ${activeFeatureData.gradient[0]}20`,
                          }}
                        >
                          <div className="absolute -right-3 -top-3 opacity-[0.05] text-7xl pointer-events-none">
                            {activeFeatureData.icon}
                          </div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-sm font-bold py-1 px-3 rounded-full uppercase tracking-wider"
                                  style={{
                                    background: `${activeFeatureData.gradient[0]}15`,
                                    color: activeFeatureData.gradient[1],
                                    border: `1px solid ${activeFeatureData.gradient[0]}25`,
                                  }}
                                >
                                  {planet.name}
                                </span>
                                <span className="text-base" style={{ color: DS_COLORS.primaryText }}>{planet.label}</span>
                              </div>
                              <h3 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                {activeFeatureData.title}
                              </h3>
                            </div>
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ml-3"
                              style={{
                                background: `${activeFeatureData.gradient[0]}10`,
                                border: `1px solid ${activeFeatureData.gradient[0]}20`,
                              }}
                            >
                              {activeFeatureData.icon}
                            </div>
                          </div>
                          <p className="text-lg leading-relaxed mb-4" style={{ color: DS_COLORS.primaryText }}>
                            {activeFeatureData.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm font-medium" style={{ color: `${DS_COLORS.primaryText}55` }}>
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeFeatureData.gradient[0] }} />
                              Explorar
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeFeatureData.gradient[1] }} />
                              Interativo
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ═══ SECTION 3: Module Content ═══ */}
                  <AnimatePresence mode="wait">
                    {activeFeature && (
                      <motion.div
                        key={`module-${activeFeature}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
                          <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: `${DS_COLORS.primaryText}60` }}>
                            Detalhes & Dados
                          </span>
                          <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
                        </div>
                        <div
                          className="rounded-3xl overflow-hidden"
                          style={{
                            background: 'rgba(26, 11, 46, 0.4)',
                            border: '1px solid rgba(224, 176, 255, 0.06)',
                          }}
                        >
                          <div className="p-7">
                            <Suspense fallback={<LoadingFallback />}>
                              {FeatureComponent && <FeatureComponent />}
                            </Suspense>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Bottom spacing for scroll */}
              <div className="h-6" />
            </div>
          </div>

          {/* ─── Bottom Nav ─── */}
          <nav
            className="shrink-0 px-10 flex items-center justify-between h-16"
            style={{
              background: 'rgba(26, 11, 46, 0.6)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(224, 176, 255, 0.08)',
              borderTopLeftRadius: '1.5rem',
              borderTopRightRadius: '1.5rem',
            }}
          >
            <button onClick={returnToGalaxy} className="flex flex-col items-center gap-0.5 cursor-pointer group">
              <svg className="w-5 h-5 transition-colors" style={{ color: '#E0B0FF' }} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 8.5L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#E0B0FF' }}>
                Cosmos
              </span>
            </button>

            <button className="flex flex-col items-center gap-0.5 cursor-pointer group">
              <svg className="w-5 h-5 transition-colors" style={{ color: `${DS_COLORS.primaryText}60` }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: `${DS_COLORS.primaryText}60` }}>
                Explorar
              </span>
            </button>

            <button className="flex flex-col items-center gap-0.5 cursor-pointer group">
              <svg className="w-5 h-5 transition-colors" style={{ color: `${DS_COLORS.primaryText}60` }} viewBox="0 0 24 24" fill="none">
                <path d="M12 3C7.5 3 3.5 7 3.5 11.5C3.5 16 12 21 12 21C12 21 20.5 16 20.5 11.5C20.5 7 16.5 3 12 3Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: `${DS_COLORS.primaryText}60` }}>
                Journal
              </span>
            </button>

            <button className="flex flex-col items-center gap-0.5 cursor-pointer group">
              <svg className="w-5 h-5 transition-colors" style={{ color: `${DS_COLORS.primaryText}60` }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: `${DS_COLORS.primaryText}60` }}>
                Config
              </span>
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
