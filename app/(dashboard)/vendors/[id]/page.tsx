/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useVendor } from "@/hooks/useVendors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit, Building, MapPin, Phone, Mail, Globe, CreditCard, Star } from "lucide-react";

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { vendor, isLoading } = useVendor(params.id as string);

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Memuat detail vendor...</div>;
  }

  if (!vendor) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-medium text-destructive mb-4">Vendor tidak ditemukan</h2>
        <Button variant="outline" onClick={() => router.push("/vendors")}>Kembali ke Direktori</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/vendors")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-medium">Detail Vendor</h2>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit className="h-4 w-4" /> Edit Vendor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Info Vendor */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              Profil Vendor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{vendor.name}</h3>
              <Badge variant="secondary" className="mt-1 font-normal">{vendor.category}</Badge>
            </div>

            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= vendor.rating ? "fill-warning text-warning" : "text-muted"}`} />
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm">{vendor.address || "Alamat belum diisi"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{vendor.phone || "No HP belum diisi"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{vendor.email || "Email belum diisi"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{vendor.website ? <a href={vendor.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{vendor.website}</a> : "Website belum diisi"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Informasi Pembayaran</p>
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">{vendor.bank_name || "-"}</p>
                  <p className="font-mono text-muted-foreground">{vendor.bank_account || "-"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
              <Badge variant="outline" className={vendor.status === "active" ? "text-success border-success/30 bg-success/10" : "text-muted-foreground"}>
                {vendor.status === "active" ? "Aktif" : "Non-aktif"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Riwayat Transaksi */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Riwayat Transaksi (Pengeluaran)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. Referensi</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* TODO: Fetch real transactions from expenses table filtering by vendor_id */}
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-48 text-muted-foreground">
                      Belum ada transaksi pengeluaran tercatat untuk vendor ini.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
