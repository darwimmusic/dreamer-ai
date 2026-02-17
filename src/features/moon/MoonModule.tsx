'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { glassCard, DS_COLORS, DS_EASING, createAccentStyles } from '@/lib/design-system';
import { MOON_RITUALS, ELEMENT_STYLES } from './moon-rituals';
import type { MoonRitual } from './moon-rituals';
import './moon-particles.css';

/* ─── Constants ─── */

const ACCENT = '#7c3aed';
const ACCENT_LIGHT = '#a78bfa';
const styles = createAccentStyles(ACCENT);

/* ─── Moon Phase Data ─── */

interface MoonPhase {
  name: string;
  symbol: string;
  illumination: number;
  meaning: string;
  energy: string;
  tips: string[];
}

const MOON_PHASES: MoonPhase[] = [
  {
    name: 'Lua Nova',
    symbol: '\uD83C\uDF11',
    illumination: 0,
    meaning: 'Novos comecos, intencoes, semear. Fase de introspecao e planejamento. A escuridao e o solo fertil onde novas possibilidades germinam.',
    energy: 'Introspeccao',
    tips: ['Defina intencoes para o ciclo', 'Medite sobre novos projetos', 'Limpe energias do ciclo anterior'],
  },
  {
    name: 'Crescente Inicial',
    symbol: '\uD83C\uDF12',
    illumination: 12.5,
    meaning: 'Esperanca, fe, determinacao. A energia comeca a crescer visivelmente. Cada pequena acao ganha momentum cosmico.',
    energy: 'Expansao',
    tips: ['Tome as primeiras acoes', 'Mantenha o foco nas intencoes', 'Cultive paciencia'],
  },
  {
    name: 'Quarto Crescente',
    symbol: '\uD83C\uDF13',
    illumination: 25,
    meaning: 'Acao, desafios, compromisso. Momento de superar obstaculos com determinacao. A metade iluminada exige escolhas claras.',
    energy: 'Determinacao',
    tips: ['Enfrente desafios de frente', 'Tome decisoes importantes', 'Ajuste planos se necessario'],
  },
  {
    name: 'Crescente Gibosa',
    symbol: '\uD83C\uDF14',
    illumination: 37.5,
    meaning: 'Refinamento, analise, ajuste fino. A plenitude se aproxima — prepare-se para colher o que plantou.',
    energy: 'Refinamento',
    tips: ['Refine seus projetos', 'Resolva detalhes pendentes', 'Confie no processo'],
  },
  {
    name: 'Lua Cheia',
    symbol: '\uD83C\uDF15',
    illumination: 50,
    meaning: 'Plenitude, realizacao, gratidao profunda. A lua ilumina tudo — verdades, conquistas e o que precisa ser liberado.',
    energy: 'Plenitude',
    tips: ['Celebre conquistas', 'Pratique gratidao', 'Libere o que nao serve mais'],
  },
  {
    name: 'Minguante Gibosa',
    symbol: '\uD83C\uDF16',
    illumination: 62.5,
    meaning: 'Compartilhamento, ensino, generosidade. A luz que diminui convida voce a iluminar outros com sua sabedoria.',
    energy: 'Generosidade',
    tips: ['Compartilhe conhecimento', 'Ajude outros', 'Reflita sobre aprendizados'],
  },
  {
    name: 'Quarto Minguante',
    symbol: '\uD83C\uDF17',
    illumination: 75,
    meaning: 'Liberacao, perdao, desapego consciente. Deixe ir com graca o que ja cumpriu seu proposito.',
    energy: 'Liberacao',
    tips: ['Perdoe e libere', 'Descarte o desnecessario', 'Simplifique sua vida'],
  },
  {
    name: 'Minguante Final',
    symbol: '\uD83C\uDF18',
    illumination: 87.5,
    meaning: 'Repouso sagrado, rendição, preparacao para o novo. O silencio antes do renascimento e tao importante quanto a acao.',
    energy: 'Repouso',
    tips: ['Descanse corpo e mente', 'Reflita sobre o ciclo', 'Prepare-se para o novo'],
  },
];

