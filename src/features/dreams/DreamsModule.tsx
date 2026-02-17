'use client';

import { useState, useMemo } from 'react';
import dreamSymbols from '@/data/dream-symbols.json';
import { glassCard, DS_COLORS, createAccentStyles } from '@/lib/design-system';

const ACCENT = '#a78bfa';
const styles = createAccentStyles(ACCENT);

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'natureza', label: 'Natureza' },
  { id: 'animais', label: 'Animais' },
  { id: 'objetos', label: 'Objetos' },
  { id: 'lugares', label: 'Lugares' },
  { id: 'acoes', label: 'Acoes' },
  { id: 'corpo', label: 'Corpo' },
  { id: 'pessoas', label: 'Pessoas' },
  { id: 'eventos', label: 'Eventos' },
];

export default function DreamsModule() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSymbol, setSelectedSymbol] = useState<typeof dreamSymbols[number] | null>(null);

  const filtered = useMemo(() => {
    return dreamSymbols.filter((s) => {
      const matchesSearch = search === '' || s.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: `${DS_COLORS.primaryText}50` }} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          placeholder="Buscar simbolo do sonho..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl pl-12 pr-6 py-6 text-xl font-medium outline-none transition-all duration-300 placeholder:text-white/15"
          style={{
            background: 'rgba(11, 4, 20, 0.5)',
            border: `1.5px solid ${search ? `${ACCENT}35` : 'rgba(224, 176, 255, 0.08)'}`,
            color: 'rgba(255,255,255,0.9)',
            boxShadow: search ? `0 0 20px ${ACCENT}12, inset 0 0 12px ${ACCENT}05` : 'none',
          }}
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="shrink-0 text-sm px-4 py-2 rounded-full transition-all cursor-pointer font-medium"
            style={
              selectedCategory === cat.id
                ? { background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}30` }
                : { ...glassCard, color: `${DS_COLORS.primaryText}80` }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Symbol Detail */}
      {selectedSymbol && (
        <div
          className="rounded-2xl p-6 space-y-3"
          style={styles.detailCard()}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: ACCENT }}>
              {selectedSymbol.symbol}
            </h3>
            <button
              onClick={() => setSelectedSymbol(null)}
              className="text-sm cursor-pointer transition-colors"
              style={{ color: `${DS_COLORS.primaryText}50` }}
            >
              &#x2715;
            </button>
          </div>
          <span
            className="text-xs uppercase tracking-wider rounded-full px-3 py-1 inline-block font-bold"
            style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}25`, color: ACCENT }}
          >
            {selectedSymbol.category}
          </span>
          <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
            {selectedSymbol.meaning}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSymbol.emotions.map((e) => (
              <span
                key={e}
                className="text-xs rounded-full px-2.5 py-0.5"
                style={{ ...glassCard, color: `${DS_COLORS.primaryText}80` }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Section Title */}
      <div>
        <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
          <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
          <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
            🌙 Dicionario de Sonhos
          </span>
          <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
        </div>

        <p className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: DS_COLORS.primaryText }}>
          {filtered.length} simbolos encontrados
        </p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((sym) => (
            <button
              key={sym.id}
              onClick={() => setSelectedSymbol(sym)}
              className="rounded-2xl p-4 text-left transition-all cursor-pointer"
              style={
                selectedSymbol?.id === sym.id
                  ? { ...styles.detailCard(), boxShadow: `0 0 12px ${ACCENT}20` }
                  : glassCard
              }
            >
              <p className="text-lg font-medium text-white">{sym.symbol}</p>
              <p className="text-sm capitalize mt-0.5" style={{ color: `${DS_COLORS.primaryText}80` }}>{sym.category}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
