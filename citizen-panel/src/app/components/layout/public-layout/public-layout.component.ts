
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatIconModule, PublicNavbarComponent],
  template: `
    <div class="public-layout">
      <app-public-navbar></app-public-navbar>
      
      <main class="public-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="modern-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            <div class="f-logo">
              <mat-icon>account_balance</mat-icon>
              <span>CivicSense</span>
            </div>
            <p class="f-desc">
              National Digital Governance Initiative for seamless citizen-authority collaboration.
            </p>
            <div class="social-links">
              <a href="#"><mat-icon>facebook</mat-icon></a>
              <a href="#"><mat-icon>public</mat-icon></a>
              <a href="#"><mat-icon>email</mat-icon></a>
            </div>
          </div>
          
          <div class="footer-links">
            <h4>Quick Access</h4>
            <a routerLink="/">Home Portal</a>
            <a routerLink="/issues">Issue Feed</a>
            <a routerLink="/register">Register Complaint</a>
            <a routerLink="/login">Official Login</a>
          </div>
          
          <div class="footer-links">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Report Bug</a>
          </div>
          
          <div class="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get the latest governance updates directly.</p>
            <div class="newsletter-input">
              <input type="email" placeholder="Email address">
              <button class="btn btn-secondary">Join</button>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="container border-top">
            <p>&copy; 2026 CivicSense Central Portal. All rights reserved.</p>
            <div class="f-meta">
              <span>Smart City Initiative</span>
              <span>ISO 9001 Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .public-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .public-content { flex: 1; }

    .modern-footer {
      background: #0F172A;
      color: white;
      padding: 80px 0 0;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
      gap: 60px;
      padding-bottom: 60px;
    }

    .f-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 24px;
    }
    .f-logo mat-icon { color: var(--secondary); font-size: 32px; width: 32px; height: 32px; }

    .f-desc {
      color: #94A3B8;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 24px;
      max-width: 300px;
    }

    .social-links { display: flex; gap: 16px; }
    .social-links a {
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(255,255,255,0.05);
      display: flex; align-items: center; justify-content: center;
      color: #94A3B8; transition: 0.3s;
    }
    .social-links a:hover { background: var(--secondary); color: white; transform: translateY(-3px); }

    .footer-links h4, .footer-newsletter h4 {
      color: white; font-size: 1.1rem; font-weight: 600; margin-bottom: 24px;
    }

    .footer-links a {
      display: block; color: #94A3B8; font-size: 0.95rem; margin-bottom: 12px;
      transition: 0.3s;
    }
    .footer-links a:hover { color: var(--secondary); transform: translateX(5px); }

    .footer-newsletter p { color: #94A3B8; font-size: 0.95rem; margin-bottom: 20px; }
    .newsletter-input {
      display: flex; gap: 8px; background: rgba(255,255,255,0.05);
      padding: 6px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1);
    }
    .newsletter-input input {
      background: transparent; border: none; outline: none; color: white; padding: 0 12px; flex: 1; font-size: 0.9rem;
    }
    .newsletter-input button { padding: 8px 16px; font-size: 0.85rem; }

    .footer-bottom {
      background: #020617;
      padding: 24px 0;
      font-size: 0.85rem;
      color: #64748B;
    }
    .border-top {
      border-top: 1px solid rgba(255,255,255,0.05);
      padding-top: 24px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .f-meta { display: flex; gap: 24px; }
    .f-meta span { border-left: 1px solid rgba(255,255,255,0.1); padding-left: 24px; }

    @media (max-width: 1024px) {
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
    }
    @media (max-width: 600px) {
      .footer-grid { grid-template-columns: 1fr; }
      .border-top { flex-direction: column; gap: 16px; text-align: center; }
      .f-meta { flex-direction: column; gap: 8px; }
      .f-meta span { border: none; padding: 0; }
    }
  `]
})
export class PublicLayoutComponent { }
