"use client"

import { Clock, Award, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExamModeCardProps {
  subject?: string
  duration?: string
  questionCount?: number
  onStart?: () => void
}

export function ExamModeCard({ 
  subject = "All Subjects",
  duration = "2 hours",
  questionCount = 50,
  onStart 
}: ExamModeCardProps) {
  return (
    <div className="rounded-[1.75rem] bg-gradient-to-br from-primary to-primary/85 p-6 text-white shadow-[0_24px_48px_-28px_rgba(37,99,235,0.9)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Full Practice</span>
          </div>
          <h3 className="text-2xl font-bold">Try a full paper style quiz</h3>
          <p className="mt-1 text-sm opacity-80">{subject}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-4 text-sm opacity-90">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>{questionCount} questions</span>
        </div>
      </div>
      
      <div className="mb-5 rounded-2xl bg-white/12 p-4">
        <p className="text-sm leading-6 opacity-90">
          Work through a longer mixed quiz with a running timer and one-way question flow.
        </p>
      </div>
      
      <Button 
        onClick={onStart}
        className="w-full bg-white text-primary hover:bg-white/90"
      >
        Start Full Practice
      </Button>
    </div>
  )
}
