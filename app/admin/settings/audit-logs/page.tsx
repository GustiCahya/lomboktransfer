/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/shared/PageHeader";
import { Search, Shield } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setLogs(data || []);
      setIsLoading(false);
    };
    load();
  }, []);

  const filtered = logs.filter((l) =>
    !search ||
    l.table_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.user_email?.toLowerCase().includes(search.toLowerCase()) ||
    l.action?.toLowerCase().includes(search.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case "INSERT":
        return <Badge variant="outline" className="text-success border-success/30 bg-success/10 font-mono text-xs">INSERT</Badge>;
      case "UPDATE":
        return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10 font-mono text-xs">UPDATE</Badge>;
      case "DELETE":
        return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10 font-mono text-xs">DELETE</Badge>;
      default:
        return <Badge variant="outline" className="font-mono text-xs">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log Sistem"
        subtitle="Rekam jejak seluruh perubahan data krusial. Hanya dapat diakses oleh Owner."
      />

      <div className="flex items-center gap-3 p-4 rounded-xl border border-warning/30 bg-warning/5">
        <Shield className="h-5 w-5 text-warning shrink-0" />
        <p className="text-sm text-muted-foreground">
          Halaman ini mencatat semua aktivitas INSERT, UPDATE, dan DELETE pada tabel penting seperti{" "}
          <code className="text-xs bg-muted px-1 rounded">bookings</code>,{" "}
          <code className="text-xs bg-muted px-1 rounded">expenses</code>, dan{" "}
          <code className="text-xs bg-muted px-1 rounded">payroll</code>.
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari tabel, user, atau aksi..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat log aktivitas...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Tabel</TableHead>
                <TableHead>Record ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    Belum ada log aktivitas. Log akan muncul setelah trigger Supabase dikonfigurasi.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {format(new Date(log.created_at), "dd/MM/yy HH:mm:ss", { locale: id })}
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{log.table_name}</code>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {log.record_id ? log.record_id.substring(0, 8) + "..." : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.user_email || <span className="text-muted-foreground italic">System</span>}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {log.ip_address || "-"}
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
