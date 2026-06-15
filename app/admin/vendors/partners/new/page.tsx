"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hotelPartnerSchema, HotelPartnerFormValues } from "@/lib/validations/vendor";
import { useCreateHotelPartner, useVendors } from "@/hooks/useVendors";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function Field({ id, label, error, children, required }: { id: string, label: string, error?: string, children: React.ReactNode, required?: boolean }) {
  return (
    <div className="space-y-2 flex flex-col">
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function NewHotelPartnerPage() {
  const router = useRouter();
  const { createHotelPartner } = useCreateHotelPartner();
  const { vendors } = useVendors(); // We fetch all vendors to allow selection
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<HotelPartnerFormValues>({
    resolver: zodResolver(hotelPartnerSchema) as any,
    defaultValues: {
      vendor_id: "",
      commission_rate: 0,
      commission_fixed: 0,
      partnership_status: "active",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createHotelPartner(data);
      toast.success("Hotel/Travel Partner berhasil ditambahkan");
      router.push("/admin/vendors/partners");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menambahkan partner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Tambah Hotel & Travel Partner" 
        subtitle="Daftarkan vendor yang ada sebagai partner komisi."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Informasi Partner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="vendor_id" label="Pilih Vendor" error={errors.vendor_id?.message} required>
                <Controller
                  control={control}
                  name="vendor_id"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full text-left justify-between bg-card text-foreground h-8" id="vendor_id">
                        <SelectValue placeholder="-- Pilih Vendor --" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((v: any) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} ({v.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field id="partnership_status" label="Status Kemitraan" error={errors.partnership_status?.message}>
                <select 
                  id="partnership_status" 
                  {...register("partnership_status")} 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="active">Aktif</option>
                  <option value="negotiating">Dalam Negosiasi</option>
                  <option value="inactive">Non-aktif</option>
                </select>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Skema Komisi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="commission_rate" label="Persentase Komisi (%)" error={errors.commission_rate?.message}>
                <Input id="commission_rate" type="number" step="0.1" min="0" max="100" {...register("commission_rate", { valueAsNumber: true })} />
              </Field>
              <Field id="commission_fixed" label="Komisi Tetap (Rp)" error={errors.commission_fixed?.message}>
                <Input id="commission_fixed" type="number" min="0" {...register("commission_fixed", { valueAsNumber: true })} />
              </Field>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Isi salah satu skema (persentase atau tetap), atau keduanya jika berlaku skema kombinasi.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Partner
          </Button>
        </div>
      </form>
    </div>
  );
}
