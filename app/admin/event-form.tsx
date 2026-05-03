'use client'

import { useActionState, useState } from 'react'
import { createEvent } from '@/app/action/events'
import { Technology, Event } from '@/app/lib/definitions'

type Fields = {
  name: string
  technologyId: string
  startTime: string
  endTime: string
  details: string
  tickets: number
}

const empty: Fields = {
  name: '',
  technologyId: '',
  startTime: '',
  endTime: '',
  details: '',
  tickets: 20,
}

export default function EventForm({
  technologies,
  pastEvents,
}: {
  technologies: Technology[]
  pastEvents: Event[]
}) {
  const [state, action, pending] = useActionState(createEvent, undefined)
  const [fields, setFields] = useState<Fields>(empty)

  function handleCopy(eventId: string) {
    if (!eventId) {
      setFields(empty)
      return
    }
    const source = pastEvents.find((e) => e.id === eventId)
    if (!source) return
    setFields({
      name: source.name,
      technologyId: source.technologyId,
      startTime: source.startTime,
      endTime: source.endTime,
      details: source.details,
      tickets: 20,
    })
  }

  function set(key: keyof Fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: key === 'tickets' ? Number(e.target.value) : e.target.value }))
  }

  return (
    <>
      {state?.success && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-emerald-900 border border-emerald-500 text-emerald-300">
          Event created successfully.
        </div>
      )}
      {state?.message && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-900 border border-red-500 text-red-300">
          {state.message}
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <label htmlFor="copyFrom" className="block text-emerald-400 font-semibold mb-2">
            Copy from previous event
          </label>
          <select
            id="copyFrom"
            defaultValue=""
            onChange={(e) => handleCopy(e.target.value)}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:outline-none focus:border-emerald-500"
          >
            <option value="">— Select an event to copy —</option>
            {pastEvents.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-2">Date and number of tickets are never copied.</p>
        </div>
      )}

      <form action={action} className="space-y-6 bg-gray-800 p-8 rounded-lg">
        <div>
          <label htmlFor="name" className="block text-white font-semibold mb-2">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={fields.name}
            onChange={set('name')}
            placeholder="e.g., Java Workshop for Beginners"
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
            value={fields.technologyId}
            onChange={set('technologyId')}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
          >
            <option value="" disabled>Select a technology</option>
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
              value={fields.startTime}
              onChange={set('startTime')}
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
              value={fields.endTime}
              onChange={set('endTime')}
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
            value={fields.tickets}
            onChange={set('tickets')}
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
            value={fields.details}
            onChange={set('details')}
            placeholder="Describe the event..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded transition duration-200"
        >
          {pending ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </>
  )
}
