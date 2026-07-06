# ⚠️ CivicSense — System Limitations & Future Enhancements

> **Document Purpose:**
> This file provides an honest, comprehensive, and technically detailed analysis of
> every known limitation in the CivicSense platform — covering root causes, real-world
> impact, severity, and the exact engineering solution required to resolve each one.
>
> This document is intended for use in viva presentations, project evaluations,
> technical audits, and future development planning.

---

## 📊 Limitations Summary Table

| # | Limitation | Severity | Category | Resolution Effort |
|:---|:---|:---|:---|:---|
| L1 | No real-time communication | 🔴 High | Architecture | Large |
| L2 | JWT stored in localStorage | 🔴 High | Security | Medium |
| L3 | No rate limiting on auth endpoints | 🔴 High | Security | Small |
| L4 | OTP stored as plaintext | 🔴 High | Security | Small |
| L5 | Helmet.js disabled in development | 🔴 High | Security | Small |
| L6 | No automated tests | 🟡 Medium | Quality | Large |
| L7 | Nominatim rate limit bottleneck | 🟡 Medium | Performance | Medium |
| L8 | No email verification on registration | 🟡 Medium | Security | Small |
| L9 | No offline / PWA support | 🟡 Medium | UX | Large |
| L10 | Race condition on issue claiming | 🟡 Medium | Data Integrity | Small |
| L11 | Geocode cache disabled | 🟡 Medium | Performance | Small |
| L12 | No debounce on map marker drag | 🟡 Medium | Performance | Small |
| L13 | Single-city hardcoded for Surat | 🟢 Low | Scalability | Large |
| L14 | No horizontal scaling | 🟢 Low | Infrastructure | Large |
| L15 | GitHub OAuth not production-configured | 🟢 Low | Feature | Small |
| L16 | No file size limit enforcement | 🟢 Low | Security | Small |
| L17 | No CSRF protection | 🟢 Low | Security | Medium |
| L18 | No admin activity audit log | 🟢 Low | Compliance | Medium |
| L19 | Alert() used for user feedback | 🟢 Low | UX | Small |
| L20 | authGuard checks citizen role only | 🟢 Low | Logic | Small |

---

## 🔴 HIGH SEVERITY LIMITATIONS

---

### L1 — No Real-Time Communication (WebSockets)

**Description:**
The system has no WebSocket or Server-Sent Events (SSE) implementation. Notifications,
status changes, and issue assignments are only visible to users when they manually
navigate to or refresh the relevant page. There is no live push from server to client.

**Root Cause:**
Real-time communication was not implemented in the current version due to time constraints
and the complexity of managing socket connections across three separate Angular SPAs
with shared authentication.

**Real-World Impact:**
- A citizen submits a report. An authority resolves it. The citizen has no idea until they
  open the notifications page manually.
- An authority is assigned a critical issue. They only see it on their next page visit.
- In a true municipal emergency (e.g., a gas leak report), delay in delivery could matter.

**Current Workaround:**
Notifications are stored in MongoDB and fetched on-demand when the user visits the
Notifications page or the dashboard.

**Exact Fix Required:**
```
1. Install socket.io on backend:     npm install socket.io
2. Install on frontends:             npm install socket.io-client
3. Wrap Express server with Socket.io:
   const io = require('socket.io')(httpServer, { cors: { origin: [...] } })
4. On issue status update → io.to(citizenId).emit('status_update', issueData)
5. Angular: inject SocketService → socket.on('status_update', cb)
6. Show MatSnackBar toast on event arrival
```

---

### L2 — JWT Stored in localStorage (XSS Vulnerability)

**Description:**
The JWT authentication token is stored in `localStorage` on the client browser.
Any JavaScript running on the page — including injected scripts from XSS attacks — can
read this token via `localStorage.getItem('token')` and impersonate the user.

**Root Cause:**
localStorage was chosen for simplicity and SSR compatibility. The Angular universal
`isPlatformBrowser()` guard was used to prevent server-side crashes, but the underlying
storage mechanism remains XSS-vulnerable.

