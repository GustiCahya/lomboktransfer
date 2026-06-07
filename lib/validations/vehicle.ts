import { z } from "zod";

export const vehicleSchema = z.object({
  unit_code: z.string().min(1, "Kode unit wajib diisi"),
  plate_number: z.string().min(1, "Plat nomor wajib diisi"),
  brand: z.string().min(1, "Merek wajib diisi"),
  model: z.string().min(1, "Model wajib diisi"),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  vin: z.string().optional(),
  engine_number: z.string().optional(),
  capacity: z.number().min(1).default(7),
  status: z.enum(["active", "maintenance", "inactive", "sold"]).default("active"),
  current_km: z.number().min(0).default(0),
  last_service_km: z.number().min(0).optional(),
  next_service_km: z.number().min(0).optional(),
  default_driver_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
