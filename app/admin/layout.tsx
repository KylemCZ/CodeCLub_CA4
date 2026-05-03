import { getUser } from '@/app/lib/dal'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (user?.role !== 'admin') redirect('/technologies')

  return <>{children}</>
}
