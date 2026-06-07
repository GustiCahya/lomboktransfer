import useSWR, { mutate } from "swr";
import { supabase } from "@/lib/supabase/client";

export function usePayrollList(periodMonth: number, periodYear: number) {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from("payroll")
      .select("*, drivers(full_name, bank_name, bank_account_number, bank_account_name, commission_percentage)")
      .eq("period_month", periodMonth)
      .eq("period_year", periodYear);

    if (error) throw error;
    return data;
  };

  const { data, error, isLoading } = useSWR(
    ["payroll", periodMonth, periodYear],
    fetcher
  );

  return {
    payrollList: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useGeneratePayroll() {
  const generate = async (periodMonth: number, periodYear: number) => {
    // Determine date range for the month
    const startDate = new Date(periodYear, periodMonth - 1, 1).toISOString();
    const endDate = new Date(periodYear, periodMonth, 0, 23, 59, 59).toISOString();

    // Fetch all completed bookings in that period
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("driver_id, gross_price, drivers(commission_percentage)")
      .eq("status", "completed")
      .gte("pickup_datetime", startDate)
      .lte("pickup_datetime", endDate);

    if (bookingsError) throw bookingsError;

    // Aggregate by driver
    const payrollMap = new Map();

    bookings?.forEach((booking: any) => {
      if (!booking.driver_id) return;
      
      const driverId = booking.driver_id;
      const commissionPct = booking.drivers?.commission_percentage || 20;
      const commissionAmt = booking.gross_price * (commissionPct / 100);

      if (!payrollMap.has(driverId)) {
        payrollMap.set(driverId, {
          driver_id: driverId,
          period_month: periodMonth,
          period_year: periodYear,
          total_trips: 0,
          gross_revenue: 0,
          commission_pct: commissionPct,
          commission_amt: 0,
          bonus: 0,
          deduction: 0,
          net_payable: 0,
          status: 'draft'
        });
      }

      const record = payrollMap.get(driverId);
      record.total_trips += 1;
      record.gross_revenue += booking.gross_price;
      record.commission_amt += commissionAmt;
      record.net_payable = record.commission_amt + record.bonus - record.deduction;
    });

    const payrollRecords = Array.from(payrollMap.values());

    if (payrollRecords.length > 0) {
      // Manually check and update/insert to avoid needing composite unique constraint
      for (const record of payrollRecords) {
        const { data: existing } = await supabase
          .from("payroll")
          .select("id")
          .eq("driver_id", record.driver_id)
          .eq("period_month", record.period_month)
          .eq("period_year", record.period_year)
          .maybeSingle();

        if (existing) {
          await supabase.from("payroll").update(record).eq("id", existing.id);
        } else {
          await supabase.from("payroll").insert([record]);
        }
      }
    }
    
    // Invalidate payroll list cache
    mutate((key: any) => Array.isArray(key) && key[0] === "payroll");
    
    return payrollRecords;
  };

  return { generate };
}
