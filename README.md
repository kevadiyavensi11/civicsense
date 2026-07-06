# 🏛️ CivicSense — Smart City Governance Platform

<div align="center">

```
 ██████╗██╗██╗   ██╗██╗ ██████╗███████╗███████╗███╗   ██╗███████╗███████╗
██╔════╝██║██║   ██║██║██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝██╔════╝
██║     ██║██║   ██║██║██║     ███████╗█████╗  ██╔██╗ ██║███████╗█████╗
██║     ██║╚██╗ ██╔╝██║██║     ╚════██║██╔══╝  ██║╚██╗██║╚════██║██╔══╝
╚██████╗██║ ╚████╔╝ ██║╚██████╗███████║███████╗██║ ╚████║███████║███████╗
 ╚═════╝╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝
```

**A production-grade Smart City Civic Issue Reporting & Monitoring Platform**

`Angular 21` • `Node.js Express 5` • `MongoDB` • `Google Gemini AI` • `Leaflet.js` • `Firebase`

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Manual Setup](#-manual-setup)
- [Environment Variables](#-environment-variables)
- [User Roles](#-user-roles)
- [Key Features](#-key-features)
- [API Reference](#-api-reference)
- [Project Documents](#-project-documents)
- [Known Limitations](#-known-limitations)

---

## 🌆 Overview

CivicSense allows residents of Surat to **report**, **track**, and get resolution on public
infrastructure problems — potholes, garbage, streetlights, drainage, and more.

Every report goes through:
1. **AI Image Verification** (Google Gemini 1.5 Flash)
2. **Duplicate Detection** (Haversine distance formula)
3. **Geospatial Zone Routing** (MongoDB `$geoIntersects` + OpenStreetMap)
4. **Automatic Authority Assignment** (zone-based officer matching)
5. **Real-time Status Tracking** (IssueStatus audit log + notifications)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CIVICSENSE PLATFORM                       │
├──────────────┬───────────────────┬──────────────────────────┤
│ CITIZEN      │ AUTHORITY         │ ADMIN                    │
│ Port 4202    │ Port 4201         │ Port 4200                │
│ Angular SPA  │ Angular SPA       │ Angular SPA              │
└──────┬───────┴─────────┬─────────┴──────────┬───────────────┘
       │                 │                     │
       └─────────────────┼─────────────────────┘
                         │ REST API (JWT + Firebase)
                         ▼
          ┌──────────────────────────────┐
          │   Node.js / Express 5        │
          │   Backend API — Port 5000    │
          └──────────┬───────────────────┘
                     │
      ┌──────────────┼────────────────────────┐
      ▼              ▼                         ▼
  MongoDB        Cloudinary              Google Gemini
  (Mongoose)     (Image CDN)            (AI Verification)
      │
  Firebase        Nominatim             Nodemailer
  (Auth)         (Geocoding)            (OTP Email)
```

---

## 💻 Tech Stack

| Layer | Technology | Version |
|:---|:---|:---|
| Frontend | Angular (Standalone) | 21.0.4 |
| UI Components | Angular Material (MDC) | 21.x |
| Maps | Leaflet.js | 1.9.4 |
| Charts | ngx-charts | latest |
| Backend | Node.js + Express | 5.2.1 |
| Database | MongoDB + Mongoose | 9.1.2 |
| Auth | JWT + Firebase Admin | jwt v9 |
| AI | Google Gemini 1.5 Flash | latest |
| Media CDN | Cloudinary | 1.41.3 |
| Email | Nodemailer + Gmail SMTP | 7.0.12 |
| OAuth | Google OAuth2, GitHub | — |
| Geocoding | OpenStreetMap Nominatim | free |
| Security | Helmet.js, bcryptjs, CORS | — |

---

## ⚡ Quick Start

### Option 1 — Double Click (Windows, easiest)
```
Double-click:  start-all.bat
```
Opens 4 terminal windows. Angular panels compile in ~60 seconds.

### Option 2 — PowerShell
```powershell
.\start-all.ps1
```

### Option 3 — Make (Git Bash / WSL)
```bash
make install   # First time only
make all       # Start everything
make stop      # Kill all processes
```

### Option 4 — Manual (4 terminals)
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Citizen Panel
cd citizen-panel && ng serve --port 4202

# Terminal 3 — Authority Panel
cd authority-panel && ng serve --port 4201

# Terminal 4 — Admin Panel
cd admin-panel && ng serve --port 4200
```

### Stop All Services
```
Double-click:  stop-all.bat
```
or in PowerShell:
```powershell
Stop-Process -Name node -Force
```

---

## 🔧 Manual Setup

### Step 1 — Install Dependencies
```bash
make install
# or manually:
cd backend        && npm install
cd citizen-panel  && npm install
cd authority-panel && npm install
cd admin-panel    && npm install
```

### Step 2 — Configure Environment
```bash
# Copy the template and fill in your values
cd backend
copy .env.example .env
# Edit .env with your actual keys
```
See [Environment Variables](#-environment-variables) section below.

### Step 3 — Seed the Database
```bash
cd backend
node seedAdmin.js     # Create default admin account
node seed_zones.js    # Create Surat's 7 municipal zones
node seed_areas.js    # Create area/locality data
```

### Step 4 — Verify Backend is Running
```
GET http://localhost:5000/
Expected response: "CivicSense API is running..."
```

---

## 🌍 Environment Variables

Create `backend/.env` with the following:

```env
# Server
PORT=5000
MONGO_URI=mongodb://localhost:27017/civicsense
NODE_ENV=development

# Authentication
JWT_SECRET=<replace-with-256-bit-random-string>

# Cloudinary (required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email / OTP (optional — logs to console if absent)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google Gemini AI (optional — uses simulation if absent)
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** The system gracefully degrades without optional keys.
> Missing email → OTP printed to console.
> Missing Gemini key → keyword-based priority simulation.
> Missing OAuth → social login buttons hidden.

---

## 👥 User Roles

| Role | Panel URL | Access |
|:---|:---|:---|
| **Citizen** | `localhost:4202` | Report issues, track own submissions, receive notifications |
| **Authority** | `localhost:4201` | Manage zone issues, claim tasks, update status with proof |
| **Admin** | `localhost:4200` | Full system access, analytics, user management, zone monitoring |

### Default Dev Accounts

| Role | Email | Password |
|:---|:---|:---|
| Admin | `admin@civicsense.gov` | `adminpassword123` |
| Authority | *(register via form)* | — |
| Citizen | *(register via form)* | — |

---

## ✨ Key Features

### Citizen Panel
- ✅ Multi-step issue reporting form (4 steps: Details → Photo → Location → Submit)
- ✅ AI image verification via Google Gemini 1.5 Flash
- ✅ Government-Grade GPS with 5-reading accuracy averaging
- ✅ Interactive Leaflet.js map with draggable pin + India bounds lock
- ✅ Automatic zone detection (MongoDB `$geoIntersects` + Nominatim + keyword fallback)
- ✅ Haversine-based duplicate detection (10m radius, 5-minute window)
- ✅ Real-time upload progress bar with Cloudinary CDN
- ✅ Issue tracking dashboard with status history
- ✅ Notifications inbox
- ✅ Dark / Light theme toggle (persisted to DB)
- ✅ Google OAuth login
- ✅ OTP-based forgot password flow

### Authority Panel
- ✅ Zone-scoped task dashboard
- ✅ Task claim system (atomic assignment)
- ✅ Issue resolution with proof image upload
- ✅ Complete IssueStatus audit trail
- ✅ Critical alerts view (High/Critical priority filter)
- ✅ Verified issues view (AI-confirmed reports)
- ✅ Resolution history archive
- ✅ GitHub OAuth login

### Admin Panel
- ✅ KPI dashboard (parallel Promise.all DB queries)
- ✅ Monthly trend charts (MongoDB aggregation pipeline)
- ✅ Category & priority distribution charts (ngx-charts)
- ✅ **Live Geo-Spatial Monitoring** (Leaflet + zone overlays + tactical markers)
- ✅ Radar pulse animation on issue focus
- ✅ User management with role control
- ✅ Notification broadcasting (individual / by role / all)
- ✅ Contact messages inbox
- ✅ Zone management

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

| Module | Endpoints |
|:---|:---|
| **Auth/Users** | `POST /users` `POST /users/login` `GET /users/profile` `PUT /users/profile` `POST /users/forgot-password` `POST /users/verify-otp` `POST /users/reset-password` |
| **Issues** | `POST /issues` `GET /issues` `GET /issues/:id` `PUT /issues/:id/status` `PUT /issues/:id/assign` `PUT /issues/bulk` |
| **Geo** | `GET /issues/geocode` `GET /issues/search-location` |
| **Admin** | `GET /admin/dashboard-stats` `GET /admin/analytics` `GET /admin/users` `PUT /admin/users/:id` |
| **Notifications** | `POST /notifications` `GET /notifications` `PUT /notifications/:id/read` |
| **Zones** | `GET /zones` `POST /zones` `PUT /zones/:id` |
| **Upload** | `POST /upload` |
| **Contact** | `POST /contact/create` `GET /contact/all` `DELETE /contact/:id` |

For full API documentation, see [`PROJECT_ENGINEERING_MASTER_FILE.md → Section 13`](./PROJECT_ENGINEERING_MASTER_FILE.md)

---

## 📁 Project Documents

| File | Description |
|:---|:---|
| [`PROJECT_ENGINEERING_MASTER_FILE.md`](./PROJECT_ENGINEERING_MASTER_FILE.md) | Complete 23-section technical blueprint (37+ APIs, 10 algorithms, 7 schemas) |
| [`PRESENTATION_SCRIPT.md`](./PRESENTATION_SCRIPT.md) | Ready-to-speak opening script for viva/demo |
| [`DEMO_WALKTHROUGH_SCRIPT.md`](./DEMO_WALKTHROUGH_SCRIPT.md) | Screen-by-screen live demo narration guide |
| [`VIVA_QA_PREPARATION.md`](./VIVA_QA_PREPARATION.md) | 40 expert Q&A with answers (8 sections + limitations) |
| [`PROJECT_CHART_SHEET.md`](./PROJECT_CHART_SHEET.md) | Architecture and functional overview chart |
| [`Makefile`](./Makefile) | Unix make targets for install/run/stop/clean |
| [`start-all.bat`](./start-all.bat) | Windows: Start all 4 services |
| [`stop-all.bat`](./stop-all.bat) | Windows: Stop all Node.js processes |
| [`start-all.ps1`](./start-all.ps1) | PowerShell: Coloured launcher script |

---

## ⚠️ Known Limitations

| Limitation | Severity | Future Fix |
|:---|:---|:---|
| No real-time updates (no WebSockets) | 🔴 High | Integrate Socket.io for live status push |
| JWT stored in localStorage (XSS risk) | 🔴 High | Move to `httpOnly` cookies |
| No auth endpoint rate limiting | 🔴 High | Add `express-rate-limit` |
| OTPs stored as plaintext | 🟡 Medium | `bcrypt.hash(otp, 8)` before save |
| No automated tests | 🟡 Medium | Jest (backend) + Jasmine (Angular) |
| Helmet.js disabled in dev | 🟡 Medium | Enable before production deploy |
| Nominatim rate limit (1 req/sec) | 🟡 Medium | Replace with Google Maps / MapBox API |
| GPS only (no mobile app offline) | 🟡 Medium | PWA + service worker for draft caching |
| No email verification on registration | 🟡 Medium | Firebase `sendEmailVerification()` |
| Single-city (Surat only) | 🟢 Low | Add `cityId` to all entities |
| No horizontal scaling | 🟢 Low | Docker + Redis adapter for Socket.io |

---

## 📜 License

Built for academic submission — Surat, Gujarat, India — April 2026.
CivicSense is a student project and is not affiliated with the Surat Municipal Corporation.

---

<div align="center">

**Built with ❤️ for Smart City Governance**

`MongoDB` • `Express` • `Angular` • `Node.js` • `Gemini AI` • `Leaflet.js`

</div>
