import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, TrendingUp, Wallet } from "lucide-react";

export default function RevenueSummary({ revenueList }: { revenueList: any[] }) {
  let totalGross = 0;
  let totalCommission = 0;

  revenueList.forEach((item) => {
    totalGross += item.gross_price || 0;
    if (item.source?.includes("ota") || item.source === "klook" || item.source === "viator") {
      totalCommission += (item.gross_price || 0) * 0.20;
    }
  });

  const totalNett = totalGross - totalCommission;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gross</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {totalGross.toLocaleString("id-ID")}</div>
          <p className="text-xs text-muted-foreground">Pendapatan kotor dari booking</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potongan OTA</CardTitle>
          <Percent className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            Rp {totalCommission.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground">Estimasi komisi platform (20%)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Nett</CardTitle>
          <Wallet className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            Rp {totalNett.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground">Pendapatan bersih diproyeksikan</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Booking Selesai</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{revenueList.length}</div>
          <p className="text-xs text-muted-foreground">Total trip dalam periode ini</p>
        </CardContent>
      </Card>
    </div>
  );
}
