import { redirect } from 'next/navigation'

export default function HouseCleanersPage() {
  redirect('/customer/book?category=cleaning')
}
