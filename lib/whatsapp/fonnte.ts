/**
 * Fonnte WhatsApp API helper
 * Used to send WhatsApp messages via Fonnte gateway (fonnte.com)
 *
 * Environment variables required:
 *   FONNTE_API_KEY — Your Fonnte API key
 */

export interface FonnteMessagePayload {
  target: string; // phone number, e.g. "6281234567890"
  message: string;
  filename?: string; // optional file attachment URL
  delay?: number; // delay in seconds before sending (for scheduling)
}

export interface FonnteSendResult {
  status: boolean;
  id?: string;
  message?: string;
  reason?: string;
}

/**
 * Send a WhatsApp message via Fonnte API.
 * Intended to be called from a Next.js API route (server-side only).
 */
export async function sendWhatsApp(payload: FonnteMessagePayload): Promise<FonnteSendResult> {
  const apiKey = process.env.FONNTE_API_KEY;

  if (!apiKey) {
    console.error("[Fonnte] FONNTE_API_KEY is not set in environment variables.");
    return { status: false, reason: "API key not configured." };
  }

  // Normalize phone number: strip +, spaces, dashes; ensure starts with country code
  let phone = payload.target.replace(/[\s\-+]/g, "");
  if (phone.startsWith("0")) phone = "62" + phone.substring(1);

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: phone,
        message: payload.message,
        ...(payload.filename && { filename: payload.filename }),
        ...(payload.delay && { delay: payload.delay }),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("[Fonnte] Failed to send message:", data);
      return { status: false, reason: data.reason || data.message || "Unknown error" };
    }

    return { status: true, id: data.id };
  } catch (error) {
    console.error("[Fonnte] Network error:", error);
    return { status: false, reason: "Network error" };
  }
}

/**
 * Pre-defined message templates for Lombok Transfer
 */
export const WaTemplates = {
  /** Notifikasi penugasan trip ke supir */
  driverAssignment: (params: {
    driverName: string;
    guestName: string;
    guestNationality?: string;
    routeStart: string;
    routeEnd: string;
    pickupDate: string;
    pickupTime: string;
    paxCount: number;
    flightNumber?: string;
    notes?: string;
    guestPhone?: string;
    mapsLink?: string;
  }) => `🚗 *Trip Baru Untuk Anda!*

*Tamu:* ${params.guestName}${params.guestNationality ? ` (${params.guestNationality})` : ""}
*Rute:* ${params.routeStart} → ${params.routeEnd}
*Tanggal:* ${params.pickupDate} pukul ${params.pickupTime}
*Penumpang:* ${params.paxCount} orang
${params.flightNumber ? `*Flight:* ${params.flightNumber}\n` : ""}${params.notes ? `*Catatan:* ${params.notes}\n` : ""}
${params.guestPhone ? `📱 Kontak tamu: wa.me/${params.guestPhone}` : ""}
${params.mapsLink ? `🗺️ Maps: ${params.mapsLink}` : ""}`,

  /** Konfirmasi booking ke tamu (Bahasa Indonesia) */
  guestConfirmationID: (params: {
    guestName: string;
    driverName: string;
    driverPhone: string;
    pickupDate: string;
    pickupTime: string;
    routeStart: string;
    routeEnd: string;
    bookingCode: string;
  }) => `✅ *Booking Anda Dikonfirmasi!*

Halo ${params.guestName}, booking Lombok Transfer Anda siap! 🎉

📋 *Kode Booking:* ${params.bookingCode}
🗓️ *Penjemputan:* ${params.pickupDate} pukul ${params.pickupTime}
📍 *Dari:* ${params.routeStart}
📍 *Tujuan:* ${params.routeEnd}
👨‍✈️ *Supir:* ${params.driverName}
📱 *WA Supir:* wa.me/${params.driverPhone}

Silahkan hubungi supir Anda jika ada pertanyaan.
Terima kasih telah memilih Lombok Transfer! 🙏`,

  /** Konfirmasi booking ke tamu (English) */
  guestConfirmationEN: (params: {
    guestName: string;
    driverName: string;
    driverPhone: string;
    pickupDate: string;
    pickupTime: string;
    routeStart: string;
    routeEnd: string;
    bookingCode: string;
  }) => `✅ *Your Booking is Confirmed!*

Hello ${params.guestName}, your Lombok Transfer is ready! 🎉

📋 *Booking Code:* ${params.bookingCode}
🗓️ *Pickup:* ${params.pickupDate} at ${params.pickupTime}
📍 *From:* ${params.routeStart}
📍 *To:* ${params.routeEnd}
👨‍✈️ *Driver:* ${params.driverName}
📱 *Driver WhatsApp:* wa.me/${params.driverPhone}

Please contact your driver if you have any questions.
Thank you for choosing Lombok Transfer! 🙏`,

  /** Reminder H-1 ke tamu */
  reminderHMin1: (params: {
    guestName: string;
    driverName: string;
    driverPhone: string;
    pickupDate: string;
    pickupTime: string;
    routeStart: string;
  }) => `⏰ *Reminder Penjemputan Besok!*

Halo ${params.guestName}!

Mengingatkan bahwa penjemputan Anda dijadwalkan:
📅 *${params.pickupDate}* pukul *${params.pickupTime}*
📍 *Lokasi:* ${params.routeStart}
👨‍✈️ *Supir:* ${params.driverName} — wa.me/${params.driverPhone}

Sampai jumpa besok! 🚗`,

  /** Reminder 3 jam sebelum trip ke supir */
  driverReminder3Hours: (params: {
    guestName: string;
    routeStart: string;
    pickupTime: string;
  }) => `⏰ *Reminder: Trip dalam 3 jam!*

Tamu: *${params.guestName}*
Rute: *${params.routeStart}*
Jam Jemput: *${params.pickupTime}*

Pastikan kendaraan siap dan Anda sudah menuju lokasi tepat waktu! 🚗`,

  /** Laporan harian ke owner */
  dailyReport: (params: {
    date: string;
    totalBookings: number;
    completedTrips: number;
    cancelledTrips: number;
    totalRevenue: number;
    activeDrivers: number;
  }) => `📊 *Laporan Harian — ${params.date}*

• Booking masuk: ${params.totalBookings}
• Trip selesai: ${params.completedTrips}
• Dibatalkan: ${params.cancelledTrips}
• Pendapatan: Rp ${params.totalRevenue.toLocaleString("id-ID")}
• Supir aktif: ${params.activeDrivers}

_Dikirim otomatis oleh sistem Lombok Transfer._`,

  /** Post-trip review request */
  reviewRequest: (params: {
    guestName: string;
    googleReviewLink: string;
    klookReviewLink?: string;
  }) => `🙏 *Terima kasih telah menggunakan Lombok Transfer!*

Halo ${params.guestName}, kami berharap perjalanan Anda menyenangkan.

Kami sangat menghargai ulasan Anda:
⭐ Google Review: ${params.googleReviewLink}
${params.klookReviewLink ? `⭐ Klook Review: ${params.klookReviewLink}` : ""}

Sampai jumpa di perjalanan berikutnya! 🌴`,
};
