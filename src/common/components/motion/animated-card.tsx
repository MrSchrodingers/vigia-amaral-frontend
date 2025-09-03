"use client"

import { motion } from "framer-motion"
import { Card } from "@common/components/ui/card"
import { cn } from "@/src/common/lib/utils"

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  delay?: number
  duration?: number
  variant?: "fadeIn" | "slideUp" | "scale" | "none"
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  duration = 0.5,
  variant = "fadeIn",
  ...props
}: AnimatedCardProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: variant === "slideUp" ? 20 : 0,
      scale: variant === "scale" ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  if (variant === "none") {
    return (
      <Card className={className} {...props}>
        {children}
      </Card>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="w-full"
    >
      <Card className={cn(className)} {...props}>
        {children}
      </Card>
    </motion.div>
  )
}
