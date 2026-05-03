import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { fetchAllTechs } from '@/app/action/fetch'
import { getUser } from '@/app/lib/dal'
import { redirect } from 'next/navigation'

export default async function GuardianLayout({ children }: { children: React.ReactNode }) {
  const [allTechs, user] = await Promise.all([fetchAllTechs(), getUser()])

  if (!user || user.role !== 'guardian') redirect('/profile')

  const technologies = allTechs.filter((t) => t.isActive)

  return (
    <>
      <Header technologies={technologies} user={user} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