**Real-World Impact:**
If any third-party script (analytics, ads, or malicious injections) runs on the page and
an XSS vulnerability exists in the application, the attacker can steal the JWT and make
authenticated API calls for up to 30 days (the token's expiry).

**Exact Fix Required:**
```
Backend:
  res.cookie('token', jwt, {
      httpOnly: true,     // Not accessible to JavaScript
      secure: true,       // HTTPS only
      sameSite: 'Strict', // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

Frontend:
  - Remove localStorage.setItem('token', ...)
  - Remove Authorization header from authInterceptor
  - Cookies are sent automatically by the browser
  - Use { withCredentials: true } in HttpClient calls

Add CSRF token:
  - Backend generates CSRF token, sends in non-httpOnly cookie
  - Frontend reads CSRF cookie, sends in X-CSRF-Token header
  - Backend validates header matches cookie
```

---

### L3 — No Rate Limiting on Authentication Endpoints

**Description:**
The `/api/users/login` and `/api/users/forgot-password` endpoints have no request
rate limiting. A bot can attempt thousands of password guesses per second.

**Root Cause:**
`express-rate-limit` was not installed in the current version.

**Real-World Impact:**
- Brute force attacks on citizen accounts
- OTP enumeration (attacker requests OTPs repeatedly to find valid ones)
- Denial of service by flooding the auth endpoint

**Exact Fix Required:**
```javascript
npm install express-rate-limit

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // 10 attempts per window
    message: { message: 'Too many attempts. Try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply in userRoutes.js:
router.post('/login', authLimiter, loginUser);
router.post('/forgot-password', authLimiter, forgotPassword);
```

---

### L4 — OTP Stored as Plaintext in Database

**Description:**
The 6-digit OTP generated for password reset is stored directly as a plain string on the
User document without any hashing. Anyone with database read access can see valid OTPs.

**Root Cause:**
OTP was implemented quickly for the forgot-password feature without applying the same
security standards used for passwords.

**Real-World Impact:**
- A database breach exposes all currently-valid OTPs
- A malicious database admin could reset any user's password
- Fails basic security compliance standards (PCI-DSS, ISO 27001)

**Exact Fix Required:**
```javascript
// In userController.js — forgotPassword():
const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
const hashedOtp = await bcrypt.hash(rawOtp, 8); // Hash before storing

user.otp = hashedOtp;         // Store hash
user.otpExpires = Date.now() + 5 * 60 * 1000;
await user.save();

sendEmail(user.email, 'OTP', rawOtp); // Send raw OTP to user

// In verifyOtp():
const isMatch = await bcrypt.compare(req.body.otp, user.otp); // Compare
if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });
```

---

### L5 — Helmet.js Disabled in Development

**Description:**
The `app.use(helmet())` call in `server.js` is commented out. This means the backend
does not set any HTTP security headers in the current running configuration.

**Root Cause:**
Helmet was commented out during development because some of its default policies
(particularly CSP) were breaking development-mode Angular requests and Cloudinary image
loading.

**Real-World Impact:**
Without Helmet, the following attack vectors are open:
- **Clickjacking:** No X-Frame-Options header — app can be embedded in iframes
- **XSS:** No Content-Security-Policy header
- **MIME Sniffing:** No X-Content-Type-Options header
- **Referrer Leakage:** No Referrer-Policy header

**Exact Fix Required:**
```javascript
// server.js — Enable with proper configuration:
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "res.cloudinary.com", "data:"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            connectSrc: ["'self'", "nominatim.openstreetmap.org"]
        }
    },
    crossOriginEmbedderPolicy: false // Required for Leaflet map tiles
}));
```

---

## 🟡 MEDIUM SEVERITY LIMITATIONS

---

### L6 — No Automated Tests

**Description:**
The project has zero unit tests, integration tests, or end-to-end tests. All validation
of functionality was done manually during development.

**Root Cause:**
Test-Driven Development (TDD) was not followed. Testing was deferred to focus on
feature completion within the academic deadline.

**Real-World Impact:**
- Any code change could break existing functionality silently
- Regression bugs are only discovered by manual testing
- The duplicate detection logic, zone resolution, and AI fallback chain are
  particularly risky to refactor without tests

**Required Test Coverage:**
```
Backend (Jest):
  ✓ issueController.createIssue — duplicate detection logic
  ✓ issueController.createIssue — AI fallback when key missing
  ✓ zoneResolver.resolveZone — all 3 stages
  ✓ verificationEngine.analyzeIssueImage — Gemini + simulation
  ✓ userController.forgotPassword — OTP generation + expiry
  ✓ authMiddleware.protect — valid JWT, expired JWT, Firebase token

Frontend (Jasmine + Karma):
  ✓ AuthService — login(), logout(), session restore state machine
  ✓ ReportIssueComponent — form validity per step
  ✓ GPS averaging — processGPSReading() with mock positions
  ✓ isPointInPolygon() — geo-utils unit test

E2E (Playwright or Cypress):
  ✓ Full citizen issue reporting flow
  ✓ Authority status update flow
  ✓ Duplicate report rejection
```

---

### L7 — Nominatim Rate Limit Bottleneck

**Description:**
OpenStreetMap Nominatim enforces a strict 1 request/second policy for non-commercial
use. The backend adds a 1200ms artificial delay before every geocoding call.

**Root Cause:**
The system uses the free Nominatim service which has strict rate-limiting terms of service.

**Real-World Impact:**
- Every issue submission adds at least 1.2 seconds of server wait time
- Under concurrent load (10 users submitting simultaneously), requests queue up
  and response times grow linearly: 10 users × 1.2s = 12 seconds for last user

**Exact Fix Required (3 options):**
```
Option A — Paid API:
  Replace Nominatim with Google Maps Geocoding API or MapBox
  - 40,000 free requests/month (Google)
  - No artificial delay needed

Option B — Self-hosted Nominatim:
  Deploy own Nominatim instance on VPS
  - No rate limits (own server)
  - High setup cost (~4GB RAM required for India data)

Option C — Redis Cache (quickest win):
  Cache geocode results by coordinate (rounded to 4 decimal places)
  const cacheKey = `geo:${lat.toFixed(4)}:${lng.toFixed(4)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  // else → Nominatim call → cache result for 30 days
```

---

### L8 — No Email Verification on Registration

**Description:**
Citizens can register with any email address without verifying ownership.
A user with a typo in their email will receive no OTPs and no notifications.

**Root Cause:**
Verification email flow was not implemented to simplify the registration UX.

**Exact Fix Required:**
```javascript
// Registration success → send verification email
const verifyToken = crypto.randomBytes(32).toString('hex');
user.emailVerifyToken = verifyToken;
user.emailVerified = false;
await user.save();
sendEmail(user.email, 'Verify Email', `Click: /verify-email?token=${verifyToken}`);

// New route: GET /api/users/verify-email?token=
user = await User.findOne({ emailVerifyToken: token });
user.emailVerified = true;
user.emailVerifyToken = undefined;
await user.save();

// Guard protected routes: if (!user.emailVerified) return 403;
```

---

### L9 — No Offline / PWA Support

**Description:**
The application has no service worker, no offline cache, and no background sync.
If a citizen loses internet connectivity while filling the report form, all entered
data is lost when the page reloads.

**Root Cause:**
Progressive Web App features were not included in the current scope.

**Real-World Impact:**
In areas with poor connectivity — which are often the same areas with the most
infrastructure problems — the app is unreliable.

**Exact Fix Required:**
```
1. Add Angular Service Worker:
   ng add @angular/pwa

2. Configure ngsw-config.json to cache:
   - App shell (index.html, main.js)
   - Zone list data
   - Leaflet map tiles (offline fallback)

3. Use IndexedDB for draft storage:
   - Save form state to IndexedDB on every change
   - On reconnect → submit from stored draft
   - Clear draft on successful submission

4. Background Sync API:
   - Register sync event when offline
   - Service worker retries POST /api/issues when online
```

---

### L10 — Race Condition on Issue Claiming

**Description:**
Two authorities in the same zone can simultaneously click "Claim Task" on the same issue.
Both requests arrive before either MongoDB write completes, resulting in both receiving
success responses and both believing they own the task.

**Root Cause:**
The current implementation uses a two-step read-then-write pattern:
```javascript
// CURRENT (vulnerable):
const issue = await Issue.findById(id);
if (issue.assignedAuthorityId) return res.status(400)...
issue.assignedAuthorityId = req.user._id;
await issue.save();
// ↑ Race window exists between findById and save
```

**Exact Fix Required:**
```javascript
// FIXED — Atomic findOneAndUpdate:
const issue = await Issue.findOneAndUpdate(
    {
        _id: id,
        assignedAuthorityId: null  // Only match if not yet claimed
    },
    {
        $set: {
            assignedAuthorityId: req.user._id,
            status: 'In Progress'
        }
    },
    { new: true }
);

if (!issue) {
    return res.status(409).json({ message: 'Issue already claimed by another officer.' });
}
```

---

## 🟢 LOW SEVERITY LIMITATIONS

---

### L11 — Geocode Result Cache is Disabled

**Description:**
The `geoService.js` file has a commented-out LRU cache (`Map<string, result>`)
that would cache Nominatim responses. Currently every geocode call hits the API.

**Fix:** Uncomment and configure with a 100-entry LRU eviction policy.
Cache key: `${lat.toFixed(4)},${lng.toFixed(4)}`. TTL: 30 days.

---

### L12 — No Debounce on Map Marker Drag

**Description:**
Every pixel of marker drag triggers `updateMarker()` which calls the geocode API.
This can generate 50+ API calls for a single drag gesture.

**Fix:**
```typescript
// Use RxJS debounceTime:
this.dragSubject.pipe(debounceTime(500)).subscribe(
    ({ lat, lng }) => this.reverseGeocode(lat, lng)
);
```

---

### L13 — Single-City (Hardcoded for Surat)

**Description:**
Map center, GPS bounds, zone boundaries in `zone-data.ts`, and Nominatim
context are all hardcoded for Surat, Gujarat.

**Fix:** Add `cities` MongoDB collection. Admin can configure city bounds, center,
and zone polygons. Frontends read city config from API on startup.

---

### L14 — No Horizontal Scaling

**Description:**
Single Node.js process, no containerization, no load balancer. Vertical scaling only.

**Fix:** Dockerize all services → Nginx reverse proxy → multiple Node.js instances
→ Socket.io Redis adapter for shared state between instances.

---

### L15 — GitHub OAuth Not Production-Configured

**Description:**
`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env` are set to placeholder
strings (`your_github_client_id`). GitHub OAuth login fails in production.

**Fix:** Register a production GitHub OAuth App at `github.com/settings/developers`
with the production callback URL.

---

### L16 — No File Size/Type Validation at API Level

**Description:**
Multer's `allowed_formats` on Cloudinary limits file types, but there is no
explicit file size limit set. A malicious user could upload a 100MB file.

**Fix:**
```javascript
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1920, crop: 'limit' }] // Auto-resize large images
    }
});

