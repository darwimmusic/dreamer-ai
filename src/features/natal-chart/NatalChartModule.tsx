'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { glassCard } from '@/lib/design-system';

/* ─── Types ─── */

interface BirthData {
  date: string;
  time: string;
  city: string;
}

interface ChartResult {
  sun: typeof ZODIAC_SIGNS[number];
  moon: typeof ZODIAC_SIGNS[number];
  ascendant: typeof ZODIAC_SIGNS[number];
  planets: { name: string; sign: typeof ZODIAC_SIGNS[number]; icon: string; meaning: string; analysis: string }[];
  houses: { number: number; name: string; sign: typeof ZODIAC_SIGNS[number]; description: string; analysis: string; keyword: string }[];
}

/* ─── Calculations ─── */

function calculateSunSign(month: number, day: number): typeof ZODIAC_SIGNS[number] {
  const ranges = [
    { sign: 'capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'pisces', start: [2, 19], end: [3, 20] },
    { sign: 'aries', start: [3, 21], end: [4, 19] },
    { sign: 'taurus', start: [4, 20], end: [5, 20] },
    { sign: 'gemini', start: [5, 21], end: [6, 20] },
    { sign: 'cancer', start: [6, 21], end: [7, 22] },
    { sign: 'leo', start: [7, 23], end: [8, 22] },
    { sign: 'virgo', start: [8, 23], end: [9, 22] },
    { sign: 'libra', start: [9, 23], end: [10, 22] },
    { sign: 'scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
  ];
  for (const range of ranges) {
    const [sm, sd] = range.start;
    const [em, ed] = range.end;
    if (sm === em) {
      if (month === sm && day >= sd && day <= ed) return ZODIAC_SIGNS.find((s) => s.id === range.sign)!;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return ZODIAC_SIGNS.find((s) => s.id === range.sign)!;
    }
  }
  return ZODIAC_SIGNS.find((s) => s.id === 'capricorn')!;
}

function calculateMoonSign(day: number, month: number): typeof ZODIAC_SIGNS[number] {
  return ZODIAC_SIGNS[(day + month * 3) % 12];
}

function calculateAscendant(hour: number): typeof ZODIAC_SIGNS[number] {
  return ZODIAC_SIGNS[Math.floor(hour / 2) % 12];
}

function getPlanetSign(day: number, month: number, hour: number, offset: number): typeof ZODIAC_SIGNS[number] {
  return ZODIAC_SIGNS[(day + month * 2 + hour + offset) % 12];
}

/* ─── Accent colors by Venus palette ─── */

const ACCENT = '#f0abcf';
const ACCENT_DARK = '#be185d';
const GLOW = 'rgba(240, 171, 207, 0.35)';

/* ─── Planet Analyses ─── */

const PLANET_ANALYSES: Record<string, (signName: string) => string> = {
  'Mercurio': (s) => `Com Mercurio em ${s}, sua mente opera de forma unica. Sua comunicacao carrega a essencia de ${s}, influenciando como voce processa informacoes, aprende e expressa ideias. Conversas tendem a ser marcadas por uma abordagem ${s === 'Aries' ? 'direta e impulsiva' : s === 'Touro' ? 'pratica e deliberada' : s === 'Gemeos' ? 'versatil e curiosa' : s === 'Cancer' ? 'emocional e intuitiva' : s === 'Leao' ? 'dramatica e confiante' : s === 'Virgem' ? 'analitica e detalhista' : s === 'Libra' ? 'diplomatica e equilibrada' : s === 'Escorpiao' ? 'profunda e investigativa' : s === 'Sagitario' ? 'filosofica e expansiva' : s === 'Capricornio' ? 'estrategica e disciplinada' : s === 'Aquario' ? 'inovadora e original' : 'poetica e imaginativa'}. Sua forma de aprender e processar o mundo reflete essa energia cosmica.`,
  'Venus': (s) => `Venus em ${s} revela como voce ama e o que valoriza. Sua forma de expressar afeto e profundamente moldada por essa posicao — voce busca ${s === 'Aries' ? 'paixao intensa e conquista' : s === 'Touro' ? 'estabilidade e prazer sensorial' : s === 'Gemeos' ? 'estimulo mental e variedade' : s === 'Cancer' ? 'seguranca emocional e cuidado' : s === 'Leao' ? 'admiracao e romance grandioso' : s === 'Virgem' ? 'dedicacao pratica e servico' : s === 'Libra' ? 'harmonia e parceria igualitaria' : s === 'Escorpiao' ? 'profundidade e transformacao' : s === 'Sagitario' ? 'liberdade e aventura compartilhada' : s === 'Capricornio' ? 'compromisso e construcao solida' : s === 'Aquario' ? 'autenticidade e conexao mental' : 'fusao espiritual e romance poetico'}. Seus valores esteticos e financeiros tambem carregam essa marca.`,
  'Marte': (s) => `Marte em ${s} define como voce age e luta pelo que deseja. Sua energia vital pulsa com a forca de ${s}. Quando desafiado, voce responde de forma ${s === 'Aries' ? 'rapida e corajosa, sem hesitacao' : s === 'Touro' ? 'firme e persistente, nunca desistindo' : s === 'Gemeos' ? 'inteligente e adaptavel, usando palavras como armas' : s === 'Cancer' ? 'protetora e emocional, defendendo quem ama' : s === 'Leao' ? 'orgulhosa e teatral, com presenca marcante' : s === 'Virgem' ? 'calculada e eficiente, sem desperdicar energia' : s === 'Libra' ? 'estrategica e justa, buscando equilibrio' : s === 'Escorpiao' ? 'intensa e implacavel, com determinacao de aco' : s === 'Sagitario' ? 'entusiastica e otimista, sempre em movimento' : s === 'Capricornio' ? 'disciplinada e ambiciosa, com foco no topo' : s === 'Aquario' ? 'rebelde e inventiva, quebrando padroes' : 'compassiva e intuitiva, agindo pelo coracao'}.`,
  'Jupiter': (s) => `Jupiter em ${s} expande sua sorte e sabedoria nessa direcao. Voce encontra abundancia quando se alinha com a energia de ${s}. Oportunidades de crescimento surgem atraves de ${s === 'Aries' ? 'iniciativas corajosas e lideranca' : s === 'Touro' ? 'investimentos pacientes e apreciacao da beleza' : s === 'Gemeos' ? 'comunicacao, educacao e networking' : s === 'Cancer' ? 'familia, emocoes e intuicao' : s === 'Leao' ? 'expressao criativa e generosidade' : s === 'Virgem' ? 'servico, saude e aperfeicoamento' : s === 'Libra' ? 'parcerias, arte e diplomacia' : s === 'Escorpiao' ? 'transformacao, pesquisa e herancas' : s === 'Sagitario' ? 'viagens, filosofia e ensino' : s === 'Capricornio' ? 'carreira, disciplina e autoridade' : s === 'Aquario' ? 'inovacao, tecnologia e causas sociais' : 'espiritualidade, arte e compaixao'}. Sua fe e otimismo se manifestam por esse caminho.`,
  'Saturno': (s) => `Saturno em ${s} revela suas maiores licoes karmicas. A vida te desafia especialmente na area regida por ${s}, exigindo maturidade e disciplina. Suas restricoes iniciais se tornam sua maior forca quando voce aprende a ${s === 'Aries' ? 'equilibrar impulsividade com paciencia' : s === 'Touro' ? 'construir seguranca sem apego excessivo' : s === 'Gemeos' ? 'focar a mente sem dispersar' : s === 'Cancer' ? 'lidar com vulnerabilidade sem se fechar' : s === 'Leao' ? 'brilhar com humildade e autenticidade' : s === 'Virgem' ? 'aceitar imperfeicoes e soltar o controle' : s === 'Libra' ? 'manter limites saudaveis nos relacionamentos' : s === 'Escorpiao' ? 'enfrentar medos profundos e perdoar' : s === 'Sagitario' ? 'comprometer-se sem perder a liberdade' : s === 'Capricornio' ? 'liderar sem se isolar emocionalmente' : s === 'Aquario' ? 'inovar dentro de estruturas viaveis' : 'manter os pes no chao sem perder a imaginacao'}. Com o tempo, essa posicao traz maestria profunda.`,
};

/* ─── House Data ─── */

const HOUSE_NAMES = [
  'Identidade', 'Financas', 'Comunicacao', 'Lar & Familia',
  'Criatividade', 'Saude & Rotina', 'Relacionamentos', 'Transformacao',
  'Filosofia', 'Carreira', 'Amizades', 'Espiritualidade',
];

const HOUSE_KEYWORDS = [
  'Eu Sou', 'Eu Tenho', 'Eu Penso', 'Eu Sinto',
  'Eu Crio', 'Eu Sirvo', 'Eu Me Relaciono', 'Eu Transformo',
  'Eu Acredito', 'Eu Realizo', 'Eu Sonho', 'Eu Transcendo',
];

const HOUSE_DESCRIPTIONS: string[] = [
  'A Casa 1 representa a mascara que voce usa para o mundo. Governa aparencia fisica, primeira impressao, temperamento e a forma como voce inicia novas experiencias. E o ponto de partida do seu mapa — sua identidade cosmica.',
  'A Casa 2 governa seus recursos materiais, talentos naturais e autoestima. Revela sua relacao com dinheiro, posses e o que voce mais valoriza. Mostra como voce constroi seguranca e abundancia.',
  'A Casa 3 rege comunicacao, aprendizado e o ambiente imediato. Governa irmaos, vizinhos, viagens curtas e como voce processa informacoes. Sua mente racional opera aqui.',
  'A Casa 4 e o fundamento do mapa — lar, familia, raizes e vida privada. Revela sua infancia, relacao com a mae e o que voce precisa para se sentir seguro. E seu refugio interior.',
  'A Casa 5 governa criatividade, romance, filhos e prazer. E a casa da autoexpressao, dos hobbies, do jogo e da alegria pura. Mostra como voce se diverte e o que inspira sua alma criativa.',
  'A Casa 6 rege saude, rotina diaria e servico. Governa habitos, trabalho, animais de estimacao e como voce cuida do corpo. Revela sua relacao com disciplina e bem-estar cotidiano.',
  'A Casa 7 governa parcerias, casamento e contratos. E o espelho — mostra o que voce busca no outro e como se relaciona em duos. Revela padroes de compromisso e cooperacao.',
  'A Casa 8 rege transformacao, sexualidade, morte e renascimento. Governa heracas, recursos compartilhados e crises que levam ao crescimento. E a casa do poder oculto e da profundidade.',
  'A Casa 9 governa filosofia, viagens longas, ensino superior e fe. Expande seus horizontes atraves de culturas, religioes e busca por significado. E a casa do sabio interior.',
  'A Casa 10 e o topo do mapa — carreira, reputacao e legado. Governa sua imagem publica, ambicoes e realizacoes. Mostra como o mundo te reconhece e o que voce veio construir.',
  'A Casa 11 rege amizades, grupos, esperancas e projetos futuros. Governa comunidades, causas sociais e sua visao de mundo ideal. E a casa da conexao coletiva e inovacao.',
  'A Casa 12 governa o inconsciente, isolamento, espiritualidade e karma. Revela medos ocultos, talentos escondidos e sua conexao com o divino. E a casa da dissolucao do ego e transcendencia.',
];

/* ─── Chart Wheel SVG ─── */

function ChartWheel({ chart, activeSign, onSelect }: { chart: ChartResult; activeSign: 'sun' | 'moon' | 'ascendant' | null; onSelect: (key: 'sun' | 'moon' | 'ascendant') => void }) {
  const cx = 155, cy = 155;
  const outerR = 116, innerR = 68, centerR = 32;
  const badgeDist = 18;
  const bigThree = [
    { key: 'sun' as const, label: 'SOL', sign: chart.sun, color: '#fbbf24' },
    { key: 'moon' as const, label: 'LUA', sign: chart.moon, color: '#e2e8f0' },
    { key: 'ascendant' as const, label: 'ASC', sign: chart.ascendant, color: ACCENT },
  ];

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 310 310" className="w-full max-w-[640px]" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="nc-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="nc-center">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.15" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <circle cx={cx} cy={cy} r={outerR + 25} fill="url(#nc-center)" />

        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={ACCENT} strokeOpacity="0.15" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={ACCENT} strokeOpacity="0.08" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={centerR} fill="rgba(11,4,20,0.8)" stroke={ACCENT} strokeOpacity="0.25" strokeWidth="1.5" filter="url(#nc-glow)" />

        {/* 12 division lines + sign symbols */}
        {ZODIAC_SIGNS.map((sign, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const nextAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
          const midAngle = ((i * 30 + 15) - 90) * (Math.PI / 180);
          const ix = cx + Math.cos(angle) * innerR;
          const iy = cy + Math.sin(angle) * innerR;
          const ox = cx + Math.cos(angle) * outerR;
          const oy = cy + Math.sin(angle) * outerR;
          const sx = cx + Math.cos(midAngle) * ((outerR + innerR) / 2);
          const sy = cy + Math.sin(midAngle) * ((outerR + innerR) / 2);
          const isActive = sign.id === chart.sun.id || sign.id === chart.moon.id || sign.id === chart.ascendant.id;
          return (
            <g key={sign.id}>
              <line x1={ix} y1={iy} x2={ox} y2={oy} stroke={ACCENT} strokeOpacity="0.06" strokeWidth="1" />
              {/* Neon arc for active signs */}
              {isActive && (
                <path
                  d={`M ${cx + Math.cos(angle) * (outerR - 2)} ${cy + Math.sin(angle) * (outerR - 2)} A ${outerR - 2} ${outerR - 2} 0 0 1 ${cx + Math.cos(nextAngle) * (outerR - 2)} ${cy + Math.sin(nextAngle) * (outerR - 2)}`}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="3"
                  strokeOpacity="0.7"
                  filter="url(#nc-glow)"
                />
              )}
              <text
                x={sx} y={sy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isActive ? '19' : '14'}
                fill={isActive ? 'white' : 'rgba(224,176,255,0.85)'}
                fontWeight={isActive ? '700' : '500'}
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* Center: Venus symbol */}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="22" fill={ACCENT} fontWeight="700">
          ♀
        </text>

        {/* Big Three indicators on outer edge — clickable */}
        {bigThree.map((item, i) => {
          const signIdx = ZODIAC_SIGNS.findIndex((s) => s.id === item.sign.id);
          const angle = ((signIdx * 30 + 15) - 90) * (Math.PI / 180);
          const x = cx + Math.cos(angle) * (outerR + badgeDist);
          const y = cy + Math.sin(angle) * (outerR + badgeDist);
          const isActive = activeSign === item.key;
          return (
            <g key={item.label} className="cursor-pointer" onClick={() => onSelect(item.key)}>
              {isActive && (
                <circle cx={x} cy={y} r="18" fill="none" stroke={item.color} strokeWidth="1" strokeOpacity="0.3" filter="url(#nc-glow)" />
              )}
              <circle cx={x} cy={y} r="13" fill={isActive ? `${item.color}20` : 'rgba(11,4,20,0.9)'} stroke={item.color} strokeWidth={isActive ? 2 : 1.5} strokeOpacity={isActive ? 1 : 0.7} filter="url(#nc-glow)" />
              <text x={x} y={y - 1} textAnchor="middle" dominantBaseline="central" fontSize="9.5" fill={item.color} fontWeight="700">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Planet Orbital System ─── */

function PlanetOrbitalSystem({
  planets,
  activePlanet,
  onSelect,
}: {
  planets: ChartResult['planets'];
  activePlanet: string | null;
  onSelect: (name: string) => void;
}) {
  const cx = 160, cy = 160;
  const orbits = [50, 80, 110, 140];
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const speeds = [0.015, 0.01, 0.007, 0.004];

  // Distribute planets across orbits
  const planetPositions = planets.map((p, i) => {
    const orbitIdx = Math.min(i, orbits.length - 1);
    return { ...p, orbit: orbitIdx, angleOffset: (2 * Math.PI * (i % 3)) / Math.max(1, planets.filter((_, j) => Math.min(j, orbits.length - 1) === orbitIdx).length) + (i * 1.2) };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-[520px]" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="ps-center-glow">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" />
            <stop offset="60%" stopColor={ACCENT} stopOpacity="0.05" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          <filter id="ps-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ps-line-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx={cx} cy={cy} r="155" fill="url(#ps-center-glow)" />

        {/* Orbit rings */}
        {orbits.map((r, i) => (
          <circle
            key={`orbit-${i}`}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={ACCENT}
            strokeOpacity={0.1 - i * 0.015}
            strokeWidth="1"
            strokeDasharray={i >= 2 ? '3 6' : 'none'}
          />
        ))}

        {/* Connection lines */}
        {planetPositions.map((p) => {
          const angle = p.angleOffset + tick * speeds[p.orbit];
          const r = orbits[p.orbit];
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          return (
            <line
              key={`line-${p.name}`}
              x1={cx} y1={cy} x2={x} y2={y}
              stroke={ACCENT}
              strokeOpacity={activePlanet === p.name ? 0.3 : 0.06}
              strokeWidth="1"
              strokeDasharray="2 5"
              filter="url(#ps-line-glow)"
            />
          );
        })}

        {/* Planet nodes */}
        {planetPositions.map((p) => {
          const angle = p.angleOffset + tick * speeds[p.orbit];
          const r = orbits[p.orbit];
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          const isActive = activePlanet === p.name;
          const nodeSize = isActive ? 22 : 18 - p.orbit * 1.5;
          return (
            <g
              key={`node-${p.name}`}
              filter="url(#ps-glow)"
              className="cursor-pointer"
              onClick={() => onSelect(p.name)}
            >
              <circle
                cx={x} cy={y} r={nodeSize}
                fill={isActive ? `${ACCENT}15` : 'rgba(11, 4, 20, 0.85)'}
                stroke={ACCENT}
                strokeOpacity={isActive ? 0.7 : 0.25}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {isActive && (
                <circle
                  cx={x} cy={y} r={nodeSize + 4}
                  fill="none" stroke={ACCENT} strokeOpacity="0.15" strokeWidth="1"
                />
              )}
              <text
                x={x} y={y - 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isActive ? '17' : '14'}
                fill="white"
              >
                {p.icon}
              </text>
              <text
                x={x} y={y + nodeSize + 11}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8.5"
                fontWeight="700"
                fill={ACCENT}
                fillOpacity={isActive ? 0.9 : 0.6}
                letterSpacing="0.5"
              >
                {p.name.toUpperCase()}
              </text>
              <text
                x={x} y={y + nodeSize + 22}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7.5"
                fill="rgba(224,176,255,0.9)"
                fontWeight="600"
              >
                {p.sign.symbol} {p.sign.name}
              </text>
            </g>
          );
        })}

        {/* Center Sun */}
        <circle cx={cx} cy={cy} r="25" fill="rgba(11,4,20,0.9)" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="2" filter="url(#ps-glow)" />
        <circle cx={cx} cy={cy} r="30" fill="none" stroke={ACCENT} strokeOpacity="0.12" strokeWidth="1" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="22" fill="white">☉</text>
      </svg>
    </div>
  );
}

/* ─── Constellation Houses ─── */

function ConstellationHouses({
  houses,
  activeHouse,
  onSelect,
}: {
  houses: ChartResult['houses'];
  activeHouse: number | null;
  onSelect: (n: number) => void;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  // Arrange houses in a circular constellation pattern
  const cx = 160, cy = 145, radius = 115;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 310" className="w-full max-w-[520px]">
        <defs>
          <filter id="ch-star-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="ch-bg-glow">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.1" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={radius + 20} fill="url(#ch-bg-glow)" />

        {/* Constellation lines connecting adjacent houses */}
        {houses.map((_, i) => {
          const angle1 = (i * 30 - 90) * (Math.PI / 180);
          const angle2 = ((i + 1) * 30 - 90) * (Math.PI / 180);
          const x1 = cx + Math.cos(angle1) * radius;
          const y1 = cy + Math.sin(angle1) * radius;
          const x2 = cx + Math.cos(angle2) * radius;
          const y2 = cy + Math.sin(angle2) * radius;
          return (
            <line
              key={`cline-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={ACCENT}
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          );
        })}

        {/* Cross lines through center */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          const ox = cx + Math.cos(angle + Math.PI) * radius;
          const oy = cy + Math.sin(angle + Math.PI) * radius;
          return (
            <line
              key={`cross-${i}`}
              x1={x} y1={y} x2={ox} y2={oy}
              stroke={ACCENT}
              strokeOpacity="0.03"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
          );
        })}

        {/* House star nodes */}
        {houses.map((house, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          const isActive = activeHouse === house.number;
          // Twinkle effect: each star has slightly different phase
          const twinkle = 0.5 + 0.5 * Math.sin(tick * 0.05 + i * 0.8);
          const starSize = isActive ? 18 : 10 + twinkle * 4;

          return (
            <g
              key={`house-${i}`}
              className="cursor-pointer"
              onClick={() => onSelect(house.number)}
            >
              {/* Star glow */}
              <circle
                cx={x} cy={y} r={starSize + 6}
                fill="none"
                stroke={ACCENT}
                strokeOpacity={isActive ? 0.3 : twinkle * 0.08}
                strokeWidth="1"
              />
              {/* Star body */}
              <circle
                cx={x} cy={y} r={starSize}
                fill={isActive ? `${ACCENT}18` : `rgba(11,4,20,${0.7 + twinkle * 0.2})`}
                stroke={ACCENT}
                strokeOpacity={isActive ? 0.7 : 0.15 + twinkle * 0.15}
                strokeWidth={isActive ? 2 : 1}
                filter="url(#ch-star-glow)"
              />
              {/* Inner bright spot */}
              <circle
                cx={x} cy={y}
                r={isActive ? 4 : 2 + twinkle * 1.5}
                fill={ACCENT}
                fillOpacity={isActive ? 0.6 : 0.15 + twinkle * 0.25}
              />
              {/* House number */}
              <text
                x={x} y={isActive ? y - 2 : y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isActive ? '13' : '10'}
                fontWeight="800"
                fill="white"
              >
                {house.number}
              </text>
              {/* Sign symbol below active */}
              {isActive && (
                <text
                  x={x} y={y + 8}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fill={ACCENT}
                  fillOpacity="1"
                >
                  {house.sign.symbol}
                </text>
              )}
              {/* Label outside */}
              <text
                x={x} y={y + (isActive ? starSize + 13 : starSize + 10)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7"
                fontWeight="700"
                fill={ACCENT}
                fillOpacity={isActive ? 1 : 0.85}
                letterSpacing="0.4"
              >
                {house.name.toUpperCase().slice(0, 8)}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="700" fill={ACCENT} fillOpacity="1" letterSpacing="2">
          CASAS
        </text>
        <text x={cx} y={cy + 7} textAnchor="middle" dominantBaseline="central" fontSize="8" fill="rgba(224,176,255,0.85)">
          12 MORADAS
        </text>
      </svg>
    </div>
  );
}

/* ─── Generate Chart Data ─── */

function generateChart(birthData: BirthData): ChartResult {
  const [year, month, day] = birthData.date.split('-').map(Number);
  const [hour] = birthData.time.split(':').map(Number);

  const sun = calculateSunSign(month, day);
  const moon = calculateMoonSign(day, month);
  const ascendant = calculateAscendant(hour);

  const planetDefs = [
    { name: 'Mercurio', icon: '☿', offset: 1 },
    { name: 'Venus', icon: '♀', offset: 3 },
    { name: 'Marte', icon: '♂', offset: 5 },
    { name: 'Jupiter', icon: '♃', offset: 7 },
    { name: 'Saturno', icon: '♄', offset: 11 },
  ];

  const planets = planetDefs.map((pd) => {
    const sign = getPlanetSign(day, month, hour, pd.offset);
    const analysisFn = PLANET_ANALYSES[pd.name];
    return {
      name: pd.name,
      sign,
      icon: pd.icon,
      meaning: `${pd.name} em ${sign.name}`,
      analysis: analysisFn ? analysisFn(sign.name) : `${pd.name} em ${sign.name} influencia profundamente essa area da sua vida.`,
    };
  });

  const ascIdx = ZODIAC_SIGNS.findIndex((s) => s.id === ascendant.id);
  const houses = Array.from({ length: 12 }, (_, i) => {
    const sign = ZODIAC_SIGNS[(i + ascIdx) % 12];
    return {
      number: i + 1,
      name: HOUSE_NAMES[i],
      sign,
      description: HOUSE_DESCRIPTIONS[i],
      analysis: `Com ${sign.name} regendo sua Casa ${i + 1}, voce aborda ${HOUSE_NAMES[i].toLowerCase()} com a energia de ${sign.name}. Isso traz uma qualidade ${sign.element === 'fire' ? 'apaixonada e dinamica' : sign.element === 'earth' ? 'pratica e estavel' : sign.element === 'air' ? 'intelectual e comunicativa' : 'emocional e intuitiva'} para esta area, moldando como voce experiencia ${HOUSE_NAMES[i].toLowerCase()} na sua jornada.`,
      keyword: HOUSE_KEYWORDS[i],
    };
  });

  return { sun, moon, ascendant, planets, houses };
}

/* ─── Main Component ─── */

export default function NatalChartModule() {
  const [birthData, setBirthData] = useState<BirthData>({ date: '', time: '', city: '' });
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSign, setActiveSign] = useState<'sun' | 'moon' | 'ascendant' | null>('sun');
  const [activePlanet, setActivePlanet] = useState<string | null>('Mercurio');
  const [activeHouse, setActiveHouse] = useState<number | null>(1);

  const handleGenerate = () => {
    if (!birthData.date || !birthData.time) return;
    setIsGenerating(true);
    setActiveSign(null);
    setActivePlanet(null);
    setActiveHouse(null);
    // Simulate generation delay for dramatic effect
    setTimeout(() => {
      setChart(generateChart(birthData));
      setIsGenerating(false);
      // Auto-open first detail in each section
      setActiveSign('sun');
      setActivePlanet('Mercurio');
      setActiveHouse(1);
    }, 1200);
  };

  const canGenerate = birthData.date && birthData.time;

  return (
    <div className="space-y-14">

      {/* ═══ BIRTH DATA FORM ═══ */}
      <div
        className="rounded-3xl relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${ACCENT}06, rgba(26, 11, 46, 0.7) 40%, rgba(11, 4, 20, 0.85))`,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${ACCENT}20`,
          boxShadow: `0 0 40px ${ACCENT}06, inset 0 1px 0 ${ACCENT}10`,
        }}
      >
        {/* Decorative top glow bar */}
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}50, ${ACCENT_DARK}40, transparent)` }} />

        {/* Form header */}
        <div className="px-8 pt-10 pb-3 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
            style={{
              background: `radial-gradient(circle, ${ACCENT}20 0%, ${ACCENT}08 50%, transparent 70%)`,
              border: `1.5px solid ${ACCENT}30`,
              boxShadow: `0 0 40px ${GLOW}, 0 0 80px ${ACCENT}12, inset 0 0 20px ${ACCENT}08`,
            }}
          >
            ♀
          </div>
          <h3 className="text-3xl font-bold tracking-wide uppercase mb-2 animate-pulse" style={{ color: '#E0B0FF', fontFamily: 'var(--font-display)', textShadow: `0 0 20px ${ACCENT}80, 0 0 40px ${ACCENT}40, 0 0 80px ${ACCENT}20`, animationDuration: '3s' }}>
            Portal de Nascimento
          </h3>
          <p className="text-lg" style={{ color: '#E0B0FF' }}>
            Insira os dados do momento em que voce chegou ao mundo
          </p>
        </div>

        {/* Divider */}
        <div className="mx-8 my-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}15, transparent)` }} />

        <div className="px-8 pb-8 space-y-5">
          {/* Date field */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}15` }}
              >
                📅
              </div>
              <label className="text-lg font-bold uppercase tracking-widest" style={{ color: '#E0B0FF' }}>
                Data de Nascimento
              </label>
            </div>
            <input
              type="date"
              value={birthData.date}
              onChange={(e) => setBirthData((d) => ({ ...d, date: e.target.value }))}
              className="w-full rounded-2xl px-6 py-6 text-xl font-medium outline-none transition-all duration-300"
              style={{
                background: 'rgba(11, 4, 20, 0.5)',
                border: `1.5px solid ${birthData.date ? `${ACCENT}35` : 'rgba(224, 176, 255, 0.08)'}`,
                color: 'rgba(255,255,255,0.9)',
                boxShadow: birthData.date ? `0 0 20px ${ACCENT}12, inset 0 0 12px ${ACCENT}05` : 'none',
              }}
            />
          </div>

          {/* Time field */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}15` }}
              >
                🕐
              </div>
              <label className="text-lg font-bold uppercase tracking-widest" style={{ color: '#E0B0FF' }}>
                Hora do Nascimento
              </label>
              <span className="text-sm italic ml-auto" style={{ color: '#E0B0FF' }}>
                essencial
              </span>
            </div>
            <input
              type="time"
              value={birthData.time}
              onChange={(e) => setBirthData((d) => ({ ...d, time: e.target.value }))}
              className="w-full rounded-2xl px-6 py-6 text-xl font-medium outline-none transition-all duration-300"
              style={{
                background: 'rgba(11, 4, 20, 0.5)',
                border: `1.5px solid ${birthData.time ? `${ACCENT}35` : 'rgba(224, 176, 255, 0.08)'}`,
                color: 'rgba(255,255,255,0.9)',
                boxShadow: birthData.time ? `0 0 20px ${ACCENT}12, inset 0 0 12px ${ACCENT}05` : 'none',
              }}
            />
          </div>

          {/* City field */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}15` }}
              >
                📍
              </div>
              <label className="text-lg font-bold uppercase tracking-widest" style={{ color: '#E0B0FF' }}>
                Cidade de Nascimento
              </label>
              <span className="text-sm italic ml-auto" style={{ color: '#E0B0FF' }}>
                opcional
              </span>
            </div>
            <input
              type="text"
              placeholder="Ex: Sao Paulo, Brasil"
              value={birthData.city}
              onChange={(e) => setBirthData((d) => ({ ...d, city: e.target.value }))}
              className="w-full rounded-2xl px-6 py-6 text-xl font-medium outline-none transition-all duration-300 placeholder:text-white/15"
              style={{
                background: 'rgba(11, 4, 20, 0.5)',
                border: `1.5px solid ${birthData.city ? `${ACCENT}35` : 'rgba(224, 176, 255, 0.08)'}`,
                color: 'rgba(255,255,255,0.9)',
                boxShadow: birthData.city ? `0 0 20px ${ACCENT}12, inset 0 0 12px ${ACCENT}05` : 'none',
              }}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full mt-4 rounded-2xl py-6 flex items-center justify-center gap-5 cursor-pointer transition-all duration-300 active:scale-[0.96] disabled:opacity-30 disabled:cursor-not-allowed group hover:brightness-110"
            style={{
              background: canGenerate
                ? `linear-gradient(135deg, ${ACCENT}30, ${ACCENT_DARK}18, ${ACCENT}12)`
                : 'rgba(26, 11, 46, 0.3)',
              border: `2px solid ${canGenerate ? `${ACCENT}50` : 'rgba(224, 176, 255, 0.06)'}`,
              boxShadow: canGenerate ? `0 0 40px ${GLOW}, 0 0 80px ${ACCENT}12, inset 0 0 30px ${ACCENT}08` : 'none',
            }}
          >
            {isGenerating ? (
              <>
                <div
                  className="w-8 h-8 border-2 border-transparent rounded-full animate-spin"
                  style={{ borderTopColor: ACCENT, borderRightColor: `${ACCENT}50` }}
                />
                <span className="text-xl font-bold tracking-wider" style={{ color: 'white', textShadow: `0 0 20px ${ACCENT}60` }}>
                  Lendo as Estrelas...
                </span>
              </>
            ) : (
              <>
                <div className="relative">
                  <svg width="38" height="38" viewBox="0 0 28 28" fill="none" className="group-hover:scale-115 transition-transform duration-300">
                    <circle cx="14" cy="14" r="8" fill={ACCENT} fillOpacity="0.2" stroke={ACCENT} strokeWidth="1.5" strokeOpacity="0.8" />
                    <ellipse cx="14" cy="14" rx="14" ry="4" fill="none" stroke={ACCENT} strokeWidth="1" strokeOpacity="0.5" transform="rotate(-20, 14, 14)" />
                    <circle cx="14" cy="14" r="3" fill={ACCENT} fillOpacity="0.4" />
                    <circle cx="14" cy="14" r="1.5" fill={ACCENT} fillOpacity="0.8" />
                  </svg>
                </div>
                <span
                  className="text-xl font-bold uppercase tracking-[0.15em]"
                  style={{ color: 'white', fontFamily: 'var(--font-display)', textShadow: `0 0 20px ${ACCENT}60` }}
                >
                  Gerar Mapa Astral
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ═══ CHART RESULTS ═══ */}
      <AnimatePresence>
        {chart && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingTop: '40px' }}
          >
            {/* ─── CHART WHEEL (Neon lines) ─── */}
            <div>
              <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
                <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
                <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#E0B0FF' }}>
                  🔮 Mapa Natal
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
              </div>
              <div
                className="rounded-3xl px-3 py-4"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}05, rgba(26, 11, 46, 0.5))`,
                  border: `1px solid ${ACCENT}10`,
                }}
              >
                <ChartWheel chart={chart} activeSign={activeSign} onSelect={(key) => setActiveSign(activeSign === key ? null : key)} />
              </div>
            </div>

            {/* ─── BIG THREE — clickable sign cards ─── */}
            <div>
              <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
                <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
                <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#E0B0FF' }}>
                  ✨ Triade Sagrada
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {([
                  { key: 'sun' as const, label: 'Sol', sign: chart.sun, icon: '☉', color: '#fbbf24', desc: 'Essencia' },
                  { key: 'moon' as const, label: 'Lua', sign: chart.moon, icon: '☽', color: '#e2e8f0', desc: 'Emocoes' },
                  { key: 'ascendant' as const, label: 'Ascendente', sign: chart.ascendant, icon: '↑', color: ACCENT, desc: 'Mascara' },
                ]).map((item) => {
                  const isActive = activeSign === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveSign(isActive ? null : item.key)}
                      className="cursor-pointer group active:scale-[0.95] transition-all duration-200"
                    >
                      <div
                        className="rounded-2xl p-4 text-center relative overflow-hidden transition-all duration-300"
                        style={
                          isActive
                            ? {
                                background: `linear-gradient(135deg, ${item.color}20, ${ACCENT}08)`,
                                backdropFilter: 'blur(12px)',
                                border: `1px solid ${item.color}40`,
                                boxShadow: `0 0 18px ${item.color}25`,
                              }
                            : glassCard
                        }
                      >
                        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: item.color }}>
                          {item.icon} {item.label}
                        </p>
                        <p className="text-5xl mb-1">{item.sign.symbol}</p>
                        <p className="text-base font-semibold text-white">{item.sign.name}</p>
                        <p className="text-sm mt-0.5" style={{ color: '#E0B0FF' }}>{item.desc}</p>
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full" style={{ backgroundColor: item.color }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Expanded analysis for selected sign */}
              <AnimatePresence mode="wait">
                {activeSign && (
                  <motion.div
                    key={activeSign}
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden mt-3"
                  >
                    {(() => {
                      const data = activeSign === 'sun'
                        ? { sign: chart.sun, label: 'Sol', color: '#fbbf24', meaning: 'Essencia, identidade, ego e vitalidade. Representa quem voce E no nucleo mais profundo.' }
                        : activeSign === 'moon'
                          ? { sign: chart.moon, label: 'Lua', color: '#e2e8f0', meaning: 'Emocoes, instintos, lar e necessidades internas. Como voce SENTE e o que precisa para seguranca emocional.' }
                          : { sign: chart.ascendant, label: 'Ascendente', color: ACCENT, meaning: 'Mascara social, primeira impressao e aparencia. Como os outros te VEEM e como voce se apresenta ao mundo.' };
                      return (
                        <div
                          className="rounded-2xl p-6"
                          style={{
                            background: `linear-gradient(135deg, ${data.color}08, rgba(26, 11, 46, 0.6))`,
                            border: `1px solid ${data.color}20`,
                          }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{data.sign.symbol}</span>
                            <div>
                              <h4 className="text-2xl font-bold" style={{ color: data.color, fontFamily: 'var(--font-display)' }}>
                                {data.label} em {data.sign.name}
                              </h4>
                              <p className="text-base" style={{ color: '#E0B0FF' }}>
                                {data.sign.dates} · Elemento {data.sign.element === 'fire' ? 'Fogo 🔥' : data.sign.element === 'earth' ? 'Terra 🌍' : data.sign.element === 'air' ? 'Ar 💨' : 'Agua 💧'}
                              </p>
                            </div>
                          </div>
                          <p className="text-lg leading-[1.8] mb-3" style={{ color: 'rgba(255,255,255,0.95)' }}>
                            {data.meaning}
                          </p>
                          <p className="text-lg leading-[1.85]" style={{ color: 'rgba(255,255,255,0.95)' }}>
                            {data.sign.name} e um signo de {data.sign.element === 'fire' ? 'fogo — apaixonado, dinamico e cheio de vitalidade' : data.sign.element === 'earth' ? 'terra — pratico, estavel e conectado ao mundo material' : data.sign.element === 'air' ? 'ar — intelectual, comunicativo e social' : 'agua — emocional, intuitivo e profundamente sensivel'}. Com seu {data.label} nesse signo, essa energia permeia {activeSign === 'sun' ? 'sua identidade central e proposito de vida' : activeSign === 'moon' ? 'seu mundo emocional e vida interior' : 'como voce se apresenta e interage com o mundo exterior'}.
                          </p>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── PLANETS — Animated Solar System ─── */}
            <div>
              <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
                <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
                <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#E0B0FF' }}>
                  🪐 Sistema Planetario
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
              </div>
              <div
                className="rounded-3xl px-3 py-4"
                style={{
                  background: `linear-gradient(180deg, ${ACCENT}06, rgba(26, 11, 46, 0.5))`,
                  border: `1px solid ${ACCENT}10`,
                }}
              >
                <PlanetOrbitalSystem
                  planets={chart.planets}
                  activePlanet={activePlanet}
                  onSelect={(name) => setActivePlanet(activePlanet === name ? null : name)}
                />
              </div>

              {/* Planet detail card */}
              <AnimatePresence mode="wait">
                {activePlanet && (
                  <motion.div
                    key={activePlanet}
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden mt-3"
                  >
                    {(() => {
                      const p = chart.planets.find((pl) => pl.name === activePlanet);
                      if (!p) return null;
                      return (
                        <div
                          className="rounded-2xl p-6"
                          style={{
                            background: `linear-gradient(135deg, ${ACCENT}08, rgba(26, 11, 46, 0.6))`,
                            border: `1px solid ${ACCENT}20`,
                          }}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                              style={{
                                background: `${ACCENT}15`,
                                border: `1px solid ${ACCENT}25`,
                                boxShadow: `0 0 12px ${GLOW}`,
                              }}
                            >
                              {p.icon}
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold" style={{ color: ACCENT, fontFamily: 'var(--font-display)' }}>
                                {p.name} em {p.sign.name}
                              </h4>
                              <p className="text-base" style={{ color: '#E0B0FF' }}>
                                {p.sign.symbol} {p.sign.dates}
                              </p>
                            </div>
                          </div>
                          <p className="text-lg leading-[1.85]" style={{ color: 'rgba(255,255,255,0.95)' }}>
                            {p.analysis}
                          </p>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── HOUSES — Constellation Stars ─── */}
            <div>
              <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
                <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
                <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: '#E0B0FF' }}>
                  🏛️ 12 Casas Astrologicas
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(224, 176, 255, 0.06)' }} />
              </div>
              <div
                className="rounded-3xl px-3 py-4"
                style={{
                  background: `linear-gradient(180deg, ${ACCENT}06, rgba(26, 11, 46, 0.5))`,
                  border: `1px solid ${ACCENT}10`,
                }}
              >
                <ConstellationHouses
                  houses={chart.houses}
                  activeHouse={activeHouse}
                  onSelect={(n) => setActiveHouse(activeHouse === n ? null : n)}
                />
              </div>

              {/* House detail card */}
              <AnimatePresence mode="wait">
                {activeHouse && (
                  <motion.div
                    key={activeHouse}
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden mt-3"
                  >
                    {(() => {
                      const h = chart.houses.find((ho) => ho.number === activeHouse);
                      if (!h) return null;
                      return (
                        <div
                          className="rounded-2xl p-6 space-y-4"
                          style={{
                            background: `linear-gradient(135deg, ${ACCENT}08, rgba(26, 11, 46, 0.6))`,
                            border: `1px solid ${ACCENT}20`,
                          }}
                        >
                          {/* Header */}
                          <div className="flex items-center gap-4">
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                              style={{
                                background: `${ACCENT}15`,
                                border: `1px solid ${ACCENT}25`,
                                boxShadow: `0 0 12px ${GLOW}`,
                              }}
                            >
                              <span className="text-lg font-black" style={{ color: ACCENT }}>{h.number}</span>
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold" style={{ color: ACCENT, fontFamily: 'var(--font-display)' }}>
                                Casa {h.number} — {h.name}
                              </h4>
                              <p className="text-base flex items-center gap-2" style={{ color: '#E0B0FF' }}>
                                <span>{h.sign.symbol} {h.sign.name}</span>
                                <span>·</span>
                                <span className="italic">&ldquo;{h.keyword}&rdquo;</span>
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-lg leading-[1.85]" style={{ color: 'rgba(255,255,255,0.95)' }}>
                            {h.description}
                          </p>

                          {/* Divider */}
                          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}12, transparent)` }} />

                          {/* Personal analysis */}
                          <div
                            className="rounded-xl px-5 py-4"
                            style={{ background: `${ACCENT}05`, border: `1px solid ${ACCENT}08` }}
                          >
                            <p className="text-base font-bold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                              🌟 Sua Interpretacao
                            </p>
                            <p className="text-lg leading-[1.85]" style={{ color: 'rgba(255,255,255,0.95)' }}>
                              {h.analysis}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state — before generation */}
      {!chart && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-6">
          <span className="text-5xl mb-3 opacity-30">♀</span>
          <p className="text-base text-center tracking-wider" style={{ color: '#E0B0FF' }}>
            Preencha seus dados de nascimento para revelar seu mapa celeste
          </p>
        </div>
      )}

      {/* Generating animation */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-10"
        >
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: ACCENT, borderRightColor: `${ACCENT}40` }}
            />
            <div
              className="absolute inset-0 w-20 h-20 rounded-full border-2 border-transparent animate-spin"
              style={{ borderBottomColor: ACCENT_DARK, borderLeftColor: `${ACCENT_DARK}30`, animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-2xl">♀</span>
          </div>
          <p className="text-base mt-4 tracking-wider animate-pulse" style={{ color: ACCENT }}>
            Calculando posicoes celestes...
          </p>
        </motion.div>
      )}
    </div>
  );
}
