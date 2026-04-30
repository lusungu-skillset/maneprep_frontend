"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

interface QuizUIProps {
  questions: Question[]
  topic: string
  onClose: () => void
  onComplete: (result: {
    score: number
    total: number
    attempts: Array<{
      questionId: number
      selectedOption: string
      isCorrect: boolean
    }>
  }) => void
}

export function QuizUI({ questions, topic, onClose, onComplete }: QuizUIProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  )
  const [showResult, setShowResult] = useState(false)
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(new Set())

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index)
    const newAnswers = [...answers]
    newAnswers[currentIndex] = index
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      // Mark this answer as submitted
      const newSubmitted = new Set(submittedAnswers)
      newSubmitted.add(currentIndex)
      setSubmittedAnswers(newSubmitted)
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(answers[currentIndex + 1])
    } else {
      const attempts = answers.flatMap((answerIndex, idx) => {
        if (answerIndex === null) {
          return []
        }

        const question = questions[idx]
        const selectedOption = question.options[answerIndex]

        return [
          {
            questionId: question.id,
            selectedOption,
            isCorrect:
              selectedOption.trim().toLowerCase() ===
              question.correctAnswer.trim().toLowerCase(),
          },
        ]
      })
      const score = attempts.filter((attempt) => attempt.isCorrect).length
      setShowResult(true)
      onComplete({
        score,
        total: questions.length,
        attempts,
      })
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedAnswer(answers[currentIndex - 1])
    }
  }

  if (showResult) {
    const score = answers.reduce<number>((acc, answerIndex, idx) => {
      if (answerIndex === null) {
        return acc
      }

      const selectedOption = questions[idx].options[answerIndex]

      return acc + (
        selectedOption.trim().toLowerCase() ===
        questions[idx].correctAnswer.trim().toLowerCase()
          ? 1
          : 0
      )
    }, 0)
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <h1 className="text-lg font-semibold text-foreground">Quiz Complete</h1>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-card rounded-3xl p-8 shadow-lg border border-border text-center max-w-sm w-full">
            <div className={cn(
              "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white",
              percentage >= 70 ? "bg-secondary" : percentage >= 50 ? "bg-accent" : "bg-destructive"
            )}>
              {percentage}%
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {percentage >= 70 ? "Great Job!" : percentage >= 50 ? "Good Effort!" : "Keep Practicing!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              You scored {score} out of {questions.length} questions correctly.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={onClose}
                className="w-full rounded-xl bg-primary hover:bg-primary/90"
              >
                Back to Practice
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentIndex(0)
                  setSelectedAnswer(null)
                  setAnswers(Array(questions.length).fill(null))
                  setShowResult(false)
                }}
                className="w-full rounded-xl"
              >
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-xs text-muted-foreground">{topic}</p>
              <p className="text-sm font-medium text-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted mt-3 rounded-full overflow-hidden max-w-lg mx-auto">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 p-4 pb-32 max-w-lg mx-auto w-full">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-4">
          <p className="question-text">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSubmitted = submittedAnswers.has(currentIndex)
            const isSelected = selectedAnswer === index
            const isCorrect = option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()
            const isWrongSelected = isSubmitted && isSelected && !isCorrect
            const isCorrectAnswer = isSubmitted && isCorrect

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isSubmitted}
                className={cn(
                  "w-full p-4 rounded-2xl text-left transition-all duration-200 border-2",
                  isSubmitted ? "cursor-default" : "cursor-pointer",
                  isWrongSelected && "bg-destructive/10 border-destructive text-foreground",
                  isCorrectAnswer && "bg-secondary/10 border-secondary text-foreground",
                  !isSubmitted && isSelected && "bg-primary/10 border-primary text-foreground",
                  !isSubmitted && !isSelected && "bg-card border-border hover:border-primary/50 text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
                    isWrongSelected && "bg-destructive text-destructive-foreground",
                    isCorrectAnswer && "bg-secondary text-secondary-foreground",
                    !isSubmitted && isSelected && "bg-primary text-primary-foreground",
                    !isSubmitted && !isSelected && "bg-muted text-muted-foreground"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="option-text">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Feedback Section */}
        {submittedAnswers.has(currentIndex) && selectedAnswer !== null && (
          <div className="mt-6 space-y-3">
            {(() => {
              const selectedOption = currentQuestion.options[selectedAnswer]
              const isCorrect = selectedOption.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()

              return (
                <>
                  {!isCorrect && (
                    <div className="bg-destructive/10 border border-destructive rounded-2xl p-4">
                      <p className="text-student-base font-semibold text-destructive mb-2">❌ You answered incorrectly</p>
                      <p className="text-student-base text-foreground mb-3">
                        <span className="font-semibold">Correct Answer:</span> {currentQuestion.correctAnswer}
                      </p>
                      {currentQuestion.explanation && (
                        <div className="text-student-base text-muted-foreground leading-relaxed">
                          <p className="font-semibold text-foreground mb-1">💡 Explanation</p>
                          {currentQuestion.explanation}
                        </div>
                      )}
                    </div>
                  )}
                  {isCorrect && (
                    <div className="bg-secondary/10 border border-secondary rounded-2xl p-4">
                      <p className="text-student-base font-semibold text-secondary mb-2">✓ Correct!</p>
                      {currentQuestion.explanation && (
                        <div className="text-student-base text-muted-foreground leading-relaxed">
                          <p className="font-semibold text-foreground mb-1">💡 Explanation</p>
                          {currentQuestion.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="rounded-xl flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="rounded-xl flex-1 bg-primary hover:bg-primary/90"
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
            {currentIndex < questions.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
