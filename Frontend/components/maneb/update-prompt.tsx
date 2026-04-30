"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePWA } from "@/hooks/use-pwa"

export function UpdatePrompt() {
  const { isUpdateAvailable, update } = usePWA()

  if (!isUpdateAvailable) return null

  return (
    <div className="fixed top-16 left-4 right-4 z-50 animate-in slide-in-from-top-4 duration-300 max-w-lg mx-auto">
      <div className="bg-secondary rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-white animate-spin" />
          <p className="text-sm font-medium text-white">
            New version available!
          </p>
        </div>
        <Button
          onClick={update}
          size="sm"
          className="bg-white text-secondary hover:bg-white/90 rounded-lg"
        >
          Update
        </Button>
      </div>
    </div>
  )
}
