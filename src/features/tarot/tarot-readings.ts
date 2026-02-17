/* ─── Tarot Reading Engine ───
 * Generates integrated narrative readings for 3-card spreads.
 * All content in Brazilian Portuguese with authentic tarot tone.
 */

/* ─── Types ─── */

export interface TarotReading {
  narrative: string;
  pastInsight: string;
  presentInsight: string;
  futureInsight: string;
  advice: string;
  energy: 'positive' | 'challenging' | 'transformative';
}

export type ThematicGroup =
  | 'beginnings'
  | 'power'
  | 'intuition'
  | 'structure'
  | 'transformation'
  | 'emotion'
  | 'wisdom'
  | 'completion';

export type ArchetypeEnergy = 'positive' | 'challenging' | 'transformative' | 'neutral';

export interface ExtendedCardData {
  id: number;
  thematicGroup: ThematicGroup;
  archetypeEnergy: ArchetypeEnergy;
  positional: {
    past: { upright: string; reversed: string };
    present: { upright: string; reversed: string };
    future: { upright: string; reversed: string };
  };
}

export interface DrawnCardInput {
  card: { id: number; name: string; number: string; keywords: string[]; upright: string; reversed: string };
  reversed: boolean;
  position: string;
}

/* ─── Extended Card Database ─── */

