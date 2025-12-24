# Frontend Architecture

## App Router structure

- Routes live under `app/`
- Shared layout in `app/layout.tsx`

## UI system

- Reusable primitives are in `components/ui/*` (shadcn/ui style)
- `components/app-sidebar.tsx` composes navigation primitives and app nav config

## Hybrid layout (planned)

Default split:

- Left: **AI Chat** (35%)
- Right: **Visualization Panel** (65%)

Optional mode switch:

- **Focus on Chat** (chat full-width, visuals hidden but state preserved)
- **Show Visuals** (restore prior visualization state)


