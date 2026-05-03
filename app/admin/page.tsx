import Link from 'next/link'
import { fetchAllTechs } from '@/app/action/fetch'
import { fetchAllUsers } from '@/app/action/users'
import { fetchAllEvents } from '@/app/action/events'
import EventForm from './event-form'
import UsersTable from './users-table'
import EventsList from './events-list'
import TechnologiesTable from './technologies-table'
import EventAttendees from './event-attendees'

export default async function AdminDashboard() {
  const [technologies, users, pastEvents] = await Promise.all([
    fetchAllTechs(),
    fetchAllUsers(),
    fetchAllEvents(),
  ])

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/technologies" className="text-emerald-400 hover:text-emerald-300">
            ← Back to Technologies
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-10">Manage users, technologies and events</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Users</h2>
          <UsersTable users={users} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Technologies</h2>
          <TechnologiesTable technologies={technologies} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Attendee Management</h2>
          <EventAttendees events={pastEvents} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Events</h2>
          <EventsList events={pastEvents} />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Create Event</h2>
          <EventForm technologies={technologies} pastEvents={pastEvents} />
        </section>
      </div>
    </div>
  )
}
