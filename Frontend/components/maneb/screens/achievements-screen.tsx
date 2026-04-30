"use client"

import { Trophy } from "lucide-react"
import { BackendStatusPanel } from "../backend-status-panel"

interface AchievementsScreenProps {
  onBack: () => void
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  return (
    <BackendStatusPanel
      title="Achievements"
      heading="No fabricated badges"
      message="Achievement rules are not backed by the API yet, so the frontend no longer shows sample trophies or progress counters here."
      onBack={onBack}
      icon={Trophy}
    />
  )
}
