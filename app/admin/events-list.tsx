import Link from 'next/link'
import { Event } from '@/app/lib/definitions'

export default function EventsList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p className="text-gray-400">No events yet.</p>
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {events.map((event) => (
          <div key={event.id} className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">{event.name}</p>
                <p className="text-gray-400 text-sm">{event.technologyId}</p>
              </div>
              <Link
                href={`/admin/events/${event.id}`}
                className="shrink-0 text-sm px-3 py-1 rounded bg-gray-600 hover:bg-emerald-700 text-white transition duration-200"
              >
                Edit
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Date</p>
                <p className="text-gray-300">{event.date}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Time</p>
                <p className="text-gray-300">{event.startTime} – {event.endTime}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Tickets</p>
                <p className="text-gray-300">{event.tickets}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-sm uppercase tracking-wide">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Technology</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Tickets</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-gray-700">
                <td className="py-3 px-4 text-white">{event.name}</td>
                <td className="py-3 px-4 text-gray-400">{event.technologyId}</td>
                <td className="py-3 px-4 text-gray-400">{event.date}</td>
                <td className="py-3 px-4 text-gray-400">{event.startTime} – {event.endTime}</td>
                <td className="py-3 px-4 text-gray-400">{event.tickets}</td>
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="text-sm px-3 py-1 rounded bg-gray-600 hover:bg-emerald-700 text-white transition duration-200"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
