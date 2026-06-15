"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseOrderSchema, PurchaseOrderFormValues } from "@/lib/validations/vendor";
import { useCreatePurchaseOrder, useVendors } from "@/hooks/useVendors";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function Field({ id, label, error, children, required }: { id: string, label: string, error?: string, children: React.ReactNode, required?: boolean }) {
  return (
    <div className="space-y-2 flex flex-col">
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const { createPurchaseOrder } = useCreatePurchaseOrder();
  const { vendors } = useVendors();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      vendor_id: "",
      description: "",
      notes: "",
      items: [
        { description: "", quantity: 1, unit_price: 0, total: 0 }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  // Calculate totals
  const totalAmount = watchItems.reduce((acc, item) => acc + (item.total || 0), 0);

  const calculateItemTotal = (index: number) => {
    const qty = watchItems[index]?.quantity || 0;
    const price = watchItems[index]?.unit_price || 0;
    setValue(`items.${index}.total`, qty * price);
  };

  const onSubmit = async (data: PurchaseOrderFormValues) => {
    setIsLoading(true);
    try {
      // Generate a temporary PO number, typically backend handles this,
      // but for this boilerplate we'll generate one here.
      const po_number = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const payload = {
        po_number,
        vendor_id: data.vendor_id,
        description: data.description,
        notes: data.notes,
        items_json: data.items,
        total_amount: data.items.reduce((acc, item) => acc + item.total, 0),
        status: "draft"
      };

      await createPurchaseOrder(payload);
      toast.success("Purchase Order berhasil dibuat");
      router.push("/admin/vendors/purchase-orders");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal membuat PO");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Buat Purchase Order (PO)" 
        subtitle="Form pembuatan PO ke vendor / supplier."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Informasi Utama</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="vendor_id" label="Pilih Vendor" error={errors.vendor_id?.message} required>
                <Controller
                  control={control}
                  name="vendor_id"
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
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
              <Field id="description" label="Judul / Deskripsi PO" error={errors.description?.message}>
                <Input id="description" {...register("description")} placeholder="Misal: Pembelian sparepart bulanan" />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-base">Rincian Barang / Jasa</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unit_price: 0, total: 0 })}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Item
              </Button>
            </div>

            {errors.items?.message && (
              <p className="text-xs text-destructive">{errors.items.message}</p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-end bg-muted/30 p-4 rounded-lg border">
                  <div className="flex-1 w-full">
                    <Field id={`items.${index}.description`} label="Deskripsi Item" error={errors.items?.[index]?.description?.message} required>
                      <Input {...register(`items.${index}.description`)} placeholder="Nama barang / jasa" />
                    </Field>
                  </div>
                  <div className="w-full sm:w-24">
                    <Field id={`items.${index}.quantity`} label="Qty" error={errors.items?.[index]?.quantity?.message} required>
                      <Input 
                        type="number" 
                        min="1" 
                        {...register(`items.${index}.quantity`, { 
                          valueAsNumber: true,
                          onChange: () => calculateItemTotal(index)
                        })} 
                      />
                    </Field>
                  </div>
                  <div className="w-full sm:w-48">
                    <Field id={`items.${index}.unit_price`} label="Harga Satuan" error={errors.items?.[index]?.unit_price?.message} required>
                      <Input 
                        type="number" 
                        min="0" 
                        {...register(`items.${index}.unit_price`, { 
                          valueAsNumber: true,
                          onChange: () => calculateItemTotal(index)
                        })} 
                      />
                    </Field>
                  </div>
                  <div className="w-full sm:w-48">
                    <Field id={`items.${index}.total`} label="Total">
                      <Input 
                        readOnly 
                        className="bg-muted" 
                        value={formatCurrency(watchItems[index]?.total || 0)}
                      />
                    </Field>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 px-3"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Keseluruhan</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Catatan Tambahan</h3>
            <Field id="notes" label="Catatan" error={errors.notes?.message}>
              <Textarea id="notes" {...register("notes")} placeholder="Termin pembayaran, garansi, dll..." className="h-20" />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buat PO Draft
          </Button>
        </div>
      </form>
    </div>
  );
}
