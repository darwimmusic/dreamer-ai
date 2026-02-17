/* ─── Moon Rituals Engine ───
 * Ritual data for each of the 8 moon phases.
 * Each phase has a full ritual with steps, materials, and affirmation.
 * All content in Brazilian Portuguese with authentic mystical tone.
 */

export interface MoonRitual {
  phaseName: string;
  ritualName: string;
  intention: string;
  duration: string;
  bestTime: string;
  materials: string[];
  steps: { step: number; title: string; description: string }[];
  affirmation: string;
  element: 'agua' | 'fogo' | 'terra' | 'ar';
  elementIcon: string;
}

export const MOON_RITUALS: MoonRitual[] = [
  {
    phaseName: 'Lua Nova',
    ritualName: 'Ritual de Semeadura',
    intention: 'Plantar sementes de intencao para o novo ciclo lunar',
    duration: '15-20 min',
    bestTime: 'Ao anoitecer',
    materials: ['Papel e caneta', 'Uma vela branca ou prata', 'Incenso de lavanda ou salvia'],
    steps: [
      { step: 1, title: 'Prepare o espaco', description: 'Acenda a vela e o incenso. Sente-se confortavelmente em um lugar tranquilo. Feche os olhos e respire profundamente tres vezes.' },
      { step: 2, title: 'Limpe o ciclo anterior', description: 'Visualize uma luz prateada envolvendo seu corpo, dissolvendo energias residuais do ciclo que se encerrou.' },
      { step: 3, title: 'Escreva suas intencoes', description: 'No papel, escreva de 3 a 5 intencoes claras para este ciclo. Use tempo presente, como se ja fossem realidade.' },
      { step: 4, title: 'Energize com a chama', description: 'Segure o papel proximo a vela (sem queimar). Visualize cada intencao ganhando vida com a luz da chama.' },
      { step: 5, title: 'Sele com gratidao', description: 'Agradeca ao universo pela oportunidade de comecar novamente. Guarde o papel em um lugar especial ate a lua cheia.' },
    ],
    affirmation: 'Eu planto sementes de luz no solo fertil deste novo ciclo. Cada intencao germina no tempo perfeito.',
    element: 'terra',
    elementIcon: '🌱',
  },
  {
    phaseName: 'Crescente Inicial',
    ritualName: 'Ritual de Ativacao',
    intention: 'Dar energia e movimento as intencoes plantadas',
    duration: '10-15 min',
    bestTime: 'Pela manha',
    materials: ['Cristal de citrino ou quartzo', 'Agua fresca em um copo de vidro', 'Musica suave instrumental'],
    steps: [
      { step: 1, title: 'Desperte a energia', description: 'Coloque musica suave. Segure o cristal entre as maos e sinta seu calor. Respire profundamente cinco vezes.' },
      { step: 2, title: 'Energize a agua', description: 'Coloque o cristal ao lado do copo de agua. Visualize luz dourada fluindo do cristal para a agua.' },
      { step: 3, title: 'Declare suas intencoes', description: 'Em voz alta ou mentalmente, repita cada intencao que escreveu na lua nova. Sinta a conviccao em cada palavra.' },
      { step: 4, title: 'Beba a agua energizada', description: 'Beba a agua lentamente, sentindo a energia das suas intencoes preenchendo cada celula do seu corpo.' },
    ],
    affirmation: 'A energia cresce dentro de mim. Minhas intencoes ganham forca e direcao com cada novo dia.',
    element: 'agua',
    elementIcon: '💧',
  },
  {
    phaseName: 'Quarto Crescente',
    ritualName: 'Ritual de Coragem',
    intention: 'Fortalecer a determinacao para superar obstaculos',
    duration: '15 min',
    bestTime: 'Ao meio-dia',
    materials: ['Uma vela vermelha ou laranja', 'Papel com lista de obstaculos', 'Recipiente seguro para queima'],
    steps: [
      { step: 1, title: 'Identifique os bloqueios', description: 'Escreva no papel tudo que esta impedindo o avanco das suas intencoes. Seja honesto e especifico.' },
      { step: 2, title: 'Acenda a chama da coragem', description: 'Acenda a vela e olhe fixamente para a chama por um minuto. Sinta o fogo interior despertando sua determinacao.' },
      { step: 3, title: 'Transmute os obstaculos', description: 'Queime o papel no recipiente seguro. Enquanto o fogo consome as palavras, visualize cada obstaculo se transformando em combustivel para seu avanco.' },
      { step: 4, title: 'Comprometa-se', description: 'Coloque a mao no coracao e faca um compromisso consigo mesmo: "Eu escolho avancar, mesmo quando e dificil."' },
    ],
    affirmation: 'Eu tenho a forca necessaria para superar qualquer obstaculo. Cada desafio me torna mais forte e mais sabio.',
    element: 'fogo',
    elementIcon: '🔥',
  },
  {
    phaseName: 'Crescente Gibosa',
    ritualName: 'Ritual de Refinamento',
    intention: 'Ajustar o curso e refinar detalhes antes da plenitude',
    duration: '10-15 min',
    bestTime: 'Ao entardecer',
    materials: ['Diario ou caderno', 'Cha de camomila ou erva-doce', 'Espaco silencioso'],
    steps: [
      { step: 1, title: 'Prepare o cha da clareza', description: 'Prepare seu cha com intencao. Enquanto a agua ferve, reflita sobre o progresso do ciclo ate aqui.' },
      { step: 2, title: 'Faca um inventario', description: 'No diario, liste o que avancou, o que precisa de ajuste, e o que pode ser simplificado.' },
      { step: 3, title: 'Refine com precisao', description: 'Para cada item que precisa de ajuste, escreva a acao especifica que tomara nos proximos dias.' },
      { step: 4, title: 'Confie no processo', description: 'Beba o cha lentamente. Com cada gole, solte a ansiedade e confie que tudo se alinha no tempo certo.' },
    ],
    affirmation: 'Eu refino meu caminho com sabedoria e paciencia. Cada ajuste me aproxima da minha melhor versao.',
    element: 'ar',
    elementIcon: '💨',
  },
  {
    phaseName: 'Lua Cheia',
    ritualName: 'Ritual de Plenitude',
    intention: 'Celebrar conquistas e liberar o que nao serve mais',
    duration: '20-30 min',
    bestTime: 'Sob a luz da lua',
    materials: ['Agua em uma tigela de vidro', 'Vela branca', 'Papel das intencoes da lua nova', 'Flores ou ervas frescas'],
    steps: [
      { step: 1, title: 'Banho de lua', description: 'Se possivel, posicione a tigela de agua sob a luz da lua cheia. Coloque as flores na agua. Este e seu elixir lunar.' },
      { step: 2, title: 'Releia suas intencoes', description: 'Abra o papel da lua nova e releia cada intencao. Celebre o que se manifestou. Agradeca profundamente.' },
      { step: 3, title: 'Libere com graca', description: 'Identifique o que nao serve mais — medos, habitos, crencas limitantes. Escreva-os em outro papel e queime com a vela.' },
      { step: 4, title: 'Energize-se', description: 'Lave as maos e o rosto com a agua lunar. Sinta a energia da lua cheia purificando e renovando todo seu ser.' },
      { step: 5, title: 'Gratidao plena', description: 'Sob a luz da lua, agradeca por tudo que e e tudo que tem. A plenitude ja esta dentro de voce.' },
    ],
    affirmation: 'Eu celebro minha plenitude. Libero com amor o que ja cumpriu seu proposito e abro espaco para o extraordinario.',
    element: 'agua',
    elementIcon: '🌊',
  },
  {
    phaseName: 'Minguante Gibosa',
    ritualName: 'Ritual de Partilha',
    intention: 'Compartilhar sabedoria e devolver ao universo',
    duration: '15 min',
    bestTime: 'Fim da tarde',
    materials: ['Diario ou caderno', 'Vela azul ou roxa', 'Musica meditativa'],
    steps: [
      { step: 1, title: 'Reflita sobre aprendizados', description: 'Com a vela acesa e musica suave, escreva no diario as 3 maiores licoes que este ciclo trouxe.' },
      { step: 2, title: 'Identifique quem pode se beneficiar', description: 'Pense em pessoas ao seu redor que poderiam se beneficiar da sua experiencia. Como voce pode compartilhar?' },
      { step: 3, title: 'Ato de generosidade', description: 'Planeje um ato concreto de generosidade para os proximos dias — pode ser simples como uma mensagem de apoio.' },
      { step: 4, title: 'Devocao ao todo', description: 'Visualize sua sabedoria como luz que se expande do seu coracao para o mundo, tocando todos que precisam.' },
    ],
    affirmation: 'Eu compartilho minha luz com generosidade. Ao dar, eu recebo. Ao ensinar, eu aprendo.',
    element: 'ar',
    elementIcon: '✨',
  },
  {
    phaseName: 'Quarto Minguante',
    ritualName: 'Ritual de Desapego',
    intention: 'Liberar padroes, emocoes e situacoes que pesam',
    duration: '15-20 min',
    bestTime: 'A noite, antes de dormir',
    materials: ['Sal grosso', 'Agua morna para escalda-pes ou banho', 'Vela preta ou roxa escura'],
    steps: [
      { step: 1, title: 'Prepare o banho de liberacao', description: 'Dissolva o sal grosso na agua morna. Acenda a vela. Crie um ambiente de recolhimento e silencio.' },
      { step: 2, title: 'Identifique o peso', description: 'De olhos fechados, escaneie seu corpo e mente. O que pesa? Magoas, culpas, habitos, relacoes? Nomeie cada um.' },
      { step: 3, title: 'Entregue a agua', description: 'Mergulhe os pes (ou todo o corpo) na agua salgada. Com cada respiracao, visualize o peso sendo absorvido pela agua.' },
      { step: 4, title: 'Declare a liberacao', description: 'Em voz alta, diga: "Eu libero com amor tudo que ja cumpriu seu proposito na minha vida." Repita tres vezes.' },
      { step: 5, title: 'Descarte a agua', description: 'Jogue a agua fora (preferencialmente em agua corrente ou na terra). Ela leva embora o que voce liberou.' },
    ],
    affirmation: 'Eu solto com graca o que nao me pertence mais. No vazio que fica, nasce espaco para o novo.',
    element: 'agua',
    elementIcon: '🌊',
  },
  {
    phaseName: 'Minguante Final',
    ritualName: 'Ritual de Repouso Sagrado',
    intention: 'Descansar profundamente antes do proximo ciclo',
    duration: '10-15 min',
    bestTime: 'Antes de dormir',
    materials: ['Travesseiro confortavel', 'Oleo essencial de lavanda (opcional)', 'Silencio ou sons da natureza'],
    steps: [
      { step: 1, title: 'Crie um santuario de paz', description: 'Desligue telas e luzes fortes. Se tiver oleo de lavanda, coloque uma gota no travesseiro. Sons de chuva ou floresta ao fundo.' },
      { step: 2, title: 'Escaneamento corporal', description: 'Deite-se e, dos pes a cabeca, conscientemente relaxe cada parte do corpo. Solte toda tensao acumulada.' },
      { step: 3, title: 'Revisao gentil', description: 'Sem julgamento, repasse mentalmente o ciclo lunar inteiro. Aceite tudo que foi, exatamente como foi.' },
      { step: 4, title: 'Rendição ao descanso', description: 'Sussurre: "Eu me rendo ao descanso sagrado. Confio que o proximo ciclo trara exatamente o que preciso." Durma.' },
    ],
    affirmation: 'No silencio do repouso, minha alma se renova. Eu confio no ritmo natural da vida e me entrego a paz.',
    element: 'terra',
    elementIcon: '🌿',
  },
];

/* ─── Element Colors ─── */

export const ELEMENT_STYLES: Record<string, { color: string; bg: string }> = {
  agua: { color: '#7dd3fc', bg: 'rgba(125, 211, 252, 0.08)' },
  fogo: { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.08)' },
  terra: { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.08)' },
  ar: { color: '#c4b5fd', bg: 'rgba(196, 181, 253, 0.08)' },
};
