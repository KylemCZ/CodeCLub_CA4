import { mavenPro } from "@/app/fonts";
import { fetchProjectsByTech } from "@/app/action/fetch";
import { fetchEventByTechnologyId, fetchUserBookedEventIds } from "@/app/action/events";
import TechnologyInfo from "@/app/components/technologyInfo";
import Add from "@/app/components/addProjectCard";
import EventCard from "@/app/components/EventCard";
import { getUser } from "@/app/lib/dal";
import { fetchGuardianNinjas } from "@/app/action/users";

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const isAdmin = user?.role === 'admin';
  const isNinja = user?.role === 'ninja';
  const isGuardian = user?.role === 'guardian';

  const projects = await fetchProjectsByTech(id);
  const [events, bookedPairs, ninjas] = await Promise.all([
    fetchEventByTechnologyId(id),
    fetchUserBookedEventIds(),
    isGuardian ? fetchGuardianNinjas() : Promise.resolve([]),
  ]);

  // Build per-event map of already-booked attendee IDs (for guardian dropdown)
  const bookedAttendeesPerEvent = new Map<string, string[]>()
  for (const { eventId, attendeeId } of bookedPairs) {
    if (!bookedAttendeesPerEvent.has(eventId)) bookedAttendeesPerEvent.set(eventId, [])
    bookedAttendeesPerEvent.get(eventId)!.push(attendeeId)
  }

  // Guardian members: self first, then ninjas
  const guardianMembers = isGuardian && user
    ? [{ id: user.id, name: `${user.name} (me)` }, ...ninjas]
    : undefined

  return (
      <div className="w-2/3 mx-auto my-4 flex flex-col items-center">
      <div id="intro-container" className="w-11/12 sw:w-3/5 bg-cyan-950 p-4 rounded-2xl border-solid border-4 border-emerald-400">
        <h1 className="text-4xl font-bold my-4">Learn to code with <span className="text-emerald-400">{ id }</span></h1>
        <p className={`${mavenPro.className}`}>Our projects have step-by-step instruction to teach you how to create games, animations, and much more. Choose from hundreds of options, in up to 30 languages</p>
      </div>
      <article id="article-container" className="min-w-full mx-5 my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((tech) => (
          <TechnologyInfo key={tech.id} projects={tech} />
        ))}
        {isAdmin && <Add id={id}/>}
      </article>
      <div id="intro-container" className="w-11/12 sw:w-3/5 bg-cyan-950 p-4 rounded-2xl border-solid border-4 border-emerald-400">
        <h1 className="text-4xl font-bold my-4">Upcoming <span className="text-emerald-400">{ id }</span> Events</h1>
        <p className={`${mavenPro.className}`}>Take your skills further by joining a hands-on { id } event. Learn from experienced instructors, connect with fellow developers, and level up in a focused, interactive setting.</p>
      </div>
      {events.length === 0 ? (
        <div className="w-11/12 sw:w-3/5 my-12 bg-cyan-950 p-6 rounded-2xl border-4 border-cyan-800 text-center text-gray-400">
          No upcoming events available.
        </div>
      ) : (
        <article id="article-container" className="min-w-full mx-5 my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              hasBooked={!isGuardian && bookedPairs.some(p => p.eventId === event.id)}
              isNinja={isNinja}
              guardianMembers={guardianMembers}
              bookedAttendeeIds={isGuardian ? bookedAttendeesPerEvent.get(event.id) ?? [] : undefined}
            />
          ))}
        </article>
      )}
      </div>
  );
}
