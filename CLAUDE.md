# CLAUDE.md - Contexto para Claude Code

## O que é este projeto?

NetworkOS GTM é uma plataforma AI-First de Go-To-Market com:
- Dashboard de contacts/companies/pipeline
- Lead scoring com IA
- Gerador de pitches
- Player de música Lo-Fi integrado
- Sistema de temas (dark/light/system)
- i18n (PT/EN/ES)

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- Supabase (opcional)

## Comandos

```bash
npm run dev      # Dev server em localhost:3000
npm run build    # Build produção
npm run typecheck
```

## Arquivos Principais

- `src/app/page.tsx` - Dashboard principal
- `src/app/globals.css` - Variáveis CSS e classes de tema
- `src/components/contacts-view.tsx` - View de contatos (maior componente)
- `src/lib/i18n.ts` - Traduções

## Estado Atual

- Build passando
- 8 tasks do último plano concluídas
- Light mode com fix de CSS variables
- Mock data (102 contatos, 50 empresas)

## Pendências

1. Melhorar contraste light mode
2. Conectar Supabase real
3. Integrar API Anthropic para pitches
4. Deploy Vercel

## Convenções

- Usar CSS variables para cores (não hardcode)
- Classes: `text-theme-primary`, `glass-card`, `status-hot`
- Traduções em `src/lib/i18n.ts`
