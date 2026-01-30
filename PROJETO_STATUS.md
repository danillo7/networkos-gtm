# NetworkOS GTM - Status do Projeto

> Documento de contexto para retomar o desenvolvimento

**Atualizado em:** 30/01/2026
**Branch atual:** `main`
**Repositório:** git@github.com:danillo7/networkos-gtm.git

---

## Resumo do Projeto

**NetworkOS GTM** é uma plataforma AI-First para Go-To-Market, oferecendo:
- Market Intelligence
- Outreach Automation
- Lead Scoring com IA
- Pipeline Management

**Stack tecnológica:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- Zustand (state management)
- Supabase (backend/database)
- Anthropic SDK (AI)

---

## Histórico de Commits

```
a81a8fc fix: Light mode CSS variables ordering
4d7325d feat: Complete theme system, i18n, and UI enhancements
0afbc8c Fix infinite re-render loop causing site flickering
02c8652 Fix Supabase optional configuration for demo mode
23210e0 feat: Add AI-First GTM functionality with full view components
fb0ea51 feat: Apple-inspired dark mode design with glassmorphism
a18479e fix: rename postcss.config.js to .cjs for ESM compatibility
145e53d fix: add postcss.config.js for Tailwind CSS
f3a96de feat: NetworkOS AI-First GTM Platform - Initial implementation
```

---

## Funcionalidades Implementadas

| Feature | Status | Arquivo Principal |
|---------|--------|-------------------|
| Dashboard com stats | ✅ Completo | `src/app/page.tsx` |
| Contacts (102 contatos) | ✅ Completo | `src/components/contacts-view.tsx` |
| Companies view | ✅ Completo | `src/components/companies-view.tsx` |
| Pipeline Kanban | ✅ Completo | `src/components/pipeline-view.tsx` |
| Pitches Generator | ✅ Completo | `src/components/pitches-view.tsx` |
| Contact Finder | ✅ Completo | `src/components/contact-finder-view.tsx` |
| Music Player (YouTube) | ✅ Completo | `src/components/music-player.tsx` |
| Theme Switcher (Light/Dark/System) | ✅ Completo | `src/components/theme-switcher.tsx` |
| Language Switcher (PT/EN/ES) | ✅ Completo | `src/components/language-switcher.tsx` |
| Zoom Controls | ✅ Completo | `src/components/zoom-controls.tsx` |
| Lead Scoring | ✅ Completo | Integrado em contacts-view |
| AI Insights Panel | ✅ Completo | `src/components/ai-insights-panel.tsx` |
| Profile Modal | ✅ Completo | `src/components/profile-modal.tsx` |
| Smart Greetings | ✅ Completo | Integrado em page.tsx |
| i18n (150+ keys) | ✅ Completo | `src/lib/i18n.ts` |

---

## Tarefas Concluídas (Última Sessão)

1. ✅ CSS - Variáveis e classes theme-aware
2. ✅ Music Player - YouTube Player
3. ✅ page.tsx - Cores theme-aware
4. ✅ Componentes View - Cores theme-aware
5. ✅ Expandir traduções i18n (150+ chaves)
6. ✅ zoom-controls.tsx - Fix zoom duplo
7. ✅ layout.tsx - Toaster dinâmico
8. ✅ tailwind.config.ts - darkMode selector

---

## Estrutura de Arquivos

```
networkos-gtm/
├── src/
│   ├── app/
│   │   ├── globals.css          # Variáveis CSS, tema, classes globais
│   │   ├── layout.tsx           # Layout principal com providers
│   │   └── page.tsx             # Dashboard principal
│   ├── components/
│   │   ├── ai-insights-panel.tsx
│   │   ├── companies-view.tsx
│   │   ├── contact-finder-view.tsx
│   │   ├── contacts-view.tsx     # 56KB - maior componente
│   │   ├── language-switcher.tsx
│   │   ├── music-player.tsx
│   │   ├── pipeline-view.tsx
│   │   ├── pitches-view.tsx
│   │   ├── profile-modal.tsx
│   │   ├── theme-switcher.tsx
│   │   ├── themed-toaster.tsx
│   │   ├── zoom-controls.tsx
│   │   └── ui/                  # Componentes UI base
│   ├── lib/
│   │   ├── i18n.ts              # Sistema de internacionalização
│   │   └── utils.ts
│   └── contexts/
│       ├── ThemeContext.tsx
│       └── LanguageContext.tsx
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## Próximos Passos (TODO)

### Prioridade Alta
- [ ] **Fix Light Mode** - Melhorar contraste do sidebar/header (parcialmente feito)
- [ ] **Integrar Supabase** - Conectar dados reais (atualmente usa mock data)
- [ ] **OpenAI/Anthropic API** - Geração real de pitches e insights

### Prioridade Média
- [ ] **Deploy Vercel** - Publicar aplicação
- [ ] **Autenticação** - Login/registro de usuários
- [ ] **Persistência** - Salvar preferências de tema/idioma

### Prioridade Baixa
- [ ] **Testes** - Adicionar Jest/Testing Library
- [ ] **PWA** - Suporte offline
- [ ] **Notificações** - Push notifications

---

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Variáveis de Ambiente

Criar arquivo `.env.local`:

```env
# Supabase (opcional - funciona em modo demo sem)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Anthropic API (para AI real)
ANTHROPIC_API_KEY=your_anthropic_key
```

---

## Notas Técnicas

### Sistema de Temas
- Usa CSS Variables em `:root` e `[data-theme="light"]`
- Classes utilitárias: `.glass-card`, `.status-hot`, `.icon-bg-blue`, etc.
- ThemeContext gerencia estado do tema

### Internacionalização (i18n)
- Suporta: PT-BR, EN, ES
- 150+ chaves de tradução
- LanguageContext gerencia idioma atual

### Dados Mock
- 102 contatos simulados com lead scoring
- 50 empresas com dados de mercado
- Pipeline com stages: Lead, Qualified, Proposal, Negotiation, Closed

---

## Contato

**Desenvolvedor:** Danillo Costa
**GitHub:** danillo7
