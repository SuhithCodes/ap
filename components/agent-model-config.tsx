"use client"

import * as React from "react"
import {
  Brain,
  FileText,
  Image,
  Globe,
  ChevronDown,
  Zap,
  Clock,
  Languages,
  Wrench,
  Lock,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export type AgentType = "reasoning" | "document" | "multimodal" | "multilingual"

// Groq models
export type ModelType =
  | "llama-3.3-70b-versatile"
  | "llama-3.1-8b-instant"
  | "mixtral-8x7b-32768"
  | "gemma2-9b-it"
  | "llama-guard-3-8b"

export type AgentConfig = {
  agentType?: AgentType
  textModel?: ModelType
  reasoningModel?: ModelType
  strengths: {
    reasoningDepth: number
    speedAccuracy: number
    longContext: boolean
    multilingual: boolean
    toolCalling: boolean
  }
}

const AGENTS: { id: AgentType; name: string; description: string; icon: React.ElementType }[] = [
  {
    id: "reasoning",
    name: "Reasoning Agent",
    description: "Complex analysis and logical reasoning",
    icon: Brain,
  },
  {
    id: "document",
    name: "Document Agent",
    description: "Document processing and extraction",
    icon: FileText,
  },
  {
    id: "multimodal",
    name: "Multimodal Agent",
    description: "Handle text, images, and mixed content",
    icon: Image,
  },
  {
    id: "multilingual",
    name: "Multilingual Agent",
    description: "Support for multiple languages",
    icon: Globe,
  },
]

// Updated to use Groq models
const MODELS: { id: ModelType; name: string; description: string; speed: string }[] = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    description: "Most capable, 128k context",
    speed: "Fast",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    description: "Ultra-fast inference",
    speed: "Instant",
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    description: "Balanced performance",
    speed: "Fast",
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    description: "Google's efficient model",
    speed: "Instant",
  },
  {
    id: "llama-guard-3-8b",
    name: "Llama Guard 3 8B",
    description: "Safety & moderation",
    speed: "Instant",
  },
]

interface AgentModelConfigProps {
  config: AgentConfig
  onConfigChange: (config: AgentConfig) => void
  disabled?: boolean
  className?: string
}

