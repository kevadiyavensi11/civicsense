# 🖥️ CivicSense — Live Demo Walkthrough Script

> **Purpose:** This is your step-by-step guide for what to SAY and what to DO on screen
> during the live demonstration portion of your viva/presentation.
>
> **Before you start:** Make sure all three panels are open in browser tabs.
> Have the backend server running on port 5000.
> Have a test account pre-logged in for each role.
> Have one pending issue pre-submitted so it shows on authority and admin panels.

---

## ⚙️ PRE-DEMO SETUP CHECKLIST

```
[ ] Backend running:         npm run dev  (in d:\civic\backend)
[ ] Citizen Panel open:      http://localhost:4202
[ ] Authority Panel open:    http://localhost:4201
[ ] Admin Panel open:        http://localhost:4200  or :4300
[ ] Test citizen account:    citizen@test.com / password123
[ ] Test authority account:  authority@test.com / password123
[ ] Test admin account:      admin@civicsense.com / Admin@123
[ ] 1 open issue pre-created in DB (so authority dashboard is not empty)
[ ] Browser zoom at 90%  (so more content is visible)
[ ] Browser is in LIGHT mode (easier to see for evaluators in a room)
```

---

## 🎬 DEMO PART 1 — CITIZEN PANEL

### Screen: Landing Page  `localhost:4202`

**What to say:**
> "Let me start with the Citizen Panel. This is the public-facing side of the application.
> When a resident of Surat visits the platform, they land on this page.
> The design is intentionally clean and approachable — it explains the platform's purpose
> and provides quick access to Login and Register."

**What to do:**
- Briefly scroll the landing page to show the design
- Click **"Get Started"** or **"Login"** button

---

### Screen: Login Page

**What to say:**
> "The login page supports two methods — standard email and password,
> or signing in directly with a Google account using OAuth2.
> Let me log in with our test citizen account."

**What to do:**
- Type `citizen@test.com` in email field
- Type `password123` in password field
- Click **Login**
- Wait for redirect to dashboard

---

### Screen: Citizen Dashboard

**What to say:**
> "After logging in, the citizen is taken to their personal dashboard.
> They can see a summary of all their reported issues with status chips —
> Open, In Progress, Resolved, or Rejected — color-coded for clarity.
> The sidebar gives them access to report a new issue, view their issue list,
> check notifications, and manage their profile."

**What to do:**
- Point at the issue status chips on screen
- Point at the sidebar menu items
- Click **"Report New Issue"**

---

### Screen: Report Issue — Step 1 (Details)

**What to say:**
> "This is the multi-step report form built with Angular Material's Stepper,
> configured in linear mode — which means the citizen cannot skip any step.
> Step one collects the core details. Let me fill this in."

**What to do:**
- Type a title: **"Large pothole on Ring Road near Citylight"**
- Select category: **Pothole**
- Type description: **"A large pothole has developed near the Citylight area. It is causing risk to two-wheelers."**
- Click **Next**

---

### Screen: Report Issue — Step 2 (Photo Upload)

**What to say:**
> "Step two requires photographic evidence. This is mandatory — the system
> will not allow submission without a verified image. When the citizen selects
> a file, it is immediately previewed locally using JavaScript's createObjectURL,
> while the actual upload to Cloudinary runs in the background.
> You can see the real-time progress bar here. The Next button stays disabled
> until the Cloudinary CDN URL is received."

**What to do:**
- Click the upload area
- Select any image file from your computer (ideally a road/pothole image)
- Show the progress bar moving to 100%
- Wait for the preview to appear
- Click **Next**

---

### Screen: Report Issue — Step 3 (Location)

**What to say:**
> "Step three is the location picker. A Leaflet.js map initializes here —
> and I want to highlight that the map is loaded lazily.
> It only initializes when this step becomes active, not on page load.
> This is a deliberate performance optimization.
>
> On the left of the map controls, you can see the GPS accuracy badge.
> The system is running my custom Government-Grade GPS Engine in the background —
> it collects five consecutive readings from the browser's Geolocation API
> and averages them to produce a stable, accurate coordinate.
> This prevents outlier GPS readings from being used.
>
> The accuracy badge shows High, Medium, or Approximate based on the
> reported precision from the browser.
>
> The zone was automatically detected by the backend through OpenStreetMap
> reverse geocoding. The system called our Nominatim proxy, which resolved
> the coordinates to a Surat locality, ran it through the zone resolution
> algorithm, and populated this zone dropdown automatically."

