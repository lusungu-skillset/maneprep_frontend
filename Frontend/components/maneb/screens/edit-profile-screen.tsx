"use client"

import { useState } from "react"
import { ArrowLeft, Camera, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  BACKEND_SUPPORTED_FORMS,
  getBackendSupportedForm,
} from "@/lib/maneb"
import type { FormLevel } from "@/lib/user-data"

export interface UserProfile {
  id?: string
  name: string
  school: string
  form: FormLevel
}

interface EditProfileScreenProps {
  onBack: () => void
  onSave: (profile: { name: string; school: string; form: FormLevel }) => void
  currentProfile: UserProfile
}

const formOptions: FormLevel[] = BACKEND_SUPPORTED_FORMS

export function EditProfileScreen({ onBack, onSave, currentProfile }: EditProfileScreenProps) {
  const [name, setName] = useState(currentProfile.name)
  const [school, setSchool] = useState(currentProfile.school)
  const [form, setForm] = useState<FormLevel>(getBackendSupportedForm(currentProfile.form))
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      onSave({ name, school, form })
      setIsSaving(false)
    }, 500)
  }

  const isValid = name.trim().length > 0 && school.trim().length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
          </div>
          <Button 
            onClick={handleSave}
            disabled={!isValid || isSaving}
            size="sm"
            className="rounded-full"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center ring-4 ring-background shadow-lg">
              <span className="text-3xl font-bold text-primary-foreground">
                {name.charAt(0).toUpperCase() || "S"}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4 text-secondary-foreground" />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* School */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">School</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Enter your school name"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Form Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Form Level</label>
            <p className="text-xs text-muted-foreground">
              Live content is now available for Form 1 through Form 4.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {formOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setForm(option)}
                  className={cn(
                    "px-4 py-3 rounded-xl border-2 font-medium transition-all",
                    form === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    {form === option && <Check className="w-4 h-4" />}
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-sm text-foreground">
            <strong>Note:</strong> Your form level determines which live subjects and questions are loaded into the app.
          </p>
        </div>
      </div>
    </div>
  )
}
