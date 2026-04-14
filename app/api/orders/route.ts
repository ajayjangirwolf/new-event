import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireSessionUser } from "@/lib/auth";
import { orderSchema } from "@/lib/schemas";
import { Event } from "@/models/Event";
import { Order } from "@/models/Order";
import { Ticket } from "@/models/Ticket";
import { generateQrCode, generateTicketId } from "@/lib/tickets";
import { sendTicketEmail } from "@/lib/email";

export async function POST(request: Request) {
  const user = await requireSessionUser();
  if (user instanceof NextResponse) {
    return user;
  }

  try {
    const json = await request.json();
    const data = orderSchema.parse({
      ...json,
      quantity: Number(json.quantity),
    });

    await connectDb();

    const event = await Event.findById(data.eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const available = event.totalTickets - event.soldTickets;
    if (available < data.quantity) {
      return NextResponse.json({ error: "Not enough tickets available" }, { status: 400 });
    }

    const order = await Order.create({
      userId: user.userId,
      eventId: event._id,
      quantity: data.quantity,
      amount: event.price * data.quantity,
      paymentStatus: "success",
    });

    const tickets = [];
    for (let i = 0; i < data.quantity; i += 1) {
      const uniqueId = generateTicketId();
      const qrCode = await generateQrCode(uniqueId);
      const ticket = await Ticket.create({
        uniqueId,
        qrCode,
        userId: user.userId,
        eventId: event._id,
        orderId: order._id,
        status: "active",
      });
      tickets.push(ticket);
    }

    event.soldTickets += data.quantity;
    await event.save();

    if (tickets[0]) {
      await sendTicketEmail({
        to: user.email,
        eventTitle: event.title,
        qrCode: tickets[0].qrCode,
      });
    }

    return NextResponse.json({ order, tickets }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order failed" },
      { status: 400 },
    );
  }
}
