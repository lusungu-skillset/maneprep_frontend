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
    <div className="group bg-card rounded-2xl p-5 shadow-sm border border-border overflow-hidden relative hover:shadow-md transition-all duration-300 hover:border-primary/30">
      {/* Subtle gradient background */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl rounded-bl-full opacity-50 transition-opacity group-hover:opacity-80",
        config.gradient
      )} />
      
      <div className="flex flex-col gap-4 relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">{subject}</p>
            <h3 className="font-bold text-foreground text-lg mt-1">{topic}</h3>
          </div>
          <span className={cn(
            "text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5",
            config.bg, config.color
          )}>
            <DifficultyIcon className="w-4 h-4" />
            {difficulty}
          </span>
        </div>
        
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            <span>{questionCount} questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{estimatedTime}</span>
          </div>
        </div>
        
        <Button 
          onClick={onStart}
          className="w-full mt-1 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-base group-hover:scale-[1.01] transition-transform"
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          Start Quiz
        </Button>
      </div>
    </div>
  )
}
