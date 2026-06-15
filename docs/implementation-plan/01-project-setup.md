# Step 01 - Project Setup & Foundation

**Fase:** 1 - Fondasi  
**Target:** Minggu 1 (Hari 1–2)  
**Dependency:** Tidak ada  
**Referensi PRD:** §3 Arsitektur & Tech Stack, Appendix C Struktur Folder

---

## Tujuan

Menyiapkan project Next.js 14 dengan seluruh tooling, dependency, dan konfigurasi dasar agar tim bisa mulai develop fitur.

---

## Todo List

### 1.1 Inisialisasi Project Next.js 14

- [ ] Buat project Next.js 14 dengan App Router (`npx create-next-app@14`)
- [ ] Konfigurasi TypeScript strict mode
- [ ] Setup `.env.local` dengan template variabel environment
- [ ] Konfigurasi `next.config.js` (image domains, experimental features)

### 1.2 Setup Tailwind CSS

- [ ] Install dan konfigurasi Tailwind CSS v3
- [ ] Buat `tailwind.config.ts` dengan custom theme:
  - Color palette (brand colors Lombok Transfer)
  - Typography scale
  - Spacing scale
  - Breakpoints (mobile driver: 375px, desktop admin: 1440px)
- [ ] Setup `globals.css` dengan base styles dan CSS variables

### 1.3 Setup shadcn/ui

- [ ] Inisialisasi shadcn/ui (`npx shadcn-ui@latest init`)
- [ ] Install komponen dasar yang pasti digunakan:
  - `button`, `input`, `label`, `select`, `textarea`
  - `table`, `card`, `badge`, `dialog`, `sheet`
  - `tabs`, `dropdown-menu`, `command`, `popover`
  - `calendar`, `date-picker`, `toast`, `alert`
  - `form` (react-hook-form + zod integration)
  - `avatar`, `separator`, `skeleton`, `tooltip`

### 1.4 Install Dependencies Tambahan

- [ ] `@tanstack/react-query` - data fetching & caching
- [ ] `@supabase/supabase-js` + `@supabase/ssr` - Supabase client
- [ ] `react-hook-form` + `@hookform/resolvers` + `zod` - form management
- [ ] `date-fns` - date utilities (format Indonesia)
- [ ] `recharts` - grafik & chart
- [ ] `lucide-react` - icon library (sudah include di shadcn)
- [ ] `jspdf` + `@react-pdf/renderer` - generate invoice/slip PDF
- [ ] `papaparse` - parsing CSV (untuk rekonsiliasi OTA)
- [ ] `nuqs` - URL state management (untuk filter & search)

### 1.5 Setup Folder Structure

- [ ] Buat struktur folder sesuai PRD Appendix C:

  ```
  app/
    (auth)/login/
    (dashboard)/
      layout.tsx
      page.tsx
      bookings/
      dispatch/
      drivers/
      fleet/
      accounting/
      crm/
      legal/
      vendors/
      reports/
    (driver)/trips/
  components/
    ui/          (shadcn)
    bookings/
    drivers/
    fleet/
    shared/
  lib/
    supabase/
      client.ts
      server.ts
      types.ts
    utils/
    constants/
    validations/
  hooks/
  types/
  ```

### 1.6 Setup Code Quality Tools

- [ ] ESLint konfigurasi (Next.js default + custom rules)
- [ ] Prettier konfigurasi (`.prettierrc`)
- [ ] Husky + lint-staged (pre-commit hooks)
- [ ] `.editorconfig` untuk konsistensi coding style

### 1.7 Setup Environment Variables Template

- [ ] Buat `.env.example` dengan semua variabel yang dibutuhkan:

  ```env
  # Supabase
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  
  # Fonnte (WhatsApp)
  FONNTE_API_KEY=
  FONNTE_SENDER_NUMBER=
  
  # Claude API
  CLAUDE_API_KEY=
  
  # App
  NEXT_PUBLIC_APP_URL=
  NEXT_PUBLIC_APP_NAME=Lombok Transfer
  ```

### 1.8 Setup Git & Version Control

- [ ] Inisialisasi Git repository
- [ ] Buat `.gitignore` (node_modules, .env.local, .next, dll)
- [ ] Buat branch strategy: `main` → `develop` → `feature/*`
- [ ] Initial commit

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Project Next.js 14 berjalan | `npm run dev` berhasil tanpa error |
| shadcn/ui terpasang | Komponen bisa di-import dan render |
| Tailwind CSS terkonfigurasi | Custom theme diterapkan |
| Semua dependencies terinstall | `npm ls` tanpa error |
| Folder structure lengkap | Semua folder & placeholder file ada |
| Environment template | `.env.example` lengkap |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 1.1 Init project | 30 menit |
| 1.2 Tailwind CSS | 1 jam |
| 1.3 shadcn/ui | 1 jam |
| 1.4 Dependencies | 30 menit |
| 1.5 Folder structure | 30 menit |
| 1.6 Code quality | 30 menit |
| 1.7 Env template | 15 menit |
| 1.8 Git setup | 15 menit |
| **Total** | **~4.5 jam** |
