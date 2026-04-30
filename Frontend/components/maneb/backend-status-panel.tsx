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
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-5 py-4">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-11 h-11">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>
      </header>

      <main className="px-5 py-10 pb-28 max-w-lg mx-auto">
        <div className="bg-card rounded-3xl border border-border shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{heading}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{message}</p>
        </div>
      </main>
    </div>
  )
}
