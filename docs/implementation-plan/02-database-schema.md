# Step 02 - Database Schema & Supabase Setup

**Fase:** 1 - Fondasi  
**Target:** Minggu 1 (Hari 2–3)  
**Dependency:** Step 01 (Project Setup)  
**Referensi PRD:** §12 Schema Database, §12.2 Indexes

---

## Tujuan

Setup Supabase project, implementasi seluruh schema database (15 tabel), indexes, RLS policies, storage buckets, dan generate TypeScript types.

---

## Todo List

### 2.1 Setup Supabase Project

- [ ] Buat project baru di Supabase Dashboard
- [ ] Catat Project URL dan API keys (anon + service role)
- [ ] Update `.env.local` dengan credentials Supabase
- [ ] Test koneksi dari Next.js ke Supabase

### 2.2 Buat Schema Database - Core Tables

- [ ] Tabel `users` - data pengguna + role system

  ```sql
  users (id, email, full_name, role, created_at)
  -- role: owner | admin | dispatcher | driver | accountant | viewer
  ```

- [ ] Tabel `drivers` - profil supir lengkap

  ```sql
  drivers (id, user_id, full_name, nik, phone_wa, date_of_birth, address,
           bank_account, bank_name, emergency_contact_name, emergency_contact_phone,
           status, join_date, driver_type, commission_pct, created_at)
  ```

- [ ] Tabel `driver_documents` - dokumen supir (KTP, SIM, SKCK, dll)

  ```sql
  driver_documents (id, driver_id, doc_type, file_url, issue_date, expiry_date, status, created_at)
  ```

- [ ] Tabel `vehicles` - armada kendaraan

  ```sql
  vehicles (id, unit_code, brand, model, year, color, plate_number, vin,
            engine_number, passenger_cap, status, current_km, last_service_km,
            photo_urls, created_at)
  ```

- [ ] Tabel `vehicle_documents` - dokumen kendaraan

  ```sql
  vehicle_documents (id, vehicle_id, doc_type, file_url, issue_date, expiry_date,
                     insurer_name, policy_number, status, created_at)
  ```

### 2.3 Buat Schema Database - Operational Tables

- [ ] Tabel `routes` - master rute dan tarif

  ```sql
  routes (id, name, origin, destination, base_price, is_active,
          estimated_duration_min, notes)
  ```

- [ ] Tabel `guests` - data tamu

  ```sql
  guests (id, full_name, email, phone_wa, nationality, language,
          source_first, total_bookings, total_spend, tag, notes, created_at)
  ```

- [ ] Tabel `bookings` - pemesanan

  ```sql
  bookings (id, booking_code, guest_id, route_id, driver_id, vehicle_id,
            pickup_datetime, pickup_address, dropoff_address, pax_count, luggage_count,
            gross_price, ota_commission, net_price, source, status, payment_method,
            payment_status, notes, flight_number, language_pref, created_at, updated_at)
  ```

- [ ] Tabel `reviews` - ulasan tamu

  ```sql
  reviews (id, booking_id, guest_id, driver_id, platform, rating,
           review_text, review_date, admin_reply, replied_at, created_at)
  ```

### 2.4 Buat Schema Database - Financial Tables

- [ ] Tabel `payroll` - penggajian supir

  ```sql
  payroll (id, driver_id, period_month, period_year, total_trips, gross_revenue,
           commission_pct, commission_amt, bonus, deduction, net_payable,
           status, payment_date, transfer_proof, created_at)
  ```

- [ ] Tabel `expenses` - pengeluaran

  ```sql
  expenses (id, expense_date, category, description, amount, payment_method,
            vendor_id, receipt_url, created_by, notes, created_at)
  ```

- [ ] Tabel `service_records` - riwayat servis kendaraan

  ```sql
  service_records (id, vehicle_id, service_date, service_type, km_at_service,
                   next_service_km, workshop_id, cost, notes, receipt_url, created_at)
  ```

### 2.5 Buat Schema Database - Supporting Tables

- [ ] Tabel `vendors` - direktori vendor

  ```sql
  vendors (id, name, category, pic_name, phone_wa, email, address, website,
           bank_account, bank_name, rating, notes, is_active, created_at)
  ```

- [ ] Tabel `company_documents` - dokumen perusahaan

  ```sql
  company_documents (id, doc_name, doc_number, issuer, issue_date, expiry_date,
                     status, file_url, pic_user_id, notes, created_at)
  ```

- [ ] Tabel `partner_contracts` - kontrak mitra

  ```sql
  partner_contracts (id, party_name, party_type, contract_type, start_date,
                     end_date, key_terms, file_url, status, created_at)
  ```

