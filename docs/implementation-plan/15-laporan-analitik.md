# Step 15 — Modul Laporan & Analitik

**Fase:** 4 — CRM & Analytics  
**Target:** Minggu 8–9 (Hari 34–36)  
**Dependency:** Semua modul sebelumnya  
**Referensi PRD:** §11 Modul 8 — Laporan & Analitik

---

## Tujuan

Membangun satu halaman pusat untuk overview seluruh metrik bisnis, visualisasi grafik tingkat lanjut, dan export laporan (PDF/CSV) untuk keperluan manajemen dan investor.

---

## Todo List

### 15.1 Data Layer (Analytics Data)
- [ ] Buat `hooks/useAnalytics.ts`:
  - `useRevenueTrend(period)` — trend pendapatan vs pengeluaran
  - `useBookingSources()` — pie chart sumber booking
  - `useRoutePopularity()` — rute terlaris
  - `useDriverPerformanceChart()` — radar/bar chart perbandingan supir
  - `useFleetUtilization()` — % kendaraan terpakai vs idle
  - `useGuestDemographics()` — distribusi negara tamu
- [ ] Buat SQL Views/Functions kompleks di Supabase untuk agregasi data berat agar frontend ringan.

### 15.2 Dashboard Analytics (Visualisasi)
- [ ] Buat `app/(dashboard)/reports/page.tsx`:
  - PageHeader: "Laporan & Analitik"
  - Global Date Filter: Bulan Ini / Kuartal Ini / Tahun Ini / Custom Range
  - Grid Layout (mirip Google Analytics):
    - **Row 1: Key Metrics (Cards)**
      - Total Bookings
      - Gross Revenue
      - Net Profit
      - Average Order Value (AOV)
    - **Row 2: Trends (Line/Area Charts)**
      - Pendapatan vs Pengeluaran (12 bulan terakhir)
      - Trend volume booking mingguan
    - **Row 3: Breakdown (Pie/Donut Charts)**
      - Sumber Booking (Klook, Viator, Direct, WA)
      - Demografi Kebangsaan Tamu
    - **Row 4: Operasional (Bar/Radar Charts)**
      - Top 5 Rute Paling Populer
      - Top 5 Supir (Berdasarkan jumlah trip & rating)
      - Utilisasi Armada per unit
- [ ] Buat `components/reports/MetricCard.tsx`
- [ ] Buat komponen chart (menggunakan `recharts`):
  - `RevenueTrendChart.tsx`
  - `SourceDistributionChart.tsx`
  - `RoutePopularityChart.tsx`
  - `DemographicsChart.tsx`
  - `FleetUtilizationChart.tsx`

### 15.3 Export Laporan Center
- [ ] Buat `app/(dashboard)/reports/exports/page.tsx`:
  - Daftar laporan yang bisa di-generate:
    1. Rekap Booking Mingguan (CSV)
    2. Laporan Pendapatan Bulanan (PDF)
    3. Rekap Komisi Supir Bulanan (PDF)
    4. Laporan P&L Lengkap (PDF)
    5. Laporan Performa Supir (PDF)
    6. Laporan Biaya Armada per Unit (PDF)
  - UI: Pilih Jenis Laporan → Pilih Periode → Tombol "Generate & Download"
- [ ] Buat `lib/exports/pdf-generator.ts` — helper untuk report PDF menggunakan `@react-pdf/renderer`
- [ ] Buat `lib/exports/csv-generator.ts` — helper export data tabel ke CSV menggunakan `papaparse` atau vanilla JS blob

### 15.4 Integrasi Laporan Otomatis (n8n update)
- [ ] Extend Workflow 9 (PRD §10.11):
  - Tambahkan fitur generate PDF summary mingguan di n8n (kirim otomatis tiap Senin pagi ke WA owner)
  - Atau: buat Supabase Edge Function untuk generate PDF, dipanggil oleh n8n

### 15.5 Reports Sub-Navigation
- [ ] Buat `app/(dashboard)/reports/layout.tsx`:
  - Sub-nav tabs:
    - Dashboard Analitik → `/reports`
    - Export Center → `/reports/exports`

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Supabase SQL Views | Views untuk agregasi data reporting dibuat |
| Dashboard analytics | 4 row grid + 6 jenis chart interaktif |
| Global date filter | Filter mengubah semua chart secara simultan |
| Export center | Berhasil generate dan download 6 jenis laporan (PDF/CSV) |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 15.1 Supabase SQL Views | 3 jam |
| 15.2 Chart Components | 5 jam |
| 15.3 Dashboard Layout | 2 jam |
| 15.4 PDF/CSV Generators | 6 jam |
| 15.5 Navigation & Integrasi | 1 jam |
| **Total** | **~17 jam** |
