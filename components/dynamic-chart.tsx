"use client"

import * as React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Bar, Line, Pie, Doughnut, Scatter } from "react-chartjs-2"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartData, CHART_COLORS } from "@/lib/chart-types"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface DynamicChartProps {
  data: ChartData
  className?: string
}

export function DynamicChart({ data, className }: DynamicChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || 
        (data.type === "pie" || data.type === "doughnut" 
          ? CHART_COLORS.palette 
          : CHART_COLORS.palette[index % CHART_COLORS.palette.length]),
      borderColor: dataset.borderColor || 
        (data.type === "pie" || data.type === "doughnut"
          ? CHART_COLORS.paletteBorder
          : CHART_COLORS.paletteBorder[index % CHART_COLORS.paletteBorder.length]),
      borderWidth: dataset.borderWidth || 2,
      fill: dataset.fill ?? (data.type === "area"),
      tension: dataset.tension ?? 0.3,
    })),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: data.type !== "pie" && data.type !== "doughnut" ? {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    } : undefined,
  }

  const renderChart = () => {
    switch (data.type) {
      case "bar":
        return <Bar data={chartData} options={options} />
      case "line":
      case "area":
        return <Line data={chartData} options={options} />
      case "pie":
        return <Pie data={chartData} options={options} />
      case "doughnut":
        return <Doughnut data={chartData} options={options} />
      case "scatter":
        return <Scatter data={chartData} options={options} />
      default:
        return <Bar data={chartData} options={options} />
    }
  }

  return (
    <Card className={cn("border-slate-200 dark:border-slate-800", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{data.title}</CardTitle>
        {data.description && (
          <CardDescription>{data.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  )
}

