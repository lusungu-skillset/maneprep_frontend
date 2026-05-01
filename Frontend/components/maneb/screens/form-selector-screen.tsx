"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, GraduationCap, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  BACKEND_SUPPORTED_FORMS,
  getBackendSupportedForm,
} from "@/lib/maneb"
import type { FormLevel } from "@/lib/user-data"

interface FormSelectorScreenProps {
  currentForm: FormLevel
  onSelectForm: (form: FormLevel) => void
  onBack?: () => void
  isOnboarding?: boolean
}

const formInfo: Partial<Record<FormLevel, { description: string; subjects: string[]; examType: string }>> = {
  "Form 1": {
    description: "Start with the key ideas for early secondary school.",
    subjects: [],
    examType: "Ready",
  },
  "Form 2": {
    description: "Build confidence with the next step in your revision.",
    subjects: [],
    examType: "Ready",
  },
  "Form 3": {
    description: "Work through tougher topics as you prepare for exams.",
    subjects: [],
    examType: "Ready",
  },
  "Form 4": {
    description: "Focus on final revision for MSCE and end-of-year papers.",
    subjects: [],
    examType: "Ready",
  },
}

export function FormSelectorScreen({ currentForm, onSelectForm, onBack, isOnboarding = false }: FormSelectorScreenProps) {
  const [selectedForm, setSelectedForm] = useState<FormLevel>(
    getBackendSupportedForm(currentForm),
  )

  const handleConfirm = () => {
    onSelectForm(selectedForm)
  }

  return (
    <div className="min-h-screen bg-background">
      {!isOnboarding && (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-card/95 px-4 py-4 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Select Your Class</h1>
          </div>
        </header>
      )}

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="text-center mb-8 pt-4">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo.jpg"
              alt="MANEB Prep"
              width={72}
              height={72}
              className="rounded-2xl"
            />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Select Your Class</h2>
          <p className="text-muted-foreground mt-2">
            Choose the class you want to study now
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {BACKEND_SUPPORTED_FORMS.map((form) => {
            const info = formInfo[form] ?? {
              description: "Study content is not ready yet.",
              subjects: [],
              examType: "Not ready",
            }
            const isSelected = selectedForm === form
            
            return (
              <button
                key={form}
                onClick={() => setSelectedForm(form)}
                className={cn(
                  "w-full text-left rounded-2xl border-2 p-4 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        "text-lg font-bold",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {form}
                      </h3>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {info.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="px-2 py-1 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                        {info.examType}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Study content
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">Your Privacy</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Your profile stays on this device. Your app only sends what is needed to load study content and save progress.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full h-14 rounded-2xl text-base font-semibold mt-6"
        >
          {isOnboarding ? "Continue" : "Update Class"}
        </Button>
      </div>
    </div>
  )
}
