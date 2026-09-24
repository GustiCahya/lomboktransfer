/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormValues } from "@/lib/validations/expense";
import { useCreateExpense, useUpdateExpense } from "@/hooks/useExpenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "fuel", label: "BBM / Bensin" },
  { value: "maintenance", label: "Servis & Perawatan" },
  { value: "insurance", label: "Asuransi" },
  { value: "commission", label: "Komisi Supir" },
  { value: "platform_fee", label: "Platform Fee" },
  { value: "marketing", label: "Marketing & Promosi" },
  { value: "office", label: "Operasional Kantor" },
  { value: "legal", label: "Legal & Perizinan" },
  { value: "other", label: "Lainnya" },
];

interface ExpenseFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ExpenseForm({ initialData, onSuccess, onCancel }: ExpenseFormProps) {
  const { createExpense } = useCreateExpense();
  const { updateExpense } = useUpdateExpense(initialData?.id || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData ? {
      ...initialData,
      expense_date: new Date(initialData.expense_date),
    } : {
      payment_method: "transfer",
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        expense_date: format(data.expense_date, "yyyy-MM-dd"),
        amount: Number(data.amount),
      };
      
      if (initialData?.id) {
        await updateExpense(payload);
      } else {
        await createExpense(payload);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert(`Gagal ${initialData ? 'memperbarui' : 'menyimpan'} pengeluaran.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Date */}
      <div className="space-y-2 flex flex-col">
        <Label>Tanggal <span className="text-destructive">*</span></Label>
        <Controller
          control={control}
          name="expense_date"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger>
                <Button
                  type="button"
                  variant="outline"
                  className={cn("w-full text-left font-normal justify-start", !field.value && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.expense_date && <p className="text-xs text-destructive">{errors.expense_date.message as string}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Kategori <span className="text-destructive">*</span></Label>
        <select
          {...register("category")}
          className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">-- Pilih Kategori --</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message as string}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Deskripsi <span className="text-destructive">*</span></Label>
        <Input {...register("description")} placeholder="Contoh: BBM Innova B 1234 CD" />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message as string}</p>}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label>Jumlah (Rp) <span className="text-destructive">*</span></Label>
        <Input
          type="number"
          {...register("amount", { valueAsNumber: true })}
          placeholder="0"
        />
        {errors.amount && <p className="text-xs text-destructive">{errors.amount.message as string}</p>}
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label>Metode Pembayaran</Label>
        <select
          {...register("payment_method")}
          className="flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="cash">Tunai</option>
          <option value="transfer">Transfer</option>
          <option value="debit">Kartu Debit</option>
          <option value="credit">Kartu Kredit</option>
        </select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>Catatan</Label>
        <Input {...register("notes")} placeholder="Keterangan tambahan (opsional)" />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan
        </Button>
      </div>
    </form>
  );
}
