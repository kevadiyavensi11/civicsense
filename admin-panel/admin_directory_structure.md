# Admin Panel Directory Structure

This document provides a comprehensive breakdown of the **Admin Panel** (`d:\khushi\admin-panel`), which is an Angular standalone application designed for system administrators.

## 1. Top-Level Directory
| File / Folder | Type | Description |
| :--- | :--- | :--- |
| `src/` | Folder | Main source code directory. |
| `public/` | Folder | Static assets (favicons, images). |
| `angular.json` | File | Workspace configuration for Angular CLI. |
| `package.json` | File | NPM dependencies and scripts. |
| `tsconfig.json` | File | TypeScript compiler options. |
| `server.ts` | File | Express server wrapper for SSR (Server-Side Rendering). |

---

## 2. Source Directory (`src/`)
The core application code lives here.

| File / Folder | Type | Description |
| :--- | :--- | :--- |
| `app/` | Folder | Contains the application logic (Wait for detailed breakdown below). |
| `environments/` | Folder | Environment specific variables (`environment.ts`). |
| `index.html` | File | The single page HTML entry point. |
| `main.ts` | File | Bootstraps the Angular application. |
| `styles.css` | File | Global CSS styles and Tailwind imports. |

---

## 3. Application Directory (`src/app/`)
This is where the feature modules and components reside.

### 3.1. Components (`src/app/components/`)
UI Views and Feature Pages.

*   **`admin-login/`**: The login page for Administrators.
    *   `admin-login.component.ts`: Logic for login form submission.
    *   `admin-login.component.html`: Template for the login form.
*   **`dashboard-admin/`**: The main landing page after login.
    *   Displays high-level metrics (Total Users, Open Issues, etc.).
*   **`issues/`**: Issue Management.
    *   **`issue-list/`**: Data table displaying all issues in the system with filters.
    *   **`issue-view-dialog/`**: read-only detailed view modal for a specific issue.
    *   **`issue-status-dialog/`**: Modal to change an issue's status (e.g., Open -> Resolved).
*   **`users/`**: User Management.
    *   **`user-list/`**: Data table displaying all registered users (Citizens, Authorities).
    *   **`user-view/`**: Read-only profile view of a user.
    *   **`user-form/`**: Form to create or edit Authority accounts.

### 3.2. Shared (`src/app/shared/`)
Reusable code used across multiple components.
*   `components/`: Shared UI elements (e.g., Navbars, Sidebar).
*   `services/`: Shared utilities.

### 3.3. Services (`src/app/services/`)
Data access layer communicating with the Backend API.
*   **`admin.service.ts`**: Handles API calls for fetching issues, users, and stats.
*   **`auth.service.ts`**: Handles Login/Logout logic and local storage of JWT tokens.

### 3.4. Core Utilities
*   **Guards (`src/app/guards/`)**:
    *   `auth.guard.ts`: Protects admin routes from non-authenticated access.
*   **Interceptors (`src/app/interceptors/`)**:
    *   `auth.interceptor.ts`: Automatically attaches the JWT Bearer token to every outgoing HTTP request.

### 3.5. Configuration Files
*   **`app.routes.ts`**: Defines the navigation paths (`/admin/login`, `/admin/dashboard`, etc.).
*   **`app.config.ts`**: Application-wide providers (HTTP Client, Animations).

---

## 4. Detailed Tree View

```text
admin-panel/
├── angular.json
├── package.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    ├── environments/
    │   └── environment.ts
    └── app/
        ├── app.component.ts
        ├── app.routes.ts       <-- Route Definitions
        ├── app.config.ts       <-- Global Config
        │
        ├── components/
        │   ├── admin-login/
        │   ├── dashboard-admin/
        │   ├── issues/
        │   │   ├── issue-list/
        │   │   ├── issue-status-dialog/
        │   │   └── issue-view-dialog/
        │   └── users/
        │       ├── user-list/
        │       ├── user-form/
        │       └── user-view/
        │
        ├── shared/
        │   └── components/     <-- Reusable UI (Sidebar/Navbar)
        │
        ├── services/
        │   ├── admin.service.ts
        │   └── auth.service.ts
        │
        ├── guards/
        │   └── auth.guard.ts
        │
        └── interceptors/
            └── auth.interceptor.ts
```
