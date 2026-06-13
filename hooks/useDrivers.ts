import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DriverFormValues } from "@/lib/validations/driver";

export interface Driver {
  id: string;
  full_name: string;
  nik: string;
  phone_wa: string;
  email: string | null;
  status: "active" | "inactive" | "cuti";
  employment_type: "karyawan" | "mitra_lepas";
  commission_percentage: number;
  joined_at: string | null;
  date_of_birth: string | null;
  address: string | null;
  bank_name: string | null;
  bank_account: string | null;
  bank_account_name: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  avatar_url: string | null;
  notes: string | null;
  vehicle_id: string | null;
}

export function useDrivers(filters?: { status?: string; employment_type?: string; search?: string }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchDrivers = useCallback(async () => {
    try {
      setIsLoading(true);
      let query = supabase.from("drivers").select("*").order("full_name");

      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.employment_type) query = query.eq("employment_type", filters.employment_type);
      if (filters?.search) query = query.ilike("full_name", `%${filters.search}%`);

      const { data, error: err } = await query;
      if (err) throw err;
      setDrivers(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, filters?.status, filters?.employment_type, filters?.search]);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  return { drivers, isLoading, error, refetch: fetchDrivers };
}

export function useDriver(id: string | null) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    supabase
      .from("drivers")
      .select("*, vehicles(brand, model, plate_number)")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err);
        else setDriver(data);
        setIsLoading(false);
      });
  }, [id, supabase]);

  return { driver, isLoading, error };
}

export function useCreateDriver() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const createDriver = useCallback(async (values: DriverFormValues) => {
    setIsLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("drivers")
        .insert({
          ...values,
          date_of_birth: values.date_of_birth?.toISOString(),
          joined_at: values.joined_at?.toISOString() ?? new Date().toISOString(),
        })
        .select()
        .single();
      if (err) throw err;
      return data;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error("Unknown error");
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return { createDriver, isLoading, error };
}

export function useUpdateDriver(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const updateDriver = useCallback(async (values: Partial<DriverFormValues>) => {
    setIsLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("drivers")
        .update({
          ...values,
          date_of_birth: values.date_of_birth?.toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (err) throw err;
      return data;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error("Unknown error");
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [id, supabase]);

  return { updateDriver, isLoading, error };
}

export function useDriverTrips(driverId: string | null, period?: { month: number; year: number }) {
  const [trips, setTrips] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!driverId) return;
    setIsLoading(true);

    let query = supabase
      .from("bookings")
      .select("*, routes(name), guests(full_name)")
      .eq("driver_id", driverId)
      .order("pickup_datetime", { ascending: false });

    if (period) {
      const start = new Date(period.year, period.month - 1, 1).toISOString();
      const end = new Date(period.year, period.month, 0, 23, 59, 59).toISOString();
      query = query.gte("pickup_datetime", start).lte("pickup_datetime", end);
    }

    query.then(({ data }) => {
      setTrips(data || []);
      setIsLoading(false);
    });
  }, [driverId, period?.month, period?.year, supabase]);

  return { trips, isLoading };
}

export function useDriverPerformance(driverId: string | null) {
  const [performance, setPerformance] = useState<{
    avg_rating: number;
    total_trips: number;
    completed_trips: number;
    completion_rate: number;
    on_time_rate: number;
    total_complaints: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!driverId) return;
    setIsLoading(true);

    supabase
      .from("bookings")
      .select("status, rating_driver")
      .eq("driver_id", driverId)
      .then(({ data }) => {
        if (!data) { setIsLoading(false); return; }
        const total = data.length;
        const completed = data.filter(b => b.status === "completed").length;
        const ratings = data.filter(b => b.rating_driver != null).map(b => b.rating_driver as number);
        const avg_rating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

        setPerformance({
          avg_rating: Math.round(avg_rating * 10) / 10,
          total_trips: total,
          completed_trips: completed,
          completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
          on_time_rate: 96, // placeholder until on_time field is tracked
          total_complaints: 0,
        });
        setIsLoading(false);
      });
  }, [driverId, supabase]);

  return { performance, isLoading };
}
