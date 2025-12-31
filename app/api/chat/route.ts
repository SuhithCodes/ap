import { NextRequest, NextResponse } from "next/server"
import {
  chatCompletion,
  type ChatMessage,
  type GroqModelId,
  GROQ_MODELS,
  DEFAULT_MODELS,
} from "@/lib/groq"
import { type ChartData, type VisualizationResponse } from "@/lib/chart-types"

export const runtime = "edge"

// System prompts for different task types
const TASK_PROMPTS: Record<string, string> = {
  summarization: `You are an expert summarizer. Analyze the provided content and create clear, concise summaries that capture the key points. Focus on the most important information and present it in an organized manner.`,
  
  "question-answering": `You are a helpful assistant that answers questions based on provided context. Use only the information given to answer questions accurately. If the answer isn't in the context, say so clearly.`,
  
  "data-extraction": `You are a data extraction specialist. Extract structured information, entities, key facts, and relevant data points from the provided content. Present the extracted data in a clear, organized format.`,
  
  classification: `You are a classification expert. Analyze the provided content and categorize it appropriately. Provide clear reasoning for your classifications and identify relevant labels or categories.`,
  
  reasoning: `You are an analytical reasoning expert. Perform deep analysis on the provided content, identify patterns, draw logical conclusions, and provide well-reasoned insights. Show your reasoning process clearly.`,
  
  translation: `You are a professional translator. Translate the provided content accurately while preserving meaning, tone, and context. Maintain the original structure where appropriate.`,
  
  "content-generation": `You are a creative content generator. Based on the provided context and requirements, generate high-quality, relevant content that matches the requested style and purpose.`,
}

// Visualization prompt addition
const VISUALIZATION_PROMPT = `

When the user asks for data breakdowns, comparisons, trends, or analysis that could benefit from visualization:

1. First provide a clear text explanation
2. If applicable, include table data as JSON wrapped in <table></table> tags using this exact format:

<table>{"headers":["Column1","Column2","Column3"],"rows":[["data1","data2","data3"],["data4","data5","data6"]]}</table>

The JSON must have "headers" (array of column names) and "rows" (array of arrays with row data). Keep the JSON on a single line with no line breaks inside it.

3. Then provide chart data in this exact JSON format (on a new line, wrapped in <chart></chart> tags):

<chart>
{
  "type": "bar|line|pie|doughnut|area",
  "title": "Chart Title",
  "labels": ["Label1", "Label2", ...],
  "datasets": [{
    "label": "Dataset Name",
    "data": [number1, number2, ...]
  }],
  "description": "Brief description of what the chart shows"
}
</chart>

Choose the appropriate chart type:
- "bar": For comparisons between categories
- "line": For trends over time
- "pie/doughnut": For showing proportions/percentages
- "area": For cumulative trends

Always extract actual numbers from the data when possible. If asking about breakdowns, trends, or comparisons - generate the chart data.`

type RequestBody = {
  messages: ChatMessage[]
  task?: string
  model?: GroqModelId
  fileContext?: string
  temperature?: number
  generateVisualization?: boolean
}

function parseChartData(content: string): { text: string; chart?: ChartData } {
  const chartMatch = content.match(/<chart>([\s\S]*?)<\/chart>/i)
  
  if (!chartMatch) {
    return { text: content }
  }

  try {
    const chartJson = chartMatch[1].trim()
    const chart = JSON.parse(chartJson) as ChartData
    const text = content.replace(/<chart>[\s\S]*?<\/chart>/i, "").trim()
    return { text, chart }
  } catch (error) {
    console.error("Failed to parse chart data:", error)
    return { text: content.replace(/<chart>[\s\S]*?<\/chart>/i, "").trim() }
  }
}

function extractTableFromMarkdown(content: string): { headers: string[]; rows: (string | number)[][] } | undefined {
  const tableRegex = /\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)+)/g
  const match = tableRegex.exec(content)
  
  if (!match) return undefined

  const headerLine = match[1]
  const headers = headerLine.split("|").map(h => h.trim()).filter(Boolean)
  
  const rowLines = match[2].trim().split("\n")
  const rows = rowLines.map(line => {
    return line.split("|")
      .map(cell => cell.trim())
      .filter(Boolean)
      .map(cell => {
        const num = parseFloat(cell.replace(/[,$]/g, ""))
        return isNaN(num) ? cell : num
      })
  })

  return { headers, rows }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { messages, task, model, fileContext, temperature = 0.7, generateVisualization = true } = body

    // Validate model if provided
    if (model && !GROQ_MODELS[model]) {
      return NextResponse.json(
        { error: `Invalid model: ${model}` },
        { status: 400 }
      )
    }

    // Build system prompt based on task
    let systemPrompt = TASK_PROMPTS[task || "question-answering"] || TASK_PROMPTS["question-answering"]

    // Add visualization capability
    if (generateVisualization) {
      systemPrompt += VISUALIZATION_PROMPT
    }

    // Add file context if provided
    if (fileContext) {
      systemPrompt += `\n\nContext from uploaded files:\n${fileContext}`
    }

    // Prepare messages with system prompt
    const fullMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ]

    // Get completion from Groq
    const response = await chatCompletion({
      model: model || DEFAULT_MODELS.text,
      messages: fullMessages,
      temperature,
      maxTokens: 4096,
    })

    // Parse response for chart data
    const { text, chart } = parseChartData(response)
    const table = extractTableFromMarkdown(text)

    const result: VisualizationResponse = {
      text,
      chart,
      table,
    }

    return NextResponse.json({
      content: text,
      chart,
      table,
      model: model || DEFAULT_MODELS.text,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    
    // Handle specific Groq errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid or missing Groq API key" },
          { status: 401 }
        )
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
