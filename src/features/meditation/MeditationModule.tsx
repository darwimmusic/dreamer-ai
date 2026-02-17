'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { glassCard, DS_COLORS, createAccentStyles } from '@/lib/design-system';

const ACCENT = '#818cf8';
const styles = createAccentStyles(ACCENT);

interface Meditation {
  id: number;
  title: string;
  duration: number;
  phase: string;
  intention: string;
  description: string;
  steps: string[];
}

const MEDITATIONS: Meditation[] = [
  {
    id: 1,
    title: 'Respiracao Cosmica',
    duration: 300,
    phase: 'Qualquer',
    intention: 'Centralizacao',
    description: 'Conecte-se com o ritmo do universo atraves da respiracao consciente.',
    steps: ['Feche os olhos e respire fundo', 'Imagine que inspira luz estelar', 'Expire liberando tensoes', 'Sinta-se parte do cosmos'],
  },
  {
    id: 2,
    title: 'Manifestacao na Lua Nova',
    duration: 600,
    phase: 'Lua Nova',
    intention: 'Manifestacao',
    description: 'Plante as sementes das suas intencoes na energia da Lua Nova.',
    steps: ['Escreva suas intencoes', 'Visualize cada uma se realizando', 'Sinta gratidao antecipada', 'Libere para o universo'],
  },
  {
    id: 3,
    title: 'Banho de Lua Cheia',
    duration: 900,
    phase: 'Lua Cheia',
    intention: 'Purificacao',
    description: 'Ritual de purificacao e gratidao sob a energia da Lua Cheia.',
    steps: ['Encontre um local com luar (ou visualize)', 'Abra os bracos para receber a luz', 'Agradeca pelo que foi realizado', 'Libere o que nao serve mais'],
  },
  {
    id: 4,
    title: 'Meditacao dos Chakras',
    duration: 900,
    phase: 'Qualquer',
    intention: 'Equilibrio',
    description: 'Equilibre seus centros de energia dos pes a coroa.',
    steps: ['Raiz (vermelho): seguranca', 'Sacro (laranja): criatividade', 'Plexo (amarelo): poder', 'Coracao (verde): amor', 'Garganta (azul): expressao', 'Terceiro olho (indigo): intuicao', 'Coroa (violeta): conexao divina'],
  },
  {
    id: 5,
    title: 'Ritual de Liberacao',
    duration: 600,
    phase: 'Quarto Minguante',
    intention: 'Liberacao',
    description: 'Libere padroes, habitos e energias que nao servem mais ao seu crescimento.',
    steps: ['Identifique o que deseja liberar', 'Escreva em um papel (real ou mental)', 'Visualize queimando o papel', 'Sinta o alivio da liberacao'],
  },
  {
    id: 6,
    title: 'Conexao com o Eu Superior',
    duration: 720,
    phase: 'Qualquer',
    intention: 'Espiritualidade',
    description: 'Estabeleca uma conexao com sua sabedoria interior e guias espirituais.',
    steps: ['Relaxe profundamente', 'Visualize uma escada de luz', 'Suba ate encontrar seu Eu Superior', 'Faca sua pergunta e escute'],
  },
  {
    id: 7,
    title: 'Gratidao Estelar',
    duration: 300,
    phase: 'Qualquer',
    intention: 'Gratidao',
    description: 'Pratica rapida de gratidao conectada as estrelas.',
    steps: ['Nomeie 3 bencaos de hoje', 'Envie gratidao ao universo', 'Receba de volta multiplicado', 'Sorria e agradeça'],
  },
  {
    id: 8,
    title: 'Ritual de Abundancia',
    duration: 600,
    phase: 'Crescente',
    intention: 'Abundancia',
    description: 'Atraia abundancia em todas as formas durante a lua crescente.',
    steps: ['Visualize um rio dourado de luz', 'Veja-o fluindo em sua direcao', 'Abra-se para receber', 'Agradeca pela abundancia presente'],
  },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function MeditationModule() {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((duration: number) => {
    setTimeLeft(duration);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, timeLeft]);

  const toggleTimer = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else if (selectedMeditation) {
      if (timeLeft === 0) {
        startTimer(selectedMeditation.duration);
      } else {
        setIsPlaying(true);
      }
    }
  };

  const resetTimer = () => {
    setIsPlaying(false);
    if (selectedMeditation) setTimeLeft(selectedMeditation.duration);
  };

  const filtered = filter === 'all' ? MEDITATIONS : MEDITATIONS.filter((m) => m.intention.toLowerCase() === filter);
  const intentions = ['all', ...new Set(MEDITATIONS.map((m) => m.intention.toLowerCase()))];

  const progress = selectedMeditation ? 1 - timeLeft / selectedMeditation.duration : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      {/* Active meditation timer */}
      {selectedMeditation && (
        <>
          {/* ─── Timer Section ─── */}
          <div>
            <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
              <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
              <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
                🧘 Timer
              </span>
              <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
            </div>
            <div
              className="rounded-2xl p-6 text-center space-y-4"
              style={glassCard}
            >
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: ACCENT }}>
                {selectedMeditation.title}
              </h3>

              {/* Circular timer */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 276.5} 276.5`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-mono" style={{ color: 'white' }}>{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={toggleTimer}
                  className="rounded-2xl px-6 py-3 text-lg font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 hover:brightness-110"
                  style={styles.buttonGradient(true)}
                >
                  <span style={{ color: 'white' }}>
                    {isPlaying ? 'Pausar' : timeLeft === 0 ? 'Iniciar' : 'Continuar'}
                  </span>
                </button>
                <button
                  onClick={resetTimer}
                  className="rounded-2xl px-4 py-3 text-lg cursor-pointer transition-all duration-300 hover:brightness-110"
                  style={{ ...glassCard, color: DS_COLORS.primaryText }}
                >
                  Resetar
                </button>
              </div>
            </div>
          </div>

          {/* ─── Steps Section ─── */}
          <div>
            <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
              <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
              <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
                📋 Passos
              </span>
              <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
            </div>
            <div
              className="rounded-2xl p-6 space-y-3"
              style={styles.detailCard()}
            >
              {selectedMeditation.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg font-bold mt-0.5" style={{ color: ACCENT }}>{i + 1}.</span>
                  <p className="text-lg leading-[1.85]" style={{ color: DS_COLORS.bodyText }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setSelectedMeditation(null);
                setIsPlaying(false);
                setTimeLeft(0);
              }}
              className="text-sm cursor-pointer transition-colors"
              style={{ color: `${DS_COLORS.primaryText}50` }}
            >
              Escolher outra meditacao
            </button>
          </div>
        </>
      )}

      {/* Filter & List */}
      {!selectedMeditation && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {intentions.map((int) => (
              <button
                key={int}
                onClick={() => setFilter(int)}
                className="shrink-0 text-sm px-4 py-2 rounded-full capitalize transition-all cursor-pointer font-medium"
                style={
                  filter === int
                    ? { background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}30` }
                    : { ...glassCard, color: `${DS_COLORS.primaryText}80` }
                }
              >
                {int === 'all' ? 'Todos' : int}
              </button>
            ))}
          </div>

          {/* ─── Meditation List ─── */}
          <div>
            <div className="flex items-center gap-3 mt-[52px] mb-[52px]">
              <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
              <span className="text-3xl font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: DS_COLORS.primaryText }}>
                🔮 Meditacoes
              </span>
              <div className="flex-1 h-px" style={{ background: DS_COLORS.divider }} />
            </div>
            <div className="space-y-3">
              {filtered.map((med) => (
                <button
                  key={med.id}
                  onClick={() => {
                    setSelectedMeditation(med);
                    setTimeLeft(med.duration);
                  }}
                  className="w-full rounded-2xl p-5 text-left transition-all cursor-pointer hover:brightness-110"
                  style={glassCard}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold" style={{ color: 'white', fontFamily: 'var(--font-display)' }}>{med.title}</h4>
                    <span className="text-sm" style={{ color: `${DS_COLORS.primaryText}50` }}>{formatTime(med.duration)}</span>
                  </div>
                  <p className="text-base mt-1" style={{ color: DS_COLORS.bodyText }}>{med.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className="text-xs rounded-full px-2.5 py-0.5 font-medium"
                      style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}25`, color: ACCENT }}
                    >
                      {med.phase}
                    </span>
                    <span
                      className="text-xs rounded-full px-2.5 py-0.5"
                      style={{ ...glassCard, color: `${DS_COLORS.primaryText}80` }}
                    >
                      {med.intention}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
