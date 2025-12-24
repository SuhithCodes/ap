# Chat ↔ Visualization Contracts (Planned)

Goal: make the hybrid experience deterministic by having the AI return **structured state updates** alongside narrative text.

## Core concept: Analysis State

The UI should maintain a single `analysisState` that both panels read from.

Example fields:

- `metric`: `"grad_rate_4yr"`
- `timeframe`: `{ "type": "last_n_years", "n": 5 }`
- `dimensions`: `["year"]` or `["year", "gender"]`
- `filters`: `{ "gender": "Female", "year": 2023 }`
- `chart`: `{ "type": "line" | "grouped_bar", "x": "year", "y": "value", "series": "gender?" }`

## Message types

### 1) Chat request (user → system)

- `type`: `"user_message"`
- `text`: string
- `uiContext` (optional): click selections, hovered items, current state snapshot

### 2) Agent response (system → UI)

- `type`: `"agent_response"`
- `assistantText`: string (what the user reads)
- `statePatch`: partial update to `analysisState`
- `vizSpec` (optional): explicit chart spec when needed
- `suggestions` (optional): array of next questions

## UI click events (viz → chat context)

When the user clicks a chart element (e.g. Female-2023 bar), send a context event:

- `type`: `"viz_click"`
- `selection`: `{ "gender": "Female", "year": 2023 }`
- `source`: `{ "chartType": "grouped_bar", "id": "grad_rate_by_gender" }`

## Determinism rules (recommended)

- Follow-ups inherit metric + timeframe unless explicitly changed.
- A click selection updates `filters` and becomes default context for the next prompt.
- Agent should explain chart changes briefly (trust + predictability).


