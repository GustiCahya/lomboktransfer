/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useVendors } from "@/hooks/useVendors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Search, Star, Building } from "lucide-react";

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { vendors, isLoading } = useVendors(category ? { category } : undefined);

  const filteredVendors = vendors.filter((v: any) => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    (v.pic_name && v.pic_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari vendor..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            <option value="Bengkel Rekanan">Bengkel Rekanan</option>
            <option value="Supplier BBM">Supplier BBM</option>
            <option value="Asuransi">Asuransi</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Hotel & Akomodasi">Hotel & Akomodasi</option>
            <option value="Travel Agent">Travel Agent</option>
            <option value="Cleaning & Laundry">Cleaning & Laundry</option>
            <option value="Percetakan">Percetakan</option>
          </select>
        </div>
        <Button className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Tambah Vendor
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat direktori vendor...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Vendor</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>PIC & Kontak</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    Tidak ada vendor yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((v: any) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {v.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{v.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{v.pic_name || "-"}</p>
                        <p className="text-muted-foreground text-xs">{v.phone || v.email || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${v.rating >= 1 ? "fill-warning text-warning" : "text-muted"}`} />
                        <Star className={`h-4 w-4 ${v.rating >= 2 ? "fill-warning text-warning" : "text-muted"}`} />
                        <Star className={`h-4 w-4 ${v.rating >= 3 ? "fill-warning text-warning" : "text-muted"}`} />
                        <Star className={`h-4 w-4 ${v.rating >= 4 ? "fill-warning text-warning" : "text-muted"}`} />
                        <Star className={`h-4 w-4 ${v.rating >= 5 ? "fill-warning text-warning" : "text-muted"}`} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={v.status === "active" ? "text-success border-success/30 bg-success/10" : "text-muted-foreground"}>
                        {v.status === "active" ? "Aktif" : "Non-aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/vendors/${v.id}`}>
                        <Button variant="ghost" size="sm">Detail</Button>
                      </Link>
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
