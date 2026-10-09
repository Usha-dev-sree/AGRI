# AgriValue AI — Phase 1: Architecture Validation, Schema Finalization & UI Design System

> **B.Tech Final Year Major Project**  
> **Status**: Completed & Verified  

---

## 1. System Constraints & Architectural Boundaries

In strict compliance with project guidelines:
- **Zero Hardware / IoT Integration**: 100% software-based solution. No Arduino, ESP32, Raspberry Pi, soil sensors, or microcontrollers.
- **Technology Stack**:
  - **Client**: React 19 + Vite + Tailwind CSS v4 + Recharts + Lucide Icons + Leaflet
  - **Backend Server**: Node.js + Express.js (REST API, JWT, Multer)
  - **Database**: MongoDB (12 Normalized Schemas) with embedded In-Memory Hybrid Fallback
  - **AI Microservice**: Python FastAPI (PyTorch MobileNetV3 CNN + Scikit-Learn Spatial Clustering)
- **User Roles (3 Roles Only)**:
  1. `Farmer`: Waste registration, image scan, marketplace listings, pickup tracking.
  2. `Processor`: Waste browsing, demand posting, spatial matching, logistics dispatch.
  3. `Admin`: System compliance, processor KYC verification, pathway calibration, ESG analytics.

---

## 2. Master Data Schemas (12 MongoDB Collections)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USERS       │───o{  │     FARMS       │───o{  │     CROPS       │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                                                   │
         │ (Profile)                                         │ (Harvest)
         ▼                                                   ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   PROCESSORS    │       │ RECOMMENDATIONS │◄──────│  WASTE REPORTS  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                                                   │
         │ (Demand)                                          │ (List)
         ▼                                                   ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  REQUIREMENTS   │───o{  │     MATCHES     │}o───  │ MARKET LISTINGS │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                   │
                                   │ (Logistics)
                                   ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   AUDIT LOGS    │       │ PICKUP REQUESTS │───o|  │  TRANSACTIONS   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

| Collection | Schema File | Core Fields | Purpose |
| :--- | :--- | :--- | :--- |
| **`users`** | `server/models/User.js` | `name`, `email`, `password`, `role`, `phone`, `location`, `status` | Authentication & role-based access |
| **`farms`** | `server/models/Farm.js` | `farmerId`, `farmName`, `location`, `totalAreaAcres`, `soilType`, `irrigationType` | Farmland geo-profile |
| **`crops`** | `server/models/Crop.js` | `farmerId`, `farmId`, `cropName`, `cropVariety`, `season`, `sowingDate`, `expectedHarvestDate` | Cultivation cycle |
| **`wasteReports`**| `server/models/WasteReport.js`| `farmerId`, `farmId`, `cropId`, `wasteType`, `quantityKg`, `moisturePercent`, `storageCondition`, `imageUrl`, `aiScanResult` | Harvest residue logs |
| **`recommendations`**| `server/models/Recommendation.js`| `wasteReportId`, `farmerId`, `rankedPathways`, `generatedAt` | Explainable value pathways |
| **`pathways`** | `server/models/Pathway.js` | `name`, `category`, `description`, `calorificValueKcalKg`, `typicalPricePerTonINR`, `carbonOffsetFactor` | Reference catalog |
| **`processors`** | `server/models/Processor.js`| `userId`, `companyName`, `businessType`, `gstNumber`, `facilityLocation`, `isVerified` | Buyer profiles |
| **`requirements`**| `server/models/Requirement.js`| `processorId`, `targetWasteTypes`, `minQuantityKg`, `pricePerTonINR`, `maxProcurementRadiusKm` | Demand RFPs |
| **`marketplaceListings`**| `server/models/MarketplaceListing.js`| `farmerId`, `wasteReportId`, `title`, `pricePerTonINR`, `isAiVerified`, `status` | Public marketplace |
| **`matches`** | `server/models/Match.js` | `listingId`, `requirementId`, `matchScore`, `distanceKm`, `status` | Spatial matching |
| **`pickupRequests`**| `server/models/PickupRequest.js`| `matchId`, `scheduledDate`, `vehicleDetails`, `driverDetails`, `currentStage`, `weighbridgeData` | 6-stage logistics |
| **`transactions`**| `server/models/Transaction.js`| `pickupRequestId`, `grossAmountINR`, `netAmountINR`, `paymentStatus`, `invoiceNumber` | Financial ledger |
| **`auditLogs`** | `server/models/AuditLog.js` | `userId`, `action`, `module`, `ipAddress`, `timestamp` | Security compliance |

---

## 3. UI Design System Tokens & Aesthetics

- **Color Palette**:
  - Primary Background: `#070d0a` (Deep agro-slate)
  - Surface Glass: `rgba(16, 26, 21, 0.72)` with `backdrop-filter: blur(14px)`
  - Border Accents: `rgba(52, 211, 153, 0.18)` (Emerald neon shimmer)
  - Primary Action: `Emerald #10b981` & `Neon #34d399`
  - Secondary Accent: `Cyan #06b6d4` & `Blue #3b82f6`
  - Alert / Warning: `Amber #f59e0b` & `Rose #ef4444`
- **Typography**:
  - Headings & Titles: `Outfit`, sans-serif (700 / 800 / 900)
  - UI Labels & Data: `Inter`, sans-serif (400 / 500 / 600)
- **Dynamic Animations**:
  - `laserSweep`: Real-time red/orange laser scanner bar across image upload previews.
  - Hover Micro-Transitions: Subtle glow, 2px elevation, and soft shadows on `.glass-card`.
- **Reusable Core Components**:
  - `Badge` (`client/src/components/common/Badge.jsx`): Multi-color semantic tags.
  - `StatCard` (`client/src/components/common/StatCard.jsx`): Metric cards with trend indicators.
  - `Navbar` (`client/src/components/common/Navbar.jsx`): Glass header with role switcher.
  - `Sidebar` (`client/src/components/common/Sidebar.jsx`): Collapsible multi-role navigation.

---

## 4. Phase 1 Verification Checklist

- [x] Monorepo project structure validated.
- [x] Pure software constraints confirmed (No hardware/IoT dependencies).
- [x] All 12 MongoDB collection schemas coded and mapped.
- [x] Seed script populated with realistic Indian agricultural datasets.
- [x] Design tokens, glassmorphism styles, and typography loaded in frontend.
- [x] Multi-service runner (`start_agrivalue.bat` & root `package.json`) operational.
- [x] Phase 1 documentation signed off for B.Tech project presentation.