const EXTENDED_DATA: ExtendedCardData[] = [
  {
    id: 0, // O Louco
    thematicGroup: 'beginnings',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'Um salto de fe no passado moldou quem voce e hoje. Aquela decisao espontanea, mesmo parecendo louca na epoca, plantou sementes que agora florescem.',
        reversed: 'Imprudencias passadas deixaram marcas. Decisoes tomadas sem reflexao criaram padroes que voce ainda carrega — mas reconhecer isso ja e o primeiro passo da cura.',
      },
      present: {
        upright: 'O universo convida voce para um novo comeco agora mesmo. Ha uma energia de liberdade e possibilidade ao seu redor — confie e de o proximo passo.',
        reversed: 'Voce sente o chamado para algo novo, mas o medo te paralisa. A hesitacao excessiva esta custando oportunidades preciosas neste momento.',
      },
      future: {
        upright: 'Uma aventura inesperada se aproxima. O futuro reserva um comeco radicalmente novo — esteja aberto para o que o destino prepara.',
        reversed: 'Cuidado com decisoes impulsivas no futuro proximo. Planeje antes de agir, ou o salto pode se tornar uma queda.',
      },
    },
  },
  {
    id: 1, // O Mago
    thematicGroup: 'power',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'Voce ja demonstrou maestria e habilidade no passado. Os talentos que cultivou sao a base solida sobre a qual voce constroi agora.',
        reversed: 'Talentos foram desperdicados ou usados para fins errados no passado. E hora de redirecionar seus dons para algo que realmente importa.',
      },
      present: {
        upright: 'Todas as ferramentas necessarias estao em suas maos neste momento. Voce tem o poder de manifestar exatamente o que deseja — use sua vontade.',
        reversed: 'Seus talentos estao sendo subutilizados. Algo bloqueia sua capacidade de manifestacao — identifique o que e e remova esse obstaculo.',
      },
      future: {
        upright: 'Um periodo de grande poder criativo e manifestacao se aproxima. Prepare-se para canalizar suas habilidades em algo extraordinario.',
        reversed: 'Atencao para nao cair em manipulacao ou autoengano. O futuro pede autenticidade no uso dos seus dons.',
      },
    },
  },
  {
    id: 2, // A Sacerdotisa
    thematicGroup: 'intuition',
    archetypeEnergy: 'neutral',
    positional: {
      past: {
        upright: 'Sua intuicao te guiou sabiamente no passado. Aqueles momentos de silencio interior trouxeram respostas que a logica jamais encontraria.',
        reversed: 'Voce ignorou sinais importantes no passado. A desconexao com sua voz interior criou confusao que ainda ecoa no presente.',
      },
      present: {
        upright: 'Conhecimentos ocultos estao se revelando agora. Confie profundamente na sua intuicao — ela enxerga o que os olhos nao veem.',
        reversed: 'Segredos e verdades nao ditas estao criando turbulencia. Busque silencio interior para recuperar a clareza que precisa.',
      },
      future: {
        upright: 'Misterios se desvelarao no futuro proximo. Prepare-se para receber sabedoria profunda que transformara sua compreensao.',
        reversed: 'Verdades ocultas virao a tona. Esteja preparado para confrontar o que estava escondido nas sombras.',
      },
    },
  },
  {
    id: 3, // A Imperatriz
    thematicGroup: 'emotion',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'Um periodo de abundancia e criatividade no passado nutriu seus projetos e relacoes. Essa fertilidade emocional e a raiz do que voce colhe agora.',
        reversed: 'Bloqueios criativos e dependencia emocional marcaram o passado. E hora de reconectar-se com sua fonte interior de abundancia.',
      },
      present: {
        upright: 'A abundancia flui livremente em sua vida agora. Nutra seus projetos com amor e dedicacao — tudo que voce planta cresce vigorosamente.',
        reversed: 'Algo bloqueia sua expressao criativa e emocional. Volte ao basico, reconecte-se com a natureza e permita-se sentir plenamente.',
      },
      future: {
        upright: 'Um periodo de grande fertilidade criativa se aproxima. Projetos florescerão, relacoes se aprofundarao, e a abundancia sera sua companheira.',
        reversed: 'Atencao para nao negligenciar seu autocuidado. O futuro pede que voce nutra a si mesma antes de nutrir os outros.',
      },
    },
  },
  {
    id: 4, // O Imperador
    thematicGroup: 'structure',
    archetypeEnergy: 'neutral',
    positional: {
      past: {
        upright: 'A estrutura e disciplina que voce construiu no passado sao os alicerces do seu sucesso atual. Aquela ordem nao foi em vao.',
        reversed: 'Rigidez e controle excessivo no passado sufocaram possibilidades. A inflexibilidade custou relacoes e oportunidades.',
      },
      present: {
        upright: 'E hora de criar estrutura e ordem na sua vida. Lideranca firme e necessaria — assuma o comando com autoridade e compaixao.',
        reversed: 'Controle excessivo esta criando resistencia ao seu redor. Flexibilize suas regras e permita que outros contribuam.',
      },
      future: {
        upright: 'Uma posicao de autoridade e lideranca o aguarda. Prepare-se para assumir responsabilidades maiores com sabedoria.',
        reversed: 'Evite a rigidez no caminho que se abre. O futuro pede lideranca adaptavel, nao tirania.',
      },
    },
  },
  {
    id: 5, // O Hierofante
    thematicGroup: 'wisdom',
    archetypeEnergy: 'neutral',
    positional: {
      past: {
        upright: 'Ensinamentos tradicionais e mestres do passado moldaram sua visao de mundo. Essa sabedoria herdada e um tesouro que voce carrega.',
        reversed: 'A rebeliao contra tradicoes no passado trouxe liberdade, mas tambem incerteza. Encontrar equilibrio entre o velho e o novo e o desafio.',
      },
      present: {
        upright: 'Busque orientacao em fontes de sabedoria confiáveis agora. Um mentor ou sistema de crencas pode iluminar o caminho.',
        reversed: 'Questione as regras que seguem sem pensar. Seu caminho espiritual pede autenticidade, nao conformidade.',
      },
      future: {
        upright: 'Um periodo de aprendizado profundo se aproxima. Esteja aberto a ensinamentos que transformarao sua perspectiva.',
        reversed: 'Voce sera chamado a criar seu proprio sistema de crencas. O futuro pede coragem para trilhar caminhos nao convencionais.',
      },
    },
  },
  {
    id: 6, // Os Amantes
    thematicGroup: 'emotion',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'Uma escolha feita com o coracao no passado definiu o rumo da sua vida. Aquela uniao de valores e amor foi transformadora.',
        reversed: 'Conflitos de valores e desarmonia no passado deixaram feridas que pedem cura. E hora de perdoar e realinhar.',
      },
      present: {
        upright: 'Uma escolha importante no amor ou nos valores se apresenta agora. Siga o coracao — ele sabe o caminho.',
        reversed: 'Desarmonia e conflito de valores estao gerando confusão. Alinhe suas acoes com aquilo que voce realmente acredita.',
      },
      future: {
        upright: 'Uma conexao profunda e significativa se aproxima. Pode ser romantica, mas tambem uma uniao de proposito e valores.',
        reversed: 'Decisoes dificeis no amor estao no horizonte. Prepare-se para escolher entre o confortavel e o verdadeiro.',
      },
    },
  },
  {
    id: 7, // O Carro
    thematicGroup: 'power',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'Sua determinacao no passado abriu portas que pareciam impossiveis. A vitoria veio porque voce nao desistiu.',
        reversed: 'Falta de direcao no passado dispersou sua energia. Oportunidades passaram porque o foco nao estava claro.',
      },
      present: {
        upright: 'Avance com confianca e determinacao total. A vitoria e sua se mantiver o foco — nada pode deter quem sabe aonde vai.',
        reversed: 'Voce esta se sentindo sem direcao ou lutando contra forcas opostas. Defina seus objetivos com clareza antes de avancar.',
      },
      future: {
        upright: 'Vitoria e conquista estao no seu horizonte. Continue firme no caminho — o triunfo se aproxima a passos largos.',
        reversed: 'Obstaculos podem surgir no caminho. Planeje rotas alternativas e nao deixe a frustração desviar seu curso.',
      },
    },
  },
  {
    id: 8, // A Forca
    thematicGroup: 'power',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'Sua forca interior e coragem suave no passado domaram situacoes que pareciam indomaveis. A paciencia foi sua maior arma.',
        reversed: 'Insegurancas do passado minaram sua confianca. A falta de auto-compaixao criou vulnerabilidades que persistem.',
      },
      present: {
        upright: 'Forca interior e sua maior aliada agora. Domine impulsos com amor, nao com brutalidade. A verdadeira coragem e suave.',
        reversed: 'Voce esta duvidando de si mesmo. Cultive autoconfianca e paciencia — a forca que procura ja existe dentro de voce.',
      },
      future: {
        upright: 'Situacoes futuras exigirao forca interior e compaixao. Voce esta se preparando para algo que demanda coragem gentil.',
        reversed: 'Trabalhe sua autoconfianca agora para enfrentar o que vem. O futuro recompensa quem se fortalece por dentro.',
      },
    },
  },
  {
    id: 9, // O Eremita
    thematicGroup: 'wisdom',
    archetypeEnergy: 'neutral',
    positional: {
      past: {
        upright: 'Um periodo de recolhimento e reflexao no passado trouxe sabedoria profunda. Aquele silencio interior foi essencial para seu crescimento.',
        reversed: 'Isolamento excessivo no passado gerou solidao e desconexao. A sabedoria precisa ser compartilhada para ter valor.',
      },
      present: {
        upright: 'E momento de recolhimento e reflexão. A resposta que voce busca esta dentro de voce — afaste-se do ruido e escute.',
        reversed: 'Voce esta se isolando demais ou, ao contrario, evitando o necessario encontro consigo mesmo. Encontre o equilibrio.',
      },
      future: {
        upright: 'Um periodo de introspeccao significativa se aproxima. Use-o para encontrar respostas que so o silencio pode revelar.',
        reversed: 'Cuidado com o isolamento voluntario. O futuro pede sabedoria compartilhada, nao solidao autoimposta.',
      },
    },
  },
  {
    id: 10, // A Roda da Fortuna
    thematicGroup: 'transformation',
    archetypeEnergy: 'transformative',
    positional: {
      past: {
        upright: 'Mudancas ciclicas no passado trouxeram voce ate aqui. Cada virada da roda, por mais dificil, fez parte do plano.',
        reversed: 'Resistencia a mudancas no passado prolongou ciclos que deveriam ter encerrado. Agarrar-se ao familiar custou caro.',
      },
      present: {
        upright: 'A roda gira a seu favor neste momento. Mudancas positivas estao em curso — surfe a onda da fortuna com gratidao.',
        reversed: 'Voce sente que a sorte nao esta ao seu lado. Mas este e um momento temporario — a roda nunca para de girar.',
      },
      future: {
        upright: 'Grandes mudancas ciclicas se aproximam. O destino prepara uma virada significativa — esteja pronto para acolhe-la.',
        reversed: 'Prepare-se para turbulencias temporarias. Lembre-se: nenhum ciclo e permanente, nem os dificeis.',
      },
    },
  },
  {
    id: 11, // A Justica
    thematicGroup: 'structure',
    archetypeEnergy: 'neutral',
    positional: {
      past: {
        upright: 'Decisoes justas e equilibradas no passado criaram um fundamento solido. O karma positivo que voce plantou retorna agora.',
        reversed: 'Injusticas passadas — sofridas ou cometidas — pedem resolucao. O equilibrio so vem quando a verdade e reconhecida.',
      },
      present: {
        upright: 'A justica opera na sua vida agora. Decisoes baseadas em verdade e equilibrio trazem resultados alinhados com o que voce merece.',
        reversed: 'Algo nao esta justo na sua situacao atual. Examine sua consciencia e busque restaurar o equilibrio.',
      },
      future: {
        upright: 'Justica sera feita no futuro proximo. O que voce plantou sera colhido — confie que o universo e justo.',
        reversed: 'Resolva pendencias legais ou morais agora para evitar complicacoes futuras. A justica tardia ainda e justica.',
      },
    },
  },
  {
    id: 12, // O Enforcado
    thematicGroup: 'transformation',
    archetypeEnergy: 'transformative',
    positional: {
      past: {
        upright: 'Um sacrificio ou pausa voluntaria no passado mudou completamente sua perspectiva. Ver o mundo de ponta-cabeca foi revelador.',
        reversed: 'Voce resistiu a uma pausa necessaria no passado. O sacrificio que evitou teria trazido clareza que ainda falta.',
      },
      present: {
        upright: 'E hora de ver as coisas de um angulo completamente diferente. Aceite a pausa — ela nao e inacao, e gestacao.',
        reversed: 'Voce esta preso em um padrao de sacrificio sem proposito. Liberte-se do que te prende e busque nova perspectiva.',
      },
      future: {
        upright: 'Uma mudanca radical de perspectiva se aproxima. Algo que voce via como obstaculo revelara ser a maior benção.',
        reversed: 'Cuidado para nao se apegar ao sofrimento desnecessario. O futuro pede desapego, nao martírio.',
      },
    },
  },
  {
    id: 13, // A Morte
    thematicGroup: 'transformation',
    archetypeEnergy: 'transformative',
    positional: {
      past: {
        upright: 'Uma transformacao profunda no passado encerrou um ciclo e abriu outro. Aquela morte simbolica foi o renascimento que voce precisava.',
        reversed: 'Voce resistiu a uma transformacao necessaria no passado. O que deveria ter morrido ainda persiste, drenando sua energia.',
      },
      present: {
        upright: 'Um ciclo se encerra agora. Nao tema — a morte de um padrao e o nascimento de algo muito maior. Deixe ir com graca.',
        reversed: 'Voce esta resistindo a uma transformação inevitavel. Quanto mais luta, mais doloroso se torna. Solte as amarras.',
      },
      future: {
        upright: 'Uma grande transformacao se aproxima. Prepare-se para deixar ir o velho e acolher o novo com bracos abertos.',
        reversed: 'O futuro exigira que voce finalmente libere o que tem segurado. A resistencia so prolongara a transição.',
      },
    },
  },
  {
    id: 14, // A Temperanca
    thematicGroup: 'wisdom',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'A harmonia e moderacao que voce praticou no passado criaram uma base estavel. A paciencia foi sua maior virtude.',
        reversed: 'Excessos no passado causaram desequilibrios que persistem. A falta de moderacao cobrou seu preco.',
      },
      present: {
        upright: 'Encontre o meio-termo em tudo que faz agora. Harmonia e paciencia sao as chaves para resultados duradouros.',
        reversed: 'Excesso ou impaciencia esta sabotando seus esforcos. Busque equilibrio urgentemente em todas as areas.',
      },
      future: {
        upright: 'Um periodo de grande harmonia e integracao se aproxima. As pecas do quebra-cabeca comecam a se encaixar naturalmente.',
        reversed: 'Trabalhe seu equilibrio interior agora para colher harmonia no futuro. Moderacao hoje, abundancia amanha.',
      },
    },
  },
  {
    id: 15, // O Diabo
    thematicGroup: 'transformation',
    archetypeEnergy: 'challenging',
    positional: {
      past: {
        upright: 'Apegos e padroes sombrios do passado ensinaram licoes valiosas. Reconhecer suas correntes foi o primeiro passo para a liberdade.',
        reversed: 'Voce se libertou de padroes toxicos no passado. Essa conquista e mais significativa do que imagina.',
      },
      present: {
        upright: 'Examine seus apegos e vicios com honestidade. Algo te prende sem que voce perceba — consciencia e o primeiro passo para a libertacao.',
        reversed: 'Voce esta no processo de se libertar de padroes toxicos. Continue — a liberdade esta mais perto do que parece.',
      },
      future: {
        upright: 'Tentacoes e padroes sombrios podem surgir no caminho. Esteja atento — consciencia previne a armadilha.',
        reversed: 'A libertacao definitiva se aproxima. O futuro traz a chance de romper correntes que voce carrega ha tempo demais.',
      },
    },
  },
  {
    id: 16, // A Torre
    thematicGroup: 'transformation',
    archetypeEnergy: 'challenging',
    positional: {
      past: {
        upright: 'Uma ruptura drastica no passado destruiu o que nao era verdadeiro. Daquele caos nasceu a fundacao do que voce constroi agora.',
        reversed: 'Voce evitou uma ruptura necessaria no passado. O que deveria ter caido ainda permanece, instavel e insustentavel.',
      },
      present: {
        upright: 'Uma ruptura acontece agora — e e necessaria. Do caos nasce uma nova fundacao. Confie no processo, mesmo que doa.',
        reversed: 'Voce sente a pressao crescendo, mas resiste a mudanca. Evitar o inevitavel so aumenta a intensidade da queda.',
      },
      future: {
        upright: 'Mudancas abruptas se aproximam. Nao lute contra elas — sao o universo demolindo o que nao serve para construir algo melhor.',
        reversed: 'Prepare-se interiormente para possiveis turbulencias. A preparação emocional suaviza qualquer tempestade.',
      },
    },
  },
  {
    id: 17, // A Estrela
    thematicGroup: 'emotion',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'A esperanca e inspiracao do passado iluminaram seus caminhos mais sombrios. Aquela fe no impossivel trouxe voce ate aqui.',
        reversed: 'Um periodo de desesperanca no passado testou sua fe. Mesmo nas trevas mais profundas, a estrela nunca se apagou completamente.',
      },
      present: {
        upright: 'Esperanca renovada brilha sobre sua vida agora. Inspiracao divina guia seus passos — confie e siga a luz.',
        reversed: 'A desesperanca nubla sua visao. Mas a estrela esta la, mesmo que nuvens a ocultem. Reconecte-se com sua fe.',
      },
      future: {
        upright: 'Um periodo luminoso de esperanca e inspiracao se aproxima. Depois da tempestade, a estrela sempre aparece.',
        reversed: 'Cultive sua fe agora para que a luz interior brilhe quando mais precisar. A esperanca e um musculo que se fortalece.',
      },
    },
  },
  {
    id: 18, // A Lua
    thematicGroup: 'intuition',
    archetypeEnergy: 'challenging',
    positional: {
      past: {
        upright: 'O passado foi marcado por ilusoes e incertezas que te ensinaram a navegar no escuro. A intuicao cresceu quando a visao falhou.',
        reversed: 'Clareza emergiu de um periodo confuso no passado. Os medos que voce superou revelaram forcas que nao sabia possuir.',
      },
      present: {
        upright: 'Navegue suas emocoes com extremo cuidado. Nem tudo e o que parece — a lua ilumina parcialmente, criando sombras enganosas.',
        reversed: 'A clareza esta emergindo. Medos estao sendo superados e a verdade comeca a se revelar lentamente.',
      },
      future: {
        upright: 'Um periodo de incerteza emocional se aproxima. Confie na sua intuicao, mesmo quando a razao nao consiga explicar.',
        reversed: 'As ilusoes se dissiparao em breve. O futuro traz a clareza que voce precisa — apenas um pouco mais de paciencia.',
      },
    },
  },
  {
    id: 19, // O Sol
    thematicGroup: 'completion',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'Momentos de grande alegria e sucesso no passado deixaram memorias luminosas. Aquela vitalidade e a prova do que voce e capaz.',
        reversed: 'O brilho do passado foi temporariamente ofuscado. Mas a experiencia de alegria que voce viveu nao pode ser apagada.',
      },
      present: {
        upright: 'Alegria, sucesso e vitalidade irradiam da sua vida agora. Brilhe com toda sua luz — o mundo precisa da sua energia!',
        reversed: 'O otimismo esta temporariamente obscurecido. Mas o sol nunca desaparece — ele apenas se esconde atras das nuvens.',
      },
      future: {
        upright: 'Um futuro brilhante e radiante se anuncia. Sucesso, alegria e realizacao estao no horizonte — continue caminhando em direcao a luz.',
        reversed: 'A luz retornara, mas talvez nao no formato esperado. Esteja aberto a alegrias que venham de fontes inesperadas.',
      },
    },
  },
  {
    id: 20, // O Julgamento
    thematicGroup: 'completion',
    archetypeEnergy: 'transformative',
    positional: {
      past: {
        upright: 'Um chamado interior no passado despertou voce para um proposito maior. Aquele renascimento mudou tudo o que veio depois.',
        reversed: 'Voce ignorou um chamado importante no passado. A recusa do convite do universo criou uma inquietacao que persiste.',
      },
      present: {
        upright: 'Um chamado interior ressoa agora. E hora de renascer — atenda ao proposito maior que bate a sua porta.',
        reversed: 'Autoduvida silencia sua voz interior. Escute alem do medo — o chamado e real e voce e digno dele.',
      },
      future: {
        upright: 'Um grande renascimento se aproxima. O universo prepara um chamado que mudara o curso da sua vida.',
        reversed: 'Prepare-se para ouvir e aceitar o chamado quando ele vier. O futuro pede coragem para renascer.',
      },
    },
  },
  {
    id: 21, // O Mundo
    thematicGroup: 'completion',
    archetypeEnergy: 'positive',
    positional: {
      past: {
        upright: 'Ciclos completados no passado trouxeram realizacao e integracao. Voce alcancou algo significativo que define quem voce e.',
        reversed: 'Um ciclo do passado ficou incompleto. Assuntos inacabados pedem resolucao para que voce avance plenamente.',
      },
      present: {
        upright: 'Completude e realizacao marcam este momento. Um ciclo se encerra com sucesso — celebre tudo que voce conquistou!',
        reversed: 'Voce esta quase la, mas falta o passo final. Persista — a linha de chegada esta mais perto do que imagina.',
      },
      future: {
        upright: 'Realizacao plena e integracao total se aproximam. O ciclo que voce iniciou chegara a uma conclusao gloriosa.',
        reversed: 'Amarre as pontas soltas agora para que o futuro traga a completude que voce merece. Cada detalhe importa.',
      },
    },
  },
];

