import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Reusing same mock mechanism
const getMockDriverId = async (supabase: any) => {
  const { data } = await supabase.from('drivers').select('id').eq('status', 'active').limit(1).single();
  return data?.id;
};

export function useDriverProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const driverId = await getMockDriverId(supabase);
      if (!driverId) return;

      const { data } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', driverId)
        .single();

      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, refetch: fetchProfile };
}
