/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useReviews } from "@/hooks/useCRM";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Star, MessageCircle, TrendingUp, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function ReviewsTrackerPage() {
  const [platform, setPlatform] = useState("");
  const { reviews, isLoading } = useReviews({ platform: platform ? platform : undefined });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unreplied":
        return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">Belum Dibalas</Badge>;
      case "replied":
        return <Badge variant="outline" className="text-success border-success/30 bg-success/10">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Review Tracker</h2>
        <select 
          className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">Semua Platform</option>
          <option value="Google">Google My Business</option>
          <option value="Klook">Klook</option>
          <option value="Viator">Viator</option>
          <option value="TripAdvisor">TripAdvisor</option>
          <option value="Internal">Internal (WhatsApp)</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-5 w-5 text-primary fill-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata-rata Rating</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{avgRating}</p>
                  <p className="text-xs text-success flex items-center"><TrendingUp className="h-3 w-3 mr-0.5"/> +0.2</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Review</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <ThumbsUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rating Positif (4-5)</p>
                <p className="text-2xl font-bold text-success">
                  {reviews.filter((r: any) => r.rating >= 4).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                <MessageCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Menunggu Balasan</p>
                <p className="text-2xl font-bold text-warning">
                  {reviews.filter((r: any) => r.status === "unreplied").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat data review...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Tamu</TableHead>
                <TableHead>Supir</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-1/3">Ulasan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                    Belum ada review yang masuk.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((rev: any) => (
                  <TableRow key={rev.id}>
                    <TableCell className="text-sm">
                      {format(new Date(rev.created_at), "dd MMM yy", { locale: id })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{rev.platform}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {rev.guests?.full_name || "Guest User"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {rev.drivers?.full_name || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <span className="font-bold mr-1 text-sm">{rev.rating}</span>
                        <Star className="h-3 w-3 fill-warning text-warning" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2" title={rev.content}>{rev.content || <span className="italic text-muted-foreground">Tidak ada komentar teks</span>}</p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(rev.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {rev.status === "unreplied" ? (
                        <Button size="sm" variant="outline" className="h-8">Balas</Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-8">Lihat</Button>
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