/* ─── Narrative Templates ─── */

const GROUP_NAMES: Record<ThematicGroup, string> = {
  beginnings: 'novos comecos',
  power: 'forca e poder',
  intuition: 'intuicao e misterio',
  structure: 'estrutura e ordem',
  transformation: 'transformacao profunda',
  emotion: 'emocao e conexao',
  wisdom: 'sabedoria e aprendizado',
  completion: 'realizacao e plenitude',
};

interface TransitionTemplate {
  sameGroup: string[];
  beginningsToTransformation: string[];
  powerToEmotion: string[];
  challengeToPositive: string[];
  generic: string[];
}

const TRANSITIONS: TransitionTemplate = {
  sameGroup: [
    'Essa energia se intensifica no presente.',
    'O mesmo tema ressoa com forca ainda maior agora.',
    'A continuidade dessa forca e inegavel.',
  ],
  beginningsToTransformation: [
    'O que comecou como possibilidade agora pede transformacao real.',
    'Dos comecos ingenuos, nasce a necessidade de mudanca profunda.',
    'A semente do passado agora exige que voce evolua.',
  ],
  powerToEmotion: [
    'A forca exterior agora convida a forca interior do coracao.',
    'Do dominio da vontade, emerge o dominio dos sentimentos.',
    'O poder encontra seu verdadeiro significado quando toca a emocao.',
  ],
  challengeToPositive: [
    'Mas os desafios abrem caminho para algo luminoso.',
    'Das dificuldades emerge uma promessa de renovacao.',
    'O que parece obstaculo e, na verdade, portal para algo melhor.',
  ],
  generic: [
    'E dessa energia, algo novo emerge.',
    'As forcas se entrelaçam, criando um mosaico unico.',
    'Cada carta conversa com a outra, revelando camadas mais profundas.',
    'O fio que conecta essas energias revela seu caminho.',
  ],
};

