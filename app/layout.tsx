import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { AuthBootstrap } from "@/components/layout/auth-bootstrap";

export const metadata: Metadata = {
  title: "Evently - Event Management & Ticketing",
  description: "Browse events, purchase tickets, and validate QR check-ins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <AuthBootstrap />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
