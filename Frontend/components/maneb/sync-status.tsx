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
      "flex items-center justify-between gap-4 rounded-[1.5rem] border border-border/70 bg-card/90 p-5 shadow-sm",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          isSyncing ? "bg-primary/10" : "bg-secondary/10"
        )}>
          {isSyncing ? (
            <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <Cloud className="w-6 h-6 text-secondary" />
          )}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">
            {isSyncing ? "Updating your work..." : "Everything looks ready"}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lastSynced
              ? `Last updated ${formatRelativeDateTime(lastSynced)}`
              : "Loading your study content..."}
          </p>
        </div>
      </div>
      <CheckCircle2 className={cn(
        "w-6 h-6",
        isSyncing ? "text-muted-foreground" : "text-secondary"
      )} />
    </div>
  )
}