// Multer size limit:
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max
```

---

### L17 — No CSRF Protection

**Description:**
If JWT is moved to httpOnly cookies (L2 fix), CSRF attacks become a concern.
Currently not applicable with localStorage, but will be required after L2 is fixed.

**Fix:** Use `csurf` middleware or implement the Double Submit Cookie pattern with
a separate CSRF token in a readable cookie + X-CSRF-Token request header.

---

### L18 — No Admin Activity Audit Log

**Description:**
There is no record of what admins do — which users they deleted, which roles they
changed, which issues they bulk-updated. This is a compliance gap.

**Fix:** Create an `AdminAuditLog` collection. Middleware wraps all admin controller
functions and records `{ adminId, action, targetId, targetCollection, timestamp, changes }`.

---

### L19 — `alert()` Used for User Feedback

**Description:**
Native browser `alert()` dialogs are used in `ReportIssueComponent` for success
and error messages. These block the UI thread, cannot be styled, and look
unprofessional in a production application.

**Fix:**
```typescript
// Replace all alert() with Angular Material SnackBar:
this.snackBar.open('✅ Issue submitted successfully!', 'Close', {
    duration: 4000,
    panelClass: ['success-snack'],
    verticalPosition: 'top'
});
```

---

### L20 — `authGuard` Checks `citizen` Role Only

**Description:**
The `authGuard` in the citizen panel checks `user.role === 'citizen'` specifically.
This was correct for the citizen panel but is architecturally fragile — a shared
guard implementation should check `!!user` (unauthenticated) and let `roleGuard`
handle the role-specific check.

**Fix:**
```typescript
// authGuard should only check authentication:
map(user => {
    if (environment.useMockData) return true;
    if (user) return true;          // Any authenticated user
    router.navigate(['/login']);
    return false;
})
// roleGuard then handles the role check separately
```

---

## 🔮 Future Enhancement Roadmap

| Priority | Enhancement | Effort | Impact |
|:---|:---|:---|:---|
| P1 | Socket.io real-time notifications | Large | 🔴 Critical UX |
| P1 | Rate limiting on all auth endpoints | Small | 🔴 Security |
| P1 | httpOnly cookie JWT migration | Medium | 🔴 Security |
| P2 | Jest unit tests for core algorithms | Large | 🟡 Quality |
| P2 | Email verification on registration | Small | 🟡 Security |
| P2 | Redis caching for geocode results | Medium | 🟡 Performance |
| P3 | PWA + offline draft caching | Large | 🟢 UX |
| P3 | Multi-city support | Large | 🟢 Scalability |
| P3 | Docker containerization | Medium | 🟢 Infrastructure |
| P4 | Admin audit log | Medium | 🟢 Compliance |
| P4 | MatSnackBar instead of alert() | Small | 🟢 Polish |

---

## 💬 Viva-Ready Limitation Statement

> *"I want to be transparent about the known limitations of this system.
> The six most significant ones are: no real-time push notifications,
> JWT stored in localStorage instead of httpOnly cookies, no rate limiting on
> authentication endpoints, OTPs stored as plaintext instead of being hashed,
> Helmet.js security headers disabled in the current configuration, and no
> automated test suite. I know exactly what each of these limitations means,
> why it exists, and precisely how each one would be fixed in a production
> deployment. A system that acknowledges its limitations and has a clear
> remediation plan is more production-ready than one that pretends it has none."*

---

```
╔══════════════════════════════════════════════════════════════╗
║         CIVICSENSE — SYSTEM LIMITATIONS DOCUMENT            ║
║                                                              ║
║  20 Limitations Documented                                   ║
║  6 High Severity  |  5 Medium  |  9 Low                     ║
║  Every limitation includes exact code-level fix              ║
║                                                              ║
║  Rev 1.0 | April 2026                                        ║
╚══════════════════════════════════════════════════════════════╝
```
