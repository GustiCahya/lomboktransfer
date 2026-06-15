"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractSchema, ContractFormValues } from "@/lib/validations/legal";
import { useCreateContract } from "@/hooks/useLegal";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as dateId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function Field({ id, label, error, children, required }: { id: string, label: string, error?: string, children: React.ReactNode, required?: boolean }) {
  return (
    <div className="space-y-2 flex flex-col">
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function NewContractPage() {
  const router = useRouter();
  const { createContract } = useCreateContract();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema) as any,
    defaultValues: {
      party_name: "",
      party_type: "other",
      contract_type: "",
      start_date: "",
      end_date: "",
      status: "active",
      summary: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createContract(data);
      toast.success("Kontrak berhasil ditambahkan");
      router.push("/admin/legal/contracts");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menambahkan kontrak");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Tambah Kontrak Baru" 
        subtitle="Daftarkan kontrak kerja sama dengan partner, vendor, atau supir."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Informasi Mitra / Pihak Kedua</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="party_name" label="Nama Pihak / Mitra" error={errors.party_name?.message} required>
                <Input id="party_name" {...register("party_name")} placeholder="Contoh: PT. Travel Maju / John Doe" />
              </Field>
              <Field id="party_type" label="Jenis Kemitraan" error={errors.party_type?.message} required>
                <select 
                  id="party_type" 
                  {...register("party_type")} 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="driver">Supir (Driver)</option>
                  <option value="hotel">Hotel</option>
                  <option value="travel_agent">Travel Agent</option>
                  <option value="ota">Online Travel Agent (OTA)</option>
                  <option value="other">Lainnya / Vendor</option>
                </select>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Detail Kontrak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="contract_type" label="Jenis Kontrak" error={errors.contract_type?.message} required>
                <Input id="contract_type" {...register("contract_type")} placeholder="Contoh: MoU Komisi / Kontrak Sewa" />
              </Field>
              <Field id="status" label="Status Kontrak" error={errors.status?.message}>
                <select 
                  id="status" 
                  {...register("status")} 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="active">Aktif</option>
                  <option value="negotiating">Dalam Negosiasi</option>
                  <option value="expired">Kedaluwarsa</option>
                  <option value="terminated">Dihentikan (Terminated)</option>
                </select>
              </Field>
              <Field id="start_date" label="Tanggal Berlaku (Mulai)" error={errors.start_date?.message} required>
                <Controller
                  control={control}
                  name="start_date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(new Date(field.value), "PPP", { locale: dateId }) : <span>Pilih tanggal</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </Field>
              <Field id="end_date" label="Tanggal Berakhir" error={errors.end_date?.message} required>
                <Controller
                  control={control}
                  name="end_date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(new Date(field.value), "PPP", { locale: dateId }) : <span>Pilih tanggal</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </Field>
            </div>
            <Field id="summary" label="Ringkasan Kontrak (Poin Penting)" error={errors.summary?.message}>
              <Textarea id="summary" {...register("summary")} placeholder="Kewajiban, skema komisi, penalti, dsb..." className="h-24" />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Kontrak
          </Button>
        </div>
      </form>
    </div>
  );
}
