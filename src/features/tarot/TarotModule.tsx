'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import tarotCards from '@/data/tarot-cards.json';
import { glassCard, DS_COLORS, DS_EASING, createAccentStyles } from '@/lib/design-system';
import { generateReading } from './tarot-readings';
import type { TarotReading, DrawnCardInput } from './tarot-readings';
import './tarot-particles.css';

/* ─── Types ─── */

type TarotState = 'idle' | 'dealing' | 'drawing' | 'revealed';

interface DrawnCard {
  card: typeof tarotCards[number];
  reversed: boolean;
  position: string;
}

/* ─── Constants ─── */

const ACCENT = '#e879b8';
const ACCENT_DARK = '#c084fc';
const styles = createAccentStyles(ACCENT);

const DEAL_POSITIONS = [
  { x: -140, label: 'Passado' },
  { x: 0, label: 'Presente' },
  { x: 140, label: 'Futuro' },
];

const ENERGY_LABELS: Record<string, { label: string; color: string }> = {
  positive: { label: 'Energia Positiva', color: '#4ade80' },
  challenging: { label: 'Energia Desafiadora', color: '#f97316' },
  transformative: { label: 'Energia Transformadora', color: '#c084fc' },
};

/* ─── Utilities ─── */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Animation Variants ─── */

const dealVariants = {
  stacked: (i: number) => ({
    x: 0,
    y: -i * 4,
    rotate: -2 + i * 2,
    scale: 0.95,
    opacity: 1,
  }),
  dealt: (i: number) => ({
    x: DEAL_POSITIONS[i].x,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 80,
      damping: 18,
      delay: i * 0.5,
    },
  }),
};

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

function CardBack({ onClick, size = 'normal' }: { onClick?: () => void; size?: 'normal' | 'small' }) {
  const isSmall = size === 'small';
  return (
    <button
      onClick={onClick}
      className={`w-full h-full rounded-xl flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-[1.02] ${isSmall ? 'gap-1' : 'gap-2'}`}
      style={{
        background: `linear-gradient(135deg, ${ACCENT}15, rgba(26, 11, 46, 0.7))`,
        border: `1px solid ${ACCENT}30`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Arcane pattern */}
      <div
        className="rounded-lg flex items-center justify-center"
        style={{
          width: isSmall ? 32 : 48,
          height: isSmall ? 32 : 48,
          background: `${ACCENT}10`,
          border: `1px solid ${ACCENT}20`,
        }}
      >
        <svg width={isSmall ? 16 : 24} height={isSmall ? 16 : 24} viewBox="0 0 24 24" fill="none">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" stroke={ACCENT} strokeWidth="1" fill={`${ACCENT}15`} />
        </svg>
      </div>
      {!isSmall && (
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: `${DS_COLORS.primaryText}40` }}>
          Clique para revelar
        </span>
      )}
    </button>
  );
}

