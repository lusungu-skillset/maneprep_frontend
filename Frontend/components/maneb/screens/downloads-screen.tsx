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
      heading="Saved items are not ready yet"
      message="This page will list your saved study items here when they are ready."
      onBack={onBack}
      icon={Download}
    />
  )
}
