# Step 05 — Modul Booking & Dispatch

**Fase:** 1 — Fondasi  
**Target:** Minggu 2–3 (Hari 6–10)  
**Dependency:** Step 04 (Layout & Navigation)  
**Referensi PRD:** §4 Modul 1 — Booking & Dispatch

---

## Tujuan

Membangun modul paling kritikal — pusat kontrol semua booking masuk, form booking manual, detail booking, kalender dispatch, dan status tracking. Ini adalah modul yang paling aktif digunakan setiap hari.

---

## Todo List

### 5.1 Data Layer — Hooks & Services
- [ ] Buat `hooks/useBookings.ts`:
  - `useBookings(filters)` — list booking dengan filter + pagination
  - `useBooking(id)` — single booking detail
  - `useCreateBooking()` — mutation create
  - `useUpdateBooking()` — mutation update
  - `useUpdateBookingStatus()` — mutation ubah status
- [ ] Buat `hooks/useRoutes.ts`:
  - `useRoutes()` — list master rute (untuk dropdown)
  - `useRoute(id)` — single route detail
- [ ] Buat `lib/validations/booking.ts` — Zod schema untuk form booking:
  ```typescript
  const bookingSchema = z.object({
    guest_name: z.string().min(1, "Nama tamu wajib diisi"),
    phone_wa: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    nationality: z.string().optional(),
    route_id: z.string().uuid("Pilih rute"),
    pickup_datetime: z.date({ required_error: "Tanggal & jam wajib diisi" }),
    pickup_address: z.string().optional(),
    dropoff_address: z.string().optional(),
    pax_count: z.number().min(1).max(20),
    luggage_count: z.number().min(0),
    gross_price: z.number().min(0),
    payment_method: z.enum(["cash", "transfer", "ota_settlement"]),
    source: z.enum(["direct", "klook", "viator", "traveloka", "getyourguide", "trip_com", "whatsapp", "manual"]),
    notes: z.string().optional(),
    flight_number: z.string().optional(),
    language_pref: z.enum(["en", "id", "zh"]).optional(),
  });
  ```

### 5.2 Daftar Booking (Booking List Page)
- [ ] Buat `app/(dashboard)/bookings/page.tsx`:
  - PageHeader: "Daftar Booking" + tombol "Booking Baru"
  - Filter bar:
    - Date range picker (tanggal pickup)
    - Status dropdown (Menunggu, Terkonfirmasi, Berlangsung, Selesai, Dibatalkan)
    - Supir dropdown
    - Rute dropdown
    - Sumber booking dropdown
  - Search: nama tamu atau booking code
  - Tabel booking:
    | Kolom | Data |
    |---|---|
    | Kode Booking | `LT-2026-0001` (link ke detail) |
    | Tamu | Nama + kebangsaan flag |
    | Rute | Jemput → Antar |
    | Tanggal/Jam | Formatted date + time |
    | Status | Color badge |
    | Supir | Nama supir (atau "Belum assign") |
    | Sumber | Badge (Klook/Viator/Direct/dll) |
    | Harga | Formatted Rupiah |
  - Pagination (20 items per page)
  - Export CSV button
- [ ] Buat `components/bookings/BookingTable.tsx` — tabel komponen
- [ ] Buat `components/bookings/BookingFilters.tsx` — filter komponen
- [ ] Implementasi auto-generate booking code: `LT-{YYYY}-{0001}`

### 5.3 Form Booking Manual
- [ ] Buat `app/(dashboard)/bookings/new/page.tsx`:
  - Form fields sesuai PRD §4.2.2:
    - **Data Tamu**: Nama (required), HP/WA, Email, Kebangsaan, Bahasa
    - **Detail Trip**: Rute (dropdown + auto-fill harga), Tanggal & Jam, Pickup address, Dropoff address
    - **Penumpang**: Jumlah pax, Jumlah bagasi
    - **Catatan**: Flight number, Kebutuhan khusus (baby seat, dll)
    - **Harga**: Auto-fill dari master tarif (bisa override manual), Surcharge checkbox (malam/high season)
    - **Pembayaran**: Metode (Cash/Transfer/OTA), Sumber booking
  - Guest lookup: cari tamu existing by nama/HP/email, auto-fill data jika ada
  - Create new guest otomatis jika tamu baru
  - Validasi form dengan react-hook-form + zod
  - Submit: simpan booking + guest, set status "pending"
  - Success: redirect ke detail booking
