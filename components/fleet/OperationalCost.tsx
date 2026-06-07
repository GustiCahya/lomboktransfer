"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wrench, Fuel, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/lib/utils/format";

interface OperationalCostProps {
  vehicleId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function OperationalCost({ vehicleId }: OperationalCostProps) {
  // Placeholder financial data for the vehicle
  const stats = {
    revenueYTD: 45000000,
    serviceCostYTD: 2500000,
    fuelCostEst: 8000000,
    insuranceCost: 4500000,
  };

  const totalCost = stats.serviceCostYTD + stats.fuelCostEst + stats.insuranceCost;
  const netProfit = stats.revenueYTD - totalCost;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium">Total Pendapatan (YTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-2xl font-bold text-green-600">{formatRupiah(stats.revenueYTD)}</div>
            <p className="text-xs text-muted-foreground mt-1">Estimasi kotor dari trip</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium">Biaya Servis & Part</CardTitle>
            <Wrench className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-2xl font-bold text-amber-600">{formatRupiah(stats.serviceCostYTD)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total {totalCost > 0 ? Math.round((stats.serviceCostYTD/totalCost)*100) : 0}% dari biaya</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium">Estimasi Biaya BBM</CardTitle>
            <Fuel className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-2xl font-bold text-blue-600">{formatRupiah(stats.fuelCostEst)}</div>
            <p className="text-xs text-muted-foreground mt-1">Berdasarkan rasio 1:10</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium">Profit Kontribusi</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-2xl font-bold text-primary">{formatRupiah(netProfit)}</div>
            <p className="text-xs text-muted-foreground mt-1">Margin: {Math.round((netProfit / stats.revenueYTD) * 100)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Trend Pendapatan vs Biaya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center border border-dashed rounded-md bg-muted/20">
              <span className="text-muted-foreground">Grafik Line Chart Area</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Biaya Operasional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center border border-dashed rounded-md bg-muted/20">
              <span className="text-muted-foreground">Grafik Pie Chart Area</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