- [ ] Tabel `hotel_partners` - hotel & travel partner

  ```sql
  hotel_partners (id, vendor_id, commission_pct, referral_fee, total_bookings,
                  total_value, status, notes, created_at)
  ```

### 2.6 Buat Indexes untuk Performa

- [ ] `idx_bookings_pickup_datetime` - query booking per tanggal
- [ ] `idx_bookings_driver_id` - query booking per supir
- [ ] `idx_bookings_status` - filter status booking
- [ ] `idx_bookings_source` - filter sumber booking
- [ ] `idx_bookings_guest_id` - CRM query
- [ ] `idx_driver_docs_expiry` - monitoring dokumen supir
- [ ] `idx_vehicle_docs_expiry` - monitoring dokumen kendaraan
- [ ] `idx_company_docs_expiry` - monitoring dokumen perusahaan
- [ ] `idx_guests_nationality` - segmentasi tamu

### 2.7 Seed Data Awal

- [ ] Insert master rute default (8 rute dari PRD Appendix A):
  - BIL → Mataram (Rp 315.000)
  - BIL → Senggigi (Rp 375.000)
  - BIL → Kuta Lombok (Rp 315.000)
  - BIL → Bangsal/Gili (Rp 465.000)
  - BIL → Mandalika (Rp 315.000)
  - BIL → Tetebatu (Rp 450.000)
  - Senggigi → Gili via Bangsal (Rp 200.000)
  - Day Tour Paket Full Day (Rp 1.000.000)
- [ ] Insert user owner awal (superadmin)
- [ ] Insert enum/lookup values jika diperlukan

### 2.8 Setup Supabase Storage Buckets

- [ ] Bucket `driver-documents` - KTP, SIM, SKCK, surat sehat
- [ ] Bucket `vehicle-documents` - STNK, KIR, polis asuransi
- [ ] Bucket `vehicle-photos` - foto kendaraan
- [ ] Bucket `company-documents` - SIUP, NPWP, akta, dll
- [ ] Bucket `receipts` - bukti transfer, struk, invoice
- [ ] Bucket `contracts` - file kontrak mitra PDF
- [ ] Bucket `driver-photos` - foto profil supir
- [ ] Setup access policies per bucket (private by default, signed URLs)

### 2.9 Setup Supabase Client di Next.js

- [ ] Buat `lib/supabase/client.ts` - browser client (anon key)
- [ ] Buat `lib/supabase/server.ts` - server component client (cookies)
- [ ] Buat `lib/supabase/middleware.ts` - session refresh middleware
- [ ] Generate TypeScript types dari schema: `npx supabase gen types`
- [ ] Buat `lib/supabase/types.ts` - re-export generated types + custom types

### 2.10 Buat SQL Migration Files

- [ ] Buat folder `supabase/migrations/`
- [ ] Migration 001: `create_core_tables.sql` - users, drivers, driver_documents
- [ ] Migration 002: `create_fleet_tables.sql` - vehicles, vehicle_documents, service_records
- [ ] Migration 003: `create_booking_tables.sql` - routes, guests, bookings, reviews
- [ ] Migration 004: `create_financial_tables.sql` - payroll, expenses
- [ ] Migration 005: `create_supporting_tables.sql` - vendors, company_documents, partner_contracts, hotel_partners
- [ ] Migration 006: `create_indexes.sql`
- [ ] Migration 007: `seed_data.sql`

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Supabase project aktif | Dashboard Supabase accessible, API keys tersedia |
| 15 tabel terbuat | Semua tabel visible di Supabase Table Editor |
| Indexes aktif | Query EXPLAIN menunjukkan index scan |
| Seed data | 8 rute, 1 user owner ada di database |
| Storage buckets | 7 buckets terbuat dengan policies |
| Supabase client | Import & query berhasil dari Next.js |
| TypeScript types | Auto-generated types tersedia |
| Migration files | Semua SQL tersimpan di `supabase/migrations/` |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 2.1 Setup project | 30 menit |
| 2.2 Core tables | 2 jam |
| 2.3 Operational tables | 1.5 jam |
| 2.4 Financial tables | 1 jam |
| 2.5 Supporting tables | 1 jam |
| 2.6 Indexes | 30 menit |
| 2.7 Seed data | 30 menit |
| 2.8 Storage buckets | 30 menit |
| 2.9 Supabase client | 1 jam |
| 2.10 Migration files | 30 menit |
| **Total** | **~9 jam** |
