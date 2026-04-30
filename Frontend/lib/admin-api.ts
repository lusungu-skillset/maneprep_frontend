import type {
  CreateQuestionInput,
  CreateSubjectInput,
  CreateTopicInput,
  ManebFormValue,
  QuestionDifficultyValue,
  UpdateQuestionInput,
  UpdateSubjectInput,
  UpdateTopicInput,
} from '@shared/form-types'
import { apiFetch } from '@/lib/api'

export interface SyncResponse<T> {
  data: T[]
  count: number
  syncedAt: string
  lastUpdatedAt: string | null
}

export interface AdminSubject {
  id: number
  name: string
  form: ManebFormValue
  updatedAt: string
}

export interface AdminTopic {
  id: number
  name: string
  subjectId: number
  updatedAt: string
  subject: Pick<AdminSubject, 'id' | 'name' | 'form'>
}

export interface AdminQuestion {
  id: number
  topicId: number
  subjectId: number
  topic: string
  subject: string
  form: ManebFormValue
  question: string
  options: string[]
  answer: string
  explanation: string
  difficulty: QuestionDifficultyValue
  year: number | null
  updatedAt: string
}

export interface AdminPastPaper {
  id: number
  form: ManebFormValue
  year: number
  season?: string
  title: string
  description?: string
  questionCount: number
  questionIds?: number[]
  updatedAt: string
}

interface QuestionFilters {
  form?: ManebFormValue
  subjectId?: number
  topicId?: number
  search?: string
}

function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') {
      continue
    }

    searchParams.set(key, String(value))
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

function buildAdminInit(adminKey: string, init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
      ...init.headers,
    },
  }
}

export async function fetchAdminSubjects(form?: ManebFormValue) {
  return apiFetch<SyncResponse<AdminSubject>>(
    `/subjects${buildQuery({ form })}`,
    { cache: 'no-store' },
  )
}

export async function createAdminSubject(
  adminKey: string,
  payload: CreateSubjectInput,
) {
  return apiFetch<AdminSubject>(
    '/subjects',
    buildAdminInit(adminKey, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  )
}

export async function updateAdminSubject(
  adminKey: string,
  id: number,
  payload: UpdateSubjectInput,
) {
  return apiFetch<AdminSubject>(
    `/subjects/${id}`,
    buildAdminInit(adminKey, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  )
}

export async function deleteAdminSubject(adminKey: string, id: number) {
  return apiFetch<{ id: number; deleted: boolean }>(
    `/subjects/${id}`,
    buildAdminInit(adminKey, {
      method: 'DELETE',
    }),
  )
}

export async function fetchAdminTopics(subjectId?: number) {
  return apiFetch<SyncResponse<AdminTopic>>(
    `/topics${buildQuery({ subjectId })}`,
    { cache: 'no-store' },
  )
}

export async function createAdminTopic(
  adminKey: string,
  payload: CreateTopicInput,
) {
  return apiFetch<AdminTopic>(
    '/topics',
    buildAdminInit(adminKey, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  )
}

export async function updateAdminTopic(
  adminKey: string,
  id: number,
  payload: UpdateTopicInput,
) {
  return apiFetch<AdminTopic>(
    `/topics/${id}`,
    buildAdminInit(adminKey, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  )
}

export async function deleteAdminTopic(adminKey: string, id: number) {
  return apiFetch<{ id: number; deleted: boolean }>(
    `/topics/${id}`,
    buildAdminInit(adminKey, {
      method: 'DELETE',
    }),
  )
}

export async function fetchAdminQuestions(filters: QuestionFilters = {}) {
  return apiFetch<SyncResponse<AdminQuestion>>(
    `/questions${buildQuery(filters as Record<string, string | number | undefined>)}`,
    { cache: 'no-store' },
  )
}

export async function createAdminQuestion(
  adminKey: string,
  payload: CreateQuestionInput,
) {
  return apiFetch<AdminQuestion>(
    '/questions',
    buildAdminInit(adminKey, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  )
}

export async function updateAdminQuestion(
  adminKey: string,
  id: number,
  payload: UpdateQuestionInput,
) {
  return apiFetch<AdminQuestion>(
    `/questions/${id}`,
    buildAdminInit(adminKey, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  )
}

export async function deleteAdminQuestion(adminKey: string, id: number) {
  return apiFetch<{ id: number; deleted: boolean }>(
    `/questions/${id}`,
    buildAdminInit(adminKey, {
      method: 'DELETE',
    }),
  )
}

export async function bulkUploadAdminQuestions(
  adminKey: string,
  payload: CreateQuestionInput[],
) {
  return apiFetch<SyncResponse<AdminQuestion>>(
    '/questions/bulk',
    buildAdminInit(adminKey, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  )
}

export async function fetchAdminPastPapers(form?: ManebFormValue, year?: number) {
  return apiFetch<SyncResponse<AdminPastPaper>>(
    `/past-papers${buildQuery({ form, year })}`,
    { cache: 'no-store' },
  )
}

export async function createAdminPastPaper(
  adminKey: string,
  payload: {
    form: ManebFormValue
    year: number
    season?: string
    title: string
    description?: string
    questionIds?: number[]
  },
) {
  return apiFetch<AdminPastPaper>(
    '/past-papers',
    buildAdminInit(adminKey, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  )
}

export async function updateAdminPastPaper(
  adminKey: string,
  id: number,
  payload: Partial<{
    form: ManebFormValue
    year: number
    season?: string
    title: string
    description?: string
    questionIds?: number[]
  }>,
) {
  return apiFetch<AdminPastPaper>(
    `/past-papers/${id}`,
    buildAdminInit(adminKey, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  )
}

export async function deleteAdminPastPaper(adminKey: string, id: number) {
  return apiFetch<{ success: boolean; message: string }>(
    `/past-papers/${id}`,
    buildAdminInit(adminKey, {
      method: 'DELETE',
    }),
  )
}
