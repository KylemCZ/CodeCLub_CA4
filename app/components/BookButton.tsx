'use client'

import { useActionState } from 'react'
import { bookEvent } from '@/app/action/events'

type GuardianMember = { id: string; name: string }

type Props = {
  eventId: string
  technologyId: string
  hasBooked: boolean
  soldOut: boolean
  isNinja: boolean
  guardianMembers?: GuardianMember[]
  bookedAttendeeIds?: string[]
}

export default function BookButton({ eventId, technologyId, hasBooked, soldOut, isNinja, guardianMembers, bookedAttendeeIds }: Props) {
  const [state, action, pending] = useActionState(bookEvent, null)

  if (isNinja) {
    return (
      <div className="w-full text-center bg-gray-800/50 text-gray-500 text-sm font-semibold py-2 px-4 rounded-xl border border-gray-700/40">
        Not available for Ninjas
      </div>
    )
  }

  if (guardianMembers) {
    const allBooked = guardianMembers.every(m => bookedAttendeeIds?.includes(m.id))

    if (allBooked) {
      return (
        <div className="w-full text-center bg-green-500/20 text-green-400 text-sm font-semibold py-2 px-4 rounded-xl border border-green-500/40">
          All spots booked
        </div>
      )
    }

    if (soldOut) {
      return (
        <div className="w-full text-center bg-gray-800/50 text-gray-500 text-sm font-semibold py-2 px-4 rounded-xl border border-gray-700/40">
          Sold Out
        </div>
      )
    }

    return (
      <form action={action} className="w-full flex flex-col gap-2">
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="technologyId" value={technologyId} />
        <select
          name="attendeeId"
          className="w-full bg-purple-950/70 text-white text-sm font-semibold py-2 px-3 rounded-xl border border-purple-700/50 focus:outline-none focus:border-purple-400"
        >
          {guardianMembers.map(m => (
            <option key={m.id} value={m.id} disabled={bookedAttendeeIds?.includes(m.id)}>
              {m.name}{bookedAttendeeIds?.includes(m.id) ? ' (booked)' : ''}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-200 cursor-pointer"
        >
          {pending ? 'Booking…' : 'Book Event'}
        </button>
        {state?.message && (
          <p className="mt-1 text-red-400 text-xs text-center">{state.message}</p>
        )}
      </form>
    )
  }

  const alreadyBooked = hasBooked || state?.success

  if (alreadyBooked) {
    return (
      <div className="w-full text-center bg-green-500/20 text-green-400 text-sm font-semibold py-2 px-4 rounded-xl border border-green-500/40">
        Booked
      </div>
    )
  }

  if (soldOut) {
    return (
      <div className="w-full text-center bg-gray-800/50 text-gray-500 text-sm font-semibold py-2 px-4 rounded-xl border border-gray-700/40">
        Sold Out
      </div>
    )
  }

  return (
    <form action={action} className="w-full">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="technologyId" value={technologyId} />
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-200 cursor-pointer"
      >
        {pending ? 'Booking…' : 'Book Event'}
      </button>
      {state?.message && (
        <p className="mt-2 text-red-400 text-xs text-center">{state.message}</p>
      )}
    </form>
  )
}
