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

function normalizeVehicle(item: any): Vehicle {
  if (!item) return item;
  return {
    ...item,
    capacity: item.capacity ?? item.passenger_cap ?? 7,
  };
}

async function executeVehicleMutation(
  mutationFn: (payload: Record<string, any>) => Promise<{ data: any; error: any }>,
  values: Partial<VehicleFormValues>
) {
  const payload: Record<string, any> = { ...values };

  // Sync capacity with passenger_cap for schema compatibility
  if (payload.capacity !== undefined) {
    payload.passenger_cap = payload.capacity;
  }

  let { data, error } = await mutationFn(payload);

  // If Supabase errors due to missing column in DB schema cache, drop the missing key and retry
  let attempts = 0;
  while (error && error.message && error.message.includes("Could not find the '") && error.message.includes("column of 'vehicles'") && attempts < 5) {
    attempts++;
    const match = error.message.match(/Could not find the '([^']+)' column/);
    if (match && match[1] && match[1] in payload) {
      delete payload[match[1]];
      const retry = await mutationFn(payload);
      data = retry.data;
      error = retry.error;
    } else {
      break;
    }
  }

  if (error) throw error;
  return normalizeVehicle(data);
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
      setVehicles((data || []).map(normalizeVehicle));
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
        setVehicle(data ? { ...normalizeVehicle(data), drivers: data.drivers } : null);
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
      return await executeVehicleMutation(
        async (payload) => await supabase.from("vehicles").insert(payload).select().single(),
        values
      );
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return { createVehicle, isLoading };
}

export function useUpdateVehicle(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const updateVehicle = useCallback(async (values: Partial<VehicleFormValues>) => {
    setIsLoading(true);
    try {
      return await executeVehicleMutation(
        async (payload) => await supabase.from("vehicles").update(payload).eq("id", id).select().single(),
        values
      );
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error("Unknown error");
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [id, supabase]);

  return { updateVehicle, isLoading, error };
}

export function useDeleteVehicle() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const deleteVehicle = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { error: err } = await supabase.from("vehicles").delete().eq("id", id);
      if (err) throw err;
      return true;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error("Unknown error");
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return { deleteVehicle, isLoading, error };
}
