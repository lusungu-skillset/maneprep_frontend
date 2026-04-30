"use client"

import { useState, useEffect, useCallback } from "react"

export type Theme = "light" | "dark" | "system"

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement
    const isDark = 
      newTheme === "dark" || 
      (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    
    if (isDark) {
      root.classList.add("dark")
      setResolvedTheme("dark")
    } else {
      root.classList.remove("dark")
      setResolvedTheme("light")
    }
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute("content", isDark ? "#1a1625" : "#3b5bdb")
    }
  }, [])

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("maneb-theme") as Theme | null
    const initialTheme = stored || "light"
    setThemeState(initialTheme)
    applyTheme(initialTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [applyTheme, theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("maneb-theme", newTheme)
    applyTheme(newTheme)
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === "dark"
  }
}
