
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <aside class="modern-sidebar" *ngIf="authService.user$ | async as user">
      <!-- Authority Branding -->
      <div class="sidebar-brand">
        <div class="brand-logo">
          <mat-icon>account_balance</mat-icon>
        </div>
        <div class="brand-info">
          <h3>CivicSense</h3>
          <span class="badge-tag">Portal Admin</span>
        </div>
      </div>

      <!-- User Preview (Sidebar-Specific) -->
      <div class="user-peek">
        <div class="peeks-avatar">{{ user.email.charAt(0).toUpperCase() }}</div>
        <div class="peeks-content">
          <p class="p-name">{{ user.name || user.email.split('@')[0] }}</p>
          <p class="p-role">{{ user.role }}</p>
        </div>
      </div>

      <!-- Navigation System -->
      <nav class="sidebar-menu">
        <div class="menu-section">
          <span class="section-label">Oversight</span>
          
          <a routerLink="/authority/dashboard" routerLinkActive="active" class="menu-item">
            <mat-icon class="m-icon">space_dashboard</mat-icon>
            <span class="m-label">Overview Console</span>
          </a>

          <a routerLink="/authority/task-queue" routerLinkActive="active" class="menu-item">
            <mat-icon class="m-icon">assignment_late</mat-icon>
            <span class="m-label">Task Queue</span>
          </a>

          <a routerLink="/issues" routerLinkActive="active" class="menu-item">
            <mat-icon class="m-icon">grid_view</mat-icon>
            <span class="m-label">Central Feed</span>
          </a>
        </div>

        <div class="menu-section">
          <span class="section-label">Communication</span>
          <a routerLink="/authority/notifications" routerLinkActive="active" class="menu-item">
            <mat-icon class="m-icon">notifications_active</mat-icon>
            <span class="m-label">System Alerts</span>
          </a>
        </div>

        <!-- NEW Account Section -->
        <div class="menu-section">
          <span class="section-label">Security & Account</span>
          <a routerLink="/authority/profile" routerLinkActive="active" class="menu-item">
            <mat-icon class="m-icon">account_circle</mat-icon>
            <span class="m-label">Personnel Profile</span>
          </a>
          <a routerLink="/authority/change-password" routerLinkActive="active" class="menu-item">
            <mat-icon class="m-icon">lock_open</mat-icon>
            <span class="m-label">Access Credentials</span>
          </a>
        </div>
      </nav>

      <!-- Bottom Utilities -->
      <div class="sidebar-footer">
        <button class="sign-out-btn" (click)="logout()">
          <mat-icon>power_settings_new</mat-icon>
          <span>Deauthorize Session</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .modern-sidebar {
      height: 100vh;
      background: var(--bg-card);
      display: flex;
      flex-direction: column;
      color: var(--text-primary);
      border-right: 1px solid var(--border-light);
      font-family: 'Poppins', sans-serif;
      transition: background 0.3s ease, color 0.3s ease;
    }

    /* Branding */
    .sidebar-brand {
      padding: 32px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo {
      width: 44px; height: 44px; background: #1E3A5F;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      color: white; box-shadow: 0 4px 12px rgba(30, 58, 95, 0.15);
    }
    .brand-logo mat-icon { font-size: 24px; width: 24px; height: 24px; color: white; }
    .brand-info h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: #1E3A5F; letter-spacing: -0.5px; }
    .badge-tag { font-size: 0.65rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; }

    :host-context(body.dark-theme) .brand-info h3 { color: white; }
    :host-context(body.dark-theme) .brand-logo { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); }

    /* User Peek */
    .user-peek {
      margin: 0 16px 24px;
      padding: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .peeks-avatar {
      width: 36px; height: 36px; background: #334155; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: #94A3B8;
    }
    .peeks-content { overflow: hidden; }
    .p-name { margin: 0; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
    .p-role { margin: 0; font-size: 0.7rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; }

    /* Menu System */
    .sidebar-menu { flex: 1; padding: 0 16px; }
    .menu-section { margin-bottom: 32px; }
    .section-label { font-size: 0.7rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1.5px; margin-left: 12px; margin-bottom: 12px; display: block; }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 8px;
      color: #94A3B8;
      transition: 0.2s;
      margin-bottom: 4px;
      position: relative;
    }
    .menu-item:hover { background: var(--bg-main); color: var(--secondary); }
    .menu-item.active { background: rgba(37, 99, 235, 0.1); color: var(--secondary); font-weight: 600; }
    .menu-item.active::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; background: var(--secondary); border-radius: 0 4px 4px 0; }

    .m-icon { font-size: 20px; width: 20px; height: 20px; }
    .m-label { font-size: 0.9rem; font-weight: 500; flex: 1; }
    .m-count { font-size: 0.7rem; font-weight: 700; background: #B91C1C; color: white; padding: 2px 6px; border-radius: 10px; }

    /* Footer */
    .sidebar-footer { padding: 20px 16px; border-top: 1px solid var(--border-light); }
    .sign-out-btn {
      width: 100%; display: flex; align-items: center; gap: 12px;
      padding: 12px; background: transparent; border: 1px solid var(--border-light);
      border-radius: 10px; color: #EF4444; font-weight: 600; font-size: 0.9rem;
      cursor: pointer; transition: 0.2s;
    }
    .sign-out-btn:hover { background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2); }
  `]
})
export class SidebarComponent {
    authService = inject(AuthService);
    logout() {
        this.authService.logout().subscribe();
    }
}
