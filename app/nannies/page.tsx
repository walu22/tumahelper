import { redirect } from 'next/navigation'

export default function NanniesPage() {
  redirect('/workers?category=nanny')
}