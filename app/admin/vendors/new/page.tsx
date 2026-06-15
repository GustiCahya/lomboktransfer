"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema, VendorFormValues } from "@/lib/validations/vendor";
import { useCreateVendor } from "@/hooks/useVendors";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const VENDOR_CATEGORIES = [
  "Bengkel Rekanan",
  "Supplier BBM",
  "Asuransi",
  "Teknologi",
  "Hotel & Akomodasi",
  "Travel Agent",
  "Cleaning & Laundry",
  "Percetakan",
  "Lainnya"
];

function Field({ id, label, error, children, required }: { id: string, label: string, error?: string, children: React.ReactNode, required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function NewVendorPage() {
  const router = useRouter();
  const { createVendor } = useCreateVendor();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema) as any,
    defaultValues: {
      name: "",
      category: "",
      pic_name: "",
      phone: "",
      email: "",
      address: "",
      website: "",
      bank_account: "",
      bank_name: "",
      rating: 0,
      notes: "",
      status: "active",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createVendor(data);
      toast.success("Vendor berhasil ditambahkan");
      router.push("/admin/vendors");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menambahkan vendor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Tambah Vendor Baru" 
        subtitle="Masukkan detail vendor, supplier, atau rekanan bisnis."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="name" label="Nama Vendor" error={errors.name?.message} required>
                <Input id="name" {...register("name")} placeholder="Contoh: PT. Sumber Makmur" />
              </Field>
              
              <Field id="category" label="Kategori" error={errors.category?.message} required>
                <select 
                  id="category" 
                  {...register("category")} 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {VENDOR_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Kontak & Alamat</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="pic_name" label="Nama PIC" error={errors.pic_name?.message}>
                <Input id="pic_name" {...register("pic_name")} placeholder="Nama kontak utama" />
              </Field>
              <Field id="phone" label="No. Telepon / WhatsApp" error={errors.phone?.message}>
                <Input id="phone" {...register("phone")} placeholder="+62..." />
              </Field>
              <Field id="email" label="Email" error={errors.email?.message}>
                <Input id="email" type="email" {...register("email")} placeholder="email@vendor.com" />
              </Field>
              <Field id="website" label="Website" error={errors.website?.message}>
                <Input id="website" {...register("website")} placeholder="https://..." />
              </Field>
            </div>
            <Field id="address" label="Alamat Lengkap" error={errors.address?.message}>
              <Textarea id="address" {...register("address")} placeholder="Alamat lengkap vendor..." className="h-20" />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Pembayaran & Administrasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="bank_name" label="Nama Bank" error={errors.bank_name?.message}>
                <Input id="bank_name" {...register("bank_name")} placeholder="Contoh: BCA" />
              </Field>
              <Field id="bank_account" label="Nomor Rekening" error={errors.bank_account?.message}>
                <Input id="bank_account" {...register("bank_account")} placeholder="Nomor rekening" />
              </Field>
              <Field id="status" label="Status" error={errors.status?.message}>
                <select 
                  id="status" 
                  {...register("status")} 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Non-aktif</option>
                </select>
              </Field>
              <Field id="rating" label="Rating Internal (0-5)" error={errors.rating?.message}>
                <Input id="rating" type="number" step="0.1" min="0" max="5" {...register("rating", { valueAsNumber: true })} />
              </Field>
            </div>
            <Field id="notes" label="Catatan Tambahan" error={errors.notes?.message}>
              <Textarea id="notes" {...register("notes")} placeholder="Informasi tambahan mengenai vendor ini..." className="h-20" />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Vendor
          </Button>
        </div>
      </form>
    </div>
  );
}
