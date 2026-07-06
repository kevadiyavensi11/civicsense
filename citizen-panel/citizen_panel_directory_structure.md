# Citizen Panel Directory Structure

This document details the structure of the **Citizen Panel** located at `d:\khushi\citizen-panel`. This is the dedicated Angular application for citizens to report and track civic issues.

## 1. Top-Level Directory
| File / Folder | Type | Description |
| :--- | :--- | :--- |
| `src/` | Folder | Main source code directory. |
| `angular.json` | File | Angular CLI configuration. |
| `package.json` | File | NPM dependencies and scripts. |
| `tsconfig.json` | File | TypeScript compiler options. |

---

## 2. Source Directory (`src/`)

| File / Folder | Type | Description |
| :--- | :--- | :--- |
| `app/` | Folder | Application logic (See detailed breakdown below). |
| `assets/` | Folder | Static resources (images, icons). |
| `index.html` | File | The single page HTML entry point. |
| `main.ts` | File | Bootstraps the Angular application. |
| `styles.css` | File | Global CSS styles. |

---

## 3. Application Directory (`src/app/`)

### 3.1. Components (`src/app/components/`)
Feature-specific UI pages and views.

*   **`landing/`** & **`landing-page/`**:
    *   The public homepage welcoming users to the CivicSense platform.
*   **`dashboard-citizen/`**: User's Stats Hub.
    *   Displays personal stats (Total Reports, Resolved, Pending) and a "Recent Activity" feed.
*   **`report-issue/`**: The Core Feature.
    *   Form to report new issues including Location (Map) and Photo Evidence.
*   **`issue-list/`**: My Reports.
    *   Displays a history of issues reported by the logged-in citizen.
*   **`issue-detail/`**: Single Report View.
    *   Shows the full timeline and status updates of a specific report.
*   **`login/`** & **`register/`**: Authentication.
    *   Login and Registration forms.
*   **`layout/`**: Shared Shell.
    *   Components for `navbar`, `sidebar`, and `footer`.

### 3.2. Services (`src/app/services/`)
Data access layer.

*   **`auth.service.ts`**: Handles Registration, Login, and Auth State.
*   **`issue.service.ts`**: API calls for reporting and fetching issues.
*   **`file-upload.service.ts`**: Helper for uploading images.

### 3.3. Core Utilities
*   **Guards (`src/app/guards/`)**:
    *   `auth.guard.ts`: Protects private routes from guest users.
*   **Interceptors (`src/app/interceptors/`)**:
    *   `auth.interceptor.ts`: Attaches JWT Token to HTTP requests.

### 3.4. Extra Utilities
*   **`data/`**: Static data or mock JSONs.
*   **`utils/`**: Helper functions (e.g., date formatters).
*   **`models/`**: TypeScript interfaces.

---

## 4. Detailed Tree View

```text
citizen-panel/
├── angular.json
├── package.json
└── src/
    ├── main.ts
    ├── index.html
    └── app/
        ├── app.component.ts
        ├── app.routes.ts
        ├── app.config.ts
        │
        ├── components/
        │   ├── landing/
        │   ├── dashboard-citizen/
        │   ├── report-issue/
        │   ├── issue-list/
        │   ├── issue-detail/
        │   ├── login/
        │   ├── register/
        │   └── layout/
        │
        ├── services/
        │   ├── auth.service.ts
        │   ├── issue.service.ts
        │   └── file-upload.service.ts
        │
        ├── guards/
        │   └── auth.guard.ts
        │
        ├── interceptors/
            └── auth.interceptor.ts
        │
        ├── data/  
        ├── utils/
        └── models/
```
