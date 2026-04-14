"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();

  async function removeEvent() {
    const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <Button onClick={removeEvent} size="sm" variant="outline">
      Delete
    </Button>
  );
}
