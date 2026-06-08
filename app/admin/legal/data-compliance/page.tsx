/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useDataDeletionRequests, useDataAccessLogs } from "@/hooks/useLegal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Shield, Trash2, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DataCompliancePage() {
  const { requests, isLoading: isLoadingRequests } = useDataDeletionRequests();
  const { logs, isLoading: isLoadingLogs } = useDataAccessLogs();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Right to be Forgotten (Deletion Requests) */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-muted-foreground" />
              Right to be Forgotten (Penghapusan Data)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoadingRequests ? (
              <div className="text-center py-8 text-muted-foreground">Memuat request...</div>
            ) : (
              <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tamu</TableHead>
                      <TableHead>Tanggal Request</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                          Tidak ada request penghapusan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests.map((req: any) => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {req.guests?.full_name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {format(new Date(req.requested_at), "dd MMM yy", { locale: id })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              req.status === "completed" ? "text-success border-success/30 bg-success/10" :
                              req.status === "pending" ? "text-warning border-warning/30 bg-warning/10" : ""
                            }>
                              {req.status === "pending" ? "Pending" : "Selesai"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {req.status === "pending" && (
                              <Button size="sm" variant="destructive" className="h-7 px-2 text-xs">
                                Proses
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning bg-warning/10 p-3 text-sm text-warning">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p>Proses penghapusan akan melakukan <strong>soft delete</strong> pada PII (nama, email, no HP) namun tetap menyimpan data transaksi historis untuk keperluan audit keuangan.</p>
            </div>
          </CardContent>
        </Card>

        {/* Access Logs */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              Log Akses Data Sensitif
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoadingLogs ? (
              <div className="text-center py-8 text-muted-foreground">Memuat log...</div>
            ) : (
              <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Aksi</TableHead>
                      <TableHead>Tipe Data</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                          Belum ada log terekam.
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), "dd/MM HH:mm")}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs font-medium">{log.action}</span>
                          </TableCell>
                          <TableCell className="text-xs">{log.data_type}</TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">{log.ip_address || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" /> Kebijakan Retensi Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>Tamu Aktif:</strong> Data disimpan selamanya selama akun aktif atau pernah bertransaksi dalam 3 tahun terakhir.</p>
            <p><strong>Tamu Non-Aktif (&gt; 3 Tahun):</strong> Data tamu yang tidak memiliki transaksi baru dalam 3 tahun terakhir akan diarsipkan atau dihapus secara anonim, kecuali ada kewajiban perpajakan atau pelaporan yang membutuhkan data tersebut dipertahankan.</p>
            <Button variant="outline" className="mt-4">
              Pindai Data Non-Aktif (Archive)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