**What to do:**
- Point at the map with the marker on it
- Point at the GPS accuracy badge (e.g., "High Accuracy (8m)")
- Point at the auto-filled zone dropdown showing a zone name (e.g., "West Zone")
- Point at the auto-detected address in the address field
- Say: "The citizen can also drag this marker to correct the location manually,
  or type an address and search."
- Click **Next**

---

### Screen: Report Issue — Step 4 (Confirm & Submit)

**What to say:**
> "The final step is a review screen acting as an Official Validation Report.
> It shows the uploaded image, the detected category, and the AI-assigned priority
> from our Gemini verification engine. The system has already run the image
> through Google Gemini in the background during the upload phase.
>
> When the citizen clicks Submit, a full-screen overlay appears — this communicates
> that the system is processing the report. Under the hood, this is where
> the duplicate detection, AI analysis, zone resolution, and authority routing
> are all happening simultaneously on the backend."

**What to do:**
- Point at the thumbnail, category, and priority pill on the review card
- Click **Submit Report**
- Show the validation overlay appearing
- Wait for the success alert showing the priority
- Click OK on the alert
- You are now back on the dashboard

---

### Screen: Citizen Dashboard (after submission)

**What to say:**
> "And we can see the new issue has appeared in the dashboard with status Open.
> The system has also sent a notification to the assigned zone authority automatically."

**What to do:**
- Point at the new issue in the list
- Click on the **Notifications** icon in the sidebar to briefly show the inbox

---

## 🎬 DEMO PART 2 — AUTHORITY PANEL

**What to say:**
> "Now let me switch to the Authority Panel. This is what a Surat Municipal Corporation
> field officer sees when they log in."

**What to do:**
- Switch to the browser tab showing `localhost:4201`
- Log in as authority@test.com if not already logged in

---

### Screen: Authority Dashboard

**What to say:**
> "The authority's dashboard shows all open issues in their assigned zone.
> Notice that the citizen's just-submitted pothole report is already appearing here —
> the auto-routing system assigned it based on zone matching at the time of creation.
>
> The authority can see the title, category, AI-verified priority badge,
> GPS location, and current status at a glance."

**What to do:**
- Point at the issue list
- Point at the priority badge on the new issue
- Click on the issue to open the detail view

---

### Screen: Authority Issue Detail

**What to say:**
> "The issue detail view shows everything — the citizen's evidence photo,
> the full description, the GPS coordinates, the AI confidence score,
> and the complete status history log at the bottom.
>
> The authority can now claim this task and update the status.
> Let me mark it as In Progress."

**What to do:**
- Show the image, description, location fields
- Scroll down to show the status history timeline
- Select **In Progress** from the status dropdown
- Type a remark: **"Team dispatched. Work to begin by tomorrow."**
- Click **Update Status**
- Show the success message
- Show the status history updating to include the new entry

**What to say:**
> "A notification has just been automatically created for the citizen,
> informing them that their issue is now In Progress.
> Every status transition is logged with a timestamp, the authority's name,
> and their remarks — creating a complete audit trail."

---

## 🎬 DEMO PART 3 — ADMIN PANEL

**What to say:**
> "Finally, let me show you the Admin Panel — the command center for city managers."

**What to do:**
- Switch to the browser tab showing `localhost:4200`
- Log in as admin@civicsense.com if not already logged in

---

### Screen: Admin Dashboard

**What to say:**
> "The admin dashboard shows four KPI cards at the top — Total Issues,
> Total Users, Total Notifications, and Total Messages. These run in parallel
> using Promise.all in the backend — a single API call fetches all four counts
> simultaneously for maximum efficiency.
>
> Below that are live charts — a line chart showing monthly issue trends,
> and a donut chart showing category distribution.
> These are generated using MongoDB aggregation pipelines.
> The monthly trend groups all issues by a formatted month-year string
> and counts them, then sorts chronologically."

**What to do:**
- Point at the four KPI cards
- Point at the monthly trend line chart
- Point at the category distribution donut chart

---

### Screen: Zone Monitoring (most impressive)

**What to say:**
> "This is the most technically sophisticated screen in the application —
> the Live Geo-Spatial Monitoring Dashboard.
>
> On the left sidebar you can see all seven municipal zones.
> On the map, you can see seven colored rectangular overlays — each representing
> a real zone of Surat city, with permanent labels.
>
> Each circle marker on the map represents a real reported issue.
> The color tells you the priority — red for High, amber for Medium, green for Low.
> These are Leaflet.js circle markers styled with cross-browser CSS transitions.
>
> Let me click on one of these issues in the stream table below the map."

