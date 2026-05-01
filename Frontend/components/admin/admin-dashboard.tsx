'use client'

import type {
  CreateQuestionInput,
  CreateSubjectInput,
  CreateTopicInput,
  ManebFormValue,
  QuestionDifficultyValue,
} from '@shared/form-types'
import type { ChangeEvent, ReactNode } from 'react'
import { useDeferredValue, useEffect, useState } from 'react'
import {
  BookCopy,
  BookOpenText,
  Calendar,
  Database,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  Moon,
  RefreshCw,
  Settings2,
  Sun,
  Trash2,
  Upload,
} from 'lucide-react'
import {
  type AdminQuestion,
  type AdminSubject,
  type AdminTopic,
  type AdminPastPaper,
  bulkUploadAdminQuestions,
  createAdminQuestion,
  createAdminSubject,
  createAdminTopic,
  createAdminPastPaper,
  deleteAdminQuestion,
  deleteAdminSubject,
  deleteAdminTopic,
  deleteAdminPastPaper,
  fetchAdminQuestions,
  fetchAdminSubjects,
  fetchAdminTopics,
  fetchAdminPastPapers,
  updateAdminQuestion,
  updateAdminSubject,
  updateAdminTopic,
} from '@/lib/admin-api'
import { useTheme } from '@/hooks/use-theme'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

type AdminSection =
  | 'dashboard'
  | 'subjects'
  | 'topics'
  | 'questions'
  | 'pastPapers'
  | 'upload'
  | 'settings'

type SubjectFormState = {
  name: string
  form: '' | `${ManebFormValue}`
}

type TopicFormState = {
  name: string
  subjectId: string
}

type QuestionFormState = {
  form: '' | `${ManebFormValue}`
  subjectId: string
  topicId: string
  question: string
  options: string[]
  answerIndex: string
  explanation: string
  difficulty: QuestionDifficultyValue
  year: string
}

type UploadPreviewItem = {
  question: string
  options: string[]
  answer: string
  explanation: string
  topicId: number | null
  difficulty?: QuestionDifficultyValue
  year?: number | null
}

const DEFAULT_ADMIN_KEY = 'maneb-admin'
const FORM_OPTIONS: ManebFormValue[] = [1, 2, 3, 4]
const DIFFICULTY_OPTIONS: Array<{
  value: QuestionDifficultyValue
  label: string
}> = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]
const SECTION_ITEMS: Array<{
  id: AdminSection
  label: string
  icon: typeof LayoutDashboard
  description: string
}> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'See your study content at a glance',
  },
  {
    id: 'subjects',
    label: 'Subjects',
    icon: GraduationCap,
    description: 'Create and organize subjects by class level',
  },
  {
    id: 'topics',
    label: 'Topics',
    icon: BookCopy,
    description: 'Manage topics within subjects',
  },
  {
    id: 'questions',
    label: 'Questions',
    icon: BookOpenText,
    description: 'Create and edit quiz questions',
  },
  {
    id: 'pastPapers',
    label: 'Past Papers',
    icon: Calendar,
    description: 'Manage past exam questions by year',
  },
  {
    id: 'upload',
    label: 'Upload Questions',
    icon: Upload,
    description: 'Import many questions from one file',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings2,
    description: 'Access key and refresh tools',
  },
]

function createSubjectFormState(): SubjectFormState {
  return {
    name: '',
    form: '1',
  }
}

function createTopicFormState(): TopicFormState {
  return {
    name: '',
    subjectId: '',
  }
}

function createQuestionFormState(): QuestionFormState {
  return {
    form: '1',
    subjectId: '',
    topicId: '',
    question: '',
    options: ['', '', '', ''],
    answerIndex: '',
    explanation: '',
    difficulty: 'medium',
    year: '',
  }
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getLatestTimestamp(values: Array<string | null | undefined>) {
  const timestamps = values
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value))

  if (timestamps.length === 0) {
    return null
  }

  return new Date(Math.max(...timestamps)).toISOString()
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * pageSize

  return {
    page: safePage,
    totalPages,
    items: items.slice(startIndex, startIndex + pageSize),
  }
}

function difficultyBadgeVariant(difficulty: QuestionDifficultyValue) {
  if (difficulty === 'hard') {
    return 'destructive'
  }

  if (difficulty === 'easy') {
    return 'secondary'
  }

  return 'outline'
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ''
  let insideQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    const nextCharacter = line[index + 1]

    if (character === '"' && insideQuotes && nextCharacter === '"') {
      current += '"'
      index += 1
      continue
    }

    if (character === '"') {
      insideQuotes = !insideQuotes
      continue
    }

    if (character === ',' && !insideQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += character
  }

  values.push(current.trim())
  return values
}

function getRecordValue(
  record: Record<string, string>,
  keys: string[],
) {
  for (const key of keys) {
    const normalizedKey = key.toLowerCase()

    if (normalizedKey in record && record[normalizedKey].trim().length > 0) {
      return record[normalizedKey].trim()
    }
  }

  return ''
}

function toOptionalNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toOptionalDifficulty(value: unknown): QuestionDifficultyValue | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim().toLowerCase()

  if (
    normalized === 'easy' ||
    normalized === 'medium' ||
    normalized === 'hard'
  ) {
    return normalized
  }

  return undefined
}

function extractOptionsFromRecord(record: Record<string, string>) {
  const joinedOptions = getRecordValue(record, ['options'])

  if (joinedOptions) {
    return joinedOptions
      .split('|')
      .map((option) => option.trim())
      .filter(Boolean)
  }

  const optionKeys = Object.keys(record)
    .filter((key) =>
      /^(option[a-f]|option[1-6])$/i.test(key),
    )
    .sort()

  return optionKeys
    .map((key) => record[key].trim())
    .filter(Boolean)
}

function normalizeUploadItem(
  item: Record<string, unknown>,
  rowNumber: number,
) {
  const question =
    typeof item.question === 'string' ? item.question.trim() : ''
  const explanation =
    typeof item.explanation === 'string' ? item.explanation.trim() : ''
  const answer = typeof item.answer === 'string' ? item.answer.trim() : ''
  const options = Array.isArray(item.options)
    ? item.options
        .map((option) => String(option).trim())
        .filter(Boolean)
    : typeof item.options === 'string'
      ? item.options
          .split('|')
          .map((option) => option.trim())
          .filter(Boolean)
      : []

  if (!question || !answer || !explanation || options.length < 2) {
    throw new Error(
      `Row ${rowNumber} is missing a question, explanation, answer, or enough options.`,
    )
  }

  return {
    question,
    options,
    answer,
    explanation,
    topicId: toOptionalNumber(item.topicId),
    difficulty: toOptionalDifficulty(item.difficulty),
    year: toOptionalNumber(item.year),
  }
}

