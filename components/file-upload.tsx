"use client"

import * as React from "react"
import {
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  X,
  CheckCircle2,
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

export type UploadedFile = {
  id: string
  name: string
  type: string
  size: number
  file: File
}

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  className?: string
}

const ACCEPTED_TYPES = {
  "text/csv": { icon: FileSpreadsheet, label: "CSV" },
  "application/pdf": { icon: FileText, label: "PDF" },
  "text/markdown": { icon: File, label: "Markdown" },
  "text/plain": { icon: File, label: "Text" },
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
  const config = ACCEPTED_TYPES[type as keyof typeof ACCEPTED_TYPES]
  return config?.icon || File
}

function getFileLabel(type: string, name: string): string {
  if (name.endsWith(".md")) return "Markdown"
  if (name.endsWith(".csv")) return "CSV"
  if (name.endsWith(".pdf")) return "PDF"
  const config = ACCEPTED_TYPES[type as keyof typeof ACCEPTED_TYPES]
  return config?.label || "File"
}

export function FileUpload({ files, onFilesChange, className }: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const isValid =
        file.type in ACCEPTED_TYPES ||
        file.name.endsWith(".md") ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".pdf")
      return isValid
    })

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file,
    }))

    onFilesChange([...files, ...uploadedFiles])
  }

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id))
  }

  return (
    <Card className={cn("border-slate-200 dark:border-slate-800", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
            <span className="text-lg font-bold text-white dark:text-slate-900">1</span>
          </div>
          <div>
            <CardTitle className="text-lg">Import Your Data</CardTitle>
            <CardDescription>
              Upload files to analyze. Supported: CSV, PDF, Markdown
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
            isDragging
              ? "border-slate-900 bg-slate-50 dark:border-slate-100 dark:bg-slate-800"
              : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".csv,.pdf,.md,text/csv,application/pdf,text/markdown"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
                isDragging
                  ? "bg-slate-900 dark:bg-slate-100"
                  : "bg-slate-200 dark:bg-slate-700"
              )}
            >
              <Upload
                className={cn(
                  "h-7 w-7 transition-colors",
                  isDragging
                    ? "text-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {isDragging ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                or click to browse
              </p>
            </div>
            <div className="flex gap-2">
              {["CSV", "PDF", "Markdown"].map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Uploaded Files ({files.length})
              </p>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Ready</span>
              </div>
            </div>
            <div className="space-y-2">
              {files.map((file) => {
                const Icon = getFileIcon(file.type)
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                      <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {getFileLabel(file.type, file.name)} • {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-slate-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Browse Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Browse Files
        </Button>
      </CardContent>
    </Card>
  )
}

