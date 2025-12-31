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
import { ConfigSummary } from "@/components/config-summary"
import { saveAgentConfig, prepareFilesForStorage } from "@/lib/agent-store"

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
      // Prepare files with content
      const preparedFiles = await prepareFilesForStorage(files)

      // Save configuration to session storage
      saveAgentConfig({
        files: preparedFiles,
        tasks: selectedTasks,
        agentConfig,
        runId: `run-${Date.now()}`,
        startedAt: new Date().toISOString(),
      })

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to prepare agent run:", error)
      setIsRunning(false)
    }
  }

  const handleSave = () => {
    // Save to localStorage for persistence
    const config = {
      files: files.map((f) => ({ id: f.id, name: f.name, type: f.type, size: f.size })),
      tasks: selectedTasks,
      agentConfig,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem("saved-agent-config", JSON.stringify(config))
    alert("Configuration saved!")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
              <LineChart className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                AnalyticsGPT
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI Agent Platform
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="hidden items-center gap-2 sm:flex">
            <StepIndicator
              step={1}
              label="Upload"
              isComplete={isStep1Complete}
              isActive={!isStep1Complete}
            />
            <div className="h-px w-8 bg-slate-300 dark:bg-slate-700" />
            <StepIndicator
              step={2}
              label="Tasks"
              isComplete={isStep2Complete}
              isActive={isStep1Complete && !isStep2Complete}
            />
            <div className="h-px w-8 bg-slate-300 dark:bg-slate-700" />
            <StepIndicator
              step={3}
              label="Config"
              isComplete={false}
              isActive={isStep2Complete}
              isOptional
            />
            <div className="h-px w-8 bg-slate-300 dark:bg-slate-700" />
            <StepIndicator
              step={4}
              label="Run"
              isComplete={false}
              isActive={isReady}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Create Your AI Agent
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Import data, select tasks, and let AI do the heavy lifting
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left Column - Main Steps */}
          <div className="space-y-6">
            {/* Step 1: File Upload */}
            <FileUpload files={files} onFilesChange={setFiles} />

            {/* Step 2: Task Selection */}
            <TaskSelection
              files={files}
              selectedTasks={selectedTasks}
              onTasksChange={setSelectedTasks}
              disabled={!isStep1Complete}
            />

            {/* Step 3: Agent & Model Config (Optional) */}
            <AgentModelConfig
              config={agentConfig}
              onConfigChange={setAgentConfig}
              disabled={!isStep2Complete}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ConfigSummary
              files={files}
              selectedTasks={selectedTasks}
              agentConfig={agentConfig}
              onRun={handleRun}
              onSave={handleSave}
              isRunning={isRunning}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>AnalyticsGPT • AI-Powered Data Analysis Platform</p>
        </div>
      </footer>
    </div>
  )
}

// Step Indicator Component
function StepIndicator({
  step,
  label,
  isComplete,
  isActive,
  isOptional,
}: {
  step: number
  label: string
  isComplete: boolean
  isActive: boolean
  isOptional?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
          isComplete
            ? "bg-emerald-500 text-white"
            : isActive
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
        )}
      >
        {isComplete ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          step
        )}
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-xs font-medium",
            isActive || isComplete
              ? "text-slate-900 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          {label}
        </span>
        {isOptional && (
          <span className="text-[10px] text-slate-400">Optional</span>
        )}
      </div>
    </div>
  )
}
