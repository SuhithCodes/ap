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
  GraduationCap,
  Calendar,
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

// Demo data for graduation rates
const graduationTrendData = [
  { year: "2019", rate: 78.2, male: 75.8, female: 80.6 },
  { year: "2020", rate: 79.5, male: 76.9, female: 82.1 },
  { year: "2021", rate: 80.1, male: 76.2, female: 84.0 },
  { year: "2022", rate: 83.8, male: 79.5, female: 88.1 },
  { year: "2023", rate: 84.2, male: 80.1, female: 88.3 },
]

const genderComparisonData = [
  { year: "2019", male: 75.8, female: 80.6 },
  { year: "2020", male: 76.9, female: 82.1 },
  { year: "2021", male: 76.2, female: 84.0 },
  { year: "2022", male: 79.5, female: 88.1 },
  { year: "2023", male: 80.1, female: 88.3 },
]

export type ChartType = "trend" | "gender-comparison" | "year-focus"
export type ActiveFilter = {
  metric: string
  timeframe: string
  subgroup?: string
  year?: string
}

interface VizCanvasProps {
  chartType: ChartType
  activeFilter: ActiveFilter
  highlightYears?: string[]
  onYearClick?: (year: string) => void
  className?: string
}

const trendChartConfig = {
  rate: {
    label: "Graduation Rate",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const genderChartConfig = {
  male: {
    label: "Male",
    color: "var(--chart-2)",
  },
  female: {
    label: "Female",
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
  const latestRate = graduationTrendData[graduationTrendData.length - 1].rate
  const previousRate = graduationTrendData[graduationTrendData.length - 2].rate
  const change = latestRate - previousRate
  const totalChange =
    graduationTrendData[graduationTrendData.length - 1].rate -
    graduationTrendData[0].rate

  return (
    <div className={cn("flex h-full flex-col gap-4 p-4", className)}>
      {/* Stats Cards Row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={GraduationCap}
          label="Current Rate"
          value={`${latestRate}%`}
          change={change}
          changeLabel="vs last year"
        />
        <StatCard
          icon={TrendingUp}
          label="5-Year Growth"
          value={`+${totalChange.toFixed(1)}pp`}
          sublabel="Since 2019"
        />
        <StatCard
          icon={Users}
          label="Gender Gap"
          value={`${(genderComparisonData[genderComparisonData.length - 1].female - genderComparisonData[genderComparisonData.length - 1].male).toFixed(1)}pp`}
          sublabel="Female leads"
        />
      </div>

      {/* Main Chart */}
      <Card className="flex-1 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {chartType === "trend" && "4-Year Graduation Rate Trend"}
              {chartType === "gender-comparison" && "Graduation Rate by Gender"}
              {chartType === "year-focus" && `${activeFilter.year} Detailed View`}
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
                data={graduationTrendData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-slate-500"
                />
                <YAxis
                  domain={[70, 90]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}%`}
                  className="text-slate-500"
                />
                {highlightYears.includes("2021-2022") && (
                  <ReferenceLine
                    x="2022"
                    stroke="var(--chart-4)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                )}
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[160px]"
                      labelFormatter={(value) => `Year ${value}`}
                      formatter={(value) => [`${value}%`, "Graduation Rate"]}
                    />
                  }
                />
                <Line
                  dataKey="rate"
                  type="monotone"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={(props) => {
                    const { cx, cy, payload, index } = props
                    const isHighlighted = highlightYears.includes(payload.year)
                    return (
                      <circle
                        key={`dot-${index}-${payload.year}`}
                        cx={cx}
                        cy={cy}
                        r={isHighlighted ? 8 : 5}
                        fill="white"
                        stroke={isHighlighted ? "var(--chart-4)" : "var(--chart-1)"}
                        strokeWidth={isHighlighted ? 3 : 2}
                        className="cursor-pointer transition-all hover:r-8"
                        onClick={() => onYearClick?.(payload.year)}
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

          {chartType === "gender-comparison" && (
            <ChartContainer config={genderChartConfig} className="h-[280px] w-full">
              <BarChart
                accessibilityLayer
                data={genderComparisonData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-slate-500"
                />
                <YAxis
                  domain={[70, 95]}
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
                      labelFormatter={(value) => `Year ${value}`}
                    />
                  }
                />
                <Bar
                  dataKey="male"
                  fill="var(--color-male)"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer opacity-90 transition-opacity hover:opacity-100"
                  onClick={(data) => onYearClick?.(data.year)}
                />
                <Bar
                  dataKey="female"
                  fill="var(--color-female)"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer opacity-90 transition-opacity hover:opacity-100"
                  onClick={(data) => onYearClick?.(data.year)}
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
                  Overall Rate
                </span>
              </div>
            )}
            {chartType === "gender-comparison" && (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[var(--chart-2)]" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Male
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[var(--chart-4)]" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Female
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
              The largest jump occurred between 2021–2022, with a{" "}
              <span className="font-semibold">3.7 percentage point</span> increase.
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