/* ─── Moon Phase Calculation ─── */

function getMoonPhaseIndex(date: Date): number {
  const known = new Date(2000, 0, 6, 18, 14);
  const synodic = 29.53058770576;
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = diff / synodic;
  const phase = (cycle - Math.floor(cycle)) * 8;
  return Math.floor(phase) % 8;
}

function getMonthPhases(year: number, month: number): { day: number; phase: number }[] {
  const days = new Date(year, month + 1, 0).getDate();
  const result: { day: number; phase: number }[] = [];
  for (let d = 1; d <= days; d++) {
    result.push({ day: d, phase: getMoonPhaseIndex(new Date(year, month, d)) });
  }
  return result;
}

/* ─── Illumination percentage for visual ─── */

function getIlluminationPercent(phaseIndex: number): number {
  const map = [0, 25, 50, 75, 100, 75, 50, 25];
  return map[phaseIndex];
}

/* ─── Sub-Components ─── */

function SectionDivider({ title, icon }: { title: string; icon?: string }) {
  return (
    <div className="flex items-center gap-3" style={{ marginTop: 52, marginBottom: 52 }}>
      <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
      <span
        className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2"
        style={{ color: DS_COLORS.primaryText, fontFamily: 'var(--font-display)' }}
      >
        {icon && <span>{icon}</span>}
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
    </div>
  );
}

/* ─── Moon Emoji Map ─── */

const MOON_EMOJIS = ['\uD83C\uDF11', '\uD83C\uDF12', '\uD83C\uDF13', '\uD83C\uDF14', '\uD83C\uDF15', '\uD83C\uDF16', '\uD83C\uDF17', '\uD83C\uDF18'];

/* ─── Moon Visual Component ─── */

