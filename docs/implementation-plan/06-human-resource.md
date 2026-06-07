# Step 06 — Modul Human Resource

**Fase:** 1 — Fondasi  
**Target:** Minggu 2–3 (Hari 8–10)  
**Dependency:** Step 04 (Layout), Step 02 (Database)  
**Referensi PRD:** §5 Modul 2 — Human Resource

---

## Tujuan

Membangun manajemen data supir dan staf — profil lengkap, dokumen, jadwal ketersediaan, riwayat trip, penilaian performa, payroll, dan SOP.

---

## Todo List

### 6.1 Data Layer — Hooks & Services
- [ ] Buat `hooks/useDrivers.ts`:
  - `useDrivers(filters)` — list semua supir
  - `useDriver(id)` — single driver detail
  - `useCreateDriver()` — mutation create
  - `useUpdateDriver()` — mutation update
  - `useDriverTrips(id, period)` — riwayat trip per supir
  - `useDriverPerformance(id)` — metrik performa
- [ ] Buat `hooks/useDriverDocuments.ts`:
  - `useDriverDocuments(driverId)` — list dokumen per supir
  - `useUploadDocument()` — upload file ke Supabase Storage
  - `useExpiringDocuments(days)` — dokumen yang akan expire
- [ ] Buat `lib/validations/driver.ts` — Zod schema untuk profil supir
- [ ] Buat `lib/utils/format.ts` — helper format Rupiah, tanggal Indonesia

### 6.2 Daftar Supir
- [ ] Buat `app/(dashboard)/drivers/page.tsx`:
  - PageHeader: "Manajemen Supir" + tombol "Tambah Supir"
  - Filter: status (Aktif/Non-aktif/Cuti), tipe (Karyawan/Mitra Lepas)
  - Search: nama atau nomor HP
  - Tabel/Grid supir:
    | Kolom | Data |
    |---|---|
    | Foto | Avatar foto profil |
    | Nama | Nama lengkap |
    | HP/WA | Nomor WhatsApp |
    | Status | Badge (Aktif/Non-aktif/Cuti) |
    | Tipe | Karyawan / Mitra Lepas |
    | Trip Bulan Ini | Jumlah total |
    | Rating | Stars (1-5) rata-rata |
    | Dokumen | Alert icon jika ada yang expire soon |
  - Toggle view: list vs card grid
- [ ] Buat `components/drivers/DriverTable.tsx`
- [ ] Buat `components/drivers/DriverCard.tsx` — card view per supir

### 6.3 Profil Supir Detail
- [ ] Buat `app/(dashboard)/drivers/[id]/page.tsx`:
  - **Tab 1 — Informasi Pribadi:**
    - Foto profil (upload/change)
    - Nama lengkap, NIK, tanggal lahir, alamat
    - Nomor HP/WA, email
    - Nomor rekening + nama bank
    - Kontak darurat (nama + nomor)
    - Status kerja: Aktif / Non-aktif / Cuti
    - Tanggal bergabung, tipe mitra
    - Kendaraan yang biasa dikendarai (linked ke Fleet)
    - Persentase komisi default
  - **Tab 2 — Dokumen:**
    - Tabel dokumen:
      | Jenis | File | Tanggal Terbit | Tanggal Expire | Sisa Hari | Status |
    - Jenis dokumen: KTP, SIM A, SIM B1, SKCK, Surat Sehat
    - Upload file baru (drag & drop atau file picker)
    - Preview file (image/PDF)
    - Alert badge untuk dokumen yang akan/sudah expire
    - Tombol perpanjang (update file + tanggal expire baru)
  - **Tab 3 — Riwayat Trip:**
    - Ringkasan: Total trip bulan ini / bulan lalu / all time
    - Breakdown per rute (bar chart)
    - Tabel trip: tanggal, rute, tamu, status, pendapatan
    - Filter per bulan/tahun
  - **Tab 4 — Performa:**
    - Scorecard:
      - Rating rata-rata tamu (1-5 bintang)
      - On-time rate (%)
      - Completion rate (%)
      - Jumlah komplain
      - Jumlah pembatalan oleh supir
    - Radar chart performa
    - Ranking posisi di antara semua supir
    - Timeline feedback/review tamu
  - **Tab 5 — Payroll:**
    - Tabel per bulan:
      | Periode | Total Trip | Pendapatan Kotor | Komisi (%) | Total Komisi | Bonus | Potongan | Dibayar | Status |
    - Detail per periode (expand)
    - Link ke slip gaji PDF
    - Status: Draft / Approved / Dibayar
