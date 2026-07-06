
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
    <mat-toolbar class="gov-navbar">
      <div class="navbar-content">
        <div class="brand" routerLink="/">
          <div class="logo-box">
              <mat-icon>account_balance</mat-icon>
          </div>
          <div class="brand-info">
            <span class="brand-name">CivicSense</span>
            <span class="brand-sub">Civic Governance System</span>
          </div>
        </div>
        
        <span class="spacer"></span>
        
        <div class="nav-links">
          <a mat-button routerLink="/" class="nav-link">Home</a>
          <a mat-button routerLink="/issues" class="nav-link">Public Issues</a>
          <a mat-stroked-button color="primary" routerLink="/login" class="login-btn">Official Login</a>
          <a mat-raised-button color="primary" routerLink="/register" class="register-btn">Get Started</a>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .gov-navbar {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(15px);
      height: 80px !important;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid #e2e8f0;
      padding: 0 10%;
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
      gap: 16px;
      cursor: pointer;
    }

    .logo-box {
      width: 44px;
      height: 44px;
      background: #0F4C81;
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(15, 76, 129, 0.3);
    }

    .logo-box mat-icon { font-size: 28px; width: 28px; height: 28px; }

    .brand-info {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .brand-name {
      font-family: 'Outfit', 'Inter', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      color: #0F4C81;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }

    .brand-sub {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .spacer { flex: 1; }

    .nav-links {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .nav-link {
      font-weight: 600;
      color: #475569;
      font-size: 0.95rem;
    }

    .login-btn {
      border-width: 2px;
      font-weight: 700;
      color: #0F4C81;
      border-color: #0F4C81;
      height: 42px;
      padding: 0 20px;
    }

    .register-btn {
      background: #0F4C81 !important;
      color: white;
      font-weight: 700;
      height: 42px;
      padding: 0 24px;
      box-shadow: 0 4px 12px rgba(15, 76, 129, 0.2);
    }

    @media (max-width: 768px) {
      .gov-navbar { padding: 0 24px; }
      .brand-sub { display: none; }
      .nav-link { display: none; }
    }
  `]
})
export class PublicNavbarComponent { }
