import { z } from "zod";

export const tripSchema = z.object({
  trip_date: z.date({ message: "Tanggal trip wajib diisi" }),
  pickup_time: z.string().optional(),
  service_name: z.string().min(1, "Nama servis wajib diisi"),
  service_description: z.string().optional(),
  pickup_address: z.string().optional(),
  dropoff_address: z.string().optional(),
  price: z.number().min(0).default(0),
});

export const bookingSchema = z.object({
  guest_name: z.string().min(1, "Nama tamu wajib diisi"),
  phone_wa: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  nationality: z.string().optional(),
  
  // Legacy fields (optional for multi-trip)
  route_id: z.string().optional(),
  pickup_datetime: z.date().optional(),
  pickup_address: z.string().optional(),
  dropoff_address: z.string().optional(),
  pax_count: z.number().min(1).max(20).optional(),
  luggage_count: z.number().min(0).default(0).optional(),
  
  // New global fields
  total_passengers: z.number().min(1).max(20).default(1),
  total_luggage: z.number().min(0).default(0),
  gross_price: z.number().min(0).default(0),
  payment_method: z.enum(["cash", "transfer", "ota_settlement", "wise"]),
  source: z.enum(["direct", "klook", "viator", "traveloka", "getyourguide", "trip_com", "whatsapp", "manual"]),
  
  // Receipt & Deposit fields
  receipt_number: z.string().optional(),
  deposit_amount: z.number().min(0).default(0),
  deposit_paid_at: z.date().optional(),
  deposit_method: z.string().optional(),
  balance_due: z.number().min(0).default(0),
  receipt_status: z.enum(["pending", "deposit_received", "fully_paid", "cancelled"]).default("pending"),
  
  // Additional details
  inclusions: z.string().optional(), // Handled as textarea in UI
  terms_notes: z.string().optional(),
  notes: z.string().optional(),
  flight_number: z.string().optional(),
  language_pref: z.enum(["en", "id", "zh"]).optional(),
  
  // Dynamic trips
  trips: z.array(tripSchema).default([]),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
