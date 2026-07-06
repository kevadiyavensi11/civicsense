
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatToolbarModule],
  template: `
    <mat-toolbar class="gov-navbar sticky-nav">
      <div class="navbar-content container">
        <div class="brand" routerLink="/">
          <div class="logo-box">
              <mat-icon>account_balance</mat-icon>
          </div>
          <div class="brand-info">
            <span class="brand-name">CivicSense</span>
            <span class="brand-sub">Modern Governance Portal</span>
          </div>
        </div>
        
        <span class="spacer"></span>
        
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
          <a routerLink="/issues" routerLinkActive="active" class="nav-link">Public Issues</a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link">About Us</a>
          <a routerLink="/contact" routerLinkActive="active" class="nav-link">Contact</a>
          
          <div class="nav-actions">
            <a routerLink="/login" class="btn btn-outline login-btn">Citizen Login</a>
            <a routerLink="/register" class="btn btn-primary register-btn">Report Issue</a>
          </div>
        </nav>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .gov-navbar {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      height: var(--nav-height) !important;
      padding: 0;
      width: 100%;
      border-bottom: 1px solid var(--border-light);
    }

    .navbar-content {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .logo-box {
      width: 44px;
      height: 44px;
      background: var(--primary);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(30, 58, 95, 0.2);
    }

    .logo-box mat-icon { font-size: 26px; width: 26px; height: 26px; }

    .brand-info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--primary);
      letter-spacing: -0.02em;
    }

    .brand-sub {
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .spacer { flex: 1; }

    .nav-links {
      display: flex;
      gap: 32px;
      align-items: center;
    }

    .nav-link {
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.95rem;
      text-decoration: none;
      padding: 8px 0;
      position: relative;
      transition: color 0.3s ease;
    }

    .nav-link:hover {
      color: var(--secondary);
    }

    .nav-link.active {
      color: var(--primary);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--secondary);
      border-radius: 2px;
    }

    .nav-actions {
      display: flex;
      gap: 16px;
      margin-left: 16px;
    }

    .login-btn {
      padding: 8px 20px;
      height: 44px;
    }

    .register-btn {
      padding: 8px 24px;
      height: 44px;
    }

    @media (max-width: 1024px) {
      .nav-links { gap: 20px; }
      .brand-sub { display: none; }
    }

    @media (max-width: 768px) {
      .nav-link:not(.login-btn):not(.register-btn) { display: none; }
      .nav-actions { margin-left: 0; }
    }
  `]
})
export class PublicNavbarComponent { }
