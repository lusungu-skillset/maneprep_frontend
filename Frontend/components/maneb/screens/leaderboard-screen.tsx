"use client"

import { Users } from "lucide-react"
import { BackendStatusPanel } from "../backend-status-panel"

interface LeaderboardScreenProps {
  onBack: () => void
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  return (
    <BackendStatusPanel
      title="Leaderboard"
      heading="No rankings yet"
      message="No student rankings available."
      onBack={onBack}
      icon={Users}
    />
  )
}
