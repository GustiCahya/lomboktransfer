# Step 04 - Layout & Navigation Shell

**Fase:** 1 - Fondasi  
**Target:** Minggu 1–2 (Hari 4–5)  
**Dependency:** Step 03 (Authentication)  
**Referensi PRD:** §1.3 Prinsip Desain, §2.2 Akses per Modul

---

## Tujuan

Membangun kerangka layout utama dashboard - sidebar navigation, header, breadcrumb, dan responsive shell yang menjadi fondasi semua halaman modul.

---

## Todo List

### 4.1 Dashboard Layout (Desktop)

- [ ] Buat `app/(dashboard)/layout.tsx`:
  - Sidebar navigasi (collapsible, 240px → 64px)
  - Top header bar (user info, notifikasi bell, logout)
  - Main content area (scrollable)
  - Breadcrumb navigation
- [ ] Implementasi sidebar state (expanded/collapsed) dengan localStorage persist
- [ ] Animasi transisi sidebar (smooth collapse/expand)

### 4.2 Sidebar Navigation

- [ ] Buat `components/shared/Sidebar.tsx`:
  - Logo Lombok Transfer di atas
  - Menu items dengan icon (lucide-react):

    | Menu | Icon | Route |
    |---|---|---|
    | Dashboard | `LayoutDashboard` | `/` |
    | Booking | `CalendarCheck` | `/bookings` |
    | Dispatch | `MapPin` | `/dispatch` |
    | Supir | `Users` | `/drivers` |
    | Armada | `Car` | `/fleet` |
    | Keuangan | `Banknote` | `/accounting` |
    | CRM & Tamu | `Heart` | `/crm` |
    | Legal | `Shield` | `/legal` |
    | Vendor | `Store` | `/vendors` |
    | Laporan | `BarChart3` | `/reports` |
    | Pengaturan | `Settings` | `/settings` |

  - Active state highlight
  - Tooltip saat sidebar collapsed
  - **Role-based visibility**: sembunyikan menu yang tidak boleh diakses role user
- [ ] Buat `components/shared/SidebarItem.tsx` - individual menu item component

### 4.3 Top Header Bar

- [ ] Buat `components/shared/Header.tsx`:
  - Hamburger menu (toggle sidebar di mobile)
  - Breadcrumb path
  - Search global (Command+K shortcut) - implementasi dasar
  - Notification bell icon + badge count
  - User avatar + dropdown (profil, logout)
- [ ] Buat `components/shared/Breadcrumb.tsx` - auto-generate dari URL path
- [ ] Buat `components/shared/NotificationBell.tsx` - placeholder, implementasi detail di Step 10
- [ ] Buat `components/shared/UserMenu.tsx` - dropdown dengan profil + logout

### 4.4 Mobile Layout (Driver View)

- [ ] Buat `app/(driver)/layout.tsx`:
  - Bottom navigation bar (tab style)
  - Minimal header (logo + user name)
  - Tabs:

    | Tab | Icon | Route |
    |---|---|---|
    | Trip Hari Ini | `Navigation` | `/trips` |
    | Jadwal | `Calendar` | `/trips/schedule` |
    | Profil | `User` | `/trips/profile` |

  - Full-screen content area
  - Optimasi touch targets (min 44x44px)
- [ ] Buat `components/shared/BottomNav.tsx` - bottom tab navigation

### 4.5 Responsive Behavior

- [ ] Desktop (≥1024px): sidebar + main content side by side
- [ ] Tablet (768–1023px): sidebar collapsed by default, overlay mode
- [ ] Mobile (≤767px): sidebar sebagai slide-out drawer dari kiri
- [ ] Driver view: always mobile layout (bottom tabs)
- [ ] Test di resolusi: 375px (iPhone SE), 768px (iPad), 1440px (desktop)

### 4.6 Theme & Design System

- [ ] Definisikan color tokens di CSS variables:

  ```css
  :root {
    --primary: /* brand blue/teal Lombok */;
    --primary-foreground: ;
    --secondary: ;
    --accent: ;
    --background: ;
    --card: ;
    --muted: ;
    --destructive: /* merah untuk cancel/error */;
    --warning: /* kuning untuk pending */;
    --success: /* hijau untuk active/selesai */;
    --info: /* biru untuk confirmed */;
  }
  ```

- [ ] Dark mode support (toggle di header) - opsional, nice to have
- [ ] Typography: setup font Inter/Plus Jakarta Sans via Google Fonts
- [ ] Card component style yang konsisten untuk semua modul
- [ ] Status badge color system:
  - `pending` → kuning
  - `confirmed` → biru
  - `in_progress` → hijau
  - `completed` → abu-abu
  - `cancelled` → merah
  - `active` → hijau
  - `inactive` → abu-abu
  - `expired` → merah

### 4.7 Loading & Error States

- [ ] Buat `app/(dashboard)/loading.tsx` - skeleton loading layout
- [ ] Buat `app/(dashboard)/error.tsx` - error boundary page
- [ ] Buat `app/(dashboard)/not-found.tsx` - 404 page
- [ ] Buat `components/shared/PageSkeleton.tsx` - reusable skeleton
- [ ] Buat `components/shared/EmptyState.tsx` - tampilan saat data kosong
- [ ] Buat `components/shared/ErrorAlert.tsx` - inline error display

### 4.8 Common Page Patterns

- [ ] Buat `components/shared/PageHeader.tsx`:
  - Title + subtitle
  - Action buttons (Add New, Export, Filter toggle)
  - Breadcrumb integration
- [ ] Buat `components/shared/DataTable.tsx`:
  - Wrapper shadcn/ui Table
  - Built-in pagination
  - Column sorting
  - Row selection
  - Loading skeleton rows
- [ ] Buat `components/shared/FilterBar.tsx`:
  - Collapsible filter panel
  - Date range picker
  - Dropdown filters
  - Search input
  - Active filter badges
  - Reset filters button
- [ ] Buat `components/shared/ConfirmDialog.tsx` - konfirmasi aksi destructive
- [ ] Buat `components/shared/StatusBadge.tsx` - reusable status badge

---

## Deliverables

| Output | Kriteria Selesai |
|---|---|
| Dashboard layout | Sidebar + header + content area render sempurna |
| Responsive layout | Berfungsi di 375px, 768px, 1440px |
| Driver mobile layout | Bottom tabs navigation berfungsi |
| Role-based sidebar | Menu disembunyikan sesuai role user |
| Common components | DataTable, FilterBar, PageHeader bisa dipakai |
| Loading/error states | Skeleton, error boundary, empty state tersedia |
| Theme system | Color tokens, typography, badge colors konsisten |

---

## Estimasi Waktu

| Task | Durasi |
|---|---|
| 4.1 Dashboard layout | 2 jam |
| 4.2 Sidebar | 2 jam |
| 4.3 Header | 1.5 jam |
| 4.4 Mobile layout | 2 jam |
| 4.5 Responsive | 1.5 jam |
| 4.6 Theme & design | 2 jam |
| 4.7 Loading/error states | 1.5 jam |
| 4.8 Common components | 3 jam |
| **Total** | **~16 jam** |
