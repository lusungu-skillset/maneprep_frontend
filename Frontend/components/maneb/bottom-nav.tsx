"use client"

import { Home, BookOpen, GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "home" | "subjects" | "practice" | "profile"

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "subjects" as const, label: "Subjects", icon: BookOpen },
  { id: "practice" as const, label: "Practice", icon: GraduationCap },
  { id: "profile" as const, label: "Profile", icon: User },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/70 bg-card/95 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-around gap-1 px-3 py-3 sm:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex min-h-[60px] min-w-[76px] flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition-all duration-200",
                isActive
                  ? "bg-primary/12 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted active:scale-95"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
            >
              <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className={cn(
                "text-sm font-medium", 
                isActive && "font-semibold"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