function CardFace({ card, reversed }: { card: typeof tarotCards[number]; reversed: boolean }) {
  return (
    <div
      className={`w-full h-full rounded-xl p-4 flex flex-col items-center justify-center gap-1 ${reversed ? 'rotate-180' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${ACCENT}12, rgba(26, 11, 46, 0.7))`,
        border: `1px solid ${ACCENT}40`,
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 20px ${ACCENT}15`,
      }}
    >
      {/* Ornament top */}
      <div className="w-8 h-px mb-1" style={{ background: `${ACCENT}40` }} />
      <span className="text-sm font-mono" style={{ color: `${DS_COLORS.primaryText}60` }}>
        {card.number}
      </span>
      <span
        className="text-lg font-bold text-center leading-tight"
        style={{ fontFamily: 'var(--font-display)', color: 'white' }}
      >
        {card.name}
      </span>
      {/* Ornament bottom */}
      <div className="w-8 h-px mt-1" style={{ background: `${ACCENT}40` }} />
      {reversed && (
        <span className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: `${ACCENT}80` }}>
          Invertida
        </span>
      )}
    </div>
  );
}

function CardInterpretation({ drawn, reading, position }: { drawn: DrawnCard; reading: TarotReading; position: 'past' | 'present' | 'future' }) {
  const insightMap = { past: reading.pastInsight, present: reading.presentInsight, future: reading.futureInsight };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ duration: 0.3, ease: DS_EASING }}
      className="rounded-2xl p-6 space-y-3 overflow-hidden"
      style={styles.detailCard()}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold uppercase tracking-widest" style={{ color: DS_COLORS.primaryText }}>
          {drawn.position}
        </span>
        <h4 className="text-2xl font-bold" style={{ color: ACCENT, fontFamily: 'var(--font-display)' }}>
          {drawn.card.name} {drawn.reversed ? '(Invertida)' : ''}
        </h4>
      </div>
      <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
        {insightMap[position]}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {drawn.card.keywords.map((k) => (
          <span
            key={k}
            className="text-xs rounded-full px-2.5 py-0.5"
            style={{ ...glassCard, color: `${DS_COLORS.primaryText}80` }}
          >
            {k}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ReadingPanel({ reading, drawnCards }: { reading: TarotReading; drawnCards: DrawnCard[] }) {
  const energyInfo = ENERGY_LABELS[reading.energy];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ duration: 0.5, ease: DS_EASING }}
      className="rounded-2xl overflow-hidden"
      style={styles.detailCard()}
    >
      <div className="p-7 space-y-6">
        {/* Mini card icons */}
        <div className="flex items-center justify-center gap-4">
          {drawnCards.map((drawn, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}25`, color: ACCENT }}
              >
                {drawn.card.number}
              </div>
              <span className="text-sm font-medium" style={{ color: `${DS_COLORS.primaryText}70` }}>
                {drawn.card.name}
              </span>
              {i < 2 && (
                <span className="ml-2 text-xs" style={{ color: `${DS_COLORS.primaryText}30` }}>&#x2192;</span>
              )}
            </div>
          ))}
        </div>

        {/* Energy badge */}
        <div className="flex justify-center">
          <span
            className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{
              background: `${energyInfo.color}15`,
              color: energyInfo.color,
              border: `1px solid ${energyInfo.color}30`,
            }}
          >
            {energyInfo.label}
          </span>
        </div>

        {/* Narrative */}
        <div className="space-y-4">
          {reading.narrative.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Position insights */}
        <div className="space-y-3 pt-2">
          {[
            { label: 'Passado', insight: reading.pastInsight },
            { label: 'Presente', insight: reading.presentInsight },
            { label: 'Futuro', insight: reading.futureInsight },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-4" style={{ background: `rgba(26, 11, 46, 0.4)`, border: `1px solid ${DS_COLORS.divider}` }}>
              <span className="text-sm font-bold uppercase tracking-widest block mb-1" style={{ color: DS_COLORS.primaryText }}>
                {item.label}
              </span>
              <p className="text-base leading-[1.75]" style={{ color: `${DS_COLORS.bodyText}` }}>
                {item.insight}
              </p>
            </div>
          ))}
        </div>

        {/* Advice box */}
        <div
          className="rounded-xl p-5"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}10, ${ACCENT_DARK}08)`,
            border: `1px solid ${ACCENT}25`,
          }}
        >
          <span className="text-sm font-bold uppercase tracking-widest block mb-2" style={{ color: ACCENT }}>
            Conselho das Cartas
          </span>
          <p className="text-lg leading-[1.85] italic" style={{ color: DS_COLORS.bodyText }}>
            {reading.advice}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ArcanaGalleryCard({
  card,
  onClick,
}: {
  card: typeof tarotCards[number];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] aspect-[3/4]"
      style={{
        ...glassCard,
        border: `1px solid ${ACCENT}15`,
      }}
    >
      <span className="text-xs font-mono" style={{ color: `${DS_COLORS.primaryText}40` }}>
        {card.number}
      </span>
      <span
        className="text-sm font-bold text-center leading-tight"
        style={{ fontFamily: 'var(--font-display)', color: DS_COLORS.primaryText }}
      >
        {card.name}
      </span>
    </button>
  );
}

function ArcanaDetail({
  card,
  onClose,
}: {
  card: typeof tarotCards[number];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.3, ease: DS_EASING }}
      className="rounded-2xl p-6 space-y-4 overflow-hidden"
      style={styles.detailCard()}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-mono block mb-1" style={{ color: `${DS_COLORS.primaryText}50` }}>
            Arcano {card.number}
          </span>
          <h4 className="text-2xl font-bold" style={{ color: ACCENT, fontFamily: 'var(--font-display)' }}>
            {card.name}
          </h4>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 shrink-0"
          style={{ ...glassCard, color: DS_COLORS.primaryText }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest block mb-1" style={{ color: `${DS_COLORS.primaryText}80` }}>
            Posicao Normal
          </span>
          <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
            {card.upright}
          </p>
        </div>
        <div>
          <span className="text-sm font-bold uppercase tracking-widest block mb-1" style={{ color: `${DS_COLORS.primaryText}80` }}>
            Invertida
          </span>
          <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
            {card.reversed}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {card.keywords.map((k) => (
          <span
            key={k}
            className="text-xs font-medium rounded-full px-3 py-1"
            style={{ background: `${ACCENT}12`, color: ACCENT, border: `1px solid ${ACCENT}20` }}
          >
            {k}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Module ─── */

export default function TarotModule() {
  const [state, setState] = useState<TarotState>('idle');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedIdx, setRevealedIdx] = useState<Set<number>>(new Set());
  const [dealComplete, setDealComplete] = useState(false);
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [selectedArcana, setSelectedArcana] = useState<typeof tarotCards[number] | null>(null);

  /* ─── Drawing Logic ─── */

  const drawCards = useCallback(() => {
    const shuffled = shuffle(tarotCards);
    const positions = ['Passado', 'Presente', 'Futuro'];
    const cards: DrawnCard[] = shuffled.slice(0, 3).map((card, i) => ({
      card,
      reversed: Math.random() > 0.7,
      position: positions[i],
    }));
    setDrawnCards(cards);
    setRevealedIdx(new Set());
    setDealComplete(false);
    setReading(null);
    setState('dealing');
  }, []);

  /* Transition dealing → drawing after last card animates */
  useEffect(() => {
    if (state === 'dealing' && !dealComplete) {
      const timer = setTimeout(() => {
        setDealComplete(true);
        setState('drawing');
      }, 2000); // 3 cards × 0.5s stagger + spring settle
      return () => clearTimeout(timer);
    }
  }, [state, dealComplete]);

  const revealCard = (idx: number) => {
    if (state !== 'drawing') return;
    setRevealedIdx((prev) => {
      const next = new Set(prev);
      next.add(idx);
      if (next.size === 3) {
        // Generate reading when all 3 revealed
        const input: DrawnCardInput[] = drawnCards.map((d) => ({
          card: d.card,
          reversed: d.reversed,
          position: d.position,
        }));
        const newReading = generateReading(input);
        setReading(newReading);
        setState('revealed');
      }
      return next;
    });
  };

  const reset = () => {
    setState('idle');
    setDrawnCards([]);
    setRevealedIdx(new Set());
    setDealComplete(false);
    setReading(null);
  };

  /* ─── Render ─── */

  const positionKeys = ['past', 'present', 'future'] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ═══════════════════════════════════════════════
          SECTION 1: Tiragem de Cartas
          ═══════════════════════════════════════════════ */}

      <SectionDivider title="Tiragem" icon="&#x2726;" />

      {/* ─── Idle State ─── */}
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: DS_EASING }}
            className="text-center"
          >
            <div className="rounded-2xl p-8" style={glassCard}>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={styles.iconBox()}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" stroke={ACCENT} strokeWidth="1.5" fill={`${ACCENT}20`} />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: ACCENT }}>
                Tiragem de 3 Cartas
              </h3>
              <p className="text-lg leading-[1.85] mb-6" style={{ color: DS_COLORS.bodyText }}>
                Concentre-se na sua questao, respire fundo e clique para revelar as cartas do destino.
              </p>
              <button
                onClick={drawCards}
                className="rounded-2xl py-6 px-8 text-xl font-bold uppercase tracking-[0.15em] cursor-pointer transition-all duration-300 active:scale-[0.96] hover:brightness-110"
                style={{
                  ...styles.buttonGradient(true),
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  textShadow: `0 0 20px ${ACCENT}60`,
                }}
              >
                Tirar Cartas
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Dealing State ─── */}
        {state === 'dealing' && (
          <motion.div
            key="dealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center py-8"
          >
            <div className="relative" style={{ width: 360, height: 200 }}>
              {drawnCards.map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={dealVariants}
                  initial="stacked"
                  animate="dealt"
                  className="absolute"
                  style={{
                    width: 100,
                    height: 150,
                    left: '50%',
                    top: '50%',
                    marginLeft: -50,
                    marginTop: -75,
                  }}
                >
                  <CardBack size="small" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Drawing & Revealed States ─── */}
        {(state === 'drawing' || state === 'revealed') && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: DS_EASING }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* 3-card spread */}
            <div className="grid grid-cols-3 gap-4">
              {drawnCards.map((drawn, idx) => {
                const isRevealed = revealedIdx.has(idx);
                return (
                  <div key={idx} className="space-y-2">
                    <p className="text-lg font-bold uppercase tracking-widest text-center" style={{ color: DS_COLORS.primaryText }}>
                      {drawn.position}
                    </p>
                    <div className="relative aspect-[2/3]" style={{ perspective: '800px' }}>
                      <AnimatePresence mode="wait">
                        {!isRevealed ? (
                          <motion.div
                            key="back"
                            initial={{ rotateY: 0 }}
                            exit={{ rotateY: 90, transition: { duration: 0.2 } }}
                            className="absolute inset-0"
                            style={{ backfaceVisibility: 'hidden' }}
                          >
                            <CardBack onClick={() => revealCard(idx)} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="front"
                            initial={{ rotateY: -90 }}
                            animate={{ rotateY: 0 }}
                            transition={{ duration: 0.3, ease: DS_EASING }}
                            className="absolute inset-0"
                            style={{ backfaceVisibility: 'hidden' }}
                          >
                            <CardFace card={drawn.card} reversed={drawn.reversed} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Individual interpretations */}
            {drawnCards.map((drawn, idx) =>
              revealedIdx.has(idx) && reading ? (
                <CardInterpretation
                  key={`interp-${idx}`}
                  drawn={drawn}
                  reading={reading}
                  position={positionKeys[idx]}
                />
              ) : null,
            )}

            {/* Reading panel (after all 3 revealed) */}
            <AnimatePresence>
              {state === 'revealed' && reading && (
                <ReadingPanel reading={reading} drawnCards={drawnCards} />
              )}
            </AnimatePresence>

            {/* Reset button */}
            {state === 'revealed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3, ease: DS_EASING }}
                className="text-center"
              >
                <button
                  onClick={reset}
                  className="rounded-2xl px-8 py-5 text-lg font-bold uppercase tracking-[0.15em] cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.96]"
                  style={{
                    ...styles.buttonGradient(true),
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    textShadow: `0 0 20px ${ACCENT}60`,
                  }}
                >
                  Nova Tiragem
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          SECTION 2: Arcanos Maiores
          ═══════════════════════════════════════════════ */}

      <SectionDivider title="Arcanos Maiores" icon="&#x2605;" />

      <div className="tarot-particles-container rounded-2xl p-6" style={{ background: `rgba(26, 11, 46, 0.3)`, border: `1px solid ${DS_COLORS.divider}` }}>
        {/* Particles */}
        <div className="tarot-particle tarot-particle-1" />
        <div className="tarot-particle tarot-particle-2" />
        <div className="tarot-particle tarot-particle-3" />
        <div className="tarot-particle tarot-particle-4" />
        <div className="tarot-particle tarot-particle-5" />
        <div className="tarot-particle tarot-particle-6" />

        {/* Grid */}
        <div className="grid grid-cols-4 gap-3 relative z-10">
          {tarotCards.map((card) => (
            <ArcanaGalleryCard
              key={card.id}
              card={card}
              onClick={() => setSelectedArcana(selectedArcana?.id === card.id ? null : card)}
            />
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedArcana && (
            <div className="mt-4 relative z-10">
              <ArcanaDetail
                key={selectedArcana.id}
                card={selectedArcana}
                onClose={() => setSelectedArcana(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
