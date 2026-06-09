import { redirect } from 'next/navigation'

export default function NanniesPage() {
  redirect('/customer/book?category=nanny')
}
