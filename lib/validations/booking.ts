import { z } from "zod";

export const bookingSchema = z.object({
  guest_name: z.string().min(1, "Nama tamu wajib diisi"),
  phone_wa: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  nationality: z.string().optional(),
  route_id: z.string().min(1, "Pilih rute"),
  pickup_datetime: z.date({ message: "Tanggal & jam wajib diisi" }),
  pickup_address: z.string().optional(),
  dropoff_address: z.string().optional(),
  pax_count: z.number().min(1, "Minimal 1 penumpang").max(20, "Maksimal 20 penumpang"),
  luggage_count: z.number().min(0).default(0),
  gross_price: z.number().min(0),
  payment_method: z.enum(["cash", "transfer", "ota_settlement"]),
  source: z.enum(["direct", "klook", "viator", "traveloka", "getyourguide", "trip_com", "whatsapp", "manual"]),
  notes: z.string().optional(),
  flight_number: z.string().optional(),
  language_pref: z.enum(["en", "id", "zh"]).optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
