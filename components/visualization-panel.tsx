"use client"

import * as React from "react"
import {
  FileText,
  FileSpreadsheet,
  File,
  Sparkles,
  CheckCircle2,
  Clock,
  Cpu,
  Brain,
  Tags,
  Zap,
  Plus,
  BarChart3,
  LineChart,
  PieChart,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DynamicChart } from "@/components/dynamic-chart"
import type { AgentRunConfig } from "@/lib/agent-store"
import type { ChartData } from "@/lib/chart-types"

// Task display info
const TASK_INFO: Record<string, { name: string; icon: React.ElementType; color: string }> = {
  summarization: { name: "Summarization", icon: FileText, color: "bg-blue-500" },
  "question-answering": { name: "Q&A", icon: Sparkles, color: "bg-purple-500" },
  "data-extraction": { name: "Data Extraction", icon: FileSpreadsheet, color: "bg-green-500" },
  classification: { name: "Classification", icon: Tags, color: "bg-orange-500" },
  reasoning: { name: "Reasoning", icon: Brain, color: "bg-rose-500" },
  translation: { name: "Translation", icon: File, color: "bg-cyan-500" },
  "content-generation": { name: "Content Gen", icon: Sparkles, color: "bg-violet-500" },
}

// Model display info
const MODEL_INFO: Record<string, { name: string; speed: string }> = {
  "llama-3.3-70b-versatile": { name: "Llama 3.3 70B", speed: "Fast" },
  "llama-3.1-8b-instant": { name: "Llama 3.1 8B", speed: "Instant" },
  "mixtral-8x7b-32768": { name: "Mixtral 8x7B", speed: "Fast" },
  "gemma2-9b-it": { name: "Gemma 2 9B", speed: "Instant" },
  "llama-guard-3-8b": { name: "Llama Guard 3", speed: "Instant" },
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getFileIcon(type: string, name: string) {
  if (name.endsWith(".csv") || type.includes("csv")) return FileSpreadsheet
  if (name.endsWith(".pdf") || type.includes("pdf")) return FileText
  return File
}

interface VisualizationPanelProps {
  config: AgentRunConfig
  charts: ChartData[]
  onNewRun: () => void
  className?: string
}

export function VisualizationPanel({ 
  config, 
  charts = [],
  onNewRun, 
  className 
}: VisualizationPanelProps) {
  const totalFileSize = config.files.reduce((acc, f) => acc + f.size, 0)
  const modelId = config.agentConfig.textModel || "llama-3.3-70b-versatile"
  const modelInfo = MODEL_INFO[modelId] || { name: modelId, speed: "Fast" }
  const latestChart = charts.length > 0 ? charts[charts.length - 1] : null

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Sticky Header & Chart Section */}
      <div className="sticky top-0 z-10 flex flex-col gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Visualizations
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {charts.length > 0 
                ? `${charts.length} chart${charts.length > 1 ? "s" : ""} generated`
                : "Ask questions to generate charts"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onNewRun}>
            <Plus className="mr-1 h-4 w-4" />
            New Run
          </Button>
        </div>

        {/* Latest Chart - Sticky */}
        {latestChart && (
          <DynamicChart data={latestChart} />
        )}
      </div>

      {/* Scrollable Content Below */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4 pt-0">
          {/* Previous Charts (if any) */}
          {charts.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Previous Charts
              </h3>
              {charts.slice(0, -1).reverse().map((chart, index) => (
                <DynamicChart key={`chart-prev-${index}`} data={chart} />
              ))}
            </div>
          )}

          {/* Info Cards (shown when no charts or below previous charts) */}
          <div className="space-y-4">
            {/* Status Card */}
            <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-emerald-900 dark:text-emerald-100">
                    Agent Ready
                  </p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Ask for data breakdowns to generate charts
                  </p>
                </div>
                <Badge className="ml-auto bg-emerald-500 text-white">
                  <Zap className="mr-1 h-3 w-3" />
                  Groq
                </Badge>
              </CardContent>
            </Card>

            {/* Example Prompts */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-base">Try These Prompts</CardTitle>
                </div>
                <CardDescription>
                  Ask questions that request data visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: BarChart3, text: "Show me a breakdown by year" },
                  { icon: LineChart, text: "What's the trend over time?" },
                  { icon: PieChart, text: "Show the distribution of categories" },
                ].map((prompt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <prompt.icon className="h-4 w-4 shrink-0 text-slate-500" />
                    <span>{prompt.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Files Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-base">Loaded Data</CardTitle>
                </div>
                <CardDescription>
                  {config.files.length} file{config.files.length > 1 ? "s" : ""} • {formatFileSize(totalFileSize)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {config.files.map((file) => {
                  const Icon = getFileIcon(file.type, file.name)
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Tasks & Model Card */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-slate-500" />
                    <CardTitle className="text-base">Tasks</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  {config.tasks.map((taskId) => {
                    const info = TASK_INFO[taskId] || { name: taskId, icon: Sparkles, color: "bg-slate-500" }
                    const Icon = info.icon
                    return (
                      <div
                        key={taskId}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <div className={cn("flex h-5 w-5 items-center justify-center rounded", info.color)}>
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <span>{info.name}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-slate-500" />
                    <CardTitle className="text-base">Model</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {modelInfo.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        modelInfo.speed === "Instant"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      )}
                    >
                      {modelInfo.speed}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Run Info */}
          <div className="text-center text-xs text-slate-400">
            Started {formatTimestamp(config.startedAt)} • {config.runId}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

