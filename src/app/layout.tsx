import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { ThemeProvider } from "../common/components/themeProvider"
import { QueryClientProvider } from "../common/providers/QueryClientProvider"
import { AuthProvider } from "../common/providers/AuthProvider"

export const metadata: Metadata = {
  title: "VigIA - Centralização de processos Jus.br e Agentes de IA",
  description: "Plataforma de Agentes IA análise de processos judiciais presentes no Jus.br e centralização de dados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <QueryClientProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
