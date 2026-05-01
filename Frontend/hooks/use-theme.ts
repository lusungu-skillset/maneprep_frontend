"use client"

import { useState, useEffect, useCallback } from "react"

export type Theme = "light" | "dark" | "system"

const THEME_STORAGE_KEY = "maneb-theme"
const THEME_EVENT_NAME = "maneb-theme-change"

function getStoredTheme(): Theme | null {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme
  }

  return null
}

function applyThemeToDocument(theme: Theme): "light" | "dark" {
  const root = document.documentElement
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  root.classList.toggle("dark", isDark)

  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) {
    metaTheme.setAttribute("content", isDark ? "#1e293b" : "#2563eb")
  }

  return isDark ? "dark" : "light"
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  const syncTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    setResolvedTheme(applyThemeToDocument(nextTheme))
  }, [])

  useEffect(() => {
    syncTheme(getStoredTheme() ?? "light")

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleSystemThemeChange = () => {
      if ((getStoredTheme() ?? "light") === "system") {
        syncTheme("system")
      }
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        syncTheme(getStoredTheme() ?? "light")
      }
    }

    const handleThemeChange = () => {
      syncTheme(getStoredTheme() ?? "light")
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(THEME_EVENT_NAME, handleThemeChange)

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(THEME_EVENT_NAME, handleThemeChange)
    }
  }, [syncTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    syncTheme(newTheme)
    window.dispatchEvent(new Event(THEME_EVENT_NAME))
  }, [syncTheme])

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === "dark",
  }
}
