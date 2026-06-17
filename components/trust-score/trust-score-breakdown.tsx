'use client'

import { cn } from '@/utils/formatters'

interface TrustScoreBreakdownProps {
  components: {
    identityVerification: number
    jobCompletion: number
    customerRating: number
    punctuality: number
    reliability: number
    complaintHistory: number
    profileCompleteness: number
  }
  maxScores?: {
    identityVerification: number
    jobCompletion: number
    customerRating: number
    punctuality: number
    reliability: number
    complaintHistory: number
    profileCompleteness: number
  }
}

const defaultMaxScores = {
  identityVerification: 15,
  jobCompletion: 20,
  customerRating: 20,
  punctuality: 10,
  reliability: 15,
  complaintHistory: 15,
  profileCompleteness: 5,
}

const componentLabels: Record<string, string> = {
  identityVerification: 'Identity Verification',
  jobCompletion: 'Job Completion Rate',
  customerRating: 'Customer Rating',
  punctuality: 'Punctuality',
  reliability: 'Reliability',
  complaintHistory: 'Complaint History',
  profileCompleteness: 'Profile Completeness',
}

export function TrustScoreBreakdown({
  components,
  maxScores = defaultMaxScores,
}: TrustScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      {Object.entries(components).map(([key, value]) => {
        const max = maxScores[key as keyof typeof maxScores]
        const percentage = max > 0 ? (value / max) * 100 : 0

        return (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {componentLabels[key] || key}
              </span>
              <span className="font-medium">
                {value}/{max}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor:
                    percentage >= 80
                      ? '#1B7A3F'
                      : percentage >= 60
                      ? '#4CAF50'
                      : percentage >= 40
                      ? '#FFC107'
                      : percentage >= 20
                      ? '#FF9800'
                      : '#F44336',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}