import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["user", "organizer"]),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string().min(1),
  location: z.string().min(2),
  price: z.number().min(0),
  totalTickets: z.number().int().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const orderSchema = z.object({
  eventId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

export const ticketValidationSchema = z.object({
  uniqueId: z.string().min(1),
});
