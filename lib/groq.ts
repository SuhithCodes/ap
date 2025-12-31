import Groq from "groq-sdk"

// Initialize Groq client
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Available Groq models
export const GROQ_MODELS = {
  // Fast inference models
  "llama-3.3-70b-versatile": {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    description: "Most capable open model, great for complex tasks",
    contextWindow: 128000,
    speed: "fast",
  },
  "llama-3.1-8b-instant": {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    description: "Ultra-fast for simple tasks",
    contextWindow: 128000,
    speed: "instant",
  },
  "llama-guard-3-8b": {
    id: "llama-guard-3-8b",
    name: "Llama Guard 3 8B",
    description: "Content safety and moderation",
    contextWindow: 8192,
    speed: "instant",
  },
  "mixtral-8x7b-32768": {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    description: "Balanced performance and speed",
    contextWindow: 32768,
    speed: "fast",
  },
  "gemma2-9b-it": {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    description: "Google's efficient model",
    contextWindow: 8192,
    speed: "instant",
  },
} as const

export type GroqModelId = keyof typeof GROQ_MODELS

// Default models for different use cases
export const DEFAULT_MODELS = {
  text: "llama-3.3-70b-versatile" as GroqModelId,
  reasoning: "llama-3.3-70b-versatile" as GroqModelId,
  fast: "llama-3.1-8b-instant" as GroqModelId,
}

// Chat completion types
export type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export type ChatCompletionOptions = {
  model?: GroqModelId
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// Non-streaming chat completion
export async function chatCompletion({
  model = DEFAULT_MODELS.text,
  messages,
  temperature = 0.7,
  maxTokens = 4096,
}: ChatCompletionOptions): Promise<string> {
  const response = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  })

  return response.choices[0]?.message?.content || ""
}

// Streaming chat completion
export async function* streamChatCompletion({
  model = DEFAULT_MODELS.text,
  messages,
  temperature = 0.7,
  maxTokens = 4096,
}: ChatCompletionOptions): AsyncGenerator<string> {
  const stream = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      yield content
    }
  }
}

