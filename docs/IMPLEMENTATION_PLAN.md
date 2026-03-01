# SafeLift HK — 工地安全智能助手
## Complete Implementation Plan (MVP / Prototype)

---

## 1. Project Overview

**SafeLift HK** is a bilingual (繁體中文 / English) web application (PWA) for construction site safety management, focused on **crane and lifting operations** in Hong Kong. The app leverages AI-powered image analysis to detect on-site hazards, manages equipment assets with certificate tracking, and provides a centralized document management system.

**Strategy:** Web-first PWA → later migrate to native mobile via Capacitor/React Native.

### 1.1 Core Modules

| Module | Description |
|--------|-------------|
| **Hazard Identification** | AI-powered photo analysis for crane/lifting operations |
| **Asset Management** | Equipment profiles, certificate tracking, QR code scanning |
| **Document Management** | Upload, link, and search certificates, reports, and records |

### 1.2 Why PWA First?

- Fastest path to a testable prototype
- Works on any device with a browser (iOS, Android, desktop)
- Camera access, offline support, installable on home screen
- No app store approval delays during MVP phase
- Easy transition to Capacitor for native app wrapper later

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14+ (App Router) + React 18 | SSR, API routes, PWA plugins, large ecosystem |
| **UI Library** | Tailwind CSS + shadcn/ui | Fast prototyping, consistent design system |
| **State** | Zustand + TanStack Query | Lightweight state + server state caching with offline support |
| **Database** | Firebase Firestore | Real-time sync, offline persistence, Asia region support |
| **Storage** | Firebase Cloud Storage | Images, PDFs, encrypted documents |
| **Auth** | Firebase Authentication | Email + phone verification, role-based custom claims |
| **Backend Logic** | Firebase Cloud Functions (Node.js 20) | Image processing triggers, scheduled tasks, PDF generation |
| **AI Vision (Primary)** | Qwen2.5-VL (阿里巴巴) via OpenRouter | Best construction safety benchmark (89.4%), cost-effective, OpenAI-compatible |
| **AI Vision (Fallback)** | GLM-4.6V (智譜AI) | Free Flash tier available, 128K context, OpenAI-compatible |
| **AI Vision (Budget)** | Doubao Vision Lite (字節跳動) | Cheapest paid option (~$0.042/1M tokens), good quality |
| **Camera** | MediaDevices API (native browser) | PWA camera with rear-facing preference |
| **QR Scanning** | html5-qrcode / jsQR | Lightweight, offline-capable QR scanning |
| **PDF Viewer** | react-pdf | Lightweight PDF rendering with offline caching |
| **Image Compression** | Compressorjs | Client-side compression before upload (critical for offline) |
| **Offline** | Workbox + Firestore offline persistence | Service Worker caching, IndexedDB auto-sync |
| **Hosting** | Vercel (frontend) + Firebase (backend) | Global CDN, edge functions, easy CI/CD |
| **i18n** | next-intl | Bilingual support (zh-HK / en) with SSR compatibility |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (PWA)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Hazard   │  │  Asset   │  │ Document │              │
│  │  Module   │  │  Module  │  │  Module  │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                    │
│  ┌────┴──────────────┴──────────────┴────┐              │
│  │         Shared Services Layer          │              │
│  │  (Auth, Camera, QR, Offline Queue)     │              │
│  └───────────────┬───────────────────────┘              │
│                  │                                       │
│  ┌───────────────┴───────────────────────┐              │
│  │     Service Worker (Workbox)           │              │
│  │  - Cache static assets                 │              │
│  │  - Queue offline writes                │              │
│  │  - Background sync                     │              │
│  └───────────────┬───────────────────────┘              │
└──────────────────┼──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │    Firebase Suite    │
        │                      │
        │  ┌────────────────┐  │
        │  │   Firestore    │  │  ← Real-time DB
        │  ├────────────────┤  │
        │  │ Cloud Storage  │  │  ← Photos, PDFs
        │  ├────────────────┤  │
        │  │ Cloud Functions │  │  ← AI processing, alerts
        │  ├────────────────┤  │
        │  │     Auth       │  │  ← User management
        │  └────────────────┘  │
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        │  AI Vision Router    │
        │                      │
        │  主力: Qwen2.5-VL    │  ← 阿里巴巴 via OpenRouter
        │  備用: GLM-4.6V      │  ← 智譜AI
        │  輕量: Doubao Vision  │  ← 字節跳動
        └─────────────────────┘