**What to do:**
- Click on `Zone Monitoring` in the sidebar
- Let the map load
- Point at the zone rectangles on the map
- Point at the colored issue markers
- Click any row in the Issue Stream Intelligence table
- Show the map FLYING smoothly to that issue's location
- Show the radar pulse animation appearing
- Show the popup opening on the marker

**What to say:**
> "Notice that clicking the row triggered a flyTo animation on the map —
> flying smoothly to zoom level 17 at that issue's GPS coordinates.
> A radar pulse animation appears at the location, the relevant marker
> glows to highlight it, and its information popup opens automatically.
> This is done using Leaflet's animation API with easeLinear timing.
>
> Below the map, I can filter by Pending Only or Critical Only.
> I can also filter by time interval — Today, Last 7 Days, or Full Archive."

**What to do:**
- Click **Pending Only** toggle button
- Show the table updating
- Click **Critical Only** toggle
- Show it further filtering

---

### Screen: User Management

**What to say:**
> "The admin also has a full user management panel. They can search users by name
> or email using case-insensitive regex matching, filter by role, sort by
> any column, and update user roles or active status.
> They can deactivate an account without deleting it — maintaining data integrity."

**What to do:**
- Click **Users** in the admin sidebar
- Type a name in the search box and show filtering
- Open one user's edit panel briefly

---

### Screen: Notifications Panel

**What to say:**
> "The admin can send targeted notifications — either directly to a specific user
> by email, or as a broadcast to an entire role — all citizens, all authorities,
> or everyone. The notification type can be Info, Alert, Warning, or Success,
> each with its own visual style on the recipient's end."

**What to do:**
- Click **Notifications** in the sidebar
- Show the compose form briefly
- Point at the recipient type toggle (Individual vs. By Role)

---

## 🎬 DEMO CLOSING STATEMENT

**What to say:**
> "So to summarize what we just saw — a citizen reported an issue with GPS location,
> AI verification, and automatic zone routing. An authority received it, claimed
> the task, and updated the status. Admin had full visibility through the live map,
> analytics, and user management panels.
>
> Every interaction you saw was backed by proper validation, proper error handling,
> and real algorithmic logic — not just simple CRUD operations.
>
> I am now happy to open the floor to any technical questions."

---

## 🚨 IF THINGS GO WRONG — RECOVERY SCRIPTS

| Problem | What to say | What to do |
|:---|:---|:---|
| Backend crashes | "Let me quickly restart the server — this happens occasionally in a development environment." | `cd backend && npm run dev` in terminal |
| GPS doesn't trigger | "Since we are on a desktop without GPS, I will demonstrate the manual map click feature instead." | Click directly on the map to place a pin |
| Image upload fails | "The upload service may be rate-limited. Let me use a previously uploaded report to demonstrate the full flow." | Show an existing issue instead |
| Map doesn't render | "The map takes a moment to initialize. Let me navigate away and come back to allow the DOM to settle." | Go to dashboard and return |
| Login fails | "Let me check the credentials — I may need to use a backup account." | Use your seeded admin to reset the password quickly |
| Charts show no data | "The charts appear empty because the database needs seed data. Let me show the API response directly." | Open browser DevTools → Network → show XHR response |
| Zone not detected | "This demonstrates a known edge case — when GPS lands outside a zone polygon. The user must select the zone manually, which is exactly how the system is designed to handle this." | Manually select a zone from the dropdown |

---

## ⏱ TIME PLAN FOR DEMO

| Section | Time |
|:---|:---|
| Opening Script | 1.5 min |
| Citizen Panel (Login → Submit Issue) | 4–5 min |
| Authority Panel (Claim → Update Status) | 2–3 min |
| Admin Panel (Dashboard + Zone Map + Users) | 3–4 min |
| Closing Statement | 30 sec |
| **Total Demo Time** | **~11–13 minutes** |

---

```
╔══════════════════════════════════════════════════════╗
║        DEMO WALKTHROUGH SCRIPT — CivicSense          ║
║        Rev 1.0 | April 2026                          ║
║        Practice this LIVE at least 3 times           ║
║        before your actual presentation               ║
╚══════════════════════════════════════════════════════╝
```
