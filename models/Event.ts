import mongoose, { Schema, type InferSchemaType } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    totalTickets: { type: Number, required: true, min: 1 },
    soldTickets: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: "" },
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export type EventDocument = InferSchemaType<typeof EventSchema> & { _id: mongoose.Types.ObjectId };

export const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