function parseJsonUpload(text: string) {
  const payload = JSON.parse(text)

  if (!Array.isArray(payload)) {
    throw new Error('This file needs to contain a list of question items.')
  }

  return payload.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Row ${index + 1} is not a valid question object.`)
    }

    return normalizeUploadItem(
      item as Record<string, unknown>,
      index + 1,
    )
  })
}

function parseCsvUpload(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    throw new Error('This file needs a heading row and at least one question row.')
  }

  const headers = parseCsvLine(lines[0]).map((header) =>
    header.trim().toLowerCase(),
  )

  return lines.slice(1).map((line, rowIndex) => {
    const values = parseCsvLine(line)
    const record: Record<string, string> = {}

    headers.forEach((header, index) => {
      record[header] = values[index] ?? ''
    })

    const question = getRecordValue(record, ['question', 'question_text', 'text'])
    const explanation = getRecordValue(record, ['explanation'])
    const answer = getRecordValue(record, ['answer', 'correctanswer', 'correct_answer'])
    const options = extractOptionsFromRecord(record)

    if (!question || !answer || !explanation || options.length < 2) {
      throw new Error(
        `Row ${rowIndex + 2} is missing a question, explanation, answer, or enough options.`,
      )
    }

    return {
      question,
      options,
      answer,
      explanation,
      topicId: toOptionalNumber(
        getRecordValue(record, ['topicid', 'topic_id']),
      ),
      difficulty: toOptionalDifficulty(
        getRecordValue(record, ['difficulty']),
      ),
      year: toOptionalNumber(getRecordValue(record, ['year'])),
    }
  })
}

function PaginationControls({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4">
      <p className="text-base font-medium text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="default"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="min-w-[100px]"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="default"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="min-w-[100px]"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>
}

function SectionShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}

export function AdminDashboard() {
  const { toast } = useToast()
  const { isDark, toggleTheme } = useTheme()

  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const [adminKey, setAdminKey] = useState(DEFAULT_ADMIN_KEY)
  const [subjects, setSubjects] = useState<AdminSubject[]>([])
  const [topics, setTopics] = useState<AdminTopic[]>([])
  const [questions, setQuestions] = useState<AdminQuestion[]>([])
  const [pastPapers, setPastPapers] = useState<AdminPastPaper[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dataError, setDataError] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)

  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null)
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null)
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)

  const [subjectForm, setSubjectForm] = useState(createSubjectFormState)
  const [topicForm, setTopicForm] = useState(createTopicFormState)
  const [questionForm, setQuestionForm] = useState(createQuestionFormState)
  const [pastPaperForm, setPastPaperForm] = useState({
    form: '1' as '' | `${ManebFormValue}`,
    year: new Date().getFullYear().toString(),
    season: '',
    title: '',
    description: '',
  })

  const [subjectErrors, setSubjectErrors] = useState<Record<string, string>>({})
  const [topicErrors, setTopicErrors] = useState<Record<string, string>>({})
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({})
  const [pastPaperErrors, setPastPaperErrors] = useState<Record<string, string>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  const [subjectSearch, setSubjectSearch] = useState('')
  const [subjectFilterForm, setSubjectFilterForm] = useState<'all' | `${ManebFormValue}`>('all')
  const [topicSearch, setTopicSearch] = useState('')
  const [topicFilterForm, setTopicFilterForm] = useState<'all' | `${ManebFormValue}`>('all')
  const [topicFilterSubjectId, setTopicFilterSubjectId] = useState<'all' | string>('all')
  const [questionSearch, setQuestionSearch] = useState('')
  const [questionFilterForm, setQuestionFilterForm] = useState<'all' | `${ManebFormValue}`>('all')
  const [questionFilterSubjectId, setQuestionFilterSubjectId] = useState<'all' | string>('all')
  const [questionFilterTopicId, setQuestionFilterTopicId] = useState<'all' | string>('all')

  const [subjectPage, setSubjectPage] = useState(1)
  const [topicPage, setTopicPage] = useState(1)
  const [questionPage, setQuestionPage] = useState(1)
  const [pastPaperPage, setPastPaperPage] = useState(1)

  const [pastPaperSearch, setPastPaperSearch] = useState('')
  const [pastPaperFilterForm, setPastPaperFilterForm] = useState<'all' | `${ManebFormValue}`>('all')
  const [pastPaperFilterSubjectId, setPastPaperFilterSubjectId] = useState<'all' | string>('all')
  const [pastPaperFilterYear, setPastPaperFilterYear] = useState<'all' | string>('all')

  const [isSavingSubject, setIsSavingSubject] = useState(false)
  const [isSavingTopic, setIsSavingTopic] = useState(false)
  const [isSavingQuestion, setIsSavingQuestion] = useState(false)
  const [isSavingPastPaper, setIsSavingPastPaper] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [uploadForm, setUploadForm] = useState({
    form: '1' as '' | `${ManebFormValue}`,
    subjectId: '',
    topicId: '',
    year: '',
    fileName: '',
    items: [] as UploadPreviewItem[],
  })

  const deferredSubjectSearch = useDeferredValue(subjectSearch)
  const deferredTopicSearch = useDeferredValue(topicSearch)
  const deferredQuestionSearch = useDeferredValue(questionSearch)
  const deferredPastPaperSearch = useDeferredValue(pastPaperSearch)

  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem('maneb-admin-key')

    if (savedAdminKey) {
      setAdminKey(savedAdminKey)
    }
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem('maneb-admin-key', adminKey)
  }, [adminKey])

  useEffect(() => {
    void refreshAllData(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSubjectPage(1)
  }, [deferredSubjectSearch, subjectFilterForm])

  useEffect(() => {
    setTopicPage(1)
  }, [deferredTopicSearch, topicFilterForm, topicFilterSubjectId])

  useEffect(() => {
    setQuestionPage(1)
  }, [
    deferredQuestionSearch,
    questionFilterForm,
    questionFilterSubjectId,
    questionFilterTopicId,
  ])

  useEffect(() => {
    setPastPaperPage(1)
  }, [
    deferredPastPaperSearch,
    pastPaperFilterForm,
    pastPaperFilterSubjectId,
    pastPaperFilterYear,
  ])

  async function refreshAllData(showLoader = false) {
    if (showLoader) {
      setInitialLoading(true)
    } else {
      setIsRefreshing(true)
    }

    try {
      const [subjectsResponse, topicsResponse, questionsResponse, pastPapersResponse] =
        await Promise.all([
          fetchAdminSubjects(),
          fetchAdminTopics(),
          fetchAdminQuestions(),
          fetchAdminPastPapers(),
        ])

      setSubjects(subjectsResponse.data)
      setTopics(topicsResponse.data)
      setQuestions(questionsResponse.data)
      setPastPapers(pastPapersResponse.data)
      setLastSyncedAt(
        getLatestTimestamp([
          subjectsResponse.syncedAt,
          topicsResponse.syncedAt,
          questionsResponse.syncedAt,
          pastPapersResponse.syncedAt,
        ]),
      )
      setDataError(null)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load your content.'

      setDataError(message)
      toast({
        title: 'Error loading content',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setInitialLoading(false)
      setIsRefreshing(false)
    }
  }

  function resetSubjectForm() {
    setEditingSubjectId(null)
    setSubjectForm(createSubjectFormState())
    setSubjectErrors({})
  }

  function resetTopicForm() {
    setEditingTopicId(null)
    setTopicForm(createTopicFormState())
    setTopicErrors({})
  }

  function resetQuestionForm() {
    setEditingQuestionId(null)
    setQuestionForm(createQuestionFormState())
    setQuestionErrors({})
  }

  function validateSubjectForm() {
    const nextErrors: Record<string, string> = {}

    if (!subjectForm.name.trim()) {
      nextErrors.name = 'Subject name is required.'
    }

    if (!subjectForm.form) {
      nextErrors.form = 'Select a form.'
    }

    setSubjectErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function validateTopicForm() {
    const nextErrors: Record<string, string> = {}

    if (!topicForm.name.trim()) {
      nextErrors.name = 'Topic name is required.'
    }

    if (!topicForm.subjectId) {
      nextErrors.subjectId = 'Select a subject.'
    }

    setTopicErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function validateQuestionForm() {
    const nextErrors: Record<string, string> = {}
    const trimmedOptions = questionForm.options.map((option) => option.trim())

    if (!questionForm.form) {
      nextErrors.form = 'Select a form.'
    }

    if (!questionForm.subjectId) {
      nextErrors.subjectId = 'Select a subject.'
    }

    if (!questionForm.topicId) {
      nextErrors.topicId = 'Select a topic.'
    }

    if (questionForm.question.trim().length < 10) {
      nextErrors.question = 'Question text should be at least 10 characters.'
    }

    if (trimmedOptions.some((option) => option.length === 0)) {
      nextErrors.options = 'Every visible option needs text.'
    } else if (trimmedOptions.length < 2) {
      nextErrors.options = 'Add at least two options.'
    }

    if (questionForm.answerIndex === '') {
      nextErrors.answerIndex = 'Choose the correct answer.'
    }

    if (questionForm.explanation.trim().length < 4) {
      nextErrors.explanation = 'Add a short explanation.'
    }

    if (questionForm.year && Number.isNaN(Number(questionForm.year))) {
      nextErrors.year = 'Year must be numeric.'
    }

    setQuestionErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubjectSubmit() {
    if (!validateSubjectForm()) {
      return
    }

    setIsSavingSubject(true)

    try {
      const payload: CreateSubjectInput = {
        name: subjectForm.name.trim(),
        form: Number(subjectForm.form) as ManebFormValue,
      }

      if (editingSubjectId) {
        await updateAdminSubject(adminKey, editingSubjectId, payload)
      } else {
        await createAdminSubject(adminKey, payload)
      }

      await refreshAllData()
      resetSubjectForm()
      toast({
        title: 'Saved successfully',
        description: 'Subject details have been updated.',
      })
    } catch (error) {
      toast({
        title: 'Unable to save subject',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingSubject(false)
    }
  }

  async function handleTopicSubmit() {
    if (!validateTopicForm()) {
      return
    }

    setIsSavingTopic(true)

    try {
      const payload: CreateTopicInput = {
        name: topicForm.name.trim(),
        subjectId: Number(topicForm.subjectId),
      }

      if (editingTopicId) {
        await updateAdminTopic(adminKey, editingTopicId, payload)
      } else {
        await createAdminTopic(adminKey, payload)
      }

      await refreshAllData()
      resetTopicForm()
      toast({
        title: 'Saved successfully',
        description: 'Topic details have been updated.',
      })
    } catch (error) {
      toast({
        title: 'Unable to save topic',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingTopic(false)
    }
  }

  async function handleQuestionSubmit() {
    if (!validateQuestionForm()) {
      return
    }

    setIsSavingQuestion(true)

    try {
      const options = questionForm.options.map((option) => option.trim())
      const answer = options[Number(questionForm.answerIndex)]
      const payload: CreateQuestionInput = {
        topicId: Number(questionForm.topicId),
        question: questionForm.question.trim(),
        options,
        answer,
        explanation: questionForm.explanation.trim(),
        difficulty: questionForm.difficulty,
        year: questionForm.year ? Number(questionForm.year) : null,
      }

      if (editingQuestionId) {
        await updateAdminQuestion(adminKey, editingQuestionId, payload)
      } else {
        await createAdminQuestion(adminKey, payload)
      }

      await refreshAllData()
      resetQuestionForm()
      toast({
        title: 'Saved successfully',
        description: 'Question bank updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Unable to save question',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingQuestion(false)
    }
  }

  async function handleDeleteSubject(subject: AdminSubject) {
    const confirmed = window.confirm(
      `Delete ${subject.name} for Form ${subject.form}? Related topics and questions will also be removed.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteAdminSubject(adminKey, subject.id)
      await refreshAllData()
      if (editingSubjectId === subject.id) {
        resetSubjectForm()
      }
      toast({
        title: 'Saved successfully',
        description: 'Subject deleted.',
      })
    } catch (error) {
      toast({
        title: 'Unable to delete subject',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  async function handleDeleteTopic(topic: AdminTopic) {
    const confirmed = window.confirm(
      `Delete ${topic.name}? Related questions will also be removed.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteAdminTopic(adminKey, topic.id)
      await refreshAllData()
      if (editingTopicId === topic.id) {
        resetTopicForm()
      }
      toast({
        title: 'Saved successfully',
        description: 'Topic deleted.',
      })
    } catch (error) {
      toast({
        title: 'Unable to delete topic',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  async function handleDeleteQuestion(question: AdminQuestion) {
    const confirmed = window.confirm(
      'Delete this question from the bank?',
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteAdminQuestion(adminKey, question.id)
      await refreshAllData()
      if (editingQuestionId === question.id) {
        resetQuestionForm()
      }
      toast({
        title: 'Saved successfully',
        description: 'Question deleted.',
      })
    } catch (error) {
      toast({
        title: 'Unable to delete question',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  function startEditingSubject(subject: AdminSubject) {
    setActiveSection('subjects')
    setEditingSubjectId(subject.id)
    setSubjectForm({
      name: subject.name,
      form: String(subject.form) as `${ManebFormValue}`,
    })
    setSubjectErrors({})
  }

  function startEditingTopic(topic: AdminTopic) {
    setActiveSection('topics')
    setEditingTopicId(topic.id)
    setTopicForm({
      name: topic.name,
      subjectId: String(topic.subjectId),
    })
    setTopicErrors({})
  }

  function startEditingQuestion(question: AdminQuestion) {
    setActiveSection('questions')
    setEditingQuestionId(question.id)
    setQuestionForm({
      form: String(question.form) as `${ManebFormValue}`,
      subjectId: String(question.subjectId),
      topicId: String(question.topicId),
      question: question.question,
      options: question.options,
      answerIndex: String(
        Math.max(
          question.options.findIndex(
            (option) => option.toLowerCase() === question.answer.toLowerCase(),
          ),
          0,
        ),
      ),
      explanation: question.explanation,
      difficulty: question.difficulty,
      year: question.year ? String(question.year) : '',
    })
    setQuestionErrors({})
  }

  async function handleUploadFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const items = file.name.toLowerCase().endsWith('.json')
        ? parseJsonUpload(text)
        : parseCsvUpload(text)

      setUploadForm((current) => ({
        ...current,
        fileName: file.name,
        items,
      }))
      setUploadErrors({})
      toast({
        title: 'Upload ready',
        description: `${items.length} questions parsed successfully.`,
      })
    } catch (error) {
      setUploadForm((current) => ({
        ...current,
        fileName: file.name,
        items: [],
      }))
      toast({
        title: 'Error uploading',
        description:
          error instanceof Error ? error.message : 'The file could not be parsed.',
        variant: 'destructive',
      })
    } finally {
      event.target.value = ''
    }
  }

  async function handleBulkUpload() {
    const nextErrors: Record<string, string> = {}

    if (uploadForm.items.length === 0) {
      nextErrors.file = 'Upload a question file first.'
    }

    if (
      uploadForm.items.some((item) => item.topicId === null) &&
      !uploadForm.topicId
    ) {
      nextErrors.topicId =
        'Choose a fallback topic when rows do not include topicId values.'
    }

    setUploadErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsUploading(true)

    try {
      const fallbackTopicId = Number(uploadForm.topicId)
      const fallbackYear = uploadForm.year ? Number(uploadForm.year) : null
      const payload: CreateQuestionInput[] = uploadForm.items.map((item) => ({
        topicId: item.topicId ?? fallbackTopicId,
        question: item.question,
        options: item.options,
        answer: item.answer,
        explanation: item.explanation,
        difficulty: item.difficulty ?? 'medium',
        year: item.year ?? fallbackYear,
      }))

      const response = await bulkUploadAdminQuestions(adminKey, payload)

      await refreshAllData()
      setUploadForm({
        form: '1',
        subjectId: '',
        topicId: '',
        year: '',
        fileName: '',
        items: [],
      })
      setUploadErrors({})
      toast({
        title: 'Saved successfully',
        description: `${response.count} questions imported successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error uploading',
        description:
          error instanceof Error ? error.message : 'The upload failed.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const currentSection = SECTION_ITEMS.find(
    (section) => section.id === activeSection,
  )!

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch = subject.name
      .toLowerCase()
      .includes(deferredSubjectSearch.trim().toLowerCase())
    const matchesForm =
      subjectFilterForm === 'all' || String(subject.form) === subjectFilterForm

    return matchesSearch && matchesForm
  })

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(deferredTopicSearch.trim().toLowerCase()) ||
      topic.subject.name
        .toLowerCase()
        .includes(deferredTopicSearch.trim().toLowerCase())
    const matchesForm =
      topicFilterForm === 'all' ||
      String(topic.subject.form) === topicFilterForm
    const matchesSubject =
      topicFilterSubjectId === 'all' ||
      String(topic.subjectId) === topicFilterSubjectId

    return matchesSearch && matchesForm && matchesSubject
  })

  const filteredQuestions = questions.filter((question) => {
    const search = deferredQuestionSearch.trim().toLowerCase()
    const matchesSearch =
      search.length === 0 ||
      question.question.toLowerCase().includes(search) ||
      question.topic.toLowerCase().includes(search) ||
      question.subject.toLowerCase().includes(search) ||
      question.explanation.toLowerCase().includes(search)
    const matchesForm =
      questionFilterForm === 'all' ||
      String(question.form) === questionFilterForm
    const matchesSubject =
      questionFilterSubjectId === 'all' ||
      String(question.subjectId) === questionFilterSubjectId
    const matchesTopic =
      questionFilterTopicId === 'all' ||
      String(question.topicId) === questionFilterTopicId

    return matchesSearch && matchesForm && matchesSubject && matchesTopic
  })

  const filteredPastPapers = questions.filter((question) => {
    if (!question.year) return false
    
    const search = deferredPastPaperSearch.trim().toLowerCase()
    const matchesSearch =
      search.length === 0 ||
      question.question.toLowerCase().includes(search) ||
      question.topic.toLowerCase().includes(search) ||
      question.subject.toLowerCase().includes(search) ||
      question.explanation.toLowerCase().includes(search)
    const matchesForm =
      pastPaperFilterForm === 'all' ||
      String(question.form) === pastPaperFilterForm
    const matchesSubject =
      pastPaperFilterSubjectId === 'all' ||
      String(question.subjectId) === pastPaperFilterSubjectId
    const matchesYear =
      pastPaperFilterYear === 'all' ||
      String(question.year) === pastPaperFilterYear

    return matchesSearch && matchesForm && matchesSubject && matchesYear
  })

  const subjectPagination = paginate(filteredSubjects, subjectPage, 6)
  const topicPagination = paginate(filteredTopics, topicPage, 6)
  const questionPagination = paginate(filteredQuestions, questionPage, 8)
  const pastPaperPagination = paginate(filteredPastPapers, pastPaperPage, 8)

  const questionSubjects = subjects.filter(
    (subject) =>
      !questionForm.form || String(subject.form) === questionForm.form,
  )
  const questionTopics = topics.filter(
    (topic) => String(topic.subjectId) === questionForm.subjectId,
  )

  const topicSubjects = subjects.filter(
    (subject) =>
      topicFilterForm === 'all' || String(subject.form) === topicFilterForm,
  )
  const uploadSubjects = subjects.filter(
    (subject) =>
      !uploadForm.form || String(subject.form) === uploadForm.form,
  )
  const uploadTopics = topics.filter(
    (topic) => String(topic.subjectId) === uploadForm.subjectId,
  )
  const questionFilterSubjects = subjects.filter(
    (subject) =>
      questionFilterForm === 'all' ||
      String(subject.form) === questionFilterForm,
  )
  const questionFilterTopics = topics.filter(
    (topic) => {
      if (questionFilterSubjectId !== 'all') {
        return String(topic.subjectId) === questionFilterSubjectId
      }

      if (questionFilterForm !== 'all') {
        return String(topic.subject.form) === questionFilterForm
      }

      return true
    },
  )

  const pastPaperFilterSubjects = subjects.filter(
    (subject) =>
      pastPaperFilterForm === 'all' ||
      String(subject.form) === pastPaperFilterForm,
  )
  const pastPaperFilterTopics = topics.filter(
    (topic) => {
      if (pastPaperFilterSubjectId !== 'all') {
        return String(topic.subjectId) === pastPaperFilterSubjectId
      }

      if (pastPaperFilterForm !== 'all') {
        return String(topic.subject.form) === pastPaperFilterForm
      }

      return true
    },
  )
  const availablePastPaperYears = Array.from(
    new Set(
      questions
        .filter((q) => q.year)
        .map((q) => String(q.year))
        .sort((a, b) => Number(b) - Number(a)),
    ),
  )

  const recentUploads = [
    ...subjects.map((subject) => ({
      id: `subject-${subject.id}`,
      label: `${subject.name} added to Form ${subject.form}`,
      answer: undefined as string | undefined,
      kind: 'Subject',
      updatedAt: subject.updatedAt,
    })),
    ...topics.map((topic) => ({
      id: `topic-${topic.id}`,
      label: `${topic.name} in ${topic.subject.name}`,
      answer: undefined as string | undefined,
      kind: 'Topic',
      updatedAt: topic.updatedAt,
    })),
    ...questions.map((question) => ({
      id: `question-${question.id}`,
      label: question.question,
      answer: question.answer as string | undefined,
      kind: 'Question',
      updatedAt: question.updatedAt,
    })),
  ]
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    )
    .slice(0, 6)

  const recentUploadCount = recentUploads.filter(
    (item) =>
      Date.now() - new Date(item.updatedAt).getTime() <
      1000 * 60 * 60 * 24 * 7,
  ).length

  function renderDashboard() {
    return (
      <SectionShell
        title="Content Overview"
        description="See your study content in one clear place."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Subjects',
              value: subjects.length,
              color: 'from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950',
              textColor: 'text-blue-600 dark:text-blue-400',
            },
            {
              label: 'Topics',
              value: topics.length,
              color: 'from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950',
              textColor: 'text-purple-600 dark:text-purple-400',
            },
            {
              label: 'Questions',
              value: questions.length,
              color: 'from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950',
              textColor: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: 'This Week',
              value: recentUploadCount,
              color: 'from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950',
              textColor: 'text-amber-600 dark:text-amber-400',
            },
          ].map((item) => (
            <Card
              key={item.label}
              className={`relative overflow-hidden border-0 rounded-2xl bg-gradient-to-br ${item.color} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-sm font-medium text-foreground/60">
                  {item.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-4xl font-semibold ${item.textColor}`}>
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mt-8">
          <Card className="lg:col-span-2 rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Latest changes this week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentUploads.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No activity yet.
                </p>
              )}
              {recentUploads.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-background/50 p-3 hover:bg-background/70 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={item.kind === 'Question' ? 'default' : 'secondary'} className={item.kind === 'Question' ? 'bg-emerald-500 hover:bg-emerald-600 text-white text-xs' : 'text-xs'}>{
                        item.kind === 'Subject' ? '📚' :
                        item.kind === 'Topic' ? '📖' : '❓'
                      } {item.kind}</Badge>
                    </div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {item.label}
                    </p>
                    {item.answer && (
                      <div className="mt-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-2 inline-block">
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          <span className="font-bold">Answer:</span> {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(item.updatedAt)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Forms covered</span>
                  <span className="text-sm font-semibold">4</span>
                </div>
                <div className="w-full bg-border/30 rounded-full h-2">
                  <div className="bg-primary rounded-full h-2 w-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg questions</span>
                  <span className="text-sm font-semibold">
                    {topics.length > 0 ? Math.round(questions.length / topics.length) : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    )
  }

  function renderSubjects() {
    return (
      <SectionShell
        title="Manage Subjects"
        description="Create class subjects for each form, then use them as the backbone for topics and questions."
      >
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr]">
          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <CardHeader>
              <CardTitle>
                {editingSubjectId ? 'Edit subject' : 'Add subject'}
              </CardTitle>
              <CardDescription>
                Create subjects for each class form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject-name">Subject name</Label>
                <Input
                  id="subject-name"
                  placeholder="Mathematics"
                  value={subjectForm.name}
                  onChange={(event) =>
                    setSubjectForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
                <FieldError message={subjectErrors.name} />
              </div>

              <div className="space-y-2">
                <Label>Class / Form</Label>
                <Select
                  value={subjectForm.form}
                  onValueChange={(value) =>
                    setSubjectForm((current) => ({
                      ...current,
                      form: value as `${ManebFormValue}`,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORM_OPTIONS.map((form) => (
                      <SelectItem key={form} value={String(form)}>
                        Form {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={subjectErrors.form} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => void handleSubjectSubmit()} disabled={isSavingSubject}>
                  {isSavingSubject && <Spinner />}
                  {editingSubjectId ? 'Update subject' : 'Add subject'}
                </Button>
                {editingSubjectId && (
                  <Button variant="outline" onClick={resetSubjectForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <CardTitle>Subjects list</CardTitle>
                  <CardDescription>
                    Search and filter existing subjects.
                  </CardDescription>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Search subjects"
                    value={subjectSearch}
                    onChange={(event) => setSubjectSearch(event.target.value)}
                  />
                  <Select
                    value={subjectFilterForm}
                    onValueChange={(value) =>
                      setSubjectFilterForm(value as 'all' | `${ManebFormValue}`)
                    }
                  >
                    <SelectTrigger className="w-full md:min-w-36">
                      <SelectValue placeholder="Filter form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All forms</SelectItem>
                      {FORM_OPTIONS.map((form) => (
                        <SelectItem key={form} value={String(form)}>
                          Form {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto w-full min-w-0">\n              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Form</TableHead>
                    <TableHead className="hidden md:table-cell">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectPagination.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        No subjects match your filters yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {subjectPagination.items.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{subject.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            Updated {formatDateTime(subject.updatedAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>Form {subject.form}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDateTime(subject.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingSubject(subject)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void handleDeleteSubject(subject)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>\n              </div>
              <PaginationControls
                page={subjectPagination.page}
                totalPages={subjectPagination.totalPages}
                onChange={setSubjectPage}
              />
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    )
  }

  function renderTopics() {
    return (
      <SectionShell
        title="Manage Topics"
        description="Create and organize course topics."
      >
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <CardHeader>
              <CardTitle>{editingTopicId ? 'Edit topic' : 'Add topic'}</CardTitle>
              <CardDescription>
                Organize topics within subjects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic-name">Topic name</Label>
                <Input
                  id="topic-name"
                  placeholder="Algebra"
                  value={topicForm.name}
                  onChange={(event) =>
                    setTopicForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
                <FieldError message={topicErrors.name} />
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={topicForm.subjectId}
                  onValueChange={(value) =>
                    setTopicForm((current) => ({
                      ...current,
                      subjectId: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={String(subject.id)}>
                        {subject.name} • Form {subject.form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={topicErrors.subjectId} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => void handleTopicSubmit()} disabled={isSavingTopic}>
                  {isSavingTopic && <Spinner />}
                  {editingTopicId ? 'Update topic' : 'Add topic'}
                </Button>
                {editingTopicId && (
                  <Button variant="outline" onClick={resetTopicForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
                <div>
                  <CardTitle>Topics list</CardTitle>
                  <CardDescription>
                    Search and filter topics easily.
                  </CardDescription>
                </div>
                <div className="grid gap-3 lg:grid-cols-3">
                  <Input
                    placeholder="Search topics"
                    value={topicSearch}
                    onChange={(event) => setTopicSearch(event.target.value)}
                  />
                  <Select
                    value={topicFilterForm}
                    onValueChange={(value) => {
                      setTopicFilterForm(value as 'all' | `${ManebFormValue}`)
                      setTopicFilterSubjectId('all')
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All forms</SelectItem>
                      {FORM_OPTIONS.map((form) => (
                        <SelectItem key={form} value={String(form)}>
                          Form {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={topicFilterSubjectId}
                    onValueChange={(value) => setTopicFilterSubjectId(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All subjects</SelectItem>
                      {topicSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={String(subject.id)}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto w-full min-w-0">\n              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="hidden md:table-cell">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topicPagination.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        No topics match your filters yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {topicPagination.items.map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{topic.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            Updated {formatDateTime(topic.updatedAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{topic.subject.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Form {topic.subject.form}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDateTime(topic.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingTopic(topic)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void handleDeleteTopic(topic)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>\n              </div>
              <PaginationControls
                page={topicPagination.page}
                totalPages={topicPagination.totalPages}
                onChange={setTopicPage}
              />
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    )
  }

  function renderQuestions() {
    return (
      <SectionShell
        title="Manage Questions"
        description="Build and manage your question library."
      >
        <div className="grid gap-4 xl:grid-cols-[1fr_1.3fr]">
          <Card className="rounded-[28px] border-border/60 bg-card/85 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] min-w-0">
            <CardHeader>
              <CardTitle>
                {editingQuestionId ? 'Edit question' : 'Add question'}
              </CardTitle>
              <CardDescription>
                Large fields and structured choices make it easier for non-technical admins to publish content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Form</Label>
                  <Select
                    value={questionForm.form}
                    onValueChange={(value) =>
                      setQuestionForm((current) => ({
                        ...current,
                        form: value as `${ManebFormValue}`,
                        subjectId: '',
                        topicId: '',
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Form" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORM_OPTIONS.map((form) => (
                        <SelectItem key={form} value={String(form)}>
                          Form {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={questionErrors.form} />
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={questionForm.subjectId}
                    onValueChange={(value) =>
                      setQuestionForm((current) => ({
                        ...current,
                        subjectId: value,
                        topicId: '',
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={String(subject.id)}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={questionErrors.subjectId} />
                </div>

                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select
                    value={questionForm.topicId}
                    onValueChange={(value) =>
                      setQuestionForm((current) => ({
                        ...current,
                        topicId: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTopics.map((topic) => (
                        <SelectItem key={topic.id} value={String(topic.id)}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={questionErrors.topicId} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-text">Question text</Label>
                <Textarea
                  id="question-text"
                  className="min-h-28"
                  placeholder="Enter the full exam question"
                  value={questionForm.question}
                  onChange={(event) =>
                    setQuestionForm((current) => ({
                      ...current,
                      question: event.target.value,
                    }))
                  }
                />
                <FieldError message={questionErrors.question} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Multiple choice options</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setQuestionForm((current) => ({
                          ...current,
                          options:
                            current.options.length >= 6
                              ? current.options
                              : [...current.options, ''],
                        }))
                      }
                      disabled={questionForm.options.length >= 6}
                    >
                      Add option
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setQuestionForm((current) => {
                          if (current.options.length <= 2) {
                            return current
                          }

                          const nextOptions = current.options.slice(0, -1)
                          const nextAnswerIndex =
                            current.answerIndex !== '' &&
                            Number(current.answerIndex) >= nextOptions.length
                              ? ''
                              : current.answerIndex

                          return {
                            ...current,
                            options: nextOptions,
                            answerIndex: nextAnswerIndex,
                          }
                        })
                      }
                      disabled={questionForm.options.length <= 2}
                    >
                      Remove option
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`option-${index}`}>
                        Option {String.fromCharCode(65 + index)}
                      </Label>
                      <Input
                        id={`option-${index}`}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        value={option}
                        onChange={(event) =>
                          setQuestionForm((current) => ({
                            ...current,
                            options: current.options.map((item, optionIndex) =>
                              optionIndex === index ? event.target.value : item,
                            ),
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
                <FieldError message={questionErrors.options} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Correct answer</Label>
                  <Select
                    value={questionForm.answerIndex}
                    onValueChange={(value) =>
                      setQuestionForm((current) => ({
                        ...current,
                        answerIndex: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionForm.options.map((option, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {String.fromCharCode(65 + index)} • {option || 'Untitled option'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={questionErrors.answerIndex} />
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={questionForm.difficulty}
                    onValueChange={(value) =>
                      setQuestionForm((current) => ({
                        ...current,
                        difficulty: value as QuestionDifficultyValue,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_OPTIONS.map((difficulty) => (
                        <SelectItem key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question-year">Year (optional)</Label>
                  <Input
                    id="question-year"
                    placeholder="2024"
                    value={questionForm.year}
                    onChange={(event) =>
                      setQuestionForm((current) => ({
                        ...current,
                        year: event.target.value,
                      }))
                    }
                  />
                  <FieldError message={questionErrors.year} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-explanation">Explanation</Label>
                <Textarea
                  id="question-explanation"
                  className="min-h-24"
                  placeholder="Explain why the correct answer is right"
                  value={questionForm.explanation}
                  onChange={(event) =>
                    setQuestionForm((current) => ({
                      ...current,
                      explanation: event.target.value,
                    }))
                  }
                />
                <FieldError message={questionErrors.explanation} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => void handleQuestionSubmit()}
                  disabled={isSavingQuestion}
                >
                  {isSavingQuestion && <Spinner />}
                  {editingQuestionId ? 'Update question' : 'Add question'}
                </Button>
                {editingQuestionId && (
                  <Button variant="outline" onClick={resetQuestionForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-border/60 bg-card/85 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] min-w-0">
            <CardHeader className="gap-4">
              <div className="space-y-4">
                <div>
                  <CardTitle>Question bank</CardTitle>
                  <CardDescription>
                    Search, filter by form or subject, and paginate through the content library.
                  </CardDescription>
                </div>
                <div className="grid gap-3 xl:grid-cols-4">
                  <Input
                    placeholder="Search questions"
                    value={questionSearch}
                    onChange={(event) => setQuestionSearch(event.target.value)}
                  />
                  <Select
                    value={questionFilterForm}
                    onValueChange={(value) => {
                      setQuestionFilterForm(value as 'all' | `${ManebFormValue}`)
                      setQuestionFilterSubjectId('all')
                      setQuestionFilterTopicId('all')
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All forms</SelectItem>
                      {FORM_OPTIONS.map((form) => (
                        <SelectItem key={form} value={String(form)}>
                          Form {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={questionFilterSubjectId}
                    onValueChange={(value) => {
                      setQuestionFilterSubjectId(value)
                      setQuestionFilterTopicId('all')
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All subjects</SelectItem>
                      {questionFilterSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={String(subject.id)}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={questionFilterTopicId}
                    onValueChange={(value) => setQuestionFilterTopicId(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All topics</SelectItem>
                      {questionFilterTopics.map((topic) => (
                        <SelectItem key={topic.id} value={String(topic.id)}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto w-full min-w-0">\n              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead className="hidden lg:table-cell">Topic</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead className="hidden md:table-cell">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionPagination.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        No questions match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {questionPagination.items.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-md align-top">
                        <div className="space-y-2">
                          <p className="line-clamp-2 text-base font-semibold text-gray-900 dark:text-white">
                            {question.question}
                          </p>
                          <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-2 mt-2 inline-block">
                            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                              <span className="font-bold">Answer:</span> {question.answer}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                            <span>{question.subject}</span>
                            <span>Form {question.form}</span>
                            <span>{question.options.length} options</span>
                          </div>
                          <p className="text-xs text-muted-foreground lg:hidden">
                            {question.topic}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {question.topic}
                      </TableCell>
                      <TableCell>
                        <Badge variant={difficultyBadgeVariant(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDateTime(question.updatedAt)}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingQuestion(question)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void handleDeleteQuestion(question)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>\n              </div>
              <PaginationControls
                page={questionPagination.page}
                totalPages={questionPagination.totalPages}
                onChange={setQuestionPage}
              />
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    )
  }

  function renderPastPapers() {
    const filteredPastPapers = (pastPapers || [])
      .filter((paper) => {
        if (pastPaperFilterForm !== 'all') {
          if (String(paper.form) !== pastPaperFilterForm) return false
        }
        if (pastPaperFilterYear !== 'all') {
          if (String(paper.year) !== pastPaperFilterYear) return false
        }
        if (deferredPastPaperSearch.trim()) {
          const searchTerm = deferredPastPaperSearch.toLowerCase()
          return paper.title.toLowerCase().includes(searchTerm)
        }
        return true
      })

    const pastPaperPagination = paginate(filteredPastPapers, pastPaperPage, 10)
    const availablePastPaperYears = Array.from(
      new Set((pastPapers || []).map((p) => String(p.year)).sort((a, b) => Number(b) - Number(a))),
    )

    const handleCreatePastPaper = async () => {
      const errors: Record<string, string> = {}

      if (!pastPaperForm.title.trim()) errors.title = 'Title is required'
      if (!pastPaperForm.form) errors.form = 'Form is required'
      if (!pastPaperForm.year) errors.year = 'Year is required'

      if (Object.keys(errors).length > 0) {
        setPastPaperErrors(errors)
        return
      }

      setIsSavingPastPaper(true)
      try {
        await createAdminPastPaper(adminKey, {
          form: Number(pastPaperForm.form) as ManebFormValue,
          year: parseInt(pastPaperForm.year, 10),
          season: pastPaperForm.season || undefined,
          title: pastPaperForm.title,
          description: pastPaperForm.description || undefined,
          questionIds: [],
        })

        toast({
          title: 'Past paper created',
          description: pastPaperForm.title,
        })

        setPastPaperForm({
          form: '1',
          year: new Date().getFullYear().toString(),
          season: '',
          title: '',
          description: '',
        })
        setPastPaperErrors({})
        await refreshAllData()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to create past paper'
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setIsSavingPastPaper(false)
      }
    }

    const handleDeletePastPaper = async (paper: AdminPastPaper) => {
      if (
        !confirm(
          `Delete "${paper.title}" (${paper.year} - Form ${paper.form})?`,
        )
      ) {
        return
      }

      try {
        await deleteAdminPastPaper(adminKey, paper.id)
        toast({
          title: 'Past paper deleted',
          description: paper.title,
        })
        await refreshAllData()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete past paper'
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
      }
    }

    return (
      <SectionShell
        title="Manage Past Papers"
        description="Create and organize past exam papers by year and form."
      >
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
          <Card className="rounded-[28px] border-border/60 bg-card/85 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] min-w-0">
            <CardHeader>
              <CardTitle>Add past paper</CardTitle>
              <CardDescription>Create a new past exam paper record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Form</Label>
                <Select
                  value={pastPaperForm.form}
                  onValueChange={(value) =>
                    setPastPaperForm((current) => ({
                      ...current,
                      form: value as '' | `${ManebFormValue}`,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORM_OPTIONS.map((form) => (
                      <SelectItem key={form} value={String(form)}>
                        Form {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={pastPaperErrors.form} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp-year">Exam year</Label>
                <Input
                  id="pp-year"
                  type="number"
                  placeholder="e.g., 2025"
                  min="1900"
                  max="2100"
                  value={pastPaperForm.year}
                  onChange={(event) =>
                    setPastPaperForm((current) => ({
                      ...current,
                      year: event.target.value,
                    }))
                  }
                />
                <FieldError message={pastPaperErrors.year} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp-season">Season (optional)</Label>
                <Input
                  id="pp-season"
                  placeholder="e.g., June, November"
                  value={pastPaperForm.season}
                  onChange={(event) =>
                    setPastPaperForm((current) => ({
                      ...current,
                      season: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp-title">Title</Label>
                <Input
                  id="pp-title"
                  placeholder="e.g., June 2025 Form 4 Examination"
                  value={pastPaperForm.title}
                  onChange={(event) =>
                    setPastPaperForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
                <FieldError message={pastPaperErrors.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pp-description">Description (optional)</Label>
                <Textarea
                  id="pp-description"
                  placeholder="Add notes or context about this past paper"
                  rows={3}
                  value={pastPaperForm.description}
                  onChange={(event) =>
                    setPastPaperForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </div>

              <Button
                onClick={() => void handleCreatePastPaper()}
                disabled={isSavingPastPaper}
                className="w-full"
              >
                {isSavingPastPaper && <Spinner />}
                Create Past Paper
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-border/60 bg-card/85 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] min-w-0">
            <CardHeader className="gap-4">
              <div>
                <CardTitle>Past papers list</CardTitle>
                <CardDescription>View and manage all past papers</CardDescription>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Search past papers"
                  value={pastPaperSearch}
                  onChange={(event) => setPastPaperSearch(event.target.value)}
                />
                <Select
                  value={pastPaperFilterForm}
                  onValueChange={(value) => {
                    setPastPaperFilterForm(value as 'all' | `${ManebFormValue}`)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All forms</SelectItem>
                    {FORM_OPTIONS.map((form) => (
                      <SelectItem key={form} value={String(form)}>
                        Form {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={pastPaperFilterYear}
                  onValueChange={(value) => setPastPaperFilterYear(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    {availablePastPaperYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto w-full min-w-0">\n              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Year</TableHead>
                    <TableHead className="hidden md:table-cell">Form</TableHead>
                    <TableHead className="hidden lg:table-cell">Season</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastPaperPagination.items.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No past papers yet
                      </TableCell>
                    </TableRow>
                  )}
                  {pastPaperPagination.items.map((paper) => (
                    <TableRow key={paper.id}>
                      <TableCell className="max-w-md align-top">
                        <div className="space-y-1">
                          <p className="line-clamp-2 font-medium text-foreground">
                            {paper.title}
                          </p>
                          {paper.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {paper.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{paper.year}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">Form {paper.form}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {paper.season || '—'}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void handleDeletePastPaper(paper)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>\n              </div>
              <PaginationControls
                page={pastPaperPagination.page}
                totalPages={pastPaperPagination.totalPages}
                onChange={setPastPaperPage}
              />
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    )
  }

  function renderUpload() {
    return (
      <SectionShell
        title="Upload Questions"
        description="Import many questions from one file."
      >
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
          <Card className="rounded-[28px] border-border/60 bg-card/85 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] min-w-0">
            <CardHeader>
              <CardTitle>Choose file</CardTitle>
              <CardDescription>
                Use a question file. You can upload
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">.json</code>
                or
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">.csv</code>
                files. CSV supports either an
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">options</code>
                column separated by
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">|</code>
                or separate columns like
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">optionA</code>,
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">optionB</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default form</Label>
                <Select
                  value={uploadForm.form}
                  onValueChange={(value) =>
                    setUploadForm((current) => ({
                      ...current,
                      form: value as `${ManebFormValue}`,
                      subjectId: '',
                      topicId: '',
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORM_OPTIONS.map((form) => (
                      <SelectItem key={form} value={String(form)}>
                        Form {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default subject</Label>
                <Select
                  value={uploadForm.subjectId}
                  onValueChange={(value) =>
                    setUploadForm((current) => ({
                      ...current,
                      subjectId: value,
                      topicId: '',
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploadSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={String(subject.id)}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default topic</Label>
                <Select
                  value={uploadForm.topicId}
                  onValueChange={(value) =>
                    setUploadForm((current) => ({
                      ...current,
                      topicId: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploadTopics.map((topic) => (
                      <SelectItem key={topic.id} value={String(topic.id)}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={uploadErrors.topicId} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-upload-year">Default exam year (optional)</Label>
                <Input
                  id="bulk-upload-year"
                  type="number"
                  placeholder="e.g., 2025"
                  min="1900"
                  max="2100"
                  value={uploadForm.year}
                  onChange={(event) =>
                    setUploadForm((current) => ({
                      ...current,
                      year: event.target.value,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Use this year when a question does not include one.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-file">Question file</Label>
                <Input
                  id="bulk-file"
                  type="file"
                  accept=".json,.csv,application/json,text/csv"
                  onChange={(event) => void handleUploadFileChange(event)}
                />
                <FieldError message={uploadErrors.file} />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Example file</p>
                <pre className="mt-3 overflow-x-auto text-xs leading-6 text-muted-foreground">
{`[
  {
    "question": "...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "A",
    "explanation": "...",
    "topicId": 12,
    "year": 2025,
    "difficulty": "medium"
  }
]`}
                </pre>
              </div>

              <Button onClick={() => void handleBulkUpload()} disabled={isUploading}>
                {isUploading && <Spinner />}
                Import questions
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-border/60 bg-card/85 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)] min-w-0">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Check the rows before saving them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    File
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {uploadForm.fileName || 'No file selected'}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Questions
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {uploadForm.items.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Need topic
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {uploadForm.items.filter((item) => item.topicId === null).length}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    With year
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {uploadForm.items.filter((item) => item.year !== null && item.year !== undefined).length}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Default Year
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {uploadForm.year || 'None set'}
                  </p>
                </div>
              </div>

              {uploadForm.items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border/70 bg-background/50 px-6 py-12 text-center">
                  <FileSpreadsheet className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Upload a file to preview parsed questions.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Both file types work here.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {uploadForm.items.slice(0, 5).map((item, index) => (
                  <div
                    key={`${item.question}-${index}`}
                    className="rounded-2xl border border-border/60 bg-background/70 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Row {index + 1}</Badge>
                      <Badge variant="outline">
                        Topic {(item.topicId ?? uploadForm.topicId) || 'needs default'}
                      </Badge>
                      <Badge variant="outline">
                        {item.difficulty ?? 'medium'}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-6 text-foreground">
                      {item.question}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Answer: {item.answer}
                    </p>
                  </div>
                ))}
              </div>

              {uploadForm.items.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  Showing the first 5 rows. The whole file will still be imported.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    )
  }

  function renderSettings() {
    return (
      <SectionShell
        title="Settings"
        description="Manage your access and preferences."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl border-0 shadow-sm min-w-0">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Keep your access key ready when you need to make changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-key">Access Key</Label>
                <Input
                  id="admin-key"
                  type="password"
                  value={adminKey}
                  onChange={(event) => setAdminKey(event.target.value)}
                  placeholder="Enter your access key"
                />
              </div>

              <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 p-3 text-sm">
                <p className="font-medium text-amber-900 dark:text-amber-200">Access required</p>
                <p className="mt-1 text-amber-800/80 dark:text-amber-300/80 leading-5">
                  You need this key before you can add, change, or remove content.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdminKey(DEFAULT_ADMIN_KEY)
                    toast({
                      title: 'Key reset',
                      description: 'Your access key is back to the default value.',
                    })
                  }}
                >
                  Reset access key
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void refreshAllData()}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? <Spinner className="mr-2" /> : <RefreshCw className="mr-2 size-4" />}
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm min-w-0">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>
                See whether content loaded and when it was last updated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border/40 bg-background/50 p-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Content status</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`size-2.5 rounded-full ${dataError ? 'bg-destructive' : 'bg-emerald-500'}`} />
                  <p className="text-sm font-medium text-foreground">
                    {dataError ? 'Needs attention' : 'Ready'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/40 bg-background/50 p-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last updated</p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {lastSyncedAt ? formatDateTime(lastSyncedAt) : 'Never'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    )
  }

  function renderActiveSection() {
    if (initialLoading) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Spinner className="size-6" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">
                Loading your content
              </p>
              <p className="text-sm text-muted-foreground">
                Getting subjects, topics, questions, and paper details ready.
              </p>
            </div>
          </div>
        </div>
      )
    }

    if (activeSection === 'subjects') {
      return renderSubjects()
    }

    if (activeSection === 'topics') {
      return renderTopics()
    }

    if (activeSection === 'questions') {
      return renderQuestions()
    }

    if (activeSection === 'pastPapers') {
      return renderPastPapers()
    }

    if (activeSection === 'upload') {
      return renderUpload()
    }

    if (activeSection === 'settings') {
      return renderSettings()
    }

    return renderDashboard()
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Database className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">MANEB Prep</p>
                <p className="truncate text-xs text-muted-foreground">
                  Study Content
                </p>
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 pb-3">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SECTION_ITEMS.map((section) => {
                  const Icon = section.icon

                  return (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton
                        isActive={activeSection === section.id}
                        tooltip={section.label}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <Icon />
                        <span>{section.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter className="p-4">
          <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/40 p-3 text-center">
            <p className="text-xs font-medium text-sidebar-foreground">
              Editor v1
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <header className="sticky top-0 z-30 border-b border-border/40 bg-background/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="size-8 rounded-lg border border-border/40 bg-background hover:bg-muted" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {currentSection.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentSection.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void refreshAllData()}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? <Spinner className="size-4" /> : <RefreshCw className="size-4" />}
                  <span className="hidden sm:inline ml-2">Refresh</span>
                </Button>
              </div>
            </div>

            {dataError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {dataError}
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
          {renderActiveSection()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
