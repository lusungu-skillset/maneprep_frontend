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
    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 shadow-lg text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">MANEB Exam Mode</span>
          </div>
          <h3 className="text-xl font-bold">Simulate Real Exam</h3>
          <p className="text-sm opacity-80 mt-1">{subject}</p>
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
      
      <div className="bg-white/10 rounded-xl p-3 mb-4">
        <p className="text-xs opacity-90">
          Experience the real MANEB exam conditions. Timer will run, no going back on questions.
        </p>
      </div>
      
      <Button 
        onClick={onStart}
        className="w-full bg-white text-primary hover:bg-white/90 font-semibold rounded-xl"
      >
        Start Exam Mode
      </Button>
    </div>
  )
}