/* ─── Energy Assessment ─── */

function assessEnergy(cards: DrawnCardInput[]): 'positive' | 'challenging' | 'transformative' {
  const energies = cards.map((c) => {
    const ext = EXTENDED_DATA.find((e) => e.id === c.card.id);
    if (!ext) return 'neutral';
    if (c.reversed) {
      if (ext.archetypeEnergy === 'positive') return 'challenging';
      if (ext.archetypeEnergy === 'challenging') return 'transformative';
      return ext.archetypeEnergy;
    }
    return ext.archetypeEnergy;
  });

  const counts = { positive: 0, challenging: 0, transformative: 0, neutral: 0 };
  energies.forEach((e) => counts[e as keyof typeof counts]++);

  if (counts.transformative >= 2) return 'transformative';
  if (counts.challenging >= 2) return 'challenging';
  if (counts.positive >= 2) return 'positive';
  if (counts.transformative >= 1 && counts.challenging >= 1) return 'transformative';
  return 'positive';
}

/* ─── Transition Selection ─── */

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function selectTransition(
  groupA: ThematicGroup,
  groupB: ThematicGroup,
  energyA: ArchetypeEnergy,
  energyB: ArchetypeEnergy,
): string {
  if (groupA === groupB) return pickRandom(TRANSITIONS.sameGroup);
  if (groupA === 'beginnings' && groupB === 'transformation') return pickRandom(TRANSITIONS.beginningsToTransformation);
  if (groupA === 'power' && groupB === 'emotion') return pickRandom(TRANSITIONS.powerToEmotion);
  if (energyA === 'challenging' && (energyB === 'positive' || energyB === 'neutral')) return pickRandom(TRANSITIONS.challengeToPositive);
  return pickRandom(TRANSITIONS.generic);
}

