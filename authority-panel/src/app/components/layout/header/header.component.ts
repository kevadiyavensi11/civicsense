
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, RouterModule],
  template: `
    <header class="admin-header" *ngIf="user$ | async as user">
      <div class="h-main">
        <div class="h-left">
          <div class="h-breadcrumb">
            <span class="root-node">Authority</span>
            <mat-icon class="crumb-sep">chevron_right</mat-icon>
            <span class="current-node">{{ user.role === 'authority' ? 'Municipal Oversight' : 'Console' }}</span>
          </div>
          <h1 class="page-title">Regional Governance Console</h1>
        </div>

        <div class="h-right">
          <div class="quick-stats">
            <div class="stat-pill">
              <span class="dot-live"></span>
              <span class="stat-label">Live Ops</span>
            </div>
          </div>

          <div class="action-items">
            <button class="icon-tool" (click)="toggleTheme()" [title]="($any(user).themePreference === 'dark') ? 'Switch to Day Mode' : 'Switch to Night Mode'">
              <mat-icon>{{ ($any(user).themePreference === 'dark') ? 'wb_sunny' : 'nightlight_round' }}</mat-icon>
            </button>
            
            <button class="icon-tool" [routerLink]="['/authority/notifications']" title="Priority Notifications">
              <mat-icon>notifications</mat-icon>
              <span class="badge-dot" *ngIf="((unreadCount$ | async) || 0) > 0"></span>
            </button>
          </div>

          <div class="profile-trigger" [matMenuTriggerFor]="userMenu">
            <div class="avatar-ring">
              <img src="https://ui-avatars.com/api/?name={{ user.email }}&background=1E3A5F&color=fff&bold=true" alt="Avatar">
            </div>
            <div class="profile-labels">
              <span class="p-user">{{ user.email.split('@')[0] }}</span>
              <span class="p-rank">{{ user.role === 'admin' ? 'Strategic Admin' : 'Authority Officer' }}</span>
            </div>
          </div>

          <mat-menu #userMenu="matMenu" class="premium-menu">
            <div class="menu-header">
              <div class="menu-email-box">
                <p class="m-email">{{ user.email }}</p>
              </div>
            </div>
            <button mat-menu-item [routerLink]="['/authority/profile']">
              <mat-icon>verified_user</mat-icon><span>Personnel Identity</span>
            </button>
            <button mat-menu-item [routerLink]="['/authority/change-password']">
              <mat-icon>security</mat-icon><span>Access Credentials</span>
            </button>
            <button mat-menu-item (click)="toggleTheme()">
              <mat-icon>{{ ($any(user).themePreference === 'dark') ? 'wb_sunny' : 'nightlight_round' }}</mat-icon>
              <span>{{ ($any(user).themePreference === 'dark') ? 'Daylight Protocol' : 'Midnight Operations' }}</span>
            </button>
            <hr class="m-divider">
            <button mat-menu-item (click)="logout()" class="logout-item">
              <mat-icon>logout</mat-icon><span>Deauthorize Session</span>
            </button>
          </mat-menu>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .admin-header {
      background: var(--bg-card);
      height: 80px;
      padding: 0 40px;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      position: relative;
      z-index: 1001;
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    .h-main { display: flex; justify-content: space-between; align-items: center; width: 100%; }

    .h-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .crumb-sep { font-size: 14px; width: 14px; height: 14px; }
    .current-node { color: var(--secondary); }

    .page-title { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }

    .h-right { display: flex; align-items: center; gap: 32px; }

    .stat-pill { display: flex; align-items: center; gap: 8px; background: #F0FDF4; border: 1px solid #DCFCE7; padding: 4px 12px; border-radius: 100px; }
    .dot-live { width: 6px; height: 6px; background: #16A34A; border-radius: 50%; box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1); }
    .stat-label { font-size: 0.75rem; font-weight: 700; color: #166534; text-transform: uppercase; }

    .action-items { display: flex; gap: 8px; }
    .icon-tool { 
      width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border-light); background: transparent; 
      display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: 0.2s;
      position: relative;
    }
    .icon-tool:hover { background: #F8FAFC; border-color: var(--secondary); color: var(--secondary); }
    .icon-tool mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .badge-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: #EF4444; border-radius: 50%; border: 2px solid var(--bg-card); box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }

    .profile-trigger { display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 6px 12px; border-radius: 14px; transition: 0.2s; }
    .profile-trigger:hover { background: var(--bg-main); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    .avatar-ring { width: 40px; height: 40px; border-radius: 10px; overflow: hidden; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .avatar-ring img { width: 100%; height: 100%; object-fit: cover; }

    .profile-labels { display: flex; flex-direction: column; line-height: 1.2; }
    .p-user { font-weight: 700; font-size: 0.9rem; color: var(--text-primary); text-transform: capitalize; }
    .p-rank { font-size: 0.7rem; color: var(--secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Menu Styling */
    .premium-menu { border-radius: 12px !important; margin-top: 8px !important; }
    .menu-header { padding: 12px 16px; background: var(--bg-main); margin-bottom: 8px; }
    .m-email { margin: 0; font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
    .m-divider { border: none; border-top: 1px solid var(--border-light); margin: 8px 0; }
    .logout-item { color: #EF4444 !important; }

    /* Dark Mode Variations handled by variables now */
    .icon-tool:hover { background: var(--bg-main); border-color: var(--secondary); color: var(--secondary); }
    .user-control:hover { background: var(--bg-main); }
  `]
})
export class HeaderComponent implements OnInit {
    authService = inject(AuthService);
    notificationService = inject(NotificationService);
    router = inject(Router);
    user$ = this.authService.user$;
    unreadCount$ = this.notificationService.unreadCount$;

    ngOnInit() {
        // Initial load to sync the count
        this.notificationService.refreshCount();
    }

    logout() {
        this.authService.logout().subscribe();
    }

    toggleTheme() {
        this.authService.toggleTheme();
    }
}
