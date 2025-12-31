"use client"

import * as React from "react"
import {
  Play,
  Save,
  FileText,
  CheckCircle2,
  Brain,
  Cpu,
  Sparkles,
  ArrowRight,
  Zap,
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
import type { UploadedFile } from "./file-upload"
import type { TaskType } from "./task-selection"
import type { AgentConfig, AgentType, ModelType } from "./agent-model-config"

const TASK_NAMES: Record<TaskType, string> = {
  summarization: "Summarization",
  "question-answering": "Question Answering",
  "data-extraction": "Data Extraction",
  classification: "Classification",
  reasoning: "Reasoning & Analysis",
  translation: "Translation",
  "content-generation": "Content Generation",
}

const AGENT_NAMES: Record<AgentType, string> = {
  reasoning: "Reasoning Agent",
  document: "Document Agent",
  multimodal: "Multimodal Agent",
  multilingual: "Multilingual Agent",
}

// Updated to use Groq models
const MODEL_NAMES: Record<ModelType, string> = {
  "llama-3.3-70b-versatile": "Llama 3.3 70B",
  "llama-3.1-8b-instant": "Llama 3.1 8B",
  "mixtral-8x7b-32768": "Mixtral 8x7B",
  "gemma2-9b-it": "Gemma 2 9B",
  "llama-guard-3-8b": "Llama Guard 3",
}

interface ConfigSummaryProps {
  files: UploadedFile[]
  selectedTasks: TaskType[]
  agentConfig: AgentConfig
  onRun: () => void
  onSave: () => void
  isRunning?: boolean
  className?: string
}

export function ConfigSummary({
  files,
  selectedTasks,
  agentConfig,
  onRun,
  onSave,
  isRunning = false,
  className,
}: ConfigSummaryProps) {
  const isReady = files.length > 0 && selectedTasks.length > 0
  const totalFileSize = files.reduce((acc, f) => acc + f.size, 0)

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card
      className={cn(
        "border-slate-200 dark:border-slate-800",
        isReady && "border-emerald-200 dark:border-emerald-800",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              isReady
                ? "bg-emerald-500"
                : "bg-slate-300 dark:bg-slate-700"
            )}
          >
            {isReady ? (
              <CheckCircle2 className="h-5 w-5 text-white" />
            ) : (
              <span className="text-lg font-bold text-slate-500 dark:text-slate-400">4</span>
            )}
          </div>
          <div>
            <CardTitle className="text-lg">Configuration Summary</CardTitle>
            <CardDescription>
              {isReady
                ? "Ready to run your agent"
                : "Complete the steps above to continue"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Groq Badge */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-950/30">
          <Zap className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
            Powered by Groq
          </span>
        </div>

        {/* Summary Items */}
        <div className="space-y-3">
          {/* Files */}
          <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <FileText
              className={cn(
                "h-5 w-5 shrink-0",
                files.length > 0
                  ? "text-emerald-500"
                  : "text-slate-400"
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Data Files
              </p>
              {files.length > 0 ? (
                <div className="mt-1">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {files.length} file{files.length > 1 ? "s" : ""} • {formatSize(totalFileSize)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {files.slice(0, 3).map((file) => (
                      <span
                        key={file.id}
                        className="truncate rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                      >
                        {file.name}
                      </span>
                    ))}
                    {files.length > 3 && (
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                        +{files.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No files uploaded</p>
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <Sparkles
              className={cn(
                "h-5 w-5 shrink-0",
                selectedTasks.length > 0
                  ? "text-emerald-500"
                  : "text-slate-400"
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Selected Tasks
              </p>
              {selectedTasks.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedTasks.map((taskId) => (
                    <span
                      key={taskId}
                      className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    >
                      {TASK_NAMES[taskId]}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No tasks selected</p>
              )}
            </div>
          </div>

          {/* Agent */}
          <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <Brain className="h-5 w-5 shrink-0 text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Agent Type
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {agentConfig.agentType
                  ? AGENT_NAMES[agentConfig.agentType]
                  : "Auto-select (recommended)"}
              </p>
            </div>
          </div>

          {/* Models */}
          <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <Cpu className="h-5 w-5 shrink-0 text-slate-500" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Groq Models
              </p>
              <div className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-400">
                <p>
                  Text:{" "}
                  {agentConfig.textModel
                    ? MODEL_NAMES[agentConfig.textModel]
                    : "Llama 3.3 70B (default)"}
                </p>
                <p>
                  Reasoning:{" "}
                  {agentConfig.reasoningModel
                    ? MODEL_NAMES[agentConfig.reasoningModel]
                    : "Llama 3.3 70B (default)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onRun}
            disabled={!isReady || isRunning}
            className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200"
          >
            {isRunning ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Agent
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onSave}
            disabled={!isReady}
            className="shrink-0"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>

        {!isReady && (
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {files.length === 0
              ? "Upload at least one file to continue"
              : "Select at least one task to continue"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
