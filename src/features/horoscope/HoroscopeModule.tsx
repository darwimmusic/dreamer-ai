'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { glassCard, DS_COLORS } from '@/lib/design-system';

/* ─── Data ─── */

const ELEMENT_COLORS: Record<string, { gradient: [string, string]; glow: string; label: string; icon: string }> = {
  fire:  { gradient: ['#e879b8', '#f97316'], glow: 'rgba(232,121,184,0.4)', label: 'Fogo', icon: '🔥' },
  earth: { gradient: ['#a78bfa', '#6d28d9'], glow: 'rgba(167,139,250,0.4)', label: 'Terra', icon: '🌍' },
  air:   { gradient: ['#818cf8', '#c4b5fd'], glow: 'rgba(129,140,248,0.4)', label: 'Ar', icon: '💨' },
  water: { gradient: ['#c084fc', '#be185d'], glow: 'rgba(192,132,252,0.4)', label: 'Agua', icon: '💧' },
};

const DAILY_READINGS: Record<string, { title: string; overview: string; love: string; career: string; health: string; advice: string }[]> = {
  fire: [
    {
      title: 'Chamas de Renovacao 🔥',
      overview: 'Sua energia esta em alta hoje. O universo alinha forcas poderosas a seu favor — este e o momento de agir com coragem e determinacao. Projetos que pareciam estagnados ganham novo folego. Aproveite para iniciar o que estava adiando, pois Marte impulsiona sua vontade e o sol ilumina seus caminhos com clareza.',
      love: 'No amor, a paixao queima intensa. Se esta em um relacionamento, surpreenda seu par com algo espontaneo. Solteiros podem sentir uma conexao magnetica com alguem inesperado. 💕',
      career: 'Profissionalmente, voce esta irradiando confianca. Colegas e superiores notam sua determinacao. Bom momento para pedir aquilo que merece ou apresentar ideias ousadas. 💼',
      health: 'Canalize o excesso de energia em atividades fisicas intensas. Seu corpo pede movimento — corra, dance, ou pratique artes marciais. Evite ficar parado. 🏃',
      advice: 'Nao confunda impulsividade com coragem. Respire antes de reagir e escolha suas batalhas com sabedoria.',
    },
    {
      title: 'Aurora Interior ☀️',
      overview: 'O sol ilumina seus caminhos mais profundos. Tome decisoes com coragem — o universo apoia sua ousadia. Hoje e um dia de clareza mental e forca interior. Questoes que pareciam confusas se desembaracam. Confie na sua intuicao de fogo e avance sem medo.',
      love: 'Hoje o amor pede autenticidade. Seja verdadeiro sobre o que sente, sem jogos ou mascaras. A vulnerabilidade e sua maior forca romantica agora. 🌹',
      career: 'No trabalho, uma oportunidade de lideranca pode surgir. Aceite o desafio — voce esta mais preparado do que imagina. Seus instintos profissionais estao afiados. 🎯',
      health: 'Preste atencao a sua alimentacao. Seu corpo precisa de combustivel de qualidade para manter essa chama acesa. Hidrate-se bem. 💧',
      advice: 'A luz que voce busca fora ja existe dentro de voce. Olhe para dentro antes de procurar respostas no mundo.',
    },
    {
      title: 'Impulso de Marte ⚡',
      overview: 'Marte traz impulso extra e uma dose generosa de determinacao. O guerreiro interior desperta — canalize essa forca em atividades fisicas ou criativas. Projetos criativos ganham uma faisca especial. Evite discussoes desnecessarias, pois a mesma energia que constroi pode destruir se mal direcionada.',
      love: 'Intensidade define o amor hoje. Conversas profundas e momentos de intimidade podem transformar seu relacionamento. Solteiros atraem personalidades fortes. 🔥',
      career: 'Competitividade saudavel no trabalho. Use sua ambicao para se destacar, mas cuide para nao atropelar aliados no caminho. Diplomacia e forca combinam bem. 🏆',
      health: 'Energia de sobra — mas cuidado com excessos. Equilibre exercicios intensos com momentos de descanso. Seu corpo precisa de recuperacao tanto quanto de acao. 🧘',
      advice: 'A verdadeira forca nao esta em vencer todos os obstaculos, mas em saber quais merecem seu esforco.',
    },
  ],
  earth: [
    {
      title: 'Raizes Profundas 🌱',
      overview: 'Momento ideal para organizar financas e planejar o futuro com pe no chao e visao clara. A terra firma sustenta seus passos — confie no processo lento e consistente. Resultados que voce plantou semanas atras comecam a brotar. Paciencia e praticidade sao suas melhores aliadas hoje.',
      love: 'No amor, busque estabilidade e seguranca. Pequenos gestos de cuidado valem mais que grandes declaracoes. Construa intimidade atraves da presenca constante. 🌿',
      career: 'Financas em destaque. Revise seus investimentos e planeje com visao de longo prazo. Uma proposta solida pode chegar — analise com calma antes de aceitar. 📊',
      health: 'Corpo e templo. Cuide da alimentacao com ingredientes naturais e frescos. Uma caminhada ao ar livre pode renovar completamente sua energia. 🍃',
      advice: 'As maiores arvores cresceram devagar. Confie no seu ritmo e nao compare sua jornada com a dos outros.',
    },
    {
      title: 'Fortaleza Interior 🏔️',
      overview: 'A terra pede estabilidade e foco. Cuide do corpo e do ambiente ao seu redor — seu equilibrio emocional depende dessas fundacoes. Organize seu espaco fisico para clarear a mente. Este e um dia para construir, nao para destruir. Cada pequena acao contribui para algo maior.',
      love: 'Relacionamentos pedem dialogo honesto. Resolva pendencias com maturidade e sem rodeios. A verdade fortalece lacos que a mentira corroi. 💚',
      career: 'Disciplina e metodo levam ao sucesso. Complete tarefas pendentes antes de iniciar novas. Sua reputacao de confiabilidade esta sendo notada. 📋',
      health: 'Atencao especial a postura e coluna. Se trabalha sentado, faca pausas regulares para alongar. Seu corpo agradece os pequenos cuidados. 🧎',
      advice: 'Nao confunda rotina com monotonia. Ha beleza profunda na consistencia de quem sabe o que quer.',
    },
    {
      title: 'Cristal de Saturno 💎',
      overview: 'Saturno favorece disciplina e estrutura. Foque no que realmente importa e construa algo duradouro. Corte distracoes e compromissos que nao servem ao seu proposito maior. Hoje e dia de decisoes que afetam o longo prazo — escolha com a sabedoria de quem pensa em decadas, nao em dias.',
      love: 'Amor maduro e o tema. Se esta em um relacionamento, discuta planos futuros com seriedade. Solteiros devem buscar conexoes com substancia, nao apenas atracao. 💍',
      career: 'Excelente dia para negociacoes e contratos. Sua visao estrategica esta afiada. Aproveite para fechar acordos importantes ou renegociar termos. 🤝',
      health: 'Ossos e articulacoes pedem atencao. Considere suplementacao de calcio e pratique exercicios de baixo impacto. Prevencao e o melhor remedio. 🦴',
      advice: 'A pressao que Saturno exerce hoje nao e para te quebrar — e para transformar carvao em diamante.',
    },
  ],
  air: [
    {
      title: 'Ventos da Mente 🗣️',
      overview: 'Comunicacao em destaque absoluto. Expresse suas ideias com clareza e conviccao — sua palavra tem poder transformador hoje. Conversas podem mudar rumos, mensagens podem abrir portas. Mercurio favorece a articulacao verbal e escrita. Aproveite para resolver mal-entendidos e criar pontes.',
      love: 'Palavras de afirmacao sao a chave do amor hoje. Diga o que sente com eloquencia. Uma conversa franca pode curar feridas antigas e abrir novos capitulos. 💬',
      career: 'Networking em alta. Participe de eventos, responda mensagens pendentes e amplie seu circulo profissional. Uma conexao inesperada pode gerar uma grande oportunidade. 🌐',
      health: 'Mente agitada precisa de valvulas de escape. Meditacao, escrita livre ou conversa com amigos ajudam a organizar o turbilhao de pensamentos. 🧠',
      advice: 'As palavras que voce escolhe constroem ou destroem mundos. Escolha-as como quem esculpe uma obra de arte.',
    },
    {
      title: 'Biblioteca Cosmica 📚',
      overview: 'Mercurio ativa sua mente com intensidade rara. Este e um dia excepcional para estudar, aprender e expandir horizontes intelectuais. Informacoes importantes podem chegar de fontes inesperadas — esteja atento a sinais, livros que cruzam seu caminho e conversas aparentemente casuais.',
      love: 'No amor, a conexao intelectual prevalece. Compartilhe ideias, debata com respeito e descubra novos interesses em comum. Mentes alinhadas atraem coracoes. 🧩',
      career: 'Dia propicio para aprendizado e capacitacao. Invista em cursos, leituras tecnicas ou mentoria. O conhecimento adquirido hoje tera retorno multiplicado. 🎓',
      health: 'Cuidado com o excesso de estimulos mentais. Equilibre estudo com momentos de silencio. Seu cerebro precisa de pausas para consolidar o aprendizado. 😌',
      advice: 'O verdadeiro sabio nao e quem sabe tudo, mas quem nunca para de perguntar.',
    },
    {
      title: 'Encontro de Almas 🤝',
      overview: 'Conexoes sociais trazem oportunidades inesperadas e transformadoras. Esteja aberto a novos encontros, ideias e perspectivas que desafiam seu modo de pensar. Alguem que voce conhece hoje pode se tornar importante em sua jornada. O ar circula, mistura e cria — deixe-se levar por essa brisa de possibilidades.',
      love: 'Amor leve e descomplicado e o tema. Ria mais, cobre menos. Solteiros podem encontrar interesse romantico em circulos sociais ou eventos culturais. 🦋',
      career: 'Colaboracao e a palavra-chave. Projetos em equipe fluem melhor que esforcos solitarios. Compartilhe creditos generosamente e recebera lealdade em troca. 🤲',
      health: 'Atividades sociais alimentam sua saude mental. Nao se isole — encontre amigos, participe de grupos ou simplesmente converse com desconhecidos. 💛',
      advice: 'Cada pessoa que cruza seu caminho carrega uma licao. A arte esta em reconhecer qual licao cada encontro oferece.',
    },
  ],
  water: [
    {
      title: 'Mares da Alma 🌊',
      overview: 'Emocoes intensas e profundas pedem sua atencao completa. Pratique autocuidado radical e honre o que sente por dentro — cada onda emocional carrega uma mensagem. A sensibilidade esta ampliada, tornando voce mais empatico e perceptivo. Use essa habilidade para compreender os outros, mas proteja seus limites.',
      love: 'No amor, profundidade e a palavra. Conexoes superficiais nao satisfazem — busque intimidade verdadeira. Vulnerabilidade compartilhada cria lacos inquebraveis. 💙',
      career: 'Sua intuicao profissional esta apurada. Confie no que sente sobre pessoas e situacoes, mesmo sem evidencias logicas. Voce percebe o que outros nao veem. 🔍',
      health: 'Agua e seu elemento curativo. Banhos longos, natacao ou simplesmente beber mais agua trazem equilibrio. Seu corpo responde ao elemento que o governa. 🛁',
      advice: 'As emocoes sao como o oceano — voce nao pode controlar as ondas, mas pode aprender a surfar.',
    },
    {
      title: 'Lua Interior 🌙',
      overview: 'A Lua amplifica dramaticamente sua intuicao natural. Confie nos seus sentimentos mais profundos — eles conhecem o caminho mesmo quando a mente hesita. Sonhos podem trazer mensagens simbolicas importantes esta noite. Preste atencao aos detalhes que outros ignoram, pois neles se escondem verdades poderosas.',
      love: 'O amor flui como um rio sob o luar. Momentos de silencio compartilhado valem mais que mil palavras. Deixe o coracao guiar — ele sabe o que a mente ainda nao entende. 🥀',
      career: 'Criatividade em alta no trabalho. Abordagens nao convencionais podem resolver problemas antigos. Confie nas suas ideias, mesmo as mais estranhas. 🌀',
      health: 'Sono e descanso sao prioritarios. Seu corpo se regenera profundamente durante o sono — respeite seus ciclos naturais. Um cochilo pode fazer milagres. 💤',
      advice: 'A lua nao compete com o sol — ela brilha na escuridao. Encontre sua luz propria nos momentos de sombra.',
    },
    {
      title: 'Inspiracao de Netuno 🎨',
      overview: 'Netuno inspira uma onda de criatividade avassaladora. Deixe a imaginacao fluir livremente e crie sem medo de errar ou ser julgado. A arte — em qualquer forma — e seu canal de cura hoje. Musica, pintura, escrita, danca... qualquer expressao criativa ativa portais de transformacao interior profunda.',
      love: 'Romance e fantasia se misturam. Surpreenda quem ama com algo poetico e inesperado. Solteiros podem se apaixonar por alguem artistico ou misterioso. 🎭',
      career: 'Projetos criativos brilham. Se trabalha com arte, design ou comunicacao, este e seu dia de ouro. Mesmo em areas tecnicas, a criatividade resolve impasses. ✨',
      health: 'Musicoterapia, arte-terapia ou qualquer pratica criativa funciona como remedio. Seu corpo cura quando a alma se expressa. Permita-se criar sem julgamento. 🎶',
      advice: 'Criar nao e um luxo — e uma necessidade da alma. Quando voce cria, o universo cria atraves de voce.',
    },
  ],
};