```

---

## 4. Firestore Database Schema

### 4.1 Collections

```
/users/{userId}
  ├── displayName: string
  ├── email: string
  ├── phone: string
  ├── role: "inspector" | "supervisor" | "admin"
  ├── company: string
  ├── language: "zh-HK" | "en"
  ├── createdAt: timestamp
  └── lastLogin: timestamp

/equipment/{equipmentId}
  ├── equipmentNumber: string          // 設備編號
  ├── licensePlate: string             // 車牌號碼
  ├── type: "lorry-crane" | "tower-crane" | "chain-block" | ...
  ├── model: string                    // 型號
  ├── manufacturer: string
  ├── maxCapacity: number              // 承載能力 (tonnes)
  ├── maxRadius: number                // 最大工作半徑 (meters)
  ├── certExpiryDate: timestamp        // 法定檢驗證書到期日
  ├── lastInspectionDate: timestamp    // 最近檢驗日期
  ├── lastMaintenanceDate: timestamp   // 最近維修保養日期
  ├── status: "active" | "expired" | "maintenance" | "decommissioned"
  ├── qrCode: string                   // QR code data
  ├── projectId: string                // 所屬項目
  ├── createdBy: string (userId)
  ├── createdAt: timestamp
  └── updatedAt: timestamp

/hazardReports/{reportId}
  ├── equipmentId: string (nullable)
  ├── projectId: string
  ├── reportedBy: string (userId)
  ├── reportedAt: timestamp
  ├── location: geopoint               // GPS 位置
  ├── locationName: string             // 工地名稱
  ├── photoUrls: string[]              // 相片 URLs
  ├── aiAnalysis: {                    // AI 分析結果
  │     model: string,
  │     hazards: [{
  │       type: string,
  │       severity: "critical" | "high" | "medium" | "low",
  │       description_zh: string,
  │       description_en: string,
  │       confidence: number,
  │       location: string
  │     }],
  │     sceneContext: string,
  │     analyzedAt: timestamp
  │   }
  ├── confirmedHazards: string[]       // 使用者確認的危害
  ├── status: "draft" | "confirmed" | "resolved" | "archived"
  ├── resolution: string (nullable)
  └── resolvedAt: timestamp (nullable)

/documents/{documentId}
  ├── fileName: string
  ├── fileType: "pdf" | "image" | "certificate" | "inspection-report" | "maintenance-record"
  ├── fileUrl: string                  // Cloud Storage URL
  ├── thumbnailUrl: string
  ├── fileSize: number
  ├── equipmentId: string              // 連結到設備
  ├── relatedReportId: string (nullable)
  ├── expiryDate: timestamp (nullable) // 證書到期日
  ├── tags: string[]
  ├── uploadedBy: string (userId)
  ├── uploadedAt: timestamp
  └── description: string

/maintenanceRecords/{recordId}
  ├── equipmentId: string
  ├── type: "routine" | "repair" | "inspection" | "certification"
  ├── date: timestamp
  ├── performedBy: string
  ├── description: string
  ├── cost: number (nullable)
  ├── documentIds: string[]            // 相關文件
  ├── nextDueDate: timestamp (nullable)
  ├── createdBy: string (userId)
  └── createdAt: timestamp

