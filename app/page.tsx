import { EventCard, type EventCardData } from "@/components/events/event-card";
import { connectDb } from "@/lib/db";
import { Event } from "@/models/Event";

export const dynamic = "force-dynamic";

async function getEvents() {
  await connectDb();
  const events = await Event.find().sort({ date: 1 }).lean<EventCardData[]>();
  return events;
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
        <p className="mt-1 text-slate-600">Book verified tickets with instant QR access.</p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
          No events yet. Organizers can add events from the dashboard.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard event={event} key={event._id} />
          ))}
        </div>
      )}
    </section>
  );
}
