"use client"

import Image from "next/image"
import { 
  Settings, 
  Download, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Trophy,
  Target,
  CheckCircle2,
  Edit3,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FormLevel } from "@/lib/user-data"
import { formatRelativeDateTime } from "@/lib/maneb"

interface UserProfile {
  id: string
  name: string
  school: string
  form: FormLevel
}

interface QuizAttempt {
  quizId: string
  score: number
  totalQuestions: number
  completedAt: string
}

interface ProfileScreenProps {
  onNavigateToSettings?: () => void
  onNavigateToDownloads?: () => void
  onNavigateToHelp?: () => void
  onNavigateToEditProfile?: () => void
  onLogout?: () => void
  userProfile?: UserProfile
  quizHistory?: QuizAttempt[]
  syncedAnswerCount?: number
  lastSyncedAt?: string | null
}

export function ProfileScreen({ 
  onNavigateToSettings, 
  onNavigateToDownloads,
  onNavigateToHelp,
  onNavigateToEditProfile,
  onLogout,
  userProfile = { id: "", name: "Student", school: "Secondary School", form: "Form 4" },
  quizHistory = [],
  syncedAnswerCount = 0,
  lastSyncedAt = null,
}: ProfileScreenProps) {
  const totalQuizzes = quizHistory.length
  const correctAnswers = quizHistory.reduce((acc, attempt) => acc + attempt.score, 0)
  const lastActivity = quizHistory[quizHistory.length - 1]?.completedAt ?? null

  const stats = [
    { label: "Quizzes", value: totalQuizzes.toString(), icon: Target },
    { label: "Correct", value: correctAnswers.toString(), icon: CheckCircle2 },
    { label: "Last Active", value: formatRelativeDateTime(lastActivity), icon: Trophy },
  ]

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="relative h-28 w-full overflow-hidden">
        <Image
          src="/images/hero-students.jpg"
          alt="Profile background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-background" />
      </div>

      <div className="px-4 -mt-12 relative z-10">
        {/* Profile Card */}
        <section className="bg-card rounded-2xl p-5 shadow-lg border border-border text-center mb-5 relative">
          <button 
            onClick={onNavigateToEditProfile}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-18 h-18 rounded-full bg-primary flex items-center justify-center mx-auto mb-3 ring-4 ring-background w-[72px] h-[72px]">
            <span className="text-2xl font-bold text-primary-foreground">
              {userProfile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold text-foreground">{userProfile.name}</h2>
          <p className="text-muted-foreground text-sm">{userProfile.school}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {userProfile.form}
          </span>
        </section>

        {/* Privacy Badge */}
        <section className="mb-5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 border border-secondary/20">
            <Shield className="w-5 h-5 text-secondary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your progress is private. Only you can see your data.
            </p>
          </div>
        </section>

        <section className="mb-5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
            <Trophy className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">sync status</p>
              <p className="text-xs text-muted-foreground">
                {syncedAnswerCount} answers recorded, last sync {formatRelativeDateTime(lastSyncedAt)}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-5">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div 
                  key={stat.label}
                  className="bg-card rounded-xl p-3 shadow-sm border border-border text-center"
                >
                  <Icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Recent Activity */}
        {quizHistory.length > 0 && (
          <section className="mb-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Recent Activity
            </h3>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {quizHistory.slice(-3).reverse().map((attempt, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">Quiz Completed</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                    {attempt.score}/{attempt.totalQuestions}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Menu */}
        <section>
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <button
              onClick={onNavigateToSettings}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground font-medium">Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onNavigateToDownloads}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground font-medium">Downloads</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onNavigateToHelp}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground font-medium">Help</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Logout */}
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="w-full rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5 mt-5"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
