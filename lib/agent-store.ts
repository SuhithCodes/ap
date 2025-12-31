"use client"

import type { UploadedFile } from "@/components/file-upload"
import type { TaskType } from "@/components/task-selection"
import type { AgentConfig } from "@/components/agent-model-config"

// Agent run configuration
export type AgentRunConfig = {
  files: {
    id: string
    name: string
    type: string
    size: number
    content?: string
  }[]
  tasks: TaskType[]
  agentConfig: AgentConfig
  runId: string
  startedAt: string
}

// Store agent configuration in sessionStorage
export function saveAgentConfig(config: AgentRunConfig): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("agent-run-config", JSON.stringify(config))
  }
}

// Retrieve agent configuration from sessionStorage
export function getAgentConfig(): AgentRunConfig | null {
  if (typeof window === "undefined") return null
  const stored = sessionStorage.getItem("agent-run-config")
  if (!stored) return null
  try {
    return JSON.parse(stored) as AgentRunConfig
  } catch {
    return null
  }
}

// Clear agent configuration
export function clearAgentConfig(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("agent-run-config")
  }
}

// Read file content as text
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    
    if (file.type === "application/pdf") {
      // For PDFs, we'll just get basic info (full PDF parsing would need a library)
      resolve(`[PDF Document: ${file.name}, ${(file.size / 1024).toFixed(1)} KB]`)
    } else {
      reader.readAsText(file)
    }
  })
}

// Convert UploadedFile array to storable format with content
export async function prepareFilesForStorage(
  files: UploadedFile[]
): Promise<AgentRunConfig["files"]> {
  const prepared = await Promise.all(
    files.map(async (f) => {
      let content: string | undefined
      try {
        content = await readFileAsText(f.file)
        // Limit content size for storage
        if (content.length > 50000) {
          content = content.slice(0, 50000) + "\n...[truncated]"
        }
      } catch {
        content = undefined
      }
      return {
        id: f.id,
        name: f.name,
        type: f.type,
        size: f.size,
        content,
      }
    })
  )
  return prepared
}

