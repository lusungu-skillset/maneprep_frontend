"use client"

import { useEffect, useState } from "react"

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOffline: boolean
  isUpdateAvailable: boolean
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    isUpdateAvailable: false,
  })
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setState(prev => ({ ...prev, isInstalled: isStandalone }))

    // Check online status
    const updateOnlineStatus = () => {
      setState(prev => ({ ...prev, isOffline: !navigator.onLine }))
    }
    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setState(prev => ({ ...prev, isInstallable: true }))
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdateAvailable: true }))
              }
            })
          }
        })
      }).catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false

    const promptEvent = deferredPrompt as unknown as { prompt: () => void; userChoice: Promise<{ outcome: string }> }
    promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice

    if (outcome === 'accepted') {
      setState(prev => ({ ...prev, isInstallable: false, isInstalled: true }))
      setDeferredPrompt(null)
      return true
    }
    return false
  }

  const update = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      })
    }
  }

  return {
    ...state,
    install,
    update,
  }
}
