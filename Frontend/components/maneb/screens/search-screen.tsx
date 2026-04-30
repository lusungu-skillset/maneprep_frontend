"use client"

import { useState } from "react"
import { ArrowLeft, Search, X, Database } from "lucide-react"
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
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search subjects, topics, quizzes..."
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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

      <main className="px-4 py-6 pb-24 max-w-lg mx-auto">
        {query.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Results ({filteredResults.length})
            </h2>
            {filteredResults.length > 0 ? (
              <div className="space-y-2">
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
              <p className="text-center text-muted-foreground py-8">
                No backend results found for &quot;{query}&quot;.
              </p>
            )}
          </section>
        )}

        {query.length === 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Available from Backend
            </h2>
            {featuredResults.length > 0 ? (
              <div className="space-y-2">
                {featuredResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => onResultSelect?.(result)}
                    className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Database className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-5 text-sm text-muted-foreground">
                Load subjects from the backend to search live content.
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
