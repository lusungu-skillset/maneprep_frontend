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
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={subject.image}
          alt={subject.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-background" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute top-4 left-4 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 w-12 h-12"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      <div className="px-5 -mt-14 relative z-10 pb-28">
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border mb-6">
          <div className="flex items-start gap-5">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md",
                subject.color,
              )}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{subject.name}</h1>
                <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full font-semibold">
                  Online
                </span>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                {subject.description}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-medium text-muted-foreground">Your Progress</span>
              <span className="text-base font-bold text-foreground">
                {overallProgress}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {completedTopics} of {subject.topics.length} topics completed
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">
          Topics ({subject.topics.length})
        </h2>
        <div className="space-y-4">
          {subject.topics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic.id)}
              className="w-full bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    topic.isCompleted ? "bg-secondary" : "bg-primary/10",
                  )}
                >
                  <span
                    className={cn(
                      "text-lg font-bold",
                      topic.isCompleted ? "text-secondary-foreground" : "text-primary",
                    )}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      {topic.questionsCount} questions
                    </span>
                    <span className="text-sm text-primary font-semibold">
                      {topic.progress}% done
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
