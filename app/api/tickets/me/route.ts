import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireSessionUser } from "@/lib/auth";
import { Ticket } from "@/models/Ticket";

export async function GET() {
  const user = await requireSessionUser();
  if (user instanceof NextResponse) {
    return user;
  }

  await connectDb();

  const tickets = await Ticket.find({ userId: user.userId })
    .populate("eventId", "title date location")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ tickets });
}
