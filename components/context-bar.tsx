"use client"

import * as React from "react"
import {
  MessageSquare,
  LayoutPanelLeft,
  LineChart,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type ViewMode = "split" | "chat" | "visual"

interface ContextBarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

const viewModes: { value: ViewMode; label: string; icon: React.ElementType }[] = [
  { value: "split", label: "Split", icon: LayoutPanelLeft },
  { value: "chat", label: "Chat", icon: MessageSquare },
  { value: "visual", label: "Visual", icon: LineChart },
]

export function ContextBar({
  viewMode,
  onViewModeChange,
  className,
}: ContextBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="text-xs text-slate-500 dark:text-slate-400">
        View layout
      </div>

      {/* View Mode Toggle */}
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
              <span className="hidden sm:inline">{mode.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
