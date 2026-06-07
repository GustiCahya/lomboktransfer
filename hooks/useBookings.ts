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
          route_id: values.route_id,
          pickup_datetime: values.pickup_datetime.toISOString(),
          pickup_address: values.pickup_address,
          dropoff_address: values.dropoff_address,
          pax_count: values.pax_count,
          luggage_count: values.luggage_count,
          gross_price: values.gross_price,
          net_price: values.gross_price, // simplified for now
          payment_method: values.payment_method,
          source: values.source,
          notes: values.notes,
          flight_number: values.flight_number,
          language_pref: values.language_pref,
          status: "pending"
        })
        .select()
        .single();

      if (err) throw err;
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
