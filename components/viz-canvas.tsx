"use client"

import * as React from "react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Maximize2,
  Download,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Demo data for general analytics
const performanceTrendData = [
  { period: "Q1", value: 78.2, categoryA: 75.8, categoryB: 80.6 },
  { period: "Q2", value: 82.5, categoryA: 79.9, categoryB: 85.1 },
  { period: "Q3", value: 85.1, categoryA: 81.2, categoryB: 89.0 },
  { period: "Q4", value: 91.8, categoryA: 87.5, categoryB: 96.1 },
  { period: "Q5", value: 94.2, categoryA: 90.1, categoryB: 98.3 },
]

const categoryComparisonData = [
  { period: "Q1", categoryA: 75.8, categoryB: 80.6 },
  { period: "Q2", categoryA: 79.9, categoryB: 85.1 },
  { period: "Q3", categoryA: 81.2, categoryB: 89.0 },
  { period: "Q4", categoryA: 87.5, categoryB: 96.1 },
  { period: "Q5", categoryA: 90.1, categoryB: 98.3 },
]

export type ChartType = "trend" | "category-comparison" | "period-focus"
export type ActiveFilter = {
  metric: string
  timeframe: string
  subgroup?: string
  period?: string
}

interface VizCanvasProps {
  chartType: ChartType
  activeFilter: ActiveFilter
  highlightYears?: string[]
  onYearClick?: (year: string) => void
  className?: string
}

const trendChartConfig = {
  value: {
    label: "Performance",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const categoryChartConfig = {
  categoryA: {
    label: "Category A",
    color: "var(--chart-2)",
  },
  categoryB: {
    label: "Category B",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function VizCanvas({
  chartType,
  activeFilter,
  highlightYears = [],
  onYearClick,
  className,
}: VizCanvasProps) {
  const latestValue = performanceTrendData[performanceTrendData.length - 1].value
  const previousValue = performanceTrendData[performanceTrendData.length - 2].value
  const change = latestValue - previousValue
  const totalChange =
    performanceTrendData[performanceTrendData.length - 1].value -
    performanceTrendData[0].value

  return (
    <div className={cn("flex h-full flex-col gap-4 p-4", className)}>
      {/* Stats Cards Row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={Activity}
          label="Current Value"
          value={`${latestValue}%`}
          change={change}
          changeLabel="vs last period"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Growth"
          value={`+${totalChange.toFixed(1)}pp`}
          sublabel="Since Q1"
        />
        <StatCard
          icon={Users}
          label="Category Gap"
          value={`${(categoryComparisonData[categoryComparisonData.length - 1].categoryB - categoryComparisonData[categoryComparisonData.length - 1].categoryA).toFixed(1)}pp`}
          sublabel="B leads A"
        />
      </div>

      {/* Main Chart */}
      <Card className="flex-1 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {chartType === "trend" && "Performance Trend"}
              {chartType === "category-comparison" && "Category Comparison"}
              {chartType === "period-focus" && `${activeFilter.period} Detailed View`}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {activeFilter.timeframe} · {activeFilter.metric}
              {activeFilter.subgroup && ` · ${activeFilter.subgroup}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live data
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {chartType === "trend" && (
            <ChartContainer config={trendChartConfig} className="h-[280px] w-full">
              <LineChart
                accessibilityLayer
                data={performanceTrendData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-slate-500"
                />
                <YAxis
                  domain={[70, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}%`}
                  className="text-slate-500"
                />
                {highlightYears.includes("Q3-Q4") && (
                  <ReferenceLine
                    x="Q4"
                    stroke="var(--chart-4)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                )}
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[160px]"
                      labelFormatter={(value) => `Period ${value}`}
                      formatter={(value) => [`${value}%`, "Performance"]}
                    />
                  }
                />
                <Line
                  dataKey="value"
                  type="monotone"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const isHighlighted = highlightYears.includes(payload.period)
                    return (
                      <circle
                        key={`dot-${index}-${payload.period}`}
                        cx={cx}
                        cy={cy}
                        r={isHighlighted ? 8 : 5}
                        fill="white"
                        stroke={isHighlighted ? "var(--chart-4)" : "var(--chart-1)"}
                        strokeWidth={isHighlighted ? 3 : 2}
                        className="cursor-pointer transition-all hover:r-8"
                        onClick={() => onYearClick?.(payload.period)}
                      />
                    )
                  }}
                  activeDot={{
                    r: 8,
                    fill: "var(--chart-1)",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ChartContainer>
          )}

          {chartType === "category-comparison" && (
            <ChartContainer config={categoryChartConfig} className="h-[280px] w-full">
              <BarChart
                accessibilityLayer
                data={categoryComparisonData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-slate-500"
                />
                <YAxis
                  domain={[70, 105]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}%`}
                  className="text-slate-500"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[180px]"
                      labelFormatter={(value) => `Period ${value}`}
                    />
                  }
                />
                <Bar
                  dataKey="categoryA"
                  fill="var(--color-categoryA)"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer opacity-90 transition-opacity hover:opacity-100"
                  onClick={(data) => onYearClick?.(data.period)}
                />
                <Bar
                  dataKey="categoryB"
                  fill="var(--color-categoryB)"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer opacity-90 transition-opacity hover:opacity-100"
                  onClick={(data) => onYearClick?.(data.period)}
                />
              </BarChart>
            </ChartContainer>
          )}

          {/* Chart Legend */}
          <div className="mt-4 flex items-center justify-center gap-6">
            {chartType === "trend" && (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[var(--chart-1)]" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Overall Performance
                </span>
              </div>
            )}
            {chartType === "category-comparison" && (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[var(--chart-2)]" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Category A
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[var(--chart-4)]" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Category B
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insight Highlight */}
      {highlightYears.length > 0 && (
        <Card className="border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700">
              <TrendingUp className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                Key insight:
              </span>{" "}
              The largest improvement occurred between Q3–Q4, with a{" "}
              <span className="font-semibold">6.7 percentage point</span> increase.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  sublabel,
}: {
  icon: React.ElementType
  label: string
  value: string
  change?: number
  changeLabel?: string
  sublabel?: string
}) {
  return (
    <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <Icon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  change >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}pp
              </span>
              {changeLabel && (
                <span className="text-xs text-slate-400">{changeLabel}</span>
              )}
            </div>
          )}
          {sublabel && (
            <p className="text-xs text-slate-400">{sublabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
