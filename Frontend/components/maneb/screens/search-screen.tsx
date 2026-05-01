"use client"

import { useState } from "react"
import { ArrowLeft, Search, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface SearchResult {
  id: string
  title: string
  type: "subject" | "topic" | "quiz"
  subtitle: string
  subjectId?: number
  topicId?: number
}

interface SearchScreenProps {
  onBack: () => void
  results: SearchResult[]
  featuredResults?: SearchResult[]
  onResultSelect?: (result: SearchResult) => void
}

export function SearchScreen({
  onBack,
  results,
  featuredResults = [],
  onResultSelect,
}: SearchScreenProps) {
  const [query, setQuery] = useState("")

  const filteredResults =
    query.length > 1
      ? results.filter((result) => {
          const haystack = `${result.title} ${result.subtitle}`.toLowerCase()
          return haystack.includes(query.toLowerCase())
        })
      : []

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-card/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subjects, topics, or quizzes"
              autoFocus
              className="w-full rounded-2xl border border-border/70 bg-card/90 py-3 pl-10 pr-10 text-base text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 sm:px-6">
        {query.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Results ({filteredResults.length})
            </h2>
            {filteredResults.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {filteredResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => onResultSelect?.(result)}
                    className="w-full bg-card rounded-xl p-4 shadow-sm border border-border hover:border-primary/30 transition-colors text-left"
                  >
                    <p className="font-medium text-foreground">{result.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {result.type.charAt(0).toUpperCase() + result.type.slice(1)} - {result.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No results found for &quot;{query}&quot;.
              </p>
            )}
          </section>
        )}

        {query.length === 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Ready to Explore
            </h2>
            {featuredResults.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {featuredResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => onResultSelect?.(result)}
                    className="w-full rounded-2xl border border-border/70 bg-card/92 p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{result.title}</p>
                      <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/70 bg-card/92 p-5 text-sm text-muted-foreground">
                Open your subjects first, then come back to search your study content.
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