- [ ] Buat `components/drivers/DriverProfile.tsx`
- [ ] Buat `components/drivers/DocumentsTab.tsx`
- [ ] Buat `components/drivers/TripHistoryTab.tsx`
- [ ] Buat `components/drivers/PerformanceTab.tsx`
- [ ] Buat `components/drivers/PayrollTab.tsx`

### 6.4 Form Tambah/Edit Supir
- [ ] Buat `app/(dashboard)/drivers/new/page.tsx` — form tambah supir
- [ ] Buat `app/(dashboard)/drivers/[id]/edit/page.tsx` — form edit supir
- [ ] Form fields:
  - Semua field dari "Informasi Pribadi" (6.3 Tab 1)
  - Upload foto profil
  - Multi-step form jika terlalu panjang
- [ ] Validasi:
  - NIK unik
  - Nomor HP valid (format Indonesia)
  - Nomor rekening format valid
- [ ] Saat create: auto-create Supabase Auth user untuk supir (role: driver)

### 6.5 Jadwal & Shift
- [ ] Buat `app/(dashboard)/drivers/schedule/page.tsx`:
  - Kalender mingguan: semua supir dalam satu view
  - Baris = supir, Kolom = hari
  - Warna cells:
    - Hijau = Available
    - Abu = Cuti
    - Merah = Tidak Tersedia
    - Biru = Ada trip (linked ke booking)
  - Admin bisa set hari cuti / tidak tersedia per supir (klik cell → dialog)
  - Filter: tampilkan supir tertentu
- [ ] Buat `components/drivers/ScheduleCalendar.tsx`
- [ ] Buat `components/drivers/SetAvailabilityDialog.tsx`

### 6.6 Payroll & Komisi (Detail di Step 11)
- [ ] Buat halaman payroll placeholder `app/(dashboard)/drivers/payroll/page.tsx`
- [ ] Implementasi dasar:
  - List semua supir + total trip + estimasi komisi bulan berjalan
  - Auto-kalkulasi berdasarkan trip yang status "completed"
  - **Detail proses payroll lengkap akan di Step 11 (Accounting)**

### 6.7 SOP & Training
- [ ] Buat `app/(dashboard)/drivers/sop/page.tsx`:
  - Repositori dokumen SOP (upload PDF)
  - Daftar SOP wajib baca supir baru
  - Checklist onboarding supir baru (per supir):
    - [ ] Baca SOP Keselamatan
    - [ ] Baca SOP Layanan Tamu
    - [ ] Training Rute Utama
    - [ ] Test Drive
    - [ ] dll (configurable)
  - Log training per supir (tanggal, materi, status)
- [ ] Buat `components/drivers/SOPRepository.tsx`
- [ ] Buat `components/drivers/OnboardingChecklist.tsx`

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Daftar supir | Tabel + card view, filter, search |
| Profil supir | 5 tabs lengkap (info, dokumen, trip, performa, payroll) |
| Form CRUD supir | Tambah + edit dengan validasi lengkap |
| Upload dokumen | File upload ke Supabase Storage + expiry tracking |
| Jadwal supir | Kalender mingguan all-drivers view |
| SOP repository | Upload + daftar + checklist onboarding |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 6.1 Data layer | 2 jam |
| 6.2 Daftar supir | 3 jam |
| 6.3 Profil detail (5 tabs) | 8 jam |
| 6.4 Form CRUD | 3 jam |
| 6.5 Jadwal & shift | 4 jam |
| 6.6 Payroll placeholder | 1 jam |
| 6.7 SOP & training | 2 jam |
| **Total** | **~23 jam** |
