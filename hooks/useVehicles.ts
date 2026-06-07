import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { VehicleFormValues } from "@/lib/validations/vehicle";

export interface Vehicle {
  id: string;
  unit_code: string;
  plate_number: string;
  brand: string;
  model: string;
  year: number;
  color: string | null;
  capacity: number;
  status: "active" | "maintenance" | "inactive" | "sold";
  current_km: number;
  last_service_km: number | null;
  next_service_km: number | null;
  photo_url: string | null;
  default_driver_id: string | null;
  created_at: string;
}

export function useVehicles(filters?: { status?: string; search?: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      let query = supabase.from("vehicles").select("*").order("unit_code");

      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.search) {
        query = query.or(`unit_code.ilike.%${filters.search}%,plate_number.ilike.%${filters.search}%`);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setVehicles(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, filters?.status, filters?.search]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  return { vehicles, isLoading, error, refetch: fetchVehicles };
}

export function useVehicle(id: string | null) {
  const [vehicle, setVehicle] = useState<(Vehicle & { drivers?: { full_name: string } }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    supabase
      .from("vehicles")
      .select("*, drivers(full_name)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setVehicle(data);
        setIsLoading(false);
      });
  }, [id, supabase]);

  return { vehicle, isLoading };
}

export function useCreateVehicle() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const createVehicle = useCallback(async (values: VehicleFormValues) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("vehicles").insert(values).select().single();
      if (error) throw error;
      return data;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return { createVehicle, isLoading };
}