/alerts/{alertId}
  ├── type: "cert-expiry" | "inspection-due" | "critical-hazard" | "maintenance-due"
  ├── equipmentId: string
  ├── userId: string                   // 通知對象
  ├── title_zh: string
  ├── title_en: string
  ├── message_zh: string
  ├── message_en: string
  ├── dueDate: timestamp
  ├── isRead: boolean
  ├── createdAt: timestamp
  └── priority: "urgent" | "normal" | "info"
```

### 4.2 Firestore Indexes

```
// Equipment queries
equipmentId + certExpiryDate (ascending) → certificate expiry alerts
equipmentId + status → active equipment filtering
licensePlate → search by license plate

// Hazard reports
projectId + reportedAt (descending) → recent reports per project
equipmentId + reportedAt (descending) → reports per equipment
status + reportedAt → filter by status

// Documents
equipmentId + uploadedAt (descending) → documents per equipment
fileType + equipmentId → filter by type per equipment

// Alerts
userId + isRead + createdAt (descending) → unread alerts for user
```

---

## 5. Feature Specifications

### 5.1 Module 1: Hazard Identification 現場危害識別

#### User Flow

```
[Open Camera] → [Take Photo] → [AI Analysis Loading...]
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │  Analysis Results    │
                              │                      │
                              │  🔴 Critical: 1      │
                              │  🟠 High: 2          │
                              │  🟡 Medium: 0        │
                              │                      │
                              │  • 有人站在吊運範圍內  │
                              │    (Person in crane   │
                              │     swing zone)       │
                              │                      │
                              │  • 疑似不當吊索用法    │
                              │    (Suspected improper │
                              │     sling usage)      │
                              │                      │
                              │  [確認危害 Confirm]    │
                              │  [重新拍攝 Retake]     │
                              └─────────────────────┘
                                        │
                                        ▼ (on confirm)
                              ┌─────────────────────┐
                              │  Hazard Record Created│
                              │  日期: 2026-03-01    │
                              │  位置: GPS auto      │
                              │  相片: attached      │
                              │  狀態: confirmed     │
                              └─────────────────────┘
```

#### AI Analysis System Prompt

```
You are a Hong Kong construction site safety inspector specializing
in lifting operations under the Factories and Industrial Undertakings
(Lifting Appliances and Lifting Gear) Regulations (Cap. 59J).

Analyze this photo for the following hazards:

1. ZONE SAFETY: Are any workers standing within the crane swing radius
   or under a suspended load?
2. RIGGING: Are slings/chains showing improper use — knotting,
   excessive angle (>120°), single-leg lift on asymmetric load,
   missing safety latches on hooks?
3. LOAD: Is the load visibly tilted, off-center, or exceeding
   reasonable size for the equipment visible?
4. PPE: Are workers missing hard hats or high-visibility vests?
5. GROUND: Is the crane/equipment on unstable or uneven ground?

For each hazard found, return JSON:
{
  "hazards": [{
    "type": "ZONE_VIOLATION" | "RIGGING_IMPROPER" | "LOAD_UNSAFE" |
             "PPE_MISSING" | "GROUND_UNSTABLE",
    "severity": "critical" | "high" | "medium" | "low",
    "description_en": "...",
    "description_zh": "...",
    "confidence": 0.0-1.0,
    "location_in_image": "top-left" | "center" | etc.,
    "recommended_action_en": "...",
    "recommended_action_zh": "..."
  }],
  "scene_summary_en": "...",
  "scene_summary_zh": "...",
  "overall_risk": "critical" | "high" | "medium" | "low" | "safe"
}

