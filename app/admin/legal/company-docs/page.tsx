/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useCompanyDocuments } from "@/hooks/useLegal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FileText, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";

export default function CompanyDocsPage() {
  const { documents, isLoading } = useCompanyDocuments();

  const getStatusBadge = (doc: any) => {
    if (doc.status === "expired") {
      return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Expired</Badge>;
    }
    if (doc.status === "renewing") {
      return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">Diproses</Badge>;
    }

    if (!doc.expiry_date) {
      return <Badge variant="outline" className="text-muted-foreground border-muted">Seumur Hidup</Badge>;
    }

    const daysLeft = differenceInDays(new Date(doc.expiry_date), new Date());
    if (daysLeft < 0) {
      return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Expired</Badge>;
    }
    if (daysLeft <= 60) {
      return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">Hampir Habis</Badge>;
    }
    return <Badge variant="outline" className="text-success border-success/30 bg-success/10">Aktif</Badge>;
  };

  const getDaysLeft = (expiryDate: string) => {
    if (!expiryDate) return "-";
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return "Habis";
    return `${days} hari`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Daftar Dokumen Legal Perusahaan</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Dokumen
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">Memuat dokumen...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Dokumen</TableHead>
                <TableHead>Nomor Dokumen</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>Berlaku s/d</TableHead>
                <TableHead>Sisa Hari</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                    Belum ada dokumen legal yang terdaftar.
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{doc.document_number || "-"}</TableCell>
                    <TableCell>{doc.publisher || "-"}</TableCell>
                    <TableCell>
                      {doc.expiry_date ? format(new Date(doc.expiry_date), "dd MMM yyyy", { locale: id }) : "-"}
                    </TableCell>
                    <TableCell>
                      <span className={differenceInDays(new Date(doc.expiry_date), new Date()) <= 60 ? "text-warning font-medium" : ""}>
                        {getDaysLeft(doc.expiry_date)}
                      </span>
                    </TableCell>
                    <TableCell>{doc.pic_name || "-"}</TableCell>
                    <TableCell>{getStatusBadge(doc)}</TableCell>
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
