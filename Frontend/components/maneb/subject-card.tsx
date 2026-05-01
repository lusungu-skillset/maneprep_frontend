"use client"

import { Download, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface SubjectCardProps {
  name: string
  icon: LucideIcon
  progress: number
  color: string
  isOffline?: boolean
  onClick?: () => void
}

export function SubjectCard({ 
  name, 
  icon: Icon, 
  progress, 
  color, 
  isOffline = false,
  onClick 
}: SubjectCardProps) {
  const isComplete = progress === 100

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-[1.5rem] border border-border/70 bg-card/92 p-5 text-left shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex flex-col gap-3 relative">
        <div className="flex items-start justify-between">
          <div 
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", 
              color
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            {isOffline ? (
              <span className="flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Ready
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Download className="w-3 h-3" />
                Online
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">
                {isComplete ? "Completed!" : "Progress"}
              </span>
              <span className={cn(
                "font-medium",
                isComplete ? "text-secondary" : "text-foreground"
              )}>
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isComplete ? "bg-secondary" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
