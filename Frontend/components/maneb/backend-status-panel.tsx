"use client"

import { ArrowLeft, Database, type LucideIcon } from "lucide-react"
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
  icon: Icon = Database,
}: BackendStatusPanelProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
      </header>

      <main className="px-4 py-10 pb-24 max-w-lg mx-auto">
        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
        </div>
      </main>
    </div>
  )
}
