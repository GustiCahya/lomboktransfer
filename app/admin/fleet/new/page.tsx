"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, VehicleFormValues } from "@/lib/validations/vehicle";
import { useCreateVehicle } from "@/hooks/useVehicles";
import { useDrivers } from "@/hooks/useDrivers";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function NewVehiclePage() {
  const router = useRouter();
  const { createVehicle, isLoading } = useCreateVehicle();
  const { drivers } = useDrivers({ status: "active" });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      capacity: 7,
      status: "active",
      current_km: 0,
    },
  });

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      const newVehicle = await createVehicle(data);
      if (newVehicle) router.push(`/fleet/${newVehicle.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data kendaraan. Pastikan Kode Unit dan Plat Nomor unik.");
    }
  };

  const Field = ({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="Tambah Kendaraan Baru" subtitle="Input data identitas dan spesifikasi kendaraan ke dalam inventaris." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Identitas Utama */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Identitas Utama</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="unit_code" label="Kode Unit Internal" required error={errors.unit_code?.message}>
                <Input id="unit_code" {...register("unit_code")} placeholder="Contoh: LT-01" />
              </Field>
              <Field id="plate_number" label="Nomor Polisi (TNKB)" required error={errors.plate_number?.message}>
                <Input id="plate_number" {...register("plate_number")} placeholder="Contoh: DR 1234 AB" />
              </Field>
              <Field id="brand" label="Merek" required error={errors.brand?.message}>
                <Input id="brand" {...register("brand")} placeholder="Toyota, Honda, dll." />
              </Field>
              <Field id="model" label="Model" required error={errors.model?.message}>
                <Input id="model" {...register("model")} placeholder="Innova Reborn, Hiace, dll." />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Spesifikasi */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Spesifikasi & Kondisi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field id="year" label="Tahun Pembuatan" required error={errors.year?.message}>
                <Input id="year" type="number" {...register("year", { valueAsNumber: true })} />
              </Field>
              <Field id="color" label="Warna" error={errors.color?.message}>
                <Input id="color" {...register("color")} placeholder="Hitam, Putih, dll." />
              </Field>
              <Field id="capacity" label="Kapasitas Penumpang" required error={errors.capacity?.message}>
                <Input id="capacity" type="number" {...register("capacity", { valueAsNumber: true })} min={1} />
              </Field>
              <Field id="current_km" label="Odometer Saat Ini (KM)" required error={errors.current_km?.message}>
                <Input id="current_km" type="number" {...register("current_km", { valueAsNumber: true })} min={0} />
              </Field>
              <Field id="next_service_km" label="Target Servis Berikutnya (KM)" error={errors.next_service_km?.message}>
                <Input id="next_service_km" type="number" {...register("next_service_km", { valueAsNumber: true })} min={0} />
              </Field>
              <Field id="status" label="Status" required error={errors.status?.message}>
                <select id="status" {...register("status")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="active">Aktif</option>
                  <option value="maintenance">Dalam Perawatan</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Administrasi Tambahan */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Administrasi Tambahan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="vin" label="Nomor Rangka (VIN)" error={errors.vin?.message}>
                <Input id="vin" {...register("vin")} />
              </Field>
              <Field id="engine_number" label="Nomor Mesin" error={errors.engine_number?.message}>
                <Input id="engine_number" {...register("engine_number")} />
              </Field>
              <Field id="default_driver_id" label="Supir Default (Opsional)" error={errors.default_driver_id?.message}>
                <select id="default_driver_id" {...register("default_driver_id")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="">-- Pilih Supir --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.full_name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field id="notes" label="Catatan Internal" error={errors.notes?.message}>
              <Textarea id="notes" {...register("notes")} placeholder="Catatan tambahan mengenai kendaraan ini..." className="h-20" />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Kendaraan
          </Button>
        </div>
      </form>
    </div>
  );
}
