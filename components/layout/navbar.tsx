"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
    router.push("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Evently
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/">Events</Link>
          {user && <Link href="/tickets">Tickets</Link>}
          {user?.role === "organizer" && <Link href="/organizer/dashboard">Dashboard</Link>}
          <Link href="/scanner">Scanner</Link>
          {!user ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
