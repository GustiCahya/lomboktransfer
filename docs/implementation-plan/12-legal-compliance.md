# Step 12 - Modul Legal & Compliance

**Fase:** 3 - Keuangan & Compliance  
**Target:** Minggu 6–7 (Hari 25–28)  
**Dependency:** Step 06 (HR), Step 07 (Fleet)  
**Referensi PRD:** §9 Modul 6 - Legal & Compliance

---

## Tujuan

Membangun tracker dokumen legal perusahaan, konsolidasi expiry dokumen supir & kendaraan, kontrak mitra, alert otomatis, dan kepatuhan data (GDPR/privacy).

---

## Todo List

### 12.1 Data Layer

- [ ] Buat `hooks/useCompanyDocuments.ts`:
  - `useCompanyDocuments(filters)` - list dokumen perusahaan
  - `useCreateCompanyDocument()` - mutation create
  - `useUpdateCompanyDocument()` - mutation update
- [ ] Buat `hooks/useContracts.ts`:
  - `useContracts(filters)` - list kontrak mitra
  - `useCreateContract()` - mutation create
- [ ] Buat `hooks/useExpiryTracker.ts`:
  - `useAllExpiringDocs(days)` - konsolidasi semua dokumen akan expire
  - `useExpiringDriverDocs(days)` - dokumen supir
  - `useExpiringVehicleDocs(days)` - dokumen kendaraan
  - `useExpiringCompanyDocs(days)` - dokumen perusahaan
- [ ] Buat `lib/validations/legal.ts` - Zod schemas

### 12.2 Dokumen Perusahaan

- [ ] Buat `app/(dashboard)/legal/page.tsx`:
  - PageHeader: "Legal & Compliance"
  - Sub-nav: Dokumen Perusahaan | Expiry Tracker | Kontrak Mitra | Kepatuhan Data
- [ ] Buat `app/(dashboard)/legal/company-docs/page.tsx`:
  - Tombol "Tambah Dokumen"
  - Tabel dokumen perusahaan:
    | Nama Dokumen | Nomor | Instansi | Terbit | Berlaku s/d | Sisa Hari | Status | PIC | File |
  - Daftar dokumen wajib (PRD §9.2.1):
    - SIUP, NPWP, Akta Pendirian, SK Kemenkumham, NIB/OSS
    - Izin Pariwisata, TDUP, Izin Dishub, Domisili Usaha
  - Status: Aktif / Kadaluarsa / Proses Perpanjangan
  - Alert badge untuk dokumen mendekati/sudah expire
  - Preview/download file scan
- [ ] Buat `components/legal/CompanyDocTable.tsx`
- [ ] Buat `components/legal/CompanyDocForm.tsx` (dialog):
  - Nama dokumen
  - Nomor dokumen
  - Instansi penerbit
  - Tanggal terbit
  - Tanggal berlaku (expiry)
  - Upload file scan (PDF/image)
  - PIC yang bertanggung jawab perpanjangan
  - Catatan

### 12.3 Expiry Tracker (Konsolidasi)

- [ ] Buat `app/(dashboard)/legal/expiry-tracker/page.tsx`:
  - **Tab Dokumen Supir** (linked ke HR):
    - Tabel konsolidasi SEMUA dokumen supir yang akan expire:
      | Supir | Jenis Dokumen | Tanggal Expire | Sisa Hari | Status |
    - Filter: "Expire dalam 30 hari" / "Expire dalam 60 hari" / "Sudah expire"
    - Sort by sisa hari (sedikit dulu)
    - Klik → navigasi ke profil supir (tab dokumen)
  - **Tab Dokumen Kendaraan** (linked ke Fleet):
    - Tabel konsolidasi SEMUA dokumen kendaraan:
      | Unit | Jenis Dokumen | Tanggal Expire | Sisa Hari | Status |
    - Filter sama
    - Klik → navigasi ke detail kendaraan (tab dokumen)
  - **Tab Dokumen Perusahaan**:
    - Filter sama, navigasi ke detail dokumen
  - **Summary cards di atas:**
    - 🔴 Sudah expire: [X] dokumen
    - 🟡 Expire dalam 30 hari: [X] dokumen
    - 🟢 Expire dalam 60 hari: [X] dokumen
    - ✅ Semua aman: [X] dokumen
