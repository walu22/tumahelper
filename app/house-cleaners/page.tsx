import { redirect } from 'next/navigation'

export default function HouseCleanersPage() {
  redirect('/workers?category=house_cleaner')
}