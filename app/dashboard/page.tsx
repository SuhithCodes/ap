"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChatPanel, type Message } from "@/components/chat-panel"
import { ContextBar, type ViewMode } from "@/components/context-bar"
import { VisualizationPanel } from "@/components/visualization-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { getAgentConfig, type AgentRunConfig } from "@/lib/agent-store"
import type { ChartData } from "@/lib/chart-types"

// Task descriptions for context
const TASK_DESCRIPTIONS: Record<string, string> = {
  summarization: "summarize the content",
  "question-answering": "answer questions about the data",
  "data-extraction": "extract key information and entities",
  classification: "classify and categorize the content",
  reasoning: "analyze and provide insights",
  translation: "translate the content",
  "content-generation": "generate new content based on the data",
}

export default function DashboardPage() {
  const router = useRouter()
  const [agentConfig, setAgentConfig] = React.useState<AgentRunConfig | null>(null)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [charts, setCharts] = React.useState<ChartData[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isInitializing, setIsInitializing] = React.useState(true)
  const [viewMode, setViewMode] = React.useState<ViewMode>("split")

  // Load agent configuration on mount
  React.useEffect(() => {
    const config = getAgentConfig()
    if (!config) {
      router.push("/")
      return
    }
    setAgentConfig(config)
    setIsInitializing(false)
    startInitialAnalysis(config)
  }, [router])

  const startInitialAnalysis = async (config: AgentRunConfig) => {
    setIsLoading(true)

    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: "assistant",
      content: `I've received ${config.files.length} file${config.files.length > 1 ? "s" : ""} and I'm ready to help you ${config.tasks.map((t) => TASK_DESCRIPTIONS[t]).join(", ")}. Let me analyze your data...`,
      timestamp: new Date(),
    }
    setMessages([systemMessage])

    try {
      const fileContext = config.files
        .map((f) => `--- ${f.name} ---\n${f.content || "[No content available]"}`)
        .join("\n\n")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `I've uploaded ${config.files.length} file(s): ${config.files.map((f) => f.name).join(", ")}. 
              
My selected tasks are: ${config.tasks.join(", ")}.

Please provide an initial analysis of the data. Focus on:
1. A brief summary of what the data contains
2. Key insights or patterns you can identify
3. Suggestions for what I should explore next

Be concise but informative.`,
            },
          ],
          task: config.tasks[0] || "reasoning",
          model: config.agentConfig.textModel || "llama-3.3-70b-versatile",
          fileContext,
          generateVisualization: true,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const analysisMessage: Message = {
          id: `analysis-${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
          suggestions: generateSuggestions(config.tasks, config.files),
        }
        setMessages((prev) => [...prev, analysisMessage])

        if (data.chart) {
          setCharts((prev) => [...prev, data.chart])
        }
      } else {
        const fallbackMessage: Message = {
          id: `fallback-${Date.now()}`,
          role: "assistant",
          content: `I've loaded your ${config.files.length} file(s). You can ask me questions about the data, request summaries, or explore specific aspects. What would you like to know?`,
          timestamp: new Date(),
          suggestions: generateSuggestions(config.tasks, config.files),
        }
        setMessages((prev) => [...prev, fallbackMessage])
      }
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `I've loaded your files but encountered an issue connecting to the AI service. You can still ask me questions - I'll try again with each message. Make sure your GROQ_API_KEY is configured.`,
        timestamp: new Date(),
        suggestions: ["Summarize the data", "What are the key points?", "Extract important information"],
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateSuggestions = (tasks: string[], files: AgentRunConfig["files"]): string[] => {
    const suggestions: string[] = []
    const hasCSV = files.some(f => f.name.endsWith(".csv"))
    
    if (hasCSV) {
      suggestions.push("Show me a breakdown by year")
      suggestions.push("What are the trends in the data?")
    }
    
    if (tasks.includes("summarization")) {
      suggestions.push("Summarize the key points")
    }
    if (tasks.includes("data-extraction")) {
      suggestions.push("Extract key entities")
    }
    if (tasks.includes("reasoning")) {
      suggestions.push("What patterns do you see?")
    }
    
    if (suggestions.length < 3) {
      suggestions.push("Tell me more about this data")
    }
    
    return suggestions.slice(0, 3)
  }

  const handleSendMessage = async (content: string) => {
    if (!agentConfig) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const fileContext = agentConfig.files
        .map((f) => `--- ${f.name} ---\n${f.content || "[No content available]"}`)
        .join("\n\n")

      const conversationHistory = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...conversationHistory,
            { role: "user", content },
          ],
          task: agentConfig.tasks[0] || "question-answering",
          model: agentConfig.agentConfig.textModel || "llama-3.3-70b-versatile",
          fileContext,
          generateVisualization: true,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
          suggestions: generateContextualSuggestions(content),
        }
        setMessages((prev) => [...prev, aiMessage])

        if (data.chart) {
          setCharts((prev) => [...prev, data.chart])
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `I encountered an error processing your request. ${error instanceof Error ? error.message : "Please try again."}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateContextualSuggestions = (lastMessage: string): string[] => {
    const lower = lastMessage.toLowerCase()
    const suggestions: string[] = []

    if (lower.includes("summary") || lower.includes("summarize")) {
      suggestions.push("Show me a chart", "Go deeper")
    } else if (lower.includes("breakdown") || lower.includes("by year")) {
      suggestions.push("Show as line chart", "Compare periods")
    } else if (lower.includes("trend")) {
      suggestions.push("What's causing this?", "Forecast values")
    } else {
      suggestions.push("Show visualization", "Break down by category")
    }

    return suggestions.slice(0, 2)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleNewRun = () => {
    router.push("/")
  }

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading agent...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        {/* Context Bar */}
        <ContextBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Main Content */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* Chat Panel */}
          {viewMode !== "visual" && (
            <div
              className={cn(
                "shrink-0 border-r border-slate-200 dark:border-slate-800",
                viewMode === "split" && "w-[40%] min-w-[320px] max-w-[480px]",
                viewMode === "chat" && "w-full border-r-0"
              )}
            >
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                onSuggestionClick={handleSuggestionClick}
                isLoading={isLoading}
                className="h-full"
              />
            </div>
          )}

          {/* Visualization Panel */}
          {viewMode !== "chat" && agentConfig && (
            <div
              className={cn(
                "flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950",
                viewMode === "visual" && "w-full"
              )}
            >
              <VisualizationPanel
                config={agentConfig}
                charts={charts}
                onNewRun={handleNewRun}
                className="h-full"
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
