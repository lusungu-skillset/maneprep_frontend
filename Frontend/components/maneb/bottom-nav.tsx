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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around max-w-lg mx-auto py-2 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl transition-all duration-200 min-w-[76px] min-h-[56px]",
                isActive
                  ? "bg-primary/10 text-primary"
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
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
