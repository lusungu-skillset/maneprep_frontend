"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronRight, BookOpen, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  BACKEND_SUPPORTED_FORMS,
  DEFAULT_BACKEND_FORM,
} from "@/lib/maneb"
import type { FormLevel } from "@/lib/user-data"

interface OnboardingScreenProps {
  onComplete: (profile: { name: string; school: string; form: FormLevel }) => void
}

const slides = [
  {
    title: "Welcome to MANEB Prep",
    description: "Your companion for MANEB exam success.",
    image: "/images/hero-students.jpg",
    icon: BookOpen,
    color: "bg-primary",
  },
  {
    title: "Test Your Knowledge",
    description: "Use Real subjects, topics, and questions.",
    image: "/images/subject-math.jpg",
    icon: Download,
    color: "bg-secondary",
  },
]

const formOptions: FormLevel[] = BACKEND_SUPPORTED_FORMS

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSetup, setShowSetup] = useState(false)
  const [name, setName] = useState("")
  const [school, setSchool] = useState("")
  const [selectedForm, setSelectedForm] = useState<FormLevel>(DEFAULT_BACKEND_FORM)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      setShowSetup(true)
    }
  }

  const handleComplete = () => {
    if (name.trim() && school.trim()) {
      onComplete({ name: name.trim(), school: school.trim(), form: selectedForm })
    }
  }

  const isFormValid = name.trim().length > 0 && school.trim().length > 0

  // Setup screen
  if (showSetup) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 px-6 py-8 flex flex-col max-w-lg mx-auto w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.jpg"
              alt="MANEB Prep"
              width={80}
              height={80}
              className="rounded-2xl"
            />
          </div>

          <h1 className="text-student-2xl text-foreground text-center mb-2">
            Set Up Your Profile
          </h1>
          <p className="text-muted-foreground text-student-base text-center mb-8">
            Tell us about yourself and choose the form you want to study.
          </p>

          <div className="space-y-5 flex-1">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-student-sm font-medium text-foreground">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-student-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* School */}
            <div className="space-y-2">
              <label className="text-student-sm font-medium text-foreground">School Name</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Enter your school"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-student-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Form Level */}
            <div className="space-y-2">
              <label className="text-student-sm font-medium text-foreground">Select Your Form</label>
              <p className="text-student-xs text-muted-foreground">
                Backend content is now available for Form 1 through Form 4.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {formOptions.map((form) => (
                  <button
                    key={form}
                    onClick={() => setSelectedForm(form)}
                    className={cn(
                      "px-4 py-3 rounded-xl border-2 font-medium transition-all",
                      selectedForm === form
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {selectedForm === form && <Check className="w-4 h-4" />}
                      {form}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            disabled={!isFormValid}
            className="w-full h-14 rounded-2xl text-base font-semibold bg-primary hover:bg-primary/90 mt-6"
          >
            Start Learning
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setShowSetup(true)}
          className="text-muted-foreground"
        >
          Skip
        </Button>
      </div>

      {/* Image section */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content section */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
          slide.color
        )}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h1 className="text-student-2xl text-foreground mb-3 text-balance">
          {slide.title}
        </h1>
        <p className="text-muted-foreground text-student-base leading-relaxed text-pretty">
          {slide.description}
        </p>

        <div className="flex-1" />

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Action button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 rounded-2xl text-base font-semibold bg-primary hover:bg-primary/90"
        >
          {currentSlide === slides.length - 1 ? "Set Up Profile" : "Continue"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
