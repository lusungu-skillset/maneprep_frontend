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
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 pb-28 sm:px-6 lg:px-8">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Practice</h2>
          <p className="text-base text-muted-foreground mt-1">
            Test your knowledge with real questions
          </p>
        </div>
        <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-semibold">
          {userForm}
        </span>
      </section>

      <section>
        <ExamModeCard
          subject={`${userForm} - All Subjects`}
          duration={`${Math.max(20, totalQuestionCount)} mins`}
          questionCount={totalQuestionCount}
          onStart={onStartExamMode}
        />
      </section>

      <section>
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {subjects.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2.5 rounded-full text-base font-semibold whitespace-nowrap transition-colors min-h-[44px]",
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
        <h3 className="mb-4 text-xl font-bold text-foreground">
          {activeFilter === "All" ? `All ${userForm} Quizzes` : `${activeFilter} Quizzes`}
          {activeFilter !== "All" && ` (${filteredQuizzes.length})`}
        </h3>
        <div className="grid gap-4 xl:grid-cols-2">
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
            <div className="bg-card rounded-2xl border border-border p-6 text-center text-base text-muted-foreground">
              <p>No quizzes available for {activeFilter} yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
