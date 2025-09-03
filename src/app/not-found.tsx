"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileQuestion, Home, ArrowLeft, ChartNoAxesCombined } from "lucide-react"
import { AnimatedButton } from "@/src/common/components/motion/animated-button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gradient-to-b from-white to-emerald-50 dark:from-gray-950 dark:to-emerald-950/30 p-4">
      <motion.div
        className="max-w-md space-y-8 p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative">
            <FileQuestion className="h-24 w-24 text-emerald-200 dark:text-emerald-900" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">404</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Página não encontrada
        </motion.h1>

        <motion.p
          className="text-base text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente
          indisponível.
        </motion.p>

        <motion.div
          className="pt-4 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <AnimatedButton
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full sm:w-auto border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30"
            whileHoverScale={1.03}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </AnimatedButton>

          <AnimatedButton
            asChild
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600"
            whileHoverScale={1.03}
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Página Inicial
            </Link>
          </AnimatedButton>

          <AnimatedButton
            asChild
            variant="outline"
            className="w-full sm:w-auto border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30"
            whileHoverScale={1.03}
          >
            <Link href="/clinica/dashboard">
              <ChartNoAxesCombined className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </AnimatedButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        © {new Date().getFullYear()} OralSin - Sistema de Gestão Inteligente
      </motion.div>
    </div>
  )
}

