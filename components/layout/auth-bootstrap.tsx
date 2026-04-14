"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthBootstrap() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          clearUser();
          return;
        }

        const payload = await response.json();
        setUser(payload.user);
      } catch {
        clearUser();
      }
    };

    void load();
  }, [clearUser, setUser]);

  return null;
}
