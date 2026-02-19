# AIOS Full Handoff - DreamerAI Project

## 🎯 COMANDO PARA COPIAR E COLAR NA NOVA INSTÂNCIA

```
@architect

Preciso que você execute uma correção arquitetural COMPLETA e automatizada do projeto dreamer-ai.

CONTEXTO ATUAL:
- Projeto: dreamer-ai (app astrológico com navegação 3D)
- Stack: Next.js 16.1.6, React Three Fiber v9, TypeScript, Tailwind v4
- Repo: https://github.com/darwimmusic/dreamer-ai (master branch)
- DevOps: GitHub Actions configurado, mas CI falhando
- ESLint: 18 errors, 6 warnings (detalhes abaixo)

ERROS A CORRIGIR:
1. PlanetView.tsx (linha 121, 129): setState in useEffect
2. Planet.tsx (linha 32): texture modification from hook
3. StarField.tsx (linha 31): Math.random during render
4. CompatibilityModule.tsx (linha 81): component created during render
5. useCameraAnimation.ts (linha 37): camera position modification
6. useMediaQuery.ts (linha 10): setState in useEffect
7. 6 warnings de variáveis não utilizadas

TAREFAS AUTOMATIZADAS QUE PRECISO:
1. Corrigir TODOS os erros de lint seguindo best practices React/Next.js
2. Implementar testes básicos (Jest + React Testing Library)
3. Configurar Git Flow (master/develop/feature branches)
4. Criar documentação arquitetural completa
5. Executar quality gates e garantir CI verde
6. Criar release v0.2.0 com changelog
7. Configurar pre-commit hooks
8. Implementar error boundaries
9. Adicionar logging e monitoring básico
10. Otimizar performance do Three.js

IMPORTANTE:
- Execute TUDO automaticamente
- Use Task tool para operações complexas
- Delegue para @dev, @qa conforme necessário
- Só me pergunte decisões ESTRATÉGICAS (não técnicas)
- Ao final, chame @devops para push final

ESTRUTURA ATUAL DO PROJETO:
src/
  app/              # Next.js App Router
  components/       # Componentes React + Three.js
  features/         # Módulos por planeta
  stores/           # Zustand state
  hooks/            # Custom hooks
  lib/              # Utilitários

DECISÕES JÁ TOMADAS:
- Usar meshBasicMaterial para texturas (NÃO mudar)
- Manter Zustand para state management
- Branch principal é 'master' (não 'main')
- Deployment via Vercel (já configurado)

Execute tudo e só me consulte para decisões de negócio ou arquiteturais maiores.
```

## 📊 STATUS ATUAL DETALHADO

### Configurações Completadas ✅
- [x] GitHub CLI autenticado (usuário: joaolozano-lendario)
- [x] Node.js 22.12.0, npm 10.9.0, pnpm, bun instalados
- [x] GitHub Actions workflows criados
- [x] ESLint configurado (mas com erros)
- [x] TypeScript configurado
- [x] Git configurado

### Problemas Atuais ❌
- [ ] 18 ESLint errors no código
- [ ] 6 ESLint warnings
- [ ] Sem testes configurados
- [ ] Sem pre-commit hooks
- [ ] Sem error boundaries
- [ ] Performance não otimizada
- [ ] Sem documentação arquitetural

### Arquivos Críticos para Revisar
1. `src/components/navigation/PlanetView.tsx` - setState in effects
2. `src/components/solar-system/Planet.tsx` - texture mutations
3. `src/components/solar-system/StarField.tsx` - impure renders
4. `src/features/compatibility/CompatibilityModule.tsx` - inline components
5. `src/hooks/useCameraAnimation.ts` - camera mutations
6. `src/hooks/useMediaQuery.ts` - setState in effect

## 🚀 COMANDOS ÚTEIS JÁ DISPONÍVEIS

```bash
# Quality checks
npm run lint        # Ver erros
npm run lint:fix    # Corrigir automaticamente
npm run typecheck   # Verificar tipos
npm run build       # Build produção

# Git/GitHub (via PowerShell)
& 'C:\Program Files\GitHub CLI\gh.exe' run list
& 'C:\Program Files\GitHub CLI\gh.exe' pr create
```

## 🎯 RESULTADO ESPERADO

Após executar o comando acima, você deve ter:
1. ✅ Zero erros de lint
2. ✅ Testes configurados e passando
3. ✅ CI/CD verde no GitHub
4. ✅ Git Flow configurado
5. ✅ Release v0.2.0 publicada
6. ✅ Documentação completa
7. ✅ Performance otimizada
8. ✅ Sistema pronto para desenvolvimento

## 💡 NOTAS IMPORTANTES

- O agent @architect vai coordenar tudo
- Deixe os agents trabalharem em paralelo quando possível
- Só interfira em decisões estratégicas
- O fluxo correto é: architect → dev → qa → devops
- Tudo está em português BR nas interfaces

---

**COPIE O COMANDO ACIMA E COLE NA NOVA INSTÂNCIA DO CLAUDE**