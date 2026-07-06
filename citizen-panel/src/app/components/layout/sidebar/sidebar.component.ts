
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
    <aside class="premium-sidebar" *ngIf="authService.user$ | async as user">
      <!-- Branding Area -->
      <div class="sidebar-header">
        <div class="logo-box">
          <mat-icon>account_balance</mat-icon>
        </div>
        <div class="brand-text">
          <h3>CivicSense</h3>
          <span>Citizen Portal</span>
        </div>
      </div>

      <!-- Quick User Card -->
      <div class="user-card-mini">
        <div class="u-avatar">{{ user.email.charAt(0).toUpperCase() }}</div>
        <div class="u-meta">
          <p class="u-name">{{ user.name || user.email.split('@')[0] }}</p>
          <p class="u-zone">{{ user.area || 'Active Citizen' }}</p>
        </div>
      </div>

      <!-- Navigation System -->
      <nav class="sidebar-nav">
        <div class="nav-group">
          <span class="nav-label">Main Dashboard</span>
          <a routerLink="/citizen/dashboard" routerLinkActive="active" class="nav-item">
            <mat-icon>space_dashboard</mat-icon> 
            <span>Personal Console</span>
          </a>
          <a routerLink="/citizen/report" routerLinkActive="active" class="nav-item">
            <mat-icon>add_chart</mat-icon> 
            <span>Report New Issue</span>
          </a>
        </div>

        <div class="nav-group">
          <span class="nav-label">Civic Network</span>
          <a routerLink="/issues" routerLinkActive="active" class="nav-item">
            <mat-icon>feed</mat-icon> 
            <span>Public Issues Feed</span>
          </a>
          <a routerLink="/citizen/notifications" routerLinkActive="active" class="nav-item">
            <mat-icon>notifications_none</mat-icon> 
            <span>Announcements</span>
          </a>
        </div>

        <div class="nav-group">
          <span class="nav-label">Security & Account</span>
          <a routerLink="/citizen/profile" routerLinkActive="active" class="nav-item">
            <mat-icon>person</mat-icon> 
            <span>My Profile</span>
          </a>
          <a routerLink="/citizen/change-password" routerLinkActive="active" class="nav-item">
            <mat-icon>lock_open</mat-icon> 
            <span>Access Settings</span>
          </a>
        </div>
      </nav>

      <!-- Footer Actions -->
      <div class="sidebar-footer">
        <button class="logout-link" (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Deauthorize Portal</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .premium-sidebar {
      height: 100vh;
      background: white;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border-light);
      font-family: 'Poppins', sans-serif;
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    /* Branding */
    .sidebar-header {
      padding: 32px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-box {
      width: 44px; height: 44px; background: var(--primary);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      color: white; box-shadow: 0 4px 12px rgba(30, 58, 95, 0.15);
    }
    .logo-box mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .brand-text h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--primary); letter-spacing: -0.5px; }
    .brand-text span { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

    /* User Mini Card */
    .user-card-mini {
      margin: 0 16px 32px;
      padding: 16px;
      background: #F8FAFC;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid var(--border-light);
    }
    .u-avatar {
      width: 40px; height: 40px; background: var(--secondary); border-radius: 10px;
      display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;
    }
    .u-name { margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .u-zone { margin: 0; font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; }

    /* Navigation */
    .sidebar-nav { flex: 1; padding: 0 16px; }
    .nav-group { margin-bottom: 32px; }
    .nav-label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-left: 14px; margin-bottom: 12px; display: block; }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      color: var(--text-secondary);
      transition: 0.2s;
      margin-bottom: 4px;
      text-decoration: none;
    }
    .nav-item:hover { background: #F1F5F9; color: var(--primary); }
    .nav-item.active { background: #EFF6FF; color: var(--secondary); font-weight: 600; }
    .nav-item mat-icon { font-size: 20px; width: 20px; height: 20px; }

    /* Footer */
    .sidebar-footer { padding: 24px 16px; border-top: 1px solid var(--border-light); }
    .logout-link {
      width: 100%; display: flex; align-items: center; gap: 12px;
      padding: 12px; background: transparent; border: 1px solid #F1F5F9;
      border-radius: 12px; color: #EF4444; font-weight: 600; font-size: 0.9rem;
      cursor: pointer; transition: 0.2s;
    }
    .logout-link:hover { background: #FEF2F2; border-color: #FEE2E2; }

    /* DARK THEME ADAPTATION */
    :host-context(body.dark-theme) .premium-sidebar {
      background: #0F172A;
      border-right-color: rgba(255, 255, 255, 0.05);
    }
    :host-context(body.dark-theme) .brand-text h3 { color: white; }
    :host-context(body.dark-theme) .user-card-mini {
      background: #1e293b;
      border-color: rgba(255, 255, 255, 0.05);
    }
    :host-context(body.dark-theme) .u-name { color: white; }
    :host-context(body.dark-theme) .u-zone { color: #94A3B8; }
    :host-context(body.dark-theme) .nav-item { color: #94A3B8; }
    :host-context(body.dark-theme) .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
    :host-context(body.dark-theme) .nav-item.active {
      background: rgba(37, 99, 235, 0.1);
      color: #3b82f6;
    }
    :host-context(body.dark-theme) .sidebar-footer {
      border-top-color: rgba(255, 255, 255, 0.05);
    }
    :host-context(body.dark-theme) .logout-link {
      border-color: rgba(255, 255, 255, 0.05);
    }
  `]
})
export class SidebarComponent {
    authService = inject(AuthService);
    logout() {
        this.authService.logout().subscribe();
    }
}
