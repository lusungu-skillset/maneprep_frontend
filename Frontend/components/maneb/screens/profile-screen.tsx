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
    { label: "Quizzes Taken", value: totalQuizzes.toString(), icon: Target },
    { label: "Correct Answers", value: correctAnswers.toString(), icon: CheckCircle2 },
    { label: "Last Active", value: formatRelativeDateTime(lastActivity), icon: Trophy },
  ]

  return (
    <div className="pb-28 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src="/images/hero-students.jpg"
          alt="Profile background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-background" />
      </div>

      <div className="px-5 -mt-14 relative z-10">
        {/* Profile Card */}
        <section className="bg-card rounded-3xl p-6 shadow-lg border border-border text-center mb-6 relative">
          <button 
            onClick={onNavigateToEditProfile}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="Edit profile"
          >
            <Edit3 className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 ring-4 ring-background shadow-lg">
            <span className="text-3xl font-bold text-primary-foreground">
              {userProfile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{userProfile.name}</h2>
          <p className="text-base text-muted-foreground mt-1">{userProfile.school}</p>
          <span className="inline-block mt-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-semibold">
            {userProfile.form}
          </span>
        </section>

        {/* Privacy Notice */}
        <section className="mb-6">
          <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-secondary/10 border border-secondary/20">
            <Shield className="w-6 h-6 text-secondary flex-shrink-0" />
            <p className="text-base text-muted-foreground leading-relaxed">
              Your progress is private. Only you can see your results.
            </p>
          </div>
        </section>

        {/* Sync Status */}
        <section className="mb-6">
          <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-primary/5 border border-primary/20">
            <Trophy className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="text-base font-semibold text-foreground">Progress Saved</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {syncedAnswerCount} answers recorded {lastSyncedAt ? ` - Last saved ${formatRelativeDateTime(lastSyncedAt)}` : ''}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Your Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div 
                  key={stat.label}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center"
                >
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Recent Activity */}
        {quizHistory.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Recent Quizzes
            </h3>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {quizHistory.slice(-3).reverse().map((attempt, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-foreground text-base">Quiz Completed</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-base font-bold">
                    {attempt.score}/{attempt.totalQuestions}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Menu */}
        <section>
          <h3 className="text-lg font-bold text-foreground mb-4">Options</h3>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <button
              onClick={onNavigateToSettings}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="flex items-center gap-4">
                <Settings className="w-6 h-6 text-muted-foreground" />
                <span className="text-base font-semibold text-foreground">Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onNavigateToDownloads}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="flex items-center gap-4">
                <Download className="w-6 h-6 text-muted-foreground" />
                <span className="text-base font-semibold text-foreground">Saved Content</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onNavigateToHelp}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <HelpCircle className="w-6 h-6 text-muted-foreground" />
                <span className="text-base font-semibold text-foreground">Help and Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Logout */}
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="w-full rounded-2xl text-destructive border-destructive/20 hover:bg-destructive/5 mt-6 h-14 text-base font-semibold"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
