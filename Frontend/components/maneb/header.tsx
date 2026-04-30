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
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="MANEB Prep"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              <WifiOff className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only font-medium">Offline</span>
            </div>
          )}
          {isOnline && (
            <div className="flex items-center gap-1.5 text-sm text-secondary bg-secondary/10 px-3 py-1.5 rounded-full">
              <Wifi className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only font-medium">Online</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-11 h-11"
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
              className="rounded-full w-11 h-11"
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
