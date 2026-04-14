import { EventForm } from "@/components/forms/event-form";
import { DeleteEventButton } from "@/components/organizer/delete-event-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Event } from "@/models/Event";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

async function getDashboardData(userId: string) {
  await connectDb();

  const [events, orders] = await Promise.all([
    Event.find({ organizerId: userId }).sort({ createdAt: -1 }).lean(),
    Order.find().populate("eventId", "organizerId").lean(),
  ]);

  const organizerOrders = orders.filter((order) => {
    const event = order.eventId as { organizerId?: string } | null;
    return event?.organizerId?.toString() === userId;
  });

  const totalTicketsSold = organizerOrders.reduce((sum, order) => sum + order.quantity, 0);
  const revenue = organizerOrders.reduce((sum, order) => sum + order.amount, 0);

  return {
    analytics: {
      totalTicketsSold,
      revenue,
      totalEvents: events.length,
    },
    events,
  };
}

export default async function OrganizerDashboardPage() {
  const user = await getSessionUser();

  if (!user || user.role !== "organizer") {
    return <p className="text-sm text-red-600">Organizer access required.</p>;
  }

  const data = await getDashboardData(user.userId);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Organizer Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total events</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{data.analytics.totalEvents}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tickets sold</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{data.analytics.totalTicketsSold}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">₹{data.analytics.revenue.toFixed(2)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.events?.length ? (
            data.events.map((event) => (
              <div className="flex flex-col justify-between rounded-md border border-slate-200 p-3 sm:flex-row sm:items-center" key={event._id.toString()}>
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs text-slate-600">{new Date(event.date).toLocaleString()}</p>
                  <p className="text-xs text-slate-600">{event.soldTickets}/{event.totalTickets} sold</p>
                </div>
                <DeleteEventButton eventId={event._id.toString()} />
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No events yet.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
