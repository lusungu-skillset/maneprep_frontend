"use client"

import Image from "next/image"
import { Search, Wifi, WifiOff, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

interface HeaderProps {
  title: string
  showSearch?: boolean
  isOnline?: boolean
  onSearchClick?: () => void
}

export function Header({ title, showSearch = true, isOnline = true, onSearchClick }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-card/95 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="MANEB Prep"
            width={44}
            height={44}
            className="rounded-2xl shadow-sm"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
              Study App
            </p>
            <h1 className="truncate text-xl font-bold text-foreground sm:text-2xl">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-muted px-3 py-2 text-sm text-muted-foreground">
              <WifiOff className="w-4 h-4" />
              <span className="sr-only lg:not-sr-only font-medium">Offline</span>
            </div>
          )}
          {isOnline && (
            <div className="hidden items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-2 text-sm text-secondary sm:flex">
              <Wifi className="w-4 h-4" />
              <span className="font-medium">Ready</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-11 rounded-full border border-border/70 bg-background/70"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-6 h-6 text-accent" />
            ) : (
              <Moon className="w-6 h-6 text-muted-foreground" />
            )}
          </Button>
          {showSearch && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-11 rounded-full border border-border/70 bg-background/70"
              onClick={onSearchClick}
              aria-label="Search"
            >
              <Search className="w-6 h-6 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