/* ─── Narrative Builder ─── */

const OPENING_TEMPLATES = [
  'As cartas revelam uma jornada marcada por {pastTheme} no passado, {presentTheme} no presente, e {futureTheme} no horizonte.',
  'A tiragem desenha um arco poderoso: de {pastTheme}, passando por {presentTheme}, em direcao a {futureTheme}.',
  'O destino fala atraves de tres vozes: {pastTheme} ecoa do passado, {presentTheme} vibra no agora, e {futureTheme} acena do futuro.',
];

const CLOSING_TEMPLATES = [
  'O conjunto dessas energias indica que voce esta em um momento decisivo — as escolhas feitas agora reverberam por muito tempo.',
  'As tres cartas juntas formam um convite claro: abrace o processo, confie na jornada, e permita que a transformacao aconteca no seu tempo.',
  'A mensagem central e de confianca no fluxo da vida. Cada carta confirma que voce esta exatamente onde precisa estar para dar o proximo passo.',
];

const ADVICE_POSITIVE = [
  'Aproveite este momento de alinhamento cosmico. As energias estao a seu favor — aja com confianca e gratidao.',
  'O universo aplaude seus passos. Continue com a mesma autenticidade e coragem que trouxe voce ate aqui.',
  'Celebre as vitorias, mesmo as pequenas. A gratidao amplifica a energia positiva que flui na sua direcao.',
];

