/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CashflowAreaChart({ data, year }: { data: any[]; year: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Arus Kas Bulanan - {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} className="text-xs" />
            <Tooltip formatter={(v: any) => `Rp ${Number(v).toLocaleString("id-ID")}`} />
            <Legend />
            <Area type="monotone" dataKey="Kas Masuk" stroke="hsl(var(--success))" fill="url(#colorIn)" strokeWidth={2} />
            <Area type="monotone" dataKey="Kas Keluar" stroke="hsl(var(--destructive))" fill="url(#colorOut)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
