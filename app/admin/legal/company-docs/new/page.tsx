"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyDocumentSchema, CompanyDocumentFormValues } from "@/lib/validations/legal";
import { useCreateCompanyDocument } from "@/hooks/useLegal";
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
import { id } from "date-fns/locale";
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

export default function NewCompanyDocumentPage() {
  const router = useRouter();
  const { createDocument } = useCreateCompanyDocument();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompanyDocumentFormValues>({
    resolver: zodResolver(companyDocumentSchema) as any,
    defaultValues: {
      name: "",
      document_number: "",
      publisher: "",
      issue_date: "",
      expiry_date: "",
      status: "active",
      pic_name: "",
      notes: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createDocument(data);
      toast.success("Dokumen legal berhasil ditambahkan");
      router.push("/admin/legal/company-docs");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menambahkan dokumen legal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Tambah Dokumen Legal Baru" 
        subtitle="Masukkan detail perizinan atau dokumen perusahaan."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Informasi Dokumen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="name" label="Nama Dokumen" error={errors.name?.message} required>
                <Input id="name" {...register("name")} placeholder="Contoh: NIB / SIUP / TDP" />
              </Field>
              <Field id="document_number" label="Nomor Dokumen" error={errors.document_number?.message}>
                <Input id="document_number" {...register("document_number")} placeholder="No. Registrasi / Perizinan" />
              </Field>
              <Field id="publisher" label="Penerbit / Instansi" error={errors.publisher?.message}>
                <Input id="publisher" {...register("publisher")} placeholder="Contoh: OSS / Dinas Pariwisata" />
              </Field>
              <Field id="status" label="Status" error={errors.status?.message}>
                <select 
                  id="status" 
                  {...register("status")} 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="active">Aktif</option>
                  <option value="renewing">Dalam Perpanjangan</option>
                  <option value="expired">Kedaluwarsa</option>
                </select>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Masa Berlaku & Penanggung Jawab</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="issue_date" label="Tanggal Terbit" error={errors.issue_date?.message}>
                <Controller
                  control={control}
                  name="issue_date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(new Date(field.value), "PPP", { locale: id }) : <span>Pilih tanggal</span>}
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
              <Field id="expiry_date" label="Tanggal Kedaluwarsa" error={errors.expiry_date?.message}>
                <Controller
                  control={control}
                  name="expiry_date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(new Date(field.value), "PPP", { locale: id }) : <span>Pilih tanggal (Kosong jika seumur hidup)</span>}
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
              <Field id="pic_name" label="PIC (Penanggung Jawab)" error={errors.pic_name?.message}>
                <Input id="pic_name" {...register("pic_name")} placeholder="Nama staf internal" />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Catatan Tambahan</h3>
            <Field id="notes" label="Catatan" error={errors.notes?.message}>
              <Textarea id="notes" {...register("notes")} placeholder="Informasi tambahan terkait dokumen..." className="h-20" />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Dokumen
          </Button>
        </div>
      </form>
    </div>
  );
}