Only report hazards with confidence >= 0.70.
Mark 0.70–0.85 as "requires_verification": true.
```

#### Key Implementation Details

- **Camera**: Use `navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })` for rear camera
- **Image compression**: Compress to 80% quality, max 1.5MB before sending to AI API
- **Offline**: Queue photos in IndexedDB; analyze when connection restored
- **GPS**: Use `navigator.geolocation.getCurrentPosition()` for auto-location tagging
- **AI Model Strategy**: 全中國 AI 模型，多模型自動故障轉移
  - **Primary 主力**: Qwen2.5-VL-72B 阿里巴巴 via OpenRouter (~$0.003/image, ~$9/month for 3,000 images)
  - **Fallback 備用**: GLM-4.6V-Flash 智譜AI (Free) — triggers if primary is unavailable
  - **Critical Review 覆核**: Doubao Vision Pro 字節跳動 (~$0.002/image) — for "critical" severity double-checks
  - All models use OpenAI-compatible API format → switching requires only endpoint/key change
- **Important**: 不使用任何西方 AI API — 全部採用中國 AI 模型，確保香港可用性及合規性

---

### 5.2 Module 2: Asset / Equipment Management 資產設備管理

#### User Flow

```
[Scan QR Code] or [Enter Equipment Number]
              │
              ▼
┌──────────────────────────────────┐
│  設備檔案 Equipment Profile       │
│                                  │
│  🚛 車牌: AB 1234               │
│  📋 編號: LC-2024-0089          │
│  📐 型號: UNIC URW-706          │
│  ⚖️  承載: 6.0 tonnes           │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 證書狀態 Certificate Status │  │
│  │ ✅ 有效 Valid               │  │
│  │ 📅 到期: 2026-09-15        │  │
│  │ ⏰ 198 days remaining       │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 最近保養 Last Maintenance   │  │
│  │ 📅 2026-01-20              │  │
│  │ 🔧 Routine inspection      │  │
│  └────────────────────────────┘  │
│                                  │
│  [📄 Documents] [📊 History]    │
│  [⚠️ Hazard Reports] [✏️ Edit]  │
└──────────────────────────────────┘
```

#### QR Code Implementation

```javascript
// Generate QR code per equipment (stored as SVG or data URL)
// QR payload format:
{
  "app": "safelift",
  "type": "equipment",
  "id": "LC-2024-0089"
}

// Scanning: html5-qrcode library
// Fallback for iOS PWA: manual input with autocomplete search
```

#### Certificate Expiry Alert System

Cloud Function runs daily at 06:00 HKT:

```
For each equipment where certExpiryDate is within:
  - 30 days → "normal" priority alert
  - 14 days → "urgent" priority alert
  - 0 days (expired) → "urgent" + status change to "expired"
  - 7 days before maintenance due → "normal" alert

Alerts sent via:
  - In-app notification (Firestore /alerts collection)
  - Email (via Firebase Extensions / SendGrid)
  - Push notification (via FCM for installed PWA)
```

---

### 5.3 Module 3: Document Management 文件管理

#### User Flow

```
[Upload Document]
      │
      ├── Select file (PDF / Photo)
      ├── Choose type: Certificate / Inspection Report / Maintenance Record
      ├── Link to equipment (search by license plate or equipment number)
      ├── Add expiry date (if certificate)
      ├── Add tags
      └── Upload
              │
              ▼
[Document stored in Cloud Storage]
[Metadata indexed in Firestore]
[Linked to equipment profile]

─────────────────────────────────────

[Search Documents]
      │
      ├── Enter: license plate / equipment number / keyword
      │
      ▼
┌──────────────────────────────────┐
│  搜尋結果 Search Results          │
│                                  │
│  🚛 AB 1234 — UNIC URW-706      │
│                                  │
│  📄 Certificates (2)             │
│    • Form 3 — expires 2026-09-15 │
│    • Operator cert — valid       │
│                                  │
│  🔧 Maintenance Records (5)      │
│    • 2026-01-20 — Routine        │
│    • 2025-11-03 — Hydraulic fix  │
│    • ...                         │
│                                  │
│  ⚠️ Hazard Reports (1)           │
│    • 2026-02-14 — Rigging issue  │
│                                  │
│  📷 Photos (12)                   │
└──────────────────────────────────┘
```

#### Storage Structure

```
/safelift-storage/
  ├── equipment/{equipmentId}/
  │     ├── certificates/
  │     │     └── {documentId}.pdf
  │     ├── maintenance/
  │     │     └── {documentId}.pdf
  │     └── photos/
  │           └── {documentId}.jpg
  ├── hazard-reports/{reportId}/
  │     └── {photoId}.jpg
  └── exports/
        └── {reportId}.pdf
