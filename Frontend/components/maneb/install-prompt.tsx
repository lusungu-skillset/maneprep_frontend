"use client"

import { useState, useEffect } from "react"
import { X, Download, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePWA } from "@/hooks/use-pwa"

export function InstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWA()
  const [dismissed, setDismissed] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const hasDismissed = localStorage.getItem('maneb-install-dismissed')
    if (hasDismissed) {
      setDismissed(true)
    }

    // Show prompt after a delay
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled && !hasDismissed) {
        setShowPrompt(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    setShowPrompt(false)
    localStorage.setItem('maneb-install-dismissed', 'true')
  }

  if (!showPrompt || dismissed || isInstalled) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300 max-w-lg mx-auto">
      <div className="bg-card rounded-2xl p-4 shadow-xl border border-border">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="font-semibold text-foreground">Install MANEB Prep</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add to your home screen for quick access and offline studying.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="flex-1 rounded-xl"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleInstall}
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
        </div>
      </div>
    </div>
  )
}
