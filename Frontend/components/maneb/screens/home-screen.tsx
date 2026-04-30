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
    <div className="pb-28 max-w-lg mx-auto">
      {/* Hero Section */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src="/images/hero-students.jpg"
          alt="Students studying"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        <div className="absolute bottom-6 left-5 right-5">
          <p className="text-base text-white/90 font-medium">Welcome back,</p>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg mt-1">{userProfile.name}</h2>
          <button 
            onClick={onNavigateToFormSelector}
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-white/25 hover:bg-white/35 text-white text-sm font-semibold transition-colors min-h-[44px]"
          >
            {userProfile.form}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        <SyncStatus lastSynced={lastSynced ?? undefined} />

        {/* Quick Actions */}
        <section>
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
                title="Browse All"
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
        </section>

        {/* Subjects Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">
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
            <div className="grid grid-cols-2 gap-4">
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

        {/* More Features */}
        <section>
          <h3 className="text-lg font-bold text-foreground mb-4">
            More Features
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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

        {/* Daily Challenge */}
        <section>
          <div className="bg-gradient-to-r from-primary to-primary/85 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                <Image
                  src="/images/subject-science.jpg"
                  alt="Daily challenge"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/85 uppercase tracking-wider font-semibold">
                  Daily Challenge
                </p>
                <h4 className="text-xl font-bold mt-1 text-balance">
                  {dailyChallenge ? dailyChallenge.label : `${userProfile.form} Questions`}
                </h4>
                <p className="text-base text-white/90 mt-1">
                  {dailyChallenge
                    ? `${dailyChallenge.questionCount} questions to answer`
                    : "Pick a subject to start"}
                </p>
              </div>
            </div>
            <button 
              onClick={dailyChallenge ? dailyChallenge.onStart : onNavigateToSubjects}
              className="mt-5 w-full bg-white/25 hover:bg-white/35 rounded-2xl py-4 text-lg font-bold transition-colors min-h-[52px]"
            >
              {dailyChallenge ? "Start Challenge" : "Browse Subjects"}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
