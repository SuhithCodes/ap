"use client"

import * as React from "react"
import type { GroqModelId } from "@/lib/groq"

type Message = {
  role: "user" | "assistant"
  content: string
}

type UseGroqChatOptions = {
  task?: string
  model?: GroqModelId
  fileContext?: string
  onError?: (error: string) => void
}

type UseGroqChatReturn = {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  sendMessageStream: (content: string) => Promise<void>
  clearMessages: () => void
}

export function useGroqChat({
  task = "question-answering",
  model,
  fileContext,
  onError,
}: UseGroqChatOptions = {}): UseGroqChatReturn {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const sendMessage = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMessage: Message = { role: "user", content }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            task,
            model,
            fileContext,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to get response")
        }

        const data = await response.json()
        const assistantMessage: Message = {
          role: "assistant",
          content: data.content,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
        onError?.(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, task, model, fileContext, isLoading, onError]
  )

  const sendMessageStream = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMessage: Message = { role: "user", content }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      // Add placeholder for assistant message
      const assistantMessage: Message = { role: "assistant", content: "" }
      setMessages((prev) => [...prev, assistantMessage])

      try {
        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            task,
            model,
            fileContext,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to get response")
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error("No response body")
        }

        let fullContent = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullContent += parsed.content
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: fullContent,
                    }
                    return updated
                  })
                }
                if (parsed.error) {
                  throw new Error(parsed.error)
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
        onError?.(errorMessage)
        // Remove the empty assistant message on error
        setMessages((prev) => {
          const updated = [...prev]
          if (updated[updated.length - 1]?.content === "") {
            updated.pop()
          }
          return updated
        })
      } finally {
        setIsLoading(false)
      }
    },
    [messages, task, model, fileContext, isLoading, onError]
  )

  const clearMessages = React.useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendMessageStream,
    clearMessages,
  }
}

