
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
      
      <!-- GLOBAL PREMIUM FOOTER v2 -->
      <footer class="next-gen-footer">
        <div class="footer-glass-wrap">
          <div class="footer-main">
            <div class="footer-brand-side">
              <div class="f-logo-box">
                <mat-icon>account_balance</mat-icon>
              </div>
              <div class="f-brand-text">
                <h3>CivicSense</h3>
                <p>BCA Project Initiative</p>
              </div>
              <div class="f-motto">
                Pioneering digital transparency for smarter cities. Managed by Prof. Damynati Patel.
              </div>
            </div>
            
            <div class="footer-nav-side">
              <div class="nav-group">
                <h4>Engine</h4>
                <a routerLink="/authority/dashboard">Dashboard</a>
                <a routerLink="/issues">Audit Feed</a>
                <a href="#">API Docs</a>
              </div>
              <div class="nav-group">
                <h4>Legal</h4>
                <a href="#">Privacy Core</a>
                <a href="#">Terms of Use</a>
                <a href="#">Audit Protocols</a>
              </div>
              <div class="nav-group">
                <h4>Connect</h4>
                <a href="#">Technical Support</a>
                <a href="#">Report Incident</a>
                <a href="#">SMC Portal</a>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom-bar">
            <div class="social-tags">
               <span class="tag-pill">#DigitalGovernance</span>
               <span class="tag-pill">#SmartCitySurat</span>
            </div>
            <div class="copy-meta">
              &copy; 2026 CivicSense Core | Guide: Prof. Damynati Patel | BCA
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
      background: #0b0f19; /* Matched to new Authority theme */
    }
    .public-content { flex: 1; }

    /* NEXT-GEN FOOTER STYLES */
    .next-gen-footer {
      background: #070a13;
      padding: 100px 10% 50px;
      font-family: 'Outfit', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .footer-glass-wrap { position: relative; z-index: 1; }

    .footer-main {
      display: flex;
      justify-content: space-between;
      gap: 100px;
      margin-bottom: 80px;
    }

    .footer-brand-side { flex: 1.5; }
    .f-logo-box {
      width: 60px; height: 60px; background: #2563eb; color: white;
      border-radius: 20px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4); margin-bottom: 24px;
    }
    .f-logo-box mat-icon { font-size: 34px; width: 34px; height: 34px; }

    .f-brand-text h3 { font-size: 2rem; font-weight: 900; color: white; margin: 0; letter-spacing: -1px; }
    .f-brand-text p { font-size: 0.9rem; font-weight: 700; color: #3b82f6; text-transform: uppercase; margin: 5px 0 0; letter-spacing: 2px; }
    .f-motto { margin-top: 30px; color: #64748b; font-size: 1.1rem; line-height: 1.6; max-width: 400px; }

    .footer-nav-side {
      flex: 2;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    .nav-group h4 { color: white; font-size: 1.1rem; font-weight: 800; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1.5px; }
    .nav-group a {
      display: block; color: #94a3b8; text-decoration: none; margin-bottom: 15px;
      font-size: 1rem; transition: 0.3s; font-weight: 500;
    }
    .nav-group a:hover { color: #3b82f6; transform: translateX(8px); }

    .footer-bottom-bar {
      padding-top: 40px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tag-pill { 
      padding: 8px 20px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 100px; color: #475569; font-size: 0.85rem; font-weight: 700; margin-right: 12px;
    }

    .copy-meta { color: #475569; font-size: 0.9rem; font-weight: 600; }

    @media (max-width: 1024px) {
      .footer-main { flex-direction: column; gap: 60px; }
      .footer-nav-side { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class PublicLayoutComponent { }
