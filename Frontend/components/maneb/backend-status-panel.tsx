"use client"

import { ArrowLeft, AlertCircle, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackendStatusPanelProps {
  title: string
  heading: string
  message: string
  onBack: () => void
  icon?: LucideIcon
}

export function BackendStatusPanel({
  title,
  heading,
  message,
  onBack,
  icon: Icon = AlertCircle,
}: BackendStatusPanelProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-card/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-11 w-11 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 pb-28 sm:px-6">
        <div className="rounded-[2rem] border border-border/70 bg-card/92 p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{heading}</h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">{message}</p>
        </div>
      </main>
    </div>
  )
}