function getDailyReading(element: string) {
  const readings = DAILY_READINGS[element] || DAILY_READINGS.fire;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return readings[dayOfYear % readings.length];
}

/* ─── Per-sign unique aspect values ─── */
const SIGN_ASPECTS: Record<string, { love: number; career: number; health: number; luck: number; spirit: number; energy: number }> = {
  aries:       { love: 78, career: 92, health: 85, luck: 70, spirit: 65, energy: 95 },
  taurus:      { love: 88, career: 75, health: 90, luck: 60, spirit: 72, energy: 55 },
  gemini:      { love: 65, career: 80, health: 60, luck: 92, spirit: 88, energy: 78 },
  cancer:      { love: 95, career: 58, health: 82, luck: 72, spirit: 90, energy: 48 },
  leo:         { love: 82, career: 95, health: 75, luck: 85, spirit: 60, energy: 92 },
  virgo:       { love: 60, career: 88, health: 95, luck: 55, spirit: 78, energy: 70 },
  libra:       { love: 92, career: 72, health: 68, luck: 88, spirit: 82, energy: 62 },
  scorpio:     { love: 88, career: 78, health: 72, luck: 65, spirit: 95, energy: 85 },
  sagittarius: { love: 70, career: 68, health: 78, luck: 95, spirit: 72, energy: 90 },
  capricorn:   { love: 55, career: 98, health: 88, luck: 48, spirit: 65, energy: 75 },
  aquarius:    { love: 62, career: 75, health: 65, luck: 82, spirit: 95, energy: 72 },
  pisces:      { love: 95, career: 52, health: 70, luck: 78, spirit: 92, energy: 45 },
};

