import { notFound } from "next/navigation";
import { PurchaseForm } from "@/components/forms/purchase-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { connectDb } from "@/lib/db";
import { Event } from "@/models/Event";

export const dynamic = "force-dynamic";

async function getEvent(id: string) {
  await connectDb();
  return Event.findById(id).lean<{
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    totalTickets: number;
    soldTickets: number;
  } | null>();
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const available = event.totalTickets - event.soldTickets;

  return (
    <div className="mx-auto grid max-w-3xl gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          <CardDescription>{new Date(event.date).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-700">{event.description}</p>
          <p className="text-sm text-slate-600">📍 {event.location}</p>
          <p className="text-sm font-medium">₹{event.price.toFixed(2)} per ticket</p>
          <p className="text-sm text-slate-600">{available > 0 ? `${available} tickets left` : "Sold out"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buy tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseForm eventId={event._id} available={available} />
        </CardContent>
      </Card>
    </div>
  );
}
