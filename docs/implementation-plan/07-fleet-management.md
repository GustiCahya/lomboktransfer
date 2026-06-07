# Step 07 — Modul Fleet Management

**Fase:** 1 — Fondasi  
**Target:** Minggu 2–3 (Hari 9–11)  
**Dependency:** Step 04 (Layout), Step 02 (Database)  
**Referensi PRD:** §6 Modul 3 — Fleet Management

---

## Tujuan

Membangun manajemen armada kendaraan — inventaris unit, dokumen kendaraan, jadwal servis, log penggunaan, insiden, dan biaya operasional per unit.

---

## Todo List

### 7.1 Data Layer — Hooks & Services
- [ ] Buat `hooks/useVehicles.ts`:
  - `useVehicles(filters)` — list semua kendaraan
  - `useVehicle(id)` — single vehicle detail
  - `useCreateVehicle()` — mutation create
  - `useUpdateVehicle()` — mutation update
- [ ] Buat `hooks/useVehicleDocuments.ts`:
  - `useVehicleDocuments(vehicleId)` — list dokumen per kendaraan
  - `useExpiringVehicleDocs(days)` — dokumen akan expire
- [ ] Buat `hooks/useServiceRecords.ts`:
  - `useServiceRecords(vehicleId)` — riwayat servis per kendaraan
  - `useCreateServiceRecord()` — mutation create
  - `useUpcomingServices()` — kendaraan yang akan perlu servis
- [ ] Buat `lib/validations/vehicle.ts` — Zod schema

### 7.2 Inventaris Armada (List)
- [ ] Buat `app/(dashboard)/fleet/page.tsx`:
  - PageHeader: "Manajemen Armada" + tombol "Tambah Kendaraan"
  - Filter: status (Aktif/Perawatan/Tidak Aktif/Dijual)
  - Search: unit code atau plat nomor
  - Card grid kendaraan:
    | Data | Detail |
    |---|---|
    | Foto | Foto utama kendaraan |
    | Unit Code | LT-01, LT-02, dll |
    | Merek & Model | Toyota Innova Reborn |
    | Plat Nomor | DR 1234 AB |
    | Kapasitas | 7 penumpang |
    | Status | Badge (Aktif/Perawatan/dll) |
    | KM Saat Ini | 45.000 km |
    | Next Service | 50.000 km (sisa 5.000 km) |
    | Alert | ⚠️ jika dokumen/servis expire soon |
  - Toggle view: card grid vs list
- [ ] Buat `components/fleet/VehicleCard.tsx`
- [ ] Buat `components/fleet/VehicleTable.tsx`

### 7.3 Detail Kendaraan
- [ ] Buat `app/(dashboard)/fleet/[id]/page.tsx`:
  - **Tab 1 — Identitas Kendaraan:**
    - Foto kendaraan (gallery: eksterior + interior)
    - Data lengkap: unit code, merek, model, tahun, warna
    - Nomor plat (TNKB), VIN, nomor mesin
    - Kapasitas penumpang
    - Status: Aktif / Perawatan / Tidak Aktif / Dijual
    - Odometer saat ini
    - Supir yang biasa pakai (linked ke HR)
  - **Tab 2 — Dokumen Kendaraan:**
    - Tabel dokumen:
      | Jenis | File | Terbit | Expire | Sisa Hari | Status |
    - Jenis: STNK, KIR, Asuransi Kendaraan (TLO/All Risk), Asuransi Penumpang
    - Untuk asuransi: nama asuransi + nomor polis
    - Upload / update file
    - Alert untuk dokumen mendekati expire
  - **Tab 3 — Riwayat Servis:**
    - Tabel servis records:
      | Tanggal | Jenis | KM Saat Servis | Bengkel | Biaya | Next Service | Bukti |
    - Jenis: Ganti Oli, Servis Rutin, Ganti Ban, Aki, Rem, Lainnya
    - Tombol "Tambah Record Servis"
    - Alert: highlight jika KM saat ini sudah mendekati jadwal servis
    - Visual: progress bar KM menuju next service
  - **Tab 4 — Log Penggunaan:**
    - Input odometer harian (manual)
    - Grafik: total KM per bulan (bar chart)
    - Rata-rata KM per trip
    - Total KM bulan ini vs bulan lalu
  - **Tab 5 — Insiden & Kerusakan:**
    - Tabel insiden:
      | Tanggal | Supir | Deskripsi | Foto | Klaim Asuransi | Biaya | Status |
    - Form tambah insiden:
      - Tanggal, kendaraan (pre-fill), supir (dropdown)
      - Deskripsi kejadian (textarea)
      - Upload foto kerusakan (multiple)
      - Status klaim asuransi: N/A / Diajukan / Approved / Ditolak
      - Biaya perbaikan
      - Status: Dalam Perbaikan / Selesai
  - **Tab 6 — Biaya Operasional:**
    - Dashboard per kendaraan:
      - Total biaya servis YTD
      - Estimasi biaya BBM (KM × konsumsi rata-rata)
      - Total pendapatan dari unit ini
      - Profit kontribusi unit
    - Grafik: biaya vs pendapatan per bulan (12 bulan, line chart)
    - Breakdown biaya per kategori (pie chart)
