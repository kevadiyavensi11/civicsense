# 🏛️ PROJECT ENGINEERING MASTER FILE

---

```
╔══════════════════════════════════════════════════════════════╗
║           CIVICSENSE — SMART CITY GOVERNANCE PLATFORM        ║
║                  PROJECT ENGINEERING MASTER FILE             ║
║                   Version 1.0 | April 2026                   ║
╚══════════════════════════════════════════════════════════════╝
```

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Complete Feature Breakdown](#3-complete-feature-breakdown)
4. [Validation System](#4-validation-system)
5. [Business Logic Flow](#5-business-logic-flow)
6. [Algorithms & Data Logic](#6-algorithms--data-logic)
7. [Function-Level Documentation](#7-function-level-documentation)
8. [Error Handling Strategy](#8-error-handling-strategy)
9. [Edge Case Handling](#9-edge-case-handling)
10. [Security & Best Practices](#10-security--best-practices)
11. [Performance Optimization](#11-performance-optimization)
12. [Database Schema Reference](#12-database-schema-reference)
13. [Complete API Endpoint Reference](#13-complete-api-endpoint-reference)

---

## 1. 🧾 Project Overview

### 1.1 Purpose

CivicSense is a production-grade **Smart City Civic Issue Reporting and Monitoring Platform** built for the **Surat Municipal Corporation (SMC)**. It is a multi-panel, role-based SaaS web application that enables citizens to report, track, and get resolution on public infrastructure issues through an AI-verified, geospatially-routed pipeline.

### 1.2 Core Problem Solved

| Problem | CivicSense Solution |
|:---|:---|
| Citizens have no transparent way to report issues | Multi-step digital reporting form with real-time tracking |
| Authorities manually triage all incoming reports | Priority simulation auto-assigns priority; zone-routing auto-assigns authority |
| Fake or duplicate reports waste resources | Haversine-based duplicate detection |
| No geospatial oversight for city managers | Admin's Live Geo-Spatial Monitoring map with zone-wise issue clustering |
| No accountability after issue submission | Auditable status log (IssueStatus collection) + citizen notifications |

### 1.3 Target Users

| Role | Description | Panel Port |
|:---|:---|:---|
| **Citizen** | Residents of Surat who report civic issues | `localhost:4202` |
| **Authority (Field Officer)** | Municipal officers responsible for resolving issues in their zone | `localhost:4201` |
| **Admin (City Manager)** | Senior managers who oversee system analytics, users, and zones | `localhost:4200` / `localhost:4300` |

### 1.4 High-Level System Workflow

```
┌────────────┐     ①Report      ┌───────────────┐   ②Geocode     ┌──────────────────┐
│  CITIZEN   │ ─────────────── ▶│  Backend API  │ ─────────────▶ │ OpenStreetMap    │
│  (Browser) │                  │  (Express 5)  │                 │ (Nominatim)      │
└────────────┘                  └───────────────┘                 └──────────────────┘
                                        │ ③Zone Resolve                   │
                                        ▼                                  │ ④Location Data
                                ┌───────────────┐   ⑤Auto-assign  ◀───────┘
                                │   MongoDB     │ ─────────────── ▶ ┌──────────────┐
                                │   (Mongoose)  │                   │  AUTHORITY   │
                                └───────────────┘                   │  Dashboard   │
                                        │ ⑥Notification             └──────────────┘
                                        ▼
                                ┌───────────────┐
                                │   CITIZEN     │ (receives update toast)
                                └───────────────┘
```

---

## 2. 🏗 System Architecture

### 2.1 Technology Stack

| Layer | Technology | Version | Purpose |
|:---|:---|:---|:---|
| **Frontend Framework** | Angular | 21.0.4 | Standalone component SPA |
| **UI Component Library** | Angular Material | MDC | Forms, Steppers, Dialogs |
| **Maps** | Leaflet.js | 1.9.4 | Interactive geospatial maps |
| **Charts** | ngx-charts | — | Admin analytics dashboards |
| **Backend Runtime** | Node.js + Express | v5.2.1 | RESTful API server |
| **Database** | MongoDB + Mongoose | v9.1.2 | Document store |
| **Authentication** | JWT + Firebase Auth | jsonwebtoken v9 | Hybrid auth |
| **Media Storage** | Cloudinary | v1.41.3 | Issue & profile images |
| **Email** | Nodemailer + Gmail SMTP | v7.0.12 | OTP delivery |
| **OAuth Providers** | Google OAuth2, GitHub OAuth | — | Social login |
| **Geo Service** | OpenStreetMap / Nominatim | — | Reverse/forward geocoding |
| **Security** | Helmet.js, CORS, Bcrypt | — | HTTP hardening |
| **File Upload** | Multer + multer-storage-cloudinary | — | Multipart form handling |
| **Dev Tools** | Nodemon, Angular CLI | — | Development DX |

### 2.2 Folder Architecture

```
d:\civic\
├── backend\                      # Node.js API server
│   ├── server.js                 # Express entry point
│   ├── .env                      # Environment secrets
│   └── src\
│       ├── config\               # db.js, firebase.js, cloudinary.js
│       ├── controllers\          # Business logic handlers
│       │   ├── userController.js
│       │   ├── issueController.js
│       │   ├── adminController.js
│       │   ├── notificationController.js
│       │   ├── areaController.js
│       │   └── zoneController.js
│       ├── middleware\
│       │   ├── authMiddleware.js  # JWT + Firebase protect + authorize
│       │   └── uploadMiddleware.js
│       ├── models\
│       │   ├── User.js
│       │   ├── Issue.js
│       │   ├── IssueStatus.js
│       │   ├── Zone.js
│       │   ├── Area.js
│       │   ├── Notification.js
│       │   └── ContactMessage.js
│       ├── routes\               # Express routers
│       └── utils\
│           ├── verificationEngine.js   # Priority calculation engine
│           ├── geoService.js           # Nominatim geocoding
│           ├── zoneResolver.js         # Zone lookup logic
│           ├── zoneMapper.js           # In-memory keyword map
│           ├── emailService.js         # Nodemailer OTP sender
│           └── routeValidator.js       # Route-level validator wrapper
│
├── citizen-panel\                # Angular SPA (Port 4202)
│   └── src\app\
│       ├── components\           # 16 standalone components
│       ├── services\             # auth, issue, file-upload, notification
│       ├── guards\               # authGuard, roleGuard
│       ├── interceptors\         # authInterceptor (JWT header injection)
│       ├── models\               # TypeScript interfaces
│       ├── utils\                # geo-utils (isPointInPolygon)
│       └── data\                 # zone-data (static ZONE_BOUNDARIES)
│
├── authority-panel\              # Angular SPA (Port 4201)
└── admin-panel\                  # Angular SPA (Port 4200/4300)
    └── src\app\components\
        ├── dashboard-admin\
        ├── issues\
        ├── users\
        ├── zone-monitoring\      # Live Geo-Spatial Map Command Center
        ├── notifications\
        ├── profile\
        └── contact-messages\
```

---

## 3. 🧩 Complete Feature Breakdown

### MODULE A: Authentication & Identity Management

---

#### Feature A-1: Standard Email/Password Login

| Field | Detail |
|:---|:---|
| **Type** | Core |
| **Description** | Users authenticate with email + password. Backend verifies bcrypt hash and returns a signed 30-day JWT. |
| **Inputs** | `email: String`, `password: String` |
| **Outputs** | `{ _id, name, email, role, token }` |
| **Dependencies** | `bcryptjs`, `jsonwebtoken`, MongoDB User document |
| **Trigger** | Click "Login" button on login form |
| **State Change** | JWT stored in `localStorage('token')`; `BehaviorSubject<User>` emits profile |

**Sub-interactions:**
- Email field loses focus → validates format in real-time
- Password field shows red border if fewer than 6 chars on blur
- "Login" button disabled until both fields are non-empty
- On success: `localStorage.setItem('token', ...)` → `router.navigate(['/citizen/dashboard'])`
- On `401`: Error toast "Invalid credentials"
- On `500`: Error toast "Server Error"

---

#### Feature A-2: Google OAuth Login (Citizen Panel)

| Field | Detail |
|:---|:---|
| **Type** | Secondary |
| **Description** | Citizens can log in using their Google account. Frontend uses Google One-Tap / OAuth redirect. Backend uses `google-auth-library` to exchange code for profile. |
| **Inputs** | Google OAuth2 authorization code |
| **Outputs** | JWT token (redirected via query param `?token=`) |
| **Dependencies** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OAuth2Client` |
| **Trigger** | Click "Sign in with Google" button |
| **Flow** | Frontend → Backend `/api/users/auth/google` → Google Consent → Callback → JWT → Redirect to frontend `?token=<JWT>` → `AuthService.setSession(token)` |

**Account Merge Logic:**
- If email already exists in DB → link `googleId` to existing record (no duplicate)
- If new user → create DB record with `role: 'citizen'`, random Bcrypt password (for schema compliance)

---

#### Feature A-3: GitHub OAuth Login (Authority Panel)

| Field | Detail |
|:---|:---|
| **Type** | Secondary |
| **Description** | Authorities can sign in via GitHub. System checks by `email` first, then by `githubId`. |
| **Inputs** | GitHub authorization `code` from frontend |
| **Outputs** | `{ _id, name, email, role, token }` |
| **Dependencies** | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, GitHub API |
| **Special Logic** | If GitHub profile email is private → fallback to `<login>@github.com` |
| **Default Role** | New GitHub users get `role: 'authority'` |

---

#### Feature A-4: User Registration

| Field | Detail |
|:---|:---|
| **Type** | Core |
| **Inputs** | `name`, `email`, `password`, `phone`, `role`, `area` (if authority) |
| **Outputs** | `{ _id, name, email, role, token }` |
| **Validations** | Unique email check; authority requires valid zone from allowedZones list |
| **Password** | Hashed with `bcrypt.genSalt(10)` before persist |
| **Trigger** | Submit "Register" form |

**Allowed Zones for Authority Registration:**
`North Zone`, `South Zone`, `East Zone`, `West Zone`, `Central Zone`, `South-East Zone`, `South-West Zone`

---

#### Feature A-5: Forgot Password (OTP Flow)

| Field | Detail |
|:---|:---|
| **Type** | Core |
| **Description** | 3-step flow: Request OTP → Verify OTP → Reset Password |
| **Step 1** | POST `/api/users/forgot-password` with `{ email, role }` |
| **Step 2** | POST `/api/users/verify-otp` with `{ email, otp }` |
| **Step 3** | POST `/api/users/reset-password` with `{ email, otp, newPassword }` |
| **OTP Details** | 6-digit numeric code, stored hashed on User doc, expires in **5 minutes** |
| **Role Guard** | Backend verifies `user.role === req.body.role` — cross-panel reset blocked |
| **Email Delivery** | Nodemailer → Gmail SMTP (`EMAIL_USER`, `EMAIL_PASS`) |
| **Mock Mode** | If env vars missing, OTP printed to server console |

---

#### Feature A-6: JWT Session Restoration

| Field | Detail |
|:---|:---|
| **Type** | System |
| **Description** | On app bootstrap, `AuthService` reads `localStorage('token')` and calls `GET /api/users/profile` to restore the session silently. |
| **Loading State** | `loading$ BehaviorSubject` set to `true` until profile resolves — blocks `authGuard` from making premature decisions |
| **On 401/403** | Token cleared from storage, user redirected to `/login` |
| **On Network Error** | Session preserved; user NOT logged out (resilient to intermittent connectivity) |

---

#### Feature A-7: Logout

| Field | Detail |
|:---|:---|
| **Type** | Core |
| **Trigger** | Click sidebar "Logout" button |
| **Actions** | Firebase `signOut()` → `localStorage.clear()` → `BehaviorSubject.next(null)` → `router.navigate(['/login'])` |

---

#### Feature A-8: Profile Management

| Field | Detail |
|:---|:---|
| **Type** | Core |
| **Inputs** | `name`, `phone`, `photoUrl` |
| **Photo Upload** | File selected → `FormData` posted to `POST /api/users/profile/photo` → Multer + Cloudinary storage → CDN URL returned → stored on User doc |
| **Change Password** | `PUT /api/users/change-password` — requires `oldPassword` verified against Bcrypt before replacing |
| **Theme Toggle** | `PUT /api/users/settings` with `{ themePreference: 'dark' | 'light' }` — immediately applies `body.classList.add('dark-theme')` for instant UI update |

---

### MODULE B: Issue Reporting (Citizen)

---

#### Feature B-1: Multi-Step Issue Report Form

The report form uses **Angular Material `MatStepper`** with `[linear]="true"` — steps cannot be skipped.

**Step 1 — Issue Details**

| Field | Validation | Notes |
|:---|:---|:---|
| `title` | Required | Min 5 chars enforced in UX |
| `category` | Required enum | Pothole, Garbage, Streetlight, Water, Traffic, Drainage, Noise, Parking, Signage, Animals, Others |
| `otherCategory`| Required if category = "Others" | Dynamic validator added reactively via `valueChanges` subscription |
| `description` | Required | Min 10 chars in UX |

**Step 2 — Photo Upload**

| Interaction | Detail |
|:---|:---|
| File input | Hidden `<input type="file">` triggered by clicking the upload area |
| Preview | `URL.createObjectURL(file)` shown immediately before upload completes |
| Upload Progress | `HttpEventType.UploadProgress` drives a `MatProgressBar` showing exact `%` |
| Cloudinary Result | On `HttpEventType.Response`, `imageUrl` set to CDN URL; `mediaGroup.patchValue({ imageUrl })` |
| "Next" button | Disabled until `imageUrl` is non-null and `isUploading === false` |
| On Fail | `imageUrl` reset to null; `mediaGroup.patchValue({ imageUrl: '' })` making form invalid again |

**Step 3 — Location (Map)**

| Interaction | Detail |
|:---|:---|
| Leaflet Map Init | Initialized lazily on `selectionChange` to step index 2, with a 100ms `setTimeout` delay for DOM render safety |
| Default View | Centered at Surat City: `[21.1702, 72.8311]`, zoom 13 |
| India Bounds | `maxBounds: [[6.0, 68.0], [37.0, 98.0]]` — pins outside India are rejected silently |
| GPS Accuracy Classes | Accuracy ≤20m = `acc-high`; ≤50m = `acc-medium`; >50m = `acc-low` (CSS badge color) |
| Draggable Marker | On `dragend` → stops GPS watch → calls `updateMarker()` with `source: 'Manual'` |
| Click on Map | Calls `updateMarker(e.latlng.lat, e.latlng.lng, 0, 'Manual')` |
| Zone Dropdown | Populated from `GET /api/zones`; required validator blocks step progression until selected |
| "Outside Limits" | If backend returns `zone: 'Outside Municipal Limits'` → zone field cleared → user must manually pick |
| Address Search | User types → presses Enter or clicks search icon → `GET /api/issues/search-location?query=` → map pans to result |

**Step 4 — Confirm & Submit**

| Interaction | Detail |
|:---|:---|
| Review Card | Shows thumbnail, category, calculated priority, "Verified Details" badge |
| Validation Overlay | Full-screen dark overlay with spinner and animated text during backend processing |
| Submit Disabled | While `isValidating === true` |
| On Success | Shows alert with priority result → delays 1s → navigates to `/citizen/dashboard` |
| On Error `DUPLICATE_REPORT` | Specific alert: "Duplicate Issue Detected..." |

---

#### Feature B-2: Smart GPS Engine (Government-Grade)

This is a custom multi-reading GPS averaging system implemented directly in the component.

| Property | Value |
|:---|:---|
| Mode | `watchPosition` with `enableHighAccuracy: true`, 10s timeout |
| Required Readings | 5 consecutive GPS positions collected |
| Averaging | Mean of all collected `lat` and `lng` values |
| Early Lock | If accuracy ≤ 20m before 5 readings, GPS watch cleared immediately |
| Fallback | If `watchPosition` fails → `getCurrentPosition` with `enableHighAccuracy: false` |
| Hard Fail | If both fail → uses last available reading or tells user to click map |
| Battery Save | GPS watch is cleared (`clearWatch`) after stable lock achieved |

---

#### Feature B-3: My Issues (Citizen Dashboard)

| Field | Detail |
|:---|:---|
| **Type** | Core |
| **Description** | Citizen sees their own submitted issues in a timeline/list view |
| **Query Logic** | Backend filters by `[createdById, reportedBy, createdByCitizenId, createdByEmail]` using `$or` for backward compatibility |
| **Sorting** | Default: `createdAt desc` |
| **Pagination** | `page=1&limit=10` default |
| **Status Chips** | Color-coded: Open=blue, In Progress=amber, Resolved=green, Rejected=red |

---

### MODULE C: Authority Panel

---

#### Feature C-1: Authority Task Dashboard

| Field | Detail |
|:---|:---|
| **Type** | Core |
| **Description** | Shows all issues in the authority's assigned zone OR directly assigned to them |
| **Query** | `{ $or: [{ zone: user.zone }, { jurisdictionArea: user.zone }, { assignedAuthorityId: user._id }] }` |
| **Pagination** | Page/Limit controls |
| **Filters** | By status, search by title/description |
| **Action** | "Claim Task" button → `PUT /api/issues/:id/assign` (no body required — authority claims own ID) |

---

#### Feature C-2: Issue Status Update (Resolution Workflow)

| Field | Detail |
|:---|:---|
| **Type** | Core |
| **Inputs** | `status` (In Progress / Resolved / Rejected), `remarks`, optional `resolutionImageUrl` |
| **Side Effects** | Creates `IssueStatus` log document; triggers Notification to citizen |
| **Auto-move** | Assigning an issue via `assignIssue` auto-sets `status = 'In Progress'` |
| **Bulk Update** | `PUT /api/issues/bulk` — Admin/Authority can update multiple issues simultaneously |

---

### MODULE D: Admin Panel

---

#### Feature D-1: Dashboard Analytics

| Metric | Data Source | Chart Type |
|:---|:---|:---|
| Total Issues | `Issue.countDocuments()` | KPI Card |
| Total Users | `User.countDocuments()` | KPI Card |
| Total Notifications | `Notification.countDocuments()` | KPI Card |
| Total Messages | `ContactMessage.countDocuments()` | KPI Card |
| Monthly Trends | `$dateToString: "%b %Y"` aggregation (6 months) | Line Chart |
| Category Distribution | `$group by category` | Pie/Donut Chart |
| Priority Distribution | `$group by priority` | Bar Chart |
| Status Distribution | `$group by status` | Bar Chart |
| Recent Activity | Latest 10 issues with `reportedBy` populated | Activity Feed |

---

#### Feature D-2: Live Geo-Spatial Monitoring

| Sub-Feature | Detail |
|:---|:---|
| **Map Engine** | Leaflet.js with `dark_all` / `light_all` CartoDB basemap tiles |
| **Zone Overlays** | 7 rectangular zone polygons with color-coded borders and permanent zone-name tooltips |
| **Issue Markers** | `L.circleMarker` per issue, colored by priority (Red=High, Amber=Medium, Green=Low), styled with CSS `tactical-signal` class |
| **Radar Animation** | When a row is clicked, a `radar-pulse` `L.divIcon` is placed at coordinates then removed after 4s |
| **Map Fly** | `map.flyTo([lat, lng], 17)` with 1.5s easeLinear animation on row click |
| **Issue Stream Table** | Below the map — shows all issues from `adminService.getIssues(1, 200)`, scrollable with 400px max-height |
| **Filters** | "Pending Only" toggle → filters `status=Open`; "Critical Only" toggle → client-side `priority === 'Critical' \|\| 'High'` |
| **Temporal Filter** | Select: Full Archive / T-24 Hours / Archive 7D — passed to API query |
| **Theme Adaptive** | Map tiles switch between dark/light based on `document.body.classList.contains('dark-theme')` |

---

#### Feature D-3: User Management

| Action | Endpoint | Details |
|:---|:---|:---|
| List Users | `GET /api/admin/users?page&limit&search&role&sortBy&order` | Paginated, searchable by name/email |
| Get User Details | `GET /api/admin/users/:id` | Password field excluded via `.select('-password')` |
| Update User | `PUT /api/admin/users/:id` | Can change `role` and `isActive` status |
| Delete User | `DELETE /api/users/:id` | Admin only |

---

#### Feature D-4: Notification Broadcasting

| Feature | Detail |
|:---|:---|
| **Send to Individual** | By `recipientId` or `recipientEmail` (email auto-resolved to ID) |
| **Broadcast by Role** | `recipientRole: 'citizen' \| 'authority' \| 'admin' \| 'all'` |
| **Types** | `info`, `alert`, `warning`, `success` |
| **Read/Unread** | `isRead` boolean; `PUT /api/notifications/:id/read` — only direct recipient can mark their own |
| **Sent Inbox** | Admin can view sent notifications via `GET /api/notifications/sent` |

---

#### Feature D-5: Zone Management

| Action | Detail |
|:---|:---|
| List Zones | `GET /api/zones` — used by Citizen Panel dropdown |
| Create Zone | `POST /api/zones` — requires `zoneName`, `localities[]`, optional `geoPolygon` |
| Zone Geospatial | MongoDB `2dsphere` index enables `$geoIntersects` queries for point-in-polygon matching |

---

#### Feature D-6: Contact Messages Inbox

| Field | Detail |
|:---|:---|
| **Source** | Citizens can submit a contact form (`POST /api/contact`) |
| **Admin View** | `GET /api/contact/admin/messages` — lists all messages |
| **Fields** | `name`, `email`, `subject`, `message`, `timestamp` |

---

## 4. ✅ Validation System

### 4.A — Frontend Validations (Angular Reactive Forms)

#### Registration Form
| Field | Validator | Error Message |
|:---|:---|:---|
| `name` | `Validators.required` | "Name is required" |
| `email` | `Validators.required`, `Validators.email` | "Valid email required" |
| `password` | `Validators.required`, `minLength(6)` | "Minimum 6 characters" |
| `role` | Required selection | — |
| `area` | Required if role = authority | "Zone assignment required for authorities" |

#### Issue Report Form
| Field | Validator | Notes |
|:---|:---|:---|
| `title` | `Validators.required` | Min 5 chars recommended in placeholder |
| `category` | `Validators.required` | MatSelect enum |
| `otherCategory`| Dynamically added `Validators.required` | Only when `category = 'Others'` |
| `description` | `Validators.required` | Free text |
| `imageUrl` | `Validators.required` on `mediaGroup` | Set programmatically on upload success |
| `zone` | `Validators.required` on `locationGroup` | "Next" button disabled until zone selected |

#### Real-Time UX Behaviors
- Angular Material `<mat-error>` elements revealed on `touched && invalid`
- MatStepper `[linear]="true"` — cannot advance unless `stepControl.valid`
- Upload area dims visually (`disabled` class) while upload is in progress
- GPS "Use GPS" button shows spinner overlay (`isUploading` flag shared from GPS state)
- Image preview renders from `URL.createObjectURL()` before network upload completes

---

### 4.B — Backend Validations (Node.js / Mongoose)

#### User Registration
```
✓ email uniqueness check:        User.findOne({ email })
✓ Authority zone validity:       validZones.includes(area)
✓ Password hashing before save:  bcrypt.genSalt(10) + bcrypt.hash()
✓ Role allowlist enforcement:    ['citizen', 'authority', 'admin'].includes(role)
```

#### Issue Creation
```
✓ Zone existence:                Zone.findOne({ zoneName: zone }) — 400 if not found
✓ Duplicate report prevention:  Haversine < 10m + same category + < 5 minutes → 409
✓ Location source validation:   ['GPS','Manual','Wi-Fi/IP'].includes(source) or default 'GPS'
✓ Image URL required:            Checked via Mongoose required:true on issueSchema.imageUrl
```

#### Password Reset
```
✓ Email existence:               User.findOne({ email }) — 404 if not found
✓ Role panel match:              user.role !== targetRole → 403 (cross-panel reset blocked)
✓ Role presence enforced:        Missing role in request body → 400
✓ OTP expiry:                    user.otpExpires < Date.now() → 400 "expired OTP"
✓ OTP match:                     user.otp !== otp → 400 "Invalid OTP"
```

#### Notification Creation
```
✓ Title + message required:      Missing either → 400
✓ Email → ID resolution:         User.findOne({ email }) — 404 if email not registered
```

---

### 4.C — Security Validations

#### JWT Authentication Chain
```
1. HTTP Request arrives
2. authMiddleware extracts `Authorization: Bearer <token>`
3. jwt.verify(token, JWT_SECRET) attempted
   → If valid JWT: User.findById(decoded.id) → attach req.user → next()
   → If JWT fails (any reason): fall through to step 4
4. If Firebase enabled: admin.auth().verifyIdToken(token)
   → If valid Firebase: User.findOne({ email: decodedToken.email }) → next()
5. Both fail → 401 "Not authorized, token failed"
6. No bearer token → 401 "No authorization token provided"
```

#### Role-Based Access Control (RBAC)
```javascript
// authorize middleware usage:
router.get('/stats', protect, authorize('admin'), ...)
router.put('/:id/assign', protect, authorize('admin', 'authority'), ...)
router.post('/', protect, ...)  // Any authenticated role

// If role not in allowed list:
// → 403 "Access Denied: You do not have permission"
// + console.warn with email + role for audit
```

#### CORS Policy
```javascript
// server.js
cors({
  origin: [
    'http://localhost:4300',
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:4202'
  ],
  credentials: true
})
```

#### Security Headers
```javascript
// Helmet.js applied (currently commented in dev):
// Sets: Content-Security-Policy, X-Frame-Options, X-XSS-Protection,
//       X-Content-Type-Options, Referrer-Policy, HSTS
app.use(helmet()); // Enable in production
```

#### NoSQL Injection Prevention
- Mongoose sanitizes query inputs via schema type enforcement
- All user-provided values are passed through Mongoose `.findOne({ email })` — not raw string interpolated into queries
- RegEx used in admin search: `{ $regex: search, $options: 'i' }` — no user-constructed operators

#### HTTP Interceptor (Frontend Token Injection)
```typescript
// auth.interceptor.ts — Angular functional interceptor
// Reads token from localStorage directly (avoids DI circular dependency with AuthService)
// Clones every outbound request and appends: Authorization: Bearer <token>
// SSR-safe: Only runs in browser context via isPlatformBrowser()
```

---

## 5. 🧠 Business Logic Flow

### 5.1 — Issue Reporting Pipeline (Full Detail)

```
CITIZEN submits form
        │
        ▼
[FE] Zone validated (non-empty) ──── NO ──▶ Alert "Please select a zone"
        │ YES
        ▼
[FE] isValidating = true (overlay shown)
        │
        ▼
[FE] POST /api/issues { title, description, category, imageUrl, location, zone }
        │
        ▼
[BE] protect middleware → JWT verified → req.user set
        │
        ▼
[BE] Zone validation: Zone.findOne({ zoneName: zone })
        ├── NOT FOUND → 400 "Invalid Zone: <zone>"
        └── FOUND → effectiveZone = zone.zoneName
                │
                ▼
        [BE] Duplicate Detection (only if source !== 'Manual')
             ├─ Issue.find({ reportedBy: req.user._id, createdAt: { $gte: 5mins ago } })
             ├─ For each: Haversine distance to new issue
             ├─ Same category AND distance < 10m → 409 "DUPLICATE_REPORT"
             └─ Not duplicate → continue
                    │
                    ▼
            [BE] Priority Calculation: analyzeIssue(category)
                 ├─ simulateAnalysis(category) based on keywords
                 │           → { verified, priority, priorityLevel, remarks }
                    │
                    ▼
            [BE] Reverse Geocode: getAddressFromCoordinates(lat, lng)
                 ├─ Nominatim API call (1200ms delay for rate-limiting)
                 └─ On fail → fallback { fullAddress: "GPS: lat, lng", locality: "Unmapped" }
                    │
                    ▼
            [BE] Authority Auto-Routing:
                 User.findOne({ role: 'authority', zone: effectiveZone, isActive: true })
                 ├─ FOUND → authorityId = authority._id
                 └─ NOT FOUND → authorityId = null (unassigned)
                    │
                    ▼
            [BE] Issue.create({...all fields, systemVerified, priority, authorityId})
                    │
                    ▼
            [BE] IssueStatus.create({ status: 'Open', remarks: 'Reported by citizen' })
                    │
                    ▼
            [BE] IF authorityId: Notification.create({ recipient: authorityId, type: 'alert' })
                    │
                    ▼
            [BE] 201 response with full Issue document
                    │
                    ▼
[FE] isValidating = false
[FE] verificationResult captured from response
[FE] Alert: "✅ Issue submitted! Priority: <X>"
[FE] setTimeout 1s → router.navigate(['/citizen/dashboard'])
```

---

### 5.2 — Issue Resolution Workflow (Authority)

```
Authority logs in → Sees task in zone dashboard
        │
        ▼
Authority clicks "Claim Task" (if not yet assigned)
        │
POST /api/issues/:id/assign
  │ [BE] issue.assignedAuthorityId = req.user._id
  │ [BE] issue.status = 'In Progress'
  │ [BE] IssueStatus.create({ status: 'In Progress', remarks: 'Task assigned to <name>' })
  │ [BE] Notification.create({ recipient: admin, title: 'New Task Assigned' }) [if admin assigned]
        │
        ▼
Authority goes to site, fixes issue, photographs resolution
        │
        ▼
PUT /api/issues/:id/status { status: 'Resolved', remarks: '...', resolutionImageUrl: '...' }
  │ [BE] issue.status = 'Resolved'
  │ [BE] issue.resolutionImageUrl = resolutionImageUrl (optional)
  │ [BE] IssueStatus.create({ status: 'Resolved', remarks: '...' })
  │ [BE] Notification.create({ recipient: issue.reportedBy, type: 'success',
  │                            message: "Your issue '...' has been marked Resolved" })
        │
        ▼
Citizen sees notification on next poll/load
Issue appears as "Resolved" in My Issues list with green chip
```

---

### 5.3 — Zone Resolution Decision Tree

```
GPS coordinates received
        │
        ▼
Step 1: resolveZoneFromCoords(lat, lng)
        │── MongoDB $geoIntersects query against Zone.geoPolygon
        │── Zone FOUND? → return zoneName ✓
        └── Zone NOT FOUND → Step 2
                │
                ▼
        Step 2: resolveZone(locality, city)
                │── Extract words from locality (>3 chars)
                │── Zone.findOne({ localities: { $in: [regex per word] } })
                │── DB Zone FOUND? → return zoneName ✓
                └── DB Zone NOT FOUND → Step 3
                        │
                        ▼
                Step 3: GENERIC_KEYWORD_MAP lookup
                        │── Check if locality includes: 'varachha', 'katargam', etc.
                        │── KEYWORD MATCH? → return zoneName ✓
                        └── No match → return null
                                │
                                ▼
                        Backend returns zone: 'Outside Municipal Limits'
                        Frontend clears zone field, shows user warning popup
```

---

### 5.4 — Session Restoration State Machine

```
App Bootstrap
        │
        ▼
Is localStorage.token present?
        ├── YES: loading$ = true → GET /api/users/profile
        │           ├── 200: userProfileSubject.next(profile) → loading$ = false
        │           ├── 401/403: token removed → loading$ = false
        │           └── Network Error: session preserved → loading$ = false
        └── NO: loading$ = false immediately
                │
                ▼
authGuard taps: loading$.pipe(filter(!loading), take(1), switchMap → user$)
        ├── user$ has value AND role === 'citizen' → route admitted
        └── user$ is null → router.navigate(['/login'])
```

---

### 5.5 — Theme Toggle Logic

```
User clicks theme icon
        │
        ▼
AuthService.toggleTheme()
        │── Read currentUser.themePreference (default: 'light')
        │── newTheme = opposite
        │── OPTIMISTIC: applyTheme(newTheme) immediately
        │    └── body.classList.toggle('dark-theme')
        │── PUT /api/users/settings { themePreference: newTheme }
        │    ├── SUCCESS: persisted for next session restore
        │    └── FAILURE: applyTheme(currentTheme) — revert optimistic update
```

---

## 6. 🔁 Algorithms & Data Logic

### Algorithm 6.1: Haversine Distance Formula (Duplicate Detection)

**Purpose:** Measure the spherical distance in metres between two GPS coordinate pairs to detect duplicate issue reports from the same citizen.

**Use Case in Project:** `createIssue` controller — if an issue of the same category was reported by the same user within the last 5 minutes at a location < 10m away, the new submission is rejected with `409 DUPLICATE_REPORT`.

**Implementation:**
```javascript
const R = 6371e3; // Earth radius in metres
const φ1 = existing.location.lat * Math.PI / 180;
const φ2 = location.lat * Math.PI / 180;
const Δφ = (location.lat - existing.location.lat) * Math.PI / 180;
const Δλ = (location.lng - existing.location.lng) * Math.PI / 180;

const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distance = R * c; // metres
```

**Step-by-step:**
1. Convert all lat/lng from degrees to radians
2. Compute deltas (Δφ, Δλ)
3. Compute Haversine intermediate value `a`
4. Compute central angle `c` using `atan2`
5. Multiply by Earth radius

**Threshold:** `distance < 10` (meters)

| Complexity | Value |
|:---|:---|
| Time | O(n) where n = recent issues in last 5 min |
| Space | O(n) for `recentIssues` array |

---

### Algorithm 6.2: Priority Simulation Engine

**Purpose:** Classify issue priority deterministically from the category keyword.

```javascript
// Priority mapping by category keywords
Critical (98-100%): traffic, fire, accident, collapse, danger, flood
High     (90-97%):  pothole, sewage, drainage, water, waste, garbage
Medium   (75-89%):  light, sign, park, bench, tree
Low      (60-70%):  all others
```

**Step-by-step:**
1. Lowercase the `category` string
2. Test against regex patterns (Critical > High > Medium > Low)
3. Generate a random score within the priority's range using `Math.floor(Math.random() * (max - min) + min)`
4. Return `{ verified: true, priorityLevel: score, priority, remarks }`

| Complexity | Value |
|:---|:---|
| Time | O(1) |
| Space | O(1) |

---

### Algorithm 6.3: GPS Multi-Reading Averaging

**Purpose:** Improve GPS location accuracy by collecting multiple readings and averaging them, preventing outlier positions from being used.

```
REQUIRED_READINGS = 5

readings[] ← []
ON each watchPosition callback:
    readings.push({ lat, lng })
    UPDATE accuracy status badge
    IF readings.length >= 5:
        avgLat = SUM(readings.lat) / 5
        avgLng = SUM(readings.lng) / 5
        updateMarker(avgLat, avgLng)
        IF accuracy <= 20m: stopGPS() + Lock
    ELSE:
        updateMarker(latest reading) [interim visual update]
```

| Complexity | Value |
|:---|:---|
| Time | O(k) per reading, O(1) for averaging |
| Space | O(k) where k = REQUIRED_READINGS = 5 |

---

### Algorithm 6.4: Zone Resolution (Two-Stage Lookup)

**Stage 1 — Geospatial (MongoDB `$geoIntersects`):**
- Uses GeoJSON Polygon stored on Zone document
- `2dsphere` index enables sub-millisecond point-in-polygon queries
- **Time Complexity:** O(log n) with index

**Stage 2 — Text Fuzzy Match:**
```
locality → lowercase → split on whitespace/commas → filter words > 3 chars
FOR each word:
    regex = new RegExp(word, 'i')
    Zone.findOne({ localities: { $in: [regex] } })
```
- **Time Complexity:** O(w × z) where w = words in locality, z = zones in DB
- Falls back to in-memory keyword map: O(k) where k = map size (12 entries)

---

### Algorithm 6.5: Server-Side Pagination

```
page = parseInt(req.query.page) || 1
limit = parseInt(req.query.limit) || 10
skip = (page - 1) * limit

Result = Collection.find(query).sort().skip(skip).limit(limit)
total = Collection.countDocuments(query)
pages = Math.ceil(total / limit)

Response: { issues, total, page, pages }
```

| Complexity | Value |
|:---|:---|
| Time | O(log n + limit) with index, O(n) without |
| Space | O(limit) for result set |

---

### Algorithm 6.6: Admin Analytics Aggregation (MongoDB Pipeline)

Used in `getDashboardStats` and `getComplaintAnalytics`:

```javascript
// Monthly Trends (Last 6 months)
[
  { $match: { createdAt: { $gte: sixMonthsAgo } } },
  { $group: {
      _id: { $dateToString: { format: "%b %Y", date: "$createdAt" } },
      count: { $sum: 1 },
      sortOrder: { $min: "$createdAt" }
  }},
  { $sort: { sortOrder: 1 } }
]

// Category Distribution
[{ $group: { _id: "$category", count: { $sum: 1 } } }]

// Priority Distribution
[{ $group: { _id: "$priority", count: { $sum: 1 } } }]
```

Outputs are mapped to `{ name: string, value: number }` format for ngx-charts.

---

### Algorithm 6.7: Reverse Geocoding with Rate Limiting

**Service:** OpenStreetMap Nominatim (free tier)

```
RULE: Max 1 request/second (Nominatim ToS)

getAddressFromCoordinates(lat, lng):
    WAIT 1200ms  ← artificial delay enforced before every call
    GET https://nominatim.openstreetmap.org/reverse?format=json&lat=&lon=&addressdetails=1
    HEADERS: { User-Agent: 'CivicSense-Platform/1.0 (admin@civicsense.gov.in)' }
    
    Parse response:
        locality = suburb || neighbourhood || residential || quarter || locality
        city     = city || town || municipality || 'Surat'
        state    = state || 'Gujarat'
        pincode  = postcode || ''
    
    ON FAIL → return fallback object (issue creation NOT blocked)
```

---

## 7. 🔧 Function-Level Documentation

### `generateToken(id: string): string`
- **Purpose:** Create a signed JWT for a user session
- **Params:** `id: string` — MongoDB ObjectId as string
- **Returns:** `string` — JWT signed with `JWT_SECRET`, expires in 30 days
- **Algorithm:** `jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })`
- **Called By:** `loginUser`, `registerUser`, `updateProfile`, `githubLogin`, `handleGoogleCallback`

---

### `protect(req, res, next): middleware`
- **Purpose:** Gate all private routes behind authentication
- **Logic:**
  1. Extract token from `Authorization: Bearer <token>`
  2. Try `jwt.verify(token, JWT_SECRET)` → look up user by `decoded.id`
  3. Try Firebase `admin.auth().verifyIdToken(token)` (if `firebaseEnabled`)
  4. Both fail → `401`
- **Attaches:** `req.user` = full Mongoose User document (password excluded via `.select('-password')`)
- **Pseudocode:**
```
IF no Bearer header → 401
TRY:
  decoded = jwt.verify(token)
  req.user = User.findById(decoded.id)
  IF req.user → NEXT()
  IF !req.user → 401 "User not found"
CATCH jwt error:
  IF firebaseEnabled: try Firebase verify
  ELSE → 401
```

---

### `authorize(...roles): middleware factory`
- **Purpose:** RBAC gate applied after `protect`
- **Params:** `...roles: string[]` — allowed roles e.g. `'admin'`, `'authority'`
- **Logic:** `if (!roles.includes(req.user.role)) → 403`
- **Side Effect:** Logs attempted unauthorized access to console with email and role for audit trail

---

### `analyzeIssue(category): Promise<VerificationResult>`
- **Purpose:** Priority scoring
- **Params:** `category: string`
- **Returns:** `{ verified: boolean, priorityLevel: number, priority: string, category: string, remarks: string }`
- **Internal Logic:**
  1. Calls `simulateAnalysis(category)`
- **Pseudocode:**
```
RETURN simulateAnalysis(category)
```

---

### `getAddressFromCoordinates(lat, lng): Promise<LocationObject>`
- **Purpose:** Reverse-geocode GPS coordinates to a human-readable address
- **Params:** `lat: number`, `lng: number`
- **Returns:** `{ fullAddress, locality, city, state, pincode, lat, lng }`
- **Rate Limiting:** 1200ms artificial delay before every HTTP call
- **On Error:** Returns safe fallback object — issue creation is never blocked

---

### `resolveZone(locality, city): Promise<string|null>`
- **Purpose:** Map a locality name to a municipal zone
- **Step 1:** Regex DB match against `Zone.localities[]`
- **Step 2:** In-memory keyword map (12 entries for Surat localities)
- **Returns:** `zoneName: string` or `null`

---

### `resolveZoneFromCoords(lat, lng): Promise<string|null>`
- **Purpose:** Precise geospatial zone lookup using MongoDB `$geoIntersects`
- **Requires:** Zone documents to have `geoPolygon` field with valid GeoJSON
- **Returns:** `zoneName: string` or `null`

---

### `startSmartGPS() [Frontend Component Method]`
- **Purpose:** Initiate multi-reading GPS averaging for accurate location pinning
- **Sets:** `isUploading = true` (spinner shown), `gpsReadings = []`
- **Uses:** `navigator.geolocation.watchPosition` with high accuracy mode
- **On Success (after 5 readings):** Calls `updateMarker(avgLat, avgLng, accuracy, 'GPS')`
- **On Failure:** Falls back to `getCurrentPosition` with low accuracy; on total fail, shows inline message (no blocking alert)
- **Battery optimization:** GPS watch cleared after stable lock acquired

---

### `updateMarker(lat, lng, accuracy, source) [Frontend]`
- **Purpose:** Update the Leaflet map marker and trigger backend geocode + zone detection
- **India Bounds Guard:** Rejects coordinates outside `lat: 6-37, lng: 68-98`
- **Side Effects:** 
  - `locationGroup.patchValue({ lat, lng, accuracy, source })`
  - API call to `GET /api/issues/geocode?lat=&lng=` 
  - Zone auto-patched from response (unless `zoneManuallySet = true`)
  - Marker popup updated with zone name and address

---

### `sendEmail(to, subject, text): Promise<boolean>`
- **Purpose:** Deliver OTP emails via Gmail SMTP
- **Mock Mode:** If `EMAIL_USER` or `EMAIL_PASS` env vars are missing, logs OTP to console and returns `true`
- **Production:** Uses Nodemailer with Gmail transporter; returns `true` on success, `false` on error (never throws — caller handles false return)

---

## 8. ⚠️ Error Handling Strategy

### 8.1 — Client-Side (Angular)

| Scenario | Handling |
|:---|:---|
| Login fails (401) | `AuthService.handleError()` maps `err.error.message` to toast |
| Firebase error codes | Switch/case on `err.code` (e.g. `auth/wrong-password`) → user-friendly string |
| Image upload fails | `isUploading = false`; `mediaGroup.imageUrl = ''` making form invalid; `alert('Upload failed')` |
| GPS fails | Non-blocking inline `locationStatus` message; no alert popup |
| Form submit `DUPLICATE_REPORT` | Custom error message distinguishing duplicate from general failure |
| Network timeout | `AuthService` catchError: preserves session if non-401 error |
| API 500 | Generic "Server Error" toast |
| Unauthorized route access | `roleGuard` → redirects to `/unauthorized` component |
| Token expired (401 on profile load) | `localStorage.removeItem('token')` → redirect to `/login` |

---

### 8.2 — Server-Side (Express)

| HTTP Code | Scenario | Response Body |
|:---|:---|:---|
| `400` | Missing required field / invalid zone / invalid OTP | `{ message: 'descriptive message' }` |
| `401` | Invalid or missing JWT / wrong password | `{ message: 'Invalid credentials' }` |
| `403` | Role mismatch / access denied | `{ message: 'Access Denied: ...' }` |
| `404` | User/Issue/Zone not found | `{ message: 'X not found' }` |
| `409` | Duplicate issue report detected | `{ message: '...', code: 'DUPLICATE_REPORT' }` |
| `500` | Unhandled exception in try/catch | `{ message: 'Server Error' }` |

All route handlers wrap logic in `try-catch`. Errors are logged with `console.error()` before returning 500.

---

### 8.3 — Priority Evaluation Guarantee

```
1. Primary:   simulateAnalysis(category) — keyword-based scoring
2. Guarantee: analyzeIssue() NEVER throws — always returns a result
              → Issue creation NEVER fails due to priority evaluation error
```

---

### 8.4 — Geo Service Fallback Chain

```
1. Primary:   Nominatim reverse geocode API
2. Fallback:  { fullAddress: "GPS: lat, lng", locality: "Unmapped", city: "Unknown" }
3. Guarantee: getAddressFromCoordinates() NEVER throws
              → Issue creation NEVER fails due to geo service unavailability
```

---

### 8.5 — Retry Mechanisms

| Operation | Retry? | Detail |
|:---|:---|:---|
| GPS Acquisition | Yes | `watchPosition` → `getCurrentPosition` (2-level) |
| Nominatim | No | Immediate fallback object |
| Email OTP | No | Returns `false`; caller returns 500 to client |
| Cloudinary Upload | No | User must re-select the file |

---

## 9. 🧪 Edge Case Handling

### Input Edge Cases

| Scenario | Handling |
|:---|:---|
| Category = "Others" but `otherCategory` is empty | Dynamic validator added on `valueChanges`; form stays invalid |
| Zone = "Others" with zone not in DB | Backend `Zone.findOne()` returns null → 400 "Invalid Zone" |
| User uploads non-image file | Multer/Cloudinary `allowed_formats: ['jpg','png','jpeg']` rejects at upload stage |
| Title/Description with XSS payload | Stored as plain string in MongoDB; rendered via Angular's default `{{ }}` interpolation (auto-escapes HTML entities) |
| Coordinates exactly at India boundary | `lat < 6.0 \|\| lat > 37.0 \|\| lng < 68.0 \|\| lng > 98.0` → `updateMarker()` returns silently; user must adjust pin |
| "Outside Municipal Limits" zone returned | Frontend: zone field cleared, user forced to manually pick zone |
| Empty locality returned from Nominatim | Falls through all three zone resolution stages → zone = null → user must manually select |

### Auth Edge Cases

| Scenario | Handling |
|:---|:---|
| Token still in localStorage but user deleted from DB | `protect()` does `User.findById()` → user is null → 401 "User not found. Session expired." |
| Expired JWT | `jwt.verify()` throws → falls through to Firebase; if also fails → 401 |
| Google login with existing email (no googleId) | `googleId` merged onto existing record; no duplicate user created |
| GitHub private email | Fallback: `<github_login>@github.com` used as email |
| OTP requested twice | Second request overwrites `otp` and resets `otpExpires` to +5 minutes |
| OTP verified then password NOT reset | `otp` and `otpExpires` remain on user document until next reset or new OTP request |
| Concurrent login from two devices | Both get valid JWTs; no session invalidation (stateless JWT design) |
| Authority panel reset for citizen email | Role validation: `user.role !== 'authority'` → 403 "Invalid credentials for this panel" |

### Data Edge Cases

| Scenario | Handling |
|:---|:---|
| Issue with `priorityLevel = 0` | `getIssueById` scans `IssueStatus` remarks with regex to recover score from log text |
| Issue with no `fullAddress` | `getIssueById` attempts live reverse geocode and saves result back (auto-heal cache) |
| Issue with `locality = 'Unknown'` or `'Unmapped'` | Same auto-heal logic in `getIssueById` |
| Zone boundary removed from DB | Existing issues retain zone string (legacy field `jurisdictionArea` maintained for backward compat) |
| Admin bulk update with empty `issueIds` array | Backend: `!Array.isArray(issueIds) \|\| issueIds.length === 0` → 400 |
| Notification to non-existent email | `User.findOne({ email })` → 404 "Recipient not found" |
| Zones not loaded from API in report form | `loadZones()` fallback: `ZONE_BOUNDARIES.map(z => ({ zoneName: z.name }))` static data |
| Map `#map` div not rendered yet | `initMap()` called with 100ms `setTimeout` on step change |
| GPS `PERMISSION_DENIED` | `handleGPSError()` → status: "GPS Failed - Click map to set location" |
| GPS `POSITION_UNAVAILABLE` | Same handler; if partial readings exist, last known used |

### Performance Edge Cases

| Scenario | Handling |
|:---|:---|
| Admin loads with 10,000+ issues | `getIssues(1, 200)` cap on zone monitoring; pagination on all list endpoints |
| Same issue clicked multiple times rapidly | `focusGlow` marker replaced (`map.removeLayer`) before new one placed |
| Multiple GPS callbacks before average ready | Interim marker updates on every reading; final update on 5th |
| Nominatim called on every marker drag | Current: no debounce (technical debt); should add 500ms debounce in production |
| localStorage not available (incognito/SSR) | `isPlatformBrowser(platformId)` guard wraps all storage operations |

---

## 10. 🔐 Security & Best Practices

### 10.1 — Authentication Flow (Production-Grade Hybrid)

```
Standard Auth:  Email → bcrypt.compare() → jwt.sign(30d) → localStorage
Social Auth:    Google OAuth2 / GitHub OAuth → Profile fetch → DB upsert → jwt.sign()
Firebase Auth:  Firebase ID token (legacy flow) → admin.auth().verifyIdToken()
```

### 10.2 — Token Management

| Property | Value |
|:---|:---|
| Algorithm | HS256 (HMAC-SHA256) |
| Expiry | 30 days |
| Storage | `localStorage` (XSS risk mitigated by Angular auto-escaping and CSP in prod) |
| Transmission | HTTP header `Authorization: Bearer <token>` |
| Invalidation | Stateless — no server-side revocation; logout is client-side only |
| Secret | `process.env.JWT_SECRET` (production) / `'dev_secret_123'` (dev fallback — must change in prod) |

### 10.3 — Password Security

```
Algorithm:  Bcrypt
Salt Rounds: 10 (auto-generate via bcrypt.genSalt(10))
Comparison:  bcrypt.compare(plaintext, stored_hash)
Never stored/logged: raw password removed from all response objects
OAuth users:  crypto.randomBytes(16).toString('hex') stored (unreachable by user)
```

### 10.4 — API Security Layers

| Layer | Implementation |
|:---|:---|
| Authentication | `protect` middleware on all private routes |
| Authorization | `authorize(...roles)` guards admin/authority-specific endpoints |
| CORS | Whitelist-only: 4 specific localhost origins |
| Security Headers | Helmet.js (configured but commented in dev — **must enable in prod**) |
| Input Validation | Mongoose schema types enforce data integrity |
| Upload Security | Multer `allowed_formats` restricts file types |
| Error Hiding | Production 500 errors return generic "Server Error" (no stack traces) |

### 10.5 — Data Protection

| Data | Protection |
|:---|:---|
| Passwords | Never returned in API responses (`.select('-password')`) |
| Phone Numbers | Only accessible by own profile or admin |
| OTP | Stored in plain text on User doc (should be hashed in production) |
| Images | Stored on Cloudinary CDN with unique URL paths |
| API Keys | Stored in `.env` file (never committed to source control) |
| Firebase Service Account | `serviceAccountKey.json` — must be in `.gitignore` |

### 10.6 — Production Security Checklist

- [ ] Enable `app.use(helmet())` in `server.js`
- [ ] Replace `JWT_SECRET` dev fallback `'dev_secret_123'` with 256-bit random secret
- [ ] Replace `'secret123'` fallback in `generateToken()` 
- [ ] Hash OTP before storing (currently plaintext)
- [ ] Add `express-rate-limit` to prevent brute force on `/api/users/login` and `/api/users/forgot-password`
- [ ] Restrict CORS origins to production domain
- [ ] Enforce HTTPS via reverse proxy (Nginx) with HSTS
- [ ] Add `express-validator` library for comprehensive input sanitization
- [ ] Move from `localStorage` to `httpOnly` cookies for token storage

---

## 11. ⚡ Performance Optimization

### 11.1 — Frontend

| Optimization | Implementation |
|:---|:---|
| **Lazy Loading** | `profile`, `change-password`, `notifications`, `unauthorized` all use `loadComponent(() => import(...))` — not in initial bundle |
| **Standalone Components** | No NgModule overhead; tree-shaking per component |
| **OnPush Change Detection** | `ChangeDetectorRef.detectChanges()` used manually in upload component for controlled re-renders |
| **Map Lazy Init** | Leaflet map initialized only on step 2 activation (not on page load) |
| **GPS Watch Clear** | GPS sensor freed immediately after stable lock (battery/CPU) |
| **Image Preview** | `createObjectURL()` for instant local preview before network upload completes (UX optimization) |
| **Angular Signals / BehaviorSubject** | `user$` and `loading$` as reactive streams — no polling |

### 11.2 — Backend

| Optimization | Implementation |
|:---|:---|
| **DB Indexing** | `email` (unique), `reportedBy` (index), `createdById` (index), `createdByEmail` (index), `jurisdictionArea` (index) on Issues |
| **Geospatial Index** | `2dsphere` on `Area.centerLocation`, `Area.boundary`, `Zone.geoPolygon` for O(log n) geo queries |
| **Compound Index** | `{ areaName: 1, city: 1 }` on Area (unique) |
| **Notification Index** | `{ recipient: 1, recipientRole: 1, createdAt: -1 }` for fast inbox queries |
| **`Promise.all()`** | Dashboard stats uses `Promise.all([totalIssues, totalUsers, totalNotifications, totalMessages])` for parallel DB queries |
| **Pagination** | All list endpoints support `page` + `limit`; never return unbounded results |
| **JSON Mode** | Gemini API called with `responseMimeType: 'application/json'` — eliminates parsing fallback overhead |
| **Nominatim Rate Limit** | 1200ms delay prevents API bans (free tier compliance) |
| **Address Caching** | `getIssueById()` saves resolved addresses back to DB — subsequent loads skip geocode API |

### 11.3 — Database Query Optimization

| Query | Strategy |
|:---|:---|
| `Issue.find({ status, zone })` | Covered by `[status, zone]` compound index (implicit via Mongoose) |
| `User.findOne({ email })` | Covered by `email: unique` index |
| `Zone.findOne({ geoPolygon: { $geoIntersects } })` | Covered by `2dsphere` index |
| `Notification.find({ recipient, recipientRole })` | Covered by compound notification index |
| Admin analytics | MongoDB `$group` aggregation with `$match` filter — efficient on indexed `createdAt` |

---

## 12. 📊 Database Schema Reference

### 12.1 — User Collection

```javascript
{
  name:           String (required),
  email:          String (required, unique, indexed),
  password:       String (optional — null for OAuth users),
  phone:          String (optional),
  role:           Enum ['citizen', 'authority', 'admin'] (default: 'citizen'),
  photoUrl:       String,
  area:           String (authority sub-area, optional),
  state:          String,
  city:           String,
  zone:           String ('North Zone', 'South Zone', etc.),
  isActive:       Boolean (default: true),
  googleId:       String (unique, sparse — allows null for multiple users),
  githubId:       String (unique, sparse),
  otp:            String (6-digit, expires),
  otpExpires:     Date,
  themePreference: String ('light' | 'dark'),
  emailNotificationPreference: Boolean,
  languagePreference: String,
  createdAt:      Date (auto),
  updatedAt:      Date (auto)
}
```

---

### 12.2 — Issue Collection

```javascript
{
  title:          String (required),
  description:    String (required),
  category:       String (required),
  imageUrl:       String (required — Cloudinary CDN URL),
  location: {
    lat:          Number (required),
    lng:          Number (required),
    fullAddress:  String,
    state:        String,
    city:         String,
    locality:     String,
    pincode:      String,
    accuracy:     Number (GPS accuracy in metres),
    source:       Enum ['GPS', 'Manual', 'Wi-Fi/IP'] (default: 'GPS')
  },
  zone:           String ('North Zone', etc.),
  jurisdictionArea: String (legacy alias for zone, indexed),
  authorityId:    ObjectId → ref: 'User' (auto-assigned on create),
  assignedTo:     ObjectId → ref: 'User' (legacy),
  assignedAuthorityId: ObjectId → ref: 'User' (current, indexed),
  priority:       Enum ['Low', 'Medium', 'High', 'Critical'] (default: 'Medium'),
  status:         Enum ['Open', 'In Progress', 'Resolved', 'Rejected'] (default: 'Open'),
  systemVerified: Boolean (default: false),
  priorityLevel:  Number (0-100, calculated confidence score),
  verificationRemarks: String,
  resolutionImageUrl: String (uploaded by authority on resolution),
  reportedBy:     ObjectId → ref: 'User' (required, indexed),
  createdById:    String (req.user._id.toString(), indexed),
  createdByCitizenId: String (legacy alias),
  createdByRole:  String (default: 'CITIZEN'),
  createdByEmail: String (indexed, used for citizen query),
  createdAt:      Date (auto),
  updatedAt:      Date (auto)
}
```

---

### 12.3 — IssueStatus Collection (Audit Log)

```javascript
{
  issueId:    ObjectId → ref: 'Issue' (required),
  status:     String (required),
  updatedBy:  ObjectId → ref: 'User' (required),
  remarks:    String,
  timestamp:  Date (default: Date.now)
}
```

Every status change (Open, In Progress, Resolved, Rejected) produces a new document. This creates a full audit trail.

---

### 12.4 — Notification Collection

```javascript
{
  recipient:    ObjectId → ref: 'User' (null for broadcasts),
  recipientRole: Enum ['citizen', 'authority', 'admin', 'all'] (null for direct),
  sender:       ObjectId → ref: 'User' (required),
  title:        String (required),
  message:      String (required),
  type:         Enum ['info', 'alert', 'warning', 'success'] (default: 'info'),
  isRead:       Boolean (default: false),
  createdAt:    Date (default: Date.now),
  
  // Compound Index:
  // { recipient: 1, recipientRole: 1, createdAt: -1 }
}
```

---

### 12.5 — Zone Collection

```javascript
{
  zoneName:   String (required, unique),   // 'North Zone', 'South Zone', etc.
  state:      String (default: 'Gujarat'),
  city:       String (default: 'Surat'),
  localities: [String],                    // ['Varachha', 'Kapodra', ...]
  geoPolygon: {                            // Optional GeoJSON
    type:        'Polygon',
    coordinates: [[[Number]]]              // [[[lng,lat], [lng,lat], ...]]
  },
  // Index: { geoPolygon: '2dsphere' }
}
```

---

### 12.6 — Area Collection

```javascript
{
  areaName:   String (required, trim),
  zoneId:     ObjectId → ref: 'Zone' (required),
  city:       String (default: 'Surat'),
  state:      String (default: 'Gujarat'),
  pincode:    String,
  centerLocation: {
    type:        'Point',
    coordinates: [Number]   // [longitude, latitude]
  },
  boundary: {              // Optional polygon for precise matching
    type:        'Polygon',
    coordinates: [[[Number]]]
  },
  // Indexes: { areaName:1, city:1 } unique, centerLocation '2dsphere', boundary '2dsphere'
}
```

---

## 13. 📡 Complete API Endpoint Reference

### Base URL: `http://localhost:5000/api`

---

### Authentication & Users (`/users`)

| Method | Endpoint | Auth | Role | Description |
|:---|:---|:---|:---|:---|
| `POST` | `/users` | ❌ | — | Register new user |
| `POST` | `/users/login` | ❌ | — | Email/password login |
| `GET` | `/users/auth/google` | ❌ | — | Initiate Google OAuth |
| `GET` | `/users/auth/google/callback` | ❌ | — | Google OAuth callback |
| `POST` | `/users/github-login` | ❌ | — | GitHub login with code |
| `POST` | `/users/forgot-password` | ❌ | — | Send OTP to email |
| `POST` | `/users/verify-otp` | ❌ | — | Verify 6-digit OTP |
| `POST` | `/users/reset-password` | ❌ | — | Reset password with OTP |
| `GET` | `/users/profile` | ✅ | any | Get own profile |
| `PUT` | `/users/profile` | ✅ | any | Update name/phone/photoUrl |
| `POST` | `/users/profile/photo` | ✅ | any | Upload avatar (multipart) |
| `PUT` | `/users/change-password` | ✅ | any | Change password (requires old) |
| `PUT` | `/users/settings` | ✅ | any | Update theme/language prefs |
| `GET` | `/users` | ✅ | admin | List all users |
| `PUT` | `/users/:id` | ✅ | admin | Update user (role/area) |
| `DELETE` | `/users/:id` | ✅ | admin | Delete user |

---

### Issues (`/issues`)

| Method | Endpoint | Auth | Role | Description |
|:---|:---|:---|:---|:---|
| `POST` | `/issues` | ✅ | any | Create new issue (citizen) |
| `GET` | `/issues` | ✅ | any | Get issues (role-filtered, paginated) |
| `GET` | `/issues/:id` | ✅ | any | Get single issue (with auto-heal) |
| `DELETE` | `/issues/:id` | ✅ | admin | Delete issue |
| `PUT` | `/issues/:id/status` | ✅ | admin, authority | Update issue status |
| `PATCH` | `/issues/:id/status` | ✅ | admin, authority | Update issue status (patch) |
| `PUT` | `/issues/:id/assign` | ✅ | admin, authority | Assign issue to authority |
| `PATCH` | `/issues/:id/assign` | ✅ | admin, authority | Assign issue (patch) |
| `PUT` | `/issues/bulk` | ✅ | admin, authority | Bulk update statuses |
| `GET` | `/issues/geocode` | ✅ | any | Reverse geocode coords to address+zone |
| `GET` | `/issues/search-location` | ✅ | any | Forward geocode address to coords+zone |

**Query Params for `GET /issues`:**
`?status=Open&page=1&limit=10&search=pothole&sortBy=createdAt&order=desc`

---

### Admin (`/admin`)

| Method | Endpoint | Auth | Role | Description |
|:---|:---|:---|:---|:---|
| `GET` | `/admin/stats` | ✅ | admin | Legacy stats endpoint |
| `GET` | `/admin/dashboard-stats` | ✅ | admin | Dashboard KPIs + chart data |
| `GET` | `/admin/analytics` | ✅ | admin | Detailed complaint analytics |
| `GET` | `/admin/users` | ✅ | admin | Paginated user list with filter/sort |
| `GET` | `/admin/users/:id` | ✅ | admin | Single user details |
| `PUT` | `/admin/users/:id` | ✅ | admin | Update user status or role |

---

### Notifications (`/notifications`)

| Method | Endpoint | Auth | Role | Description |
|:---|:---|:---|:---|:---|
| `POST` | `/notifications` | ✅ | admin, authority | Send notification to user/role |
| `GET` | `/notifications` | ✅ | any | Get my notifications (direct + broadcast) |
| `GET` | `/notifications/sent` | ✅ | any | Get notifications I sent |
| `PUT` | `/notifications/:id/read` | ✅ | any | Mark notification as read |

---

### Zones (`/zones`)

| Method | Endpoint | Auth | Role | Description |
|:---|:---|:---|:---|:---|
| `GET` | `/zones` | ✅ | any | List all zones |
| `POST` | `/zones` | ✅ | admin | Create zone |
| `PUT` | `/zones/:id` | ✅ | admin | Update zone |
| `DELETE` | `/zones/:id` | ✅ | admin | Delete zone |

---

### Areas (`/areas`)

| Method | Endpoint | Auth | Role | Description |
|:---|:---|:---|:---|:---|
| `GET` | `/areas` | ✅ | any | List all areas |
| `POST` | `/areas` | ✅ | admin | Create area |

---

### Upload (`/upload`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/upload` | ✅ | Upload issue image to Cloudinary → return `{ url }` |

---

### Contact (`/contact`, `/citizen/contact`)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/contact` | ❌ | Submit contact message |
| `GET` | `/contact/admin/messages` | ✅ admin | Read all contact messages |

---

---

## 14. 🧩 Authority Panel — Detailed Feature & Route Breakdown

The Authority Panel runs on **`localhost:4201`** and is a separate Angular SPA (identical Angular version, different routing configuration). It shares the same backend API but scopes all queries to the authority's assigned zone.

### 14.1 — Route Map

| Path | Component | Load Strategy | Description |
|:---|:---|:---|:---|
| `/` | `LandingComponent` | Eager | Public landing page |
| `/login` | `LoginComponent` | Eager | Authority login (GitHub OAuth supported) |
| `/register` | `RegisterComponent` | Eager | Authority registration (zone required) |
| `/authority/home` | `AuthorityHomeComponent` | **Lazy** | Home / quick stats page |
| `/authority/dashboard` | `DashboardAuthorityComponent` | Eager | Main tasks + map dashboard |
| `/authority/task-queue` | `TaskQueueComponent` | **Lazy** | Full unfiltered task queue |
| `/authority/assigned-tasks` | `AssignedTasksComponent` | **Lazy** | Only tasks assigned to self |
| `/authority/verified-issues` | `VerifiedIssuesComponent` | **Lazy** | System-verified issues view (also `/reports`) |
| `/authority/critical-alerts` | `CriticalAlertsComponent` | **Lazy** | Priority = Critical or High |
| `/authority/resolution-history` | `ResolutionHistoryComponent` | **Lazy** | Resolved issues log |
| `/authority/issues/:id` | `AuthorityIssueDetailComponent` | **Lazy** | Issue detail with resolve/reject actions |
| `/authority/notifications` | `NotificationsComponent` | Eager | Inbox |
| `/authority/profile` | `ProfileComponent` | **Lazy** | Profile + avatar upload |
| `/authority/settings` | `AuthoritySettingsComponent` | **Lazy** | Theme, email, language preferences |
| `/authority/change-password` | `AuthorityChangePasswordComponent` | **Lazy** | Password change form |
| `/unauthorized` | `UnauthorizedComponent` | **Lazy** | Access denied page |

All `/authority/*` paths are protected by `authGuard` + `roleGuard(['authority'])`.

---

### 14.2 — Authority Guard Chain

```
Route request for /authority/dashboard
        │
        ▼
authGuard:
    loading$.pipe(filter(!loading), take(1))
        └── switchMap → user$, take(1)
                ├── user exists AND role === 'citizen' → ALLOW (note: guard checks citizen role)
                └── no user → redirect /login

roleGuard(['authority']):
    loading$.pipe(filter(!loading), take(1))
        └── switchMap → user$, take(1)
                ├── no user → redirect /login
                ├── user.role === 'authority' → ALLOW ✓
                ├── user.role === 'citizen' → redirect /citizen/dashboard
                ├── user.role === 'admin' → redirect /admin/dashboard
                └── unknown role → redirect /login
```

> **Note:** The `authGuard` and `roleGuard` both wait for `loading$` to be `false` before evaluating user state. This prevents a race condition where the guard fires before the JWT session is restored from `localStorage`.

---

### 14.3 — Authority Panel Feature Details

#### Feature: Task Queue (`/authority/task-queue`)
- Fetches `GET /api/issues` — backend automatically scopes to authority's zone via `req.user.zone`
- Displays all Issues with `status = Open` or `In Progress` in the authority's zone
- Table columns: Title, Category, Zone, Priority, Status, Date, Actions
- Actions per row: "View Detail" → navigates to `/authority/issues/:id`

#### Feature: Assigned Tasks (`/authority/assigned-tasks`)
- Same endpoint but backend condition: `{ assignedAuthorityId: req.user._id }`
- Shows only tasks explicitly claimed or assigned to this officer

#### Feature: Critical Alerts (`/authority/critical-alerts`)
- Filters issues by `priority = 'Critical' OR 'High'`
- Priority badges color-coded: Critical = red + glow, High = orange

#### Feature: Verified Issues (`/authority/verified-issues` and `/authority/reports`)
- Both routes load the same `VerifiedIssuesComponent`
- Shows issues where `systemVerified = true`
- Calculated confidence score (`priorityLevel`) shown as a progress bar

#### Feature: Resolution History (`/authority/resolution-history`)
- Issues where `status = 'Resolved'` and `assignedAuthorityId = current user._id`
- Shows resolution date, remarks, and optional before/after images

#### Feature: Authority Issue Detail (`/authority/issues/:id`)
- Full detail view with:
  - Issue metadata (title, category, description, location)
  - GPS map pin of the reported location
  - System verification badge and confidence score
  - Evidence image (uploaded by citizen)
  - Status update form: Status dropdown + Remarks textarea + Optional resolution image upload
  - Status history log from `IssueStatus` collection
- Actions available: **Claim**, **Mark In Progress**, **Resolve**, **Reject**

#### Feature: Authority Settings (`/authority/settings`)
- `PUT /api/users/settings` with `{ themePreference, emailNotificationPreference, languagePreference }`
- Real-time theme toggle via `AuthService.toggleTheme()` with optimistic UI update + backend sync

---

## 15. 🔧 Frontend Services Documentation

### 15.1 — `AuthService` (Citizen & Authority Panels)

| Method | HTTP | Endpoint | Purpose |
|:---|:---|:---|:---|
| `login(email, password)` | `POST` | `/users/login` | Credential auth, stores JWT |
| `register(email, password, userData)` | Firebase + `POST` | `/users` | Creates Firebase + DB user |
| `logout()` | — | Firebase `signOut()` | Clears storage, redirects |
| `loginWithGoogle(token)` | `POST` | `/users/google-login` | Google token exchange |
| `forgotPassword(email)` | `POST` | `/users/forgot-password` | OTP request (role: 'citizen') |
| `verifyOtp(email, otp)` | `POST` | `/users/verify-otp` | OTP verification |
| `resetPassword(email, otp, newPassword)` | `POST` | `/users/reset-password` | Password replacement |
| `updateProfile(data)` | `PUT` | `/users/profile` | Name/phone/photo update |
| `uploadAvatar(file)` | `POST` | `/users/profile/photo` | Multipart photo upload |
| `changePassword(passwords)` | `PUT` | `/users/change-password` | Old+new password change |
| `updateSettings(settings)` | `PUT` | `/users/settings` | Theme/language preferences |
| `toggleTheme()` | `PUT` | `/users/settings` | Optimistic toggle + backend sync |
| `getToken()` | — | localStorage or Firebase | JWT retrieval for interceptor |
| `setSession(token)` | — | localStorage | Store token from OAuth redirect |

**State managed:**
```typescript
userProfileSubject: BehaviorSubject<User | null>
user$: Observable<User | null>           // Public stream for guards + components
loading$: BehaviorSubject<boolean>       // Session restore in-progress flag
currentUserValue: User | null            // Synchronous snapshot
```

---

### 15.2 — `IssueService` (Citizen Panel)

| Method | HTTP | Endpoint | Notes |
|:---|:---|:---|:---|
| `getIssues(status?, limit, page)` | `GET` | `/issues` | Auto-scoped by role (backend). Returns `issues[]` from `{ issues, total, page }` |
| `reportIssue(issueData)` | `POST` | `/issues` | Full issue payload |
| `getIssueById(id)` | `GET` | `/issues/:id` | With address auto-heal |
| `updateStatus(id, status, remarks)` | `PATCH` | `/issues/:id` | Authority-only |
| `getZones()` | `GET` | `/zones` | Zone list for dropdown |
| `reverseGeocode(lat, lng)` | `GET` | `/issues/geocode` | Backend Nominatim proxy |
| `searchLocation(query)` | `GET` | `/issues/search-location` | Forward geocode |

**Mock Mode:** All methods check `environment.useMockData`. If `true`, they return `of(mockData)` instead of making HTTP calls. This enables offline development without a running backend.

---

### 15.3 — `FileUploadService` (Citizen Panel)

```typescript
upload(file: File): Observable<HttpEvent<any>>
```
- Builds a `FormData` with `file` appended under the key `'image'`
- Posts to `POST /api/upload` with `reportProgress: true` and `observe: 'events'`
- Emits `HttpEventType.UploadProgress` (drives progress bar) and `HttpEventType.Response` (contains `{ url: string }`)
- Returns the Cloudinary CDN URL for storage in `mediaGroup.imageUrl`

---

### 15.4 — `MockDataService` (Development Only)

Used when `environment.useMockData = true`. Provides:
- `getMockIssues()` — Returns a static array of pre-populated Issue objects
- Each issue has `systemVerified`, `priorityLevel`, `status`, `zone`, and `location` fields matching the real schema
- Used by `IssueService` and `AuthService` (guard bypass: `if (environment.useMockData) return true`)

---

## 16. 🛡️ Guards — Complete Reference

### 16.1 — `authGuard` (Functional Guard)

```typescript
export const authGuard: CanActivateFn = (route, state) => {
    // 1. Wait for session restoration
    return authService.loading$.pipe(
        filter(loading => !loading),   // Block until loading$ = false
        take(1),
        switchMap(() => authService.user$),
        take(1),
        map(user => {
            if (environment.useMockData) return true; // Dev bypass
            if (user && user.role === 'citizen') return true;
            router.navigate(['/login']);
            return false;
        })
    );
};
```

**Behavior matrix:**

| loading$ | user$ | Mock Mode | Result |
|:---|:---|:---|:---|
| true | any | any | Wait (filter blocks) |
| false | null | false | Redirect `/login` |
| false | `{role:'citizen'}` | false | ✅ Allow |
| false | `{role:'authority'}` | false | ❌ Redirect `/login` |
| any | any | true | ✅ Allow (dev bypass) |

---

### 16.2 — `roleGuard(allowedRoles[])` (Guard Factory)

Returns a `CanActivateFn` that enforces role-based routing AFTER `authGuard` has passed.

```
Allowed roles check: user.role.toLowerCase() in allowedRoles.map(toLowerCase)

Role-specific redirect on mismatch:
  'citizen'   → /citizen/dashboard
  'authority' → /authority/dashboard
  'admin'     → /admin/dashboard
  unknown     → /login
```

This prevents cross-panel access (e.g., a citizen trying to access `/authority/dashboard` on the authority panel URL).

---

### 16.3 — Backend `adminOnly` (Contact Routes)

A lightweight inline middleware used exclusively in `contactRoutes.js`:
```javascript
// Extracts and verifies JWT manually (does not use shared protect middleware)
// Checks user.role === 'admin'
// On fail: 403 'Access denied: Admin role required'
```

This is a **secondary implementation** of authentication and is functionally equivalent to `protect + authorize('admin')`. It exists because contact routes were developed independently.

---

## 17. 🔁 Additional Algorithms

### Algorithm 17.1 — Ray Casting (Point-in-Polygon)

**Location:** `citizen-panel/src/app/utils/geo-utils.ts`

**Purpose:** Client-side detection of whether a GPS coordinate falls inside a hardcoded zone polygon boundary (`ZONE_BOUNDARIES` static data file). Used as a fallback when the backend geocoding is unavailable.

**Implementation (Ray Casting Algorithm):**
```typescript
export function isPointInPolygon(point: Coordinate, polygon: Coordinate[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat, yi = polygon[i].lng;
        const xj = polygon[j].lat, yj = polygon[j].lng;

        const intersect = ((yi > point.lng) !== (yj > point.lng))
            && (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }
    return inside;
}
```

**Step-by-step:**
1. Cast a horizontal ray from the test point to the right (toward +∞)
2. Count how many polygon edges the ray crosses
3. For each edge: check if it straddles the ray's Y-level (`yi > point.lng !== yj > point.lng`)
4. If it does, check if the crossing X is to the right of the point
5. Toggle `inside` on each valid crossing
6. Odd number of crossings = point is inside polygon

| Complexity | Value |
|:---|:---|
| Time | O(n) where n = polygon vertices |
| Space | O(1) |

---

### Algorithm 17.2 — OTP Generation

```javascript
const otp = Math.floor(100000 + Math.random() * 900000).toString();
// Generates exactly 6-digit string: 100000 to 999999
// Math.random() * 900000 → 0 to 899999.999…
// + 100000 → 100000 to 999999.999…
// Math.floor() → 100000 to 999999
```

| Property | Value |
|:---|:---|
| Length | Always exactly 6 digits |
| Entropy | ~19.9 bits (10^6 possible values) |
| Expiry | 5 minutes (`Date.now() + 5 * 60 * 1000`) |
| Storage | Plaintext on User document (⚠️ should be hashed in production) |

---

### Algorithm 17.3 — Admin Search (Fuzzy Text Match via Regex)

```javascript
// GET /api/admin/users?search=john
const query = {};
if (search) {
    query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
    ];
}
```

- Case-insensitive partial match on both `name` and `email` fields simultaneously
- `$options: 'i'` = case-insensitive flag
- MongoDB uses the `email` unique index if the regex anchors to the start (`^`); otherwise full collection scan
- **Performance Note:** For production scale, consider a `$text` index with `$search` or ElasticSearch integration

---

### Algorithm 17.4 — MongoDB Aggregation Pipeline (Monthly Trends)

```javascript
[
  // Stage 1: Filter to last 6 months
  { $match: { createdAt: { $gte: sixMonthsAgo } } },

  // Stage 2: Group by formatted month string
  { $group: {
      _id: { $dateToString: { format: "%b %Y", date: "$createdAt" } },
      count: { $sum: 1 },
      sortOrder: { $min: "$createdAt" }  // Earliest timestamp per group for sorting
  }},

  // Stage 3: Sort chronologically
  { $sort: { sortOrder: 1 } }
]
// Output: [{ _id: "Jan 2026", count: 45, sortOrder: <Date> }, ...]
// Mapped to: [{ name: "Jan 2026", value: 45 }] for ngx-charts
```

| Complexity | Value |
|:---|:---|
| Time | O(n) where n = issues in last 6 months |
| Space | O(m) where m = number of distinct months (≤ 6) |

---

## 18. 🌐 Environment Configuration

### 18.1 — Backend Environment Variables (`.env`)

| Variable | Example Value | Purpose | Required |
|:---|:---|:---|:---|
| `PORT` | `5000` | Express server port | ✅ |
| `MONGO_URI` | `mongodb://localhost:27017/civicsense` | MongoDB connection string | ✅ |
| `NODE_ENV` | `production` / `development` | Environment mode | ✅ |
| `JWT_SECRET` | `<256-bit-random-string>` | JWT signing secret — **change in production!** | ✅ |
| `CLOUDINARY_CLOUD_NAME` | `dkxfkefin` | Cloudinary account name | ✅ |
| `CLOUDINARY_API_KEY` | `292691324657235` | Cloudinary key | ✅ |
| `CLOUDINARY_API_SECRET` | `iXpUy...` | Cloudinary secret | ✅ |
| `EMAIL_USER` | `admin@civicsense.gov.in` | Gmail sender address | ⚠️ Optional (mock mode if absent) |
| `EMAIL_PASS` | `<gmail-app-password>` | Gmail App Password (not account password) | ⚠️ Optional |
| `GOOGLE_CLIENT_ID` | `391263362926-...` | Google OAuth2 client ID | ⚠️ Optional (OAuth disabled without it) |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | Google OAuth2 secret | ⚠️ Optional |
| `GITHUB_CLIENT_ID` | `Ov23li...` | GitHub OAuth App ID | ⚠️ Optional |
| `GITHUB_CLIENT_SECRET` | `<secret>` | GitHub OAuth secret | ⚠️ Optional |
| `GOOGLE_MAPS_API_KEY` | *(empty)* | Reserved for future Google Maps use | ❌ Not used |

> **Security Warning:** The current `.env` contains real credentials. In production, use a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) and **never commit `.env` to source control**.

---

### 18.2 — Frontend Environment Files (Angular)

**File:** `citizen-panel/src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  useMockData: false,    // Set to true for offline development
  firebaseConfig: { ... }
};
```

**File:** `citizen-panel/src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.civicsense.gov.in/api',  // Production URL
  useMockData: false,
  firebaseConfig: { ... }
};
```

| Variable | Type | Purpose |
|:---|:---|:---|
| `production` | `boolean` | Enables Angular production optimizations |
| `apiUrl` | `string` | Base URL for all HTTP calls in services |
| `useMockData` | `boolean` | Bypasses all HTTP calls with static mock data |
| `firebaseConfig` | `object` | Firebase project configuration for Auth |

---

## 19. 🖥 Development Setup Guide

### 19.1 — Prerequisites

| Software | Version | Purpose |
|:---|:---|:---|
| Node.js | ≥ 18.x | Runtime for backend + Angular CLI |
| npm | ≥ 9.x | Package manager |
| MongoDB | ≥ 6.x | Local database (or Atlas cloud) |
| Angular CLI | 21.0.4 | Frontend scaffold + dev server |
| Git | any | Version control |

---

### 19.2 — Backend Setup

```bash
# 1. Navigate to backend
cd d:\civic\backend

# 2. Install dependencies
npm install

# 3. Create .env (copy from template, fill in your values)
copy .env.example .env

# 4. Seed initial data (optional but recommended)
node seedAdmin.js      # Creates default admin user
node seed_zones.js     # Creates zone entries
node seed_areas.js     # Creates area entries

# 5. Start in development mode (auto-reload)
npm run dev

# 6. Verify:
# GET http://localhost:5000/ → "CivicSense API is running..."
```

---

### 19.3 — Frontend Setup (All 3 Panels)

```bash
# CITIZEN PANEL
cd d:\civic\citizen-panel
npm install
ng serve --port 4202
# → http://localhost:4202

# AUTHORITY PANEL
cd d:\civic\authority-panel
npm install
ng serve --port 4201
# → http://localhost:4201

# ADMIN PANEL
cd d:\civic\admin-panel
npm install
ng serve --port 4200
# → http://localhost:4200
```

---

### 19.4 — Database Quick-Start Commands

```bash
# Connect to MongoDB
mongosh

# Switch to project DB
use civicsense

# Verify collections exist
show collections
# Expected: users, issues, issuestatuses, zones, areas, notifications, contactmessages

# Check admin user
db.users.findOne({ role: 'admin' })

# Check zones
db.zones.find({}, { zoneName: 1 }).toArray()

# Count issues
db.issues.countDocuments()
```

---

### 19.5 — Useful Debug Scripts

```bash
# Check who is registered as admin
node d:\civic\backend\check_admin.js

# Check all registered users
node d:\civic\backend\check_users.js

# Reset a specific user's password
node d:\civic\backend\reset_rasha_password.js

# Migrate zones (if schema changed)
node d:\civic\backend\migrate_zones.js
```

---

## 20. 🚀 Production Deployment Checklist

### 20.1 — Security Hardening

- [ ] **Replace JWT secrets:** Change `JWT_SECRET` from `dev_secret_123` to a cryptographically random 256-bit string
- [ ] **Remove fallback secret:** Change `'secret123'` in `generateToken()` to throw if `JWT_SECRET` is absent
- [ ] **Enable Helmet:** Uncomment `app.use(helmet())` in `server.js`
- [ ] **Restrict CORS:** Change `origin` array to production domain only
- [ ] **Add rate limiting:** Install and configure `express-rate-limit` on auth and issue creation endpoints
- [ ] **Hash OTPs:** Store `bcrypt.hash(otp, 8)` instead of plaintext on User document
- [ ] **HTTPS:** Deploy behind Nginx reverse proxy with Let's Encrypt SSL + HSTS header
- [ ] **Remove debug logs:** Remove all `console.log` containing GPS coordinates and user emails
- [ ] **Secure `.env`:** Move to environment secrets manager; remove `.env` from `node_modules` proximity

### 20.2 — Performance Tuning

- [ ] **Enable caching:** Add Redis layer for zone list and frequently-accessed geospatial lookups
- [ ] **Re-enable Nominatim cache:** Uncomment cache logic in `geoService.js` (`Map<string, result>`, LRU with 100-entry cap)
- [ ] **Add debounce to `updateMarker()`:** 500ms debounce on drag events to reduce geocode API calls
- [ ] **Add `express-cache-controller`:** Set `Cache-Control` headers on static zone/area list responses
- [ ] **MongoDB indexes review:** Run `db.issues.getIndexes()` to verify all documented indexes are present
- [ ] **Angular production build:** `ng build --configuration production` for tree-shaking, Terser minification, and AoT compilation

### 20.3 — MongoDB Atlas Production Setup

```javascript
// Replace in .env:
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/civicsense?retryWrites=true&w=majority

// Ensure indexes are created:
db.issues.createIndex({ "location.coordinates": "2dsphere" });
db.zones.createIndex({ "geoPolygon": "2dsphere" });
db.areas.createIndex({ "centerLocation": "2dsphere" });
db.areas.createIndex({ "boundary": "2dsphere" });
db.notifications.createIndex({ recipient: 1, recipientRole: 1, createdAt: -1 });
```

### 20.4 — Cloudinary Production Setup

```javascript
// Profile images folder: 'profiles/'
// Issue images folder: 'issues/' (via uploadRoutes.js)
// Recommended: Enable Cloudinary auto-transform for WebP conversion
// Set delivery type: 'upload' with signed URLs for sensitive content
```

---

## 21. 📐 Component-Service-API Dependency Map

```
CITIZEN PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LoginComponent
  └─ AuthService.login()            → POST /api/users/login
  └─ AuthService.loginWithGoogle()  → POST /api/users/google-login

RegisterComponent
  └─ AuthService.register()         → Firebase + POST /api/users

ReportIssueComponent
  └─ FileUploadService.upload()     → POST /api/upload
  └─ IssueService.reverseGeocode()  → GET  /api/issues/geocode
  └─ IssueService.searchLocation()  → GET  /api/issues/search-location
  └─ IssueService.getZones()        → GET  /api/zones
  └─ IssueService.reportIssue()     → POST /api/issues

DashboardCitizenComponent
  └─ IssueService.getIssues()       → GET  /api/issues

IssueDetailComponent
  └─ IssueService.getIssueById()    → GET  /api/issues/:id

NotificationsComponent
  └─ NotificationService.get()      → GET  /api/notifications

ProfileComponent
  └─ AuthService.updateProfile()    → PUT  /api/users/profile
  └─ AuthService.uploadAvatar()     → POST /api/users/profile/photo

ChangePasswordComponent
  └─ AuthService.changePassword()   → PUT  /api/users/change-password

AUTHORITY PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DashboardAuthorityComponent
  └─ IssueService.getIssues()       → GET  /api/issues  (zone-scoped by backend)

AuthorityIssueDetailComponent
  └─ IssueService.getIssueById()    → GET  /api/issues/:id
  └─ IssueService.updateStatus()    → PATCH /api/issues/:id/status
  └─ PUT                            → PUT  /api/issues/:id/assign

TaskQueueComponent / AssignedTasksComponent
  └─ IssueService.getIssues()       → GET  /api/issues

ADMIN PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DashboardAdminComponent
  └─ AdminService.getDashboardStats() → GET /api/admin/dashboard-stats

ZoneMonitoringComponent
  └─ AdminService.getIssues()       → GET  /api/issues (limit=200)

UsersComponent
  └─ AdminService.getUsers()        → GET  /api/admin/users
  └─ AdminService.updateUser()      → PUT  /api/admin/users/:id

ContactMessagesComponent
  └─ HTTP.get()                     → GET  /api/contact/all
  └─ HTTP.delete()                  → DELETE /api/contact/:id
```

---

## 22. 🗂 TypeScript Model Reference (Frontend)

### `User` interface (citizen-panel)
```typescript
interface User {
  uid: string;                            // Firebase UID
  _id?: string;                          // MongoDB ObjectId
  email: string;
  role: 'citizen' | 'authority' | 'admin';
  name?: string;
  photoUrl?: string;
  phone?: string;
  address?: string;
  area?: string;                         // Authority's zone assignment
  themePreference?: 'light' | 'dark';
  emailNotificationPreference?: string;
  languagePreference?: string;
  createdAt?: Date;
}
```

### `Coordinate` interface (geo-utils)
```typescript
interface Coordinate {
  lat: number;
  lng: number;
}
```

### Issue payload sent to backend
```typescript
{
  title: string;
  description: string;
  category: string;         // Final resolved (including otherCategory)
  imageUrl: string;         // Cloudinary CDN URL
  location: {
    lat: number;
    lng: number;
    accuracy: number;
    source: 'GPS' | 'Manual';
    address: string;
    zone: string;
  };
  zone: string;             // Selected zone name
}
```

---

## 23. 🔍 Known Issues & Technical Debt

| Issue | Severity | Location | Recommended Fix |
|:---|:---|:---|:---|
| `JWT_SECRET` has plaintext fallback | 🔴 Critical | `userController.js:11` | Throw error if env var missing |
| OTP stored as plaintext | 🔴 High | `userController.js:369` | `bcrypt.hash(otp, 8)` before save |
| Helmet.js commented out | 🔴 High | `server.js:21` | Uncomment for production |
| Nominatim geocode cache disabled | 🟡 Medium | `geoService.js:11` | Re-enable with LRU eviction |
| No debounce on marker drag geocode | 🟡 Medium | `report-issue.component.ts:733` | Add 500ms debounce |
| `authGuard` checks `role === 'citizen'` only | 🟡 Medium | `auth.guard.ts:19` | Should check `!!user` for shared guard |
| Contact routes has duplicate `adminOnly` middleware | 🟢 Low | `contactRoutes.js:8` | Refactor to use shared `authorize` middleware |
| GitHub new-user default role is `authority` | 🟢 Low | `userController.js:304` | Should be configurable or `citizen` |
| `alert()` used for submit feedback | 🟢 Low | `report-issue.component.ts:983` | Replace with `MatSnackBar` or toasts |
| No `express-rate-limit` on auth endpoints | 🔴 High | `server.js` | Add rate limiter for `/users/login`, `/users/forgot-password` |

---

```
╔══════════════════════════════════════════════════════════════════╗
║                     END OF DOCUMENT                              ║
║                                                                  ║
║  CivicSense — Project Engineering Master File                    ║
║  Generated: April 2026 | Rev 2.0 | Full Codebase Analysis       ║
║                                                                  ║
║  Total Sections: 23   |   Total APIs Documented: 37+            ║
║  Total Algorithms: 10  |   Collections: 7                        ║
║                                                                  ║
║  This document serves as:                                        ║
║  • Development Reference    • Team Onboarding Guide              ║
║  • Technical Audit Record   • Viva / Interview Reference         ║
║  • Project Submission Doc   • System Architecture Blueprint      ║
║  • Security Audit Checklist • Known Issues Log                   ║
╚══════════════════════════════════════════════════════════════════╝
```
