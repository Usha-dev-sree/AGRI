# AgriValue AI — Phase 2: Frontend Layout, Routing & Authentication Shell

> **B.Tech Final Year Major Project**  
> **Status**: Completed & Verified  

---

## 1. Frontend Shell Architecture

The AgriValue AI client utilizes a dual-shell architecture designed with **React 19 + React Router v7 + Tailwind CSS v4**:

```
                              ┌─────────────────────────┐
                              │     App Entry Point     │
                              │       (App.jsx)         │
                              └────────────┬────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       ┌─────────────────────────┐                   ┌─────────────────────────┐
       │       PublicShell       │                   │        AppShell         │
       │  (Navbar + Full Width)  │                   │(Navbar + Dynamic Sidebar│
       │  - Landing Page (/)     │                   │     + Scrollable View)  │
       │  - Login Page (/login)  │                   └────────────┬────────────┘
       │  - Register (/register) │                                │
       └─────────────────────────┘                 ┌──────────────┼──────────────┐
                                                   ▼              ▼              ▼
                                              ┌─────────┐    ┌─────────┐    ┌─────────┐
                                              │ Farmer  │    │Processor│    │  Admin  │
                                              │ Routes  │    │ Routes  │    │ Routes  │
                                              └─────────┘    └─────────┘    └─────────┘
```

---

## 2. Complete Application Routing Table

| Route Path | Layout | Component | Target Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `PublicShell` | `LandingPage` | All / Public | Hero banner, live counters, 3 role cards, value matrix |
| `/login` | `PublicShell` | `LoginPage` | All / Public | Role-based login with 1-Click instant demo accounts |
| `/register` | `PublicShell` | `RegisterPage` | All / Public | Dual Farmer / Processor registration form |
| `/farmer` | `AppShell` | `FarmerDashboard` | `farmer` | KPI cards, residue donut chart, live logistics timeline |
| `/farmer/ai-scanner` | `AppShell` | `AIScanner` | `farmer` | MobileNetV3 visual scan, Top-3 confidence, pathway values |
| `/farmer/farms` | `AppShell` | `FarmManager` | `farmer` | Farm acreage, soil type, irrigation & geo-coordinates |
| `/farmer/crops` | `AppShell` | `CropManager` | `farmer` | Crop calendar, season, yield and sowing tracker |
| `/farmer/waste` | `AppShell` | `WasteLogger` | `farmer` | Physical residue logging with moisture & storage specs |
| `/farmer/listings` | `AppShell` | `MyListings` | `farmer` | Active marketplace listings and pricing manager |
| `/farmer/pickups` | `AppShell` | `FarmerPickups` | `farmer` | 6-stage logistics tracker & weighbridge confirmation |
| `/processor` | `AppShell` | `ProcessorDashboard`| `processor`| Demand overview, matched listings, active fleet status |
| `/processor/marketplace` | `AppShell`| `MarketplaceBrowser`| `processor`| Waste marketplace with distance/moisture filter sliders |
| `/processor/requirements`| `AppShell`| `RequirementManager`| `processor`| Industrial procurement demand RFPs & SLA manager |
| `/processor/matches` | `AppShell` | `MarketplaceBrowser`| `processor`| Spatial AI matchmaker & procurement inquiries |
| `/processor/pickups` | `AppShell` | `ProcessorPickups` | `processor`| Fleet dispatch, driver assignment & weighbridge settlement |
| `/admin` | `AppShell` | `AdminDashboard` | `admin` | National ESG diversion analytics, avoided CO2e metrics |
| `/admin/users` | `AppShell` | `UserManagement` | `admin` | Industrial processor KYC verification & approvals |
| `/admin/pathways` | `AppShell` | `PathwayManager` | `admin` | Waste-to-Value benchmark matrix calibration |
| `/admin/audit` | `AppShell` | `SystemAuditLogs` | `admin` | Real-time system compliance audit trail |

---

## 3. State Management & Authentication (`AuthContext.jsx`)

- **Context Provider**: `AuthProvider` encapsulates user state, JWT token, role helpers (`isFarmer`, `isProcessor`, `isAdmin`), and fallback resilience.
- **Viva 1-Click Role Switcher**:
  - `switchDemoRole('farmer')`: Switches instantly to Ramesh Kumar (Telangana).
  - `switchDemoRole('processor')`: Switches instantly to Priya Reddy (BioEnergy Ltd).
  - `switchDemoRole('admin')`: Switches instantly to Dr. K. Rao (Admin Hub).
- **LocalStorage Sync**: Persists active token and user object across page refreshes.

---

## 4. Navigation Components

### Navbar (`Navbar.jsx`)
- Brand header with glowing leaf icon and gradient text.
- Top-level 1-Click Role Switcher pill for presentations.
- Interactive notification bell with pulsing indicator.
- User profile chip with role badge and logout action.

### Dynamic Multi-Role Sidebar (`Sidebar.jsx`)
- Automatically switches nav menus based on active role (`farmer`, `processor`, `admin`).
- Glowing active-state indicator (`bg-emerald-500/20 text-emerald-300 border border-emerald-500/35`).
- Highlight badges (`AI Core`) on flagship scanner & marketplace tabs.
- Circular economy impact footer box.

---

## 5. Phase 2 Verification Checklist

- [x] Dual-shell architecture (`AppShell` & `PublicShell`) rendering correctly.
- [x] All 18 routes tested and accessible.
- [x] 1-Click Viva Demo Role Switcher fully operational in Navbar and Login page.
- [x] Dynamic multi-role Sidebar switching links and highlight badges.
- [x] Glassmorphism styling with backdrop blur and responsive breakpoints verified.
- [x] Phase 2 documentation signed off.
