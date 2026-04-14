import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { eventSchema } from "@/lib/schemas";
import { requireOrganizer } from "@/lib/auth";
import { Event } from "@/models/Event";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDb();
  const event = await Event.findById(id).lean();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireOrganizer();
  if (user instanceof NextResponse) {
    return user;
  }

  try {
    const { id } = await params;
    const json = await request.json();
    const data = eventSchema.partial().parse({
      ...json,
      price: json.price !== undefined ? Number(json.price) : undefined,
      totalTickets: json.totalTickets !== undefined ? Number(json.totalTickets) : undefined,
    });

    await connectDb();

    const event = await Event.findOneAndUpdate(
      { _id: id, organizerId: user.userId },
      {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      { new: true },
    ).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireOrganizer();
  if (user instanceof NextResponse) {
    return user;
  }

  const { id } = await params;
  await connectDb();

  const result = await Event.findOneAndDelete({ _id: id, organizerId: user.userId });
  if (!result) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
