# Step 17 — Testing & QA

**Fase:** Cross-cutting (Berjalan terus menerus)  
**Target:** Ongoing hingga Go-Live  
**Dependency:** Modul yang sudah selesai dibangun  
**Referensi PRD:** §15 Non-Functional Requirements

---

## Tujuan

Memastikan semua fungsionalitas berjalan sesuai spesifikasi tanpa bug kritis, menjaga performa dashboard agar cepat, dan memverifikasi akses role (security) sebelum dipakai di lingkungan produksi.

---

## Todo List

### 17.1 Unit Testing Dasar (Opsional namun disarankan)
- [ ] Setup Jest dan React Testing Library (atau Vitest).
- [ ] Tulis test untuk fungsi kritis di folder `lib/utils` dan `lib/validations`:
  - Format uang (Rupiah).
  - Validasi schema booking (memastikan field wajib ditangkap).
  - Parser CSV (memastikan data dari Klook ter-parse dengan benar).
  - Kalkulator Komisi & Payroll.

### 17.2 End-to-End (E2E) Testing Flow Kritis
- [ ] Gunakan tool seperti Cypress atau Playwright untuk mensimulasikan user journey utama:
  - **Journey 1 (Booking & Dispatch):** Admin login -> Buat booking manual -> Booking muncul di list -> Assign supir -> Log out.
  - **Journey 2 (Driver Mobile):** Supir login -> Cek trip hari ini -> Klik "Sedang Menuju Tamu" -> Klik "Selesai" -> Odometer ke-update.
  - **Journey 3 (Keuangan):** Accountant login -> Masukkan pengeluaran BBM -> Generate invoice PDF.

### 17.3 Security & Role-Based Access Control (RBAC) Check
- [ ] Pengujian manual login dengan berbagai akun (Owner, Admin, Dispatcher, Driver, Accountant).
- [ ] Verifikasi Row Level Security (RLS) di Supabase:
  - Login sebagai `driver` -> Coba bypass URL/query API untuk melihat data supir lain (harus gagal).
  - Login sebagai `dispatcher` -> Coba buka route `/accounting` atau update tabel payroll (harus redirect atau gagal).
  - Login sebagai `admin` -> Pastikan bisa akses booking tapi tidak melihat profit/margin detail jika dikunci (tergantung rule owner).

### 17.4 UI/UX & Responsive Testing
- [ ] Test Mobile Driver View pada device riil (atau Chrome DevTools):
  - Resolusi 375px (iPhone SE/Android kecil).
  - Cek touch target (minimal 44x44px).
  - Cek tampilan dalam mode portrait dan landscape.
- [ ] Test Desktop Admin Dashboard:
  - Resolusi minimum 1024px.
  - Resolusi standar 1440px.
  - Cek interaksi modal/dialog, dropdown, dan date picker (tidak tertutup/overflow).
- [ ] Dark Mode testing (jika diimplementasikan).

### 17.5 Performance & Load Testing
- [ ] Lighthouse Audit untuk performa (Target > 90 untuk SEO, Performance, Accessibility).
- [ ] Cek load time untuk tabel Booking List dengan data dummy > 500 records (Pastikan pagination berfungsi cepat < 1 detik).
- [ ] Cek size bundle Next.js, lakukan code splitting jika komponen berat membebani first load.

### 17.6 Automation & Webhook Testing
- [ ] Test trigger dari n8n ke WhatsApp Fonnte dengan nomor tester (pastikan jangan sampai WA me-rate limit atau ter-ban).
- [ ] Test skenario booking batal (Apakah notifikasi pembatalan masuk ke tamu dan supir).
- [ ] Cek penjadwalan cron job n8n (Reminder H-1, Reminder 3 jam, Notif Expire).

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| E2E Testing | Skenario Booking, Driver, dan Accounting bisa diselesaikan tanpa error |
| Security Check | RBAC dan RLS berfungsi ketat (tidak ada data bocor antar role) |
| Performance Report | Lighthouse audit hijau, tabel besar termuat cepat |
| Notification Test | Semua template WA terkirim dengan format benar |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 17.1 Unit Testing Kritis | 4 jam |
| 17.2 E2E Manual/Scripting | 6 jam |
| 17.3 RBAC & RLS Audit | 3 jam |
| 17.4 UI/Responsive check | 3 jam |
| 17.5 Performance tweak | 2 jam |
| 17.6 Webhook verification | 2 jam |
| **Total** | **~20 jam** |
