"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string().min(1),
  location: z.string().min(2),
  price: z.number().min(0),
  totalTickets: z.number().int().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function EventForm({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Failed to create event");
      return;
    }

    reset();
    onCreated?.();
    router.refresh();
  });

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <Input placeholder="Event title" {...register("title")} />
      {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
      <textarea className="min-h-24 rounded-md border border-slate-200 p-2 text-sm" placeholder="Description" {...register("description")} />
      {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
      <Input type="datetime-local" {...register("date")} />
      <Input placeholder="Location" {...register("location")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
        />
        <Input placeholder="Total tickets" type="number" {...register("totalTickets", { valueAsNumber: true })} />
      </div>
      <Input placeholder="Image URL (optional)" {...register("imageUrl")} />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating..." : "Create event"}
      </Button>
    </form>
  );
}
