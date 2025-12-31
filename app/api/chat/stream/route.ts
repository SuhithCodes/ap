import { NextRequest } from "next/server"
import {
  streamChatCompletion,
  type ChatMessage,
  type GroqModelId,
  GROQ_MODELS,
  DEFAULT_MODELS,
} from "@/lib/groq"

export const runtime = "edge"

// System prompts for different task types
const TASK_PROMPTS: Record<string, string> = {
  summarization: `You are an expert summarizer. Analyze the provided content and create clear, concise summaries that capture the key points.`,
  "question-answering": `You are a helpful assistant that answers questions based on provided context. Use only the information given to answer questions accurately.`,
  "data-extraction": `You are a data extraction specialist. Extract structured information and key data points from the provided content.`,
  classification: `You are a classification expert. Analyze and categorize the provided content appropriately.`,
  reasoning: `You are an analytical reasoning expert. Perform deep analysis and provide well-reasoned insights.`,
  translation: `You are a professional translator. Translate content accurately while preserving meaning and tone.`,
  "content-generation": `You are a creative content generator. Generate high-quality, relevant content based on the provided context.`,
}

type RequestBody = {
  messages: ChatMessage[]
  task?: string
  model?: GroqModelId
  fileContext?: string
  temperature?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { messages, task, model, fileContext, temperature = 0.7 } = body

    // Validate model if provided
    if (model && !GROQ_MODELS[model]) {
      return new Response(
        JSON.stringify({ error: `Invalid model: ${model}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Build system prompt
    let systemPrompt = TASK_PROMPTS[task || "question-answering"] || TASK_PROMPTS["question-answering"]
    if (fileContext) {
      systemPrompt += `\n\nContext from uploaded files:\n${fileContext}`
    }

    const fullMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ]

    // Create readable stream for SSE
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamChatCompletion({
            model: model || DEFAULT_MODELS.text,
            messages: fullMessages,
            temperature,
            maxTokens: 4096,
          })

          for await (const chunk of generator) {
            const data = `data: ${JSON.stringify({ content: chunk })}\n\n`
            controller.enqueue(encoder.encode(data))
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("Stream error:", error)
          const errorData = `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
          controller.enqueue(encoder.encode(errorData))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Stream API error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

