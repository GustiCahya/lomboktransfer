/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LABELS: Record<string, string> = {
  fuel: "BBM",
  maintenance: "Servis",
  insurance: "Asuransi",
  commission: "Komisi",
  platform_fee: "Platform Fee",
  marketing: "Marketing",
  office: "Kantor",
  legal: "Legal",
  other: "Lainnya",
};

const CATEGORY_COLORS: Record<string, string> = {
  fuel: "bg-orange-500/10 text-orange-500",
  maintenance: "bg-blue-500/10 text-blue-500",
  insurance: "bg-purple-500/10 text-purple-500",
  commission: "bg-green-500/10 text-green-500",
  platform_fee: "bg-pink-500/10 text-pink-500",
  marketing: "bg-yellow-500/10 text-yellow-600",
  office: "bg-slate-500/10 text-slate-500",
  legal: "bg-red-500/10 text-red-500",
  other: "bg-muted text-muted-foreground",
};

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export default function ExpenseTable({ 
  expenses,
  onEdit,
  onDelete
}: { 
  expenses: any[],
  onEdit?: (expense: any) => void,
  onDelete?: (expense: any) => void
}) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Tidak ada data pengeluaran
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {format(new Date(expense.expense_date), "dd MMM yyyy", { locale: id })}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.other}`}>
                    {CATEGORY_LABELS[expense.category] || expense.category}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={expense.description}>
                  {expense.description}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {expense.vendors?.name || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize text-xs">
                    {expense.payment_method || "-"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium text-destructive">
                  Rp {expense.amount?.toLocaleString("id-ID") || 0}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit && onEdit(expense)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
                          onDelete && onDelete(expense);
                        }
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
