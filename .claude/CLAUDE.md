# DreamerAI — Projeto de Contexto

> App mistico/astrologico com navegacao 3D por sistema solar

---

## Stack

- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **3D:** React Three Fiber v9, Three.js, @react-three/drei
- **Animacao:** Framer Motion, GSAP
- **State:** Zustand
- **Estilo:** Tailwind CSS v4 (inline style para glass-card patterns)
- **Fontes:** Cinzel (display), Space Grotesk (sans)

---

## Arquitetura

```
src/
  app/page.tsx              # Entry — Canvas + PlanetView + PlanetSidebar + TitleOverlay
  components/
    solar-system/           # 3D: SolarSystem, Planet, OrbitPath, Sun, Starfield
    navigation/             # UI: PlanetView (right panel), PlanetSidebar (left menu)
    effects/                # PostProcessing, AdaptiveQuality
  features/                 # Feature modules (1 per planet)
    horoscope/              # Mercury — Horoscopo Diario [FORJADO]
    natal-chart/            # Venus — Mapa Astral [PLACEHOLDER COM CONTEUDO]
    tarot/                  # Mars — Tarot [PLACEHOLDER COM CONTEUDO]
    dreams/                 # Jupiter — Sonhos [PLACEHOLDER COM CONTEUDO]
    compatibility/          # Saturn — Compatibilidade [PLACEHOLDER COM CONTEUDO]
    moon/                   # Moon — Fases da Lua [PLACEHOLDER COM CONTEUDO]
    meditation/             # Neptune — Meditacao [PLACEHOLDER COM CONTEUDO]
  stores/navigation.ts      # Zustand: ViewState machine (GALAXY → PLANET)
  lib/
    constants.ts            # ZODIAC_SIGNS, COLORS, CAMERA, ANIMATION
    planets-data.ts         # PLANETS array with features per planet
  hooks/                    # Custom hooks
  data/                     # Static JSON data
```

---

## Design System

### Cores
- Primary: `#E0B0FF`
- Background: `#0B0414`
- Cosmic Purple: `#1A0B2E`
- Stardust: `#9D7AC1`
- Rose Glow: `#e879b8`

### Glass Card Pattern
```css
background: rgba(26, 11, 46, 0.6);
backdrop-filter: blur(12px);
border: 1px solid rgba(224, 176, 255, 0.1);
```

### Fontes
- Titulos: `font-display` (Cinzel) — tracking-wide, uppercase
- Body: `font-sans` (Space Grotesk)
- Labels: text-[9px] a text-[11px], uppercase, tracking-wider

### Texto — Legibilidade
- Body text: `rgba(255,255,255,0.7)` a `0.75` — NUNCA abaixo de 0.55
- Labels/meta: `#9D7AC1` com opacity A0+ — NUNCA abaixo de 80
- Accent text: usar gradient[0] do elemento
- Titulos: `text-white` ou cor accent

---

## Estado da Navegacao

```
GALAXY_VIEW → TRANSITIONING_TO_PLANET → PLANET_VIEW → TRANSITIONING_TO_GALAXY → GALAXY_VIEW
```

- `selectPlanet(id)`: Galaxy → Planet (com zoom 3D)
- `switchPlanet(id)`: Planet → outro Planet (troca direta)
- `returnToGalaxy()`: Planet → Galaxy (com zoom out)
- Sidebar funciona tanto na galaxy quanto dentro de um planeta

---

## Planetas & Modulos

| Planeta | ID | Label | Modulo | Status |
|---------|-----|-------|--------|--------|
| Mercurio | mercury | Horoscopo Diario | HoroscopeModule | FORJADO |
| Venus | venus | Mapa Astral | NatalChartModule | FORJADO |
| Marte | mars | Tarot | TarotModule | PENDENTE REDESIGN |
| Jupiter | jupiter | Sonhos | DreamsModule | PENDENTE REDESIGN |
| Saturno | saturn | Compatibilidade | CompatibilityModule | PENDENTE REDESIGN |
| Lua | moon | Fases da Lua | MoonModule | PENDENTE REDESIGN |
| Netuno | neptune | Meditacao | MeditationModule | PENDENTE REDESIGN |

