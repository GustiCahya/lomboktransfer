import { z } from "zod";

export const driverSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK hanya boleh angka"),
  date_of_birth: z.date().optional(),
  address: z.string().optional(),
  phone_wa: z.string().min(10, "Nomor HP tidak valid").regex(/^(\+62|08)\d{7,12}$/, "Format nomor HP Indonesia tidak valid"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  bank_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank_account_name: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  employment_type: z.enum(["karyawan", "mitra_lepas"]).default("karyawan"),
  status: z.enum(["active", "inactive", "cuti"]).default("active"),
  joined_at: z.date().optional(),
  commission_percentage: z.number().min(0).max(100).default(20),
  vehicle_id: z.string().optional(),
  notes: z.string().optional(),
});

export type DriverFormValues = z.infer<typeof driverSchema>;
