"use client"

import { ArrowLeft, BookOpen, Play, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TopicQuestion {
  id: number
  question: string
  options: string[]
  answer: string
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface TopicLessonScreenProps {
  topic: {
    id: number
    title: string
    subject: string
    questionsCount: number
    progress: number
    questions: TopicQuestion[]
  }
  onBack: () => void
  onStartQuiz: () => void
}

export function TopicLessonScreen({
  topic,
  onBack,
  onStartQuiz,
}: TopicLessonScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{topic.subject}</p>
            <h1 className="text-base font-semibold text-foreground truncate">{topic.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{topic.progress}%</span>
            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${topic.progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-32 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Backend Topic Preview</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          These notes are coming straight from the backend question bank. Use them
          to inspect the live content before starting the quiz.
        </p>

        <div className="space-y-4">
          {topic.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">
                      {question.question}
                    </h3>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full whitespace-nowrap",
                        question.difficulty === "Hard"
                          ? "bg-destructive/10 text-destructive"
                          : question.difficulty === "Easy"
                            ? "bg-secondary/10 text-secondary"
                            : "bg-accent/20 text-accent-foreground",
                      )}
                    >
                      {question.difficulty}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {question.options.map((option) => {
                      const isCorrect =
                        option.trim().toLowerCase() === question.answer.trim().toLowerCase()

                      return (
                        <li
                          key={option}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-sm",
                            isCorrect
                              ? "border-secondary/30 bg-secondary/10 text-foreground"
                              : "border-border bg-background text-muted-foreground",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                            )}
                            <span>{option}</span>
                          </div>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="mt-3 rounded-xl bg-primary/5 border border-primary/10 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Explanation
                    </p>
                    <p className="mt-1 text-sm text-foreground leading-6">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={onStartQuiz}
            className="w-full h-14 rounded-2xl text-base font-semibold bg-primary hover:bg-primary/90"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quiz ({topic.questionsCount} questions)
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
