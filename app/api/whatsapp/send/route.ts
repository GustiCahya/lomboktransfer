import { NextResponse } from "next/server";
import { sendWhatsApp, WaTemplates } from "@/lib/whatsapp/fonnte";

/**
 * POST /api/whatsapp/send
 * 
 * Generic API route to trigger WhatsApp messages via Fonnte.
 * Intended to be called by n8n webhooks or internal triggers.
 * 
 * Request body:
 *   { type: "driver_assignment" | "guest_confirm_id" | "daily_report" | "reminder_h1" | "reminder_3hr", payload: {...} }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, phone, payload } = body;

    if (!type || !phone) {
      return NextResponse.json({ error: "Missing type or phone" }, { status: 400 });
    }

    let message = "";

    switch (type) {
      case "driver_assignment":
        message = WaTemplates.driverAssignment(payload);
        break;
      case "guest_confirm_id":
        message = WaTemplates.guestConfirmationID(payload);
        break;
      case "guest_confirm_en":
        message = WaTemplates.guestConfirmationEN(payload);
        break;
      case "reminder_h1":
        message = WaTemplates.reminderHMin1(payload);
        break;
      case "driver_reminder_3hr":
        message = WaTemplates.driverReminder3Hours(payload);
        break;
      case "daily_report":
        message = WaTemplates.dailyReport(payload);
        break;
      case "review_request":
        message = WaTemplates.reviewRequest(payload);
        break;
      default:
        return NextResponse.json({ error: `Unknown message type: ${type}` }, { status: 400 });
    }

    const result = await sendWhatsApp({ target: phone, message });

    return NextResponse.json(result, { status: result.status ? 200 : 500 });
  } catch (error) {
    console.error("[/api/whatsapp/send] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
