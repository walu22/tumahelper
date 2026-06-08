import { cn } from '@/utils/formatters'
import { Loader2 } from 'lucide-react'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'card' | 'list' | 'profile' | 'text'
  count?: number
}

export function LoadingSkeleton({ className, variant = 'text', count = 1 }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="skeleton h-40 w-full mb-4" />
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-4 w-1/2 mb-2" />
            <div className="skeleton h-4 w-1/4" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'profile') {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center gap-4">
          <div className="skeleton h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-6 w-48" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-4 w-full" />
      ))}
    </div>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  )
}