import { z } from "zod";

export const expenseSchema = z.object({
  expense_date: z.date({ message: "Tanggal wajib diisi" }),
  category: z.enum([
    "fuel",
    "maintenance",
    "insurance",
    "commission",
    "platform_fee",
    "marketing",
    "office",
    "legal",
    "other"
  ], { message: "Kategori tidak valid" }),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  amount: z.number().min(1, "Jumlah harus lebih besar dari 0"),
  payment_method: z.string().optional(),
  vendor_id: z.string().optional(),
  receipt_url: z.string().optional(),
  notes: z.string().optional()
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
