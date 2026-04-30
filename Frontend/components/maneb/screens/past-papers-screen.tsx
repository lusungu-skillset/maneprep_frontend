"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react"
import { fetchPastPapers } from "@/lib/maneb-api"
import type { BackendPastPaper } from "@/lib/maneb-api"
import type { FormLevel } from "@/lib/user-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PastPapersScreenProps {
  userForm?: FormLevel
  onPaperSelect?: (paper: BackendPastPaper) => void
}

const formMap: Record<FormLevel, number> = {
  "Form 1": 1,
  "Form 2": 2,
  "Form 3": 3,
  "Form 4": 4,
}

export function PastPapersScreen({
  userForm = "Form 4",
  onPaperSelect,
}: PastPapersScreenProps) {
  const [pastPapers, setPastPapers] = useState<BackendPastPaper[]>([])
  const [filteredPapers, setFilteredPapers] = useState<BackendPastPaper[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)

  const formNum = formMap[userForm] as 1 | 2 | 3 | 4

  useEffect(() => {
    const loadPastPapers = async () => {
      try {
        setIsLoading(true)
        const response = await fetchPastPapers(formNum)
        const papers = response.data.sort((a, b) => b.year - a.year)
        setPastPapers(papers)
        setFilteredPapers(papers)
        setError(null)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load past papers"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    void loadPastPapers()
  }, [formNum])

  const years = Array.from(new Set(filteredPapers.map((p) => p.year))).sort(
    (a, b) => b - a,
  )

  const papersByYear = Object.fromEntries(
    years.map((year) => [
      year,
      filteredPapers.filter((p) => p.year === year),
    ]),
  )

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year)
    setSelectedSeason(null)
  }

  const handleSelectPaper = (paper: BackendPastPaper) => {
    setSelectedSeason(paper.season || "General")
    if (onPaperSelect) {
      onPaperSelect(paper)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-lg mx-auto">
        <section className="mb-4">
          <h2 className="text-student-xl font-bold text-foreground">
            Past Exam Papers
          </h2>
          <p className="text-student-sm text-muted-foreground mt-1">
            Loading past papers for {userForm}...
          </p>
        </section>
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <div className="inline-flex animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-3 text-sm text-muted-foreground">Loading papers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-lg mx-auto">
        <section className="mb-4">
          <h2 className="text-student-xl font-bold text-foreground">
            Past Exam Papers
          </h2>
        </section>
        <div className="bg-card rounded-2xl border border-destructive/20 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Unable to load papers</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24 space-y-4 max-w-lg mx-auto">
      <section className="mb-4">
        <h2 className="text-student-xl font-bold text-foreground">
          Past Exam Papers
        </h2>
        <p className="text-student-sm text-muted-foreground mt-1">
          {userForm} examination papers organized by year
        </p>
      </section>

      {filteredPapers.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-6 text-center space-y-3">
          <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto" />
          <div>
            <p className="font-medium text-foreground">No past papers yet</p>
            <p className="text-student-sm text-muted-foreground">
              Come back later for {userForm} past exam papers
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {years.map((year) => {
            const isExpanded = expandedYear === year
            const yearPapers = papersByYear[year] || []

            return (
              <div
                key={year}
                className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
              >
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-foreground">{year}</div>
                      <div className="text-student-xs text-muted-foreground">
                        {yearPapers.length}{" "}
                        {yearPapers.length === 1 ? "paper" : "papers"}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/50 divide-y divide-border/50 bg-background/40">
                    {yearPapers.map((paper) => (
                      <div key={paper.id} className="p-4 space-y-3">
                        <div>
                          <h3 className="text-student-base font-semibold text-foreground line-clamp-2">
                            {paper.title}
                          </h3>
                          {paper.description && (
                            <p className="text-student-xs text-muted-foreground mt-1 line-clamp-2">
                              {paper.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {paper.season && (
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {paper.season}
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium">
                            {paper.questionCount}{" "}
                            {paper.questionCount === 1 ? "question" : "questions"}
                          </span>
                        </div>

                        <Button
                          onClick={() => handleSelectPaper(paper)}
                          className="w-full text-student-sm"
                          variant={
                            selectedSeason === (paper.season || "General")
                              ? "default"
                              : "outline"
                          }
                        >
                          {selectedSeason === (paper.season || "General")
                            ? "Selected"
                            : "View Paper"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-background/60 rounded-2xl border border-border/50 p-4 text-center">
        <p className="text-student-xs text-muted-foreground">
          <strong>Tip:</strong> Solve past papers to practice exam questions and
          prepare for your exams
        </p>
      </div>
    </div>
  )
}
