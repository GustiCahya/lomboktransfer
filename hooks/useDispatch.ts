import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useDispatch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  /**
   * Fetch bookings for a given date range.
   * @param startIso  ISO string for the start of the range (inclusive)
   * @param endIso    ISO string for the end of the range (inclusive)
   */
  const fetchDispatchEvents = useCallback(async (startIso: string, endIso: string) => {
    setIsLoading(true);
    try {
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
        .gte("pickup_datetime", startIso)
        .lte("pickup_datetime", endIso)
        .order("pickup_datetime", { ascending: true });

      if (err) throw err;
      return data ?? [];
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
