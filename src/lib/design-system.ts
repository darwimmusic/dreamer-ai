/* ─── DreamerAI Design System ───
 * Single source of truth for visual tokens.
 * Venus (NatalChartModule) is the gold standard.
 */

/* ─── Colors ─── */
export const DS_COLORS = {
  primaryText: '#E0B0FF',
  bodyText: 'rgba(255,255,255,0.95)',
  divider: 'rgba(224,176,255,0.06)',
  dividerGradient: (accent: string) =>
    `linear-gradient(90deg, transparent, ${accent}15, transparent)`,
} as const;

/* ─── Glassmorphism Card ─── */
export const glassCard = {
  background: 'rgba(26, 11, 46, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(224, 176, 255, 0.1)',
} as const;

/* ─── Easing ─── */
export const DS_EASING = [0.16, 1, 0.3, 1] as const;

/* ─── Animation Configs ─── */
export const DS_ANIMATIONS = {
  expandIn: {
    initial: { opacity: 0, y: 10, height: 0 },
    animate: { opacity: 1, y: 0, height: 'auto' as const },
    exit: { opacity: 0, y: -8, height: 0 },
    transition: { duration: 0.3, ease: DS_EASING },
  },
  fadeIn: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: DS_EASING },
  },
  sectionResults: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.5, ease: DS_EASING },
  },
} as const;

/* ─── Tailwind Class Patterns ─── */
export const DS_CLASSES = {
  sectionTitle:
    'text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2',
  detailCard: 'rounded-2xl p-6',
  formField:
    'w-full rounded-2xl px-6 py-6 text-xl font-medium outline-none transition-all duration-300',
  button:
    'w-full mt-4 rounded-2xl py-6 flex items-center justify-center gap-5 cursor-pointer transition-all duration-300 active:scale-[0.96] disabled:opacity-30 disabled:cursor-not-allowed group hover:brightness-110',
  label: 'text-lg font-bold uppercase tracking-widest',
  bodyText: 'text-lg leading-[1.85]',
} as const;

/* ─── Accent-Derived Style Factory ─── */
export function createAccentStyles(accent: string) {
  return {
    detailCard: () => ({
      background: `linear-gradient(135deg, ${accent}08, rgba(26, 11, 46, 0.6))`,
      border: `1px solid ${accent}20`,
    }),
    formWrapper: () => ({
      background: `linear-gradient(180deg, ${accent}06, rgba(26, 11, 46, 0.7) 40%, rgba(11, 4, 20, 0.85))`,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${accent}20`,
      boxShadow: `0 0 40px ${accent}06, inset 0 1px 0 ${accent}10`,
    }),
    buttonGradient: (enabled: boolean) => ({
      background: enabled
        ? `linear-gradient(135deg, ${accent}30, ${accent}18, ${accent}12)`
        : 'rgba(26, 11, 46, 0.3)',
      border: `2px solid ${enabled ? `${accent}50` : 'rgba(224, 176, 255, 0.06)'}`,
      boxShadow: enabled
        ? `0 0 40px ${accent}35, 0 0 80px ${accent}12, inset 0 0 30px ${accent}08`
        : 'none',
    }),
    iconBox: () => ({
      background: `${accent}15`,
      border: `1px solid ${accent}25`,
      boxShadow: `0 0 12px ${accent}35`,
    }),
    chartContainer: () => ({
      background: `linear-gradient(135deg, ${accent}05, rgba(26, 11, 46, 0.5))`,
      border: `1px solid ${accent}10`,
    }),
    divider: () => ({
      background: `linear-gradient(90deg, transparent, ${accent}15, transparent)`,
    }),
    topGlowBar: (accentDark?: string) => ({
      background: `linear-gradient(90deg, transparent, ${accent}50, ${accentDark ?? accent}40, transparent)`,
    }),
  };
}
