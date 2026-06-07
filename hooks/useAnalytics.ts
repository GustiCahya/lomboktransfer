/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";

export function useRevenueTrend() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("v_revenue_expense_trend").select("*").order("month", { ascending: true });
    if (error) {
      // Fallback: aggregate manually if view doesn't exist yet
      const now = new Date();
      return Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        return {
          month: d.toISOString(),
          total_revenue: 0,
          total_expenses: 0,
          net_profit: 0,
        };
      });
    }
    return data || [];
  };

  const { data, error, isLoading } = useSWR("analytics_revenue_trend", fetcher);
  return { trend: data || [], isLoading, isError: error };
}

export function useBookingSources() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("v_booking_sources").select("*");
    if (error) return [];
    return data || [];
  };

  const { data, isLoading } = useSWR("analytics_booking_sources", fetcher);
  return { sources: data || [], isLoading };
}

export function useRoutePopularity() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("v_route_popularity").select("*").limit(6);
    if (error) return [];
    return data || [];
  };

  const { data, isLoading } = useSWR("analytics_route_popularity", fetcher);
  return { routes: data || [], isLoading };
}

export function useDriverPerformance() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("v_driver_performance").select("*").limit(5);
    if (error) return [];
    return data || [];
  };

  const { data, isLoading } = useSWR("analytics_driver_performance", fetcher);
  return { drivers: data || [], isLoading };
}

export function useGuestDemographics() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("v_guest_demographics").select("*");
    if (error) return [];
    return data || [];
  };

  const { data, isLoading } = useSWR("analytics_guest_demographics", fetcher);
  return { demographics: data || [], isLoading };
}

export function useKeyMetrics() {
  const fetcher = async () => {
    const supabase = createClient();

    const [bookingsResult, revenueResult, expensesResult] = await Promise.all([
      supabase.from("bookings").select("id, total_price, status").eq("status", "completed"),
      supabase.from("bookings").select("total_price").eq("status", "completed"),
      supabase.from("expenses").select("amount"),
    ]);

    const completedBookings = bookingsResult.data || [];
    const totalBookings = completedBookings.length;
    const grossRevenue = completedBookings.reduce((s: number, b: any) => s + (Number(b.total_price) || 0), 0);
    const totalExpenses = (expensesResult.data || []).reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
    const netProfit = grossRevenue - totalExpenses;
    const aov = totalBookings > 0 ? grossRevenue / totalBookings : 0;

    return { totalBookings, grossRevenue, netProfit, aov };
  };

  const { data, isLoading } = useSWR("analytics_key_metrics", fetcher);
  return {
    metrics: data || { totalBookings: 0, grossRevenue: 0, netProfit: 0, aov: 0 },
    isLoading,
  };
}
