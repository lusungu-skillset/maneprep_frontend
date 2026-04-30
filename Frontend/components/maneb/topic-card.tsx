"use client"

import { ChevronRight, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopicCardProps {
  title: string
  questionsCount: number
  isCompleted?: boolean
  progress?: number
  onClick?: () => void
}

export function TopicCard({
  title,
  questionsCount,
  isCompleted = false,
  progress = 0,
  onClick,
}: TopicCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-all duration-200 active:scale-[0.98] w-full text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
          <div>
            <h3
              className={cn(
                "font-medium text-sm",
                isCompleted ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {questionsCount} questions - {progress}% complete
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </button>
  )
}