function MoonVisual({ phaseIndex }: { phaseIndex: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${ACCENT}25 0%, ${ACCENT_LIGHT}10 40%, transparent 70%)`,
          filter: 'blur(16px)',
          transform: 'scale(1.5)',
        }}
      />
      {/* Emoji */}
      <span className="relative text-[100px] leading-none" style={{ filter: `drop-shadow(0 0 20px ${ACCENT}40)` }}>
        {MOON_EMOJIS[phaseIndex]}
      </span>
    </div>
  );
}

/* ─── Calendar Day Cell ─── */

function CalendarDay({
  day,
  phase,
  isToday,
  phaseSymbol,
}: {
  day: number;
  phase: number;
  isToday: boolean;
  phaseSymbol: string;
}) {
  return (
    <div
      className="text-center py-1.5 px-0.5 rounded-lg transition-all duration-200"
      style={
        isToday
          ? {
              background: `${ACCENT}15`,
              border: `1px solid ${ACCENT}40`,
              boxShadow: `0 0 12px ${ACCENT}15`,
            }
          : { border: '1px solid transparent' }
      }
    >
      <span
        className="text-[11px] block leading-none"
        style={{ color: isToday ? ACCENT_LIGHT : `${DS_COLORS.primaryText}60` }}
      >
        {phaseSymbol}
      </span>
      <span
        className="text-xs block mt-0.5"
        style={{
          color: isToday ? 'white' : `${DS_COLORS.primaryText}60`,
          fontWeight: isToday ? 700 : 400,
        }}
      >
        {day}
      </span>
    </div>
  );
}

/* ─── Phase Cycle Card ─── */

function PhaseCycleCard({
  phase,
  index,
  isActive,
  onClick,
}: {
  phase: MoonPhase;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      style={
        isActive
          ? {
              background: `linear-gradient(135deg, ${ACCENT}15, rgba(26, 11, 46, 0.7))`,
              border: `1px solid ${ACCENT}40`,
              boxShadow: `0 0 16px ${ACCENT}20`,
            }
          : { ...glassCard, border: `1px solid ${ACCENT}10` }
      }
    >
      <span
        className="text-2xl leading-none"
        style={{ color: isActive ? ACCENT_LIGHT : `${DS_COLORS.primaryText}50` }}
      >
        {phase.symbol}
      </span>
      <span
        className="text-[11px] font-semibold text-center leading-tight"
        style={{ color: isActive ? 'white' : `${DS_COLORS.primaryText}70` }}
      >
        {phase.name}
      </span>
    </button>
  );
}

/* ─── Ritual Step Card ─── */

function RitualStep({ step, isLast }: { step: { step: number; title: string; description: string }; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      {/* Step line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: `${ACCENT}15`,
            border: `1px solid ${ACCENT}30`,
            color: ACCENT_LIGHT,
          }}
        >
          {step.step}
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-2" style={{ background: `${ACCENT}15` }} />
        )}
      </div>
      {/* Content */}
      <div className="pb-6">
        <h5 className="text-base font-bold mb-1" style={{ color: 'white', fontFamily: 'var(--font-display)' }}>
          {step.title}
        </h5>
        <p className="text-base leading-[1.75]" style={{ color: DS_COLORS.bodyText }}>
          {step.description}
        </p>
      </div>
    </div>
  );
}

/* ─── Ritual Detail Panel ─── */

function RitualDetail({ ritual }: { ritual: MoonRitual }) {
  const elementStyle = ELEMENT_STYLES[ritual.element];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={styles.detailCard()}
    >
      <div className="p-7 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: elementStyle.bg,
                color: elementStyle.color,
                border: `1px solid ${elementStyle.color}25`,
              }}
            >
              {ritual.elementIcon} {ritual.element}
            </span>
            <span className="text-xs" style={{ color: `${DS_COLORS.primaryText}50` }}>
              {ritual.duration}
            </span>
            <span className="text-xs" style={{ color: `${DS_COLORS.primaryText}50` }}>
              {ritual.bestTime}
            </span>
          </div>
          <h4 className="text-2xl font-bold" style={{ color: ACCENT_LIGHT, fontFamily: 'var(--font-display)' }}>
            {ritual.ritualName}
          </h4>
          <p className="text-lg leading-[1.85] mt-1" style={{ color: DS_COLORS.bodyText }}>
            {ritual.intention}
          </p>
        </div>

        {/* Materials */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(26, 11, 46, 0.4)', border: `1px solid ${DS_COLORS.divider}` }}
        >
          <span className="text-sm font-bold uppercase tracking-widest block mb-2" style={{ color: DS_COLORS.primaryText }}>
            Materiais
          </span>
          <div className="flex flex-wrap gap-2">
            {ritual.materials.map((m) => (
              <span
                key={m}
                className="text-sm rounded-full px-3 py-1"
                style={{ ...glassCard, color: `${DS_COLORS.primaryText}80` }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest block mb-4" style={{ color: DS_COLORS.primaryText }}>
            Passo a Passo
          </span>
          {ritual.steps.map((step, i) => (
            <RitualStep key={step.step} step={step} isLast={i === ritual.steps.length - 1} />
          ))}
        </div>

        {/* Affirmation */}
        <div
          className="rounded-xl p-5"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}10, ${ACCENT_LIGHT}06)`,
            border: `1px solid ${ACCENT}25`,
          }}
        >
          <span className="text-sm font-bold uppercase tracking-widest block mb-2" style={{ color: ACCENT_LIGHT }}>
            Afirmacao
          </span>
          <p className="text-lg leading-[1.85] italic" style={{ color: DS_COLORS.bodyText }}>
            &ldquo;{ritual.affirmation}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Module ─── */

