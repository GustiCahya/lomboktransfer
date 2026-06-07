import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useDispatch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchDispatchEvents = useCallback(async (dateStr: string) => {
    setIsLoading(true);
    try {
      // Create date bounds for the selected day in local time (or UTC depending on how it's stored)
      // Assuming dateStr is 'YYYY-MM-DD'
      const startOfDay = new Date(`${dateStr}T00:00:00`).toISOString();
      const endOfDay = new Date(`${dateStr}T23:59:59.999`).toISOString();

      const { data, error: err } = await supabase
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
        .gte("pickup_datetime", startOfDay)
        .lte("pickup_datetime", endOfDay)
        .order("pickup_datetime", { ascending: true });

      if (err) throw err;
      return data;
    } catch (err: any) {
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return {
    fetchDispatchEvents,
    isLoading,
    error
  };
}
