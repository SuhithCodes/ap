# Components

This repo follows a “UI primitives + composition” approach.

## Key app-level components

- `components/app-sidebar.tsx`: primary navigation shell
- `components/nav-main.tsx`: main nav groups
- `components/nav-projects.tsx`: projects list in sidebar
- `components/nav-secondary.tsx`: support/feedback
- `components/nav-user.tsx`: user menu/footer area

## UI primitives

UI primitives live in `components/ui/*` and wrap Radix UI building blocks (e.g. dropdowns, tooltips, sheet).

Commonly used:

- `components/ui/sidebar.tsx`
- `components/ui/button.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/tooltip.tsx`

## Planned feature components (hybrid MVP)

- ChatPanel
- VizCanvas
- ChartCard
- ContextBar


