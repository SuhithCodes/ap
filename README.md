# AnalyticsGPT

AI Agent Platform powered by [Groq](https://groq.com) for lightning-fast inference.

## Features

- **Data Import**: Upload CSV, PDF, and Markdown files
- **Task Selection**: Summarization, Q&A, Data Extraction, Classification, Reasoning, Translation, Content Generation
- **Agent Configuration**: Choose from Reasoning, Document, Multimodal, or Multilingual agents
- **Groq Models**: Access to Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, Gemma 2 9B, and more
- **Streaming Responses**: Real-time AI responses with streaming support

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Groq API

1. Get your API key from [Groq Console](https://console.groq.com/keys)
2. Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Groq Models Available

| Model | Description | Speed |
|-------|-------------|-------|
| Llama 3.3 70B | Most capable, 128k context | Fast |
| Llama 3.1 8B | Ultra-fast for simple tasks | Instant |
| Mixtral 8x7B | Balanced performance | Fast |
| Gemma 2 9B | Google's efficient model | Instant |
| Llama Guard 3 8B | Safety & moderation | Instant |

## API Routes

- `POST /api/chat` - Non-streaming chat completion
- `POST /api/chat/stream` - Streaming chat completion (SSE)

### Example Request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Summarize this data"}],
    "task": "summarization",
    "model": "llama-3.3-70b-versatile",
    "fileContext": "Your file content here..."
  }'
```

## Project Structure

```
├── app/
│   ├── api/chat/          # Groq API routes
│   ├── dashboard/         # Analytics dashboard
│   └── page.tsx           # Main agent configuration page
├── components/
│   ├── file-upload.tsx    # Data import component
│   ├── task-selection.tsx # Task picker
│   ├── agent-model-config.tsx # Model configuration
│   └── config-summary.tsx # Summary & run panel
├── hooks/
│   └── use-groq-chat.ts   # Chat hook with streaming
└── lib/
    └── groq.ts            # Groq SDK configuration
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI**: Groq SDK
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts

## Learn More

- [Groq Documentation](https://console.groq.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)

## Deploy

Deploy to Vercel with your `GROQ_API_KEY` environment variable configured.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
