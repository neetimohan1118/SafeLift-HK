# SafeLift HK — 工地安全智能助手

AI-powered construction site safety management for crane and lifting operations in Hong Kong.

## Overview

SafeLift HK is a bilingual (繁體中文 / English) Progressive Web App (PWA) designed for construction site managers, safety officers, and crane operators. The app uses AI-powered image analysis to detect on-site hazards in real-time, manages equipment assets with certificate tracking, and provides centralized document management.

## Features

- **AI Hazard Detection** — Upload or capture site photos for instant AI analysis detecting zone violations, rigging issues, PPE missing, and more
- **Equipment Management** — Track all lifting equipment with certificate expiry monitoring, maintenance records, and QR code scanning
- **Document Center** — Centralized management of certificates, inspection reports, safety training records, and load test documents
- **Alert System** — Real-time notifications for critical hazards, certificate expirations, and maintenance schedules
- **QR Scanner** — Scan equipment QR codes for instant access to equipment profiles
- **PWA Ready** — Installable on any device, works offline

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Lucide Icons |
| PWA | Web Manifest + Service Worker |

## Getting Started

```bash
cd app
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
app/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Dashboard
│   │   ├── hazard/           # AI Hazard Detection
│   │   ├── equipment/        # Equipment List & Detail
│   │   ├── documents/        # Document Management
│   │   ├── alerts/           # Alert Center
│   │   ├── settings/         # User Settings
│   │   ├── scan/             # QR Code Scanner
│   │   └── login/            # Authentication
│   ├── components/
│   │   ├── layout/           # AppShell, Sidebar
│   │   └── ui/               # shadcn/ui components
│   └── lib/
│       ├── mock-data.ts      # Demo data
│       └── utils.ts          # Utilities
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/                # App icons
docs/
├── IMPLEMENTATION_PLAN.md    # Full implementation plan
└── v1.pen                    # Design file
```

## Demo

This is an MVP demo with mock data. All pages are fully functional with:
- Responsive design (desktop sidebar + mobile bottom navigation)
- Bilingual UI (繁體中文 / English)
- Interactive animations and transitions
- Real construction site photo for hazard detection demo

## License

MIT
