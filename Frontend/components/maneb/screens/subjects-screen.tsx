"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Download,
} from "lucide-react"
import { TopicCard } from "../topic-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { FormLevel } from "@/lib/user-data"

interface Topic {
  id: number
  title: string
  questionsCount: number
  isCompleted: boolean
  progress: number
}

interface Subject {
  id: number
  name: string
  icon: LucideIcon
  color: string
  image: string
  isOffline: boolean
  topics: Topic[]
  questionCount: number
  progress: number
}

interface SubjectsScreenProps {
  subjects: Subject[]
  onSubjectSelect?: (subjectId: number) => void
  onTopicSelect?: (subjectId: number, topicId: number) => void
  userForm?: FormLevel
}

export function SubjectsScreen({
  subjects,
  onSubjectSelect,
  onTopicSelect,
  userForm = "Form 4",
}: SubjectsScreenProps) {
  const [expandedSubject, setExpandedSubject] = useState<number | null>(
    subjects[0]?.id ?? null,
  )

  const toggleSubject = (id: number) => {
    setExpandedSubject(expandedSubject === id ? null : id)
  }

  return (
    <div className="p-4 pb-24 space-y-4 max-w-lg mx-auto">
      <section className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{userForm} Subjects</h2>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {subjects.length} subjects
          </span>
        </div>
      </section>

      {subjects.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-5 text-sm text-muted-foreground">
          No subjects are available from the backend for {userForm} yet.
        </div>
      )}

      {subjects.map((subject) => {
        const Icon = subject.icon
        const isExpanded = expandedSubject === subject.id

        return (
          <div
            key={subject.id}
            className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
          >
            <button
              onClick={() => toggleSubject(subject.id)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    fill
                    className="object-cover"
                  />
                  <div className={cn("absolute inset-0 opacity-60", subject.color)} />
                  <Icon className="w-6 h-6 text-white absolute inset-0 m-auto" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{subject.name}</h3>
                    {subject.isOffline ? (
                      <span className="flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        <Download className="w-3 h-3" />
                        Live
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {subject.progress}%
                    </span>
                  </div>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-2">
                <div className="h-px bg-border mb-3" />
                {subject.topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    title={topic.title}
                    questionsCount={topic.questionsCount}
                    isCompleted={topic.isCompleted}
                    progress={topic.progress}
                    onClick={() => onTopicSelect?.(subject.id, topic.id)}
                  />
                ))}
                <Button
                  onClick={() => onSubjectSelect?.(subject.id)}
                  className="w-full mt-2 rounded-xl bg-primary hover:bg-primary/90"
                >
                  View Subject Details
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
