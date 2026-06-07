import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = 
  | "pending" 
  | "confirmed" 
  | "driver_assigned"
  | "in_progress" 
  | "completed" 
  | "cancelled"
  | "active"
  | "inactive"
  | "expired"
  | "maintenance"
  | "paid"
  | "unpaid"
  | "partial";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: "Menunggu", className: "bg-[hsl(var(--warning))] hover:bg-[hsl(var(--warning))]/80 text-white border-transparent" },
  confirmed: { label: "Dikonfirmasi", className: "bg-[hsl(var(--info))] hover:bg-[hsl(var(--info))]/80 text-white border-transparent" },
  driver_assigned: { label: "Supir Ditugaskan", className: "bg-blue-500 hover:bg-blue-600 text-white border-transparent" },
  in_progress: { label: "Berlangsung", className: "bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/80 text-white border-transparent" },
  completed: { label: "Selesai", className: "bg-muted text-muted-foreground border-transparent" },
  cancelled: { label: "Dibatalkan", className: "bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/80 text-white border-transparent" },
  active: { label: "Aktif", className: "bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/80 text-white border-transparent" },
  inactive: { label: "Tidak Aktif", className: "bg-muted text-muted-foreground border-transparent" },
  expired: { label: "Kadaluarsa", className: "bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/80 text-white border-transparent" },
  maintenance: { label: "Perawatan", className: "bg-amber-500 hover:bg-amber-600 text-white border-transparent" },
  paid: { label: "Lunas", className: "bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/80 text-white border-transparent" },
  unpaid: { label: "Belum Bayar", className: "bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/80 text-white border-transparent" },
  partial: { label: "Bayar Sebagian", className: "bg-[hsl(var(--warning))] hover:bg-[hsl(var(--warning))]/80 text-white border-transparent" },
};

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge className={cn("font-medium", config.className, className)} variant="outline">
      {label || config.label}
    </Badge>
  );
}
