# Authority Panel Directory Structure

This document provides a comprehensive breakdown of the **Authority Panel** (`d:\khushi\authority-panel`). This Angular application is designed for municipal authorities and zone officials to manage, track, and resolve citizen-reported issues.

## 1. Top-Level Directory
| File / Folder | Type | Description |
| :--- | :--- | :--- |
| `src/` | Folder | Main source code directory. |
| `angular.json` | File | Workspace configuration for Angular CLI. |
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

*   **`dashboard-authority/`**: The Command Center.
    *   `dashboard-authority.component.ts`: Logic for jurisdictional map, task stats (Pending vs Resolved), and queue overview.
*   **`issue-list/`**: Task Management.
    *   `issue-list.component.ts`: Filterable table view of assigned issues. Supports sorting by Priority and Status.
*   **`issue-detail/`**: Work View.
    *   `issue-detail.component.ts`: Full view of a single issue. Includes action buttons to "Resolve", "Reject" or "In Progress".
*   **`login/`**: Authority Authentication.
*   **`layout/`**: Shared Shell.
    *   Contains `navbar/`, `sidebar/`, and `footer/` components specific to the Authority role.
*   **`dialogs/`**: Pop-up Modals.
    *   **`profile-dialog/`**: Edit personal details (Phone, Zone).
    *   **`settings-dialog/`**: Application preferences.

### 3.2. Services (`src/app/services/`)
Data access layer.

*   **`auth.service.ts`**: Handles Authority Login/Logout and JWT management.
*   **`issue.service.ts`**: Fetches issues assigned to the logged-in authority's zone. Handles status updates.
*   **`file-upload.service.ts`**: Helper for uploading "Resolved" proof images.
*   **`admin.service.ts`**: (Legacy/Shared) Admin-related utilities if needed.

### 3.3. Core Utilities
*   **Guards (`src/app/guards/`)**:
    *   `auth.guard.ts`: Ensures user is logged in.
    *   `role.guard.ts`: Ensures user has the 'AUTHORITY' role.
*   **Interceptors (`src/app/interceptors/`)**:
    *   `auth.interceptor.ts`: Attaches the JWT Bearer token to HTTP requests.

### 3.4. Models (`src/app/models/`)
TypeScript Interfaces.
*   `issue.model.ts`: Defines shape of Issue data.
*   `user.model.ts`: Defines shape of User data.

---

## 4. Detailed Tree View

```text
authority-panel/
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
        │   ├── dashboard-authority/
        │   │   └── dashboard-authority.component.ts
        │   ├── issue-list/
        │   │   └── issue-list.component.ts
        │   ├── issue-detail/
        │   │   └── issue-detail.component.ts
        │   ├── login/
        │   ├── layout/
        │   │   ├── navbar/
        │   │   └── sidebar/
        │   └── dialogs/
        │       ├── profile-dialog/
        │       └── settings-dialog/
        │
        ├── services/
        │   ├── auth.service.ts
        │   ├── issue.service.ts
        │   ├── file-upload.service.ts
        │   └── admin.service.ts
        │
        ├── guards/
        │   ├── auth.guard.ts
        │   └── role.guard.ts
        │
        └── interceptors/
            └── auth.interceptor.ts
```
