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
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
      <section className="mb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{userForm} Subjects</h2>
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-semibold">
            {subjects.length} subjects
          </span>
        </div>
      </section>

      {subjects.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 text-base text-muted-foreground text-center">
          No subjects available for {userForm} yet. Check back soon!
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
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
              className="w-full p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    fill
                    className="object-cover"
                  />
                  <div className={cn("absolute inset-0 opacity-60", subject.color)} />
                  <Icon className="w-7 h-7 text-white absolute inset-0 m-auto" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">{subject.name}</h3>
                    {subject.isOffline ? (
                      <span className="flex items-center gap-1 text-sm text-secondary bg-secondary/10 px-2.5 py-1 rounded-full font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
                        <Download className="w-3.5 h-3.5" />
                        Online
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {subject.progress}% done
                    </span>
                  </div>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-6 h-6 text-muted-foreground" />
              )}
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 space-y-3">
                <div className="h-px bg-border mb-4" />
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
                  className="w-full mt-3 rounded-2xl bg-primary hover:bg-primary/90 h-14 text-base font-semibold"
                >
                  View All Topics
                </Button>
              </div>
            )}
          </div>
        )
      })}
      </div>
    </div>
  )
}
