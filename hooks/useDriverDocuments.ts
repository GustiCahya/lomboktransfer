import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { sisaHari } from "@/lib/utils/format";

export interface DriverDocument {
  id: string;
  driver_id: string;
  doc_type: "ktp" | "sim_a" | "sim_b1" | "skck" | "surat_sehat";
  file_url: string;
  issued_at: string | null;
  expiry_date: string | null;
  status: "valid" | "expiring_soon" | "expired";
  created_at: string;
}

const DOC_TYPE_LABELS: Record<DriverDocument["doc_type"], string> = {
  ktp: "KTP",
  sim_a: "SIM A",
  sim_b1: "SIM B1",
  skck: "SKCK",
  surat_sehat: "Surat Sehat",
};

export { DOC_TYPE_LABELS };

function computeStatus(expiry_date: string | null): DriverDocument["status"] {
  if (!expiry_date) return "valid";
  const days = sisaHari(expiry_date);
  if (days < 0) return "expired";
  if (days <= 30) return "expiring_soon";
  return "valid";
}

export function useDriverDocuments(driverId: string | null) {
  const [documents, setDocuments] = useState<DriverDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const fetchDocuments = useCallback(async () => {
    if (!driverId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("driver_documents")
      .select("*")
      .eq("driver_id", driverId)
      .order("doc_type");

    const enriched = (data || []).map(d => ({
      ...d,
      status: computeStatus(d.expiry_date),
    })) as DriverDocument[];

    setDocuments(enriched);
    setIsLoading(false);
  }, [driverId, supabase]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  return { documents, isLoading, refetch: fetchDocuments };
}

export function useUploadDocument() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const uploadDocument = useCallback(async (
    driverId: string,
    docType: DriverDocument["doc_type"],
    file: File,
    expiresAt?: string,
    issuedAt?: string,
  ) => {
    setIsLoading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `drivers/${driverId}/${docType}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("documents")
        .upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);

      const { data, error: dbErr } = await supabase
        .from("driver_documents")
        .upsert({
          driver_id: driverId,
          doc_type: docType,
          file_url: urlData.publicUrl,
          issued_at: issuedAt ?? null,
          expiry_date: expiresAt ?? null,
        }, { onConflict: "driver_id,doc_type" })
        .select()
        .single();

      if (dbErr) throw dbErr;
      return data;
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  return { uploadDocument, isLoading };
}

export function useExpiringDocuments(withinDays = 30) {
  const [documents, setDocuments] = useState<(DriverDocument & { drivers: { full_name: string } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + withinDays);

    supabase
      .from("driver_documents")
      .select("*, drivers(full_name)")
      .lte("expiry_date", threshold.toISOString())
      .order("expiry_date")
      .then(({ data }) => {
        const enriched = (data || []).map(d => ({
          ...d,
          status: computeStatus(d.expiry_date),
        })) as (DriverDocument & { drivers: { full_name: string } })[];
        setDocuments(enriched);
        setIsLoading(false);
      });
  }, [withinDays, supabase]);

  return { documents, isLoading };
}
