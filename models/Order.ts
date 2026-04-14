import mongoose, { Schema, type InferSchemaType } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    quantity: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ["success", "failed"], default: "success" },
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof OrderSchema> & { _id: mongoose.Types.ObjectId };

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
