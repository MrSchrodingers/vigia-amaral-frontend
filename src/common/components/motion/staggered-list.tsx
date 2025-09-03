"use client"

import { motion } from "framer-motion"
import { cn } from "@/src/common/lib/utils"

interface StaggeredListProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0.2,
}: StaggeredListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
