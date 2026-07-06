import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatBadgeModule, MatTooltipModule],
  template: `
    <div class="admin-shell" [class.dark-mode]="isDarkMode" [class.sidebar-collapsed]="isSidebarCollapsed" [class.mobile-open]="isMobileMenuOpen">
      <!-- MOBILE OVERLAY -->
      <div class="mobile-overlay" *ngIf="isMobileMenuOpen" (click)="toggleMobileMenu()"></div>

      <!-- SIDEBAR -->
      <aside class="sidebar luxe-shadow" [class.active]="isMobileMenuOpen">
        <div class="sidebar-brand">
          <div class="brand-hex">
            <mat-icon>account_balance</mat-icon>
          </div>
          <div class="brand-info">
            <h3>CivicSense</h3>
            <span class="badge-sys">Control Panel</span>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="nav-label">Command Center</span>
            
            <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" (click)="closeMobileMenu()">
              <mat-icon class="n-icon">dashboard_customize</mat-icon>
              <span class="n-label">Unified Overview</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Citizen Oversight</span>
            
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">
              <mat-icon class="n-icon">groups</mat-icon>
              <span class="n-label">Community Network</span>
            </a>

            <a routerLink="/admin/issues" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">
              <mat-icon class="n-icon">assignment_late</mat-icon>
              <span class="n-label">Citizen Reports</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Authority Network</span>
            
            <a routerLink="/admin/zone-map" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">
              <mat-icon class="n-icon">map</mat-icon>
              <span class="n-label">Zone Monitoring</span>
            </a>

            <a (click)="scrollToMap()" class="nav-link" style="cursor: pointer;">
              <mat-icon class="n-icon">grid_view</mat-icon>
              <span class="n-label">Grid Infrastructure</span>
            </a>
          </div>


          <div class="nav-section">
            <span class="nav-label">Security & Account</span>
            <a routerLink="/admin/profile" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">
              <mat-icon class="n-icon">person</mat-icon>
              <span class="n-label">Personnel Profile</span>
            </a>
            <a routerLink="/admin/change-password" routerLinkActive="active" class="nav-link" (click)="closeMobileMenu()">
              <mat-icon class="n-icon">lock_open</mat-icon>
              <span class="n-label">Access Credentials</span>
            </a>
          </div>
        </nav>

        <div class="sidebar-footer">
          <button class="logout-link" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <!-- MAIN VIEW -->
      <main class="main-view">
        <!-- TOP MONITOR -->
        <header class="top-monitor">
          <div class="monitor-left">
            <button class="toggle-btn" (click)="toggleSidebar()" *ngIf="!isMobile">
              <mat-icon>{{ isSidebarCollapsed ? 'menu_open' : 'menu' }}</mat-icon>
            </button>
            <button class="toggle-btn mobile-only" (click)="toggleMobileMenu()">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="monitor-path">
              <span class="path-root">Admin Console</span>
              <mat-icon class="path-sep">chevron_right</mat-icon>
              <span class="path-active">{{ pageTitle }}</span>
            </div>
          </div>

          <div class="monitor-right">
            <div class="system-pills">
              <div class="pill-live">
                <span class="pulse"></span>
                LIVE OPS
              </div>
            </div>

            <div class="monitor-tools">
              <button class="tool-btn" (click)="toggleTheme()" [title]="isDarkMode ? 'Light Mode' : 'Dark Mode'">
                <mat-icon>{{ isDarkMode ? 'wb_sunny' : 'nightlight_round' }}</mat-icon>
              </button>
              <button class="tool-btn" routerLink="/admin/notifications">
                <mat-icon>notifications</mat-icon>
                <span class="tool-dot"></span>
              </button>
            </div>

            <div class="admin-profile" *ngIf="authService.user$ | async as user">
              <div class="admin-avatar">
                <img src="https://ui-avatars.com/api/?name={{ user.name }}&background=0F172A&color=fff&bold=true" alt="Admin">
              </div>
              <div class="admin-meta hidden-mobile">
                <span class="a-name">{{ user.name }}</span>
                <span class="a-role">Root Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <h1 class="header-main-title" *ngIf="!router.url.includes('zone-map')">{{ pageTitle }}</h1>

        <!-- CONTENT BODY -->
        <div class="scroll-area luxe-fade" id="admin-main-viewport" [style.padding]="router.url.includes('zone-map') ? '0' : '0 40px 40px'">
          <div class="view-container" [style.max-width]="router.url.includes('zone-map') ? '100%' : '1400px'">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { --sidebar-width: 280px; --header-height: 80px; }

    .admin-shell, .admin-shell * { box-sizing: border-box; }
    .admin-shell {
      height: 100vh; width: 100%; overflow: hidden;
      background: white; font-family: 'Poppins', sans-serif;
      display: flex;
    }

    /* Sidebar */
    .sidebar {
      width: 280px; height: 100vh; background: white;
      display: flex; flex-direction: column; z-index: 1001;
      border-right: 1px solid #E2E8F0;
      flex-shrink: 0;
      transition: width 0.3s ease;
    }
    
    .sidebar-collapsed .sidebar { width: 80px; }
    .sidebar-collapsed .brand-info, 
    .sidebar-collapsed .n-label, 
    .sidebar-collapsed .nav-label, 
    .sidebar-collapsed .n-badge,
    .sidebar-collapsed .sidebar-footer span { display: none; }
    .sidebar-collapsed .sidebar-nav { padding: 0 8px; }
    .sidebar-collapsed .nav-link { justify-content: center; padding: 12px; }
    .sidebar-collapsed .sidebar-brand { padding: 24px 12px; justify-content: center; }

    .sidebar-brand { padding: 32px 24px; display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
    .brand-hex { 
      width: 44px; height: 44px; background: #1E3A5F; 
      border-radius: 12px; display: flex; align-items: center; justify-content: center; 
      color: white; flex-shrink: 0; box-shadow: 0 4px 12px rgba(30, 58, 95, 0.15);
    }
    .brand-info h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: #1E3A5F; letter-spacing: -0.5px; white-space: nowrap; }
    .badge-sys { font-size: 0.65rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; }

    .sidebar-nav { flex: 1; padding: 0 16px; overflow-y: auto; }
    .nav-section { margin-bottom: 32px; }
    .nav-label { font-size: 0.7rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px; margin-left: 14px; margin-bottom: 12px; display: block; }
    
    .nav-link {
      display: flex; align-items: center; gap: 12px; padding: 12px 14px;
      border-radius: 10px; color: #64748B; text-decoration: none; transition: 0.2s; margin-bottom: 4px;
      position: relative;
    }
    .nav-link:hover { background: #F8FAFC; color: #0F172A; }
    .nav-link.active { background: #F1F5F9; color: #2563EB; font-weight: 600; }
    .nav-link.active::before { content: ''; position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px; background: #2563EB; border-radius: 0 4px 4px 0; }
    
    .n-icon { font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }
    .n-label { font-size: 0.9rem; flex: 1; white-space: nowrap; }
    .n-badge { font-size: 0.7rem; font-weight: 700; background: #EF4444; color: white; padding: 2px 6px; border-radius: 6px; }

    .sidebar-footer { padding: 20px 16px; border-top: 1px solid #F1F5F9; }
    .logout-link {
      width: 100%; display: flex; align-items: center; gap: 12px;
      padding: 12px; background: transparent; border: 1px solid #F1F5F9;
      border-radius: 12px; color: #EF4444; font-weight: 600; font-size: 0.9rem;
      cursor: pointer; transition: 0.2s; white-space: nowrap; overflow: hidden;
    }
    .logout-link:hover { background: #FEF2F2; border-color: #FEE2E2; }

    /* Main View */
    .main-view { 
      flex: 1; 
      min-width: 0;
      width: calc(100% - 280px); /* Explicit fallback for flex items with wide children */
      display: flex; flex-direction: column; height: 100vh; 
      overflow: hidden; 
      position: relative;
      background: white;
    }
    
    .top-monitor {
      height: var(--header-height); padding: 0 40px; background: white; border-bottom: 1px solid #E2E8F0;
      display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
      z-index: 100;
    }

    .monitor-left { display: flex; align-items: center; gap: 20px; }
    .toggle-btn {
      background: transparent; border: none; color: #64748B; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      padding: 8px; border-radius: 8px; transition: 0.2s;
    }
    .toggle-btn:hover { background: #F1F5F9; color: #0F172A; }
    
    .monitor-path { display: flex; align-items: center; gap: 8px; }
    .path-root { font-size: 0.75rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; }
    .path-sep { font-size: 18px; color: #CBD5E1; }
    .path-active { font-size: 0.75rem; font-weight: 700; color: #2563EB; text-transform: uppercase; letter-spacing: 1px; }

    .monitor-right { display: flex; align-items: center; gap: 24px; }
    
    .pill-live {
      display: flex; align-items: center; gap: 8px; padding: 6px 12px;
      background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 20px;
      color: #166534; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.5px;
    }
    .pulse { width: 8px; height: 8px; background: #22C55E; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }

    .monitor-tools { display: flex; align-items: center; gap: 8px; }
    .tool-btn {
      width: 40px; height: 40px; border-radius: 10px; background: #F8FAFC; border: 1px solid #F1F5F9;
      color: #64748B; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
      position: relative;
    }
    .tool-btn:hover { background: #F1F5F9; color: #2563EB; border-color: #E2E8F0; }
    .tool-dot { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: #EF4444; border: 2px solid white; border-radius: 50%; }

    .admin-profile { display: flex; align-items: center; gap: 12px; padding-left: 16px; border-left: 1px solid #F1F5F9; }
    .admin-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid #F1F5F9; }
    .admin-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .admin-meta { display: flex; flex-direction: column; }
    .a-name { font-size: 0.85rem; font-weight: 700; color: #0F172A; }
    .a-role { font-size: 0.65rem; font-weight: 600; color: #94A3B8; text-transform: uppercase; }

    .header-main-title { margin: 24px 40px 0; font-size: 1.5rem; font-weight: 800; color: #0F172A; letter-spacing: -0.5px; }

    .scroll-area { 
      flex: 1; overflow-y: auto; overflow-x: hidden;
      padding: 0 40px 40px; scroll-behavior: smooth; 
      background: white; 
    }
    .view-container { max-width: 1400px; width: 100%; margin: 20px 0; }

    /* Mobile handling */
    .mobile-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
      z-index: 1000;
    }
    .mobile-only { display: none; }
    
    @media (max-width: 1024px) {
      .sidebar { position: fixed; left: -280px; z-index: 1001; }
      .sidebar.active { left: 0; }
      .mobile-only { display: block; }
      .hidden-mobile { display: none; }
      .main-view { width: 100%; }
      .top-monitor, .header-main-title, .scroll-area { padding-left: 20px; padding-right: 20px; }
    }

    /* DARK MODE OVERRIDES */
    .dark-mode { background: #0A0E1A !important; }
    .dark-mode .sidebar { background: #111827; border-color: rgba(255,255,255,0.05); }
    .dark-mode .brand-hex { background: #1F2937; border: 1px solid rgba(255,255,255,0.05); color: white; }
    .dark-mode .brand-info h3 { color: white !important; }
    .dark-mode .nav-link { color: #94A3B8; }
    .dark-mode .nav-link:hover { background: rgba(255,255,255,0.05); color: white; }
    .dark-mode .nav-link.active { background: rgba(37,99,235,0.1); color: #3B82F6; }
    .dark-mode .top-monitor { background: #111827; border-color: rgba(255,255,255,0.05); }
    .dark-mode .a-name { color: white; }
    .dark-mode .monitor-tools .tool-btn { background: #1F2937; border-color: rgba(255,255,255,0.05); color: #94A3B8; }
    .dark-mode .main-view { background: #0A0E1A; }
    .dark-mode .scroll-area { background: #0A0E1A; }
    .dark-mode .header-main-title { color: white; }

    .luxe-fade { animation: luxeFade 0.5s ease-out; }
    @keyframes luxeFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isDarkMode = false;
  isMobile = false;
  pageTitle = 'Dashboard';
  
  private mobileQuery: MediaQueryList;
  private _mobileQueryListener: (e: MediaQueryListEvent) => void;

  constructor(
    public authService: AuthService,
    private adminService: AdminService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.mobileQuery = window.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = (e: MediaQueryListEvent) => {
      this.isMobile = e.matches;
      this.cdr.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    this.router.events.subscribe(() => {
      this.updateTitle();
    });
  }

  ngOnInit() {
    this.updateTitle();
    // Initialize theme
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  updateTitle() {
    const url = this.router.url;
    if (url.includes('dashboard')) this.pageTitle = 'Mission Dashboard';
    else if (url.includes('users')) this.pageTitle = 'Community Network';
    else if (url.includes('issues')) this.pageTitle = 'Citizen Reports';
    else if (url.includes('zone-map')) this.pageTitle = 'Geospatial Intelligence';
    else if (url.includes('infrastructure')) this.pageTitle = 'Grid Infrastructure';
    else if (url.includes('intelligence')) this.pageTitle = 'Live Intelligence';
    else this.pageTitle = 'Admin Console';
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollToMap() {
    this.closeMobileMenu();
    if (!this.router.url.includes('/admin/dashboard')) {
      this.router.navigate(['/admin/dashboard']).then(() => {
        setTimeout(() => {
          const el = document.getElementById('admin-live-map');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      });
    } else {
      const el = document.getElementById('admin-live-map');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
