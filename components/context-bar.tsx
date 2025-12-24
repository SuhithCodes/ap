"use client"

import * as React from "react"
import {
  Filter,
  X,
  ChevronDown,
  Calendar,
  Users,
  BarChart3,
  Layers,
  MessageSquare,
  LayoutPanelLeft,
  LineChart,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type ActiveFilter = {
  metric: string
  timeframe: string
  subgroup?: string
  year?: string
}

export type ViewMode = "split" | "chat" | "visual"

interface ContextBarProps {
  activeFilter: ActiveFilter
  onFilterChange: (filter: Partial<ActiveFilter>) => void
  onClearFilters: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

const metrics = [
  { value: "4-year-graduation", label: "4-Year Graduation Rate" },
  { value: "5-year-graduation", label: "5-Year Graduation Rate" },
  { value: "dropout-rate", label: "Dropout Rate" },
  { value: "attendance", label: "Average Attendance" },
]

const timeframes = [
  { value: "last-5-years", label: "Last 5 Years" },
  { value: "last-3-years", label: "Last 3 Years" },
  { value: "last-year", label: "Last Year" },
  { value: "all-time", label: "All Time" },
]

const subgroups = [
  { value: undefined, label: "All Students" },
  { value: "gender", label: "By Gender" },
  { value: "ethnicity", label: "By Ethnicity" },
  { value: "economically-disadvantaged", label: "Economically Disadvantaged" },
  { value: "special-education", label: "Special Education" },
]

const viewModes: { value: ViewMode; label: string; icon: React.ElementType }[] = [
  { value: "split", label: "Split", icon: LayoutPanelLeft },
  { value: "chat", label: "Chat Only", icon: MessageSquare },
  { value: "visual", label: "Visual Only", icon: LineChart },
]

export function ContextBar({
  activeFilter,
  onFilterChange,
  onClearFilters,
  viewMode,
  onViewModeChange,
  className,
}: ContextBarProps) {
  const hasActiveFilters =
    activeFilter.subgroup || activeFilter.year

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      {/* Left: Active Filters */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Filter className="h-4 w-4" />
          <span className="text-xs font-medium">Filters:</span>
        </div>

        {/* Metric Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 rounded-full border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <BarChart3 className="h-3 w-3" />
              {metrics.find((m) => m.value === activeFilter.metric)?.label ||
                activeFilter.metric}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {metrics.map((metric) => (
              <DropdownMenuItem
                key={metric.value}
                onClick={() => onFilterChange({ metric: metric.value })}
                className={cn(
                  activeFilter.metric === metric.value &&
                    "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                )}
              >
                {metric.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Timeframe Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 rounded-full border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Calendar className="h-3 w-3" />
              {timeframes.find((t) => t.value === activeFilter.timeframe)?.label ||
                activeFilter.timeframe}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {timeframes.map((timeframe) => (
              <DropdownMenuItem
                key={timeframe.value}
                onClick={() => onFilterChange({ timeframe: timeframe.value })}
                className={cn(
                  activeFilter.timeframe === timeframe.value &&
                    "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                )}
              >
                {timeframe.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Subgroup Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1.5 rounded-full border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                activeFilter.subgroup &&
                  "border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-700"
              )}
            >
              <Users className="h-3 w-3" />
              {subgroups.find((s) => s.value === activeFilter.subgroup)?.label ||
                "All Students"}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            {subgroups.map((subgroup) => (
              <DropdownMenuItem
                key={subgroup.value || "all"}
                onClick={() => onFilterChange({ subgroup: subgroup.value })}
                className={cn(
                  activeFilter.subgroup === subgroup.value &&
                    "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                )}
              >
                {subgroup.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Year Badge (if selected) */}
        {activeFilter.year && (
          <Badge
            variant="secondary"
            className="h-7 gap-1.5 rounded-full bg-slate-200 px-3 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
          >
            <Layers className="h-3 w-3" />
            {activeFilter.year}
            <button
              onClick={() => onFilterChange({ year: undefined })}
              className="ml-0.5 rounded-full p-0.5 hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {/* Clear All */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 px-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Right: View Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">View:</span>
        <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
          {viewModes.map((mode) => {
            const Icon = mode.icon
            return (
              <Button
                key={mode.value}
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange(mode.value)}
                className={cn(
                  "h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100",
                  viewMode === mode.value &&
                    "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {mode.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
