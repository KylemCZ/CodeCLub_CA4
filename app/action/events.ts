'use server'

import sql from '@/app/lib/db'
import { getUser } from '@/app/lib/dal'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function bookEvent(_state: unknown, formData: FormData) {
  const user = await getUser()
  if (!user) redirect('/login')
  if (user.role === 'ninja') return { message: 'Ninjas cannot book events.' }

  const eventId = formData.get('eventId') as string
  const technologyId = formData.get('technologyId') as string
  const rawAttendeeId = formData.get('attendeeId') as string | null
  const attendeeId = rawAttendeeId || user.id

  if (user.role === 'guardian') {
    const allowed = await sql`
      SELECT id FROM users
      WHERE id = ${attendeeId}
      AND (id = ${user.id} OR (guardian_id = ${user.id} AND role = 'ninja'))
      LIMIT 1
    `
    if (allowed.length === 0) return { message: 'You can only book for yourself or your ninjas.' }
  }

  const result = await sql`
    WITH new_booking AS (
      INSERT INTO bookings (booked_by, attendee_id, event_id)
      SELECT ${user.id}, ${attendeeId}, ${eventId}
      FROM events WHERE id = ${eventId} AND tickets > 0
      ON CONFLICT (attendee_id, event_id) DO NOTHING
      RETURNING id
    )
    UPDATE events
    SET tickets = tickets - 1
    WHERE id = ${eventId}
      AND EXISTS (SELECT 1 FROM new_booking)
    RETURNING tickets
  `

  if (result.length === 0) {
    const existing = await sql`
      SELECT id FROM bookings WHERE attendee_id = ${attendeeId} AND event_id = ${eventId}
    `
    if (existing.length > 0) return { message: 'Already booked for this attendee.' }
    return { message: 'This event is sold out.' }
  }

  revalidatePath(`/technologies/${technologyId}`)
  return { success: true }
}

export async function fetchUserBookedEventIds(): Promise<{ eventId: string; attendeeId: string }[]> {
  const user = await getUser()
  if (!user) return []
  if (user.role === 'guardian') {
    const res = await sql`SELECT event_id, attendee_id FROM bookings WHERE booked_by = ${user.id}`
    return res.map((row) => ({ eventId: String(row.event_id), attendeeId: String(row.attendee_id) }))
  }
  const res = await sql`SELECT event_id, attendee_id FROM bookings WHERE attendee_id = ${user.id}`
  return res.map((row) => ({ eventId: String(row.event_id), attendeeId: String(row.attendee_id) }))
}

export async function fetchUserBookings() {
  const user = await getUser()
  if (!user) return []

  const res = user.role === 'guardian'
    ? await sql`
        SELECT b.id AS booking_id, e.id, e.name, e.date, e.start_time, e.end_time, e.details, e.technology_id, u.name AS attendee_name
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        JOIN users u ON b.attendee_id = u.id
        WHERE b.booked_by = ${user.id}
        ORDER BY e.date ASC
      `
    : await sql`
        SELECT b.id AS booking_id, e.id, e.name, e.date, e.start_time, e.end_time, e.details, e.technology_id, NULL AS attendee_name
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.attendee_id = ${user.id}
        ORDER BY e.date ASC
      `

  return res.map((row) => ({
    bookingId: String(row.booking_id),
    id: String(row.id),
    name: String(row.name),
    technologyId: String(row.technology_id),
    date: String(row.date).slice(0, 10),
    startTime: String(row.start_time).slice(0, 5),
    endTime: String(row.end_time).slice(0, 5),
    details: String(row.details),
    attendeeName: row.attendee_name ? String(row.attendee_name) : null,
  }))
}

export async function cancelBooking(_state: unknown, formData: FormData) {
  const user = await getUser()
  if (!user) redirect('/login')

  const bookingId = formData.get('bookingId') as string

  const result = await sql`
    WITH deleted AS (
      DELETE FROM bookings
      WHERE id = ${bookingId} AND booked_by = ${user.id}
      RETURNING event_id
    )
    UPDATE events
    SET tickets = tickets + 1
    WHERE id = (SELECT event_id FROM deleted)
    RETURNING id
  `

  if (result.length === 0) return { message: 'Booking not found.' }

  revalidatePath('/profile')
  return { success: true }
}

