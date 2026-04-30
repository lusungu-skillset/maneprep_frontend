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
    <div className="pb-24 max-w-lg mx-auto">
      {/* Hero Section */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src="/images/hero-students.jpg"
          alt="Students studying"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-student-sm text-white/80">Welcome back,</p>
          <h2 className="text-student-2xl text-white drop-shadow-lg">{userProfile.name}</h2>
          <button 
            onClick={onNavigateToFormSelector}
            className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-student-xs font-medium transition-colors"
          >
            {userProfile.form}
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <SyncStatus lastSynced={lastSynced ?? undefined} />

        {/* Quick Actions */}
        <section>
          <div className="space-y-3">
            <QuickActionCard
              title="Start Practice"
              description={`${subjects.length} live subjects`}
              icon={Play}
              color="bg-gradient-to-r from-primary to-primary/80"
              onClick={onNavigateToPractice}
            />
            <div className="grid grid-cols-2 gap-3">
              <QuickActionCard
                title="Download"
                description="Backend testing"
                icon={Download}
                color="bg-gradient-to-r from-secondary to-secondary/80"
                onClick={onNavigateToSubjects}
              />
              <QuickActionCard
                title="Continue"
                description={dailyChallenge ? "Resume a live topic" : "Browse subjects"}
                icon={BookMarked}
                color="bg-gradient-to-r from-accent to-accent/80"
                onClick={dailyChallenge ? dailyChallenge.onStart : onNavigateToSubjects}
              />
            </div>
          </div>
        </section>

        {/* Subjects Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {userProfile.form} Subjects
            </h3>
            <button 
              onClick={onNavigateToSubjects}
              className="text-sm text-primary font-medium"
            >
              See All
            </button>
          </div>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
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
            <div className="bg-card rounded-2xl border border-border p-5 text-sm text-muted-foreground">
              No subjects were returned for {userProfile.form} yet.
            </div>
          )}
        </section>

        {/* More Features */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            More
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <button 
              onClick={onNavigateToAchievements}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground">Badges</p>
            </button>
            <button 
              onClick={onNavigateToLeaderboard}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Ranking</p>
            </button>
            <button 
              onClick={onNavigateToStudyTips}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                <Lightbulb className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm font-medium text-foreground">Tips</p>
            </button>
            <button 
              onClick={onNavigateToPastPapers}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-foreground">Past Papers</p>
            </button>
          </div>
        </section>

        {/* Daily Challenge */}
        <section>
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src="/images/subject-science.jpg"
                  alt="Backend challenge"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 uppercase tracking-wide font-semibold">
                  Backend Challenge
                </p>
                <h4 className="text-lg font-bold mt-1">
                  {dailyChallenge ? dailyChallenge.label : `${userProfile.form} content`}
                </h4>
                <p className="text-sm text-white/90 mt-1">
                  {dailyChallenge
                    ? `${dailyChallenge.questionCount} questions`
                    : "Choose a subject with live data"}
                </p>
              </div>
            </div>
            <button 
              onClick={dailyChallenge ? dailyChallenge.onStart : onNavigateToSubjects}
              className="mt-4 w-full bg-white/20 hover:bg-white/30 rounded-xl py-3 font-semibold transition-colors"
            >
              {dailyChallenge ? "Start" : "Browse"}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
