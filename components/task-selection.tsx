"use client"

import * as React from "react"
import {
  FileText,
  MessageSquare,
  Database,
  Tags,
  Brain,
  Languages,
  Sparkles,
  Check,
  Lock,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { UploadedFile } from "./file-upload"

export type TaskType =
  | "summarization"
  | "question-answering"
  | "data-extraction"
  | "classification"
  | "reasoning"
  | "translation"
  | "content-generation"

export type Task = {
  id: TaskType
  name: string
  description: string
  icon: React.ElementType
  suggestedFor: string[]
}

const TASKS: Task[] = [
  {
    id: "summarization",
    name: "Summarization",
    description: "Generate concise summaries of documents and text",
    icon: FileText,
    suggestedFor: ["pdf", "md", "text"],
  },
  {
    id: "question-answering",
    name: "Question Answering",
    description: "Answer questions based on your uploaded data",
    icon: MessageSquare,
    suggestedFor: ["pdf", "md", "csv", "text"],
  },
  {
    id: "data-extraction",
    name: "Data Extraction",
    description: "Extract structured data, entities, and key information",
    icon: Database,
    suggestedFor: ["csv", "pdf"],
  },
  {
    id: "classification",
    name: "Classification",
    description: "Categorize and label content automatically",
    icon: Tags,
    suggestedFor: ["csv", "text", "md"],
  },
  {
    id: "reasoning",
    name: "Reasoning & Analysis",
    description: "Perform complex analysis and logical reasoning",
    icon: Brain,
    suggestedFor: ["pdf", "csv", "md"],
  },
  {
    id: "translation",
    name: "Translation",
    description: "Translate content between languages",
    icon: Languages,
    suggestedFor: ["pdf", "md", "text"],
  },
  {
    id: "content-generation",
    name: "Content Generation",
    description: "Generate new content based on your data",
    icon: Sparkles,
    suggestedFor: ["pdf", "md", "csv"],
  },
]

function getFileExtension(file: UploadedFile): string {
  const name = file.name.toLowerCase()
  if (name.endsWith(".csv")) return "csv"
  if (name.endsWith(".pdf")) return "pdf"
  if (name.endsWith(".md")) return "md"
  return "text"
}

interface TaskSelectionProps {
  files: UploadedFile[]
  selectedTasks: TaskType[]
  onTasksChange: (tasks: TaskType[]) => void
  disabled?: boolean
  className?: string
}

export function TaskSelection({
  files,
  selectedTasks,
  onTasksChange,
  disabled = false,
  className,
}: TaskSelectionProps) {
  const fileExtensions = files.map(getFileExtension)

  const getSuggestedTasks = (): TaskType[] => {
    if (files.length === 0) return []
    const suggested = TASKS.filter((task) =>
      task.suggestedFor.some((ext) => fileExtensions.includes(ext))
    ).map((t) => t.id)
    return suggested
  }

  const suggestedTasks = getSuggestedTasks()

  const toggleTask = (taskId: TaskType) => {
    if (disabled) return
    if (selectedTasks.includes(taskId)) {
      onTasksChange(selectedTasks.filter((t) => t !== taskId))
    } else {
      onTasksChange([...selectedTasks, taskId])
    }
  }

  return (
    <Card
      className={cn(
        "border-slate-200 transition-opacity dark:border-slate-800",
        disabled && "opacity-50",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              disabled
                ? "bg-slate-300 dark:bg-slate-700"
                : "bg-slate-900 dark:bg-slate-100"
            )}
          >
            {disabled ? (
              <Lock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            ) : (
              <span className="text-lg font-bold text-white dark:text-slate-900">2</span>
            )}
          </div>
          <div>
            <CardTitle className="text-lg">Select Tasks</CardTitle>
            <CardDescription>
              {disabled
                ? "Upload files to unlock task selection"
                : "Choose what you want the AI to do with your data"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {TASKS.map((task) => {
            const Icon = task.icon
            const isSelected = selectedTasks.includes(task.id)
            const isSuggested = suggestedTasks.includes(task.id)

            return (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                disabled={disabled}
                className={cn(
                  "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                  disabled
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                    : isSelected
                      ? "border-slate-900 bg-slate-900 dark:border-slate-100 dark:bg-slate-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                )}
              >
                {/* Selection indicator */}
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-white bg-white dark:border-slate-900 dark:bg-slate-900"
                      : "border-slate-300 dark:border-slate-600"
                  )}
                >
                  {isSelected && (
                    <Check className="h-3 w-3 text-slate-900 dark:text-slate-100" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isSelected
                      ? "bg-white/20 dark:bg-slate-900/20"
                      : "bg-slate-100 dark:bg-slate-700"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isSelected
                        ? "text-white dark:text-slate-900"
                        : "text-slate-600 dark:text-slate-400"
                    )}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isSelected
                          ? "text-white dark:text-slate-900"
                          : "text-slate-900 dark:text-slate-100"
                      )}
                    >
                      {task.name}
                    </p>
                    {isSuggested && !isSelected && !disabled && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Suggested
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-0.5 text-xs transition-colors",
                      isSelected
                        ? "text-white/70 dark:text-slate-900/70"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {task.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {selectedTasks.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Check className="h-4 w-4 text-emerald-500" />
            <span>
              {selectedTasks.length} task{selectedTasks.length > 1 ? "s" : ""} selected
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