```

---

## 6. UI/UX Design Specifications

### 6.1 Navigation Structure

```
┌─────────────────────────────────────┐
│          SafeLift HK                │
├─────────────────────────────────────┤
│                                     │
│         [Current Module View]       │
│                                     │
├─────────────────────────────────────┤
│  🏠      📷      🏗️      📁      👤 │
│  Home   Hazard  Assets   Docs   Profile│
└─────────────────────────────────────┘
```

### 6.2 Color System

| Usage | Color | Hex |
|-------|-------|-----|
| Primary (Brand) | Safety Orange | `#FF6B00` |
| Critical hazard | Red | `#DC2626` |
| High hazard | Orange | `#EA580C` |
| Medium hazard | Yellow | `#CA8A04` |
| Low hazard | Blue | `#2563EB` |
| Safe / Valid | Green | `#16A34A` |
| Background | Light gray | `#F8FAFC` |
| Text primary | Dark gray | `#1E293B` |

### 6.3 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640–1024px | Two column, side nav |
| Desktop | > 1024px | Three column, sidebar |

### 6.4 Offline Indicator

```
┌─────────────────────────────────────┐
│  ⚡ 離線模式 Offline Mode            │
│  相片將在恢復連線後自動上傳            │
│  Photos will sync when back online   │
└─────────────────────────────────────┘
```

---

## 7. Development Phases & Timeline

### Phase 1: Foundation (Week 1–2)

| Task | Details | Days |
|------|---------|------|
| Project setup | Next.js + TypeScript + Tailwind + ESLint | 1 |
| Firebase setup | Firestore, Storage, Auth, Cloud Functions project | 1 |
| Auth system | Email/phone sign-up, login, role assignment | 2 |
| i18n setup | next-intl with zh-HK and en locale files | 1 |
| PWA config | next-pwa, service worker, manifest.json, icons | 1 |
| UI shell | Bottom nav, layout, theme, offline banner | 2 |
| Database | Firestore security rules, initial schema setup | 1 |

**Deliverable:** Authenticated app shell with bilingual UI, installable as PWA.

### Phase 2: Equipment Module (Week 3–4)

| Task | Details | Days |
|------|---------|------|
| Equipment CRUD | Create, read, update equipment profiles | 3 |
| QR code generation | Generate + print QR codes for each equipment | 1 |
| QR code scanning | html5-qrcode integration, fallback manual input | 2 |
| Equipment detail page | Full profile view with all data | 2 |
| Search | Search by license plate, equipment number, model | 1 |
| Certificate status | Visual indicators (valid/expiring/expired) | 1 |

**Deliverable:** Full equipment management system with QR scanning.

### Phase 3: Document Module (Week 5–6)

| Task | Details | Days |
|------|---------|------|
| File upload | PDF and photo upload to Cloud Storage | 2 |
| Document linking | Associate documents with equipment | 1 |
| PDF viewer | In-app PDF viewing with react-pdf | 2 |
| Image viewer | Photo gallery with zoom and swipe | 1 |
| Document search | Full-text search by equipment, type, tags | 2 |
| Expiry tracking | Certificate expiry date management | 1 |
| Timeline view | Combined history view per equipment | 1 |

**Deliverable:** Complete document management linked to equipment.

### Phase 4: Hazard Detection (Week 7–9)

| Task | Details | Days |
|------|---------|------|
| Camera integration | Rear camera capture with preview | 2 |
| Image compression | Client-side compression before upload | 1 |
| AI Vision integration | Multi-model router (Qwen2.5-VL + GLM-4.6V + Doubao fallback) via Cloud Functions | 3 |
| Analysis results UI | Hazard display with severity badges | 2 |
| Confirm/reject flow | User confirmation of detected hazards | 1 |
| Report generation | Auto-create hazard record with metadata | 2 |
| GPS tagging | Auto-attach location to reports | 1 |
| Offline queue | Queue photos for analysis when reconnected | 2 |

