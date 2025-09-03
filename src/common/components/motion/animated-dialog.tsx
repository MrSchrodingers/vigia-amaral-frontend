"use client"

import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@common/components/ui/dialog"
import { cn } from "@/src/common/lib/utils"

interface AnimatedDialogContentProps extends React.ComponentProps<typeof DialogContent> {
  children: React.ReactNode
  className?: string
}

export function AnimatedDialogContent({ children, className, ...props }: AnimatedDialogContentProps) {
  return (
    <DialogContent
      className={cn("p-0 overflow-hidden", className)}
      {...props}
      asChild
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="p-6 bg-white dark:bg-gray-950 rounded-lg shadow-lg"
      >
        {children}
      </motion.div>
    </DialogContent>
  )
}

export { Dialog, DialogTrigger, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
