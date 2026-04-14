import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireOrganizer } from "@/lib/auth";
import { ticketValidationSchema } from "@/lib/schemas";
import { Ticket } from "@/models/Ticket";

export async function POST(request: Request) {
  const user = await requireOrganizer();
  if (user instanceof NextResponse) {
    return user;
  }

  try {
    const json = await request.json();
    const data = ticketValidationSchema.parse(json);

    await connectDb();

    const ticket = await Ticket.findOne({ uniqueId: data.uniqueId });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status === "used") {
      return NextResponse.json({ error: "Ticket already used" }, { status: 400 });
    }

    ticket.status = "used";
    ticket.usedAt = new Date();
    await ticket.save();

    return NextResponse.json({ message: "Ticket validated and marked as used" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Validation failed" },
      { status: 400 },
    );
  }
}
