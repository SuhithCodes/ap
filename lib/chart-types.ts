// Chart configuration types for visualization
export type ChartType = "bar" | "line" | "pie" | "doughnut" | "scatter" | "area"

export type ChartDataset = {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
  tension?: number
}

export type ChartData = {
  type: ChartType
  title: string
  labels: string[]
  datasets: ChartDataset[]
  description?: string
}

export type VisualizationResponse = {
  text: string
  chart?: ChartData
  table?: {
    headers: string[]
    rows: (string | number)[][]
  }
}

// Default chart colors
export const CHART_COLORS = {
  primary: "rgba(59, 130, 246, 0.8)",
  primaryBorder: "rgb(59, 130, 246)",
  secondary: "rgba(16, 185, 129, 0.8)",
  secondaryBorder: "rgb(16, 185, 129)",
  tertiary: "rgba(249, 115, 22, 0.8)",
  tertiaryBorder: "rgb(249, 115, 22)",
  quaternary: "rgba(139, 92, 246, 0.8)",
  quaternaryBorder: "rgb(139, 92, 246)",
  palette: [
    "rgba(59, 130, 246, 0.8)",
    "rgba(16, 185, 129, 0.8)",
    "rgba(249, 115, 22, 0.8)",
    "rgba(139, 92, 246, 0.8)",
    "rgba(236, 72, 153, 0.8)",
    "rgba(14, 165, 233, 0.8)",
    "rgba(234, 179, 8, 0.8)",
    "rgba(239, 68, 68, 0.8)",
  ],
  paletteBorder: [
    "rgb(59, 130, 246)",
    "rgb(16, 185, 129)",
    "rgb(249, 115, 22)",
    "rgb(139, 92, 246)",
    "rgb(236, 72, 153)",
    "rgb(14, 165, 233)",
    "rgb(234, 179, 8)",
    "rgb(239, 68, 68)",
  ],
}

// Helper to generate chart data from parsed response
export function createChartConfig(data: ChartData): ChartData {
  // Apply default colors if not provided
  const datasets = data.datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || CHART_COLORS.palette[index % CHART_COLORS.palette.length],
    borderColor: dataset.borderColor || CHART_COLORS.paletteBorder[index % CHART_COLORS.paletteBorder.length],
    borderWidth: dataset.borderWidth || 2,
  }))

  return {
    ...data,
    datasets,
  }
}