**Deliverable:** AI-powered hazard detection with full reporting.

### Phase 5: Alerts & Polish (Week 10–11)

| Task | Details | Days |
|------|---------|------|
| Alert Cloud Function | Daily cert expiry checks | 2 |
| Notification UI | Alert center with read/unread status | 2 |
| Dashboard | Home screen with stats and recent activity | 2 |
| Push notifications | FCM for installed PWA | 2 |
| Email alerts | SendGrid integration for critical alerts | 1 |
| Error handling | Global error boundaries, retry logic | 1 |

**Deliverable:** Complete notification system and dashboard.

### Phase 6: Testing & Launch (Week 12)

| Task | Details | Days |
|------|---------|------|
| E2E testing | Cypress/Playwright tests for critical flows | 2 |
| Offline testing | Test all offline scenarios | 1 |
| Performance | Lighthouse audit, image optimization | 1 |
| Security review | Firestore rules audit, API key protection | 1 |
| UAT | User acceptance testing with construction team | 2 |
| Deploy | Production deployment to Vercel + Firebase | 1 |

**Deliverable:** Production-ready MVP deployed.

---

## 8. Project Structure

```
safelift-hk/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── locales/
│       ├── zh-HK/
│       │   └── common.json
│       └── en/
│           └── common.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── hazard/
│   │   │   │   ├── page.tsx            # Camera + capture
│   │   │   │   ├── [reportId]/
│   │   │   │   │   └── page.tsx        # Report detail
│   │   │   │   └── history/
│   │   │   │       └── page.tsx        # All reports
│   │   │   ├── equipment/
│   │   │   │   ├── page.tsx            # Equipment list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx        # Add equipment
│   │   │   │   ├── scan/
│   │   │   │   │   └── page.tsx        # QR scanner
│   │   │   │   └── [equipmentId]/
│   │   │   │       └── page.tsx        # Equipment detail
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx            # Document search
│   │   │   │   ├── upload/
│   │   │   │   │   └── page.tsx        # Upload form
│   │   │   │   └── [documentId]/
│   │   │   │       └── page.tsx        # Document viewer
│   │   │   ├── alerts/
│   │   │   │   └── page.tsx            # Alert center
│   │   │   └── profile/
│   │   │       └── page.tsx            # User profile
│   │   └── api/
│   │       └── analyze-image/
│   │           └── route.ts            # AI analysis endpoint
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   └── LanguageToggle.tsx
│   │   ├── hazard/
│   │   │   ├── CameraCapture.tsx
│   │   │   ├── HazardAnalysisResult.tsx
│   │   │   ├── HazardCard.tsx
│   │   │   └── ConfirmHazardDialog.tsx
│   │   ├── equipment/
│   │   │   ├── EquipmentCard.tsx
│   │   │   ├── EquipmentForm.tsx
│   │   │   ├── QRScanner.tsx
│   │   │   ├── CertStatusBadge.tsx
│   │   │   └── EquipmentTimeline.tsx
│   │   └── documents/
│   │       ├── DocumentUpload.tsx
│   │       ├── PDFViewer.tsx
│   │       ├── DocumentCard.tsx
│   │       └── SearchBar.tsx
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── firestore.ts
│   │   │   ├── storage.ts
│   │   │   └── auth.ts
│   │   ├── ai/
│   │   │   ├── vision-router.ts       # Multi-model router (Qwen → GLM → Doubao fallback)
│   │   │   ├── qwen-client.ts         # Qwen2.5-VL via OpenRouter (Primary)
│   │   │   ├── glm-client.ts          # GLM-4.6V via Zhipu AI (Fallback)
│   │   │   ├── doubao-client.ts       # Doubao Vision via Volcano Engine (Budget/Review)
│   │   │   └── prompts.ts             # System prompts (shared across models)
│   │   ├── camera.ts                   # Camera utilities
│   │   ├── compression.ts             # Image compression
│   │   ├── qr.ts                      # QR code utils
│   │   ├── geolocation.ts             # GPS utilities
│   │   └── offline-queue.ts           # Offline sync queue
│   ├── hooks/
│   │   ├── useCamera.ts
│   │   ├── useQRScanner.ts
│   │   ├── useOfflineStatus.ts
│   │   ├── useEquipment.ts
│   │   ├── useHazardReports.ts
│   │   └── useAlerts.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── offlineStore.ts
│   └── types/
│       ├── equipment.ts
│       ├── hazard.ts
│       ├── document.ts
│       └── alert.ts
├── functions/                          # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts
│   │   ├── analyzeImage.ts            # On-upload AI analysis
│   │   ├── certExpiryCheck.ts         # Scheduled daily check
│   │   ├── generateReport.ts          # PDF report generation
│   │   └── sendNotification.ts        # FCM + email
│   ├── package.json
│   └── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── firebase.json
├── firestore.rules
├── storage.rules
└── .env.local                          # API keys (not committed)
```

