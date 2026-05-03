'use client'

import { useState, useTransition } from 'react'
import { fetchEventAttendeeStats } from '@/app/action/users'
import { Event } from '@/app/lib/definitions'

type Stats = Awaited<ReturnType<typeof fetchEventAttendeeStats>>

function pct(value: number, total: number) {
  if (total === 0) return '—'
  return `${Math.round((value / total) * 100)}%`
}

function Row({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <tr className="border-t border-gray-700">
      <td className="py-3 px-4 text-gray-300">{label}</td>
      <td className="py-3 px-4 text-white font-semibold">{value}</td>
      <td className="py-3 px-4 text-gray-400 text-sm">{pct(value, total)}</td>
    </tr>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <tr className="border-t border-gray-700 bg-gray-750">
      <td colSpan={3} className="py-2 px-4 text-xs text-emerald-400 font-semibold uppercase tracking-wide">
        {label}
      </td>
    </tr>
  )
}

export default function EventAttendees({ events }: { events: Event[] }) {
  const [selectedId, setSelectedId] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSelect(id: string) {
    setSelectedId(id)
    if (!id) { setStats(null); return }
    startTransition(async () => {
      const data = await fetchEventAttendeeStats(id)
      setStats(data)
    })
  }

  const selectedEvent = events.find((e) => e.id === selectedId)

  return (
    <div>
      <select
        value={selectedId}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full bg-gray-700 text-white rounded border border-gray-600 px-3 py-2 mb-6 focus:outline-none focus:border-emerald-500"
      >
        <option value="">— Select an event —</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name} ({event.date}) · {event.technologyId}
          </option>
        ))}
      </select>

      {pending && <p className="text-gray-400 text-sm">Loading...</p>}

      {!pending && stats && selectedEvent && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-700 px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-white font-semibold">{selectedEvent.name}</p>
              <p className="text-gray-400 text-sm">{selectedEvent.date} · {selectedEvent.technologyId}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-400">{stats.total}</p>
              <p className="text-gray-400 text-xs">total attendees</p>
            </div>
          </div>

          {stats.total === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-6">No bookings for this event yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-300 text-xs uppercase tracking-wide border-t border-gray-700">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Count</th>
                  <th className="py-3 px-4">%</th>
                </tr>
              </thead>
              <tbody>
                <SectionHeader label="Gender" />
                <Row label="Male"   value={stats.male}        total={stats.total} />
                <Row label="Female" value={stats.female}      total={stats.total} />
                <Row label="Other"  value={stats.otherGender} total={stats.total} />

                <SectionHeader label="Age" />
                <Row label="Under 13" value={stats.under13}  total={stats.total} />
                <Row label="13 – 18"  value={stats.age13_18} total={stats.total} />
                <Row label="18 – 29"  value={stats.age18_29} total={stats.total} />
                <Row label="29 – 39"  value={stats.age29_39} total={stats.total} />
                <Row label="39 – 55"  value={stats.age39_55} total={stats.total} />
                <Row label="55+"      value={stats.above55}  total={stats.total} />
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
