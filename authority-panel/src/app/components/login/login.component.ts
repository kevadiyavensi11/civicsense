
import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

type ViewMode = 'login' | 'forgot' | 'verify' | 'reset';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule],
  template: `
    <div class="auth-page">
      <div class="auth-visual">
        <div class="visual-content">
          <mat-icon class="v-icon">gavel</mat-icon>
          <h2>Official Authority Access</h2>
          <p>Administrative portal for civic oversight, issue resolution management, and jurisdictional monitoring.</p>
          <div class="v-meta">
            <div class="v-item">
              <mat-icon>verified_user</mat-icon>
              <span>Authorized Personnel Only</span>
            </div>
            <div class="v-item">
              <mat-icon>security</mat-icon>
              <span>Audit-Logged Console</span>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="container-sm">
          <div class="auth-card">
            <div class="card-header">
              <div class="logo-box">
                <mat-icon>admin_panel_settings</mat-icon>
              </div>
              <h1 *ngIf="viewMode === 'login'">Secure Login</h1>
              <p class="subtitle" *ngIf="viewMode === 'login'">Administrative Credentials Required</p>

              <h1 *ngIf="viewMode === 'forgot'">Recovery</h1>
              <p class="subtitle" *ngIf="viewMode === 'forgot'">Enter official email for OTP</p>

              <h1 *ngIf="viewMode === 'verify'">Verification</h1>
              <p class="subtitle" *ngIf="viewMode === 'verify'">Enter the code sent to your mail</p>

              <h1 *ngIf="viewMode === 'reset'">New Password</h1>
              <p class="subtitle" *ngIf="viewMode === 'reset'">Set a new secure access key</p>
            </div>

            <div class="card-body">
              <!-- LOGIN VIEW -->
              <ng-container *ngIf="viewMode === 'login'">
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <div class="form-group">
                    <label>Official Email</label>
                    <div class="input-group">
                      <mat-icon>mail</mat-icon>
                      <input type="email" formControlName="email" placeholder="official@civicsense.gov">
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Access Password</label>
                    <div class="input-group">
                      <mat-icon>lock</mat-icon>
                      <input type="password" formControlName="password" placeholder="••••••••">
                    </div>
                  </div>

                  <div class="form-utils">
                    <a (click)="setView('forgot')" class="forgot-link">Forgot credentials?</a>
                  </div>

                  <div class="alert alert-error" *ngIf="errorMessage">
                    <mat-icon>error_outline</mat-icon> {{ errorMessage }}
                  </div>

                  <button class="btn btn-primary w-full btn-lg" type="submit" [disabled]="loginForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Authorize Access</span>
                    <span *ngIf="isLoading" class="loader"></span>
                  </button>

                  <div class="auth-divider">
                    <span>Government SSO</span>
                  </div>

                  <button class="btn btn-outline w-full google-btn" type="button" (click)="onGoogleLogin()">
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" width="20">
                    SSO with Google
                  </button>
                </form>
              </ng-container>

              <!-- FORGOT PASSWORD VIEW -->
              <!-- (Same structure as citizen login, but styled for authority) -->
              <ng-container *ngIf="viewMode === 'forgot'">
                <form [formGroup]="forgotForm" (ngSubmit)="onSendOtp()">
                  <div class="form-group">
                    <label>Email Address</label>
                    <div class="input-group">
                      <mat-icon>mail</mat-icon>
                      <input type="email" formControlName="email" placeholder="Enter official email">
                    </div>
                  </div>
                  <button class="btn btn-primary w-full" type="submit" [disabled]="forgotForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Send OTP Code</span>
                    <span *ngIf="isLoading" class="loader"></span>
                  </button>
                </form>
                <p class="auth-footer"><a (click)="setView('login')">Back to Login</a></p>
              </ng-container>

              <div class="alert alert-success" *ngIf="successMessage">
                <mat-icon>check_circle</mat-icon> {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Reusing the same professional styles as Citizen Login but with Authority specifics */
    .auth-page { display: flex; min-height: 100vh; background: var(--bg-main); font-family: 'Poppins', sans-serif; }
    .auth-visual { flex: 1.2; background: var(--primary); display: flex; align-items: center; justify-content: center; padding: 60px; color: white; }
    .auth-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
    .container-sm { width: 100%; max-width: 440px; }
    .auth-card { background: white; border-radius: var(--radius-lg); padding: 48px; box-shadow: 0 10px 40px -10px rgba(30, 58, 95, 0.12); border: 1px solid var(--border-light); }
    .logo-box { width: 56px; height: 56px; background: #F1F5F9; color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
    .card-header { text-align: center; margin-bottom: 32px; }
    .visual-content { max-width: 500px; }
    .v-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 32px; color: #E0F2FE; }
    .v-meta { display: flex; gap: 32px; }
    .v-item { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.9rem; }
    .form-group { margin-bottom: 20px; }
    .input-group { position: relative; background: #F8FAFC; border: 1px solid var(--border-light); border-radius: var(--radius-md); display: flex; align-items: center; padding: 0 16px; }
    .input-group mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--text-muted); }
    .input-group input { flex: 1; border: none; background: transparent; padding: 12px; font-size: 0.95rem; outline: none; }
    .auth-divider { margin: 24px 0; text-align: center; border-bottom: 1px solid var(--border-light); line-height: 0.1em; }
    .auth-divider span { background: white; padding: 0 16px; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
    .google-btn { gap: 12px; font-weight: 600; color: var(--text-primary) !important; padding: 12px !important; }
    .forgot-link { font-size: 0.85rem; font-weight: 600; color: var(--secondary); cursor: pointer; }
    .w-full { width: 100%; }
    .btn-lg { height: 48px; }
    .alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 20px; font-size: 0.9rem; }
    .alert-error { background: #FEF2F2; color: #B91C1C; border: 1px solid #FEE2E2; }
    .alert-success { background: #F0FDF4; color: #15803D; border: 1px solid #DCFCE7; }
    .loader { width: 20px; height: 20px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  cd = inject(ChangeDetectorRef);

  ngOnInit() {}

  viewMode: ViewMode = 'login';
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });
  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  tempEmail = '';

  setView(mode: ViewMode) {
    this.viewMode = mode;
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;
      this.authService.login(email!, password!).subscribe({
        next: (user: any) => {
          this.isLoading = false;
          const route = user.role === 'admin' ? '/admin/dashboard' : user.role === 'authority' ? '/authority/dashboard' : '/citizen/dashboard';
          this.router.navigate([route]);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = typeof err === 'string' ? err : (err.message || 'Login Failed');
        }
      });
    }
  }

  onGoogleLogin() {
    // Implement or redirect to Google Auth
  }

  onSendOtp() {
    if (this.forgotForm.invalid) return;
    this.isLoading = true;
    this.tempEmail = this.forgotForm.value.email!;
    this.authService.forgotPassword(this.tempEmail).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'OTP Sent!';
        setTimeout(() => { this.setView('verify'); this.successMessage = ''; }, 1000);
      },
      error: (err) => { this.isLoading = false; this.errorMessage = 'OTP delivery failed.'; }
    });
  }

  onVerifyOtp() {
    if (this.otpForm.invalid) return;
    this.isLoading = true;
    this.authService.verifyOtp(this.tempEmail, this.otpForm.value.otp!).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'OTP Verified!';
        setTimeout(() => { this.setView('reset'); this.successMessage = ''; }, 1000);
      },
      error: (err) => { this.isLoading = false; this.errorMessage = 'Invalid OTP.'; }
    });
  }

  onResetPassword() {
    if (this.resetForm.invalid) return;
    this.isLoading = true;
    this.authService.resetPassword(this.tempEmail, this.otpForm.value.otp!, this.resetForm.value.newPassword!).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Reset Successfully!';
        setTimeout(() => { this.setView('login'); }, 1500);
      },
      error: (err) => { this.isLoading = false; this.errorMessage = 'Reset failed.'; }
    });
  }
}
