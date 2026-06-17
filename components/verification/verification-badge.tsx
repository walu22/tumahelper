'use client'

import { cn } from '@/utils/formatters'
import { Shield, ShieldCheck, Award, Sparkles, Circle } from 'lucide-react'

interface VerificationBadgeProps {
  level: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const verificationConfig = {
  none: { icon: Circle, color: '#9E9E9E', label: 'New', bg: 'bg-muted' },
  bronze: { icon: Shield, color: '#CD7F32', label: 'Phone Verified', bg: 'bg-amber-50' },
  silver: { icon: ShieldCheck, color: '#C0C0C0', label: 'ID Verified', bg: 'bg-surface' },
  gold: { icon: Award, color: '#FFD700', label: 'Reference Checked', bg: 'bg-yellow-50' },
  platinum: { icon: Sparkles, color: '#E5E4E2', label: 'Police Cleared', bg: 'bg-blue-50' },
}

export function VerificationBadge({ level, showLabel = true, size = 'md' }: VerificationBadgeProps) {
  const config = verificationConfig[level as keyof typeof verificationConfig] || verificationConfig.none
  const Icon = config.icon
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  }

  return (
    <div className={cn('inline-flex items-center gap-1.5', config.bg, 'rounded-full px-2 py-0.5')}>
      <Icon className={cn(sizeClasses[size])} style={{ color: config.color }} />
      {showLabel && (
        <span className="text-xs font-medium" style={{ color: config.color }}>
          {config.label}
        </span>
      )}
    </div>
  )
}

export function getVerificationLevelLabel(level: string): string {
  return verificationConfig[level as keyof typeof verificationConfig]?.label || 'New'
}