"use client"

import { Clock, HelpCircle, Play, Sparkles, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuizCardProps {
  topic: string
  subject: string
  questionCount: number
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime?: string
  onStart?: () => void
}

const difficultyConfig = {
  Easy: { 
    color: "text-secondary", 
    bg: "bg-secondary/10",
    icon: Sparkles,
    gradient: "from-secondary/20 to-transparent"
  },
  Medium: { 
    color: "text-accent", 
    bg: "bg-accent/20",
    icon: Zap,
    gradient: "from-accent/20 to-transparent"
  },
  Hard: { 
    color: "text-destructive", 
    bg: "bg-destructive/10",
    icon: Target,
    gradient: "from-destructive/20 to-transparent"
  },
}

export function QuizCard({ 
  topic, 
  subject,
  questionCount, 
  difficulty,
  estimatedTime = "10 mins",
  onStart 
}: QuizCardProps) {
  const config = difficultyConfig[difficulty]
  const DifficultyIcon = config.icon

  return (
    <div className="group bg-card rounded-2xl p-4 shadow-sm border border-border overflow-hidden relative hover:shadow-md transition-all duration-300 hover:border-primary/30">
      {/* Subtle gradient background */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl rounded-bl-full opacity-50 transition-opacity group-hover:opacity-80",
        config.gradient
      )} />
      
      <div className="flex flex-col gap-3 relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{subject}</p>
            <h3 className="font-semibold text-foreground text-base mt-1">{topic}</h3>
          </div>
          <span className={cn(
            "text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1",
            config.bg, config.color
          )}>
            <DifficultyIcon className="w-3 h-3" />
            {difficulty}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>{questionCount} questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime}</span>
          </div>
        </div>
        
        <Button 
          onClick={onStart}
          className="w-full mt-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 group-hover:scale-[1.02] transition-transform"
        >
          <Play className="w-4 h-4 mr-2 fill-current" />
          Start Quiz
        </Button>
      </div>
    </div>
  )
}
