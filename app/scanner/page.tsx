import { ScannerClient } from "@/components/tickets/scanner-client";

export default function ScannerPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">QR Scanner</h1>
      <p className="text-sm text-slate-600">Organizer login required for validation.</p>
      <ScannerClient />
    </section>
  );
}
