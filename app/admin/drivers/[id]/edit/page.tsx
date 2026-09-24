"use client";

import React, { useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema, DriverFormValues } from "@/lib/validations/driver";
import { useDriver, useUpdateDriver } from "@/hooks/useDrivers";
import PageHeader from "@/components/shared/PageHeader";
import AIAssistantFAB from "@/components/shared/AIAssistantFAB";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function EditDriverPage() {
  const { id } = useParams();
  const router = useRouter();
  const driverId = id as string;
  const { driver, isLoading: driverLoading } = useDriver(driverId);
  const { updateDriver, isLoading: updating } = useUpdateDriver(driverId);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema) as any,
    defaultValues: {
      driver_type: "karyawan",
      status: "active",
      commission_pct: 20,
    },
  });

  // Load existing driver data into form
  useEffect(() => {
    if (!driver) return;
    reset({
      full_name: driver.full_name,
      nik: driver.nik,
      phone_wa: driver.phone_wa,
      address: driver.address ?? "",
      bank_name: driver.bank_name ?? "",
      bank_account: driver.bank_account ?? "",
      bank_account_name: driver.bank_account_name ?? "",
      emergency_contact_name: driver.emergency_contact_name ?? "",
      emergency_contact_phone: driver.emergency_contact_phone ?? "",
      driver_type: driver.driver_type,
      status: driver.status,
      commission_pct: driver.commission_pct,
      date_of_birth: driver.date_of_birth ? new Date(driver.date_of_birth) : undefined,
      join_date: driver.join_date ? new Date(driver.join_date) : undefined,
    });
  }, [driver, reset]);

  const onSubmit = async (data: DriverFormValues) => {
    try {
      await updateDriver(data);
      router.push(`/admin/drivers/${driverId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan data supir.");
    }
  };

  // Handle AI auto-fill
  const handleAIFill = useCallback((data: Record<string, unknown>) => {
    const stringFields = [
      "full_name", "nik", "phone_wa", "address",
      "bank_name", "bank_account", "bank_account_name",
      "emergency_contact_name", "emergency_contact_phone",
    ] as const;
    const driverTypes = ["karyawan", "mitra_lepas"] as const;
    const statusValues = ["active", "inactive", "cuti"] as const;

    stringFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
        setValue(field, String(data[field]), { shouldDirty: true });
      }
    });

    if (data.commission_pct !== undefined) {
      const num = Number(data.commission_pct);
      if (!isNaN(num)) setValue("commission_pct", num, { shouldDirty: true });
    }

    if (data.driver_type && driverTypes.includes(data.driver_type as typeof driverTypes[number])) {
      setValue("driver_type", data.driver_type as DriverFormValues["driver_type"], { shouldDirty: true });
    }

    if (data.status && statusValues.includes(data.status as typeof statusValues[number])) {
      setValue("status", data.status as DriverFormValues["status"], { shouldDirty: true });
    }

    if (data.date_of_birth && typeof data.date_of_birth === "string") {
      const dob = new Date(data.date_of_birth);
      if (!isNaN(dob.getTime())) setValue("date_of_birth", dob, { shouldDirty: true });
    }

    if (data.join_date && typeof data.join_date === "string") {
      const joined = new Date(data.join_date);
      if (!isNaN(joined.getTime())) setValue("join_date", joined, { shouldDirty: true });
    }
  }, [setValue]);

  const Field = ({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  if (driverLoading) {
    return <div className="p-12 text-center text-muted-foreground">Memuat profil supir...</div>;
  }
  if (!driver) {
    return <div className="p-12 text-center text-destructive">Supir tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32">
      <PageHeader
        title={`Edit ${driver.full_name}`}
        subtitle="Perbarui data pribadi, status kerja, dan informasi rekening supir."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Data Pribadi */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Data Pribadi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="full_name" label="Nama Lengkap" required error={errors.full_name?.message}>
                <Input id="full_name" {...register("full_name")} placeholder="Nama sesuai KTP" />
              </Field>
              <Field id="nik" label="NIK (16 digit)" required error={errors.nik?.message}>
                <Input id="nik" {...register("nik")} placeholder="3500XXXXXXXXXXXX" maxLength={16} />
              </Field>
              <Field id="phone_wa" label="No. WhatsApp" required error={errors.phone_wa?.message}>
                <Input id="phone_wa" {...register("phone_wa")} placeholder="0812XXXXXXXX" />
              </Field>
              <Field id="address" label="Alamat Lengkap" error={errors.address?.message}>
                <Input id="address" {...register("address")} placeholder="Jalan, Kecamatan, Kota" />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Status Kerja */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Status Kerja</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field id="driver_type" label="Tipe Mitra" required error={errors.driver_type?.message}>
                <select id="driver_type" {...register("driver_type")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="karyawan">Karyawan Tetap</option>
                  <option value="mitra_lepas">Mitra Lepas</option>
                </select>
              </Field>
              <Field id="status" label="Status" required>
                <select id="status" {...register("status")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="active">Aktif</option>
                  <option value="inactive">Non-aktif</option>
                  <option value="cuti">Cuti</option>
                </select>
              </Field>
              <Field id="commission_pct" label="Komisi (%)" required error={errors.commission_pct?.message}>
                <Input id="commission_pct" type="number" {...register("commission_pct", { valueAsNumber: true })} min={0} max={100} />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Rekening Bank */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Rekening Bank</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field id="bank_name" label="Nama Bank" error={errors.bank_name?.message}>
                <Input id="bank_name" {...register("bank_name")} placeholder="BCA, BNI, Mandiri..." />
              </Field>
              <Field id="bank_account" label="No. Rekening" error={errors.bank_account?.message}>
                <Input id="bank_account" {...register("bank_account")} placeholder="1234567890" />
              </Field>
              <Field id="bank_account_name" label="Atas Nama" error={errors.bank_account_name?.message}>
                <Input id="bank_account_name" {...register("bank_account_name")} placeholder="Sesuai buku tabungan" />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Kontak Darurat */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Kontak Darurat</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="emergency_contact_name" label="Nama Kontak" error={errors.emergency_contact_name?.message}>
                <Input id="emergency_contact_name" {...register("emergency_contact_name")} placeholder="Nama kerabat" />
              </Field>
              <Field id="emergency_contact_phone" label="Nomor HP" error={errors.emergency_contact_phone?.message}>
                <Input id="emergency_contact_phone" {...register("emergency_contact_phone")} placeholder="0812XXXXXXXX" />
              </Field>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
          <Button type="submit" disabled={updating}>
            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      </form>

      {/* AI Assistant FAB */}
      <AIAssistantFAB formType="driver" onFill={handleAIFill} />
    </div>
  );
}
