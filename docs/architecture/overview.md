# Architecture Overview

## Current state (repo today)

### Frontend

- **Next.js App Router** under `app/`
- **UI shell** uses Sidebar primitives in `components/ui/sidebar.tsx` with app navigation in `components/app-sidebar.tsx`
- **Styling**: Tailwind CSS (see `app/globals.css`)

### Backend / AI

- **Not implemented yet** in this repo.

## Target state (hybrid AI + dashboard)

### High-level idea

- **Chat drives intent**
- **Visualization panel provides evidence**
- **Both share a single, explicit “analysis state”** (metric, timeframe, filters, chart type)

### Suggested module boundaries (MVP)

- **UI**: ChatPanel, VizCanvas, ChartCard, ContextBar
- **AI layer**: Intent parser, Chart selector, Insight generator, State memory
- **Data**: query layer for graduation rates and subgroup slices

### State model (recommended)

- `metric`: e.g. `grad_rate_4yr`
- `timeframe`: e.g. last 5 years
- `dimensions`: e.g. `gender`
- `filters`: e.g. `{ gender: "Female", year: 2023 }`
- `chart`: e.g. `line` | `groupedBar`
- `dataSource`: freshness + provenance


