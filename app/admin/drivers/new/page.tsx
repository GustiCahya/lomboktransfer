"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema, DriverFormValues } from "@/lib/validations/driver";
import { useCreateDriver } from "@/hooks/useDrivers";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function NewDriverPage() {
  const router = useRouter();
  const { createDriver, isLoading } = useCreateDriver();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      employment_type: "karyawan",
      status: "active",
      commission_percentage: 20,
    },
  });

  const onSubmit = async (data: DriverFormValues) => {
    try {
      const newDriver = await createDriver(data);
      if (newDriver) router.push(`/drivers/${newDriver.id}`);
    } catch {
      alert("Gagal menyimpan data supir. Pastikan semua field terisi dengan benar.");
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
      <PageHeader title="Tambah Supir Baru" subtitle="Isi data lengkap supir. Pastikan NIK dan nomor WhatsApp valid." />

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
              <Field id="email" label="Email" error={errors.email?.message}>
                <Input id="email" type="email" {...register("email")} placeholder="email@domain.com" />
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
              <Field id="employment_type" label="Tipe Mitra" required error={errors.employment_type?.message}>
                <select id="employment_type" {...register("employment_type")} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
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
              <Field id="commission_percentage" label="Komisi (%)" required error={errors.commission_percentage?.message}>
                <Input id="commission_percentage" type="number" {...register("commission_percentage", { valueAsNumber: true })} min={0} max={100} />
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
              <Field id="bank_account_number" label="No. Rekening" error={errors.bank_account_number?.message}>
                <Input id="bank_account_number" {...register("bank_account_number")} placeholder="1234567890" />
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
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Supir
          </Button>
        </div>
      </form>
    </div>
  );
}
