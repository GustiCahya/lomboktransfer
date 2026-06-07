import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  base_price: number;
  is_active: boolean;
  estimated_duration_min: number | null;
}

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRoutes() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("routes")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;
        setRoutes(data || []);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, [supabase]);

  return { routes, isLoading, error };
}
