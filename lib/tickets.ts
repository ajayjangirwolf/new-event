import QRCode from "qrcode";
import { nanoid } from "nanoid";

export function generateTicketId() {
  return nanoid(16);
}

export async function generateQrCode(uniqueId: string) {
  return QRCode.toDataURL(JSON.stringify({ uniqueId }));
}
