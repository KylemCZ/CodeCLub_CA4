'use client'

import { useActionState } from 'react'
import { updateEvent } from '@/app/action/events'
import { Technology, Event } from '@/app/lib/definitions'

export default function EditEventForm({
  event,
  technologies,
}: {
  event: Event
  technologies: Technology[]
}) {
  const [state, action, pending] = useActionState(updateEvent, undefined)

  return (
    <>
      {state?.success && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-emerald-900 border border-emerald-500 text-emerald-300">
          Event updated successfully.
        </div>
      )}
      {state?.message && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-900 border border-red-500 text-red-300">
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-6 bg-gray-800 p-8 rounded-lg">
        <input type="hidden" name="id" value={event.id} />

        <div>
          <label htmlFor="name" className="block text-white font-semibold mb-2">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={event.name}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="technologyId" className="block text-white font-semibold mb-2">
            Technology <span className="text-red-500">*</span>
          </label>
          <select
            id="technologyId"
            name="technologyId"
            required
            defaultValue={event.technologyId}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
          >
            {technologies.map((tech) => (
              <option key={tech.id} value={tech.id}>{tech.id}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-white font-semibold mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={event.date}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-white font-semibold mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              required
              defaultValue={event.startTime}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-white font-semibold mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              required
              defaultValue={event.endTime}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tickets" className="block text-white font-semibold mb-2">
            Number of Tickets
          </label>
          <input
            id="tickets"
            name="tickets"
            type="number"
            min={1}
            required
            defaultValue={event.tickets}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="details" className="block text-white font-semibold mb-2">
            Event Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="details"
            name="details"
            required
            rows={6}
            defaultValue={event.details}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded transition duration-200"
        >
          {pending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </>
  )
}
