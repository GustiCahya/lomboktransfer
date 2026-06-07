import useSWR, { mutate } from "swr";
import { supabase } from "@/lib/supabase/client";

export function useExpenses(filters?: { 
  startDate?: string, 
  endDate?: string, 
  category?: string,
  vendor_id?: string
}) {
  const fetcher = async () => {
    let query = supabase.from("expenses").select("*, vendors(name)").order("expense_date", { ascending: false });

    if (filters?.startDate) query = query.gte("expense_date", filters.startDate);
    if (filters?.endDate) query = query.lte("expense_date", filters.endDate);
    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.vendor_id) query = query.eq("vendor_id", filters.vendor_id);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading } = useSWR(
    ["expenses", filters],
    fetcher
  );

  return {
    expenses: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useCreateExpense() {
  const createExpense = async (expenseData: any) => {
    const { data, error } = await supabase
      .from("expenses")
      .insert([expenseData])
      .select()
      .single();

    if (error) throw error;
    
    // Invalidate expenses cache
    mutate((key: any) => Array.isArray(key) && key[0] === "expenses");
    
    return data;
  };

  return { createExpense };
}
