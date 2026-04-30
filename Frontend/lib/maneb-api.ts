import { apiFetch } from "@/lib/api"

export interface SyncResponse<T> {
  data: T[]
  count: number
  syncedAt: string
  lastUpdatedAt: string | null
}

export interface BackendSubject {
  id: number
  name: string
  form: number
  updatedAt: string
}

export interface BackendQuestion {
  id: number
  topicId: number
  topic: string
  subject: string
  form: number
  question: string
  options: string[]
  answer: string
  explanation: string
  year: number | null
  difficulty: "easy" | "medium" | "hard"
  updatedAt: string
}

export interface BackendPastPaper {
  id: number
  form: number
  year: number
  season?: string
  title: string
  description?: string
  questionCount: number
  questionIds?: number[]
  updatedAt: string
}

export interface SubjectQuestionBundle {
  subject: BackendSubject
  topics: Array<{
    id: number
    name: string
    questionCount: number
    questions: BackendQuestion[]
  }>
  count: number
  syncedAt: string
  lastUpdatedAt: string | null
}

export interface BackendProgressEntry {
  id: number
  userId: string | null
  questionId: number
  selectedAnswer: string
  isCorrect: boolean
  timestamp: string
}

export interface CreateProgressPayload {
  userId: string
  questionId: number
  selectedAnswer: string
  timestamp?: string
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue
    }

    searchParams.set(key, String(value))
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

export async function fetchSubjects(form: number): Promise<SyncResponse<BackendSubject>> {
  return apiFetch(`/subjects${buildQuery({ form })}`, { cache: "no-store" })
}

export async function fetchSubjectQuestionBundle(
  subject: string,
  form: number,
): Promise<SubjectQuestionBundle> {
  return apiFetch(
    `/questions/download${buildQuery({ subject, form })}`,
    { cache: "no-store" },
  )
}

export async function fetchProgress(
  userId: string,
): Promise<SyncResponse<BackendProgressEntry>> {
  return apiFetch(`/progress${buildQuery({ userId })}`, { cache: "no-store" })
}

export async function createProgress(
  payload: CreateProgressPayload,
): Promise<BackendProgressEntry> {
  return apiFetch("/progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
}

export async function fetchPastPapers(
  form?: number,
  year?: number,
): Promise<SyncResponse<BackendPastPaper>> {
  return apiFetch(`/past-papers${buildQuery({ form, year })}`, { cache: "no-store" })
}

export async function fetchPastPaperById(id: number): Promise<BackendPastPaper> {
  return apiFetch(`/past-papers/${id}`, { cache: "no-store" })
}
