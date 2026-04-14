import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { eventSchema } from "@/lib/schemas";
import { requireOrganizer } from "@/lib/auth";
import { Event } from "@/models/Event";

export async function GET() {
  await connectDb();
  const events = await Event.find().sort({ date: 1 }).lean();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const user = await requireOrganizer();
  if (user instanceof NextResponse) {
    return user;
  }

  try {
    const json = await request.json();
    const data = eventSchema.parse({
      ...json,
      price: Number(json.price),
      totalTickets: Number(json.totalTickets),
    });

    await connectDb();

    const event = await Event.create({
      ...data,
      date: new Date(data.date),
      imageUrl: data.imageUrl ?? "",
      organizerId: user.userId,
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create event" },
      { status: 400 },
    );
  }
}
