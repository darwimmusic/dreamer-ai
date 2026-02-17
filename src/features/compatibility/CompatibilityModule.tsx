'use client';

import { useState, useMemo } from 'react';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { glassCard, DS_COLORS, createAccentStyles } from '@/lib/design-system';

const ACCENT = '#c084fc';
const styles = createAccentStyles(ACCENT);

const ELEMENT_COMPAT: Record<string, Record<string, number>> = {
  fire:  { fire: 85, earth: 40, air: 90, water: 45 },
  earth: { fire: 40, earth: 80, air: 50, water: 85 },
  air:   { fire: 90, earth: 50, air: 75, water: 55 },
  water: { fire: 45, earth: 85, air: 55, water: 80 },
};

function getCompatibility(sign1Element: string, sign2Element: string): number {
  return ELEMENT_COMPAT[sign1Element]?.[sign2Element] ?? 50;
}

function getAnalysis(score: number, category: string): string {
  if (score >= 80) {
    const analyses: Record<string, string> = {
      amor: 'Conexao intensa e natural. Voces se complementam profundamente.',
      amizade: 'Amizade solida e duradoura. Sintonia natural.',
      trabalho: 'Parceria produtiva e harmoniosa. Boa divisao de forcas.',
    };
    return analyses[category] || '';
  } else if (score >= 60) {
    const analyses: Record<string, string> = {
      amor: 'Bom potencial com esforco mutuo. Aprendem um com o outro.',
      amizade: 'Amizade boa com momentos de ajuste. Crescimento mutuo.',
      trabalho: 'Colaboracao funcional. Compensam fraquezas um do outro.',
    };
    return analyses[category] || '';
  } else {
    const analyses: Record<string, string> = {
      amor: 'Desafios significativos, mas grande potencial de crescimento.',
      amizade: 'Precisa de paciencia e compreensao. Diferentes perspectivas.',
      trabalho: 'Necessita mediacao e comunicacao clara. Visoes distintas.',
    };
    return analyses[category] || '';
  }
}

export default function CompatibilityModule() {
  const [sign1, setSign1] = useState<string | null>(null);
  const [sign2, setSign2] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!sign1 || !sign2) return null;
    const s1 = ZODIAC_SIGNS.find((s) => s.id === sign1)!;
    const s2 = ZODIAC_SIGNS.find((s) => s.id === sign2)!;
    const base = getCompatibility(s1.element, s2.element);
    const love = Math.min(100, base + (sign1 === sign2 ? -10 : 5));
    const friendship = Math.min(100, base + 5);
    const work = Math.min(100, base - 5);
    return { s1, s2, love, friendship, work };
  }, [sign1, sign2]);

  const renderSelector = (selected: string | null, onSelect: (id: string) => void) => (
    <div className="grid grid-cols-4 gap-2">
      {ZODIAC_SIGNS.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className="rounded-xl p-2 text-center transition-all cursor-pointer"
          style={
            selected === s.id
              ? { ...styles.detailCard(), boxShadow: `0 0 12px ${ACCENT}20` }
              : glassCard
          }
        >
          <span className="text-xl block">{s.symbol}</span>
          <span className="text-xs" style={{ color: selected === s.id ? 'white' : `${DS_COLORS.primaryText}80` }}>{s.name}</span>
        </button>
      ))}
    </div>
  );

  const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>{label}</span>
        <span className="font-bold text-lg" style={{ color }}>{score}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-sm" style={{ color: `${DS_COLORS.primaryText}80` }}>
        {getAnalysis(score, label.toLowerCase())}
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* Sign 1 */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
          <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
          <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
            ♈ Primeiro Signo
          </span>
          <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
        </div>
        {renderSelector(sign1, setSign1)}
      </div>

      {/* Sign 2 */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
          <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
          <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
            ♎ Segundo Signo
          </span>
          <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
        </div>
        {renderSelector(sign2, setSign2)}
      </div>

      {/* Result */}
      {result && (
        <div
          className="rounded-2xl p-6 space-y-5"
          style={styles.detailCard()}
        >
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <span className="text-4xl">{result.s1.symbol}</span>
              <p className="text-sm mt-1" style={{ color: DS_COLORS.primaryText }}>{result.s1.name}</p>
            </div>
            <span className="text-2xl" style={{ color: ACCENT }}>&#x2764;</span>
            <div className="text-center">
              <span className="text-4xl">{result.s2.symbol}</span>
              <p className="text-sm mt-1" style={{ color: DS_COLORS.primaryText }}>{result.s2.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <ScoreBar label="Amor" score={result.love} color="#e879b8" />
            <ScoreBar label="Amizade" score={result.friendship} color="#c084fc" />
            <ScoreBar label="Trabalho" score={result.work} color="#818cf8" />
          </div>

          <div
            className="rounded-xl p-4 text-center"
            style={glassCard}
          >
            <p className="text-lg font-bold uppercase tracking-widest" style={{ color: DS_COLORS.primaryText }}>Elementos</p>
            <p className="text-lg mt-1" style={{ color: DS_COLORS.bodyText }}>
              <span className="capitalize">{result.s1.element}</span>
              {' + '}
              <span className="capitalize">{result.s2.element}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
