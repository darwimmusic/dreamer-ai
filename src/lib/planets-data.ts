export interface PlanetFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: [string, string]; // [from, to] for gradient
}

export interface PlanetData {
  id: string;
  name: string;
  label: string;
  color: string;
  emissiveColor: string;
  accentColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  initialAngle: number;
  description: string;
  icon: string;
  texture?: string;
  features: PlanetFeature[];
}

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercurio',
    label: 'Horoscopo Diario',
    color: '#c4b5fd',
    emissiveColor: '#7c3aed',
    accentColor: '#c4b5fd',
    orbitRadius: 4,
    orbitSpeed: 0.4,
    size: 0.45,
    initialAngle: 0,
    description: 'Previsoes diarias com calculos astronomicos reais',
    icon: '/sprites/mercurio_png.png',
    texture: '/sprites/mercurio_texture.png',
    features: [
      { id: 'daily', title: 'Previsao Diaria', description: 'Insights do dia para seu signo', icon: '\u2728', gradient: ['#7c3aed', '#c4b5fd'] },
      { id: 'lucky', title: 'Numeros da Sorte', description: 'Seu numero de sorte hoje', icon: '\uD83C\uDFB2', gradient: ['#6d28d9', '#a78bfa'] },
      { id: 'compat', title: 'Afinidades', description: 'Signos compativeis com o seu', icon: '\uD83D\uDC9E', gradient: ['#5b21b6', '#8b5cf6'] },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    label: 'Mapa Astral',
    color: '#f0abcf',
    emissiveColor: '#be185d',
    accentColor: '#f0abcf',
    orbitRadius: 5.5,
    orbitSpeed: 0.3,
    size: 0.6,
    initialAngle: Math.PI * 0.5,
    description: 'Mapa natal com data, hora e local de nascimento',
    icon: '/sprites/venus_png.png',
    texture: '/sprites/venus_texture.png',
    features: [
      { id: 'chart', title: 'Gerar Mapa', description: 'Calcule seu mapa natal completo', icon: '\uD83C\uDF1F', gradient: ['#be185d', '#f0abcf'] },
      { id: 'planets', title: 'Planetas', description: 'Significado de cada planeta', icon: '\uD83E\uDE90', gradient: ['#9d174d', '#e879b8'] },
      { id: 'houses', title: '12 Casas', description: 'Areas da sua vida astrologica', icon: '\uD83C\uDFDB\uFE0F', gradient: ['#831843', '#f472b6'] },
    ],
  },
  {
    id: 'mars',
    name: 'Marte',
    label: 'Tarot',
    color: '#e879b8',
    emissiveColor: '#9d174d',
    accentColor: '#e879b8',
    orbitRadius: 7,
    orbitSpeed: 0.25,
    size: 0.55,
    initialAngle: Math.PI,
    description: 'Tiragem de 3 cartas com interpretacao mistica',
    icon: '/sprites/marte_png.png',
    texture: '/sprites/marte_texture.jpeg',
    features: [
      { id: 'draw', title: 'Tiragem', description: 'Tire 3 cartas do destino', icon: '\uD83C\uDCCF', gradient: ['#9d174d', '#e879b8'] },
      { id: 'major', title: 'Arcanos Maiores', description: '22 cartas e seus significados', icon: '\u2604\uFE0F', gradient: ['#be185d', '#f0abcf'] },
      { id: 'guide', title: 'Como Interpretar', description: 'Guia de leitura de tarot', icon: '\uD83D\uDCD6', gradient: ['#831843', '#ec4899'] },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    label: 'Sonhos',
    color: '#a78bfa',
    emissiveColor: '#5b21b6',
    accentColor: '#a78bfa',
    orbitRadius: 9,
    orbitSpeed: 0.15,
    size: 0.9,
    initialAngle: Math.PI * 1.3,
    description: 'Dicionario de simbolos oniricos',
    icon: '/sprites/jupiter_png.png',
    texture: '/sprites/jupiter_texture.jpeg',
    features: [
      { id: 'search', title: 'Buscar Simbolos', description: 'Descubra o que seu sonho significa', icon: '\uD83D\uDD0D', gradient: ['#5b21b6', '#a78bfa'] },
      { id: 'categories', title: 'Categorias', description: 'Explore por tipo de simbolo', icon: '\uD83D\uDDC2\uFE0F', gradient: ['#6d28d9', '#c4b5fd'] },
      { id: 'journal', title: 'Diario Onirico', description: 'Registre e analise seus sonhos', icon: '\uD83D\uDCDD', gradient: ['#4c1d95', '#8b5cf6'] },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturno',
    label: 'Compatibilidade',
    color: '#c084fc',
    emissiveColor: '#6b21a8',
    accentColor: '#c084fc',
    orbitRadius: 11,
    orbitSpeed: 0.1,
    size: 0.8,
    initialAngle: Math.PI * 0.7,
    description: 'Analise de compatibilidade entre 2 signos',
    icon: '/sprites/saturno_png.png',
    texture: '/sprites/saturno_texture.png',
    features: [
      { id: 'love', title: 'Amor', description: 'Compatibilidade romantica', icon: '\u2764\uFE0F', gradient: ['#6b21a8', '#c084fc'] },
      { id: 'friendship', title: 'Amizade', description: 'Sintonia entre amigos', icon: '\uD83E\uDD1D', gradient: ['#7c3aed', '#a78bfa'] },
      { id: 'work', title: 'Trabalho', description: 'Parceria profissional', icon: '\uD83D\uDCBC', gradient: ['#5b21b6', '#8b5cf6'] },
    ],
  },
  {
    id: 'moon',
    name: 'Lua',
    label: 'Fases da Lua',
    color: '#f5e6ff',
    emissiveColor: '#d8b4fe',
    accentColor: '#f5e6ff',
    orbitRadius: 13,
    orbitSpeed: 0.08,
    size: 0.5,
    initialAngle: Math.PI * 1.7,
    description: 'Calendario lunar e significados',
    icon: '/sprites/lua_png.png',
    texture: '/sprites/lua_texture.jpeg',
    features: [
      { id: 'today', title: 'Fase Atual', description: 'A lua de hoje e seus efeitos', icon: '\uD83C\uDF19', gradient: ['#7c3aed', '#d8b4fe'] },
      { id: 'calendar', title: 'Calendario', description: 'Todas as fases do mes', icon: '\uD83D\uDCC5', gradient: ['#6d28d9', '#c4b5fd'] },
      { id: 'rituals', title: 'Rituais', description: 'Dicas para cada fase lunar', icon: '\uD83D\uDD6F\uFE0F', gradient: ['#5b21b6', '#a78bfa'] },
    ],
  },
  {
    id: 'neptune',
    name: 'Netuno',
    label: 'Meditacao',
    color: '#818cf8',
    emissiveColor: '#4338ca',
    accentColor: '#818cf8',
    orbitRadius: 15,
    orbitSpeed: 0.05,
    size: 0.75,
    initialAngle: Math.PI * 0.3,
    description: 'Meditacoes e rituais alinhados com ciclos cosmicos',
    icon: '/sprites/netuno_png.png',
    texture: '/sprites/netuno_texture.png',
    features: [
      { id: 'guided', title: 'Meditacao Guiada', description: 'Sessoes com timer cosmico', icon: '\uD83E\uDDD8', gradient: ['#4338ca', '#818cf8'] },
      { id: 'breathing', title: 'Respiracao', description: 'Tecnicas de respiracao consciente', icon: '\uD83C\uDF2C\uFE0F', gradient: ['#3730a3', '#6366f1'] },
      { id: 'rituals', title: 'Rituais Lunares', description: 'Rituais alinhados com a lua', icon: '\u2728', gradient: ['#312e81', '#a5b4fc'] },
    ],
  },
];

export const GALAXY_CAMERA_POSITION: [number, number, number] = [0, 18, 28];
export const GALAXY_CAMERA_TARGET: [number, number, number] = [0, 0, 0];
