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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground flex-1">Settings</h1>
          {showSaved && (
            <div className="flex items-center gap-1 text-secondary text-sm">
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-6 pb-24 max-w-lg mx-auto space-y-6">
        {/* Account */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Account
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <button 
              onClick={onNavigateToEditProfile}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Edit Profile</p>
                  <p className="text-xs text-muted-foreground">Name, school, form level</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Preferences
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden divide-y divide-border">
            {/* Notifications */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Study reminders</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setNotifications, notifications)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  notifications ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all",
                  notifications ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Sound Effects</p>
                  <p className="text-xs text-muted-foreground">Quiz feedback sounds</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setSoundEffects, soundEffects)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  soundEffects ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all",
                  soundEffects ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {isDark ? "Light up your screen" : "Easy on the eyes"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  isDark ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all",
                  isDark ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </section>

        {/* Offline */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Offline Mode
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden divide-y divide-border">
            {/* Auto Download */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Auto-Download</p>
                  <p className="text-xs text-muted-foreground">Download on WiFi only</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setAutoDownload, autoDownload)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  autoDownload ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all",
                  autoDownload ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            {/* Manage Downloads */}
            <button 
              onClick={onNavigateToDownloads}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Manage Downloads</p>
                  <p className="text-xs text-muted-foreground">Offline cache is not configured yet</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Support
          </h2>
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden divide-y divide-border">
            <button 
              onClick={onNavigateToHelp}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Help & FAQ</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Terms & Privacy</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">MANEB Prep v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">Made with love for Malawian students</p>
        </div>
      </main>
    </div>
  )
}
