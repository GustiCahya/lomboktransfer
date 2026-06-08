/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { usePurchaseOrders } from "@/hooks/useVendors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PurchaseOrdersPage() {
  const { purchaseOrders, isLoading } = usePurchaseOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="text-muted-foreground border-muted">Draft</Badge>;
      case "pending_approval":
        return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">Menunggu Approval</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-success border-success/30 bg-success/10">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Ditolak</Badge>;
      case "completed":
        return <Badge variant="secondary">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Purchase Order (PO)</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Buat PO Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat data PO...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. PO</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                    Belum ada Purchase Order yang dibuat.
                  </TableCell>
                </TableRow>
              ) : (
                purchaseOrders.map((po: any) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono font-medium text-primary">
                      {po.po_number}
                    </TableCell>
                    <TableCell>
                      {format(new Date(po.created_at), "dd MMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {po.vendors?.name || "Unknown Vendor"}
                    </TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      {po.description || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(po.total_amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(po.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {po.status === "pending_approval" ? (
                        <Button size="sm" variant="outline" className="text-primary border-primary">
                          Review
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">Detail</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
