"use client"

import { ArrowLeft, Sparkles, Search, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HelpScreenProps {
  onBack: () => void
}

const testingNotes = [
  "Go to the Subjects tab to see all available subjects and topics.",
  "Use Practice to answer questions and test your understanding.",
  "After each quiz, your progress is saved so you can track your improvement.",
]

export function HelpScreen({ onBack }: HelpScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-card/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Help and Support</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24 sm:px-6">
        <section className="rounded-[1.75rem] border border-border/70 bg-card/92 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">How to use the app</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This app helps you learn, practice questions, and track your progress easily.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {testingNotes.map((note, index) => (
            <div
              key={note}
              className="rounded-2xl border border-border/70 bg-card/92 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  {index === 0 ? (
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                  ) : index === 1 ? (
                    <Search className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{note}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <h3 className="font-semibold text-foreground mb-2">What you should see</h3>
          <p className="text-sm leading-7 text-muted-foreground">
            You should see subjects, topics, and quiz questions. If everything is working well,
            you can practice questions and see your progress as you learn.
          </p>
        </section>
      </main>
    </div>
  )
}
