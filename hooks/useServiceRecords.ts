import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ServiceRecord {
  id: string;
  vehicle_id: string;
  service_date: string;
  service_type: string;
  km_at_service: number;
  next_service_km: number | null;
  next_service_date: string | null;
  workshop_name: string | null;
  cost: number;
  notes: string | null;
  invoice_url: string | null;
  created_at: string;
}

export function useServiceRecords(vehicleId: string | null) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const fetchRecords = useCallback(async () => {
    if (!vehicleId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("service_records")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("service_date", { ascending: false });
    
    setRecords(data || []);
    setIsLoading(false);
  }, [vehicleId, supabase]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  return { records, isLoading, refetch: fetchRecords };
}

export function useCreateServiceRecord() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const createRecord = useCallback(async (values: Omit<ServiceRecord, "id" | "created_at">) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("service_records").insert(values).select().single();
      if (error) throw error;

      // Update vehicle current & next service KM automatically
      await supabase.from("vehicles").update({
        current_km: values.km_at_service,
        last_service_km: values.km_at_service,
        next_service_km: values.next_service_km,
      }).eq("id", values.vehicle_id);

      return data;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return { createRecord, isLoading };
}