export async function createEvent(_state: unknown, formData: FormData) {
  const user = await getUser()
  if (user?.role !== 'admin') redirect('/technologies')

  const name = formData.get('name') as string
  const date = formData.get('date') as string
  const startTime = formData.get('startTime') as string
  const endTime = formData.get('endTime') as string
  const details = formData.get('details') as string
  const technologyId = formData.get('technologyId') as string
  const tickets = parseInt(formData.get('tickets') as string, 10)

  if (!name || !date || !startTime || !endTime || !details || !technologyId) {
    return { message: 'All fields are required.' }
  }

  if (isNaN(tickets) || tickets < 1) {
    return { message: 'Tickets must be a positive number.' }
  }

  try {
    await sql`
      INSERT INTO events (name, date, start_time, end_time, details, technology_id, tickets)
      VALUES (${name}, ${date}, ${startTime}, ${endTime}, ${details}, ${technologyId}, ${tickets})
    `
  } catch {
    return { message: 'Database error: could not create event.' }
  }

  return { success: true }
}

export async function fetchAllEvents() {
  const user = await getUser()
  if (user?.role !== 'admin') redirect('/technologies')

  const res = await sql`
    SELECT id, name, technology_id, date, start_time, end_time, details, tickets
    FROM events
    ORDER BY date DESC
  `
  return res.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    technologyId: String(row.technology_id),
    date: String(row.date).slice(0, 10),
    startTime: String(row.start_time).slice(0, 5),
    endTime: String(row.end_time).slice(0, 5),
    details: String(row.details),
    tickets: Number(row.tickets),
  }))
}

export async function fetchEventById(id: string) {
  const user = await getUser()
  if (user?.role !== 'admin') redirect('/technologies')

  const res = await sql`
    SELECT id, name, technology_id, date, start_time, end_time, details, tickets
    FROM events WHERE id = ${id} LIMIT 1
  `
  if (!res[0]) return null
  const row = res[0]
  return {
    id: String(row.id),
    name: String(row.name),
    technologyId: String(row.technology_id),
    date: String(row.date).slice(0, 10),
    startTime: String(row.start_time).slice(0, 5),
    endTime: String(row.end_time).slice(0, 5),
    details: String(row.details),
    tickets: Number(row.tickets),
  }
}

export async function updateEvent(_state: unknown, formData: FormData) {
  const user = await getUser()
  if (user?.role !== 'admin') redirect('/technologies')

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const date = formData.get('date') as string
  const startTime = formData.get('startTime') as string
  const endTime = formData.get('endTime') as string
  const details = formData.get('details') as string
  const technologyId = formData.get('technologyId') as string
  const tickets = parseInt(formData.get('tickets') as string, 10)

  if (!name || !date || !startTime || !endTime || !details || !technologyId) {
    return { message: 'All fields are required.' }
  }

  if (isNaN(tickets) || tickets < 1) {
    return { message: 'Tickets must be a positive number.' }
  }

  try {
    await sql`
      UPDATE events SET
        name = ${name},
        date = ${date},
        start_time = ${startTime},
        end_time = ${endTime},
        details = ${details},
        technology_id = ${technologyId},
        tickets = ${tickets}
      WHERE id = ${id}
    `
  } catch {
    return { message: 'Database error: could not update event.' }
  }

  return { success: true }
}

export async function fetchEventByTechnologyId(id: string) {
  const res = await sql`
    SELECT id, name, date, start_time, end_time, details, tickets
    FROM events WHERE technology_id = ${id} ORDER BY date ASC
  `
  return res.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    technologyId: id,
    date: String(row.date).slice(0, 10),
    startTime: String(row.start_time).slice(0, 5),
    endTime: String(row.end_time).slice(0, 5),
    details: String(row.details),
    tickets: Number(row.tickets),
  }))
}