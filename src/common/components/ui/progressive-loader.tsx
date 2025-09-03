"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/src/common/lib/utils"

interface ProgressiveLoaderProps {
  isLoading: boolean
  delay?: number
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function ProgressiveLoader({ isLoading, delay = 300, children, fallback, className }: ProgressiveLoaderProps) {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isLoading) {
      timer = setTimeout(() => {
        setShowLoader(true)
      }, delay)
    } else {
      setShowLoader(false)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isLoading, delay])

  if (isLoading && showLoader) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        {fallback || <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
      </div>
    )
  }

  return <>{children}</>
}
