import { fetchUserBookings } from "@/app/action/events";
import { mavenPro } from "../fonts";
import CancelButton from "@/app/components/CancelButton";
import { getUser } from "@/app/lib/dal";

export default async function ProfileBookings() {
  const [bookings, user] = await Promise.all([fetchUserBookings(), getUser()]);
  const canCancel = user?.role !== 'ninja';

  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">
        My <span className="text-emerald-400">Bookings</span>
      </h2>

      {bookings.length === 0 ? (
        <div className="bg-cyan-950 rounded-2xl border-4 border-emerald-400 p-8 text-center text-gray-400">
          You have no upcoming bookings.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <span className="inline-block text-xs font-semibold tracking-widest text-purple-300 uppercase mb-2">
                    {booking.technologyId}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">{booking.name}</h3>
                  {booking.attendeeName && (
                    <p className="text-sm text-purple-300 mt-1">For: <span className="font-semibold text-white">{booking.attendeeName}</span></p>
                  )}
                </div>

                <p className={`${mavenPro.className} text-purple-200 text-sm leading-relaxed line-clamp-3`}>
                  {booking.details}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-purple-700/50">
                  <div className="bg-purple-950/50 rounded-xl p-3">
                    <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide mb-1">Date</p>
                    <p className="text-white text-sm font-semibold">{booking.date}</p>
                  </div>
                  <div className="bg-purple-950/50 rounded-xl p-3">
                    <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide mb-1">Time</p>
                    <p className="text-white text-sm font-semibold">{booking.startTime} – {booking.endTime}</p>
                  </div>
                </div>

                {canCancel && <CancelButton bookingId={booking.bookingId} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
