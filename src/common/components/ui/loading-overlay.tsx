import type React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/src/common/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  showSpinner?: boolean
  spinnerSize?: "sm" | "md" | "lg"
}

export function LoadingOverlay({
  isLoading,
  children,
  className,
  showSpinner = false,
  spinnerSize = "md",
}: LoadingOverlayProps) {
  const spinnerSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn("transition-all duration-200", isLoading && "opacity-60 pointer-events-none")}>{children}</div>
      {isLoading && showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 className={cn("animate-spin text-muted-foreground", spinnerSizes[spinnerSize])} />
        </div>
      )}
    </div>
  )
}
