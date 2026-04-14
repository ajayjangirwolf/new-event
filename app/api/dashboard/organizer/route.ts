import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireOrganizer } from "@/lib/auth";
import { Event } from "@/models/Event";
import { Order } from "@/models/Order";

export async function GET() {
  const user = await requireOrganizer();
  if (user instanceof NextResponse) {
    return user;
  }

  await connectDb();

  const [events, orders] = await Promise.all([
    Event.find({ organizerId: user.userId }).sort({ createdAt: -1 }).lean(),
    Order.find().populate("eventId", "organizerId").lean(),
  ]);

  const organizerOrders = orders.filter((order) => {
    const event = order.eventId as { organizerId?: string } | null;
    return event?.organizerId?.toString() === user.userId;
  });

  const totalTicketsSold = organizerOrders.reduce((sum, order) => sum + order.quantity, 0);
  const revenue = organizerOrders.reduce((sum, order) => sum + order.amount, 0);

  return NextResponse.json({
    analytics: {
      totalTicketsSold,
      revenue,
      totalEvents: events.length,
    },
    events,
  });
}
