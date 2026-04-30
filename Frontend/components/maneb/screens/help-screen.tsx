"use client"

import { ArrowLeft, Database, Search, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HelpScreenProps {
  onBack: () => void
}

const testingNotes = [
  "Use the Subjects tab to inspect the live subject and topic bundles returned by the backend.",
  "Use Practice to launch quizzes built from real backend questions instead of sample sets.",
  "Each completed quiz now posts answer selections to the progress endpoint for the current local profile.",
]

export function HelpScreen({ onBack }: HelpScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Help & Support</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-24 max-w-lg mx-auto space-y-6">
        <section className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Backend testing mode</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This frontend now depends on live backend content rather than mock data.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {testingNotes.map((note, index) => (
            <div
              key={note}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {index === 0 ? (
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                  ) : index === 1 ? (
                    <Search className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Database className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{note}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Quick check</h3>
          <p className="text-sm text-muted-foreground leading-6">
            When the backend is seeded and reachable, the app should show real subjects,
            topic previews, and quizzes for the selected form without any hardcoded sample records.
          </p>
        </section>
      </main>
    </div>
  )
}
