"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  quantity: z.number().int().min(1).max(10),
});

type FormValues = z.infer<typeof schema>;

export function PurchaseForm({ eventId, available }: { eventId: string; available: number }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 },
  });

  const onSubmit = handleSubmit(async (values) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, quantity: values.quantity }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError("root", { message: payload.error ?? "Purchase failed" });
      return;
    }

    router.push("/tickets");
    router.refresh();
  });

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Input
        max={Math.max(1, Math.min(10, available))}
        min={1}
        type="number"
        {...register("quantity", { valueAsNumber: true })}
      />
      {errors.quantity && <p className="text-xs text-red-600">{errors.quantity.message}</p>}
      {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}
      <Button disabled={available <= 0 || isSubmitting} type="submit">
        {available <= 0 ? "Sold out" : isSubmitting ? "Processing..." : "Buy now"}
      </Button>
    </form>
  );
}
