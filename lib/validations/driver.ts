import { z } from "zod";

export const driverSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK hanya boleh angka"),
  date_of_birth: z.date().optional(),
  address: z.string().optional(),
  phone_wa: z.string().min(8, "Nomor HP terlalu pendek").regex(/^(\+62|62|08)\d{7,12}$/, "Format nomor tidak valid. Masukkan angka saja tanpa spasi/tanda hubung, contoh: 081234567890 atau 6281234567890"),
  bank_name: z.string().optional(),
  bank_account: z.string().optional(),
  bank_account_name: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  driver_type: z.enum(["karyawan", "mitra_lepas"]).default("karyawan"),
  status: z.enum(["active", "inactive", "cuti"]).default("active"),
  join_date: z.date().optional(),
  commission_pct: z.number().min(0).max(100).default(20),
  fee_type: z.enum(["percentage", "fixed", "daily"]).default("percentage"),
  fixed_fee: z.number().min(0).optional().default(0),
  daily_fee: z.number().min(0).optional().default(0),
});

export type DriverFormValues = z.infer<typeof driverSchema>;

