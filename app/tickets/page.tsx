import Image from "next/image";
import { getSessionUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getTickets() {
  const user = await getSessionUser();
  if (!user) {
    return [];
  }

  await connectDb();
  return Ticket.find({ userId: user.userId })
    .populate("eventId", "title date location")
    .sort({ createdAt: -1 })
    .lean<Array<{
    _id: string;
    uniqueId: string;
    qrCode: string;
    status: "active" | "used";
    eventId: { title: string; date: string; location: string };
  }>>();
}

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-sm text-slate-600">No tickets purchased yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardHeader>
                <CardTitle>{ticket.eventId?.title ?? "Event"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Badge className={ticket.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}>
                  {ticket.status}
                </Badge>
                <p>ID: {ticket.uniqueId}</p>
                <Image
                  alt="Ticket QR"
                  className="rounded border border-slate-200"
                  height={176}
                  src={ticket.qrCode}
                  unoptimized
                  width={176}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
