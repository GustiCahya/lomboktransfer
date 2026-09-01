import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookingFormValues } from "@/lib/validations/booking";

export function useBookings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("bookings")
        .select(`
          *,
          guests(full_name, nationality),
          routes(name),
          drivers(full_name)
        `)
        .order("pickup_datetime", { ascending: false });

      if (err) throw err;
      return data;
    } catch (err: any) {
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const fetchBooking = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("bookings")
        .select(`
          *,
          guests(*),
          routes(*),
          drivers(*),
          vehicles(*)
        `)
        .eq("id", id)
        .single();

      if (err) throw err;
      return data;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const createBooking = useCallback(async (values: BookingFormValues, guestId: string) => {
    setIsLoading(true);
    try {
      // Auto generate booking code logic goes here or on Postgres function
      const bookingCode = `LT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const { data, error: err } = await supabase
        .from("bookings")
        .insert({
          booking_code: bookingCode,
          guest_id: guestId,
          
          // Legacy fallbacks computed from trips if available
          route_id: values.route_id || null,
          pickup_datetime: values.trips.length > 0 ? values.trips[0].trip_date.toISOString() : (values.pickup_datetime?.toISOString() || new Date().toISOString()),
          pickup_address: values.trips.length > 0 ? values.trips[0].pickup_address : values.pickup_address,
          dropoff_address: values.trips.length > 0 ? values.trips[values.trips.length - 1].dropoff_address : values.dropoff_address,
          
          pax_count: values.total_passengers,
          luggage_count: values.total_luggage,
          gross_price: values.gross_price,
          net_price: values.gross_price, // simplified for now
          payment_method: values.payment_method,
          source: values.source,
          
          // New fields
          receipt_number: values.receipt_number || null,
          deposit_amount: values.deposit_amount,
          deposit_paid_at: values.deposit_paid_at?.toISOString() || null,
          deposit_method: values.deposit_method || null,
          balance_due: values.balance_due,
          total_passengers: values.total_passengers,
          total_luggage: values.total_luggage,
          receipt_status: values.receipt_status,
          inclusions: values.inclusions ? values.inclusions.split('\n').filter(i => i.trim() !== '') : [],
          terms_notes: values.terms_notes || null,
          
          notes: values.notes,
          flight_number: values.flight_number,
          language_pref: values.language_pref,
          status: "pending"
        })
        .select()
        .single();

      if (err) throw err;

      // Insert trips if provided
      if (values.trips && values.trips.length > 0) {
        const tripsToInsert = values.trips.map((trip, idx) => ({
          booking_id: data.id,
          trip_order: idx + 1,
          trip_date: trip.trip_date.toISOString(),
          pickup_time: trip.pickup_time || null,
          service_name: trip.service_name,
          service_description: trip.service_description || null,
          pickup_address: trip.pickup_address || null,
          dropoff_address: trip.dropoff_address || null,
          price: trip.price
        }));

        const { error: tripsErr } = await supabase.from("booking_trips").insert(tripsToInsert);
        if (tripsErr) throw tripsErr;
      }

      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return {
    fetchBookings,
    fetchBooking,
    createBooking,
    isLoading,
    error
  };
}
