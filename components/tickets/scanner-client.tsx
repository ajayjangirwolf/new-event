"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

export function ScannerClient() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [message, setMessage] = useState("Point your camera at the ticket QR code.");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const elementId = "ticket-scanner";
    scannerRef.current = new Html5Qrcode(elementId);

    return () => {
      if (scannerRef.current?.isScanning) {
        void scannerRef.current.stop();
      }
      void scannerRef.current?.clear();
    };
  }, []);

  async function startScanner() {
    if (!scannerRef.current || started) {
      return;
    }

    setStarted(true);

    await scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      async (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText) as { uniqueId?: string };
          if (!parsed.uniqueId) {
            setMessage("Invalid QR payload.");
            return;
          }

          const response = await fetch("/api/tickets/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uniqueId: parsed.uniqueId }),
          });

          const payload = await response.json();
          setMessage(response.ok ? `✅ ${payload.message}` : `❌ ${payload.error}`);
        } catch {
          setMessage("Could not decode ticket.");
        }
      },
      () => undefined,
    );
  }

  return (
    <div className="space-y-3">
      <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white" onClick={startScanner} type="button">
        {started ? "Scanner running" : "Start scanner"}
      </button>
      <div className="text-sm text-slate-600">{message}</div>
      <div className="max-w-sm rounded-lg border border-slate-200 p-2">
        <div id="ticket-scanner" />
      </div>
    </div>
  );
}
