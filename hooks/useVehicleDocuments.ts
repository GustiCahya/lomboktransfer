import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { sisaHari } from "@/lib/utils/format";

export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  doc_type: "stnk" | "kir" | "insurance_tlo" | "insurance_allrisk" | "insurance_passenger";
  file_url: string;
  issued_at: string | null;
  expiry_date: string | null;
  provider_name: string | null;
  policy_number: string | null;
  status: "valid" | "expiring_soon" | "expired";
  created_at: string;
}

export const VEHICLE_DOC_LABELS: Record<VehicleDocument["doc_type"], string> = {
  stnk: "STNK",
  kir: "KIR",
  insurance_tlo: "Asuransi TLO",
  insurance_allrisk: "Asuransi All Risk",
  insurance_passenger: "Asuransi Penumpang",
};

function computeDocStatus(expiry_date: string | null): VehicleDocument["status"] {
  if (!expiry_date) return "valid";
  const days = sisaHari(expiry_date);
  if (days < 0) return "expired";
  if (days <= 30) return "expiring_soon";
  return "valid";
}

export function useVehicleDocuments(vehicleId: string | null) {
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const fetchDocs = useCallback(async () => {
    if (!vehicleId) return;
    setIsLoading(true);
    const { data } = await supabase.from("vehicle_documents").select("*").eq("vehicle_id", vehicleId);
    
    const enriched = (data || []).map(d => ({
      ...d,
      status: computeDocStatus(d.expiry_date),
    })) as VehicleDocument[];

    setDocuments(enriched);
    setIsLoading(false);
  }, [vehicleId, supabase]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  return { documents, isLoading, refetch: fetchDocs };
}

export function useExpiringVehicleDocs(withinDays = 30) {
  const [documents, setDocuments] = useState<(VehicleDocument & { vehicles: { unit_code: string; plate_number: string } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + withinDays);

    supabase
      .from("vehicle_documents")
      .select("*, vehicles(unit_code, plate_number)")
      .lte("expiry_date", threshold.toISOString())
      .order("expiry_date")
      .then(({ data }) => {
        const enriched = (data || []).map(d => ({
          ...d,
          status: computeDocStatus(d.expiry_date),
        })) as (VehicleDocument & { vehicles: { unit_code: string; plate_number: string } })[];
        setDocuments(enriched);
        setIsLoading(false);
      });
  }, [withinDays, supabase]);

  return { documents, isLoading };
}
