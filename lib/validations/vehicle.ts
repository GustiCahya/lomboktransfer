import { z } from "zod";

const parseNumber = (val: any) => {
  if (val === "" || val === null || val === undefined) return undefined;
  if (typeof val === "number" && isNaN(val)) return undefined;
  return Number(val);
};

export const vehicleSchema = z.object({
  unit_code: z.string().min(1, "Kode unit wajib diisi"),
  plate_number: z.string().min(1, "Plat nomor wajib diisi"),
  brand: z.string().min(1, "Merek wajib diisi"),
  model: z.string().min(1, "Model wajib diisi"),
  year: z.preprocess(parseNumber, z.number({ message: "Tahun wajib diisi dengan angka" }).min(1990, "Tahun minimal 1990").max(new Date().getFullYear() + 1, "Tahun tidak valid")),
  color: z.string().optional(),
  vin: z.string().optional(),
  engine_number: z.string().optional(),
  capacity: z.preprocess(parseNumber, z.number({ message: "Kapasitas harus berupa angka" }).min(1, "Kapasitas minimal 1").default(7)),
  status: z.enum(["active", "maintenance", "inactive", "sold"]).default("active"),
  current_km: z.preprocess(parseNumber, z.number({ message: "KM harus berupa angka" }).min(0, "KM tidak boleh negatif").default(0)),
  last_service_km: z.preprocess(parseNumber, z.number({ message: "KM harus berupa angka" }).min(0, "KM tidak valid").optional()),
  next_service_km: z.preprocess(parseNumber, z.number({ message: "KM harus berupa angka" }).min(0, "KM tidak valid").optional()),
  default_driver_id: z.string().uuid().optional().nullable().or(z.literal("")).transform(v => v === "" ? null : v),
  notes: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
