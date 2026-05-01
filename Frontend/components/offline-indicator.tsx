"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Set initial state
    setIsOffline(!navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  if (!isOffline) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-6xl">
      <div className="flex items-center gap-2 border-t border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200 md:rounded-t-lg md:border-t">
        <WifiOff className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1">
          You&apos;re offline. Using cached data where available.
        </span>
      </div>
    </div>
  )
}
