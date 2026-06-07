/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";

export function useRevenue(filters?: { 
  startDate?: string, 
  endDate?: string, 
  source?: string,
  payment_status?: string
}) {
  const fetcher = async () => {
    const supabase = createClient();
    let query = supabase
      .from("bookings")
      .select("*, routes(name, base_price), guests(full_name), drivers(full_name)")
      .order("pickup_datetime", { ascending: false });

    if (filters?.startDate) query = query.gte("pickup_datetime", filters.startDate);
    if (filters?.endDate) query = query.lte("pickup_datetime", filters.endDate);
    if (filters?.source) query = query.eq("source", filters.source);
    if (filters?.payment_status) query = query.eq("payment_status", filters.payment_status);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading } = useSWR(
    ["revenue", filters],
    fetcher
  );

  return {
    revenueList: data || [],
    isLoading,
    isError: error
  };
}
