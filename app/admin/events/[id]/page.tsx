import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchEventById } from '@/app/action/events'
import { fetchAllTechs } from '@/app/action/fetch'
import EditEventForm from './edit-form'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [event, technologies] = await Promise.all([fetchEventById(id), fetchAllTechs()])

  if (!event) notFound()

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="text-emerald-400 hover:text-emerald-300">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Edit Event</h1>
        <p className="text-gray-400 mb-8">{event.name}</p>

        <EditEventForm event={event} technologies={technologies} />
      </div>
    </div>
  )
}
