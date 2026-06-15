# Step 16 - AI Chatbot & Integrasi Lanjutan

**Fase:** 5 - AI & Peningkatan  
**Target:** Minggu 10–12 (Hari 37–42)  
**Dependency:** Step 10 (n8n & WA Automation)  
**Referensi PRD:** §13.4 Claude API, §13.2 Booking Platform OTA

---

## Tujuan

Mengimplementasikan fitur-fitur advanced (nice-to-have/fase akhir) yang meningkatkan efisiensi operasional secara signifikan: AI chatbot untuk interaksi tamu via WhatsApp, auto-dispatch berbasis lokasi (opsional), dan integrasi API dengan OTA (menggantikan manual CSV).

---

## Todo List

### 16.1 Chatbot Tamu Berbasis AI (Claude API)

- [ ] Buat skenario di n8n untuk webhook pesan masuk (Incoming WA Fonnte)
- [ ] Buat tabel `chat_sessions`:

  ```sql
  chat_sessions (id, guest_phone, session_context, status, created_at, updated_at)
  ```

- [ ] Konfigurasi Claude API (model `claude-sonnet-4-20250514`) di n8n
- [ ] Susun *System Prompt* yang komprehensif:
  - Role: Customer Service Lombok Transfer (ramah, profesional, multibahasa EN/CN/ID)
  - Pengetahuan: Daftar harga rute (Appendix A), jenis mobil, FAQ umum (penjemputan bandara, durasi trip, dll)
  - Tujuan: Menjawab pertanyaan umum dan mengumpulkan data untuk form booking
  - Limitasi: Jika ada komplain atau negosiasi harga di luar batas, eskalasi ke "Human Agent"
- [ ] Setup alur n8n:
  1. WA masuk -> cek apakah nomor = tamu (bukan supir)
  2. Ambil `chat_sessions` sebelumnya (memory)
  3. Kirim prompt + history ke Claude API
  4. Ambil response Claude -> kirim balik ke tamu via Fonnte
  5. Update `chat_sessions`
- [ ] Logic Eskalasi (Handoff to Human):
  - Jika Claude mendeteksi sentimen negatif atau tidak tahu jawabannya, set status session = `human_required`
  - Kirim notif WA ke Admin: "Tamu di nomor [xxx] butuh bantuan manual."
  - Pause AI untuk nomor tersebut sampai Admin membalas dari dashboard.

### 16.2 In-App Chat Interface (Dashboard Admin)

- [ ] Buat `app/(dashboard)/crm/live-chat/page.tsx`:
  - Tampilan chat interface seperti WhatsApp Web
  - Daftar kontak aktif di sebelah kiri (dengan indikator bot vs human mode)
  - Jendela chat di sebelah kanan
  - Tombol "Ambil Alih (Takeover)" untuk mematikan bot pada chat tersebut
  - Integrasi via Fonnte API untuk membalas langsung dari dashboard
- [ ] Buat komponen: `ChatSidebar.tsx`, `ChatWindow.tsx`, `MessageBubble.tsx`

### 16.3 Integrasi API OTA (Klook / Viator) - Lanjutan

- [ ] Buat skrip di n8n (HTTP Request node) atau Next.js API Routes untuk polling/menerima webhook dari Klook/Viator API (jika API key tersedia).
- [ ] Mapping struktur data Klook API ke skema `bookings` Lombok Transfer.
- [ ] Auto-insert booking baru masuk dari OTA dengan status `pending` dan source `klook`/`viator`.
- [ ] Trigger otomatis Workflow 1 (Notif Admin) saat booking OTA masuk via API.
- *Note: Jika API OTA sulit didapat/berbayar, skip dan pertahankan mode CSV Upload (Step 11.7).*

### 16.4 Auto-Dispatch Berbasis Lokasi (Eksplorasi)

- [ ] *Opsional:* Jika supir mengizinkan GPS tracking via browser di Mobile Driver View (HTML5 Geolocation).
- [ ] Tambahkan field `last_lat`, `last_lng`, `last_location_update` di tabel `drivers`.
- [ ] Supir mengirim kordinat via background fetch tiap 15 menit saat `status = active`.
- [ ] Update logic Workflow Auto-Assign (Step 10.4) di n8n untuk mempertimbangkan jarak (Haversine formula) antara supir terdekat dan titik penjemputan tamu (terutama untuk booking on-the-spot).

### 16.5 Audit Log Lanjutan

- [ ] Buat tabel `audit_logs` global:

  ```sql
  audit_logs (id, table_name, record_id, action, old_data, new_data, user_id, ip_address, created_at)
  ```

- [ ] Buat trigger Supabase untuk mencatat setiap UPDATE/DELETE pada tabel krusial: `bookings`, `expenses`, `payroll`, `users`.
- [ ] Buat `app/(dashboard)/settings/audit-logs/page.tsx` (Khusus Owner):
  - Tabel log aktivitas, bisa difilter berdasarkan user, tanggal, dan tabel.

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| AI Chatbot | Tamu bisa chat dengan AI via WA, mendapat jawaban sesuai harga/FAQ |
| Human Handoff | Admin bisa ambil alih chat AI dari dashboard (atau langsung balas via WA) |
| API OTA (Optional) | Booking Klook masuk otomatis tanpa perlu ketik manual |
| Audit Log | Setiap perubahan data krusial tercatat dan bisa di-review owner |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 16.1 Prompt & Setup Claude n8n | 5 jam |
| 16.2 Live Chat Dashboard | 6 jam |
| 16.3 Eskalasi & Handoff logic | 3 jam |
| 16.4 Audit Logs System | 3 jam |
| 16.5 (Opt) API OTA | 6 jam (riset & build) |
| **Total** | **~17 - 23 jam** |
