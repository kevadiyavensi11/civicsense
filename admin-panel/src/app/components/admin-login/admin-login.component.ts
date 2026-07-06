
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService, User } from '../../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatProgressBarModule
  ],
  template: `
    <div class="admin-auth-container">
      <div class="auth-visual-side">
        <div class="visual-overlay"></div>
        <div class="visual-content">
          <div class="branding">
            <div class="logo-box">
              <mat-icon>account_balance</mat-icon>
            </div>
            <h1>CivicSense Admin</h1>
          </div>
          
          <div class="visual-text">
            <h2 class="mission-text">Command & Control <br>Center</h2>
            <p class="mission-sub">System-wide oversight, user management, and platform configuration for the Civic Platform ecosystem.</p>
          </div>

          <div class="system-stats">
            <div class="stat-item">
              <span class="s-val">99.9%</span>
              <span class="s-lab">Uptime</span>
            </div>
            <div class="stat-item">
              <span class="s-val">Encrypted</span>
              <span class="s-lab">Data Layer</span>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="form-wrapper luxe-fade">
          <div class="form-header">
            <div class="top-icon">
              <mat-icon>admin_panel_settings</mat-icon>
            </div>
            <h1>Secure Admin Access</h1>
            <p>Enter your privileged credentials to enter the console</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="input-field">
              <label>Administrator ID (Email)</label>
              <div class="input-group">
                <mat-icon>verified_user</mat-icon>
                <input type="email" formControlName="email" placeholder="admin@civicsense.gov">
              </div>
            </div>

            <div class="input-field">
              <label>Access Key (Password)</label>
              <div class="input-group">
                <mat-icon>lock</mat-icon>
                <input [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="••••••••">
                <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
                  <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
            </div>

            <div class="form-options">
               <a routerLink="/admin/forgot-password" class="forgot-link">Forgot Access Key?</a>
            </div>

            <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading">
               <span *ngIf="!isLoading">Establish Secure Connection</span>
               <div *ngIf="isLoading" class="loader"></div>
            </button>

            <div *ngIf="errorMessage" class="error-alert">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>
          </form>

          <div class="auth-footer">
            <p>Unauthorized access attempts are logged and reported.</p>
            <div class="footer-icons">
               <mat-icon>shield</mat-icon>
               <mat-icon>lock</mat-icon>
               <mat-icon>gavel</mat-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-auth-container {
      display: flex; height: 100vh; width: 100vw; overflow: hidden;
      background: #F8FAFC; font-family: 'Poppins', sans-serif;
    }

    /* Left Side: Visual */
    .auth-visual-side {
      flex: 1.2; position: relative;
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      display: flex; flex-direction: column; justify-content: space-between;
      padding: 64px; color: white;
    }
    .visual-overlay {
      position: absolute; inset:0;
      background: url('https://www.transparenttextures.com/patterns/cubes.png');
      opacity: 0.05; pointer-events: none;
    }
    .visual-content { position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; }
    
    .branding { display: flex; align-items: center; gap: 16px; margin-bottom: 80px; }
    .logo-box { width: 48px; height: 48px; background: white; color: #0F172A; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); }
    .logo-box mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .branding h1 { margin: 0; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; color: white !important; }

    .visual-text .mission-text { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; letter-spacing: -2px; color: #FFFFFF !important; }
    .visual-text .mission-sub { font-size: 1.1rem; color: #94A3B8; max-width: 500px; line-height: 1.6; }

    .system-stats { display: flex; gap: 48px; margin-top: auto; }
    .stat-item { display: flex; flex-direction: column; }
    .s-val { font-size: 1.8rem; font-weight: 800; color: #3B82F6; }
    .s-lab { font-size: 0.8rem; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; }

    /* Right Side: Form */
    .auth-form-side { flex: 1; min-width: 500px; display: flex; align-items: center; justify-content: center; padding: 40px; background: white; }
    .form-wrapper { width: 100%; max-width: 440px; }

    .form-header { text-align: center; margin-bottom: 40px; }
    .top-icon { 
      width: 64px; height: 64px; background: #F1F5F9; color: #1E293B;
      border-radius: 20px; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
    }
    .top-icon mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .form-header h1 { font-size: 2rem; font-weight: 800; color: #0F172A; margin-bottom: 8px; letter-spacing: -0.5px; }
    .form-header p { color: #64748B; font-size: 0.95rem; }

    .login-form { display: flex; flex-direction: column; gap: 24px; }
    .input-field { display: flex; flex-direction: column; gap: 8px; }
    .input-field label { font-size: 0.85rem; font-weight: 700; color: #475569; margin-left: 4px; }
    .input-group { 
      position: relative; display: flex; align-items: center;
      background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px;
      padding: 0 16px; transition: 0.2s;
    }
    .input-group:focus-within { border-color: #3B82F6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05); background: white; }
    .input-group mat-icon { color: #94A3B8; font-size: 20px; width: 20px; height: 20px; }
    .input-group input { 
      flex: 1; border: none; background: transparent; padding: 14px 12px;
      font-size: 0.95rem; font-weight: 500; outline: none; color: #0F172A;
    }
    .toggle-pass { background: none; border: none; color: #94A3B8; cursor: pointer; padding: 4px; display: flex; }
    .toggle-pass:hover { color: #64748B; }

    .form-options { text-align: right; }
    .forgot-link { font-size: 0.85rem; font-weight: 600; color: #3B82F6; text-decoration: none; }
    .forgot-link:hover { text-decoration: underline; }

    .submit-btn {
      margin-top: 12px; height: 52px; background: #0F172A; color: white;
      border: none; border-radius: 12px; font-weight: 700; font-size: 1rem;
      cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
    }
    .submit-btn:hover:not(:disabled) { background: #1E293B; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .error-alert {
      display: flex; align-items: center; gap: 12px; padding: 14px;
      background: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 10px;
      color: #991B1B; font-size: 0.85rem; font-weight: 600;
    }
    .error-alert mat-icon { font-size: 20px; width: 20px; height: 20px; }

    .auth-footer { margin-top: 64px; text-align: center; }
    .auth-footer p { font-size: 0.75rem; color: #94A3B8; font-weight: 500; margin-bottom: 16px; }
    .footer-icons { display: flex; justify-content: center; gap: 16px; color: #CBD5E1; }
    .footer-icons mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* Animations */
    .luxe-fade { animation: luxeFadeUp 0.8s ease-out; }
    @keyframes luxeFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .loader { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AdminLoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect
    this.authService.user$.pipe(take(1)).subscribe((user: User | null) => {
      if (user && user.role === 'admin') {
        console.log('[Login] Existing session detected, navigating to control center.');
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;
    console.log('[LoginDebug] Attempting login for:', email);

    this.authService.login(email, password).subscribe({
      next: (success) => {
        console.log('[LoginDebug] Login outcome:', success);
        if (success) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = 'Access Denied: Invalid administrator credentials or role.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('[LoginDebug] Login fatal error:', err);
        this.errorMessage = err.message || 'System error establishing secure connection.';
        this.isLoading = false;
      }
    });
  }
}
