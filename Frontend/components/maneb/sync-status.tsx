"use client"

import { RefreshCw, CheckCircle2, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRelativeDateTime } from "@/lib/maneb"

interface SyncStatusProps {
  lastSynced?: string
  isSyncing?: boolean
  className?: string
}

export function SyncStatus({ 
  lastSynced,
  isSyncing = false,
  className 
}: SyncStatusProps) {
  return (
    <div className={cn(
      "flex items-center justify-between bg-card rounded-2xl p-4 border border-border",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          isSyncing ? "bg-primary/10" : "bg-secondary/10"
        )}>
          {isSyncing ? (
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Cloud className="w-5 h-5 text-secondary" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {isSyncing ? "Syncing..." : "Synced"}
          </p>
          <p className="text-xs text-muted-foreground">
            {lastSynced
              ? `Last synced ${formatRelativeDateTime(lastSynced)}`
              : "Waiting for backend data"}
          </p>
        </div>
      </div>
      <CheckCircle2 className={cn(
        "w-5 h-5",
        isSyncing ? "text-muted-foreground" : "text-secondary"
      )} />
    </div>
  )
}
