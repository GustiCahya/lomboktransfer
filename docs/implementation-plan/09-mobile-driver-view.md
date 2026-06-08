# Step 09 — Mobile Driver View

**Fase:** 1 — Fondasi  
**Target:** Minggu 3 (Hari 12–13)  
**Dependency:** Step 05 (Booking), Step 06 (HR)  
**Referensi PRD:** §4.2.6 Status Trip (Supir Mobile View), §1.3 Prinsip Desain

---

## Tujuan

Membangun tampilan mobile khusus supir — daftar trip hari ini, update status trip, navigasi, profil diri, dan request cuti. Interface ringan, jelas, optimasi untuk koneksi 3G Lombok.

---

## Todo List

### 9.1 Data Layer

- [ ] Buat `hooks/useDriverTrips.ts`:
  - `useMyTripsToday()` — trip hari ini milik supir yang login
  - `useMyUpcomingTrips()` — trip mendatang
  - `useUpdateTripStatus()` — mutation update status trip
- [ ] Buat `hooks/useDriverProfile.ts`:
  - `useMyProfile()` — profil supir yang login
  - `useMyDocuments()` — dokumen supir yang login
  - `useMyPayroll()` — riwayat payroll sendiri

### 9.2 Trip Hari Ini (Home Tab)

- [ ] Buat `app/(driver)/trips/page.tsx`:
  - **Header sederhana**: "Trip Hari Ini" + tanggal
  - **Daftar trip hari ini** (cards, scroll vertikal):
    Per trip card:
    - Jam penjemputan (besar, tebal)
    - Nama tamu + jumlah pax
    - Rute: Jemput → Antar
    - Status badge (warna)
    - **Tombol kontak tamu**:
      - 📞 Telpon (deep link `tel:`)
      - 💬 WhatsApp (deep link `wa.me/`)
    - **Tombol navigasi**:
      - 🗺️ Buka di Google Maps (deep link dengan koordinat pickup)
    - **Tombol update status** (contextual):
      - Jika `driver_assigned` → "Sedang Menuju Tamu"
      - Jika `in_progress` (menuju) → "Tamu Sudah Dijemput"
      - Jika `in_progress` (dijemput) → "Trip Selesai"
    - Catatan khusus (flight number, baby seat, dll)
  - **Empty state**: "Tidak ada trip hari ini 🎉" jika kosong
  - Pull-to-refresh gesture
- [ ] Buat `components/driver/TripCard.tsx`
- [ ] Buat `components/driver/StatusUpdateButton.tsx`:
  - Tombol besar (full width, mudah ditekan)
  - Konfirmasi dialog sebelum update
  - Loading state saat submit
  - Haptic feedback (jika browser support)

### 9.3 Update Status Trip Flow

- [ ] Implementasi status flow untuk supir:

  ```
  driver_assigned → "Sedang Menuju Tamu" (set in_progress + sub-status)
                  → "Tamu Sudah Dijemput" (update sub-status)
                  → "Trip Selesai" (set completed + timestamp)
  ```

- [ ] Setiap update status:
  - Simpan timestamp perubahan di database
  - Trigger realtime update ke dashboard admin (via Supabase Realtime)
  - (Fase 2) Trigger n8n notification ke tamu
- [ ] Buat sub-status field di bookings atau tabel terpisah `booking_status_log`:

  ```sql
  booking_status_log (id, booking_id, status, sub_status, updated_by, created_at)
  ```

- [ ] Input odometer (opsional): muncul saat trip selesai
  - KM awal (saat berangkat)
  - KM akhir (saat selesai)
  - Auto-calculate jarak trip

### 9.4 Jadwal Mendatang (Schedule Tab)

- [ ] Buat `app/(driver)/trips/schedule/page.tsx`:
  - Kalender mini (bulan view) — highlight hari-hari dengan trip
  - Daftar trip untuk tanggal yang dipilih
  - 7 hari ke depan: list semua trip mendatang
  - Status per trip: Terkonfirmasi / Menunggu Konfirmasi
- [ ] Buat `components/driver/MiniCalendar.tsx`
- [ ] Buat `components/driver/UpcomingTrips.tsx`

### 9.5 Request Cuti

- [ ] Fitur request cuti dari mobile:
  - Tombol "Request Cuti" di schedule tab
  - Form sederhana:
    - Tanggal mulai cuti
    - Tanggal selesai cuti
    - Alasan (opsional)
  - Status: Menunggu / Disetujui / Ditolak
  - Riwayat request cuti
  - Notif ke admin saat supir request cuti
- [ ] Buat `components/driver/LeaveRequestForm.tsx`

### 9.6 Profile (Profile Tab)

- [ ] Buat `app/(driver)/trips/profile/page.tsx`:
  - Foto profil
  - Nama, HP, email
  - Status kerja
  - **Ringkasan performa:**
    - Total trip bulan ini
    - Rating rata-rata
    - Komisi estimasi bulan ini
  - **Dokumen saya:**
    - List dokumen + status expire
    - Alert jika ada yang mau expire
    - (Baca saja, tidak bisa edit — admin yang update)
  - **Riwayat payroll:**
    - 3 bulan terakhir: total trip, komisi, status pembayaran
  - Tombol logout
- [ ] Buat `components/driver/ProfileSummary.tsx`
- [ ] Buat `components/driver/PerformanceSummary.tsx`

### 9.7 Performance Optimization (Mobile 3G)

- [ ] Optimasi untuk koneksi lambat:
  - Minimal JavaScript bundle (code splitting per route)
  - Image optimization (Next.js Image, lazy loading)
  - Skeleton loading untuk semua data
  - Offline-friendly: cache data trip hari ini
  - Touch target minimum 44×44px
  - Font size minimum 16px (prevent zoom on iOS)
- [ ] Prefetch data trip hari ini saat login
- [ ] Service worker untuk basic offline support (opsional)

### 9.8 Push Notification (Web)

- [ ] Implementasi web push notification dasar:
  - Request permission saat login supir
  - Notif saat di-assign trip baru
  - Notif reminder 3 jam sebelum trip
  - (Implementasi detail di Step 10 — n8n)
- [ ] Buat `lib/notifications/push.ts`

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Trip hari ini | List cards + kontak tamu + navigasi Maps |
| Update status | 3-step flow + realtime ke dashboard |
| Jadwal mendatang | Kalender + list 7 hari ke depan |
| Request cuti | Form request + riwayat |
| Profile | Info pribadi + performa + dokumen + payroll |
| Mobile optimized | Load < 3s di 3G, touch targets OK |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 9.1 Data layer | 1 jam |
| 9.2 Trip hari ini | 4 jam |
| 9.3 Status update flow | 2 jam |
| 9.4 Schedule tab | 2 jam |
| 9.5 Request cuti | 1.5 jam |
| 9.6 Profile | 2 jam |
| 9.7 Performance optimization | 2 jam |
| 9.8 Push notification | 1.5 jam |
| **Total** | **~16 jam** |
