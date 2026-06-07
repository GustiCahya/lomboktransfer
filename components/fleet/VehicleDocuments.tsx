"use client";

import React, { useRef, useState } from "react";
import { useVehicleDocuments, VEHICLE_DOC_LABELS, VehicleDocument } from "@/hooks/useVehicleDocuments";
import { formatSisaHari } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Upload, FileText, XCircle, Loader2 } from "lucide-react";

interface VehicleDocumentsProps {
  vehicleId: string;
}

function StatusIcon({ status }: { status: VehicleDocument["status"] }) {
  if (status === "expired") return <XCircle className="w-4 h-4 text-destructive" />;
  if (status === "expiring_soon") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  return <CheckCircle className="w-4 h-4 text-green-500" />;
}

function StatusBadgeDoc({ status }: { status: VehicleDocument["status"] }) {
  const map = {
    valid: "bg-green-500/10 text-green-600 border-green-200",
    expiring_soon: "bg-amber-500/10 text-amber-600 border-amber-200",
    expired: "bg-destructive/10 text-destructive border-destructive/20",
  };
  const labels = { valid: "Valid", expiring_soon: "Segera Habis", expired: "Kadaluarsa" };
  return <Badge variant="outline" className={`text-xs font-medium ${map[status]}`}>{labels[status]}</Badge>;
}

export default function VehicleDocuments({ vehicleId }: VehicleDocumentsProps) {
  const { documents, isLoading, refetch } = useVehicleDocuments(vehicleId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedDocType, setSelectedDocType] = useState<VehicleDocument["doc_type"]>("stnk");
  const [isUploading, setIsUploading] = useState(false);

  // Placeholder upload handler since we haven't implemented the upload hook mutation fully for vehicles yet
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    // Simulate upload delay for now
    setTimeout(() => {
      setIsUploading(false);
      alert("Fungsi upload dokumen kendaraan akan dihubungkan ke Supabase Storage.");
      refetch();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg border border-dashed">
        <FileText className="w-8 h-8 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Upload Dokumen Kendaraan</p>
          <p className="text-xs text-muted-foreground">PDF atau gambar, maks 5MB. Pastikan foto terlihat jelas.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDocType}
            onChange={e => setSelectedDocType(e.target.value as VehicleDocument["doc_type"])}
            className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring flex-1 sm:w-auto"
          >
            {Object.entries(VEHICLE_DOC_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} />
          <Button size="sm" onClick={() => fileRef.current?.click()} disabled={isUploading} className="gap-2 whitespace-nowrap">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
            {isUploading ? "Mengupload..." : "Pilih File"}
          </Button>
        </div>
      </div>

      {/* Documents table */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Memuat dokumen kendaraan...</p>
      ) : documents.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground border rounded-md border-dashed">Belum ada dokumen yang diupload.</p>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Dokumen</TableHead>
                <TableHead>Penyedia / Polis</TableHead>
                <TableHead>Tgl Expire</TableHead>
                <TableHead>Sisa Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={doc.status} />
                      {VEHICLE_DOC_LABELS[doc.doc_type]}
                    </div>
                  </TableCell>
                  <TableCell>
                    {doc.provider_name ? (
                      <div>
                        <div className="text-sm font-medium">{doc.provider_name}</div>
                        <div className="text-xs text-muted-foreground">{doc.policy_number}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {doc.expires_at ? new Date(doc.expires_at).toLocaleDateString("id-ID") : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {doc.expires_at ? (
                      <span className={doc.status === "expired" ? "text-destructive font-medium" : doc.status === "expiring_soon" ? "text-amber-500 font-medium" : "text-muted-foreground"}>
                        {formatSisaHari(doc.expires_at)}
                      </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell><StatusBadgeDoc status={doc.status} /></TableCell>
                  <TableCell className="text-right">
                    <a 
                      href={doc.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-7 px-2.5 rounded-md hover:bg-muted text-primary transition-colors"
                    >
                      Lihat
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