export default function MoonModule() {
  const today = new Date();
  const currentPhaseIdx = getMoonPhaseIndex(today);
  const currentPhase = MOON_PHASES[currentPhaseIdx];
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number | null>(null);
  const [selectedRitualIdx, setSelectedRitualIdx] = useState<number>(currentPhaseIdx);

  const monthData = useMemo(
    () => getMonthPhases(today.getFullYear(), today.getMonth()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const monthName = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const PHASE_SYMBOLS = ['\uD83C\uDF11', '\uD83C\uDF12', '\uD83C\uDF13', '\uD83C\uDF14', '\uD83C\uDF15', '\uD83C\uDF16', '\uD83C\uDF17', '\uD83C\uDF18'];
  const DAY_HEADERS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ═══════════════════════════════════════════════
          SECTION 1: Fase Atual
          ═══════════════════════════════════════════════ */}

      <SectionDivider title="Fase Atual" icon="&#x263D;" />

      <div className="rounded-2xl p-8 pb-10" style={glassCard}>
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Large moon visual */}
          <MoonVisual phaseIndex={currentPhaseIdx} />

          {/* Phase name */}
          <div>
            <h3
              className="text-3xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: ACCENT_LIGHT }}
            >
              {currentPhase.name}
            </h3>
            <span
              className="text-sm font-bold uppercase tracking-widest mt-1 inline-block"
              style={{ color: `${DS_COLORS.primaryText}60` }}
            >
              {currentPhase.energy}
            </span>
          </div>

          {/* Meaning */}
          <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
            {currentPhase.meaning}
          </p>

          {/* Tips */}
          <div className="w-full space-y-2 pt-2">
            {currentPhase.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5"
                style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}10` }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}25` }}
                >
                  <span className="text-[10px]" style={{ color: ACCENT_LIGHT }}>&#x2713;</span>
                </div>
                <p className="text-base leading-snug" style={{ color: DS_COLORS.bodyText }}>{tip}</p>
              </div>
            ))}
          </div>

          {/* Illumination bar */}
          <div
            className="w-full rounded-xl px-4 py-3 mt-2"
            style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}10` }}
          >
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: `${DS_COLORS.primaryText}50` }}>Nova</span>
              <span className="text-xs font-medium" style={{ color: `${DS_COLORS.primaryText}50` }}>Cheia</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: `${ACCENT}10` }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getIlluminationPercent(currentPhaseIdx)}%` }}
                transition={{ duration: 1.2, ease: DS_EASING }}
                style={{
                  background: `linear-gradient(90deg, ${ACCENT}60, ${ACCENT_LIGHT})`,
                  boxShadow: `0 0 8px ${ACCENT}40`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 2: Calendario Lunar
          ═══════════════════════════════════════════════ */}

      <SectionDivider title="Calendario Lunar" icon="&#x2637;" />

      <div className="space-y-5">
        {/* Month calendar */}
        <div
          className="rounded-2xl p-6"
          style={glassCard}
        >
          {/* Month name */}
          <h4
            className="text-lg font-bold uppercase tracking-widest capitalize mb-4"
            style={{ color: DS_COLORS.primaryText, fontFamily: 'var(--font-display)' }}
          >
            {monthName}
          </h4>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_HEADERS.map((d, i) => (
              <div
                key={i}
                className="text-center text-xs font-bold uppercase tracking-wider py-1"
                style={{ color: `${ACCENT_LIGHT}50` }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Divider line */}
          <div className="h-px mb-2" style={{ background: `${ACCENT}15` }} />

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {monthData.map(({ day, phase }) => (
              <CalendarDay
                key={day}
                day={day}
                phase={phase}
                isToday={day === today.getDate()}
                phaseSymbol={PHASE_SYMBOLS[phase]}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="h-px mt-4 mb-3" style={{ background: `${ACCENT}10` }} />
          <div className="flex flex-wrap gap-3 justify-center">
            {MOON_PHASES.filter((_, i) => i % 2 === 0).map((phase, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-sm" style={{ color: `${DS_COLORS.primaryText}40` }}>
                  {phase.symbol}
                </span>
                <span className="text-[10px] font-medium" style={{ color: `${DS_COLORS.primaryText}40` }}>
                  {phase.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* All phases cycle */}
        <div className="grid grid-cols-4 gap-2">
          {MOON_PHASES.map((phase, i) => (
            <PhaseCycleCard
              key={i}
              phase={phase}
              index={i}
              isActive={i === currentPhaseIdx}
              onClick={() => setSelectedPhaseIdx(selectedPhaseIdx === i ? null : i)}
            />
          ))}
        </div>

        {/* Selected phase detail */}
        <AnimatePresence>
          {selectedPhaseIdx !== null && (
            <motion.div
              key={selectedPhaseIdx}
              initial={{ opacity: 0, y: 12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.3, ease: DS_EASING }}
              className="rounded-2xl p-6 overflow-hidden"
              style={styles.detailCard()}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl" style={{ color: ACCENT_LIGHT }}>
                  {MOON_PHASES[selectedPhaseIdx].symbol}
                </span>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: ACCENT_LIGHT, fontFamily: 'var(--font-display)' }}>
                    {MOON_PHASES[selectedPhaseIdx].name}
                  </h4>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: `${DS_COLORS.primaryText}50` }}>
                    {MOON_PHASES[selectedPhaseIdx].energy}
                  </span>
                </div>
              </div>
              <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
                {MOON_PHASES[selectedPhaseIdx].meaning}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 3: Rituais Lunares
          ═══════════════════════════════════════════════ */}

      <SectionDivider title="Ritual da Fase" icon="&#x2727;" />

      {(() => {
        const activeRitual = MOON_RITUALS[selectedRitualIdx];
        return (
          <div className="moon-particles-container rounded-2xl" style={{ background: `rgba(26, 11, 46, 0.2)`, border: `1px solid ${DS_COLORS.divider}` }}>
            {/* Particles */}
            <div className="moon-particle moon-particle-1" />
            <div className="moon-particle moon-particle-2" />
            <div className="moon-particle moon-particle-3" />
            <div className="moon-particle moon-particle-4" />
            <div className="moon-particle moon-particle-5" />
            <div className="moon-particle moon-particle-6" />
            <div className="moon-particle moon-particle-7" />
            <div className="moon-particle moon-particle-8" />

            <div className="relative z-10 p-6 space-y-5">
              {/* Ritual selector grid */}
              <div>
                <div className="grid grid-cols-4 gap-2">
                  {MOON_RITUALS.map((ritual, i) => {
                    const isSelected = i === selectedRitualIdx;
                    const isCurrent = i === currentPhaseIdx;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedRitualIdx(i)}
                        className="rounded-xl p-2.5 flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        style={
                          isSelected
                            ? {
                                background: `linear-gradient(135deg, ${ACCENT}18, rgba(26, 11, 46, 0.7))`,
                                border: `1px solid ${ACCENT}40`,
                                boxShadow: `0 0 12px ${ACCENT}20`,
                              }
                            : { ...glassCard, border: `1px solid ${ACCENT}08` }
                        }
                      >
                        <span className="text-lg">{ritual.elementIcon}</span>
                        <span
                          className="text-[10px] font-semibold text-center leading-tight"
                          style={{ color: isSelected ? ACCENT_LIGHT : `${DS_COLORS.primaryText}50` }}
                        >
                          {MOON_PHASES[i].name}
                        </span>
                        {isCurrent && (
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{ background: ACCENT_LIGHT }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Intro card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRitualIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: DS_EASING }}
                  className="text-center space-y-3"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                    style={styles.iconBox()}
                  >
                    <span className="text-2xl">{activeRitual.elementIcon}</span>
                  </div>
                  <h4
                    className="text-2xl font-bold"
                    style={{ color: ACCENT_LIGHT, fontFamily: 'var(--font-display)' }}
                  >
                    {activeRitual.ritualName}
                  </h4>
                  <p className="text-sm font-bold uppercase tracking-widest" style={{ color: `${DS_COLORS.primaryText}50` }}>
                    Para a fase: {activeRitual.phaseName}
                    {selectedRitualIdx === currentPhaseIdx && (
                      <span style={{ color: ACCENT_LIGHT }}> (fase atual)</span>
                    )}
                  </p>
                  <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
                    {activeRitual.intention}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Full ritual detail */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`ritual-${selectedRitualIdx}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: DS_EASING }}
                >
                  <RitualDetail ritual={activeRitual} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        );
      })()}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
