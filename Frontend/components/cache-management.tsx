"use client"

import { useEffect, useState } from "react"
import { Trash2, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  getCacheSize,
  clearAllCaches,
  formatBytes,
  getPersistentStorageStatus,
  requestPersistentStorage,
} from "@/lib/cache-utils"

interface CacheInfo {
  usage: number
  quota: number
  percentage: number
}

interface StorageStatus {
  persisted: boolean
  available: boolean
}

export function CacheManagement() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null)
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCacheInfo()
  }, [])

  const loadCacheInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const cache = await getCacheSize()
      if (cache) {
        setCacheInfo(cache)
      }

      const storage = await getPersistentStorageStatus()
      if (storage) {
        setStorageStatus(storage)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cache info")
    } finally {
      setLoading(false)
    }
  }

  const handleClearCache = async () => {
    try {
      setClearing(true)
      setError(null)
      await clearAllCaches()
      setCacheInfo(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cache")
    } finally {
      setClearing(false)
      await loadCacheInfo()
    }
  }

  const handleRequestStorage = async () => {
    try {
      const granted = await requestPersistentStorage()
      if (granted) {
        const storage = await getPersistentStorageStatus()
        if (storage) {
          setStorageStatus(storage)
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to request storage"
      )
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">Cache Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage offline data and cached content
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-48 animate-pulse rounded bg-muted" />
        </div>
      ) : (
        <>
          {cacheInfo && (
            <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Storage Used</span>
                  <span>{cacheInfo.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${cacheInfo.percentage}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {formatBytes(cacheInfo.usage)} of{" "}
                  {formatBytes(cacheInfo.quota)}
                </div>
              </div>
            </div>
          )}

          {storageStatus && !storageStatus.persisted && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <p>
                  Enable persistent storage to prevent your cached data from
                  being deleted by the browser.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRequestStorage}
                >
                  Enable Persistent Storage
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {storageStatus && storageStatus.persisted && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Persistent storage is enabled. Your offline data won&apos;t be
                deleted by the browser.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadCacheInfo}
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearCache}
              disabled={clearing || !cacheInfo}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {clearing ? "Clearing..." : "Clear Cache"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