function getSignAspects(signId: string) {
  const base = SIGN_ASPECTS[signId] || SIGN_ASPECTS.aries;
  const dayShift = new Date().getDate() % 10;
  return {
    love:   Math.min(100, Math.max(25, base.love + dayShift - 5)),
    career: Math.min(100, Math.max(25, base.career - dayShift + 3)),
    health: Math.min(100, Math.max(25, base.health + dayShift - 4)),
    luck:   Math.min(100, Math.max(25, base.luck - dayShift + 6)),
    spirit: Math.min(100, Math.max(25, base.spirit + dayShift - 2)),
    energy: Math.min(100, Math.max(25, base.energy - dayShift + 4)),
  };
}

/* ─── Affinity data ─── */
const SIGN_AFFINITIES: Record<string, { id: string; name: string; symbol: string; strength: number }[]> = {
  aries:       [{ id:'leo', name:'Leao', symbol:'♌', strength:95 }, { id:'sagittarius', name:'Sagitario', symbol:'♐', strength:90 }, { id:'gemini', name:'Gemeos', symbol:'♊', strength:78 }, { id:'aquarius', name:'Aquario', symbol:'♒', strength:72 }, { id:'libra', name:'Libra', symbol:'♎', strength:68 }],
  taurus:      [{ id:'virgo', name:'Virgem', symbol:'♍', strength:94 }, { id:'capricorn', name:'Capricornio', symbol:'♑', strength:90 }, { id:'cancer', name:'Cancer', symbol:'♋', strength:82 }, { id:'pisces', name:'Peixes', symbol:'♓', strength:75 }, { id:'scorpio', name:'Escorpiao', symbol:'♏', strength:70 }],
  gemini:      [{ id:'libra', name:'Libra', symbol:'♎', strength:93 }, { id:'aquarius', name:'Aquario', symbol:'♒', strength:88 }, { id:'aries', name:'Aries', symbol:'♈', strength:78 }, { id:'leo', name:'Leao', symbol:'♌', strength:72 }, { id:'sagittarius', name:'Sagitario', symbol:'♐', strength:65 }],
  cancer:      [{ id:'scorpio', name:'Escorpiao', symbol:'♏', strength:96 }, { id:'pisces', name:'Peixes', symbol:'♓', strength:92 }, { id:'taurus', name:'Touro', symbol:'♉', strength:82 }, { id:'virgo', name:'Virgem', symbol:'♍', strength:75 }, { id:'capricorn', name:'Capricornio', symbol:'♑', strength:68 }],
  leo:         [{ id:'aries', name:'Aries', symbol:'♈', strength:95 }, { id:'sagittarius', name:'Sagitario', symbol:'♐', strength:92 }, { id:'gemini', name:'Gemeos', symbol:'♊', strength:80 }, { id:'libra', name:'Libra', symbol:'♎', strength:76 }, { id:'aquarius', name:'Aquario', symbol:'♒', strength:65 }],
  virgo:       [{ id:'taurus', name:'Touro', symbol:'♉', strength:94 }, { id:'capricorn', name:'Capricornio', symbol:'♑', strength:90 }, { id:'cancer', name:'Cancer', symbol:'♋', strength:80 }, { id:'scorpio', name:'Escorpiao', symbol:'♏', strength:75 }, { id:'pisces', name:'Peixes', symbol:'♓', strength:68 }],
  libra:       [{ id:'gemini', name:'Gemeos', symbol:'♊', strength:93 }, { id:'aquarius', name:'Aquario', symbol:'♒', strength:90 }, { id:'leo', name:'Leao', symbol:'♌', strength:78 }, { id:'sagittarius', name:'Sagitario', symbol:'♐', strength:72 }, { id:'aries', name:'Aries', symbol:'♈', strength:65 }],
  scorpio:     [{ id:'cancer', name:'Cancer', symbol:'♋', strength:96 }, { id:'pisces', name:'Peixes', symbol:'♓', strength:92 }, { id:'virgo', name:'Virgem', symbol:'♍', strength:78 }, { id:'capricorn', name:'Capricornio', symbol:'♑', strength:74 }, { id:'taurus', name:'Touro', symbol:'♉', strength:70 }],
  sagittarius: [{ id:'aries', name:'Aries', symbol:'♈', strength:92 }, { id:'leo', name:'Leao', symbol:'♌', strength:90 }, { id:'libra', name:'Libra', symbol:'♎', strength:76 }, { id:'aquarius', name:'Aquario', symbol:'♒', strength:72 }, { id:'gemini', name:'Gemeos', symbol:'♊', strength:65 }],
  capricorn:   [{ id:'taurus', name:'Touro', symbol:'♉', strength:92 }, { id:'virgo', name:'Virgem', symbol:'♍', strength:90 }, { id:'scorpio', name:'Escorpiao', symbol:'♏', strength:78 }, { id:'pisces', name:'Peixes', symbol:'♓', strength:72 }, { id:'cancer', name:'Cancer', symbol:'♋', strength:65 }],
  aquarius:    [{ id:'gemini', name:'Gemeos', symbol:'♊', strength:90 }, { id:'libra', name:'Libra', symbol:'♎', strength:88 }, { id:'sagittarius', name:'Sagitario', symbol:'♐', strength:76 }, { id:'aries', name:'Aries', symbol:'♈', strength:72 }, { id:'leo', name:'Leao', symbol:'♌', strength:62 }],
  pisces:      [{ id:'cancer', name:'Cancer', symbol:'♋', strength:94 }, { id:'scorpio', name:'Escorpiao', symbol:'♏', strength:92 }, { id:'taurus', name:'Touro', symbol:'♉', strength:78 }, { id:'capricorn', name:'Capricornio', symbol:'♑', strength:72 }, { id:'virgo', name:'Virgem', symbol:'♍', strength:65 }],
};

