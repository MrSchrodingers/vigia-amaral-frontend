"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "oralsim-ui-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    const initialColorValue = root.style.getPropertyValue("--initial-color-mode")

    const savedTheme = localStorage.getItem(storageKey)
    if (savedTheme) {
      setTheme(savedTheme as Theme)
    } else if (initialColorValue === "dark") {
      setTheme("dark")
    } else if (initialColorValue === "light") {
      setTheme("light")
    } else if (enableSystem) {
      setTheme("system")
    }
  }, [enableSystem, storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    if (disableTransitionOnChange) {
      root.classList.add("disable-transitions")
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      window.getComputedStyle(root).opacity
    }

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      root.style.colorScheme = systemTheme
    } else {
      root.classList.add(theme)
      root.style.colorScheme = theme
    }

    if (disableTransitionOnChange) {
      setTimeout(() => {
        root.classList.remove("disable-transitions")
      }, 0)
    }
  }, [theme, disableTransitionOnChange])

  useEffect(() => {
    if (theme !== "system") return

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      const root = window.document.documentElement
      const systemTheme = event.matches ? "dark" : "light"

      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
      root.style.colorScheme = systemTheme
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const storageKey = "vigia-theme";
              const theme = localStorage.getItem(storageKey);
              const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
              
              document.documentElement.style.setProperty("--initial-color-mode", theme || systemTheme);
              
              if (theme === "dark" || (theme === "system" && systemTheme === "dark")) {
                document.documentElement.classList.add("dark");
              }
            } catch (e) {
              console.error("Theme initialization failed:", e);
            }
          })();
        `,
      }}
    />
  )
}