---

## 9. API Costs & Budget Estimation

### Monthly Cost Projections (MVP Scale)

| Service | Estimate | Basis |
|---------|----------|-------|
| **Qwen2.5-VL 阿里巴巴 (Primary)** | ~$9/mo | 3,000 images via OpenRouter (~$0.003/image) |
| **GLM-4.6V-Flash 智譜AI (Fallback)** | Free | ~500 fallback images (completely free) |
| **Doubao Vision Pro 字節跳動 (Review)** | ~$1/mo | ~50 critical double-checks (~$0.002/image) |
| **Firebase Firestore** | ~$5/mo | 50K reads, 20K writes/day |
| **Cloud Storage** | ~$3/mo | 10GB stored, 5GB transferred |
| **Cloud Functions** | ~$5/mo | 100K invocations |
| **Firebase Auth** | Free | Under 50K monthly users |
| **Vercel Hosting** | Free tier | Pro plan if needed: $20/mo |
| **SendGrid Email** | Free tier | Under 100 emails/day |
| **Total MVP** | **~$23–43/mo** | |

### AI Model Cost Comparison — All Chinese Models (per image, approx.)

| Model | Provider | Input Cost/1M tokens | Cost per Image | Role |
|-------|----------|---------------------|---------------|------|
| **Qwen2.5-VL-72B** | 阿里巴巴 (OpenRouter) | $0.23 | ~$0.003 | Primary 主力 |
| **GLM-4.6V-Flash** | 智譜AI | Free | Free | Fallback 備用 |
| **GLM-4.6V** | 智譜AI | $0.30 | ~$0.004 | Paid upgrade |
| **Doubao Vision Lite** | 字節跳動 | $0.042 | ~$0.001 | Budget 輕量 |
| **Doubao Vision Pro** | 字節跳動 | $0.11 | ~$0.002 | Critical review 覆核 |
| **ERNIE 4.5** | 百度 | $0.55 | ~$0.008 | Future option |
| **Kimi K2.5** | 月之暗面 | $0.60 | ~$0.009 | Future option |

### Scaling Projections

| Users | Images/mo | Estimated Cost |
|-------|-----------|----------------|
| 10 | 1,000 | ~$16/mo |
| 50 | 5,000 | ~$30/mo |
| 200 | 20,000 | ~$75/mo |
| 1,000 | 100,000 | ~$320/mo |

---

## 10. Hong Kong Regulatory Compliance

### Key Requirements Implemented

