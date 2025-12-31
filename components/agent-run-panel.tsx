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
  RefreshCw,
  Download,
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
import type { AgentRunConfig } from "@/lib/agent-store"

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

interface AgentRunPanelProps {
  config: AgentRunConfig
  onNewRun: () => void
  className?: string
}

export function AgentRunPanel({ config, onNewRun, className }: AgentRunPanelProps) {
  const totalFileSize = config.files.reduce((acc, f) => acc + f.size, 0)
  const modelId = config.agentConfig.textModel || "llama-3.3-70b-versatile"
  const modelInfo = MODEL_INFO[modelId] || { name: modelId, speed: "Fast" }

  return (
    <div className={cn("flex h-full flex-col gap-4 p-4", className)}>
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Agent Run
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Started {formatTimestamp(config.startedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onNewRun}>
            <Plus className="mr-1 h-4 w-4" />
            New Run
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-emerald-900 dark:text-emerald-100">
              Agent Active
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Ready to answer questions about your data
            </p>
          </div>
          <Badge className="ml-auto bg-emerald-500 text-white">
            <Zap className="mr-1 h-3 w-3" />
            Powered by Groq
          </Badge>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Files Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              <CardTitle className="text-base">Uploaded Files</CardTitle>
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

        {/* Tasks Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-slate-500" />
              <CardTitle className="text-base">Active Tasks</CardTitle>
            </div>
            <CardDescription>
              {config.tasks.length} task{config.tasks.length > 1 ? "s" : ""} configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {config.tasks.map((taskId) => {
              const info = TASK_INFO[taskId] || { name: taskId, icon: Sparkles, color: "bg-slate-500" }
              const Icon = info.icon
              return (
                <div
                  key={taskId}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800"
                >
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", info.color)}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {info.name}
                  </span>
                  <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Model Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-slate-500" />
              <CardTitle className="text-base">AI Model</CardTitle>
            </div>
            <CardDescription>Groq inference engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
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
              <p className="mt-1 text-xs text-slate-500">Primary model</p>
            </div>

            {config.agentConfig.reasoningModel && config.agentConfig.reasoningModel !== modelId && (
              <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {MODEL_INFO[config.agentConfig.reasoningModel]?.name || config.agentConfig.reasoningModel}
                  </span>
                  <Badge variant="secondary">
                    {MODEL_INFO[config.agentConfig.reasoningModel]?.speed || "Fast"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">Reasoning model</p>
              </div>
            )}

            {config.agentConfig.agentType && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Brain className="h-4 w-4" />
                <span>
                  {config.agentConfig.agentType.charAt(0).toUpperCase() + config.agentConfig.agentType.slice(1)} Agent
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <CardDescription>
            Use the chat panel on the left to interact with your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <QuickAction
              icon={FileText}
              label="Summarize"
              description="Get a summary of all files"
            />
            <QuickAction
              icon={Sparkles}
              label="Key Insights"
              description="Extract main takeaways"
            />
            <QuickAction
              icon={Tags}
              label="Extract Data"
              description="Find entities & facts"
            />
            <QuickAction
              icon={Brain}
              label="Analyze"
              description="Deep analysis of content"
            />
          </div>
        </CardContent>
      </Card>

      {/* Capabilities */}
      {(config.agentConfig.strengths.longContext ||
        config.agentConfig.strengths.multilingual ||
        config.agentConfig.strengths.toolCalling) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Enabled Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.agentConfig.strengths.longContext && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Long Context
                </Badge>
              )}
              {config.agentConfig.strengths.multilingual && (
                <Badge variant="outline" className="gap-1">
                  🌐 Multilingual
                </Badge>
              )}
              {config.agentConfig.strengths.toolCalling && (
                <Badge variant="outline" className="gap-1">
                  🔧 Tool Calling
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Run ID */}
      <div className="mt-auto text-center text-xs text-slate-400">
        Run ID: {config.runId}
      </div>
    </div>
  )
}

// Quick Action Button
function QuickAction({
  icon: Icon,
  label,
  description,
}: {
  icon: React.ElementType
  label: string
  description: string
}) {
  return (
    <button className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-center transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </button>
  )
}

