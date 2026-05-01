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
      heading="Badges are coming soon"
      message="This page will show your badges here when they are ready."
      onBack={onBack}
      icon={Trophy}
    />
  )
}