| Regulation | Implementation |
|-----------|----------------|
| **Cap. 59J — Annual crane inspection** | Certificate expiry tracking, 30-day reminders |
| **Form 2 — Anchoring/Ballasting exam** | Document upload linked to equipment |
| **Form 3 — Crane examination cert** | Certificate storage with expiry alerts |
| **Lifting gear — 6-month inspection** | Separate tracking for slings, chains, hooks |
| **Operator certification** | Operator cert linked to equipment records |
| **On-site record keeping** | Digital copies accessible via QR scan on-site |
| **Pre-operation checklist** | Future feature: digital checklist module |

---

## 11. Security Considerations

### Firestore Security Rules (Summary)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users
    match /equipment/{equipmentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'supervisor'];
    }

    match /hazardReports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null
        && (resource.data.reportedBy == request.auth.uid
            || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'supervisor']);
    }

    match /documents/{documentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### API Key Protection

- All AI API keys (OpenRouter, Zhipu AI, Volcano Engine) stored in Cloud Functions environment variables (never client-side)
- Firebase config uses restricted API keys with domain allowlist
- All AI analysis routed through Cloud Functions (server-side only)
- Multi-model failover: Qwen → GLM-4.6V → Doubao Vision (all Chinese providers)

---

## 12. Future Roadmap (Post-MVP)

### Phase 2 — Enhanced Features (Month 4–6)

- Fine-tune Qwen2-VL on collected construction safety dataset (open-source, MIT license)
- Self-host fine-tuned model to reduce API costs and improve accuracy
- Real-time video analysis integration
- Digital pre-operation checklists
- Team management & multi-project support
- Export reports as PDF with company branding
- Analytics dashboard (hazard trends, equipment utilization)

### Phase 3 — Mobile Native (Month 6–9)

- Wrap PWA with **Capacitor** for iOS/Android app store distribution
- Native camera improvements
- Background location tracking for site check-in/out
- NFC equipment tagging (alternative to QR for iOS)
- Biometric login (Face ID / fingerprint)

### Phase 4 — Enterprise (Month 9–12)

- Multi-tenant architecture for construction companies
- API for integration with existing ERP / safety systems
- Advanced AI: predictive maintenance, trend analysis
- Regulatory auto-updates (when HK regulations change)
- Audit trail and compliance reporting

---

## 13. Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
Firebase CLI installed globally
OpenRouter API key (for Qwen2.5-VL)
Zhipu AI API key (for GLM-4.6V fallback — free tier available)
Volcano Engine API key (for Doubao Vision — optional)
```

### Quick Start

```bash
# 1. Clone the project
cd SafeLift-HK

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your Firebase config, OpenRouter key, Zhipu AI key, and Volcano Engine key

# 4. Start Firebase emulators (for local development)
firebase emulators:start

# 5. Run development server
npm run dev

# 6. Open http://localhost:3000
```

---

## 14. Key Technical Decisions & Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| PWA over native | Next.js PWA | Fastest to prototype, works everywhere, easy to test on construction sites |
| Firebase over custom backend | Firebase | Offline sync built-in, real-time updates, minimal DevOps for MVP |
| All-Chinese AI models | Qwen + GLM + Doubao | No Western API dependency; all providers accessible in HK; best construction safety benchmarks |
| Qwen2.5-VL as primary | Qwen via OpenRouter | Best construction safety benchmark (89.4%), extremely cost-effective, open-source for future fine-tuning |
| Multi-model failover | Qwen → GLM-4.6V → Doubao | No single point of failure; all OpenAI-compatible API format; critical hazards double-checked |
| Firestore over Realtime DB | Firestore | Better querying, offline support, scalable structure |
| next-intl over i18next | next-intl | Better Next.js App Router integration, type-safe translations |
| Zustand over Redux | Zustand | Simpler for MVP, less boilerplate, works well with offline state |

---

*Document Version: 1.1*
*Updated: 2026-03-01 — Revised AI strategy: All-Chinese AI models (Qwen2.5-VL + GLM-4.6V + Doubao Vision)*
*Created: 2026-03-01*
*Project: SafeLift HK — 工地安全智能助手*
