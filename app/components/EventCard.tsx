import { mavenPro } from '../fonts';
import { Event } from "@/app/lib/definitions";
import BookButton from './BookButton';

type GuardianMember = { id: string; name: string }

type Props = {
  event: Event
  hasBooked: boolean
  isNinja: boolean
  guardianMembers?: GuardianMember[]
  bookedAttendeeIds?: string[]
}

export default function EventCard({ event, hasBooked, isNinja, guardianMembers, bookedAttendeeIds }: Props) {
  return (
    <section className="bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl overflow-hidden duration-300 ease-out hover:scale-102 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] flex flex-col">

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest text-purple-300 uppercase mb-2">{event.technologyId}</span>
          <h2 className="text-2xl font-bold text-white leading-tight">{event.name}</h2>
        </div>

        <p className={`${mavenPro.className} text-purple-200 text-sm leading-relaxed line-clamp-3`}>{event.details}</p>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-purple-700/50">
          <div className="bg-purple-950/50 rounded-xl p-3">
            <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide mb-1">Date</p>
            <p className="text-white text-sm font-semibold">{event.date}</p>
          </div>
          <div className="bg-purple-950/50 rounded-xl p-3">
            <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide mb-1">Time</p>
            <p className="text-white text-sm font-semibold">{event.startTime} – {event.endTime}</p>
          </div>
          <div className="col-span-2 bg-purple-950/50 rounded-xl p-3 flex items-center justify-between">
            <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide">Tickets Available</p>
            <span className="bg-purple-500/30 text-purple-200 text-sm font-bold px-3 py-1 rounded-full">{event.tickets}</span>
          </div>
        </div>

        <BookButton
          eventId={event.id}
          technologyId={event.technologyId}
          hasBooked={hasBooked}
          soldOut={event.tickets === 0}
          isNinja={isNinja}
          guardianMembers={guardianMembers}
          bookedAttendeeIds={bookedAttendeeIds}
        />
      </div>
    </section>
  );
}
