# KAD CRM — Field Intelligence
## Project Documentation

> This document is the single source of truth for the application's structure, flow, and component behaviour. Append all future feature documentation here.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Application Layout (App.tsx)](#4-application-layout-apptsx)
5. [Navigation — Sidebar](#5-navigation--sidebar)
6. [Header — TopBar](#6-header--topbar)
7. [Theme System](#7-theme-system)
8. [Screen-by-Screen Feature Documentation](#8-screen-by-screen-feature-documentation)
   - [Screen 1 — Overview (/)](#screen-1--overview-)
   - [Screen 2 — New Listing (/new-listing)](#screen-2--new-listing-new-listing)
   - [Screen 3 — Block Date (/block-date)](#screen-3--block-date-block-date)
   - [Screen 4 — Home / Beats (/beats)](#screen-4--home--beats-beats)
   - [Screen 5 — P1 Visit (/p1-visit)](#screen-5--p1-visit-p1-visit)
   - [Screen 6 — General Visit (/general-visit)](#screen-6--general-visit-general-visit)
   - [Screen 7 — Commission (/commission)](#screen-7--commission-commission)
   - [Screen 8 — BWG Upgradation (/bwg)](#screen-8--bwg-upgradation-bwg)
   - [Screen 9 — Lead Capture (/lead-capture)](#screen-9--lead-capture-lead-capture)
   - [Utility — Settings (/settings)](#utility--settings-settings)
   - [Global Modal — Beat Intelligence Map](#global-modal--beat-intelligence-map)
9. [Cross-Screen Navigation & Data Flow](#9-cross-screen-navigation--data-flow)

---

## 1. Project Overview

KAD CRM – Field Intelligence is a web-based CRM application built for field executives to manage venue visits, beat planning, commission collection, BWG upgradation, and lead capture across their assigned territories. It is a single-page application (SPA) with client-side routing.

**Primary Users:** Field Sales Executives, Area Managers (separate Manager Portal)

**Dev Server Port:** `3100`
**Build Tool:** Vite

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19.0.0 |
| Routing | React Router DOM | 7.13.2 |
| Styling | TailwindCSS | 4.1.14 |
| Icons | Lucide React | 0.546.0 |
| Charts | Recharts | 3.8.1 |
| Map | React Leaflet + Leaflet | 5.0.0 / 1.9.4 |
| Animations | Motion (Framer Motion) | 12.38.0 |
| Language | TypeScript | — |

---

## 3. Folder Structure

```
kad-crm---field-intelligence/
├── src/
│   ├── App.tsx                  # Root layout + router
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global CSS / theme tokens
│   ├── components/
│   │   ├── TopBar.tsx           # Sticky header
│   │   ├── Sidebar.tsx          # Fixed left navigation
│   │   ├── Overview.tsx         # Executive dashboard
│   │   ├── BeatMap.tsx          # Interactive Leaflet map (global modal)
│   │   ├── BeatPlanning.tsx     # Beat creation & management
│   │   ├── Settings.tsx         # User settings panel
│   │   ├── P1Visit.tsx          # P1 visit tracking
│   │   ├── GeneralVisit.tsx     # General visit logging
│   │   ├── Commission.tsx       # Commission management
│   │   ├── BWGUpgradation.tsx   # BWG promise upgradation
│   │   ├── LeadCapture.tsx      # Lead capture form
│   │   ├── NewListing.tsx       # New venue listing
│   │   └── BlockDate.tsx        # Block date management
│   ├── context/
│   │   └── ThemeContext.tsx     # Global theme (light/dark + colour)
│   └── lib/
│       └── utils.ts             # cn() classname utility
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── PROJECT_DOCUMENTATION.md    ← this file
```

---

## 4. Application Layout (App.tsx)

**File:** `src/App.tsx`

### Role
Root component. Wraps the entire app in the theme provider and router. Composes the persistent shell (Sidebar + TopBar) and renders the active route inside the main content area.

### Layout Structure

```
<ThemeProvider>
  <BrowserRouter>
    <Sidebar />                          ← fixed left, always visible (lg+)
    <div className="lg:ml-64 ...">
      <TopBar onOpenMap={...} />         ← sticky top header
      <main>
        <Routes> ... </Routes>           ← page content
      </main>
      <footer />
    </div>
    <BeatMap isOpen={isMapOpen} />       ← global fullscreen modal
  </BrowserRouter>
</ThemeProvider>
```

### State

| State | Type | Purpose |
|---|---|---|
| `isMapOpen` | `boolean` | Controls BeatMap modal open/close |

### Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Overview` | Executive dashboard — KPIs, target vs achieved, venue table |
| `/new-listing` | `NewListing` | Add new venue listings |
| `/block-date` | `BlockDate` | Schedule unavailability / block dates |
| `/beats` | `BeatPlanning` | Beat planning and management |
| `/p1-visit` | `P1Visit` | First (P1) visit tracking |
| `/general-visit` | `GeneralVisit` | General visit logging |
| `/commission` | `Commission` | Commission tracking and collection |
| `/bwg` | `BWGUpgradation` | BWG promise upgradation workflow |
| `/lead-capture` | `LeadCapture` | Lead capture form |
| `/settings` | `Settings` | User settings and preferences |
| `*` | `Overview` | Fallback — redirects to dashboard |

---

## 5. Navigation — Sidebar

**File:** `src/components/Sidebar.tsx`

### Role
Fixed left sidebar providing primary navigation and venue check-in functionality. Hidden on mobile (`hidden lg:flex`), always visible on large screens (`w-64`).

### Structure

```
Sidebar (fixed, w-64, left-0, top-0)
├── Branding header
│   └── "K" logo mark + "KAD CRM" + "Field Intelligence" subtitle
├── Navigation menu (9 NavLink items)
└── Footer (mt-auto, border-top)
    ├── [Button] Check-in at Venue  → opens Check-in Modal
    ├── [NavLink] Settings          → /settings
    └── [Button] Logout
```

> **Note:** Settings and Logout are in the sidebar **footer**, separate from the 9 primary nav items.

### Navigation Items (9 primary nav links)

| Icon | Label | Route |
|---|---|---|
| `LayoutDashboard` | Overview | `/` |
| `FilePlus` | New Listing | `/new-listing` |
| `CalendarDays` | Block Date | `/block-date` |
| `Map` | **Home** | `/beats` |
| `ClipboardCheck` | P1 Visit | `/p1-visit` |
| `Store` | General Visit | `/general-visit` |
| `Wallet` | Commission | `/commission` |
| `TrendingUp` | BWG Upgradation | `/bwg` |
| `UserPlus` | Lead Capture | `/lead-capture` |

Active route is highlighted with `bg-primary-container text-white shadow-md font-bold` styling.

### State

| State | Type | Purpose |
|---|---|---|
| `isCheckInOpen` | `boolean` | Check-in modal visibility |
| `searchQuery` | `string` | Filters venue list in check-in modal |
| `selectedVenue` | `Venue \| null` | Venue chosen in check-in step 1 |
| `isCheckedIn` | `boolean` | Confirmation success state (button changes to "Checked In!") |

---

### Check-in Modal

**Trigger:** "Check-in at Venue" gradient button in the sidebar footer.
**Modal title:** "Venue Check-in" | Subtitle: "Confirm your arrival at the location"

**Flow:** Two-step — Venue Selection → Confirmation → Success state → Auto-close (2 sec)

---

#### Step 1 — Venue Selection

| Element | Type | Details |
|---|---|---|
| Section header | Label | "Nearby Venues (GPS Enabled)" |
| Search input | Text | Placeholder: "Search nearby venues..." — filters by name or ID |
| Venue cards | Clickable list | Shows Store icon, name, address, distance, venue ID |

**Hardcoded venues (mock data):**

| Venue ID | Name | Address | Distance |
|---|---|---|---|
| 5065 | The Grand Hall | MG Road, Bangalore | 0.2 km |
| 5066 | Emerald Garden | Indiranagar, Bangalore | 1.5 km |
| 5067 | Vista Convention | Whitefield, Bangalore | 3.2 km |

---

#### Step 2 — Confirmation

| Element | Type | Details |
|---|---|---|
| Venue icon | MapPin (large, centred) | Primary colour |
| Venue name | Large heading | Centred |
| Venue address | Subtext | Below name |
| Distance | Info card | e.g. "0.2 km" |
| Accuracy | Info card | "± 5 meters" (hardcoded) |
| Confirm Check-in | Primary button | `Navigation` icon — calls `handleCheckIn()` |
| Change Venue | Secondary button | Resets `selectedVenue` to null → returns to Step 1 |

**Success state:** After "Confirm Check-in" is tapped:
- Button text changes to **"Checked In!"** with `CheckCircle2` icon
- Button is disabled and turns secondary colour
- Modal auto-closes after **2 seconds**, resets all state

---

## 6. Header — TopBar

**File:** `src/components/TopBar.tsx`

### Role
Sticky header rendered above all page content. Provides global search, theme toggle, notifications, map access, settings shortcut, and user identity.

### Structure

```
TopBar (sticky top-0, z-40, backdrop-blur-xl)
├── Left — Mobile menu icon + "KAD CRM" (mobile only)
├── Centre — Search bar (desktop only)
├── Right — Controls
│   ├── Theme toggle (Moon / Sun icon)
│   ├── Notifications bell (red dot indicator)
│   ├── Map button → triggers onOpenMap()
│   ├── Settings button → navigates /settings
│   └── User profile (name, title, avatar)
└── Notification Sheet (side drawer, AnimatePresence)
```

### Props

| Prop | Type | Description |
|---|---|---|
| `onOpenMap` | `() => void` | Callback passed from App.tsx to open BeatMap modal |

### State

| State | Type | Purpose |
|---|---|---|
| `isNotifOpen` | `boolean` | Notification sheet open/close |

---

### Controls Detail

#### Search Bar *(desktop only)*
- Placeholder: `"Search Venues or IDs..."`
- Width: `w-96`
- Icon: `Search` (lucide-react)
- Currently UI-only (no search logic wired)

#### Theme Toggle
- Icon: `Moon` in light mode → `Sun` in dark mode
- Action: calls `useTheme().toggleTheme()`
- Persists preference to `localStorage`

#### Notifications Bell
- Icon: `Bell` with a red dot indicator (always shown)
- Click: sets `isNotifOpen = true`, opens Notification Sheet

#### Map Button
- Icon: `MapPin`
- Click: calls `onOpenMap()` prop → opens BeatMap modal from App.tsx

#### Settings Button
- Icon: `Settings`
- Click: navigates to `/settings` via React Router

#### User Profile *(hidden on mobile)*
- Name: **Arjun Mehta**
- Title: **Senior Field Executive**
- Avatar: rounded image (picsum.photos placeholder)

---

### Notification Sheet

**Type:** Side drawer (slides in from the right, AnimatePresence)

#### Header
| Element | Content |
|---|---|
| Title | "Field Alerts" |
| Subtitle | "You have 3 unread notifications" |
| Close button | `X` icon — sets `isNotifOpen = false` |

#### Notification Items (Hardcoded — 4 items)

| # | Type | Message | Time | Priority | Icon | Colour |
|---|---|---|---|---|---|---|
| 1 | Commission | Pending collection for Vista Hall | 10 mins ago | High | `AlertCircle` | `text-primary` |
| 2 | P1 Visit | New visit assigned: Emerald Garden | 1 hour ago | Medium | `Info` | `text-tertiary` |
| 3 | BWG | Upgradation due for Grand Royal | 2 hours ago | Low | `CheckCircle2` | `text-secondary` |
| 4 | System | Sync completed successfully | 5 hours ago | Low | `CheckCircle2` | `text-on-surface-variant` |

#### Click Navigation (per notification type)

| Type | Navigates to |
|---|---|
| Commission | `/commission` |
| P1 Visit | `/p1-visit` |
| BWG | `/bwg` |
| System | `/` |

#### Footer
- Button: **"Mark All as Read"** — UI only, no logic wired yet

---

## 7. Theme System

**File:** `src/context/ThemeContext.tsx`

### Role
Global context that controls light/dark mode and the active colour scheme. Applied as CSS classes and `data-theme-color` attribute on the `<html>` element.

### Context Shape

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  themeColor: 'ruby' | 'blue' | 'green' | 'purple' | 'orange';
  toggleTheme: () => void;
  setThemeColor: (color: ThemeColor) => void;
}
```

### Theme Colours

| Key | Hex |
|---|---|
| `ruby` | `#b7003b` |
| `blue` | `#005fbc` |
| `green` | `#0f8241` |
| `purple` | `#6c2bd9` |
| `orange` | `#d94e1b` |

### Persistence
- Both `theme` and `themeColor` are saved to `localStorage`
- Falls back to system `prefers-color-scheme` if no saved preference

### Usage
```typescript
const { theme, themeColor, toggleTheme, setThemeColor } = useTheme();
```

---

## 8. Screen-by-Screen Feature Documentation

Each section documents one navigation destination: its views, all fields, all dropdowns, all modals, and the complete user flow.

---

### Screen 1 — Overview (`/`)

**File:** `src/components/Overview.tsx`

**Purpose:** Executive dashboard giving the field executive a real-time snapshot of their territory — key counts, target vs achieved progress, and a detailed venue performance table.

---

#### KPI Cards (5 cards, responsive grid)

| Card | Value | Icon |
|---|---|---|
| No. of Vendors | 312 | `Users` |
| No. of Halls | 248 | `Building2` |
| BWG Promise | 186 | `ShieldCheck` (tertiary) |
| Non BWG Promise | 62 | `ShieldOff` (error) |
| No. of Beats | 14 | `Map` |

---

#### Target vs Achieved Section

Targets are **read-only** — set by managers in the Manager Portal. This portal only displays progress.

| Metric | Achieved | Target | Display |
|---|---|---|---|
| New Listings | 38 | 50 | Progress bar + % badge |
| Upgrades | 22 | 30 | Progress bar + % badge |
| Commission Collection | ₹4.2L | ₹5.0L | Progress bar + % badge |

- Bar colour: primary (in progress) → tertiary (target met)
- Legend: "In Progress" (primary dot) / "Target Met" (tertiary dot)
- Subtitle: *"Targets set by your manager"*

---

#### Active Beat Card

- Displays the currently active beat venue (The Grand Hall, Venue ID: 5065)
- Shows last visit date and location precision
- Button: **"View Complete Logs"**

---

#### Venue Performance Table

**Controls:**
- Search input: placeholder "Search venues..." (UI only, no wired logic)
- Status filter dropdown: Status: All / Pending / Verified

**Table columns:**

| Column | Details |
|---|---|
| Venue ID | e.g. 5065 |
| Venue Name | Thumbnail image + name + location |
| Last Visit | Formatted date |
| Suggested | Integer count |
| Booked | Integer count |
| Comm. Coll. | Integer (tertiary colour) |
| Pending | Integer (error colour if > 0, else faded) |
| BWG Traffic | Formatted number (e.g. 56,000) |
| BWG Promise | Status badge (Yes / Pending / No) |
| — | ChevronRight (hover only) |

**Pagination:** Shows "Showing 1-10 of 248 Venues" with page buttons (1, 2, Next/Prev).

Clicking any row → **Venue Detail Modal**

---

#### Venue Detail Modal

**Trigger:** Click any row in the venue table.
**Layout:** Split left (primary colour panel) + right (intelligence panel)

**Left panel:**
| Element | Details |
|---|---|
| Venue image | 100×100 rounded avatar |
| Venue ID badge | e.g. "Venue ID: 5065" |
| Venue name | Large heading |
| Location | MapPin icon + area |
| Last Visit | History icon + date |
| Status | CheckCircle2 icon + Yes/No/Pending |
| Traffic Trend | Mini AreaChart (7-day sparkline) |

**Right panel — Venue Intelligence:**

| Stat | Icon | Colour |
|---|---|---|
| Suggested | `Lightbulb` | primary |
| Booked | `CalendarCheck` | primary |
| Collected | `Wallet` | tertiary |
| Pending | `Clock` | error (if > 0) |

- Venue Description (text)
- Manager name + Contact number

**Action buttons (4):**

| Button | Style |
|---|---|
| Log Visit | Primary (bg-primary-container) |
| Collect Comm. | Secondary (surface-container-high) |
| Upgrade BWG | Outlined (border primary-container) |
| View on Web | Dark (bg-on-surface) |

---

### Screen 2 — New Listing (`/new-listing`)

**File:** `src/components/NewListing.tsx`

**Purpose:** Register new mandapam (hall) properties under vendor profiles. Submissions go to admin for approval.

---

#### View A — Dashboard

| Element | Details |
|---|---|
| Header | "Properties Listing" |
| CTA button | "Create New Property" → switches to View B |
| Stat cards (3) | Total Properties, Approved, Pending Approval |

**Table — All Mandapams Directory:**

| Column | Details |
|---|---|
| Mandapam Name & ID | Name + ID badge |
| Vendor Details | Vendor name + "Verified Vendor" label |
| Location | Area/city |
| Capacity | Pax count |
| Approval Status | Badge: Approved (green), Pending (yellow), Rejected (red) |

Search input in table header is UI-only (no filter logic wired).

---

#### View B — Create New Property (2-column layout)

**Left panel — Vendor Selection**

| Element | Type | Details |
|---|---|---|
| Search input | Text | Filters vendor list by name or ID |
| Vendor list | Clickable cards | Shows vendor name, ID, phone |
| `+` button (panel header) | Button | Opens **Vendor Modal** |

**Right panel — Mandapam list for selected vendor**

When no vendor selected → empty state: "Select a Vendor First"

When vendor selected:
- Active Vendor header card (name, ID, phone — primary colour)
- **"Add Mandapam"** button → opens **Mandapam Modal**
- Assigned Properties table:

| Column | Details |
|---|---|
| Mandapam Name | Name + ID |
| Location | Area |
| Capacity | Pax |
| Features | Icons: AC (`Wind`), Parking (`Car`), Rooms (`BedDouble`) |
| Status | Approved / Pending / Rejected badge |

---

#### Modal 1 — Create New Vendor

**Trigger:** `+` icon in the Vendor panel header

| Field | Type | Required | Notes |
|---|---|---|---|
| Company / Individual Name | Text input | Yes | — |
| Mobile Number | Tel input | Yes | Prefix +91 |
| Email Address | Email input | No | Optional |
| Vendor Type | Dropdown | No | Individual, Private Limited, Partnership, Trust |
| Billing Address | Textarea | No | Optional |
| GST Number | Text input | No | Uppercase, optional |

**Submit:** "Create Vendor Profile" — adds vendor, auto-selects them, closes modal. Shows 4-second success toast: *"Vendor Profile Created!"*

---

#### Modal 2 — Create Property (Mandapam)

**Trigger:** "Add Mandapam" button in the active vendor header card

**Header:** Shows vendor name it is linked to (primary colour bar).

**Section: Media Upload**
- Drag & drop / click upload zone
- Recommended: front facade, main hall, dining area
- Max 5MB per file

**Section: Basic Details**

| Field | Type | Required | Notes |
|---|---|---|---|
| Mandapam Name | Text input | Yes | — |
| Primary Location | Text with MapPin icon | Yes | Area/city |
| Pricing (₹/day) | Number with ₹ icon | No | — |
| Hall Type | Dropdown | No | Air Conditioned, Non-AC |

**Section: Capacities & Amenities**

| Field | Type | Required | Notes |
|---|---|---|---|
| Main Hall Pax | Number input | No | Max seating capacity |
| Dining Pax | Number input | No | Optional |
| Parking (Cars) | Number input | No | Optional |
| Rooms | Number input | No | Optional |

**Submit:** Submits for admin approval, status = `Pending`. Shows 4-second success toast, then auto-returns to View A dashboard.

---

### Screen 3 — Block Date (`/block-date`)

**File:** `src/components/BlockDate.tsx`

**Purpose:** Block specific dates on mandapam calendars for customer bookings (morning, evening, or full day slots).

---

#### View 1 — Dashboard (Active Bookings)

| Element | Details |
|---|---|
| Header | "Active Bookings" |
| CTA button | "New Booking" → goes to View 2 |
| Search input | Filters by mandapam name, booking ID, or customer name |

**Table columns:**

| Column | Details |
|---|---|
| Booking ID & Date | Ref ID (e.g. B12X1) + formatted date |
| Mandapam Name | Name + ID |
| Customer | Name + phone |
| Slot | Badge: Full Day (primary), Morning Half / Evening Half (secondary) |
| Actions | "View Calendar" → opens that mandapam's calendar (View 3) |

Empty state shown if no bookings match search.

---

#### View 2 — Select Mandapam (Step 1 of 2)

| Element | Type | Details |
|---|---|---|
| Back link | Button | Returns to View 1 Dashboard |
| Step indicator | Label | "Step 1 of 2" |
| Search input | Text | Filters by name or location |
| Mandapam cards | Clickable | Icon, name, location, capacity (Pax), ID badge |

**Mock mandapams:**

| ID | Name | Vendor | Capacity | Location |
|---|---|---|---|---|
| M101 | Grand Royal Mahal | Ramesh Kumaran | 1000 | T Nagar |
| M102 | Sri Valli Kalyana Mandapam | Srinivasan Weddings | 500 | Anna Nagar |
| M103 | Emerald Mini Hall | Srinivasan Weddings | 200 | Adyar |

Clicking a card → View 3.

---

#### View 3 — Calendar View (Step 2 of 2)

**Layout:** Left — calendar grid | Right — action panel (slides in on date click)

**Calendar header:** Month title "March 2026" + Prev / Today / Next navigation buttons

**Legend:**
- Morning Half — gradient bottom overlay
- Evening Half — gradient top overlay
- Full Day — `XCircle` badge + primary tint

**Calendar grid:** 7-column Su–Sa. Each day is a clickable button with visual blocking overlays. Selected day gets a primary ring + slight scale.

**Right panel — when a date is clicked:**

*If date is already blocked:*

| Element | Details |
|---|---|
| Status badge | "Full Day Blocked" / "Morning Half Blocked" / "Evening Half Blocked" (error colour) |
| Customer Name | User icon + name |
| Phone | Phone icon + number |
| Booking Ref ID | Building icon + ID |
| Unblock button | "Unblock / Cancel Booking" — removes booking, returns right panel to empty state |

*If date is free — Booking Form:*

| Field | Type | Details |
|---|---|---|
| Slot selector | Radio cards (3) | Morning Half (06:00 AM – 02:00 PM), Evening Half (03:00 PM – 11:00 PM), Full Day (24 Hours) |
| Customer Name | Text input | Required |
| Phone Number | Tel input | Required |
| Submit | Primary button | "Block Date" — creates booking, auto-redirects to View 1 Dashboard |

---

### Screen 4 — Home / Beats (`/beats`)

**File:** `src/components/BeatPlanning.tsx`

**Purpose:** Central command screen for field executives. View all vendors in assigned beats, filter by beat/purpose/proximity, plan visits, and drill into vendor intelligence.

> **Note:** The sidebar label for this screen is **"Home"** (not "Beats").

---

#### Main Screen Layout

**Top section — Field Notifications bar**
- Horizontal scroll of notification cards (Commission, P1 Visit, BWG types)
- Priority: high → error colour, medium/low → primary colour
- "Mark all as read" link (UI only)

**Controls bar:**

| Control | Type | Options / Behaviour |
|---|---|---|
| "Admin Portal" button | Button | Opens **Admin Update Modal** |
| Search input | Text | Filters vendor list by name or ID |
| Beat filter | Dropdown | All Beats (B1-B10), Beat B1 through Beat B10 |
| Purpose filter | Dropdown | Purpose Filter (all), P1 Visit, Commission Visit, BWG Upgradation, General Visit, New Listing, Lead Generation |
| Sort by Proximity toggle | Toggle button | When active: sorts vendors by `proximity` km ascending |
| "+" per row | Button | Adds vendor to Planned Visits section |

**Vendor table:**

| Column | Details |
|---|---|
| Vendor ID | e.g. V-88012 |
| Vendor Name | Clickable → opens **Vendor Detail Modal** |
| No. of Halls | Integer |
| Contact(s) | Phone number(s) |
| Zip | Pincode |
| BWG Promise | Y / N |
| Co-operation | Y / PY / N |
| Beat No | B1, B2 ... |
| Purpose | Inline dropdown — selecting navigates to that module after 300ms |
| Proximity | Distance in km |
| Actions | "+" add to plan |

**Purpose dropdown options (per vendor row):**
P1 Visit → `/p1-visit` | Commission Visit → `/commission` | BWG Upgradation → `/bwg` | General Visit → `/general-visit` | New Listing → `/lead-capture` | Lead Generation → `/lead-capture`

**Planned Visits section** (below table):
- Shows vendors added to current day's plan
- Each entry has a remove button

---

#### Modal 1 — Vendor Detail Modal

**Trigger:** Click any vendor row

**Layout:** Split — Left (primary colour panel) + Right (intelligence panel)

**Left panel:**

| Element | Details |
|---|---|
| Initial avatar | First letter of vendor name |
| Vendor ID badge | e.g. V-88012 |
| Vendor Name | Large heading |
| Address | MapPin icon |
| No. of Halls | Layers icon |
| Beat Assignment | e.g. Beat B1 |
| Manager Details card | Name + phone |

**Right panel:**

| Element | Details |
|---|---|
| BWG Promise | Y / N value card |
| Co-operation | Y / PY / N value card |
| Vendor Notes | Free text description |
| Contact Numbers | Phone badge list |

**Action buttons (6):**

| Button | Navigates to |
|---|---|
| P1 Visit | `/p1-visit` |
| Commission | `/commission` |
| BWG Upgrad. | `/bwg` |
| New Listing | `/lead-capture` |
| Lead Gen. | `/lead-capture` |
| General Visit | `/general-visit` |

---

#### Modal 2 — Admin: Update Vendor

**Trigger:** "Admin Portal" button in controls bar

| Field | Type | Options |
|---|---|---|
| Vendor ID | Searchable dropdown | All vendors — selecting auto-populates all other fields |
| Vendor Name | Text input | — |
| No. of Halls | Number input | — |
| Zip Code | Text input | — |
| BWG Promise | Dropdown | Yes (Y), No (N) |
| Co-operation | Dropdown | Yes (Y), Partially (PY), No (N) |
| Beat No | Text input | B1 – B10 |

**Submit:** "Update & Sync Portal" — updates vendor in list. **Cancel** closes modal.

---

### Screen 5 — P1 Visit (`/p1-visit`)

**File:** `src/components/P1Visit.tsx`

**Purpose:** Manage and log first (P1) priority customer visits synced from the TC CRM. Field exec records the outcome (disposition) of each visit.

---

#### View A — Visit List Dashboard

**Stats row (4 cards):** Total Visits (4), Pending (3), Completed (1), Success Rate (64%)

**Controls:**
- Search input: filters by customer name or visit ID
- Filter button (UI only)

**Table — Active Visit Plans:**

| Column | Details |
|---|---|
| Customer Details | Avatar initial, name, phone |
| Meeting Time | Time + date |
| Suggested Venues | Venue chips (pre-suggested by KAM) |
| Status | Pending (tertiary) / Completed (secondary, row greyed + desaturated) |
| Action | "Disposition" button (Pending only) / `···` for Completed |

Clicking "Disposition" or a Pending row → View B. Completed rows are non-clickable.

---

#### View B — Visit Disposition Entry

**Breadcrumb:** CRM Modules > P1 Visit Plan > [Customer Name]

**Left panel (4/12) — Customer Intelligence:**
- Customer name + phone
- Meeting Schedule (date + time)
- Suggested Venues from KAM (list with `CheckCircle2` icons)
- Recent Activity log (last interaction type + date)

**Right panel (8/12) — Outcome Form:**

**Disposition dropdown options:**

| Option | Conditional fields shown |
|---|---|
| `Booking Success` | Date of Event (date), Type of Event (dropdown), Booking Value ₹ (number), Comments (textarea) |
| `Alternate Venue Suggested` | Venue Name (text), Date of Event (date), Type of Event (dropdown), Expected Value ₹ (number), Comments (textarea) |
| `Not Interested` | Reason for Disinterest (textarea) |
| `Customer to Decide Later` | Follow-up Date (date), Follow-up Time (time) — *triggers alert for both KAE and KAM* |

**Type of Event dropdown options** (Booking Success & Alternate Venue):
Wedding, Corporate Event, Birthday, Others

**Submit:** "Save & Sync to CRM" — visible only after a disposition is selected. Note shown: *"Disposition will be shared with KAM immediately."*

---

### Screen 6 — General Visit (`/general-visit`)

**File:** `src/components/GeneralVisit.tsx`

**Purpose:** Log routine field visits to venues outside of P1 or commission-specific trips.

---

#### View A — Venue Selection List

**Stats row (3 cards):** Visits This Week (24), Venues Covered (18/250), Gifts Distributed (12)

**Controls:**
- Search input: filters by venue name or ID
- Filter button (UI only)

**Table — Select Venue to Log Visit:**

| Column | Details |
|---|---|
| Venue Details | Store icon, name, ID |
| Location | Full address |
| Last Visit | Date with Clock icon |
| Manager | Name |
| Action | "Log Visit" button |

Click row or "Log Visit" → View B

---

#### View B — Log Field Visit Form

**Breadcrumb:** General Visit > [Venue Name]

**Left panel (4/12):**
- Venue context card: icon, name, ID, address, manager, contact
- Visit History card: last visit date

**Right panel (8/12) — Visit Form:**

| Field | Type | Details |
|---|---|---|
| Person Visited (KAE/KAM) | Text input | Name of person at venue who was met |
| Phone Number | Tel input | With Phone icon |
| Person Received | Text input | Who received the executive at venue entrance |
| Gift Given | Toggle buttons (2) | Not applicable / Yes (with `Gift` icon) |
| Visit Comments | Textarea (4 rows) | Outcome, discussion points, observations |

**Action buttons:**
- "Submit General Visit Log" (primary)
- "Save Draft" (secondary)

---

### Screen 7 — Commission (`/commission`)

**File:** `src/components/Commission.tsx`

**Purpose:** Track and process commission collection from vendors after customer events. Log collection outcome or set a follow-up disposition.

---

#### View A — Commission Dashboard

**Left — Wallet Card (primary colour):**
- Total Settled Commission: **₹4,28,500**
- This Month: ₹85,400
- Pending: ₹12,800

**Right — Quick Stats grid:** Additional KPI cards

**Controls:**
- Search input: filters by customer name, venue name, or record ID
- "Statement" download button (UI only)
- KAE name badge: "KAE: Sanjay Kumar"

**Commission Records Table:**

| Column | Details |
|---|---|
| Record ID | e.g. COM-001 |
| Customer Name + Phone | — |
| Venue Name + ID | — |
| Vendor Name + Contact | — |
| Event Date + Type | Wedding / Corporate / Reception |
| Booking Value | ₹ formatted |
| Commission Receivable | ₹ formatted |
| Status | Due / Follow-up / AFC / Collected / Denied / Cancelled |
| Action | Button → View B |

**Recent Transactions table:**

| Column | Details |
|---|---|
| TXN ID | e.g. TXN-99012 |
| Venue | Name |
| Date | — |
| Amount | ₹ formatted |
| Status | Settled / Pending |
| Type | Credit |

---

#### View B — Process Commission

**Breadcrumb:** Commission Settlement > [Customer Name]

**Left panel (4/12) — Record Intelligence:**
- Customer name + phone
- Venue Details card (name, ID, vendor name, vendor contact)
- Event Details card (date, event type, booking value)
- Commission Receivable — highlighted primary card (₹ amount)

**Right panel (8/12):**

**Step 1: "Was the commission collected?" — YES / NO large toggle**

**If YES:**

| Field | Type | Details |
|---|---|---|
| Amount Collected | Number input with ₹ | Pre-filled with commission receivable |
| Date of Collection | Date input | Pre-filled with today's date |
| Mode of Payment | Icon button group (4) | GPay, Cheque, Cash, Scanner |
| Upload Proof | Drag & drop / camera | **Mandatory** — image/PDF |
| Balance Collectible | Number input with ₹ | If partial payment |

**If NO — Disposition dropdown (8 options):**

| Disposition | Conditional sub-fields |
|---|---|
| Commission under follow-up | Next Follow-up Date + Time |
| Commission receivable AFC | Next Follow-up Date + Time |
| Vendor denied | Denial Reason textarea — auto-escalates to KAM |
| Next booking commission collectible | None |
| Booked through us — not interested | None |
| Booking not done at all | None |
| Event cancelled | None |
| Follow-up — new listing | Info banner — *"Submitting will redirect you to Lead Module"* |

**Submit:** "Submit Commission Record" (primary) | "Save Draft" (secondary)

---

### Screen 8 — BWG Upgradation (`/bwg`)

**File:** `src/components/BWGUpgradation.tsx`

**Purpose:** Initiate and track BWG (Best With Gold) tier upgrades for high-performing venues. Field exec records the discussion outcome and agreed commission percentage.

---

#### View A — Upgradation Dashboard

**Stats row (3 cards):** Eligible for Upgrade (12), Upgrades This Month (08), Avg. Commission (14.2%)

**Header badge:** "Premium Logic Active" (Zap icon)

**Controls:**
- Search input: filters by venue name or ID
- Filter button (UI only)

**Table — Select Venue for Upgradation:**

| Column | Details |
|---|---|
| Venue Details | Store icon, name, ID |
| Current Tier | Standard / Silver / Gold badge |
| Bookings (LMTD) | Count with `TrendingUp` icon |
| Status | Eligible (tertiary), In Progress (primary), Upgraded/Rejected (grey) |
| Action | "Initiate" button |

Click row or "Initiate" → View B

---

#### View B — Initiate Tier Upgrade

**Breadcrumb:** BWG Upgradation > [Venue Name]

**Left panel (4/12) — Venue Intelligence:**
- Venue name, ID, `Zap` icon
- Current Tier → Target Tier (BWG Premium) display cards
- Address, manager name
- Performance Metrics:
  - Bookings Last Month (progress bar, max baseline: 15)
  - Satisfaction Score % (progress bar)

**Right panel (8/12) — Upgrade Discussion Outcome:**

**Step 1: "Is the venue agreeable to BWG upgrade?" — YES / NO large toggle**

**If YES:**

| Field | Type | Details |
|---|---|---|
| Agreed Commission Override (%) | Range slider | Min: 8%, Max: 25%, Default: 12% — live badge shows value |
| Additional Terms / Comments | Textarea | Any specific terms discussed |

*Standard commission is 8%. BWG Premium allows up to 25% override.*

**If NO:**

| Field | Type | Details |
|---|---|---|
| Reason for Denial | Textarea (4 rows) | Why the venue declined the upgrade |

**Action buttons (visible after YES/NO selected):**
- "Save & Update BWG Status" (primary)
- "Save Draft" (secondary)

---

### Screen 9 — Lead Capture (`/lead-capture`)

**File:** `src/components/LeadCapture.tsx`

**Purpose:** Capture customer enquiries spotted during venue visits and route them to the Regional KAM via TC CRM for follow-up.

---

#### View A — Venue Selection List

**Stats row (3 cards):** Leads Captured this Week (14), Conversion Rate (32%), Active Venues (250)

**Header badge:** "Lead Quality: 8.5/10"

**Controls:**
- Search input: filters by venue name or ID
- Filter button (UI only)

**Table — Select Venue to Capture Lead:**

| Column | Details |
|---|---|
| Venue Details | Store icon, name, ID |
| Location | Full address |
| Manager | Name |
| Contact | Phone |
| Action | "Capture Lead" button |

Click row or button → View B

---

#### View B — Capture New Lead Form

**Breadcrumb:** Lead Capture > [Venue Name]

**Left panel (4/12):**
- Venue context card (name, ID, address, manager, contact)
- Lead Routing info card (primary colour): *"Leads captured here are automatically synced to TC CRM and assigned to the Regional KAM for immediate follow-up."*

**Right panel (8/12) — Lead Form:**

| Field | Type | Details |
|---|---|---|
| Customer Name | Text with `User` icon | Full name |
| Customer Nos. | Tel with `Phone` icon | Phone number |
| Date of Event | Date with `Calendar` icon | — |
| Event Type | Dropdown | Wedding, Reception, Corporate Event, Birthday Party, Engagement, Other |
| Comments / Requirements | Textarea (4 rows) | Budget, special requests, requirements |

**Action buttons:**
- "Submit Lead to CRM" (primary) — syncs to TC CRM + assigns to Regional KAM
- "Discard" (secondary)

---

### Utility — Settings (`/settings`)

**File:** `src/components/Settings.tsx`

> **Note:** Settings is accessed from the **sidebar footer**, not from the 9 primary nav items. It is also reachable from the TopBar Settings icon button.

**Purpose:** User profile management, app preferences, theme customisation, and security options.

---

#### View A — Main Settings Hub

**Profile card:** Avatar, user name, Employee ID, edit button

**Quick actions:**
- Dark mode toggle (`Sun` / `Moon`)
- Theme colour picker (5 swatches: ruby, blue, green, purple, orange)
- Logout button

**Settings sections (3):**

| Section | Item | Action |
|---|---|---|
| Profile Settings | Personal Information | → View B |
| Profile Settings | Assigned Beats | → View C |
| Application | Notifications | Toggle (UI) |
| Application | Offline Access | Toggle (UI) |
| Application | Language | Selector (UI) |
| Security & Privacy | Privacy Policy | Link |
| Security & Privacy | Data Sync | Info |

---

#### View B — Personal Information

| Field | Type | Notes |
|---|---|---|
| Full Name | Text input | Editable |
| Employee ID | Text input | Disabled (read-only) |
| Email Address | Email input | Editable |
| Phone Number | Tel input | Editable |
| Home Base / Region | Text input | Editable |

**Buttons:** Save (primary), Cancel (secondary)

---

#### View C — Assigned Beats

- Primary Beat highlight card: Beat B1 — Indiranagar

**Beat cards grid:**

| Element | Details |
|---|---|
| Beat name | e.g. B1, B2, B3 |
| Status badge | Primary / Assigned / Backup |
| Venue count | Number of venues in beat |
| "View Beat Map" button | Opens BeatMap global modal |

**CTA card:** "Request New Beat" — links to beat request workflow

---

### Global Modal — Beat Intelligence Map

**File:** `src/components/BeatMap.tsx`

**Triggers:**
- TopBar `MapPin` button (calls `onOpenMap()` → `isMapOpen = true` in App.tsx)
- Settings → Assigned Beats → "View Beat Map" button

**Purpose:** Fullscreen interactive Leaflet map showing venues across the selected beat territory with status-based filtering.

---

#### Props

| Prop | Type | Description |
|---|---|---|
| `isOpen` | `boolean` | Controls visibility — returns null if false |
| `onClose` | `() => void` | Closes the modal |

#### State

| State | Type | Default | Purpose |
|---|---|---|---|
| `selectedBeat` | `Beat` | T Nagar (C1) | Currently displayed beat territory |
| `userLocation` | `[lat, lng] \| null` | null | Real GPS position (browser geolocation API) |
| `hoveredVenue` | `Venue \| null` | null | Shows info card on map hover |
| `clickedVenue` | `Venue \| null` | null | Shows info card with ring on map click |
| `filter` | `'all' \| 'visited' \| 'pending' \| 'priority'` | `'all'` | Filters visible venue markers |

---

#### Header Controls

| Element | Details |
|---|---|
| Beat selector | Inline dropdown — switches map territory. Options: all 6 beats |
| Filter buttons (4) | All, Visited, Pending, Priority — toggled pill buttons |
| Close button | `X` — calls `onClose()` |

---

#### 6 Mock Beats

| Beat ID | Name | Venues | Radius |
|---|---|---|---|
| C1 | T Nagar | 5 | 1500m |
| C2 | Adyar | 4 | 1200m |
| C3 | Anna Nagar | 4 | 1800m |
| C4 | Velachery | 4 | 1400m |
| C5 | Mylapore | 4 | 1100m |
| C6 | Nungambakkam | 4 | 1300m |

Each venue has: `id`, `name`, `lat`, `lng`, `type` (Premium / Standard), `status` (visited / pending / priority)

---

#### Map Elements

| Element | Details |
|---|---|
| Base tile | OpenStreetMap |
| Beat region overlay | Dashed purple circle (radius per beat) + inner faint ring |
| Global wash | Very large faint purple circle over visible area |
| Venue markers | Custom SVG pin icons; filtered by current `filter` state |
| User location marker | Shown if browser geolocation granted |
| Marker popup | Shows venue name, type, status icon + "View Details" button |

---

#### Venue Info Card (bottom-right overlay)

Appears on marker hover **or** click (click adds a primary ring):

| Element | Details |
|---|---|
| Status badge | visited (secondary) / pending or priority (primary) |
| Close button | `X` — clears both hovered and clicked venue |
| Venue name | Large heading |
| Venue ID + Type | Subtext |
| "Log Visit" button | Primary — navigates to General Visit (UI only currently) |
| "Details" button | Secondary |

---

#### Floating Controls (bottom-left)

| Button | Icon | Action |
|---|---|---|
| Location | `Navigation` | UI only (re-centre to user location intent) |
| Layers | `Layers` | UI only (layer toggle intent) |

---

#### Footer Stats Bar

| Stat | Value |
|---|---|
| Visited | 12 (secondary dot) |
| Priority | 5 (primary dot) |
| Pending | 25 (outline-variant dot) |

---

## 9. Cross-Screen Navigation & Data Flow

```
Overview (/)
  └─ Venue Detail Modal
       ├─ Log Visit       → /general-visit
       ├─ Collect Comm.   → /commission
       ├─ Upgrade BWG     → /bwg
       └─ View on Web     → external (UI only)

Home / Beats (/beats)
  └─ Vendor Detail Modal
       ├─ P1 Visit        → /p1-visit
       ├─ Commission      → /commission
       ├─ BWG Upgrad.     → /bwg
       ├─ New Listing     → /lead-capture
       ├─ Lead Gen.       → /lead-capture
       └─ General Visit   → /general-visit
  └─ Purpose dropdown (inline per vendor row)
       └─ navigates same routes as above (300ms delay)

TopBar Notifications
  ├─ Commission           → /commission
  ├─ P1 Visit             → /p1-visit
  ├─ BWG                  → /bwg
  └─ System               → /

TopBar MapPin button      → BeatMap modal (global)
Settings → Assigned Beats → BeatMap modal (global)
Sidebar Check-in button   → Check-in Modal (inline)

Commission (/commission)
  └─ Disposition: "Follow-up — new listing" → /lead-capture

Block Date (/block-date)
  └─ Dashboard "View Calendar" → jumps directly to that mandapam's calendar view

New Listing (/new-listing)
  └─ Create Property → status: Pending (admin approval via Manager Portal — external)
```

---

*— End of full documentation. Append new screen or feature sections below as the application evolves. —*
