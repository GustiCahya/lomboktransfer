# Step 03 — Authentication & Authorization

**Fase:** 1 — Fondasi  
**Target:** Minggu 1 (Hari 3–4)  
**Dependency:** Step 02 (Database Schema)  
**Referensi PRD:** §2 Pengguna & Peran, §14 Keamanan & Akses

---

## Tujuan

Implementasi sistem login, role-based access control (RBAC), Row Level Security (RLS) di Supabase, session management, dan middleware proteksi route.

---

## Todo List

### 3.1 Setup Supabase Auth
- [ ] Aktifkan email + password provider di Supabase Auth settings
- [ ] Konfigurasi email templates (welcome, reset password) — bahasa Indonesia
- [ ] Set session timeout:
  - Admin/Owner/Dispatcher/Accountant: 8 jam
  - Driver: 24 jam
- [ ] Disable email confirmation untuk development (enable di production)

### 3.2 Buat Halaman Login
- [ ] Buat `app/(auth)/login/page.tsx`
  - Form login: email + password
  - Validasi input (zod schema)
  - Error handling (email salah, password salah, akun non-aktif)
  - Loading state saat proses login
  - Logo Lombok Transfer + branding
  - Responsive: mobile-friendly untuk supir
- [ ] Buat `app/(auth)/layout.tsx` — layout minimal tanpa sidebar
- [ ] Redirect ke dashboard setelah login sukses berdasarkan role:
  - `driver` → `/trips` (mobile view)
  - Lainnya → `/` (dashboard overview)

### 3.3 Implementasi Role System
- [ ] Buat tabel `users` trigger: saat Supabase Auth user dibuat, auto-insert ke `public.users`
  ```sql
  CREATE OR REPLACE FUNCTION handle_new_user()
  RETURNS trigger AS $$
  BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (new.id, new.email, '', 'viewer');
    RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```
- [ ] Buat helper function `get_user_role()` di Supabase:
  ```sql
  CREATE OR REPLACE FUNCTION get_user_role()
  RETURNS text AS $$
    SELECT role FROM public.users WHERE id = auth.uid();
  $$ LANGUAGE sql SECURITY DEFINER;
  ```
- [ ] Definisikan constant role di `lib/constants/roles.ts`:
  ```typescript
  export const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    DISPATCHER: 'dispatcher',
    DRIVER: 'driver',
    ACCOUNTANT: 'accountant',
    VIEWER: 'viewer',
  } as const;
  ```

### 3.4 Implementasi Row Level Security (RLS)
- [ ] Enable RLS pada semua tabel
- [ ] **Bookings RLS:**
  - Driver: hanya bisa SELECT booking milik sendiri
  - Dispatcher/Admin/Owner: full SELECT
  - Admin/Owner: INSERT, UPDATE
  ```sql
  CREATE POLICY "drivers_own_bookings" ON bookings
    FOR SELECT USING (
      auth.uid() IN (SELECT user_id FROM drivers WHERE id = bookings.driver_id)
      OR get_user_role() IN ('owner', 'admin', 'dispatcher')
    );
  ```
- [ ] **Expenses RLS:** hanya owner + accountant
  ```sql
  CREATE POLICY "accounting_access" ON expenses
    FOR ALL USING (get_user_role() IN ('owner', 'accountant'));
  ```
- [ ] **Drivers RLS:**
  - Driver: hanya profil sendiri (SELECT)
  - Admin/Owner: full CRUD
  - Dispatcher: SELECT only
- [ ] **Vehicles RLS:**
  - Driver: SELECT only
  - Dispatcher/Admin/Owner: full access
- [ ] **Payroll RLS:** hanya owner + accountant
- [ ] **Guests/CRM RLS:** owner + admin
- [ ] **Company Documents RLS:** owner + admin
- [ ] **Vendors RLS:** owner + admin
- [ ] **Reviews RLS:** owner + admin (SELECT + UPDATE reply)
- [ ] Test semua RLS policy dengan different user roles

### 3.5 Middleware & Route Protection
- [ ] Buat `middleware.ts` di root project:
  - Refresh session token
  - Redirect unauthenticated users ke `/login`
  - Redirect authenticated users dari `/login` ke dashboard
- [ ] Buat `lib/auth/check-role.ts` — helper server-side role check
- [ ] Buat `hooks/useUser.ts` — client-side hook untuk current user + role
- [ ] Buat `components/shared/RoleGate.tsx` — conditional render berdasarkan role
  ```tsx
  <RoleGate allowedRoles={['owner', 'admin']}>
    <SensitiveComponent />
  </RoleGate>
  ```

### 3.6 Matriks Akses per Modul
- [ ] Buat `lib/constants/permissions.ts` — definisi akses per modul per role:
  ```typescript
  export const MODULE_ACCESS = {
    booking: { owner: 'full', admin: 'full', dispatcher: 'full', driver: 'own', accountant: 'none', viewer: 'read' },
    hr: { owner: 'full', admin: 'full', dispatcher: 'read', driver: 'own_profile', accountant: 'none', viewer: 'none' },
    fleet: { owner: 'full', admin: 'full', dispatcher: 'full', driver: 'read', accountant: 'none', viewer: 'none' },
    accounting: { owner: 'full', admin: 'none', dispatcher: 'none', driver: 'none', accountant: 'full', viewer: 'none' },
    crm: { owner: 'full', admin: 'full', dispatcher: 'none', driver: 'none', accountant: 'none', viewer: 'none' },
    legal: { owner: 'full', admin: 'full', dispatcher: 'none', driver: 'none', accountant: 'none', viewer: 'none' },
    vendor: { owner: 'full', admin: 'full', dispatcher: 'none', driver: 'none', accountant: 'none', viewer: 'none' },
    reports: { owner: 'full', admin: 'full', dispatcher: 'read', driver: 'none', accountant: 'full', viewer: 'read' },
  } as const;
  ```
- [ ] Buat `hooks/usePermission.ts` — hook untuk cek akses modul

### 3.7 Logout & Session Management
- [ ] Tombol logout di sidebar/header
- [ ] Clear session di Supabase Auth
- [ ] Redirect ke login page setelah logout
- [ ] Handle expired session gracefully (auto-redirect + pesan)

### 3.8 User Management (Admin Only)
- [ ] Halaman `app/(dashboard)/settings/users/page.tsx`:
  - Daftar semua user (nama, email, role, status)
  - Tambah user baru (invite via email)
  - Edit role user
  - Nonaktifkan user
  - Hanya owner yang bisa akses
- [ ] Buat Supabase Edge Function untuk invite user (karena perlu service role key)

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Halaman login berfungsi | User bisa login dengan email + password |
| Role system aktif | Setiap user punya role yang tersimpan |
| RLS aktif semua tabel | Query tanpa role yang sesuai → empty result |
| Route protection | URL langsung ke halaman terproteksi → redirect login |
| Role-based UI | Sidebar hanya tampilkan modul sesuai role |
| User management | Owner bisa invite & manage user |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 3.1 Supabase Auth setup | 30 menit |
| 3.2 Login page | 2 jam |
| 3.3 Role system | 1 jam |
| 3.4 RLS policies | 3 jam |
| 3.5 Middleware & protection | 2 jam |
| 3.6 Permission matrix | 1 jam |
| 3.7 Logout & session | 30 menit |
| 3.8 User management | 2 jam |
| **Total** | **~12 jam** |