function getLuckyNumber(sign: string): number {
  const day = new Date().getDate();
  const hash = sign.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ((hash + day) % 99) + 1;
}

function getLuckyColor(element: string): { name: string; emoji: string } {
  const colors: Record<string, { name: string; emoji: string }> = {
    fire:  { name: 'Vermelho', emoji: '🔴' },
    earth: { name: 'Verde', emoji: '🟢' },
    air:   { name: 'Azul', emoji: '🔵' },
    water: { name: 'Roxo', emoji: '🟣' },
  };
  return colors[element] || { name: 'Dourado', emoji: '🟡' };
}

/* ─── Hex Radar Chart ─── */

interface HexRadarProps {
  values: { label: string; value: number; icon: string }[];
  gradientFrom: string;
  gradientTo: string;
  uid: string;
}

function HexRadarChart({ values, gradientFrom, gradientTo, uid }: HexRadarProps) {
  const cx = 130, cy = 130, maxR = 80, n = values.length;
  const levels = [0.25, 0.5, 0.75, 1.0];

  function getPoint(index: number, radius: number): [number, number] {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  }

  function polygonPoints(radius: number): string {
    return values.map((_, i) => getPoint(i, radius).join(',')).join(' ');
  }

  const dataPoints = values.map((v, i) => getPoint(i, (v.value / 100) * maxR));
  const dataPath = dataPoints.map((p) => p.join(',')).join(' ');
  const labelPositions = values.map((_, i) => getPoint(i, maxR + 32));

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 260 260" className="w-full max-w-[320px]">
        <defs>
          <linearGradient id={`hf-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.3" />
            <stop offset="100%" stopColor={gradientTo} stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id={`hs-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.85" />
            <stop offset="100%" stopColor={gradientTo} stopOpacity="0.55" />
          </linearGradient>
          <filter id={`hg-${uid}`}>
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {levels.map((level) => (
          <polygon key={level} points={polygonPoints(maxR * level)} fill="none" stroke="rgba(224, 176, 255, 0.07)" strokeWidth="1" />
        ))}
        {values.map((_, i) => {
          const [px, py] = getPoint(i, maxR);
          return <line key={`a-${i}`} x1={cx} y1={cy} x2={px} y2={py} stroke="rgba(224, 176, 255, 0.05)" strokeWidth="1" />;
        })}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          points={dataPath}
          fill={`url(#hf-${uid})`}
          stroke={`url(#hs-${uid})`}
          strokeWidth="2"
          strokeLinejoin="round"
          filter={`url(#hg-${uid})`}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {dataPoints.map(([px, py], i) => (
          <motion.circle key={`d-${i}`} initial={{ r: 0 }} animate={{ r: 3.5 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
            cx={px} cy={py} fill={i % 2 === 0 ? gradientFrom : gradientTo} stroke="rgba(11, 4, 20, 0.7)" strokeWidth="1.5" />
        ))}
        {values.map((v, i) => {
          const [lx, ly] = labelPositions[i];
          return (
            <g key={`l-${i}`}>
              <text x={lx} y={ly - 8} textAnchor="middle" dominantBaseline="central" fontSize="16">{v.icon}</text>
              <text x={lx} y={ly + 8} textAnchor="middle" dominantBaseline="central" fill="rgba(224, 176, 255, 0.8)" fontSize="9" fontWeight="700" letterSpacing="0.8">{v.label.toUpperCase()}</text>
              <text x={lx} y={ly + 21} textAnchor="middle" dominantBaseline="central" fill={i % 2 === 0 ? gradientFrom : gradientTo} fontSize="11" fontWeight="800">{v.value}%</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="3" fill={gradientFrom} opacity="0.25" />
        <circle cx={cx} cy={cy} r="1.5" fill={gradientFrom} opacity="0.5" />
      </svg>
    </div>
  );
}

/* ─── Orbital Affinity Visualization ─── */

function AffinityOrbits({
  centerSign,
  affinities,
  accentColor,
  glowColor,
}: {
  centerSign: { name: string; symbol: string };
  affinities: { id: string; name: string; symbol: string; strength: number }[];
  accentColor: string;
  glowColor: string;
}) {
  const cx = 160, cy = 160;
  const orbits = [60, 100, 140];
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  // Distribute affinities across orbits: strongest inner, weakest outer
  const sorted = [...affinities].sort((a, b) => b.strength - a.strength);
  const orbitAssignment = sorted.map((aff, i) => {
    const orbitIdx = i < 2 ? 0 : i < 4 ? 1 : 2;
    return { ...aff, orbit: orbitIdx };
  });

  // Group by orbit for angle distribution
  const byOrbit: Record<number, typeof orbitAssignment> = { 0: [], 1: [], 2: [] };
  orbitAssignment.forEach((a) => byOrbit[a.orbit].push(a));

  // Speed per orbit (inner faster)
  const speeds = [0.012, 0.008, 0.005];

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-[380px]">
        <defs>
          <radialGradient id="orb-center-glow">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
            <stop offset="50%" stopColor={accentColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
          <filter id="orb-glow-filter">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="orb-line-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background radial glow */}
        <circle cx={cx} cy={cy} r="150" fill="url(#orb-center-glow)" />

        {/* Orbit rings */}
        {orbits.map((r, i) => (
          <circle
            key={`orbit-${i}`}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={accentColor}
            strokeOpacity={0.12 - i * 0.03}
            strokeWidth="1"
            strokeDasharray={i === 2 ? '3 6' : 'none'}
          />
        ))}

        {/* Connection lines from center to each orbiting sign */}
        {Object.values(byOrbit).flatMap((group, orbitIdx) =>
          group.map((aff, posIdx) => {
            const count = group.length;
            const baseAngle = (2 * Math.PI * posIdx) / count;
            const angle = baseAngle + tick * speeds[orbitIdx];
            const r = orbits[orbitIdx];
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            const opacity = 0.08 + (aff.strength / 100) * 0.15;
            return (
              <line
                key={`line-${aff.id}`}
                x1={cx} y1={cy} x2={x} y2={y}
                stroke={accentColor}
                strokeOpacity={opacity}
                strokeWidth="1"
                strokeDasharray="2 4"
                filter="url(#orb-line-glow)"
              />
            );
          })
        )}

        {/* Orbiting sign nodes */}
        {Object.values(byOrbit).flatMap((group, orbitIdx) =>
          group.map((aff, posIdx) => {
            const count = group.length;
            const baseAngle = (2 * Math.PI * posIdx) / count;
            const angle = baseAngle + tick * speeds[orbitIdx];
            const r = orbits[orbitIdx];
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            const nodeSize = 20 - orbitIdx * 3;
            return (
              <g key={`node-${aff.id}`} filter="url(#orb-glow-filter)">
                {/* Node bg circle */}
                <circle
                  cx={x} cy={y} r={nodeSize}
                  fill="rgba(11, 4, 20, 0.85)"
                  stroke={accentColor}
                  strokeOpacity={0.3 + (aff.strength / 100) * 0.4}
                  strokeWidth="1.5"
                />
                {/* Glow ring */}
                <circle
                  cx={x} cy={y} r={nodeSize + 3}
                  fill="none"
                  stroke={accentColor}
                  strokeOpacity={0.08}
                  strokeWidth="1"
                />
                {/* Symbol */}
                <text
                  x={x} y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16 - orbitIdx * 1.5}
                  fill="white"
                >
                  {aff.symbol}
                </text>
                {/* Name label */}
                <text
                  x={x} y={y + nodeSize + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fontWeight="700"
                  fill={accentColor}
                  fillOpacity="0.75"
                  letterSpacing="0.5"
                >
                  {aff.name.toUpperCase()}
                </text>
                {/* Strength % */}
                <text
                  x={x} y={y + nodeSize + 23}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="8.5"
                  fontWeight="600"
                  fill="rgba(224,176,255,0.6)"
                >
                  {aff.strength}%
                </text>
              </g>
            );
          })
        )}

        {/* Center node — selected sign */}
        <circle cx={cx} cy={cy} r="30" fill="rgba(11, 4, 20, 0.9)" stroke={accentColor} strokeOpacity="0.5" strokeWidth="2" filter="url(#orb-glow-filter)" />
        <circle cx={cx} cy={cy} r="35" fill="none" stroke={accentColor} strokeOpacity="0.15" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="40" fill="none" stroke={accentColor} strokeOpacity="0.06" strokeWidth="1" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="28" fill="white">
          {centerSign.symbol}
        </text>
      </svg>

      {/* Legend row */}
      <div className="flex flex-wrap justify-center gap-2 mt-1">
        {sorted.slice(0, 3).map((aff) => (
          <span
            key={aff.id}
            className="text-sm font-medium rounded-full px-3.5 py-1.5"
            style={{
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}20`,
              color: accentColor,
            }}
          >
            {aff.symbol} {aff.name} · {aff.strength}%
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Sign Grid Card ─── */

function SignCard({
  sign,
  isActive,
  onClick,
}: {
  sign: typeof ZODIAC_SIGNS[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const elem = ELEMENT_COLORS[sign.element];
  return (
    <button onClick={onClick} className="cursor-pointer group active:scale-[0.94] transition-all duration-200">
      <div
        className="w-full h-[80px] rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden transition-all duration-300"
        style={
          isActive
            ? {
                background: `linear-gradient(135deg, ${elem.gradient[0]}22, ${elem.gradient[1]}12)`,
                backdropFilter: 'blur(12px)',
                border: `1px solid ${elem.gradient[0]}50`,
                boxShadow: `0 0 18px ${elem.glow}`,
              }
            : glassCard
        }
      >
        <span className={`text-4xl transition-transform duration-300 ${isActive ? 'scale-115' : 'group-hover:scale-110'}`}>
          {sign.symbol}
        </span>
        <span
          className={`text-xs font-bold transition-colors leading-none ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white/75'}`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {sign.name}
        </span>
        {isActive && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full" style={{ backgroundColor: elem.gradient[0] }} />
        )}
      </div>
    </button>
  );
}

/* ─── Main Component — Unified Single Page ─── */

export default function HoroscopeModule() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const sign = ZODIAC_SIGNS.find((s) => s.id === selectedSign);
  const elem = sign ? ELEMENT_COLORS[sign.element] : null;

  return (
    <div className="space-y-6">
      {/* Date header */}
      <p className="text-base uppercase tracking-[0.25em] text-center font-medium" style={{ color: `${DS_COLORS.primaryText}A0` }}>
        ✨ {today} ✨
      </p>

      {/* ═══ Sign Grid — 6 + 6 ═══ */}
      <div>
        <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
          <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
          <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
            🔮 Selecione seu Signo
          </span>
          <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
        </div>
        <div className="grid grid-cols-6 gap-3">
          {ZODIAC_SIGNS.map((s) => (
            <SignCard key={s.id} sign={s} isActive={selectedSign === s.id} onClick={() => setSelectedSign(s.id)} />
          ))}
        </div>
      </div>

      {/* ═══ UNIFIED CONTENT — everything appears at once ═══ */}
      <AnimatePresence mode="wait">
        {sign && elem && (
          <motion.div
            key={sign.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}
          >
            {/* ─── SIGN HEADER ─── */}
            <div
              className="p-6 rounded-3xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${elem.gradient[0]}08, rgba(26, 11, 46, 0.6))`,
                backdropFilter: 'blur(12px)',
                border: `1px solid ${elem.gradient[0]}20`,
              }}
            >
              <div className="absolute -right-3 -top-3 opacity-[0.04] text-8xl pointer-events-none select-none">
                {sign.symbol}
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${elem.gradient[0]}25, ${elem.gradient[1]}10)`,
                    border: `1px solid ${elem.gradient[0]}30`,
                    boxShadow: `0 0 20px ${elem.glow}`,
                  }}
                >
                  {sign.symbol}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {sign.name}
                  </h3>
                  <p className="text-base mt-0.5" style={{ color: DS_COLORS.primaryText }}>
                    📅 {sign.dates} · {elem.icon} {elem.label}
                  </p>
                </div>
              </div>
            </div>

            {/* ─── HERO: NUMERO DA SORTE ─── */}
            <div
              className="rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${elem.gradient[0]}12, ${elem.gradient[1]}06, rgba(26, 11, 46, 0.6))`,
                backdropFilter: 'blur(12px)',
                border: `1px solid ${elem.gradient[0]}25`,
                boxShadow: `0 0 30px ${elem.glow}, inset 0 0 40px ${elem.gradient[0]}05`,
              }}
            >
              <div className="relative shrink-0">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${elem.gradient[0]}18 0%, transparent 70%)`,
                    border: `2px solid ${elem.gradient[0]}30`,
                    boxShadow: `0 0 40px ${elem.glow}, 0 0 80px ${elem.gradient[0]}15`,
                  }}
                >
                  <span
                    className="text-5xl font-black"
                    style={{
                      color: elem.gradient[0],
                      fontFamily: 'var(--font-display)',
                      textShadow: `0 0 20px ${elem.glow}, 0 0 40px ${elem.gradient[0]}40`,
                    }}
                  >
                    {getLuckyNumber(sign.id)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.2em] mb-1" style={{ color: DS_COLORS.primaryText }}>
                  🍀 Numero da Sorte
                </p>
                <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
                  Seu numero de poder para hoje. Use-o em decisoes, apostas e momentos de escolha.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className="text-xs rounded-full px-3 py-1 font-medium"
                    style={{
                      background: `${elem.gradient[0]}15`,
                      border: `1px solid ${elem.gradient[0]}25`,
                      color: elem.gradient[0],
                    }}
                  >
                    {getLuckyColor(sign.element).emoji} {getLuckyColor(sign.element).name}
                  </span>
                  <span className="text-xs" style={{ color: `${DS_COLORS.primaryText}50` }}>cor do dia</span>
                </div>
              </div>
            </div>

            {/* ─── HOROSCOPO DIARIO ─── */}
            {(() => {
              const reading = getDailyReading(sign.element);
              return (
                <div
                  className="rounded-3xl relative overflow-hidden"
                  style={{
                    background: `linear-gradient(180deg, ${elem.gradient[0]}08, rgba(26, 11, 46, 0.55))`,
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${elem.gradient[0]}15`,
                  }}
                >
                  <div className="px-6 py-3.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${elem.gradient[0]}10` }}>
                    <span className="text-sm font-bold uppercase tracking-[0.15em] flex items-center gap-2" style={{ color: elem.gradient[0] }}>
                      ⭐ Horoscopo Diario
                    </span>
                    <span className="text-xs" style={{ color: `${DS_COLORS.primaryText}50` }}>🎯 Personalizado</span>
                  </div>

                  <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: `${elem.gradient[0]}30 transparent` }}>
                    <h4 className="text-3xl font-bold" style={{ color: elem.gradient[0], fontFamily: 'var(--font-display)' }}>
                      {reading.title}
                    </h4>
                    <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>
                      {reading.overview}
                    </p>

                    <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${elem.gradient[0]}15, transparent)` }} />

                    <div className="space-y-3">
                      <div className="rounded-2xl px-5 py-4" style={{ background: `${elem.gradient[0]}06`, border: `1px solid ${elem.gradient[0]}08` }}>
                        <p className="text-sm font-bold uppercase tracking-wider mb-1.5" style={{ color: elem.gradient[0] }}>❤️ Amor & Relacionamentos</p>
                        <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>{reading.love}</p>
                      </div>
                      <div className="rounded-2xl px-5 py-4" style={{ background: `${elem.gradient[1]}06`, border: `1px solid ${elem.gradient[1]}08` }}>
                        <p className="text-sm font-bold uppercase tracking-wider mb-1.5" style={{ color: elem.gradient[1] }}>💼 Carreira & Financas</p>
                        <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>{reading.career}</p>
                      </div>
                      <div className="rounded-2xl px-5 py-4" style={{ background: `${elem.gradient[0]}04`, border: `1px solid ${elem.gradient[0]}06` }}>
                        <p className="text-sm font-bold uppercase tracking-wider mb-1.5" style={{ color: DS_COLORS.primaryText }}>💪 Saude & Bem-estar</p>
                        <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>{reading.health}</p>
                      </div>
                    </div>

                    <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${elem.gradient[0]}15, transparent)` }} />

                    <div
                      className="rounded-2xl px-4 py-4 text-center"
                      style={{ background: `linear-gradient(135deg, ${elem.gradient[0]}08, ${elem.gradient[1]}05)`, border: `1px solid ${elem.gradient[0]}12` }}
                    >
                      <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: elem.gradient[0] }}>🌟 Conselho do Dia</p>
                      <p className="text-lg leading-[1.8] italic" style={{ color: DS_COLORS.bodyText, fontFamily: 'var(--font-display)' }}>
                        &ldquo;{reading.advice}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ─── HEX RADAR ─── */}
            <div>
              <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
                <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
                <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
                  🎮 Aspectos do Dia
                </span>
                <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
              </div>
              <div
                className="rounded-3xl px-3 py-4"
                style={{ background: `linear-gradient(135deg, ${elem.gradient[0]}05, rgba(26, 11, 46, 0.5))`, border: `1px solid ${elem.gradient[0]}10` }}
              >
                {(() => {
                  const a = getSignAspects(sign.id);
                  return (
                    <HexRadarChart
                      uid={sign.id}
                      values={[
                        { label: 'Amor', value: a.love, icon: '❤️' },
                        { label: 'Carreira', value: a.career, icon: '💼' },
                        { label: 'Saude', value: a.health, icon: '💪' },
                        { label: 'Sorte', value: a.luck, icon: '🍀' },
                        { label: 'Espirito', value: a.spirit, icon: '🔮' },
                        { label: 'Energia', value: a.energy, icon: '⚡' },
                      ]}
                      gradientFrom={elem.gradient[0]}
                      gradientTo={elem.gradient[1]}
                    />
                  );
                })()}
              </div>
            </div>

            {/* ─── AFINIDADE ORBITAL ─── */}
            <div>
              <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
                <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
                <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
                  💞 Afinidades Cosmicas
                </span>
                <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
              </div>
              <div
                className="rounded-3xl px-3 py-5"
                style={{
                  background: `linear-gradient(180deg, ${elem.gradient[0]}06, rgba(26, 11, 46, 0.5))`,
                  border: `1px solid ${elem.gradient[0]}10`,
                }}
              >
                <AffinityOrbits
                  centerSign={{ name: sign.name, symbol: sign.symbol }}
                  affinities={SIGN_AFFINITIES[sign.id] || []}
                  accentColor={elem.gradient[0]}
                  glowColor={elem.glow}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!sign && (
        <div className="flex flex-col items-center justify-center py-8">
          <span className="text-5xl mb-3 opacity-40">🌟</span>
          <p className="text-sm text-center tracking-wider" style={{ color: `${DS_COLORS.primaryText}80` }}>
            Toque em um signo acima para revelar sua previsao
          </p>
        </div>
      )}
    </div>
  );
}
