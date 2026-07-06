# ⚡ CivicSense — VIVA QUICK REFERENCE CARD

> **Print this page or keep it open during your viva.**
> One glance = all the numbers, names, and terms you need.

---

## 🔢 THE KEY NUMBERS

| What | Number | Why it matters |
|:---|:---|:---|
| Angular version | **21** | Latest standalone component architecture |
| Express version | **5.2.1** | Latest Express with improved routing |
| JWT expiry | **30 days** | Long-lived session for citizens |
| OTP expiry | **5 minutes** | Security window for password reset |
| OTP digits | **6** | 10⁶ = 1,000,000 possible values |
| Bcrypt salt rounds | **10** | ~100ms hash time (security/speed balance) |
| GPS readings required | **5** | Averaging for accuracy stability |
| GPS high-accuracy lock | **≤ 20 metres** | GPS cleared after this threshold |
| Duplicate radius | **10 metres** | Haversine threshold |
| Duplicate time window | **5 minutes** | Same user, same category, same location |
| Nominatim delay | **1200 ms** | Rate limit compliance (1 req/sec ToS) |
| DB port | **27017** | MongoDB default |
| Backend port | **5000** | Express server |
| Citizen panel port | **4202** | Angular dev server |
| Authority panel port | **4201** | Angular dev server |
| Admin panel port | **4200** | Angular dev server |
| Earth radius (Haversine) | **6,371,000 m** | Used in distance formula |
| Issue categories | **11** | Pothole, Garbage, Streetlight, Water, Traffic, Drainage, Noise, Parking, Signage, Animals, Others |
| Municipal zones | **7** | North, South, East, West, Central, South-East, South-West |
| User roles | **3** | citizen, authority, admin |
| Issue statuses | **4** | Open, In Progress, Resolved, Rejected |
| Priority levels | **4** | Low, Medium, High, Critical |
| Collections in DB | **7** | Users, Issues, IssueStatuses, Zones, Areas, Notifications, ContactMessages |
| API endpoints | **37+** | Documented in master file |
| Algorithms used | **10** | Listed below |

---

## 🧠 THE 10 ALGORITHMS — NAME & ONE-LINE EXPLANATION

| # | Name | Job |
|:---|:---|:---|
| 1 | **Haversine Formula** | Measures GPS distance in metres between two coordinates |
| 2 | **Ray Casting** | Checks if a GPS point is inside a zone polygon |
| 3 | **GPS Multi-Reading Average** | Averages 5 GPS readings for accuracy |
| 4 | **Zone Resolution (2-stage)** | Maps coords → zone via `$geoIntersects` then keyword match |
| 5 | **AI Priority Simulation** | Keyword-based priority when Gemini API unavailable |
| 6 | **Gemini Chain-of-Thought** | AI prompt forces structured JSON verification of images |
| 7 | **Offset Pagination** | `skip = (page-1) × limit` for all list endpoints |
| 8 | **MongoDB Aggregation Pipeline** | Groups issues by month/category/priority for charts |
| 9 | **Fuzzy Regex Search** | Case-insensitive `$regex` on name + email fields |
| 10 | **OTP Generation** | `Math.floor(100000 + Math.random() × 900000)` = 6 digits |

---

## 🛡️ SECURITY — 6 LAYERS

```
1. bcrypt (10 rounds)    → Password storage
2. JWT (HS256, 30d)      → Session tokens
3. Firebase Admin SDK    → Social auth verification
4. protect middleware    → Route authentication gate
5. authorize(roles)      → Role-based access control
6. Helmet.js             → HTTP security headers (prod)
```

---

## 🔄 ISSUE PIPELINE — 7 STEPS

```
1. Zone Validate     → Zone.findOne({ zoneName })
2. Duplicate Check   → Haversine < 10m + 5min window
3. AI Verify         → Gemini 1.5 Flash image analysis
4. Reverse Geocode   → Nominatim → locality + address
5. Zone Resolve      → $geoIntersects → keyword map
6. Auth Auto-Route   → User.findOne({ role:'authority', zone })
7. Create + Notify   → Issue.create() + Notification.create()
```

---

## 🌐 TECH STACK — QUICK RECALL