const ADVICE_CHALLENGING = [
  'Respire fundo e lembre-se: os maiores desafios precedem as maiores transformacoes. Voce e mais forte do que imagina.',
  'Nao fuja das dificuldades — atravesse-as com consciencia. Do outro lado, uma versao mais forte de voce espera.',
  'A sombra e parte do caminho. Acolha os desafios como mestres disfarçados e extraia a licao que eles trazem.',
];

const ADVICE_TRANSFORMATIVE = [
  'Voce esta no olho do furacao da mudanca. Solte o controle, confie no processo e permita que o novo nasca.',
  'A transformacao nao e confortavel, mas e necessaria. Deixe ir o que precisa morrer para que o extraordinário surja.',
  'Nada do que voce perde nesse processo e realmente seu. O que e verdadeiramente seu nao pode ser tirado — apenas revelado.',
];

function buildNarrative(cards: DrawnCardInput[]): string {
  const extCards = cards.map((c) => ({
    ...c,
    ext: EXTENDED_DATA.find((e) => e.id === c.card.id)!,
  }));

  const pastGroup = extCards[0].ext.thematicGroup;
  const presentGroup = extCards[1].ext.thematicGroup;
  const futureGroup = extCards[2].ext.thematicGroup;

  const opening = pickRandom(OPENING_TEMPLATES)
    .replace('{pastTheme}', GROUP_NAMES[pastGroup])
    .replace('{presentTheme}', GROUP_NAMES[presentGroup])
    .replace('{futureTheme}', GROUP_NAMES[futureGroup]);

  const posMap = ['past', 'present', 'future'] as const;
  const insights = extCards.map((c, i) => {
    const pos = posMap[i];
    const orientation = c.reversed ? 'reversed' : 'upright';
    return c.ext.positional[pos][orientation];
  });

  const trans1 = selectTransition(
    pastGroup,
    presentGroup,
    extCards[0].ext.archetypeEnergy,
    extCards[1].ext.archetypeEnergy,
  );
  const trans2 = selectTransition(
    presentGroup,
    futureGroup,
    extCards[1].ext.archetypeEnergy,
    extCards[2].ext.archetypeEnergy,
  );

  const closing = pickRandom(CLOSING_TEMPLATES);

  return `${opening}\n\n${insights[0]} ${trans1} ${insights[1]}\n\n${trans2} ${insights[2]} ${closing}`;
}

/* ─── Main Generator ─── */

export function generateReading(cards: DrawnCardInput[]): TarotReading {
  if (cards.length !== 3) {
    throw new Error('generateReading requires exactly 3 cards');
  }

  const energy = assessEnergy(cards);
  const narrative = buildNarrative(cards);

  const posMap = ['past', 'present', 'future'] as const;
  const insights = cards.map((c, i) => {
    const ext = EXTENDED_DATA.find((e) => e.id === c.card.id)!;
    const pos = posMap[i];
    const orientation = c.reversed ? 'reversed' : 'upright';
    return ext.positional[pos][orientation];
  });

  let advicePool: string[];
  switch (energy) {
    case 'positive':
      advicePool = ADVICE_POSITIVE;
      break;
    case 'challenging':
      advicePool = ADVICE_CHALLENGING;
      break;
    case 'transformative':
      advicePool = ADVICE_TRANSFORMATIVE;
      break;
  }

  return {
    narrative,
    pastInsight: insights[0],
    presentInsight: insights[1],
    futureInsight: insights[2],
    advice: pickRandom(advicePool),
    energy,
  };
}
