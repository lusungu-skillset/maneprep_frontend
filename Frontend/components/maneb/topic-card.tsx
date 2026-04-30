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
      className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-all duration-200 active:scale-[0.98] w-full text-left min-h-[72px]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isCompleted ? (
            <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            </div>
          )}
          <div>
            <h3
              className={cn(
                "font-semibold text-base",
                isCompleted ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {questionsCount} questions - {progress}% done
            </p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
      </div>
    </button>
  )
}
