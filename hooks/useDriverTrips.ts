import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Mock logged-in driver for development
// In production, this would come from Supabase Auth & custom claims
const getMockDriverId = async (supabase: any) => {
  const { data } = await supabase.from('drivers').select('id').eq('status', 'active').limit(1).single();
  return data?.id;
};

export function useDriverTrips() {
  const [todayTrips, setTodayTrips] = useState<any[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const driverId = await getMockDriverId(supabase);
      if (!driverId) return;

      const todayStr = new Date().toLocaleDateString('sv-SE');
      const startOfToday = `${todayStr}T00:00:00.000Z`;
      const endOfToday = `${todayStr}T23:59:59.999Z`;

      // 1. Fetch Today's Trips
      const { data: todayData } = await supabase
        .from('bookings')
        .select('*, guests(full_name, phone_wa), routes(name, start_location, end_location), vehicles(brand, model, plate_number)')
        .eq('driver_id', driverId)
        .gte('pickup_datetime', startOfToday)
        .lte('pickup_datetime', endOfToday)
        .order('pickup_datetime', { ascending: true });

      setTodayTrips(todayData || []);

      // 2. Fetch Upcoming Trips (from Tomorrow onwards)
      const { data: upcomingData } = await supabase
        .from('bookings')
        .select('*, guests(full_name, phone_wa), routes(name, start_location, end_location), vehicles(brand, model, plate_number)')
        .eq('driver_id', driverId)
        .gt('pickup_datetime', endOfToday)
        .order('pickup_datetime', { ascending: true })
        .limit(10); // next 10 trips

      setUpcomingTrips(upcomingData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTrips();
    
    const channel = supabase
      .channel('driver_trips_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchTrips();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTrips, supabase]);

  const updateTripStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state optimistically
      setTodayTrips(prev => prev.map(t => t.id === bookingId ? { ...t, status: newStatus } : t));
      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      return false;
    }
  };

  return { todayTrips, upcomingTrips, isLoading, refetch: fetchTrips, updateTripStatus };
}
