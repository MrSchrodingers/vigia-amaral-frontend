"use client"

import { motion } from "framer-motion"
import { Button } from "@common/components/ui/button"
import { cn } from "@/src/common/lib/utils"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode
  className?: string
  whileHoverScale?: number
}

export function AnimatedButton({
  children,
  className,
  whileHoverScale = 1.05,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: whileHoverScale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button className={cn(className)} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
