"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Send, Sparkles, User, Lightbulb, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
  highlightYears?: string[]
}

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  onSuggestionClick?: (suggestion: string) => void
  isLoading?: boolean
  className?: string
}

export function ChatPanel({
  messages,
  onSendMessage,
  onSuggestionClick,
  isLoading = false,
  className,
}: ChatPanelProps) {
  const [input, setInput] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSendMessage(input.trim())
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-white dark:bg-slate-900",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
          <Sparkles className="h-4 w-4 text-white dark:text-slate-900" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            AI Assistant
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ask questions about your data
          </p>
        </div>
        <Badge
          variant="secondary"
          className="ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        >
          Live data
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="space-y-4 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Lightbulb className="h-8 w-8 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                Start a conversation
              </h3>
              <p className="mb-6 max-w-[200px] text-xs text-slate-500 dark:text-slate-400">
                Ask about trends, compare metrics, or explore your data
              </p>
              <div className="flex flex-col gap-2">
                {[
                  "Show me the performance trend",
                  "Break down by category",
                  "Compare Q3 vs Q4",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => onSendMessage(prompt)}
                    className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                  >
                    <ChevronRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                  message.role === "user"
                    ? "bg-slate-900 dark:bg-slate-100"
                    : "bg-slate-900 dark:bg-slate-100"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-3.5 w-3.5 text-white dark:text-slate-900" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-white dark:text-slate-900" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  "flex max-w-[85%] flex-col gap-2",
                  message.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
                  )}
                >
                  {message.role === "assistant" ? (
                    <MarkdownContent content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => onSuggestionClick?.(suggestion)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <span className="text-[10px] text-slate-400">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
                <Sparkles className="h-3.5 w-3.5 text-white dark:text-slate-900" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your data..."
            className="min-h-[44px] max-h-[120px] resize-none rounded-xl border-slate-200 bg-white text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 shrink-0 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

// Strip chart tags from content
function stripChartTags(content: string): string {
  return content.replace(/<chart>[\s\S]*?<\/chart>/gi, "").trim()
}

// Interface for table JSON data
interface TableData {
  headers: string[]
  rows: string[][]
}

// Convert JSON table data to markdown table
function jsonTableToMarkdown(tableData: TableData): string {
  const { headers, rows } = tableData
  
  if (!headers || headers.length === 0) return ""
  
  const lines: string[] = []
  
  // Header row
  lines.push("| " + headers.join(" | ") + " |")
  
  // Separator row
  lines.push("| " + headers.map(() => "---").join(" | ") + " |")
  
  // Data rows
  for (const row of rows) {
    // Ensure row has same number of columns as headers
    const paddedRow = [...row]
    while (paddedRow.length < headers.length) {
      paddedRow.push("")
    }
    lines.push("| " + paddedRow.slice(0, headers.length).join(" | ") + " |")
  }
  
  return lines.join("\n")
}

// Parse and convert JSON tables in content to markdown
function convertJsonTablesToMarkdown(content: string): string {
  let result = content

  // Pattern 1: <table>{"headers":...}</table>
  result = result.replace(/<table>([\s\S]*?)<\/table>/gi, (match, jsonStr) => {
    try {
      const tableData = JSON.parse(jsonStr.trim()) as TableData
      return "\n\n" + jsonTableToMarkdown(tableData) + "\n\n"
    } catch (e) {
      console.warn("Failed to parse table JSON (pattern 1):", e)
      return ""
    }
  })

  // Pattern 2: <table={"headers":...}></table> or <table={"headers":...}>
  result = result.replace(/<table=(\{[\s\S]*?\})>(?:<\/table>)?/gi, (match, jsonStr) => {
    try {
      const tableData = JSON.parse(jsonStr.trim()) as TableData
      return "\n\n" + jsonTableToMarkdown(tableData) + "\n\n"
    } catch (e) {
      console.warn("Failed to parse table JSON (pattern 2):", e)
      return ""
    }
  })

  // Pattern 3: Inline format like <table={"headers":...,"rows":...}> without proper closing
  // This catches cases where the JSON might span multiple lines or have complex structure
  result = result.replace(/<table=(\{"headers":\[.*?\],"rows":\[.*?\]\})>/gi, (match, jsonStr) => {
    try {
      const tableData = JSON.parse(jsonStr.trim()) as TableData
      return "\n\n" + jsonTableToMarkdown(tableData) + "\n\n"
    } catch (e) {
      console.warn("Failed to parse table JSON (pattern 3):", e)
      return ""
    }
  })

  return result
}

// Markdown Content Renderer
function MarkdownContent({ content }: { content: string }) {
  // Remove chart tags and convert JSON tables to markdown before rendering
  const cleanContent = convertJsonTablesToMarkdown(stripChartTags(content))
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="mb-2 mt-4 text-lg font-bold text-slate-900 first:mt-0 dark:text-slate-100">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-3 text-base font-semibold text-slate-900 first:mt-0 dark:text-slate-100">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-1.5 mt-2.5 text-sm font-semibold text-slate-900 first:mt-0 dark:text-slate-100">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="mb-1 mt-2 text-sm font-medium text-slate-900 first:mt-0 dark:text-slate-100">
            {children}
          </h4>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="mb-2 last:mb-0">{children}</p>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm">{children}</li>
        ),
        // Strong and emphasis
        strong: ({ children }) => (
          <strong className="font-semibold text-slate-900 dark:text-slate-100">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        // Code
        code: ({ children, className }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                {children}
              </code>
            )
          }
          return (
            <code className="block overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs font-mono text-slate-800 dark:bg-slate-700 dark:text-slate-200">
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="my-2 overflow-x-auto rounded-lg bg-slate-100 dark:bg-slate-700">
            {children}
          </pre>
        ),
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="my-2 border-l-2 border-slate-300 pl-3 italic text-slate-600 dark:border-slate-600 dark:text-slate-400">
            {children}
          </blockquote>
        ),
        // Horizontal rule
        hr: () => (
          <hr className="my-3 border-slate-200 dark:border-slate-700" />
        ),
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {children}
          </a>
        ),
        // Tables
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="min-w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>
        ),
        tbody: ({ children }) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700">{children}</tbody>,
        tr: ({ children }) => (
          <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">
            {children}
          </td>
        ),
      }}
    >
      {cleanContent}
    </ReactMarkdown>
  )
}
