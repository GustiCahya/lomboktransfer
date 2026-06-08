/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef } from "react";
import { useRevenue } from "@/hooks/useRevenue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type ReconciliationRow = {
  ref: string;
  date: string;
  revenue: number;
  commission: number;
  net: number;
  matched?: any;
  status: "matched" | "not_found" | "mismatch";
};

export default function OTAReconciliationPage() {
  const [csvRows, setCsvRows] = useState<ReconciliationRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("klook");
  const fileRef = useRef<HTMLInputElement>(null);

  const { revenueList } = useRevenue({});

  const parseCSV = (text: string, platform: string): any[] => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/"/g, ""));
      const row: any = {};
      headers.forEach((h, i) => { row[h] = cols[i]; });
      return row;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const rawRows = parseCSV(text, selectedPlatform);

      // Map CSV rows to standard format
      const mapped: ReconciliationRow[] = rawRows.map((row) => ({
        ref: row["Booking ID"] || row["Reference"] || row["Order ID"] || "-",
        date: row["Date"] || row["Booking Date"] || "-",
        revenue: parseFloat(row["Revenue"] || row["Gross"] || "0"),
        commission: parseFloat(row["Commission"] || row["Fee"] || "0"),
        net: parseFloat(row["Net"] || row["Net Revenue"] || "0"),
        status: "not_found",
      }));

      // Match with existing bookings
      const reconciled = mapped.map((row) => {
        const match = (revenueList as any[]).find(
          (b) => b.booking_code === row.ref || b.guest?.phone?.includes(row.ref)
        );
        return {
          ...row,
          matched: match || null,
          status: match ? "matched" : "not_found" as "matched" | "not_found",
        };
      });

      setCsvRows(reconciled);
    } catch {
      alert("Gagal memproses CSV. Pastikan format file sudah sesuai.");
    } finally {
      setIsProcessing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const matched = csvRows.filter((r) => r.status === "matched").length;
  const notFound = csvRows.filter((r) => r.status === "not_found").length;
  const totalRevenue = csvRows.reduce((s, r) => s + r.revenue, 0);
  const totalCommission = csvRows.reduce((s, r) => s + r.commission, 0);

  const STATUS_ICON = {
    matched: <CheckCircle className="h-4 w-4 text-green-500" />,
    not_found: <XCircle className="h-4 w-4 text-destructive" />,
    mismatch: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Upload Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Settlement Report OTA</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="flex h-9 w-36 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="klook">Klook</option>
              <option value="viator">Viator</option>
              <option value="traveloka">Traveloka</option>
            </select>
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <Button onClick={() => fileRef.current?.click()} className="gap-2" disabled={isProcessing}>
              <Upload className="h-4 w-4" />
              {isProcessing ? "Memproses..." : "Upload CSV"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Format CSV: Booking ID, Date, Revenue, Commission, Net
          </p>
        </CardContent>
      </Card>

      {/* Summary */}
      {csvRows.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Baris</p>
                    <p className="text-xl font-bold">{csvRows.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cocok ✓</p>
                    <p className="text-xl font-bold text-green-600">{matched}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tidak Cocok ✗</p>
                    <p className="text-xl font-bold text-destructive">{notFound}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-xs text-muted-foreground">Total Nett dari OTA</p>
                  <p className="text-xl font-bold">Rp {(totalRevenue - totalCommission).toLocaleString("id-ID")}</p>
                  <p className="text-xs text-destructive">-Rp {totalCommission.toLocaleString("id-ID")} komisi</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reconciliation Table */}
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Status</TableHead>
                  <TableHead>Ref OTA</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Komisi</TableHead>
                  <TableHead className="text-right">Nett</TableHead>
                  <TableHead>Booking di Sistem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvRows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{STATUS_ICON[row.status]}</TableCell>
                    <TableCell className="font-mono text-xs">{row.ref}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="text-right">Rp {row.revenue.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right text-destructive">
                      {row.commission > 0 ? `-Rp ${row.commission.toLocaleString("id-ID")}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">Rp {row.net.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      {row.matched ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs text-green-600">{row.matched.booking_code}</Badge>
                          <span className="text-xs text-muted-foreground">{row.matched.guests?.full_name}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs text-destructive">Tidak ditemukan</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {csvRows.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-3 rounded-lg border border-dashed text-muted-foreground">
          <Upload className="h-10 w-10 opacity-40" />
          <p>Upload file CSV dari platform OTA untuk memulai rekonsiliasi.</p>
        </div>
      )}
    </div>
  );
}
