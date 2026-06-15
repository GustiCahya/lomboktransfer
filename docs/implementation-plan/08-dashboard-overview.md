# Step 08 - Dashboard Overview (Home)

**Fase:** 1 - Fondasi  
**Target:** Minggu 3 (Hari 11–12)  
**Dependency:** Step 05 (Booking), Step 06 (HR), Step 07 (Fleet)  
**Referensi PRD:** §11.2 Dashboard Overview (Home)

---

## Tujuan

Membangun halaman utama dashboard - satu layar overview semua metrik bisnis, alert prioritas, dan quick-action untuk operasional harian.

---

## Todo List

### 8.1 Data Layer

- [ ] Buat `hooks/useDashboard.ts`:
  - `useDashboardStats()` - aggregated stats (booking hari ini, supir aktif, dll)
  - `useTodayBookings()` - list booking hari ini
  - `useActiveTrips()` - trip yang sedang berlangsung (real-time)
  - `usePriorityAlerts()` - alert yang perlu perhatian
  - `useMonthlyRevenue()` - pendapatan bulan ini
- [ ] Buat Supabase SQL functions untuk aggregation:

  ```sql
  -- Fungsi hitung stats dashboard
  CREATE OR REPLACE FUNCTION get_dashboard_stats()
  RETURNS json AS $$
  -- Total booking hari ini, trip aktif, supir available, dll
  $$ LANGUAGE plpgsql;
  ```

### 8.2 Widget Operasional Hari Ini

- [ ] Buat section "Operasional Hari Ini":
  - **Card 1:** Total booking hari ini (angka + vs kemarin)
  - **Card 2:** Trip sedang berlangsung (angka + badge "LIVE")
  - **Card 3:** Supir aktif / total supir (ratio)
  - **Card 4:** Armada tersedia / total armada (ratio)
  - **Card 5:** Booking menunggu assign (angka + alert jika > 0)
- [ ] Buat `components/dashboard/StatsCard.tsx`:
  - Icon + label + angka besar
  - Trend indicator (↑↓) vs periode sebelumnya
  - Warna sesuai konteks (hijau = bagus, merah = perlu perhatian)
  - Klik → navigasi ke halaman terkait

### 8.3 Widget Keuangan Bulan Ini

- [ ] Buat section "Keuangan Bulan Ini":
  - Pendapatan gross (+ progress vs bulan lalu, bar)
  - Pendapatan nett (setelah komisi OTA)
  - Pengeluaran bulan ini
  - Estimasi profit bulan ini
  - Mini bar chart: daily revenue 30 hari terakhir
- [ ] **Note:** Data keuangan detail akan lengkap di Step 11 (Accounting). Saat ini tampilkan kalkulasi dari data booking.

### 8.4 Widget Alert Prioritas

- [ ] Buat section "Perlu Perhatian" (alert list):
  - 🔴 Dokumen akan expire dalam 14 hari (nama dokumen + pemilik + sisa hari)
  - 🟡 Kendaraan melebihi km servis (unit + sisa km / sudah lewat)
  - 🔴 Booking konflik jadwal (supir overlap)
  - 🟡 Booking menunggu assign > 1 jam
  - 🔴 Tamu komplain belum direspons
  - Setiap alert: icon + pesan + link ke halaman terkait + dismiss button
  - Sort by severity (merah dulu, lalu kuning)
  - Max 10 alerts, "Lihat Semua" link jika lebih
- [ ] Buat `components/dashboard/AlertList.tsx`
- [ ] Buat `components/dashboard/AlertItem.tsx`

### 8.5 Daftar Booking Hari Ini

- [ ] Buat section "Booking Hari Ini":
  - Tabel ringkas booking hari ini:
    | Jam | Tamu | Rute | Supir | Status |
  - Quick actions per row: assign supir, update status
  - Link "Lihat Semua" ke `/bookings?date=today`
- [ ] Buat `components/dashboard/TodayBookings.tsx`

### 8.6 Quick Actions

- [ ] Buat section "Aksi Cepat" (button group):
  - ➕ Booking Baru → `/bookings/new`
  - 📅 Kalender Dispatch → `/dispatch`
  - 👤 Tambah Supir → `/drivers/new`
  - 🚗 Tambah Kendaraan → `/fleet/new`
- [ ] Buat `components/dashboard/QuickActions.tsx`

### 8.7 Supabase Realtime Integration

- [ ] Buat `hooks/useRealtime.ts`:
  - Subscribe ke perubahan tabel `bookings` (INSERT, UPDATE)
  - Auto-refresh dashboard saat ada booking baru / status change
  - Notifikasi toast saat booking baru masuk
- [ ] Implementasi realtime untuk:
  - Booking baru masuk → toast "Booking baru: [Nama Tamu]"
  - Status trip berubah → update widget operasional
  - Supir update status → update supir aktif count

### 8.8 Layout & Responsiveness

- [ ] Layout dashboard `app/(dashboard)/page.tsx`:
  - Desktop: 2-kolom grid
    - Kiri (60%): Stats cards, Booking hari ini, Quick actions
    - Kanan (40%): Alert prioritas, Keuangan bulan ini
  - Tablet: single column, reorder prioritas
  - Mobile: single column, cards stacked
- [ ] Animasi masuk (fade-in staggered) untuk cards

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Stats cards | 5 cards operasional hari ini, real-time update |
| Finance widget | 4 metrik keuangan + mini chart |
| Alert list | Auto-detect dokumen expire, konflik, pending assign |
| Today bookings | Tabel ringkas + quick actions |
| Quick actions | 4 shortcut buttons |
| Realtime | Auto-refresh saat data berubah di Supabase |
| Responsive | Layout berfungsi di semua resolusi |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 8.1 Data layer | 2 jam |
| 8.2 Stats cards | 2 jam |
| 8.3 Finance widget | 2 jam |
| 8.4 Alert prioritas | 3 jam |
| 8.5 Today bookings | 1.5 jam |
| 8.6 Quick actions | 30 menit |
| 8.7 Realtime | 2 jam |
| 8.8 Layout responsive | 1 jam |
| **Total** | **~14 jam** |