- [ ] Buat `components/bookings/BookingForm.tsx` — reusable form component
- [ ] Buat `components/bookings/GuestSearch.tsx` — autocomplete search tamu existing

### 5.4 Detail Booking
- [ ] Buat `app/(dashboard)/bookings/[id]/page.tsx`:
  - **Info Tamu**: Nama, HP, email, kebangsaan, bahasa, link ke profil CRM
  - **Detail Trip**: Rute, tanggal/jam, jumlah pax/bagasi, catatan, flight number
  - **Timeline Status** (visual stepper):
    1. Booking Masuk → 2. Dikonfirmasi → 3. Supir Ditugaskan → 4. Menuju Tamu → 5. Tamu Dijemput → 6. Selesai
    - Warna + timestamp per step
  - **Supir**: Nama supir yang ditugaskan + foto + HP, tombol "Ganti Supir"
  - **Kendaraan**: Unit kode + merek/model + plat nomor
  - **Riwayat WA** (log): daftar pesan WA yang dikirim terkait booking ini (placeholder, data dari n8n)
  - **Invoice & Pembayaran**: Harga gross, komisi OTA, harga nett, metode pembayaran, status bayar
  - **Tombol Aksi**:
    - Konfirmasi Booking
    - Tugaskan Supir (open dialog pilih supir)
    - Kirim WA Konfirmasi ke Tamu (trigger n8n)
    - Selesaikan Trip
    - Batalkan Booking (dengan alasan)
- [ ] Buat `components/bookings/BookingTimeline.tsx` — visual status stepper
- [ ] Buat `components/bookings/AssignDriverDialog.tsx`:
  - List supir available di tanggal/jam tersebut
  - Tampilkan: nama, foto, status, jumlah trip hari itu, rating
  - Highlight supir yang direkomendasikan (paling sedikit trip)
  - Pilih supir + kendaraan → assign
- [ ] Buat `components/bookings/CancelBookingDialog.tsx` — dialog pembatalan + alasan

### 5.5 Edit Booking
- [ ] Buat `app/(dashboard)/bookings/[id]/edit/page.tsx`:
  - Pre-fill form BookingForm dengan data existing
  - Bisa edit semua field kecuali booking code
  - Validasi perubahan
  - Simpan update + timestamp `updated_at`

### 5.6 Kalender Dispatch
- [ ] Buat `app/(dashboard)/dispatch/page.tsx`:
  - Tampilan kalender (toggle: Hari / Minggu / Bulan)
  - **Day View**: timeline 24 jam, semua trip hari itu
  - **Week View**: 7 kolom, timeline per hari
  - **Month View**: grid bulan, dot indicator per hari
  - Setiap booking tampil sebagai card di timeline:
    - Warna berbeda per supir (auto-assign color palette)
    - Nama tamu + rute + jam
    - Klik untuk buka detail booking
  - **Konflik jadwal**: highlight merah jika supir punya 2 trip overlap
  - **Slot kosong**: visual indicator jam-jam tanpa trip
  - Navigasi: prev/next day/week/month, jump to date
- [ ] Buat `components/bookings/DispatchCalendar.tsx` — kalender utama
- [ ] Buat `components/bookings/DispatchEventCard.tsx` — card per booking di kalender
- [ ] Implementasi drag-and-drop (opsional fase ini, bisa di Fase 4):
  - Pindahkan booking ke jam berbeda
  - Re-assign ke supir berbeda
  - Update waktu pickup otomatis

### 5.7 Booking Statistics Widget
- [ ] Buat `components/bookings/BookingStats.tsx`:
  - Summary cards di atas tabel:
    - Total booking bulan ini
    - Booking hari ini
    - Menunggu konfirmasi
    - Sedang berlangsung
  - Mini chart: booking per hari (7 hari terakhir)

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Booking list | Tabel dengan filter, search, pagination, export CSV |
| Form booking | Create booking baru + auto-create guest |
| Detail booking | Semua info + timeline + aksi buttons |
| Edit booking | Update data booking existing |
| Assign driver | Dialog pilih supir available |
| Dispatch calendar | 3 view modes (day/week/month) |
| Stats widget | 4 summary cards + mini chart |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 5.1 Data layer | 2 jam |
| 5.2 Booking list | 4 jam |
| 5.3 Form booking | 4 jam |
| 5.4 Detail booking | 5 jam |
| 5.5 Edit booking | 1 jam |
| 5.6 Dispatch calendar | 6 jam |
| 5.7 Stats widget | 1.5 jam |
| **Total** | **~23.5 jam** |
