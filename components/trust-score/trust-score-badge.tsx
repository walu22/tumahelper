'use client'

import { cn, getTrustScoreColor, getTrustScoreLabel } from '@/utils/formatters'

interface TrustScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  isProvisional?: boolean
}

export function TrustScoreBadge({
  score,
  size = 'md',
  showLabel = true,
  isProvisional = false,
}: TrustScoreBadgeProps) {
  const color = getTrustScoreColor(score, isProvisional)
  const label = getTrustScoreLabel(score, isProvisional)
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  }

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className={cn('relative', sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', textSize[size])} style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground text-center">
          {label}
        </span>
      )}
    </div>
  )
}