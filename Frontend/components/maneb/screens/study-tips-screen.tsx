"use client"

import Image from "next/image"
import { ArrowLeft, Lightbulb, Clock, Brain, Coffee, Moon, Target, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StudyTip {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  details: string[]
}

const studyTips: StudyTip[] = [
  {
    id: "1",
    title: "Create a Study Schedule",
    description: "Plan your study sessions for better results",
    icon: Clock,
    color: "bg-primary",
    details: [
      "Set specific times for each subject",
      "Include short breaks every 25-30 minutes",
      "Review difficult topics when you are most alert",
      "Study consistently at the same time each day"
    ]
  },
  {
    id: "2",
    title: "Active Recall",
    description: "Test yourself instead of just re-reading",
    icon: Brain,
    color: "bg-secondary",
    details: [
      "Close your book and try to remember what you read",
      "Use flashcards for key concepts",
      "Explain topics to a friend or family member",
      "Take practice quizzes regularly"
    ]
  },
  {
    id: "3",
    title: "Take Care of Yourself",
    description: "Your body affects your brain performance",
    icon: Coffee,
    color: "bg-chart-4",
    details: [
      "Get enough sleep (8 hours for teenagers)",
      "Eat nutritious foods, especially before exams",
      "Stay hydrated throughout the day",
      "Exercise regularly to boost memory"
    ]
  },
  {
    id: "4",
    title: "Set Clear Goals",
    description: "Know what you want to achieve",
    icon: Target,
    color: "bg-accent",
    details: [
      "Set specific goals for each study session",
      "Break big goals into smaller, achievable tasks",
      "Track your progress daily",
      "Celebrate small wins to stay motivated"
    ]
  },
  {
    id: "5",
    title: "Quality Sleep",
    description: "Sleep helps consolidate memory",
    icon: Moon,
    color: "bg-chart-5",
    details: [
      "Avoid screens 1 hour before bed",
      "Review notes briefly before sleeping",
      "Keep a consistent sleep schedule",
      "Your brain processes information while you sleep"
    ]
  },
]

interface StudyTipsScreenProps {
  onBack: () => void
}

export function StudyTipsScreen({ onBack }: StudyTipsScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Study Tips</h1>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src="/images/subject-english.jpg"
          alt="Study Tips"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-background" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white drop-shadow-md">Study Smarter</h2>
              <p className="text-sm text-white/80">Tips to ace your MANEB exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <main className="px-4 py-6 pb-24 max-w-lg mx-auto">
        <div className="space-y-4">
          {studyTips.map((tip) => {
            const Icon = tip.icon
            return (
              <details
                key={tip.id}
                className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden group"
              >
                <summary className="p-4 cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", tip.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-90" />
                  </div>
                </summary>
                <div className="px-4 pb-4">
                  <div className="h-px bg-border mb-4" />
                  <ul className="space-y-2">
                    {tip.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )
          })}
        </div>

        {/* Quick reminder */}
        <div className="mt-6 bg-primary/10 rounded-2xl p-5 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Remember</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Consistent daily practice is better than cramming. Use MANEB Prep every day for 30 minutes, and you will see great improvements in your exam results!
          </p>
        </div>
      </main>
    </div>
  )
}
