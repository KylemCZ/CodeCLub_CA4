'use server'

import sql from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { NinjaFormSchema } from '@/app/lib/definitions'

async function requireAdmin() {
  const user = await getUser()
  if (user?.role !== 'admin') redirect('/technologies')
  return user
}

export async function fetchAllUsers() {
  const user = await requireAdmin()
  const res = await sql`
    SELECT id, name, email, username, role, is_active FROM users ORDER BY name
  `
  return res.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string | null,
    username: row.username as string | null,
    role: row.role as string,
    isActive: row.is_active as boolean,
    isSelf: row.id === user.id,
  }))
}

export async function setUserRole(userId: string, role: string) {
  await requireAdmin()
  await sql`UPDATE users SET role = ${role} WHERE id = ${userId}`
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  await requireAdmin()
  await sql`UPDATE users SET is_active = ${!isActive} WHERE id = ${userId}`
}

export async function fetchGuardianNinjas() {
  const guardian = await getUser()
  if (!guardian || guardian.role !== 'guardian') return []

  const res = await sql`
    SELECT id, name, image FROM users WHERE guardian_id = ${guardian.id} AND role = 'ninja' ORDER BY name
  `
  return res.map((row) => ({ id: String(row.id), name: String(row.name), image: String(row.image) }))
}

export async function addNinja(_state: unknown, formData: FormData) {
  const guardian = await getUser()
  if (guardian?.role !== 'guardian') redirect('/profile')

  const validated = NinjaFormSchema.safeParse({
    name:     formData.get('name'),
    username: formData.get('username'),
    password: formData.get('password'),
    dob:      formData.get('dob'),
    gender:   formData.get('gender'),
    image:    formData.get('image'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten((issue) => issue.message).fieldErrors }
  }

  const { name: rawName, username, password, dob, gender, image } = validated.data
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  const ninjaCount = await sql`SELECT COUNT(*) AS count FROM users WHERE guardian_id = ${guardian.id} AND role = 'ninja'`
  if (Number(ninjaCount[0].count) >= 5) {
    return { message: 'You have reached the maximum of 5 ninjas.' }
  }

  const existing = await sql`SELECT id FROM users WHERE username = ${username} LIMIT 1`
  if (existing.length > 0) {
    return { message: 'Username is already taken.' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await sql`
    INSERT INTO users (name, username, password, role, dob, gender, image, is_active, guardian_id)
    VALUES (${name}, ${username}, ${hashedPassword}, 'ninja', ${dob}, ${gender}, ${image}, true, ${guardian.id})
  `

  redirect('/profile')
}

export async function fetchEventAttendeeStats(eventId: string) {
  await requireAdmin()

  const res = await sql`
    SELECT
      COUNT(*) AS total,
      COUNT(CASE WHEN u.gender = 'male'   THEN 1 END) AS male,
      COUNT(CASE WHEN u.gender = 'female' THEN 1 END) AS female,
      COUNT(CASE WHEN u.gender = 'other'  THEN 1 END) AS other_gender,
      COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) < 13                                                                    THEN 1 END) AS under_13,
      COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) >= 13 AND EXTRACT(YEAR FROM AGE(NOW(), u.dob)) < 18 THEN 1 END) AS age_13_18,
      COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) >= 18 AND EXTRACT(YEAR FROM AGE(NOW(), u.dob)) < 29 THEN 1 END) AS age_18_29,
      COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) >= 29 AND EXTRACT(YEAR FROM AGE(NOW(), u.dob)) < 39 THEN 1 END) AS age_29_39,
      COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) >= 39 AND EXTRACT(YEAR FROM AGE(NOW(), u.dob)) < 55 THEN 1 END) AS age_39_55,
      COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) >= 55                                                                   THEN 1 END) AS above_55
    FROM bookings b
    JOIN users u ON b.attendee_id = u.id
    WHERE b.event_id = ${eventId}
  `

  const row = res[0]
  return {
    total:       Number(row.total),
    male:        Number(row.male),
    female:      Number(row.female),
    otherGender: Number(row.other_gender),
    under13:     Number(row.under_13),
    age13_18:    Number(row.age_13_18),
    age18_29:    Number(row.age_18_29),
    age29_39:    Number(row.age_29_39),
    age39_55:    Number(row.age_39_55),
    above55:     Number(row.above_55),
  }
}

export async function fetchAttendeeReports() {
  await requireAdmin()

  const [techRows, ageRows, genderRows] = await Promise.all([
    sql`
      SELECT t.id AS technology, COUNT(b.id) AS total
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN technologies t ON e.technology_id = t.id
      GROUP BY t.id
      ORDER BY total DESC
    `,
    sql`
      SELECT
        CASE
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) < 13 THEN 'Under 13'
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) BETWEEN 13 AND 17 THEN '13-17'
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) BETWEEN 18 AND 25 THEN '18-25'
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) BETWEEN 26 AND 35 THEN '26-35'
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) BETWEEN 36 AND 50 THEN '36-50'
          ELSE '51+'
        END AS age_group,
        CASE
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) < 13 THEN 1
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) BETWEEN 13 AND 17 THEN 2
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) BETWEEN 18 AND 25 THEN 3
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) BETWEEN 26 AND 35 THEN 4
          WHEN EXTRACT(YEAR FROM AGE(NOW(), u.dob)) BETWEEN 36 AND 50 THEN 5
          ELSE 6
        END AS sort_key,
        COUNT(DISTINCT b.attendee_id) AS count
      FROM bookings b
      JOIN users u ON b.attendee_id = u.id
      GROUP BY age_group, sort_key
      ORDER BY sort_key
    `,
    sql`
      SELECT u.gender, COUNT(DISTINCT b.attendee_id) AS count
      FROM bookings b
      JOIN users u ON b.attendee_id = u.id
      GROUP BY u.gender
      ORDER BY count DESC
    `,
  ])

  return {
    byTech:   techRows.map((r)   => ({ technology: String(r.technology), total: Number(r.total) })),
    byAge:    ageRows.map((r)    => ({ ageGroup: String(r.age_group), count: Number(r.count) })),
    byGender: genderRows.map((r) => ({ gender: String(r.gender), count: Number(r.count) })),
  }
}