```
Frontend:   Angular 21 (Standalone) + Angular Material MDC
Maps:       Leaflet.js (OpenStreetMap tiles via CartoDB)
Charts:     ngx-charts
Backend:    Node.js + Express 5
Database:   MongoDB + Mongoose (7 collections)
Auth:       JWT + Firebase + Google OAuth + GitHub OAuth
AI:         Google Gemini 1.5 Flash
Storage:    Cloudinary CDN
Email:      Nodemailer + Gmail SMTP
Geocoding:  OpenStreetMap Nominatim
Security:   Helmet, bcryptjs, CORS, express-validator
```

---

## 🗂️ FOLDER MAP — ONE LINE EACH

```
backend/src/controllers/   → Business logic (issue, user, admin, notification)
backend/src/middleware/    → protect + authorize + upload
backend/src/models/        → 7 Mongoose schemas
backend/src/utils/         → verificationEngine, geoService, zoneResolver, emailService
backend/src/routes/        → Express routers (wired in server.js)
citizen-panel/src/app/
  components/              → 16 standalone Angular components
  services/                → auth, issue, file-upload, mock-data, notification
  guards/                  → authGuard, roleGuard
  interceptors/            → authInterceptor (JWT injection, no circular dep)
  utils/                   → geo-utils.ts (Ray Casting)
  data/                    → zone-data.ts (static ZONE_BOUNDARIES)
```

---

## ❓ MOST LIKELY VIVA QUESTIONS — QUICK ANSWERS

| Question | Answer in 5 words |
|:---|:---|
| What is Haversine? | Spherical distance between GPS coordinates |
| What is Ray Casting? | Point inside polygon detection |
| What is JWT? | Signed token for stateless sessions |
| What is bcrypt? | One-way password hashing algorithm |
| What is $geoIntersects? | MongoDB point-in-polygon query |
| What is 2dsphere index? | MongoDB geospatial index type |
| What is BehaviorSubject? | RxJS observable with current value |
| What is lazy loading? | Load component only when navigated |
| What is authInterceptor? | Auto-injects Bearer token in requests |
| What is IssueStatus? | Immutable audit log of status changes |
| What is Nominatim? | OpenStreetMap reverse geocoding API |
| What is Cloudinary? | Cloud CDN for image storage |
| What is Gemini? | Google's multimodal AI model |
| Biggest limitation? | No real-time updates (no WebSockets) |
| How fix JWT localStorage? | Move to httpOnly cookies |
| How fix duplicate claims? | MongoDB findOneAndUpdate atomic |

---

## 🚀 START COMMANDS — MEMORISE THESE

```bash
# Windows (easiest)
Double-click: install-all.bat   ← first time only
Double-click: start-all.bat     ← every day
Double-click: stop-all.bat      ← when done

# PowerShell
.\start-all.ps1

# Unix / Git Bash
make install && make all

# Manual
cd backend       && npm run dev
cd citizen-panel && ng serve --port 4202
cd authority-panel && ng serve --port 4201
cd admin-panel   && ng serve --port 4200
```

---

## 📊 DATABASE COLLECTIONS — QUICK MAP

| Collection | Key Fields | Purpose |
|:---|:---|:---|
| `users` | email(unique), role, googleId, otp, zone | All platform users |
| `issues` | location, zone, assignedAuthorityId, priority, systemVerified | Civic reports |
| `issuestatuses` | issueId, status, updatedBy, timestamp | Status audit trail |
| `zones` | zoneName, localities[], geoPolygon | Municipal zone data |
| `areas` | areaName, zoneId, centerLocation(2dsphere) | Sub-zone localities |
| `notifications` | recipient, recipientRole, isRead | Notification inbox |
| `contactmessages` | name, email, subject, message | Public contact form |

---

## 🎯 CONFIDENCE PHRASES FOR VIVA

> *"I made that design decision because..."*
> *"This is handled at three levels — frontend, backend, and security middleware."*
> *"The system is designed to never fail due to external API unavailability."*
> *"Every status change creates an immutable audit record in IssueStatus."*
> *"That is a known limitation — and here is exactly how I would fix it..."*
> *"The time complexity of this operation is O(log n) because of the 2dsphere index."*

---

```
╔══════════════════════════════════════════════════════╗
║          CIVICSENSE — QUICK REFERENCE CARD           ║
║  10 Algorithms · 7 Collections · 37+ APIs · 3 Roles ║
║  Keep this open during your viva. Good luck! 🎓     ║
╚══════════════════════════════════════════════════════╝
```
