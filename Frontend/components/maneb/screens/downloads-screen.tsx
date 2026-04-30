"use client"

import { Download } from "lucide-react"
import { BackendStatusPanel } from "../backend-status-panel"

interface DownloadsScreenProps {
  onBack: () => void
}

export function DownloadsScreen({ onBack }: DownloadsScreenProps) {
  return (
    <BackendStatusPanel
      title="Downloads"
      heading="Offline cache is disabled"
      message="The app is testing directly against the backend right now, so it does not invent local download records or storage totals."
      onBack={onBack}
      icon={Download}
    />
  )
}
