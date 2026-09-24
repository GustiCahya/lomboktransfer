import { NextRequest, NextResponse } from "next/server";
import { OPENROUTER_BASE_URL, OPENROUTER_MODEL, OpenRouterResponse } from "@/lib/ai/openrouter";

type FormType = "booking" | "driver" | "vehicle";

const SYSTEM_PROMPTS: Record<FormType, string> = {
  booking: `Kamu adalah asisten ekstraksi data pemesanan untuk Lombok Transfer.
Tugasmu: baca teks bebas (chat WhatsApp, email, atau pesan apapun) dan ekstrak informasi pemesanan ke dalam format JSON yang tepat.

PENTING: Respons kamu HANYA boleh berupa JSON murni. Tidak boleh ada teks tambahan, penjelasan, atau markdown. Hanya JSON.

Field yang harus diekstrak (semua opsional kecuali disebutkan):
- guest_name: string (nama tamu)
- phone_wa: string (nomor WhatsApp, format Indonesia: 08xx atau +62xx)
- email: string (alamat email)
- nationality: string (kewarganegaraan, contoh: "Indonesian", "Australian")
- total_passengers: number (jumlah penumpang, min 1)
- total_luggage: number (jumlah koper/bagasi, default 0)
- gross_price: number (harga total dalam IDR, angka saja tanpa titik/koma)
- payment_method: "cash" | "transfer" | "ota_settlement" | "wise"
- source: "direct" | "klook" | "viator" | "traveloka" | "getyourguide" | "trip_com" | "whatsapp" | "manual"
- flight_number: string (nomor penerbangan jika ada)
- notes: string (catatan tambahan)
- language_pref: "en" | "id" | "zh"
- trips: array of trip objects with fields:
  - trip_date: string format "YYYY-MM-DD"
  - pickup_time: string format "HH:mm"
  - service_name: string (nama layanan/rute)
  - pickup_address: string
  - dropoff_address: string
  - price: number (harga per trip dalam IDR)

Aturan:
- Jika ada info tanggal, konversi ke "YYYY-MM-DD". Tahun saat ini adalah ${new Date().getFullYear()}.
- Jika source tidak jelas tapi ada nomor WA, gunakan "whatsapp".
- Jika ada kata "klook", "viator", "traveloka", "getyourguide", "trip.com" → set source sesuai.
- Jika jumlah penumpang tidak disebutkan, jangan masukkan field total_passengers.
- Hanya masukkan field yang memang ada datanya dalam teks. Jangan asumsikan atau tambah data fiktif.
- Untuk trips: jika ada informasi jadwal perjalanan, masukkan ke dalam array trips.

Contoh output:
{"guest_name":"John Smith","phone_wa":"081234567890","total_passengers":2,"source":"whatsapp","trips":[{"trip_date":"2024-03-15","pickup_time":"08:00","service_name":"Airport Transfer","pickup_address":"Lombok International Airport","dropoff_address":"Senggigi Beach Hotel","price":350000}]}`,

  driver: `Kamu adalah asisten ekstraksi data supir untuk Lombok Transfer.
Tugasmu: baca teks bebas dan ekstrak informasi data supir ke dalam format JSON yang tepat.

PENTING: Respons kamu HANYA boleh berupa JSON murni. Tidak boleh ada teks tambahan, penjelasan, atau markdown. Hanya JSON.

Field yang harus diekstrak (semua opsional kecuali disebutkan):
- full_name: string (nama lengkap sesuai KTP)
- nik: string (16 digit angka)
- phone_wa: string (nomor WhatsApp, format Indonesia: 08xx atau +62xx)
- email: string
- address: string (alamat lengkap)
- bank_name: string (nama bank, contoh: "BCA", "BNI", "Mandiri")
- bank_account: string (nomor rekening)
- bank_account_name: string (nama pemilik rekening)
- emergency_contact_name: string
- emergency_contact_phone: string
- employment_type: "karyawan" | "mitra_lepas"
- commission_percentage: number (0-100, default 20)
- notes: string

Hanya masukkan field yang memang ada datanya. Jangan asumsikan data.`,

  vehicle: `Kamu adalah asisten ekstraksi data kendaraan untuk Lombok Transfer.
Tugasmu: baca teks bebas dan ekstrak informasi kendaraan ke dalam format JSON yang tepat.

PENTING: Respons kamu HANYA boleh berupa JSON murni. Tidak boleh ada teks tambahan, penjelasan, atau markdown. Hanya JSON.

Field yang harus diekstrak (semua opsional kecuali disebutkan):
- unit_code: string (kode unit internal, contoh: "LT-01")
- plate_number: string (nomor polisi, contoh: "DR 1234 AB")
- brand: string (merek kendaraan, contoh: "Toyota", "Honda")
- model: string (model kendaraan, contoh: "Innova Reborn", "Hiace")
- year: number (tahun pembuatan 4 digit)
- color: string (warna kendaraan)
- capacity: number (kapasitas penumpang)
- current_km: number (odometer saat ini dalam KM)
- next_service_km: number (target KM servis berikutnya)
- vin: string (nomor rangka)
- engine_number: string (nomor mesin)
- status: "active" | "maintenance" | "inactive"
- notes: string

Hanya masukkan field yang memang ada datanya. Jangan asumsikan data.`,
};

async function callOpenRouter(systemPrompt: string, userText: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY tidak dikonfigurasi");

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "Lombok Transfer",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      max_tokens: 1024,
      temperature: 0.1, // Low temp for deterministic JSON extraction
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || "{}";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, formType } = body as { rawText: string; formType: FormType };

    if (!rawText?.trim()) {
      return NextResponse.json({ error: "rawText wajib diisi" }, { status: 400 });
    }

    if (!formType || !SYSTEM_PROMPTS[formType]) {
      return NextResponse.json(
        { error: "formType tidak valid. Gunakan: booking | driver | vehicle" },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[formType];
    const rawResponse = await callOpenRouter(systemPrompt, rawText.trim());

    // Strip markdown code fences if AI wrapped response in them
    const cleaned = rawResponse
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    // Parse and validate it's actual JSON
    let parsedData: Record<string, unknown>;
    try {
      parsedData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI gagal menghasilkan JSON yang valid. Coba lagi dengan teks yang lebih jelas.", rawResponse },
        { status: 422 }
      );
    }

    return NextResponse.json({ data: parsedData });
  } catch (error) {
    console.error("AI Form Fill API error:", error);
    return NextResponse.json(
      { error: "Gagal menghubungi AI. Periksa koneksi atau coba lagi." },
      { status: 500 }
    );
  }
}
