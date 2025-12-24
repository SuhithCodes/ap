# High School Graduation Rate Analysis (Hybrid AI + Dashboard)

**User:** District Data Analyst / Administrator  
**Goal:** Quickly understand graduation trends and ask follow-up questions without switching tools

## 1. Problem This Solves

Currently, users must:

- Open dashboards → interpret charts
- Switch to reports → read explanations
- Manually ask analysts for clarifications

**Hybrid AI approach:** chat drives intent, dashboard delivers evidence.

## 2. Hybrid Application Outline

### A. Entry State (Hybrid Default)

**Layout**

- Left: **AI Chat (35%)**
- Right: **Visualization Panel (65%)**

**Initial Prompt**

> “Show me the 4-year graduation rate trend for the last 5 years.”

## 3. AI Agent Behavior Flow

### Step 1: Intent Understanding

AI detects:

- Metric: 4-Year Graduation Rate
- Timeframe: Last 5 years
- Comparison type: Trend

**UI Response**

- Chat: Confirms understanding
- Dashboard: Renders **line chart**

### Step 2: Visualization Rendering

**Dashboard shows**

- Line chart: Graduation rate by year
- Key stat card: Latest year % and change
- Data freshness badge: “Live data”

**Chart actions**

- Hover → exact values
- Click → year focus

### Step 3: Insight + Explanation

**Chat response**

> “Graduation rates increased by 6 percentage points over five years, with the largest jump between 2021 and 2022.”

**UX detail**

- Chart subtly highlights 2021–2022

## 4. Conversational Drill-Down (Hybrid Strength)

### Follow-Up Prompt

> “Break this down by gender.”

**AI Behavior**

- Keeps same metric
- Adds subgroup dimension

**UI Update**

- Visualization switches to **grouped bar chart**
- Legend: Male / Female
- Chat explains why bar chart was chosen

## 5. Contextual Interactions (No Re-Asking)

User clicks **Female – 2023 bar**

**System understands**

- Filter: Female
- Year: 2023

**Chat auto-suggestion**

> “Would you like to compare this with the state average?”

## 6. Optional Mode Switch

User clicks **“Focus on Chat”**

**UI changes**

- Chat becomes full page
- Charts hidden but context preserved

User asks:

> “What might explain the dip in male graduation rates in 2022?”

AI responds with:

- Narrative explanation
- References previously shown data

## 7. Return to Visual Mode

User clicks **“Show Visuals”**

**Dashboard restores**

- Previous chart state
- Highlighted anomaly

This avoids reloading or losing context.

## 8. Final Output (Decision-Ready)

User clicks **“Create Insight Summary”**

**Generated**

- 1–2 charts
- Key findings text
- Exportable snapshot (PDF / link)

## 9. Why Hybrid Works Here

| Problem | Hybrid Solution |
| --- | --- |
| Cognitive overload | Chat guides attention |
| Static dashboards | AI adapts visuals |
| Repetitive filtering | Conversational memory |
| Trust issues | Visual + explanation |
| Time to insight | Reduced by ~50% |

## 10. Minimal MVP Components Needed

### Frontend

- ChatPanel
- VizCanvas
- ChartCard
- ContextBar (metric, filters)

### AI Layer

- Intent parser
- Chart selector
- Insight generator
- State memory

### One-line product pitch

> “Ask questions like a conversation, understand answers like a dashboard.”


