import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface DashboardStats {
  todayBookingsCount: number;
  activeTripsCount: number;
  availableDriversCount: number;
  totalDriversCount: number;
  standbyVehiclesCount: number;
  totalVehiclesCount: number;
  pendingAssignCount: number;
  estimatedRevenueToday: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    todayBookingsCount: 0,
    activeTripsCount: 0,
    availableDriversCount: 0,
    totalDriversCount: 0,
    standbyVehiclesCount: 0,
    totalVehiclesCount: 0,
    pendingAssignCount: 0,
    estimatedRevenueToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    
    // We get today's date in local ISO format prefix
    const todayStr = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
    const startOfToday = `${todayStr}T00:00:00.000Z`;
    const endOfToday = `${todayStr}T23:59:59.999Z`;

    // 1. Bookings Today
    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, status, gross_price")
      .gte("pickup_datetime", startOfToday)
      .lte("pickup_datetime", endOfToday);

    const safeBookings = bookings || [];
    
    // 2. Active Trips (status = in_progress)
    const { count: activeTrips } = await supabase
      .from("bookings")
      .select("id", { count: "exact" })
      .eq("status", "in_progress");

    // 3. Pending Assign
    const { count: pendingAssign } = await supabase
      .from("bookings")
      .select("id", { count: "exact" })
      .eq("status", "confirmed")
      .is("driver_id", null);

    // 4. Drivers
    const { data: drivers } = await supabase.from("drivers").select("id, status").neq("status", "inactive");
    const safeDrivers = drivers || [];
    
    // 5. Vehicles
    const { data: vehicles } = await supabase.from("vehicles").select("id, status").neq("status", "sold");
    const safeVehicles = vehicles || [];

    setStats({
      todayBookingsCount: safeBookings.length,
      activeTripsCount: activeTrips || 0,
      availableDriversCount: safeDrivers.filter(d => d.status === "active").length,
      totalDriversCount: safeDrivers.length,
      standbyVehiclesCount: safeVehicles.filter(v => v.status === "active").length,
      totalVehiclesCount: safeVehicles.length,
      pendingAssignCount: pendingAssign || 0,
      estimatedRevenueToday: safeBookings.reduce((sum, b) => sum + Number(b.gross_price), 0),
    });
    
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchStats();

    // Set up real-time subscription for Bookings table changes to refresh stats
    const channel = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStats, supabase]);

  return { stats, isLoading, refetch: fetchStats };
}
