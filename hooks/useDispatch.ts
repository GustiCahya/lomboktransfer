import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useDispatch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  /**
   * Fetch dispatch events based on booking trips for a given date range.
   * @param startIso  ISO string for the start of the range
   * @param endIso    ISO string for the end of the range
   */
  const fetchDispatchEvents = useCallback(async (startIso: string, endIso: string) => {
    setIsLoading(true);
    try {
      const startDateStr = startIso.slice(0, 10);
      const endDateStr = endIso.slice(0, 10);

      // 1. Fetch individual trips from booking_trips table
      const { data: tripsData, error: tripsErr } = await supabase
        .from("booking_trips")
        .select(`
          id,
          booking_id,
          trip_order,
          trip_date,
          pickup_time,
          service_name,
          service_description,
          pickup_address,
          dropoff_address,
          status,
          driver_id,
          vehicle_id,
          drivers(full_name),
          vehicles(unit_code, brand, plate_number),
          routes(name),
          bookings(
            id,
            booking_code,
            status,
            pax_count,
            guests(full_name),
            drivers(full_name),
            vehicles(unit_code, brand, plate_number)
          )
        `)
        .gte("trip_date", startDateStr)
        .lte("trip_date", endDateStr)
        .order("trip_date", { ascending: true });

      if (tripsErr) throw tripsErr;

      // 2. Fetch bookings for fallback if a booking has no booking_trips entries
      const { data: bookingsData, error: bookingsErr } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_code,
          pickup_datetime,
          status,
          pax_count,
          guests(full_name),
          routes(name),
          drivers(full_name),
          vehicles(unit_code, brand, plate_number)
        `)
        .gte("pickup_datetime", startIso)
        .lte("pickup_datetime", endIso)
        .order("pickup_datetime", { ascending: true });

      if (bookingsErr) throw bookingsErr;

      const events: any[] = [];
      const bookingIdsWithTrips = new Set<string>();

      if (tripsData) {
        for (const trip of tripsData as any[]) {
          const booking = trip.bookings || {};
          bookingIdsWithTrips.add(trip.booking_id);

          const tripDateStr = String(trip.trip_date).split("T")[0];
          let timeStr = trip.pickup_time || "08:00:00";
          if (timeStr.length === 5) timeStr += ":00";

          events.push({
            id: trip.id,
            booking_id: trip.booking_id || booking.id,
            booking_code: booking.booking_code || "LT-BOOKING",
            trip_order: trip.trip_order || 1,
            pickup_datetime: `${tripDateStr}T${timeStr}`,
            status: trip.status || booking.status || "confirmed",
            pax_count: booking.pax_count || 1,
            service_name: trip.service_name,
            pickup_address: trip.pickup_address,
            dropoff_address: trip.dropoff_address,
            guests: booking.guests || null,
            routes: trip.routes?.name ? trip.routes : (trip.service_name ? { name: trip.service_name } : null),
            drivers: trip.drivers || booking.drivers || null,
            vehicles: trip.vehicles || booking.vehicles || null,
          });
        }
      }

      if (bookingsData) {
        for (const b of bookingsData as any[]) {
          if (!bookingIdsWithTrips.has(b.id)) {
            events.push({
              id: b.id,
              booking_id: b.id,
              booking_code: b.booking_code,
              pickup_datetime: b.pickup_datetime,
              status: b.status,
              pax_count: b.pax_count,
              guests: b.guests,
              routes: b.routes,
              drivers: b.drivers,
              vehicles: b.vehicles,
            });
          }
        }
      }

      events.sort((a, b) => new Date(a.pickup_datetime).getTime() - new Date(b.pickup_datetime).getTime());
      return events;
    } catch (err: unknown) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return {
    fetchDispatchEvents,
    isLoading,
    error,
  };
}
