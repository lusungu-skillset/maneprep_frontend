import {
  Beaker,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  History,
  type LucideIcon,
} from "lucide-react"
import type { FormLevel } from "@/lib/user-data"

export const BACKEND_SUPPORTED_FORMS: FormLevel[] = ["Form 1", "Form 2", "Form 3", "Form 4"]
export const DEFAULT_BACKEND_FORM: FormLevel = "Form 1"

type SubjectPresentation = {
  icon: LucideIcon
  color: string
  image: string
}

const defaultSubjectPresentation: SubjectPresentation = {
  icon: BookOpen,
  color: "bg-primary",
  image: "/images/study-desk.jpg",
}

const subjectPresentationMap: Record<string, SubjectPresentation> = {
  mathematics: {
    icon: Calculator,
    color: "bg-primary",
    image: "/images/subject-math.jpg",
  },
  english: {
    icon: BookOpen,
    color: "bg-secondary",
    image: "/images/subject-english.jpg",
  },
  biology: {
    icon: Beaker,
    color: "bg-chart-4",
    image: "/images/subject-science.jpg",
  },
  chemistry: {
    icon: FlaskConical,
    color: "bg-chart-5",
    image: "/images/subject-science.jpg",
  },
  physics: {
    icon: FlaskConical,
    color: "bg-primary",
    image: "/images/subject-physics.jpg",
  },
  geography: {
    icon: Globe,
    color: "bg-chart-5",
    image: "/images/study-desk.jpg",
  },
  history: {
    icon: History,
    color: "bg-accent",
    image: "/images/study-desk.jpg",
  },
}

export function formLevelToNumber(form: FormLevel): number {
  return Number(form.replace("Form ", ""))
}

export function isBackendSupportedForm(form: FormLevel): boolean {
  return BACKEND_SUPPORTED_FORMS.includes(form)
}

export function getBackendSupportedForm(form: FormLevel): FormLevel {
  return isBackendSupportedForm(form) ? form : DEFAULT_BACKEND_FORM
}

export function getSubjectPresentation(name: string): SubjectPresentation {
  return subjectPresentationMap[name.trim().toLowerCase()] ?? defaultSubjectPresentation
}

export function formatDifficulty(
  difficulty: string,
): "Easy" | "Medium" | "Hard" {
  if (difficulty === "hard") {
    return "Hard"
  }

  if (difficulty === "easy") {
    return "Easy"
  }

  return "Medium"
}

export function formatRelativeDateTime(value: string | null | undefined): string {
  if (!value) {
    return "not synced yet"
  }

  const timestamp = new Date(value).getTime()

  if (Number.isNaN(timestamp)) {
    return "not synced yet"
  }

  const diffMs = Date.now() - timestamp
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000))

  if (diffMinutes < 1) {
    return "just now"
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours} hr ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
}
