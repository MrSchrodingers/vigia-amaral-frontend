"use client"
import { Loader2, Scale } from "lucide-react"

interface LoadingSpinnerProps {
  text?: string
}

export function LoadingSpinner({ text = "Carregando..." }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="relative">
          <Scale className="w-12 h-12 text-muted-foreground mx-auto" />
          <Loader2 className="w-6 h-6 text-primary animate-spin absolute -top-1 -right-1" />
        </div>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
