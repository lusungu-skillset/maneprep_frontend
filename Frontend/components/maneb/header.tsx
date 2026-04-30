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
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt="MANEB Prep"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          {!isOnline && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              <WifiOff className="w-3 h-3" />
              <span className="sr-only sm:not-sr-only">Offline</span>
            </div>
          )}
          {isOnline && (
            <div className="flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full">
              <Wifi className="w-3 h-3" />
              <span className="sr-only sm:not-sr-only">Online</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-9 h-9"
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-accent" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {showSearch && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-9 h-9"
              onClick={onSearchClick}
            >
              <Search className="w-5 h-5 text-muted-foreground" />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
