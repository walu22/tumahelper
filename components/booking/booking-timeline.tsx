'use client'

import { cn } from '@/utils/formatters'
import { CheckCircle, Circle, Clock, XCircle } from 'lucide-react'

interface BookingTimelineProps {
  status: string
}

const steps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'accepted', label: 'Accepted', icon: Circle },
  { key: 'in_progress', label: 'In Progress', icon: Clock },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
]

const statusOrder = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed']

export function BookingTimeline({ status }: BookingTimelineProps) {
  const currentIndex = statusOrder.indexOf(status)
  const isCancelledOrDisputed = status === 'cancelled' || status === 'disputed'

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const stepIndex = statusOrder.indexOf(step.key)
        const isCompleted = currentIndex >= stepIndex && !isCancelledOrDisputed
        const isCurrent = step.key === status
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'rounded-full p-1.5 transition-colors',
                  isCompleted
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-8 -mb-1',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
            <div className="pt-0.5">
              <p
                className={cn(
                  'text-sm font-medium',
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
            </div>
          </div>
        )
      })}
      {isCancelledOrDisputed && (
        <div className="flex items-start gap-3">
          <div className="rounded-full p-1.5 bg-destructive text-white">
            <XCircle className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-destructive capitalize">{status}</p>
        </div>
      )}
    </div>
  )
}