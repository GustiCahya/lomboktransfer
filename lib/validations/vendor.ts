import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string().min(1, "Nama vendor wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  pic_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
  website: z.string().optional(),
  bank_account: z.string().optional(),
  bank_name: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type VendorFormValues = z.infer<typeof vendorSchema>;

export const hotelPartnerSchema = z.object({
  vendor_id: z.string().min(1, "Pilih vendor utama"),
  commission_rate: z.number().min(0).optional(),
  commission_fixed: z.number().min(0).optional(),
  partnership_status: z.enum(["active", "inactive", "negotiating"]).default("active"),
});

export type HotelPartnerFormValues = z.infer<typeof hotelPartnerSchema>;

export const purchaseOrderItemSchema = z.object({
  description: z.string().min(1, "Deskripsi item wajib diisi"),
  quantity: z.number().min(1, "Kuantitas minimal 1"),
  unit_price: z.number().min(0, "Harga tidak boleh negatif"),
  total: z.number().min(0),
});

export const purchaseOrderSchema = z.object({
  vendor_id: z.string().min(1, "Pilih vendor"),
  description: z.string().optional(),
  items: z.array(purchaseOrderItemSchema).min(1, "Minimal 1 item dibutuhkan"),
  notes: z.string().optional(),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;
