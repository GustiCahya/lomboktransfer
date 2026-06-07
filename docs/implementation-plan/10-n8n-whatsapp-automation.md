# Step 10 — n8n & WhatsApp Automation

**Fase:** 2 — Otomasi  
**Target:** Minggu 4–5 (Hari 14–20)  
**Dependency:** Step 05 (Booking), Step 06 (HR), Step 08 (Dashboard)  
**Referensi PRD:** §4.3 Notifikasi Otomatis, §4.2.5 Auto-Dispatch, §13.1 WhatsApp (Fonnte)

---

## Tujuan

Setup n8n (self-hosted workflow automation) dan Fonnte (WhatsApp API gateway) untuk mengotomasi seluruh notifikasi operasional — dari assign supir, konfirmasi tamu, reminder, alert dokumen, hingga laporan harian.

---

## Todo List

### 10.1 Setup n8n
- [ ] Deploy n8n self-hosted di VPS (Railway.app atau DigitalOcean):
  - Docker deployment (recommended)
  - Environment variables: `N8N_HOST`, `N8N_PORT`, `WEBHOOK_URL`
  - Persistent storage untuk workflow data
  - Basic auth atau password untuk n8n dashboard
- [ ] Konfigurasi n8n credentials:
  - Supabase API (service role key untuk read/write)
  - Fonnte API key
  - Claude API key (untuk Step 16)
- [ ] Test n8n webhook endpoint dari Supabase
- [ ] Setup n8n backup (export workflow JSON secara berkala)

### 10.2 Setup Fonnte WhatsApp Gateway
- [ ] Daftar akun Fonnte (fonnte.com)
- [ ] Hubungkan nomor WhatsApp bisnis Lombok Transfer
- [ ] Test send message via API:
  ```
  POST https://api.fonnte.com/send
  Headers: Authorization: <API_KEY>
  Body: { "target": "62812xxx", "message": "Test" }
  ```
- [ ] Buat `lib/whatsapp/fonnte.ts` — helper kirim WA dari Next.js (via API route)
- [ ] Buat message templates (bahasa Indonesia + Inggris):
  - Template booking confirmation
  - Template driver assignment
  - Template reminder
  - Template review request
  - Template cancellation

### 10.3 Workflow 1 — Booking Baru Masuk
- [ ] **Trigger:** Supabase webhook saat INSERT ke tabel `bookings`
- [ ] **Actions:**
  1. Format pesan: "Booking baru: [Nama], [Rute], [Tanggal/Jam], [Sumber]"
  2. Kirim WA ke admin/dispatcher
  3. Update dashboard alert (realtime)
- [ ] Buat n8n workflow + test

### 10.4 Workflow 2 — Auto-Assign Supir
- [ ] **Trigger:** Booking baru masuk dengan status `pending`
- [ ] **Logic (PRD §4.2.5):**
  1. Query supir yang available di jam booking (tidak ada booking konflik + status active + tidak cuti)
  2. Prioritas:
     - Supir dengan load paling ringan hari itu
     - Supir dengan rating tertinggi
  3. **Jika supir ditemukan:**
     - Update booking: `driver_id`, `vehicle_id`, `status = 'driver_assigned'`
     - Trigger Workflow 3 (notif supir)
     - Trigger Workflow 4 (konfirmasi tamu)
  4. **Jika tidak ada supir available:**
     - Set booking status: `pending` (manual assign needed)
     - Alert ke admin via WA: "Booking [kode] perlu assign manual — tidak ada supir tersedia"
     - Dashboard alert
- [ ] Buat n8n workflow + test semua branches

### 10.5 Workflow 3 — Notif Supir (Trip Baru)
- [ ] **Trigger:** Booking di-assign ke supir (status → `driver_assigned`)
- [ ] **Actions:**
  1. Get data booking + tamu + rute
  2. Format WA message ke supir:
     ```
     🚗 Trip Baru Untuk Anda!
     
     Tamu: [Nama] ([Kebangsaan])
     Rute: [Jemput] → [Antar]
     Tanggal: [Tanggal] pukul [Jam]
     Penumpang: [Jumlah]
     Flight: [Nomor] (jika ada)
     Catatan: [Notes]
     
     Kontak tamu: wa.me/[nomor]
     Maps: [Google Maps link]
     ```
  3. Kirim via Fonnte
  4. Log pesan di database (tabel `wa_logs` atau field di booking)

### 10.6 Workflow 4 — Konfirmasi ke Tamu
- [ ] **Trigger:** Booking dikonfirmasi + supir di-assign
- [ ] **Actions:**
  1. Detect bahasa tamu (en/id/zh)
  2. Format WA message (multi-bahasa):
     ```
     [EN] Your booking is confirmed! 🎉
     Driver: [Nama Supir]
     WhatsApp: [Nomor Supir]
     Pickup: [Tanggal] at [Jam]
     Route: [Jemput] → [Antar]
     
     [ID] Booking Anda dikonfirmasi! 🎉
     Supir: [Nama], WA: [Nomor]
     ...
     ```
  3. Kirim via Fonnte
  4. Log pesan

### 10.7 Workflow 5 — Reminder H-1 Trip
- [ ] **Trigger:** Cron job harian (jam 18:00) — cek booking besok
- [ ] **Actions:**
  1. Query semua booking dengan `pickup_datetime` = besok
  2. Untuk setiap booking:
     - Kirim WA reminder ke tamu:
       ```
       Reminder: Penjemputan besok [Tanggal] pukul [Jam]
       Supir: [Nama], WA: [Nomor]
       ```
  3. Log pengiriman