- [ ] Buat `components/fleet/VehicleIdentity.tsx`
- [ ] Buat `components/fleet/VehicleDocuments.tsx`
- [ ] Buat `components/fleet/ServiceHistory.tsx`
- [ ] Buat `components/fleet/UsageLog.tsx`
- [ ] Buat `components/fleet/IncidentLog.tsx`
- [ ] Buat `components/fleet/OperationalCost.tsx`

### 7.4 Form Tambah/Edit Kendaraan
- [ ] Buat `app/(dashboard)/fleet/new/page.tsx`:
  - Form fields: semua data identitas kendaraan
  - Upload foto (multiple, eksterior + interior)
  - Validasi: unit code unik, plat nomor unik
- [ ] Buat `app/(dashboard)/fleet/[id]/edit/page.tsx` — edit form
- [ ] Buat `components/fleet/VehicleForm.tsx`
- [ ] Buat `components/fleet/PhotoUploader.tsx` — multi-photo upload dengan preview

### 7.5 Form Tambah Record Servis
- [ ] Buat `components/fleet/ServiceRecordForm.tsx`:
  - Dialog/modal form:
    - Tanggal servis
    - Kendaraan (pre-filled jika dari detail)
    - Jenis servis (dropdown)
    - KM saat servis
    - Bengkel (dropdown dari vendor kategori "workshop")
    - Biaya (Rupiah)
    - Catatan mekanik
    - Next service: KM atau tanggal
    - Upload bukti servis (foto/invoice)
  - Auto-update `last_service_km` di tabel vehicles
  - Auto-update `current_km` jika KM servis > current

### 7.6 Jadwal Servis Overview
- [ ] Buat `app/(dashboard)/fleet/services/page.tsx`:
  - Dashboard semua kendaraan + status servis:
    | Unit | KM Saat Ini | Last Service | Next Service | Sisa KM | Status |
  - Highlight: merah jika sudah melewati batas, kuning jika mendekati
  - Kalender servis terjadwal (jika berdasarkan tanggal)
  - Quick action: "Catat Servis" per kendaraan

### 7.7 Fleet Statistics Widget
- [ ] Buat `components/fleet/FleetStats.tsx`:
  - Cards ringkasan:
    - Total armada aktif
    - Dalam perawatan
    - Utilisasi hari ini (% kendaraan terpakai)
    - Kendaraan perlu servis segera
  - Digunakan di dashboard overview (Step 08)

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Inventaris armada | Card grid + list, filter, search |
| Detail kendaraan | 6 tabs lengkap |
| Form CRUD kendaraan | Tambah + edit + multi-photo upload |
| Record servis | Form input + riwayat + jadwal overview |
| Insiden log | CRUD insiden + foto kerusakan |
| Biaya operasional | Dashboard cost vs revenue per unit |
| Fleet stats | Cards ringkasan untuk dashboard |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 7.1 Data layer | 2 jam |
| 7.2 Inventaris list | 3 jam |
| 7.3 Detail (6 tabs) | 8 jam |
| 7.4 Form CRUD | 3 jam |
| 7.5 Service record form | 2 jam |
| 7.6 Service overview | 2 jam |
| 7.7 Fleet stats widget | 1 jam |
| **Total** | **~21 jam** |
