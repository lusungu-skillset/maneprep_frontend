"use client"

import Image from "next/image"
import { ArrowLeft, Play, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface Topic {
  id: number
  title: string
  description: string
  questionsCount: number
  isCompleted: boolean
  progress: number
}

interface SubjectDetailScreenProps {
  subject: {
    id: number
    name: string
    icon: LucideIcon
    color: string
    image: string
    description: string
    topics: Topic[]
  }
  onBack: () => void
  onTopicSelect: (topicId: number) => void
}

export function SubjectDetailScreen({
  subject,
  onBack,
  onTopicSelect,
}: SubjectDetailScreenProps) {
  const Icon = subject.icon
  const overallProgress =
    subject.topics.length > 0
      ? Math.round(
          subject.topics.reduce((acc, topic) => acc + topic.progress, 0) /
            subject.topics.length,
        )
      : 0
  const completedTopics = subject.topics.filter((topic) => topic.isCompleted).length

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={subject.image}
          alt={subject.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-background" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute top-4 left-4 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="px-4 -mt-12 relative z-10 pb-24">
        <div className="bg-card rounded-2xl p-5 shadow-lg border border-border mb-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                subject.color,
              )}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-foreground">{subject.name}</h1>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {subject.description}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-semibold text-foreground">
                {overallProgress}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedTopics} of {subject.topics.length} topics attempted
            </p>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Topics
        </h2>
        <div className="space-y-3">
          {subject.topics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic.id)}
              className="w-full bg-card rounded-2xl p-4 shadow-sm border border-border text-left transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    topic.isCompleted ? "bg-secondary" : "bg-primary/10",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-bold",
                      topic.isCompleted ? "text-secondary-foreground" : "text-primary",
                    )}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="w-3 h-3" />
                      {topic.questionsCount} questions
                    </span>
                    <span className="text-xs text-primary font-medium">
                      {topic.progress}% attempted
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
