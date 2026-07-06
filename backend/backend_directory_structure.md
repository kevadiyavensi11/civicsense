# Backend Directory Structure

This document details the complete directory and file structure of the **CivicSense Backend** (`d:\khushi\backend`).

## Root Directory (`backend/`)

| File / Folder | Type | Description |
| :--- | :--- | :--- |
| `.env` | File | Environmental variables (DB Connection, API Keys, JWT Secrets). |
| `package.json` | File | Project manifest, dependencies, and run scripts. |
| `server.js` | File | **Entry Point**. Initializes Express, connects to DB, and bundles routes. |
| `seedAdmin.js` | Script | Creates the initial Super Admin account. |
| `seed_zones.js` | Script | Populates the database with default Zones (North, South, etc.). |
| `seed_areas.js` | Script | Populates initial sub-areas within zones. |
| `migrate_zones.js` | Script | Utility to migrate or fix zone data schema. |
| `serviceAccountKey.json` | File | Firebase Admin SDK credentials. |
| `src/` | Folder | **Main Source Code** (MVC Architecture). |

---

## Source Directory (`backend/src/`)

### 1. Config (`src/config/`)
Configuration modules for third-party services and database connectivity.
*   **`db.js`**: Establish connection to MongoDB Atlas.
*   **`cloudinary.js`**: Configuration for Cloudinary (Image Host).
*   **`firebase.js`**: Initialization of Firebase Admin SDK (Google Auth).

### 2. Controllers (`src/controllers/`)
Business logic helpers that handle requests and send responses.
*   **`adminController.js`**: Logic for admin-only actions (Analytics, User Ban, etc.).
*   **`areaController.js`**: CRUD operations for Areas.
*   **`issueController.js`**: Core logic for Reporting, Fetching, and Updating Issues.
*   **`userController.js`**: Authentication (Login/Register), Profile Mgmt, OAuth callbacks.
*   **`zoneController.js`**: Logic for fetching and managing Zones.

### 3. Middleware (`src/middleware/`)
Functions that execute during the request-response cycle.
*   **`authMiddleware.js`**: Validates JWT tokens and enforces Role-Based Access Control (RBAC).
*   **`uploadMiddleware.js`**: specific Multer configuration for handling file uploads (multipart/form-data).

### 4. Models (`src/models/`)
Mongoose schemas defining the data structure.
*   **`Area.js`**: Schema for sub-areas/localities.
*   **`Issue.js`**: Main schema for Citizen Reports (Location, Status, Image).
*   **`IssueStatus.js`**: Audit log schema for tracking issue status changes.
*   **`User.js`**: Unified schema for Citizens, Authorities, and Admins.
*   **`Zone.js`**: Schema for administrative Zones (polygons/points).

### 5. Routes (`src/routes/`)
API endpoints mapping URLs to Controllers.
*   **`adminRoutes.js`**: `/api/admin/*`
*   **`areaRoutes.js`**: `/api/areas/*`
*   **`issueRoutes.js`**: `/api/issues/*`
*   **`uploadRoutes.js`**: `/api/upload/*` (Helper for image upload)
*   **`userRoutes.js`**: `/api/users/*` (Auth & Profile)
*   **`zoneRoutes.js`**: `/api/zones/*`

### 6. Utils (`src/utils/`)
Helper functions and shared services.
*   **`aiEngine.js`**: Placeholder/Logic for AI image verification.
*   **`emailService.js`**: Nodemailer configuration for sending emails (OTP, Notifications).
*   **`geoService.js`**: Geolocation helpers (Reverse Geocoding, Distance Calculation).
*   **`routeValidator.js`**: Input validation helpers.
*   **`zoneMapper.js`**: Logic to map a coordinate/address to a specific Zone.
*   **`zoneResolver.js`**: Advanced zone resolution logic.

---

## Detailed Tree View

```text
backend/
├── .env
├── package.json
├── package-lock.json
├── server.js
├── seedAdmin.js
├── seed_areas.js
├── seed_zones.js
├── migrate_zones.js
├── serviceAccountKey.json
├── cleanup_dscac.js
├── inspectparams.js
├── scripts/
│   └── (Miscellaneous helper scripts)
│
└── src/
    ├── config/
    │   ├── cloudinary.js
    │   ├── db.js
    │   └── firebase.js
    │
    ├── controllers/
    │   ├── adminController.js
    │   ├── areaController.js
    │   ├── issueController.js
    │   ├── userController.js
    │   └── zoneController.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    │
    ├── models/
    │   ├── Area.js
    │   ├── Issue.js
    │   ├── IssueStatus.js
    │   ├── User.js
    │   └── Zone.js
    │
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── areaRoutes.js
    │   ├── issueRoutes.js
    │   ├── uploadRoutes.js
    │   ├── userRoutes.js
    │   └── zoneRoutes.js
    │
    └── utils/
        ├── aiEngine.js
        ├── emailService.js
        ├── geoService.js
        ├── routeValidator.js
        ├── zoneMapper.js
        └── zoneResolver.js
```
