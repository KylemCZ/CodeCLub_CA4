'use client'

import { useActionState } from 'react'
import { cancelBooking } from '@/app/action/events'

export default function CancelButton({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(cancelBooking, null)

  if (state?.success) {
    return (
      <div className="w-full text-center bg-gray-800/50 text-gray-500 text-sm font-semibold py-2 px-4 rounded-xl border border-gray-700/40">
        Cancelled
      </div>
    )
  }

  return (
    <form action={action} className="w-full">
      <input type="hidden" name="bookingId" value={bookingId} />
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-red-600/80 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-200 cursor-pointer"
      >
        {pending ? 'Cancelling…' : 'Cancel Booking'}
      </button>
      {state?.message && (
        <p className="mt-2 text-red-400 text-xs text-center">{state.message}</p>
      )}
    </form>
  )
}
