import { z } from "zod";

export const companyDocumentSchema = z.object({
  name: z.string().min(1, "Nama dokumen wajib diisi"),
  document_number: z.string().optional(),
  publisher: z.string().optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  status: z.enum(["active", "expired", "renewing"]).default("active"),
  pic_name: z.string().optional(),
  notes: z.string().optional(),
});

export type CompanyDocumentFormValues = z.infer<typeof companyDocumentSchema>;

export const contractSchema = z.object({
  party_name: z.string().min(1, "Nama pihak wajib diisi"),
  party_type: z.enum(["driver", "hotel", "travel_agent", "ota", "other"]),
  contract_type: z.string().min(1, "Jenis kontrak wajib diisi"),
  start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
  end_date: z.string().min(1, "Tanggal berakhir wajib diisi"),
  status: z.enum(["active", "expired", "negotiating", "terminated"]).default("active"),
  summary: z.string().optional(),
});

export type ContractFormValues = z.infer<typeof contractSchema>;
