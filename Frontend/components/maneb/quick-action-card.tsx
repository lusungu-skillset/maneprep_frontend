"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: string
  onClick?: () => void
}

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  color,
  onClick 
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative min-h-[88px] w-full overflow-hidden rounded-[1.75rem] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]",
        color
      )}
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="flex items-center gap-4 relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <p className="text-white/85 text-base mt-0.5">{description}</p>
        </div>
        <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  )
}
