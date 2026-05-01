"use client"

import { useState } from "react"
import {
  ArrowLeft, 
  User, 
  Bell, 
  Download, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Wifi,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"

interface SettingsScreenProps {
  onBack: () => void
  onNavigateToDownloads?: () => void
  onNavigateToHelp?: () => void
  onNavigateToEditProfile?: () => void
}

export function SettingsScreen({ onBack, onNavigateToDownloads, onNavigateToHelp, onNavigateToEditProfile }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [autoDownload, setAutoDownload] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const handleToggle = (setter: (v: boolean) => void, current: boolean) => {
    setter(!current)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 1500)
  }

  const handleThemeToggle = () => {
    toggleTheme()
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-card/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-11 h-11">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex-1">Settings</h1>
          {showSaved && (
            <div className="flex items-center gap-2 text-secondary text-base font-medium">
              <Check className="w-5 h-5" />
              <span>Saved</span>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-6 pb-28 sm:px-6">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Account
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <button 
              onClick={onNavigateToEditProfile}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-base">Edit Profile</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Change your name, school, or class</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Preferences
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden divide-y divide-border">
            {/* Notifications */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base">Reminders</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Get study reminders</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setNotifications, notifications)}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors relative",
                  notifications ? "bg-primary" : "bg-muted"
                )}
                aria-label={notifications ? "Turn off reminders" : "Turn on reminders"}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-white shadow absolute top-1 transition-all",
                  notifications ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base">Sound Effects</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Sounds when answering</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setSoundEffects, soundEffects)}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors relative",
                  soundEffects ? "bg-primary" : "bg-muted"
                )}
                aria-label={soundEffects ? "Turn off sounds" : "Turn on sounds"}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-white shadow absolute top-1 transition-all",
                  soundEffects ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center",
                  isDark ? "bg-accent/10" : "bg-muted"
                )}>
                  {isDark ? (
                    <Sun className="w-6 h-6 text-accent" />
                  ) : (
                    <Moon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base">Dark Mode</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {isDark ? "Use the brighter look" : "Use the darker look"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors relative",
                  isDark ? "bg-primary" : "bg-muted"
                )}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-white shadow absolute top-1 transition-all",
                  isDark ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Saved Content
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden divide-y divide-border">
            {/* Auto Download */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base">Auto-Save</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Save content when on WiFi</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setAutoDownload, autoDownload)}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors relative",
                  autoDownload ? "bg-primary" : "bg-muted"
                )}
                aria-label={autoDownload ? "Turn off auto-save" : "Turn on auto-save"}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-white shadow absolute top-1 transition-all",
                  autoDownload ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {/* Manage Downloads */}
            <button 
              onClick={onNavigateToDownloads}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                  <Download className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-base">Manage Saved Content</p>
                  <p className="text-sm text-muted-foreground mt-0.5">View and delete saved items</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Support
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden divide-y divide-border">
            <button 
              onClick={onNavigateToHelp}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-secondary" />
                </div>
                <span className="font-semibold text-foreground text-base">Help and FAQ</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="font-semibold text-foreground text-base">Terms and Privacy</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        <div className="text-center pt-6">
          <p className="text-base text-muted-foreground font-medium">MANEB Prep v1.0.0</p>
          <p className="text-sm text-muted-foreground mt-2">Made with love for Malawian students</p>
        </div>
      </main>
    </div>
  )
}
