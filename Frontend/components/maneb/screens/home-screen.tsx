"use client"

import Image from "next/image"
import { Play, Download, BookMarked, Trophy, Users, Lightbulb, ChevronRight, Calendar } from "lucide-react"
import { SubjectCard } from "../subject-card"
import { QuickActionCard } from "../quick-action-card"
import { SyncStatus } from "../sync-status"
import type { FormLevel } from "@/lib/user-data"
import type { LucideIcon } from "lucide-react"

interface UserProfile {
  name: string
  school: string
  form: FormLevel
}

interface SubjectInfo {
  id: number
  name: string
  icon: LucideIcon
  progress: number
  color: string
  questionCount: number
  topicCount: number
  isOffline: boolean
}

interface DailyChallenge {
  label: string
  questionCount: number
  onStart: () => void
}

interface HomeScreenProps {
  onNavigateToSubjects: () => void
  onNavigateToPractice: () => void
  onNavigateToAchievements?: () => void
  onNavigateToLeaderboard?: () => void
  onNavigateToStudyTips?: () => void
  onNavigateToPastPapers?: () => void
  onNavigateToFormSelector?: () => void
  onSelectSubject?: (subjectId: number) => void
  userProfile?: UserProfile
  subjects?: SubjectInfo[]
  lastSynced?: string | null
  dailyChallenge?: DailyChallenge | null
}

export function HomeScreen({ 
  onNavigateToSubjects, 
  onNavigateToPractice,
  onNavigateToAchievements,
  onNavigateToLeaderboard,
  onNavigateToPastPapers,
  onNavigateToStudyTips,
  onNavigateToFormSelector,
  onSelectSubject,
  userProfile = { name: "Student", school: "Secondary School", form: "Form 4" },
  subjects = [],
  lastSynced = null,
  dailyChallenge = null,
}: HomeScreenProps) {
  return (
    <div className="pb-32">
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[340px] lg:h-[380px]">
        <Image
          src="/images/hero-students.jpg"
          alt="Students studying"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="text-base font-medium text-white/90">Welcome back,</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
            {userProfile.name}
          </h2>
          <button 
            onClick={onNavigateToFormSelector}
            className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30"
          >
            {userProfile.form}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
        <SyncStatus lastSynced={lastSynced ?? undefined} />

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <QuickActionCard
              title="Start Practice"
              description={`${subjects.length} subjects ready`}
              icon={Play}
              color="bg-gradient-to-r from-primary to-primary/80"
              onClick={onNavigateToPractice}
            />
            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard
                title="Browse"
                description="View subjects"
                icon={Download}
                color="bg-gradient-to-r from-secondary to-secondary/80"
                onClick={onNavigateToSubjects}
              />
              <QuickActionCard
                title="Continue"
                description={dailyChallenge ? "Resume topic" : "Pick a subject"}
                icon={BookMarked}
                color="bg-gradient-to-r from-accent to-accent/80"
                onClick={dailyChallenge ? dailyChallenge.onStart : onNavigateToSubjects}
              />
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-r from-primary to-primary/85 p-6 text-white shadow-[0_24px_48px_-28px_rgba(37,99,235,0.9)]">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl shadow-md">
                <Image
                  src="/images/subject-science.jpg"
                  alt="Daily challenge"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/85">
                  Daily Challenge
                </p>
                <h4 className="mt-1 text-xl font-bold text-balance sm:text-2xl">
                  {dailyChallenge ? dailyChallenge.label : `${userProfile.form} Questions`}
                </h4>
                <p className="mt-2 text-base text-white/90">
                  {dailyChallenge
                    ? `${dailyChallenge.questionCount} questions to answer`
                    : "Pick a subject to get started"}
                </p>
              </div>
            </div>
            <button 
              onClick={dailyChallenge ? dailyChallenge.onStart : onNavigateToSubjects}
              className="mt-5 min-h-[54px] w-full rounded-2xl bg-white/20 py-4 text-lg font-bold transition-colors hover:bg-white/30"
            >
              {dailyChallenge ? "Start Challenge" : "Browse Subjects"}
            </button>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">
              {userProfile.form} Subjects
            </h3>
            <button 
              onClick={onNavigateToSubjects}
              className="text-base text-primary font-semibold hover:underline"
            >
              See All
            </button>
          </div>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {subjects.slice(0, 4).map((subject) => (
                <SubjectCard
                  key={subject.id}
                  name={subject.name}
                  icon={subject.icon}
                  progress={subject.progress}
                  color={subject.color}
                  isOffline={subject.isOffline}
                  onClick={() => onSelectSubject?.(subject.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-6 text-base text-muted-foreground text-center">
              No subjects available for {userProfile.form} yet. Check back soon!
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-5 text-xl font-bold text-foreground sm:text-2xl">
            More to Explore
          </h3>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <button 
              onClick={onNavigateToAchievements}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-center transition-all duration-200 hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-7 h-7 text-accent" />
              </div>
              <p className="text-base font-semibold text-foreground">Badges</p>
            </button>
            <button 
              onClick={onNavigateToLeaderboard}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-center transition-all duration-200 hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <p className="text-base font-semibold text-foreground">Ranking</p>
            </button>
            <button 
              onClick={onNavigateToStudyTips}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-center transition-all duration-200 hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-7 h-7 text-secondary" />
              </div>
              <p className="text-base font-semibold text-foreground">Study Tips</p>
            </button>
            <button 
              onClick={onNavigateToPastPapers}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-center transition-all duration-200 hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <p className="text-base font-semibold text-foreground">Past Papers</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