- [ ] Buat `components/legal/ExpiryTrackerTable.tsx`
- [ ] Buat `components/legal/ExpirySummaryCards.tsx`

### 12.4 Kontrak Mitra

- [ ] Buat `app/(dashboard)/legal/contracts/page.tsx`:
  - Daftar semua kontrak:
    | Pihak | Jenis | Tipe Kontrak | Mulai | Berakhir | Sisa | Status | File |
  - Pihak: supir mitra, hotel partner, travel agent, lainnya
  - Status: Aktif / Expired / Dalam Negosiasi
  - Alert perpanjangan H-60
  - Tombol "Tambah Kontrak"
- [ ] Buat `components/legal/ContractTable.tsx`
- [ ] Buat `components/legal/ContractForm.tsx` (dialog):
  - Pihak (nama)
  - Jenis pihak (dropdown: supir, hotel, travel agent, lainnya)
  - Jenis kontrak
  - Tanggal mulai & berakhir
  - Poin penting (ringkasan textarea)
  - Upload file kontrak PDF
  - Status

### 12.5 Kepatuhan Data (GDPR/Privacy)

- [ ] Buat `app/(dashboard)/legal/data-compliance/page.tsx`:
  - **Log Penghapusan Data:**
    - Daftar request penghapusan data tamu (right to be forgotten)
    - Per request: nama tamu, tanggal request, status (Pending/Diproses/Selesai), tanggal selesai
    - Tombol "Proses Penghapusan" → soft-delete data tamu dari sistem
  - **Kebijakan Retensi:**
    - Info: data tamu aktif → disimpan selamanya
    - Data tamu non-aktif → retensi 3 tahun
    - Daftar tamu non-aktif > 3 tahun (candidates for deletion)
  - **Log Akses Data Sensitif:**
    - Siapa mengakses data apa, kapan
    - Tabel: user, data type, action, timestamp, IP address
    - Filter per user, per data type
- [ ] Buat `components/legal/DataDeletionLog.tsx`
- [ ] Buat `components/legal/RetentionPolicy.tsx`
- [ ] Buat `components/legal/AccessLog.tsx`
- [ ] Buat tabel `data_access_log`:

  ```sql
  data_access_log (id, user_id, data_type, data_id, action, ip_address, created_at)
  ```

- [ ] Buat tabel `data_deletion_requests`:

  ```sql
  data_deletion_requests (id, guest_id, requested_at, processed_at, status, processed_by)
  ```

### 12.6 Legal Sub-Navigation

- [ ] Buat `app/(dashboard)/legal/layout.tsx`:
  - Sub-nav tabs:
    - Dokumen Perusahaan → `/legal/company-docs`
    - Expiry Tracker → `/legal/expiry-tracker`
    - Kontrak Mitra → `/legal/contracts`
    - Kepatuhan Data → `/legal/data-compliance`

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Dokumen perusahaan | CRUD + upload + expiry tracking |
| Expiry tracker | Konsolidasi 3 jenis dokumen + filter + alert |
| Kontrak mitra | CRUD + expiry alert |
| Kepatuhan data | Deletion log + retensi + access log |
| Summary cards | Visualisasi status semua dokumen |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 12.1 Data layer | 1.5 jam |
| 12.2 Dokumen perusahaan | 3 jam |
| 12.3 Expiry tracker | 4 jam |
| 12.4 Kontrak mitra | 2.5 jam |
| 12.5 Kepatuhan data | 3 jam |
| 12.6 Navigation | 30 menit |
| **Total** | **~14.5 jam** |
