import mongoose, { Schema, type InferSchemaType } from "mongoose";

const TicketSchema = new Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    status: { type: String, enum: ["active", "used"], default: "active" },
    usedAt: { type: Date },
  },
  { timestamps: true },
);

export type TicketDocument = InferSchemaType<typeof TicketSchema> & { _id: mongoose.Types.ObjectId };

export const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
