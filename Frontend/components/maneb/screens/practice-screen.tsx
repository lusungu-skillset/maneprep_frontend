"use client"

import { useState } from "react"
import { QuizCard } from "../quiz-card"
import { ExamModeCard } from "../exam-mode-card"
import { cn } from "@/lib/utils"
import type { FormLevel } from "@/lib/user-data"

interface Quiz {
  id: string
  topic: string
  subject: string
  questionCount: number
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
}

interface PracticeScreenProps {
  userForm?: FormLevel
  quizzes: Quiz[]
  onStartQuiz?: (quizId: string) => void
  onStartExamMode?: () => void
}

export function PracticeScreen({
  userForm = "Form 4",
  quizzes,
  onStartQuiz,
  onStartExamMode,
}: PracticeScreenProps) {
  const [activeFilter, setActiveFilter] = useState("All")

  const subjects = ["All", ...Array.from(new Set(quizzes.map((quiz) => quiz.subject)))]
  const filteredQuizzes =
    activeFilter === "All"
      ? quizzes
      : quizzes.filter((quiz) => quiz.subject === activeFilter)
  const totalQuestionCount = quizzes.reduce(
    (acc, quiz) => acc + quiz.questionCount,
    0,
  )

  return (
    <div className="p-4 pb-24 space-y-6 max-w-lg mx-auto">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-student-xl text-foreground">Practice</h2>
          <p className="text-muted-foreground text-student-sm mt-1">
            Real and Maneb-Centric questions
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-student-sm font-medium">
          {userForm}
        </span>
      </section>

      <section>
        <ExamModeCard
          subject={`${userForm} - Combined`}
          duration={`${Math.max(20, totalQuestionCount)} mins`}
          questionCount={totalQuestionCount}
          onStart={onStartExamMode}
        />
      </section>

      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {subjects.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {userForm} Quizzes {activeFilter !== "All" && `(${filteredQuizzes.length})`}
        </h3>
        <div className="space-y-3">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                topic={quiz.topic}
                subject={quiz.subject}
                questionCount={quiz.questionCount}
                difficulty={quiz.difficulty}
                estimatedTime={quiz.estimatedTime}
                onStart={() => onStartQuiz?.(quiz.id)}
              />
            ))
          ) : (
            <div className="bg-card rounded-2xl border border-border p-5 text-center text-muted-foreground">
              <p>No quizzes are available for {activeFilter}.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
