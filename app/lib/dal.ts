import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from '@/app/lib/session'
import sql from '@/app/lib/db'

export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value

  if (!sessionToken) {
    redirect('/login')
  }

  const session = await decrypt(sessionToken)

  if (!session?.userId) {
    redirect('/login')
  }

  return session
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  const res = await sql`
    SELECT id, name, role, image FROM users WHERE id = ${session.userId} LIMIT 1
  `

  if (!res[0]) return null
  return {
    id: res[0].id as string,
    name: res[0].name as string,
    role: res[0].role as string,
    image: res[0].image as string | null,
  }
})

export const getFullUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  const res = await sql`
    SELECT id, name, email, username, role, dob, gender FROM users WHERE id = ${session.userId} LIMIT 1
  `

  return res[0] ?? null
})