### 10.8 Workflow 6 — Reminder 3 Jam Sebelum Trip
- [ ] **Trigger:** Cron setiap 30 menit — cek trip 3 jam ke depan
- [ ] **Actions:**
  1. Query booking dengan `pickup_datetime` antara 2.5–3.5 jam dari sekarang
  2. Filter: belum pernah dapat reminder 3 jam
  3. Kirim WA ke supir:
     ```
     ⏰ Reminder: Trip dalam 3 jam!
     Tamu: [Nama], Rute: [Rute], Jam: [Jam]
     ```
  4. Mark booking sebagai "reminded"

### 10.9 Workflow 7 — Review Request Post-Trip
- [ ] **Trigger:** Status booking → `completed`
- [ ] **Actions:**
  1. Delay 2 jam setelah trip selesai
  2. Kirim WA ke tamu (multi-bahasa):
     ```
     Thank you for choosing Lombok Transfer! 🙏
     We'd love your feedback:
     ⭐ Google Review: [link]
     ⭐ Klook Review: [link] (jika booking via Klook)
     ```
  3. Log pengiriman + tracking (sent/clicked/submitted)

### 10.10 Workflow 8 — Alert Dokumen Expire
- [ ] **Trigger:** Cron harian (jam 08:00)
- [ ] **Actions:**
  1. Query `driver_documents` WHERE `expiry_date` - NOW() IN (60, 30, 7 hari)
  2. Query `vehicle_documents` WHERE `expiry_date` - NOW() IN (60, 30, 7 hari)
  3. Query `company_documents` WHERE `expiry_date` - NOW() IN (90, 30 hari)
  4. Untuk setiap dokumen:
     - Kirim WA ke admin/owner
     - Create alert di dashboard
  5. Format:
     ```
     ⚠️ Dokumen Akan Expire!
     [SIM A] — Supir: [Nama] — Expire: [Tanggal] (sisa [X] hari)
     ```

### 10.11 Workflow 9 — Laporan Harian ke Owner
- [ ] **Trigger:** Cron harian (jam 21:00)
- [ ] **Actions:**
  1. Aggregate data hari ini:
     - Total booking masuk
     - Total trip selesai
     - Total pendapatan
     - Trip dibatalkan (jika ada)
     - Supir yang bertugas
  2. Format WA ke owner:
     ```
     📊 Laporan Harian — [Tanggal]
     
     Booking masuk: [X]
     Trip selesai: [X]
     Pendapatan: Rp [X]
     Dibatalkan: [X]
     Supir aktif: [X]
     ```
  3. Kirim via Fonnte

### 10.12 Workflow 10 — Booking Dibatalkan
- [ ] **Trigger:** Status booking → `cancelled`
- [ ] **Actions:**
  1. Kirim WA ke tamu: konfirmasi pembatalan + info refund (jika ada)
  2. Kirim WA ke admin: notif pembatalan
  3. Jika supir sudah di-assign: kirim WA ke supir, free up jadwal
  4. Log pembatalan

### 10.13 Dashboard Notifikasi (In-App)
- [ ] Buat tabel `notifications` di Supabase:
  ```sql
  notifications (id, user_id, title, message, type, link, is_read, created_at)
  ```
- [ ] Update `components/shared/NotificationBell.tsx`:
  - Badge count unread notifications
  - Dropdown list notifikasi terbaru (max 20)
  - Mark as read (single + mark all)
  - Link ke halaman terkait per notifikasi
  - Realtime: subscribe ke INSERT pada tabel notifications
- [ ] Buat `app/(dashboard)/notifications/page.tsx`:
  - Full list semua notifikasi
  - Filter: All / Unread / By type
  - Pagination

### 10.14 WA Log Database
- [ ] Buat tabel `wa_logs` (atau gunakan field di tabel terkait):
  ```sql
  wa_logs (id, booking_id, recipient_phone, recipient_type, message_type,
           message_content, status, sent_at, created_at)
  -- recipient_type: guest | driver | admin
  -- message_type: booking_confirm | driver_assign | reminder | review_request | alert | report
  -- status: sent | delivered | read | failed
  ```
- [ ] Tampilkan log WA di halaman detail booking (Tab Riwayat Komunikasi)
- [ ] Tampilkan log WA di halaman supir (komunikasi terkait)

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| n8n deployed | Dashboard n8n accessible, webhook working |
| Fonnte connected | Send WA message berhasil via API |
| 10 workflows | Semua workflow berjalan sesuai trigger |
| Auto-assign | Supir di-assign otomatis saat booking masuk |
| In-app notifications | Bell icon + dropdown + full page + realtime |
| WA logs | Semua pesan WA tercatat di database |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 10.1 n8n setup | 3 jam |
| 10.2 Fonnte setup | 1 jam |
| 10.3 Workflow booking baru | 1 jam |
| 10.4 Auto-assign supir | 3 jam |
| 10.5 Notif supir | 1 jam |
| 10.6 Konfirmasi tamu | 1.5 jam |
| 10.7 Reminder H-1 | 1 jam |
| 10.8 Reminder 3 jam | 1 jam |
| 10.9 Review request | 1 jam |
| 10.10 Alert dokumen | 2 jam |
| 10.11 Laporan harian | 1.5 jam |
| 10.12 Booking dibatalkan | 1 jam |
| 10.13 In-app notifications | 3 jam |
| 10.14 WA logs | 1.5 jam |
| **Total** | **~22.5 jam** |