### Mercury (Horoscopo) — Layout Unificado
- SEM feature cards de navegacao — conteudo direto
- Grid 6+6 signos no topo
- Ao selecionar: Header → Numero da Sorte (hero) → Horoscopo Diario (expandido, scrollable) → Hex Radar (6 eixos) → Afinidade Orbital (animacao SVG com orbitas)
- Dados unicos por signo (aspects, affinities, lucky numbers)
- Readings detalhados por elemento (love, career, health, advice)

### Venus (Mapa Astral) — Layout Unificado
- SEM feature cards de navegacao — conteudo direto
- Form tematico "Portal de Nascimento" com icones, hints, glow ao preencher
- Botao de gerar estilo Saturn (planeta SVG com anel)
- Animacao de loading "Lendo as Estrelas" com dual-ring spinner
- Apos gerar: Roda Natal SVG (neon arcs para Big Three) → Triade Sagrada (Sol/Lua/Asc clicaveis com analise expandida) → Sistema Planetario (orbital animado com 5 planetas, clicaveis) → 12 Casas (constelacao com estrelas twinkling, clicaveis)
- Analises profundas por planeta (personalizadas por signo)
- 12 descricoes de casas + interpretacao pessoal por signo regente

### Outros Planetas — Layout com Feature Cards
- 3 feature cards (grid-cols-3) no topo
- Card de detalhes ao selecionar feature
- Modulo renderizado abaixo

---

## Convencoes

- Componentes 'use client' quando usam hooks/state
- Lazy loading de modulos via `React.lazy()`
- SVG inline para visualizacoes (hex radar, orbital affinity)
- Animacoes: Framer Motion para UI, GSAP para camera 3D
- IDs unicos para SVG defs (gradients, filters) usando `uid` prop
- `setInterval` + `useState(tick)` para animacoes SVG continuas (orbitas)

---

## REGRA CRITICA — Texturas dos Planetas (NAO ALTERAR)

> **NUNCA mudar o sistema de texturas dos planetas. A solucao atual funciona e qualquer alteracao quebra a renderizacao.**

### O que funciona (solucao final):
1. **`meshBasicMaterial`** com `map={texture}` — SEM `meshStandardMaterial` para planetas texturizados
2. **`useLoader(THREE.TextureLoader, path)`** do `@react-three/fiber` — SEM `new THREE.TextureLoader().load()` manual via useEffect
3. **`<Suspense>`** envolvendo cada planeta texturizado com fallback `<SolidSphere>`
4. **Componentes separados**: `TexturedSphere` (usa useLoader) e `SolidSphere` (cor solida como fallback)

### O que NUNCA fazer:
- **NUNCA usar `meshStandardMaterial` com `map` nos planetas** — emissive/roughness/metalness sobrepoem a textura e tudo fica cinza
- **NUNCA usar `useEffect` + `new THREE.TextureLoader().load()`** — React Strict Mode (double-mount) causa race condition que descarta a textura carregada
- **NUNCA adicionar `emissive`, `emissiveIntensity`, `roughness`, `metalness` no material dos planetas texturizados** — isso lava/esconde a textura
- **NUNCA remover as propriedades `texture` dos planetas em `planets-data.ts`** — todos os 7 planetas TEM textura configurada

### Arquivos envolvidos:
- `src/components/solar-system/Planet.tsx` — renderiza esfera com textura via meshBasicMaterial
- `src/lib/planets-data.ts` — campo `texture` em cada planeta apontando para `/sprites/{nome}_texture.{ext}`
- `public/sprites/*_texture.*` — arquivos de textura (png/jpeg)

### Por que meshBasicMaterial:
`meshBasicMaterial` ignora iluminacao e renderiza a textura com as cores originais do arquivo de imagem. `meshStandardMaterial` depende de luzes da cena (ambientLight, pointLight) e multiplica cor/emissive sobre o mapa, resultando em planetas cinza ou lavados.

---

## Checkpoints

