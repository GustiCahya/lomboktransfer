/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR, { mutate } from "swr";
import { createClient } from "@/lib/supabase/client";

export function useCompanyDocuments(filters?: { status?: string }) {
  const fetcher = async () => {
    const supabase = createClient();
    let query = supabase.from("company_documents").select("*").order("expiry_date", { ascending: true });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(["company_documents", filters], fetcher);

  return { documents: data || [], isLoading, isError: error, mutate: boundMutate };
}

export function useCreateCompanyDocument() {
  const createDocument = async (docData: any) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("company_documents").insert([docData]).select().single();
    if (error) throw error;
    mutate((key: any) => Array.isArray(key) && key[0] === "company_documents");
    return data;
  };

  return { createDocument };
}

export function useUpdateCompanyDocument() {
  const updateDocument = async (id: string, docData: any) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("company_documents").update(docData).eq("id", id).select().single();
    if (error) throw error;
    mutate((key: any) => Array.isArray(key) && key[0] === "company_documents");
    return data;
  };

  return { updateDocument };
}

export function useContracts(filters?: { status?: string, party_type?: string }) {
  const fetcher = async () => {
    const supabase = createClient();
    let query = supabase.from("contracts").select("*").order("end_date", { ascending: true });

    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.party_type) query = query.eq("party_type", filters.party_type);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(["contracts", filters], fetcher);

  return { contracts: data || [], isLoading, isError: error, mutate: boundMutate };
}

export function useCreateContract() {
  const createContract = async (contractData: any) => {
    const supabase = createClient();
    const { data, error } = await supabase.from("contracts").insert([contractData]).select().single();
    if (error) throw error;
    mutate((key: any) => Array.isArray(key) && key[0] === "contracts");
    return data;
  };

  return { createContract };
}

export function useExpiryTracker(daysThreshold: number = 30) {
  const fetcher = async () => {
    const supabase = createClient();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysThreshold);
    const targetDateStr = targetDate.toISOString().split("T")[0];

    // Fetch all expiring items
    const [companyDocs, contracts] = await Promise.all([
      supabase.from("company_documents").select("*").lte("expiry_date", targetDateStr).neq("status", "expired"),
      supabase.from("contracts").select("*").lte("end_date", targetDateStr).neq("status", "expired")
    ]);

    return {
      companyDocs: companyDocs.data || [],
      contracts: contracts.data || []
    };
  };

  const { data, error, isLoading } = useSWR(["expiry_tracker", daysThreshold], fetcher);

  return {
    expiringItems: data || { companyDocs: [], contracts: [] },
    isLoading,
    isError: error
  };
}

export function useDataDeletionRequests() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("data_deletion_requests")
      .select("*, guests(full_name, phone)")
      .order("requested_at", { ascending: false });

    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate: boundMutate } = useSWR(["data_deletion_requests"], fetcher);

  return { requests: data || [], isLoading, isError: error, mutate: boundMutate };
}

export function useDataAccessLogs() {
  const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("data_access_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  };

  const { data, error, isLoading } = useSWR(["data_access_log"], fetcher);

  return { logs: data || [], isLoading, isError: error };
}
