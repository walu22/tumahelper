'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrustScoreBadge } from '@/components/trust-score/trust-score-badge'
import { VerificationBadge } from '@/components/verification/verification-badge'
import { formatCurrency } from '@/utils/formatters'
import { MapPin, Star, Briefcase } from 'lucide-react'

interface WorkerCardProps {
  worker: {
    id: string
    full_name: string
    category: string
    city: string
    area: string
    trust_score: number
    verification_level: string
    average_rating: number
    total_jobs_completed: number
    expected_salary_min?: number | null
    expected_salary_max?: number | null
    profile_photo_url?: string | null
    is_featured: boolean
  }
}

export function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {worker.full_name.charAt(0)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{worker.full_name}</h3>
              {worker.is_featured && (
                <Badge variant="success" className="text-xs">Featured</Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>{worker.area}, {worker.city}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-3">
              <Badge variant="secondary" className="capitalize">
                <Briefcase className="h-3 w-3 mr-1" />
                {worker.category.replace('_', ' ')}
              </Badge>

              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{worker.average_rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({worker.total_jobs_completed})</span>
              </div>

              <VerificationBadge level={worker.verification_level} size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-primary">
                {worker.expected_salary_min
                  ? `${formatCurrency(worker.expected_salary_min)} - ${formatCurrency(worker.expected_salary_max || worker.expected_salary_min)}`
                  : 'Negotiable'}
              </div>

              <div className="flex items-center gap-2">
                <TrustScoreBadge
                  score={worker.trust_score}
                  size="sm"
                  showLabel={false}
                />
                <Button size="sm">Book Now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}