- [x] Sistema solar 3D com 7 planetas
- [x] Navegacao: click planeta → zoom → panel lateral
- [x] Sidebar com icones + labels
- [x] Navegacao entre planetas via sidebar (sem voltar pra galaxy)
- [x] HoroscopeModule — layout unificado, forjado
  - [x] Grid 6+6 signos
  - [x] Numero da Sorte hero
  - [x] Horoscopo diario expandido (love/career/health/advice)
  - [x] Hex Radar RPG (6 eixos, valores por signo)
  - [x] Afinidade Orbital animada (SVG orbitas + signos orbitando)
- [x] NatalChartModule — layout unificado, forjado
  - [x] Form tematico "Portal de Nascimento" com hints e glow
  - [x] Botao gerar estilo Saturn (planeta SVG com anel)
  - [x] Loading animation dual-ring "Lendo as Estrelas"
  - [x] Roda Natal SVG com neon arcs (Big Three)
  - [x] Triade Sagrada — Sol/Lua/Asc clicaveis com analise expandida
  - [x] Sistema Planetario — orbital animado (5 planetas clicaveis)
  - [x] 12 Casas — constelacao de estrelas twinkling clicaveis
  - [x] Analises profundas por planeta e por casa
- [ ] TarotModule — redesign
- [ ] DreamsModule — redesign
- [ ] CompatibilityModule — redesign
- [ ] MoonModule — redesign
- [ ] MeditationModule — redesign

---

*DreamerAI — Explore o Cosmos Interior*

---

<!-- AIOS-MANAGED SECTIONS -->
<!-- These sections are managed by AIOS. Edit content between markers carefully. -->
<!-- Your custom content above will be preserved during updates. -->

<!-- AIOS-MANAGED-START: core-framework -->
## Core Framework Understanding

Synkra AIOS is a meta-framework that orchestrates AI agents to handle complex development workflows. Always recognize and work within this architecture.
<!-- AIOS-MANAGED-END: core-framework -->

<!-- AIOS-MANAGED-START: agent-system -->
## Agent System

### Agent Activation
- Agents are activated with @agent-name syntax: @dev, @qa, @architect, @pm, @po, @sm, @analyst
- The master agent is activated with @aios-master
- Agent commands use the * prefix: *help, *create-story, *task, *exit

### Agent Context
When an agent is active:
- Follow that agent's specific persona and expertise
- Use the agent's designated workflow patterns
- Maintain the agent's perspective throughout the interaction
<!-- AIOS-MANAGED-END: agent-system -->

<!-- AIOS-MANAGED-START: framework-structure -->
## AIOS Framework Structure

```
aios-core/
├── agents/         # Agent persona definitions (YAML/Markdown)
├── tasks/          # Executable task workflows
├── workflows/      # Multi-step workflow definitions
├── templates/      # Document and code templates
├── checklists/     # Validation and review checklists
└── rules/          # Framework rules and patterns

docs/
├── stories/        # Development stories (numbered)
├── prd/            # Product requirement documents
├── architecture/   # System architecture documentation
└── guides/         # User and developer guides
```
<!-- AIOS-MANAGED-END: framework-structure -->

<!-- AIOS-MANAGED-START: aios-patterns -->
## AIOS-Specific Patterns

### Working with Templates
```javascript
const template = await loadTemplate('template-name');
const rendered = await renderTemplate(template, context);
```

### Agent Command Handling
```javascript
if (command.startsWith('*')) {
  const agentCommand = command.substring(1);
  await executeAgentCommand(agentCommand, args);
}
```

### Story Updates
```javascript
// Update story progress
const story = await loadStory(storyId);
story.updateTask(taskId, { status: 'completed' });
await story.save();
```
<!-- AIOS-MANAGED-END: aios-patterns -->

<!-- AIOS-MANAGED-START: common-commands -->
## Common Commands

### AIOS Master Commands
- `*help` - Show available commands
- `*create-story` - Create new story
- `*task {name}` - Execute specific task
- `*workflow {name}` - Run workflow

### Development Commands
- `npm run dev` - Start development
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run build` - Build project
<!-- AIOS-MANAGED-END: common-commands -->