export function AgentModelConfig({
  config,
  onConfigChange,
  disabled = false,
  className,
}: AgentModelConfigProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const updateConfig = (updates: Partial<AgentConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  const updateStrengths = (updates: Partial<AgentConfig["strengths"]>) => {
    onConfigChange({
      ...config,
      strengths: { ...config.strengths, ...updates },
    })
  }

  return (
    <Card
      className={cn(
        "border-slate-200 transition-opacity dark:border-slate-800",
        disabled && "opacity-50",
        className
      )}
    >
      <Collapsible open={isOpen && !disabled} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild disabled={disabled}>
          <CardHeader className="cursor-pointer pb-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    disabled
                      ? "bg-slate-300 dark:bg-slate-700"
                      : "bg-slate-200 dark:bg-slate-700"
                  )}
                >
                  {disabled ? (
                    <Lock className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Agent & Model Configuration</CardTitle>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                      Optional
                    </span>
                  </div>
                  <CardDescription>
                    {disabled
                      ? "Select tasks to unlock advanced options"
                      : "Customize AI agents and Groq models (auto-selected by default)"}
                  </CardDescription>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-slate-500 transition-transform",
                  isOpen && !disabled && "rotate-180"
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Groq Badge */}
            <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-950/30">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                Powered by Groq
              </span>
              <span className="text-xs text-orange-600 dark:text-orange-500">
                — Lightning-fast inference
              </span>
            </div>

            {/* Agent Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Agent Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AGENTS.map((agent) => {
                  const Icon = agent.icon
                  const isSelected = config.agentType === agent.id
                  return (
                    <button
                      key={agent.id}
                      onClick={() => updateConfig({ agentType: agent.id })}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                        isSelected
                          ? "border-slate-900 bg-slate-900 dark:border-slate-100 dark:bg-slate-100"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isSelected
                            ? "text-white dark:text-slate-900"
                            : "text-slate-600 dark:text-slate-400"
                        )}
                      />
                      <div>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isSelected
                              ? "text-white dark:text-slate-900"
                              : "text-slate-900 dark:text-slate-100"
                          )}
                        >
                          {agent.name}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isSelected
                              ? "text-white/70 dark:text-slate-900/70"
                              : "text-slate-500 dark:text-slate-400"
                          )}
                        >
                          {agent.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Model Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Text Model
                </label>
                <div className="space-y-1">
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => updateConfig({ textModel: model.id })}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-all",
                        config.textModel === model.id
                          ? "border-slate-900 bg-slate-100 dark:border-slate-100 dark:bg-slate-800"
                          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                      )}
                    >
                      <div>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {model.name}
                        </span>
                        <p className="text-xs text-slate-500">{model.description}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs",
                          model.speed === "Instant"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}
                      >
                        {model.speed}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Reasoning Model
                </label>
                <div className="space-y-1">
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => updateConfig({ reasoningModel: model.id })}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-all",
                        config.reasoningModel === model.id
                          ? "border-slate-900 bg-slate-100 dark:border-slate-100 dark:bg-slate-800"
                          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                      )}
                    >
                      <div>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {model.name}
                        </span>
                        <p className="text-xs text-slate-500">{model.description}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs",
                          model.speed === "Instant"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}
                      >
                        {model.speed}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Strength Configuration */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Capability Tuning
              </label>
              <div className="space-y-4">
                {/* Reasoning Depth Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Reasoning Depth
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {config.strengths.reasoningDepth}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.strengths.reasoningDepth}
                    onChange={(e) =>
                      updateStrengths({ reasoningDepth: parseInt(e.target.value) })
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900 dark:[&::-webkit-slider-thumb]:bg-slate-100"
                  />
                </div>

                {/* Speed vs Accuracy Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Speed vs Accuracy
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {config.strengths.speedAccuracy < 50
                        ? "Speed"
                        : config.strengths.speedAccuracy > 50
                          ? "Accuracy"
                          : "Balanced"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.strengths.speedAccuracy}
                    onChange={(e) =>
                      updateStrengths({ speedAccuracy: parseInt(e.target.value) })
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900 dark:[&::-webkit-slider-thumb]:bg-slate-100"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Faster</span>
                    <span>More Accurate</span>
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      updateStrengths({ longContext: !config.strengths.longContext })
                    }
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                      config.strengths.longContext
                        ? "border-slate-900 bg-slate-900 dark:border-slate-100 dark:bg-slate-100"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                    )}
                  >
                    <Clock
                      className={cn(
                        "h-5 w-5",
                        config.strengths.longContext
                          ? "text-white dark:text-slate-900"
                          : "text-slate-500"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        config.strengths.longContext
                          ? "text-white dark:text-slate-900"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      Long Context
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      updateStrengths({ multilingual: !config.strengths.multilingual })
                    }
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                      config.strengths.multilingual
                        ? "border-slate-900 bg-slate-900 dark:border-slate-100 dark:bg-slate-100"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                    )}
                  >
                    <Languages
                      className={cn(
                        "h-5 w-5",
                        config.strengths.multilingual
                          ? "text-white dark:text-slate-900"
                          : "text-slate-500"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        config.strengths.multilingual
                          ? "text-white dark:text-slate-900"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      Multilingual
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      updateStrengths({ toolCalling: !config.strengths.toolCalling })
                    }
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                      config.strengths.toolCalling
                        ? "border-slate-900 bg-slate-900 dark:border-slate-100 dark:bg-slate-100"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                    )}
                  >
                    <Wrench
                      className={cn(
                        "h-5 w-5",
                        config.strengths.toolCalling
                          ? "text-white dark:text-slate-900"
                          : "text-slate-500"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        config.strengths.toolCalling
                          ? "text-white dark:text-slate-900"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      Tool Calling
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Reset to defaults */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onConfigChange({
                  agentType: undefined,
                  textModel: undefined,
                  reasoningModel: undefined,
                  strengths: {
                    reasoningDepth: 50,
                    speedAccuracy: 50,
                    longContext: false,
                    multilingual: false,
                    toolCalling: false,
                  },
                })
              }
              className="w-full"
            >
              Reset to Auto-Select Defaults
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
