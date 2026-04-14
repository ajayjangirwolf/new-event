import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type EventCardData = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
};

export function EventCard({ event }: { event: EventCardData }) {
  const remaining = event.totalTickets - event.soldTickets;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{new Date(event.date).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-slate-600">{event.description}</p>
        <p className="text-sm text-slate-700">{event.location}</p>
        <div className="flex items-center justify-between">
          <Badge>₹{event.price.toFixed(2)}</Badge>
          <Badge className={remaining > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
            {remaining > 0 ? `${remaining} left` : "Sold out"}
          </Badge>
        </div>
        <Link className="block text-sm font-medium text-slate-900 underline" href={`/events/${event._id}`}>
          View details
        </Link>
      </CardContent>
    </Card>
  );
}
