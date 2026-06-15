/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR, { mutate } from "swr";
import { createClient } from "@/lib/supabase/client";

export function useVendors(filters?: { category?: string, status?: string }) {
  const fetcher = async () => {
    const supabase = createClient();
    let query = supabase.from("vendors").select("*").order("name", { ascending: true });

    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(["vendors", filters], fetcher);

  return { vendors: data || [], isLoading, isError: error, mutate: boundMutate };
}

export function useVendor(id: string) {
  const fetcher = async () => {
    if (!id) return null;
    const supabase = createClient();
    const { data, error } = await supabase.from("vendors").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(id ? ["vendors", id] : null, fetcher);

  return { vendor: data, isLoading, isError: error, mutate: boundMutate };
}

export function useCreateVendor() {
  const createVendor = async (vendorData: any) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("vendors").insert([vendorData]).select().single();
    if (error) throw error;
    mutate((key: any) => Array.isArray(key) && key[0] === "vendors");
    return data;
  };

  return { createVendor };
}

export function useHotelPartners() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hotel_partners")
      .select("*, vendors(*)")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(["hotel_partners"], fetcher);

  return { partners: data || [], isLoading, isError: error, mutate: boundMutate };
}

export function usePurchaseOrders() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*, vendors(name)")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(["purchase_orders"], fetcher);

  return { purchaseOrders: data || [], isLoading, isError: error, mutate: boundMutate };
}

export function useCreateHotelPartner() {
  const createHotelPartner = async (partnerData: any) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("hotel_partners").insert([partnerData]).select().single();
    if (error) throw error;
    mutate((key: any) => Array.isArray(key) && key[0] === "hotel_partners");
    return data;
  };

  return { createHotelPartner };
}

export function useCreatePurchaseOrder() {
  const createPurchaseOrder = async (poData: any) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("purchase_orders").insert([poData]).select().single();
    if (error) throw error;
    mutate((key: any) => Array.isArray(key) && key[0] === "purchase_orders");
    return data;
  };

  return { createPurchaseOrder };
}
