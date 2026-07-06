
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, RouterModule],
  template: `
    <header class="citizen-header" *ngIf="user$ | async as user">
      <div class="h-main">
        <div class="h-left">
          <div class="h-path">
            <span class="root">Citizen Portal</span>
            <mat-icon class="sep">chevron_right</mat-icon>
            <span class="leaf">My Workspace</span>
          </div>
          <h1 class="page-name">{{ pageTitle }}</h1>
        </div>

        <div class="h-right">
          <!-- Notification & Theme Tools -->
          <div class="tool-belt">
            <button class="tool-btn" (click)="toggleTheme()" [title]="isDark ? 'Switch to Light' : 'Switch to Dark'">
              <mat-icon>{{ isDark ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
            <button class="tool-btn" [routerLink]="['/citizen/notifications']">
              <mat-icon>notifications</mat-icon>
              <span class="indicator"></span>
            </button>
          </div>

          <!-- Profile Control -->
          <div class="profile-trigger" [matMenuTriggerFor]="userMenu">
            <div class="avatar-ring">
              <img src="https://ui-avatars.com/api/?name={{ user.email }}&background=2563EB&color=fff&bold=true" alt="User">
            </div>
            <div class="profile-labels">
              <span class="p-user">{{ user.email.split('@')[0] }}</span>
              <span class="p-rank">Citizen Contributor</span>
            </div>
          </div>

          <mat-menu #userMenu="matMenu" class="premium-menu">
            <div class="menu-header">
              <div class="menu-email-box">
                <p class="m-email">{{ user.email }}</p>
              </div>
            </div>
            <button mat-menu-item [routerLink]="['/citizen/profile']">
              <mat-icon>verified_user</mat-icon><span>My Account Identity</span>
            </button>
            <button mat-menu-item [routerLink]="['/citizen/change-password']">
              <mat-icon>security</mat-icon><span>Access Credentials</span>
            </button>
            <hr class="m-divider">
            <button mat-menu-item (click)="logout()" class="logout-item">
              <mat-icon>logout</mat-icon><span>Sign Out of Portal</span>
            </button>
          </mat-menu>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .citizen-header {
      height: 80px;
      padding: 0 40px;
      background: white;
      display: flex;
      align-items: center;
      font-family: 'Poppins', sans-serif;
    }

    .h-main { display: flex; justify-content: space-between; align-items: center; width: 100%; }

    .h-path { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .sep { font-size: 14px; width: 14px; height: 14px; }
    .leaf { color: var(--secondary); }

    .page-name { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--primary); letter-spacing: -0.5px; }

    .h-right { display: flex; align-items: center; gap: 32px; }

    .tool-belt { display: flex; gap: 12px; }
    .tool-btn {
      width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border-light); background: transparent;
      display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: 0.2s; position: relative;
    }
    .tool-btn:hover { background: #F8FAFC; border-color: var(--secondary); color: var(--secondary); transform: translateY(-2px); }
    .tool-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .indicator { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: #EF4444; border-radius: 50%; border: 2px solid white; }

    .profile-trigger { display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 6px 12px; border-radius: 14px; transition: 0.2s; }
    .profile-trigger:hover { background: #F8FAFC; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    .avatar-ring { width: 40px; height: 40px; border-radius: 10px; overflow: hidden; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .avatar-ring img { width: 100%; height: 100%; object-fit: cover; }

    .profile-labels { display: flex; flex-direction: column; line-height: 1.2; }
    .p-user { font-weight: 700; font-size: 0.9rem; color: var(--primary); text-transform: capitalize; }
    .p-rank { font-size: 0.7rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Menu Styling */
    .premium-menu { border-radius: 12px !important; margin-top: 8px !important; }
    .menu-header { padding: 12px 16px; background: #F8FAFC; margin-bottom: 8px; }
    .m-email { margin: 0; font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
    .m-divider { border: none; border-top: 1px solid var(--border-light); margin: 8px 0; }
    .logout-item { color: #EF4444 !important; }

    /* Dark Mode Variations */
    :host-context(body.dark-theme) .citizen-header {
      background: #0F172A;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    :host-context(body.dark-theme) .page-name { color: white; }
    :host-context(body.dark-theme) .h-path .root { color: #94A3B8; }
    :host-context(body.dark-theme) .tool-btn { border-color: rgba(255, 255, 255, 0.1); color: #94A3B8; }
    :host-context(body.dark-theme) .tool-btn:hover { background: rgba(255, 255, 255, 0.05); color: white; }
    :host-context(body.dark-theme) .indicator { border-color: #0F172A; }
    :host-context(body.dark-theme) .profile-trigger:hover { background: rgba(255, 255, 255, 0.05); }
    :host-context(body.dark-theme) .p-user { color: white; }
    :host-context(body.dark-theme) .p-rank { color: #94A3B8; }
    :host-context(body.dark-theme) .avatar-ring { border-color: #1e293b; }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);
  user$ = this.authService.user$;

  logout() {
    this.authService.logout().subscribe();
  }

  get isDark() {
    return document.body.classList.contains('dark-theme');
  }

  get pageTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Personal Console';
    if (url.includes('/notifications')) return 'System Announcements';
    if (url.includes('/issues')) return 'Civic Network Feed';
    if (url.includes('/report')) return 'Incident Reporting';
    if (url.includes('/profile')) return 'Account Settings';
    return 'Civic Engagement Dashboard';
  }

  toggleTheme() {
    this.authService.toggleTheme();
  }
}
