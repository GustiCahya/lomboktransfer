export interface BookingTrip {
  id: string;
  booking_id: string;
  trip_order: number;
  trip_date: string;        // ISO date string "2026-09-16"
  pickup_time: string | null; // "10:00:00"
  service_name: string;
  service_description: string | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  price: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes: string | null;
}

export interface BookingGuest {
  id: string;
  full_name: string;
  email: string | null;
  phone_wa: string | null;
  nationality: string | null;
  language: string | null;
}

export interface BookingReceipt {
  id: string;
  booking_code: string;           // "LT-2026-0038"
  receipt_number: string | null;  // "REC-2026-0038"
  receipt_status: 'pending' | 'deposit_received' | 'fully_paid' | 'cancelled';
  gross_price: number;
  deposit_amount: number;
  deposit_paid_at: string | null; // ISO date "2026-09-01"
  deposit_method: string | null;  // "wise"
  balance_due: number;
  total_passengers: number;
  total_luggage: number;
  source: string | null;
  payment_method: string | null;
  payment_status: string;
  inclusions: string[] | null;
  terms_notes: string | null;
  notes: string | null;
  language_pref: string | null;
  created_at: string;
  // Relations
  guest: BookingGuest;
  trips: BookingTrip[];
}
