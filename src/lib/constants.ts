export const COLORS = {
  deepSpace: '#0a0a1a',
  deepSpaceLight: '#121228',
  nebulaPurple: '#6b21a8',
  cosmicBlue: '#1e3a5f',
  starGold: '#fbbf24',
  mysticViolet: '#7c3aed',
  lunarSilver: '#e2e8f0',
  solarOrange: '#f97316',
  marsRed: '#ef4444',
  venusPink: '#ec4899',
  jupiterAmber: '#d97706',
  saturnTeal: '#14b8a6',
  neptuneIndigo: '#6366f1',
} as const;

export const ANIMATION = {
  zoomDuration: 1.2,
  zoomEase: 'power3.inOut',
  panelDelay: 0.3,
  autoRotateSpeed: 0.3,
} as const;

export const CAMERA = {
  fov: 60,
  near: 0.1,
  far: 200,
  galaxyPosition: [0, 18, 28] as [number, number, number],
  galaxyTarget: [0, 0, 0] as [number, number, number],
} as const;

export const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Aries', symbol: '\u2648', element: 'fire', dates: '21 Mar - 19 Abr' },
  { id: 'taurus', name: 'Touro', symbol: '\u2649', element: 'earth', dates: '20 Abr - 20 Mai' },
  { id: 'gemini', name: 'Gemeos', symbol: '\u264A', element: 'air', dates: '21 Mai - 20 Jun' },
  { id: 'cancer', name: 'Cancer', symbol: '\u264B', element: 'water', dates: '21 Jun - 22 Jul' },
  { id: 'leo', name: 'Leao', symbol: '\u264C', element: 'fire', dates: '23 Jul - 22 Ago' },
  { id: 'virgo', name: 'Virgem', symbol: '\u264D', element: 'earth', dates: '23 Ago - 22 Set' },
  { id: 'libra', name: 'Libra', symbol: '\u264E', element: 'air', dates: '23 Set - 22 Out' },
  { id: 'scorpio', name: 'Escorpiao', symbol: '\u264F', element: 'water', dates: '23 Out - 21 Nov' },
  { id: 'sagittarius', name: 'Sagitario', symbol: '\u2650', element: 'fire', dates: '22 Nov - 21 Dez' },
  { id: 'capricorn', name: 'Capricornio', symbol: '\u2651', element: 'earth', dates: '22 Dez - 19 Jan' },
  { id: 'aquarius', name: 'Aquario', symbol: '\u2652', element: 'air', dates: '20 Jan - 18 Fev' },
  { id: 'pisces', name: 'Peixes', symbol: '\u2653', element: 'water', dates: '19 Fev - 20 Mar' },
] as const;
