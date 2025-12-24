"use client"

import * as React from "react"
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
import { VizCanvas, type ChartType, type ActiveFilter } from "@/components/viz-canvas"
import { ContextBar, type ViewMode } from "@/components/context-bar"
import { cn } from "@/lib/utils"

// Simulated AI responses for demo
const generateAIResponse = (
  userMessage: string,
  currentFilter: ActiveFilter
): { content: string; suggestions?: string[]; highlightYears?: string[]; newChartType?: ChartType; filterUpdate?: Partial<ActiveFilter> } => {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes("trend") || lowerMessage.includes("graduation rate")) {
    return {
      content:
        "I've loaded the 4-year graduation rate trend for the last 5 years. The data shows a consistent upward trajectory, with graduation rates increasing from 78.2% in 2019 to 84.2% in 2023—a total improvement of 6 percentage points.",
      suggestions: ["Break down by gender", "What caused the 2022 jump?", "Compare with state average"],
      highlightYears: ["2021-2022"],
      newChartType: "trend",
    }
  }

  if (lowerMessage.includes("gender") || lowerMessage.includes("male") || lowerMessage.includes("female")) {
    return {
      content:
        "I've switched to a gender breakdown view. Female students consistently outperform male students, with an 8.2 percentage point gap in 2023. The gap has widened slightly since 2019 when it was 4.8 points. This grouped bar chart makes the comparison easier to see.",
      suggestions: ["Focus on male rates", "Why is there a gap?", "Show trend view"],
      newChartType: "gender-comparison",
      filterUpdate: { subgroup: "gender" },
    }
  }

  if (lowerMessage.includes("2022") || lowerMessage.includes("jump") || lowerMessage.includes("increase")) {
    return {
      content:
        "The largest improvement occurred between 2021 and 2022, with a 3.7 percentage point increase. This coincides with the district's implementation of the Early Warning System and expanded tutoring programs. I've highlighted this period on the chart.",
      suggestions: ["Show 2022 details", "Compare schools", "Download this data"],
      highlightYears: ["2022"],
    }
  }

  if (lowerMessage.includes("compare") || lowerMessage.includes("vs") || lowerMessage.includes("state")) {
    return {
      content:
        "Compared to the state average of 81.5%, our district is performing 2.7 percentage points above average in 2023. This places us in the top quartile of districts statewide.",
      suggestions: ["Show historical comparison", "Breakdown by school", "Export report"],
    }
  }

  // Default response
  return {
    content:
      "I can help you explore graduation rate data. Try asking about trends over time, breakdowns by demographic groups, or comparisons between years. What would you like to know?",
    suggestions: [
      "Show me the graduation rate trend",
      "Break down by gender",
      "Compare 2022 vs 2023",
    ],
  }
}

export default function DashboardPage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [chartType, setChartType] = React.useState<ChartType>("trend")
  const [highlightYears, setHighlightYears] = React.useState<string[]>([])
  const [viewMode, setViewMode] = React.useState<ViewMode>("split")
  const [activeFilter, setActiveFilter] = React.useState<ActiveFilter>({
    metric: "4-year-graduation",
    timeframe: "last-5-years",
  })

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Generate AI response
    const response = generateAIResponse(content, activeFilter)

    // Update chart state if needed
    if (response.newChartType) {
      setChartType(response.newChartType)
    }
    if (response.highlightYears) {
      setHighlightYears(response.highlightYears)
    }
    if (response.filterUpdate) {
      setActiveFilter((prev) => ({ ...prev, ...response.filterUpdate }))
    }

    // Add AI message
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
      highlightYears: response.highlightYears,
    }
    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleYearClick = (year: string) => {
    setActiveFilter((prev) => ({ ...prev, year }))
    handleSendMessage(`Tell me more about ${year}`)
  }

  const handleFilterChange = (update: Partial<ActiveFilter>) => {
    setActiveFilter((prev) => ({ ...prev, ...update }))

    // If subgroup changes, update chart type
    if (update.subgroup === "gender") {
      setChartType("gender-comparison")
    } else if (update.subgroup === undefined && chartType === "gender-comparison") {
      setChartType("trend")
    }
  }

  const handleClearFilters = () => {
    setActiveFilter({
      metric: "4-year-graduation",
      timeframe: "last-5-years",
    })
    setChartType("trend")
    setHighlightYears([])
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Analytics</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Graduation Rates</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Context Bar */}
        <ContextBar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {/* Main Content: Dynamic Layout based on View Mode */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* Chat Panel */}
          {viewMode !== "visual" && (
            <div
              className={cn(
                "shrink-0 border-r border-slate-200 dark:border-slate-800",
                viewMode === "split" && "w-[35%] min-w-[320px] max-w-[420px]",
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

          {/* Visualization Canvas */}
          {viewMode !== "chat" && (
            <div
              className={cn(
                "flex-1 overflow-auto bg-slate-50 dark:bg-slate-950",
                viewMode === "visual" && "w-full"
              )}
            >
              <VizCanvas
                chartType={chartType}
                activeFilter={activeFilter}
                highlightYears={highlightYears}
                onYearClick={handleYearClick}
                className="h-full"
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
