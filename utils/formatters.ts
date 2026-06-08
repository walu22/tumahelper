export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  return `ZMW ${(amount / 100).toFixed(2)}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-ZM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${minutes} ${ampm}`
}

export function getVerificationColor(level: string): string {
  const colors: Record<string, string> = {
    none: '#9E9E9E',
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
  }
  return colors[level] || '#9E9E9E'
}

export function getTrustScoreColor(score: number, isProvisional: boolean): string {
  if (isProvisional) return '#9E9E9E'
  if (score >= 90) return '#1B7A3F'
  if (score >= 75) return '#4CAF50'
  if (score >= 60) return '#FFC107'
  if (score >= 40) return '#FF9800'
  return '#F44336'
}

export function getTrustScoreLabel(score: number, isProvisional: boolean): string {
  if (isProvisional) return 'New - Building Trust'
  if (score >= 90) return 'Exceptional'
  if (score >= 75) return 'Trusted'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Improvement'
}

export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    accepted: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    disputed: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    submitted: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}