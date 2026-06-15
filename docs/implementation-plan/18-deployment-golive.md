# Step 18 - Deployment & Go-Live

**Fase:** Cross-cutting (Fase Akhir)  
**Target:** Minggu 12 (Hari 43–45)  
**Dependency:** Seluruh Development & Testing selesai  
**Referensi PRD:** §3 Arsitektur & Tech Stack, §15 Non-Functional Requirements

---

## Tujuan

Menyiapkan seluruh infrastruktur cloud (Frontend, Database, Otomasi) untuk lingkungan production, migrasi data awal, pelatihan staf, dan peluncuran resmi sistem untuk digunakan dalam operasional nyata.

---

## Todo List

### 18.1 Setup Infrastruktur Production

- [ ] **Database (Supabase Cloud):**
  - Pastikan menggunakan project yang berbeda untuk Production (jangan gabung dengan Staging/Dev).
  - Terapkan seluruh SQL Migrations ke project Production.
  - Setup Custom Domain untuk Supabase (Opsional).
  - Enable Point-in-Time Recovery (PITR) jika masuk budget Pro plan (untuk backup data aman).
- [ ] **Frontend (Vercel):**
  - Hubungkan repository GitHub cabang `main` ke Vercel.
  - Set production environment variables (Supabase URL, Fonnte Key, dll).
  - Hubungkan dengan domain kustom (misal: `dashboard.lomboktransfer.com`).
  - Aktifkan perlindungan dasar (Vercel Web Analytics & Speed Insights).
- [ ] **Otomasi (VPS/Railway - n8n):**
  - Deploy n8n instance yang stabil.
  - Konfigurasi Webhook URL n8n menggunakan IP statis / domain kustom (misal: `n8n.lomboktransfer.com`).
  - Ganti credential test menjadi credential Fonnte & Claude versi Production.

### 18.2 Data Migration (Soft Launch)

- [ ] Kosongkan data dummy (kecuali akun admin/owner).
- [ ] Import data master sebenarnya via script atau manual entry:
  - Master Rute (harga terupdate).
  - Daftar Armada (unit, plat nomor, tanggal dokumen).
  - Profil Supir (semua supir yang aktif saat ini).
  - Direktori Vendor.
- [ ] Masukkan booking-booking yang sedang berjalan atau akan datang di bulan tersebut (Migrasi transisi).

### 18.3 Konfigurasi WhatsApp API

- [ ] Pastikan nomor Fonnte yang digunakan adalah nomor resmi bisnis Lombok Transfer.
- [ ] Cek profil WhatsApp Business (Logo, Deskripsi, Jam Kerja).
- [ ] Infokan ke Supir bahwa mereka akan menerima pesan tugas dari nomor ini.

### 18.4 Training Internal & SOP

- [ ] Buat sesi pelatihan 1-2 jam untuk Admin & Dispatcher (penggunaan dashboard desktop).
- [ ] Buat sesi briefing untuk para Supir:
  - Cara login di HP (simpan shortcut di Home Screen).
  - Cara klik tombol "Update Status" saat jemput tamu.
  - Kewajiban upload/lapor jika dokumen mau expire.
- [ ] Sediakan panduan darurat (Jika server down, kembali ke catatan manual / grup WA lama sementara).

### 18.5 Pemantauan Pasca-Launch (Post-Go-Live Support)

- [ ] Pantau log error Next.js (Sentry atau Vercel Logs) selama 7 hari pertama.
- [ ] Pantau eksekusi workflow di n8n untuk melihat apakah ada gagal kirim WA.
- [ ] Minta masukan langsung dari supir mengenai UI di HP mereka (apakah tombol terlalu kecil, loading lambat, dll).
- [ ] Lakukan penyesuaian UX minor berdasarkan keluhan hari pertama.

### 18.6 Handover Dokumentasi

- [ ] Kumpulkan daftar semua credential (Supabase, Vercel, VPS, Fonnte, domain) di dalam secure vault (misal: Bitwarden / 1Password) dan serahkan ke Owner.
- [ ] Dokumentasi struktur database (ERD).
- [ ] Panduan restart VPS (jika n8n hang).

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Domain aktif | Dashboard bisa diakses via URL production (tanpa embel-embel vercel.app jika memungkinkan) |
| Data master | Data armada, supir, rute valid |
| Training selesai | Seluruh staf dan supir paham alur kerja baru |
| Credential Handover | Semua akses sistem diserahkan ke owner secara aman |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 18.1 Setup infrastruktur production | 4 jam |
| 18.2 Data migration & input master | 6 jam |
| 18.3 Setup WA Official | 1 jam |
| 18.4 Sesi Training staf | 4 jam |
| 18.5 Monitoring hari 1-3 | 6 jam |
| 18.6 Penyusunan Dokumen Handover | 3 jam |
| **Total** | **~24 jam** |
