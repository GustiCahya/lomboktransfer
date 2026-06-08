/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useGuests } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MessageSquare, Send, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function ReEngagementPage() {
  const { guests, isLoading } = useGuests({ status: "dormant" }); // Only load dormant guests
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);

  // Filter dormant but good candidates (e.g. they have spent some money, no blacklist)
  // In a real scenario we'd check their reviews, but we'll simulate by filtering guest tags.
  const eligibleGuests = guests.filter((g: any) => {
    const hasBlacklist = g.guest_tags?.some((t: any) => t.tag_name === "Blacklist");
    return !hasBlacklist && g.totalBookings > 0;
  });

  const toggleSelect = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) ? prev.filter(id => id !== guestId) : [...prev, guestId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedGuests.length === eligibleGuests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(eligibleGuests.map((g: any) => g.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
        <div>
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> WhatsApp Re-engagement Blast
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Kirim pesan promo ke tamu yang sudah tidak memesan selama lebih dari 6 bulan (Dormant).
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-background">Edit Template</Button>
          <Button disabled={selectedGuests.length === 0} className="gap-2">
            <Send className="h-4 w-4" /> Kirim Blast ({selectedGuests.length})
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium text-muted-foreground">Total Tamu Dormant Potensial</h3>
          </div>
          <p className="mt-4 text-3xl font-bold">{eligibleGuests.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <h3 className="font-medium text-muted-foreground">Tamu Tanpa Nomor WA</h3>
          </div>
          <p className="mt-4 text-3xl font-bold text-warning">
            {eligibleGuests.filter((g: any) => !g.phone).length}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat data target re-engagement...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-input"
                    checked={selectedGuests.length === eligibleGuests.length && eligibleGuests.length > 0}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Nama Tamu</TableHead>
                <TableHead>Nomor WhatsApp</TableHead>
                <TableHead>Negara</TableHead>
                <TableHead className="text-center">Total Booking</TableHead>
                <TableHead>Terakhir Booking</TableHead>
                <TableHead>Status Re-engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eligibleGuests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                    Tidak ada tamu dormant yang memenuhi kriteria saat ini.
                  </TableCell>
                </TableRow>
              ) : (
                eligibleGuests.map((g: any) => (
                  <TableRow key={g.id} className={selectedGuests.includes(g.id) ? "bg-muted/50" : ""}>
                    <TableCell className="text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-input"
                        checked={selectedGuests.includes(g.id)}
                        onChange={() => toggleSelect(g.id)}
                        disabled={!g.phone}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {g.full_name}
                    </TableCell>
                    <TableCell className={!g.phone ? "text-destructive text-sm" : "text-sm"}>
                      {g.phone || "Tidak ada nomor"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {g.nationality || "-"}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {g.totalBookings}
                    </TableCell>
                    <TableCell className="text-sm">
                      {g.lastBookingDate ? format(new Date(g.lastBookingDate), "dd MMM yyyy", { locale: id }) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-muted-foreground">Belum Dikontak</Badge>
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
