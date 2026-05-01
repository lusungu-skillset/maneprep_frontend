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
    description: "Your study partner for exam success. Practice anytime and keep growing every day.",
    image: "/images/hero-students.jpg",
    icon: BookOpen,
    color: "bg-primary",
  },
  {
    title: "Real Questions",
    description: "Study with subjects, topics, and quizzes that match your learning.",
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
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo.jpg"
              alt="MANEB Prep"
              width={88}
              height={88}
              className="rounded-2xl shadow-lg"
            />
          </div>

          <h1 className="text-3xl font-bold text-foreground text-center mb-3">
            Set Up Your Profile
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-10 leading-relaxed">
            Tell us about yourself so we can personalize your learning.
          </p>

          <div className="space-y-6 flex-1">
            <div className="space-y-3">
              <label className="text-base font-semibold text-foreground">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-5 py-4 rounded-2xl bg-card border-2 border-border text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-base font-semibold text-foreground">School Name</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Enter your school"
                className="w-full px-5 py-4 rounded-2xl bg-card border-2 border-border text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-base font-semibold text-foreground">Select Your Class</label>
              <p className="text-base text-muted-foreground">
                Choose your current form to see the right content.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {formOptions.map((form) => (
                  <button
                    key={form}
                    onClick={() => setSelectedForm(form)}
                    className={cn(
                      "px-5 py-4 rounded-2xl border-2 font-semibold text-lg transition-all min-h-[56px]",
                      selectedForm === form
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {selectedForm === form && <Check className="w-5 h-5" />}
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
            className="w-full h-16 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 mt-8 shadow-lg"
          >
            Start Learning
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          onClick={() => setShowSetup(true)}
          className="text-base text-muted-foreground font-semibold hover:text-foreground"
        >
          Skip
        </Button>
      </div>

      <div className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
          slide.color
        )}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">
          {slide.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
          {slide.description}
        </p>

        <div className="flex-1" />

        <div className="flex items-center justify-center gap-3 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-10 bg-primary"
                  : "w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full h-16 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg"
        >
          {currentSlide === slides.length - 1 ? "Set Up Profile" : "Continue"}
          <ChevronRight className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </div>
  )
}
