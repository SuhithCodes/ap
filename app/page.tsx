"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LineChart, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { FileUpload, type UploadedFile } from "@/components/file-upload"
import { TaskSelection, type TaskType } from "@/components/task-selection"
import {
  AgentModelConfig,
  type AgentConfig,
} from "@/components/agent-model-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { saveAgentConfig, prepareFilesForStorage } from "@/lib/agent-store"
import { Play, FileText, Sparkles, Zap } from "lucide-react"

const DEFAULT_AGENT_CONFIG: AgentConfig = {
  agentType: undefined,
  textModel: undefined,
  reasoningModel: undefined,
  strengths: {
    reasoningDepth: 50,
    speedAccuracy: 50,
    longContext: false,
    multilingual: false,
    toolCalling: false,
  },
}

export default function HomePage() {
  const router = useRouter()
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [selectedTasks, setSelectedTasks] = React.useState<TaskType[]>([])
  const [agentConfig, setAgentConfig] = React.useState<AgentConfig>(DEFAULT_AGENT_CONFIG)
  const [isRunning, setIsRunning] = React.useState(false)

  // Step completion states
  const isStep1Complete = files.length > 0
  const isStep2Complete = selectedTasks.length > 0
  const isReady = isStep1Complete && isStep2Complete

  const handleRun = async () => {
    if (!isReady) return
    setIsRunning(true)

    try {
      const preparedFiles = await prepareFilesForStorage(files)

      saveAgentConfig({
        files: preparedFiles,
        tasks: selectedTasks,
        agentConfig,
        runId: `run-${Date.now()}`,
        startedAt: new Date().toISOString(),
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to prepare agent run:", error)
      setIsRunning(false)
    }
  }

  const totalFileSize = files.reduce((acc, f) => acc + f.size, 0)
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
              <LineChart className="h-4 w-4 text-white dark:text-slate-900" />
            </div>
            <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
              AnalyticsGPT
            </span>
          </a>

          <div className="flex items-center gap-3">
            {/* Progress Steps */}
            <div className="hidden items-center gap-1.5 sm:flex">
              <StepDot isComplete={isStep1Complete} isActive={!isStep1Complete} />
              <div className="h-px w-4 bg-slate-300 dark:bg-slate-700" />
              <StepDot isComplete={isStep2Complete} isActive={isStep1Complete && !isStep2Complete} />
              <div className="h-px w-4 bg-slate-300 dark:bg-slate-700" />
              <StepDot isComplete={false} isActive={isReady} />
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create AI Agent
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Import your data and let AI analyze it for you
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            <FileUpload files={files} onFilesChange={setFiles} />

            <TaskSelection
              files={files}
              selectedTasks={selectedTasks}
              onTasksChange={setSelectedTasks}
              disabled={!isStep1Complete}
            />

            <AgentModelConfig
              config={agentConfig}
              onConfigChange={setAgentConfig}
              disabled={!isStep2Complete}
            />
          </div>

          {/* Right Column - Summary Card */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            <Card className={cn(
              "border-slate-200 dark:border-slate-800",
              isReady && "border-emerald-300 dark:border-emerald-800"
            )}>
              <CardContent className="p-4">
                {/* Status */}
                <div className="mb-4 flex items-center gap-2">
                  {isReady ? (
                    <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Ready
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {!isStep1Complete ? "Upload files" : "Select tasks"}
                    </Badge>
                  )}
                  <Badge variant="outline" className="ml-auto gap-1">
                    <Zap className="h-3 w-3 text-orange-500" />
                    Groq
                  </Badge>
                </div>

                {/* Summary */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className={cn(
                      "h-4 w-4",
                      files.length > 0 ? "text-emerald-500" : "text-slate-400"
                    )} />
                    <span className="text-slate-600 dark:text-slate-400">
                      {files.length > 0
                        ? `${files.length} file${files.length > 1 ? "s" : ""} (${formatSize(totalFileSize)})`
                        : "No files"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className={cn(
                      "h-4 w-4",
                      selectedTasks.length > 0 ? "text-emerald-500" : "text-slate-400"
                    )} />
                    <span className="text-slate-600 dark:text-slate-400">
                      {selectedTasks.length > 0
                        ? `${selectedTasks.length} task${selectedTasks.length > 1 ? "s" : ""} selected`
                        : "No tasks"}
                    </span>
                  </div>
                </div>

                {/* Run Button */}
                <Button
                  onClick={handleRun}
                  disabled={!isReady || isRunning}
                  className="mt-4 w-full"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Agent
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Simple step dot indicator
function StepDot({
  isComplete,
  isActive,
}: {
  isComplete: boolean
  isActive: boolean
}) {
  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full transition-colors",
        isComplete
          ? "bg-emerald-500"
          : isActive
            ? "bg-slate-900 dark:bg-slate-100"
            : "bg-slate-300 dark:bg-slate-700"
      )}
    />
  )
}
