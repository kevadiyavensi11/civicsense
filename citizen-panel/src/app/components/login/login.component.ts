
import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

type ViewMode = 'login' | 'forgot' | 'verify' | 'reset';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule],
  template: `
    <div class="auth-page">
      <div class="auth-visual">
        <div class="visual-content">
          <mat-icon class="v-icon">account_balance</mat-icon>
          <h2>Official Citizen Portal</h2>
          <p>Securely access the Civic Intelligence & Reporting System to engage with your local administration.</p>
          <div class="v-meta">
            <div class="v-item">
              <mat-icon>verified_user</mat-icon>
              <span>Identity Verified</span>
            </div>
            <div class="v-item">
              <mat-icon>security</mat-icon>
              <span>256-bit Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="container-sm">
          <div class="auth-card">
            <div class="card-header">
              <div class="logo-box">
                <mat-icon>how_to_reg</mat-icon>
              </div>
              <h1 *ngIf="viewMode === 'login'">Access Portal</h1>
              <p class="subtitle" *ngIf="viewMode === 'login'">Enter your credentials to continue</p>

              <h1 *ngIf="viewMode === 'forgot'">Recovery</h1>
              <p class="subtitle" *ngIf="viewMode === 'forgot'">Enter registered email for OTP</p>

              <h1 *ngIf="viewMode === 'verify'">Verification</h1>
              <p class="subtitle" *ngIf="viewMode === 'verify'">Enter the code sent to your email</p>

              <h1 *ngIf="viewMode === 'reset'">New Password</h1>
              <p class="subtitle" *ngIf="viewMode === 'reset'">Create a secure new password</p>
            </div>

            <div class="card-body">
              <!-- LOGIN VIEW -->
              <ng-container *ngIf="viewMode === 'login'">
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                  <div class="form-group">
                    <label>Government-Registered Email</label>
                    <div class="input-group">
                      <mat-icon>mail</mat-icon>
                      <input type="email" formControlName="email" placeholder="example@domain.com">
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Secure Password</label>
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

                  <button class="btn btn-primary w-full" type="submit" [disabled]="loginForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Authorize & Login</span>
                    <span *ngIf="isLoading" class="loader"></span>
                  </button>

                  <div class="auth-divider">
                    <span>Alternative Auth</span>
                  </div>

                  <button class="btn btn-outline w-full google-btn" type="button" (click)="onGoogleLogin()">
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" width="20">
                    Sign in with Google
                  </button>

                  <p class="auth-footer">
                    New to the portal? <a routerLink="/register">Register Identity</a>
                  </p>
                </form>
              </ng-container>

              <!-- FORGOT PASSWORD VIEW -->
              <ng-container *ngIf="viewMode === 'forgot'">
                <form [formGroup]="forgotForm" (ngSubmit)="onSendOtp()">
                  <div class="form-group">
                    <label>Email Address</label>
                    <div class="input-group">
                      <mat-icon>mail</mat-icon>
                      <input type="email" formControlName="email" placeholder="Enter registered email">
                    </div>
                  </div>
                  <button class="btn btn-primary w-full" type="submit" [disabled]="forgotForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Send OTP Code</span>
                    <span *ngIf="isLoading" class="loader"></span>
                  </button>
                </form>
                <p class="auth-footer"><a (click)="setView('login')">Return to Authentication</a></p>
              </ng-container>

              <!-- VERIFY OTP VIEW -->
              <ng-container *ngIf="viewMode === 'verify'">
                <form [formGroup]="otpForm" (ngSubmit)="onVerifyOtp()">
                  <div class="form-group">
                    <label>6-Digit Code</label>
                    <div class="input-group">
                      <mat-icon>vpn_key</mat-icon>
                      <input type="text" formControlName="otp" placeholder="000000" maxlength="6">
                    </div>
                  </div>
                  <button class="btn btn-primary w-full" type="submit" [disabled]="otpForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Verify Identity</span>
                    <span *ngIf="isLoading" class="loader"></span>
                  </button>
                </form>
                <p class="auth-footer"><a (click)="setView('forgot')">Resend Code</a></p>
              </ng-container>

              <!-- RESET PASSWORD VIEW -->
              <ng-container *ngIf="viewMode === 'reset'">
                <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()">
                  <div class="form-group">
                    <label>Secure New Password</label>
                    <div class="input-group">
                      <mat-icon>lock</mat-icon>
                      <input type="password" formControlName="newPassword" placeholder="Minimum 6 characters">
                    </div>
                  </div>
                  <button class="btn btn-primary w-full" type="submit" [disabled]="resetForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Confirm Password Reset</span>
                    <span *ngIf="isLoading" class="loader"></span>
                  </button>
                </form>
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
    .auth-page {
      display: flex;
      min-height: 100vh;
      background: var(--bg-main);
    }

    .auth-visual {
      flex: 1.2;
      background: var(--primary);
      background-image: radial-gradient(at 0% 0%, #2563EB 0px, transparent 50%), radial-gradient(at 100% 100%, #1E3A5F 0px, transparent 50%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .visual-content { position: relative; z-index: 10; max-width: 500px; }
    .v-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 32px; opacity: 0.9; color: #E0F2FE; }
    .visual-content h2 { font-size: 2.5rem; color: white; margin-bottom: 24px; line-height: 1.2; }
    .visual-content p { font-size: 1.125rem; opacity: 0.8; line-height: 1.6; margin-bottom: 40px; }

    .v-meta { display: flex; gap: 32px; }
    .v-item { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.9rem; }
    .v-item mat-icon { font-size: 20px; width: 20px; height: 20px; color: #60A5FA; }

    .auth-form-side {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .container-sm { width: 100%; max-width: 440px; }

    .auth-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 48px;
      box-shadow: 0 10px 40px -10px rgba(30, 58, 95, 0.12);
      border: 1px solid var(--border-light);
    }

    .card-header { text-align: center; margin-bottom: 32px; }
    .logo-box {
      width: 56px; height: 56px; background: #F1F5F9; color: var(--primary);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .logo-box mat-icon { font-size: 28px; width: 28px; height: 28px; }

    .card-header h1 { font-size: 1.75rem; margin-bottom: 8px; color: var(--primary); }
    .subtitle { color: var(--text-secondary); font-size: 0.95rem; }

    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
    
    .input-group {
      position: relative;
      background: #F8FAFC;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      padding: 0 16px;
      transition: 0.2s;
    }
    .input-group:focus-within { border-color: var(--secondary); background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
    .input-group mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--text-muted); }
    .input-group input {
      flex: 1; border: none; background: transparent; padding: 12px 12px; font-size: 0.95rem; color: var(--text-primary); outline: none;
    }

    .form-utils { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .forgot-link { font-size: 0.85rem; font-weight: 600; color: var(--secondary); cursor: pointer; }

    .auth-divider {
      margin: 24px 0; text-align: center; border-bottom: 1px solid var(--border-light); line-height: 0.1em;
    }
    .auth-divider span { background: white; padding: 0 16px; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }

    .google-btn { gap: 12px; font-weight: 600; color: var(--text-primary) !important; padding: 12px !important; }

    .auth-footer { text-align: center; margin-top: 32px; font-size: 0.9rem; color: var(--text-secondary); }
    .auth-footer a { color: var(--secondary); font-weight: 700; text-decoration: none; cursor: pointer; }

    .alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 20px; font-size: 0.9rem; }
    .alert-error { background: #FEF2F2; color: #B91C1C; border: 1px solid #FEE2E2; }
    .alert-success { background: #F0FDF4; color: #15803D; border: 1px solid #DCFCE7; }

    .w-full { width: 100%; }
    .loader {
      width: 20px; height: 20px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    @media (max-width: 1024px) {
      .auth-visual { display: none; }
      .auth-form-side { background: white; }
    }
    @media (max-width: 480px) {
      .auth-card { padding: 32px 24px; border: none; box-shadow: none; }
    }
  `]
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  cd = inject(ChangeDetectorRef);

  ngOnInit() {
    const urlToken = this.route.snapshot.queryParams['token'];
    const error = this.route.snapshot.queryParams['error'];

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      this.router.navigate(['/citizen/dashboard']);
    } else if (error) {
      this.errorMessage = 'Authentication Failed: ' + error;
    }
  }

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
          this.errorMessage = typeof err === 'string' ? err : (err.message || 'Authentication Failed');
        }
      });
    }
  }

  onGoogleLogin() {
    this.isLoading = true;
    this.authService.loginWithGooglePopup().subscribe({
        next: (success) => {
            if (success) {
                const user = this.authService.currentUserValue;
                const route = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'authority' ? '/authority/dashboard' : '/citizen/dashboard';
                this.router.navigate([route]);
            } else {
                this.isLoading = false;
                this.errorMessage = 'Google Authentication Failed';
            }
        },
        error: () => {
            this.isLoading = false;
            this.errorMessage = 'Google Authentication Failed';
        }
    });
  }

  onSendOtp() {
    if (this.forgotForm.invalid) return;
    this.isLoading = true;
    this.tempEmail = this.forgotForm.value.email!;
    this.authService.forgotPassword(this.tempEmail).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'OTP Dispatched!';
        setTimeout(() => { this.setView('verify'); this.successMessage = ''; }, 1000);
      },
      error: (err) => { this.isLoading = false; this.errorMessage = err.error?.message || 'OTP delivery failed.'; }
    });
  }

  onVerifyOtp() {
    if (this.otpForm.invalid) return;
    this.isLoading = true;
    this.authService.verifyOtp(this.tempEmail, this.otpForm.value.otp!).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Identity Verified!';
        setTimeout(() => { this.setView('reset'); this.successMessage = ''; }, 1000);
      },
      error: (err) => { this.isLoading = false; this.errorMessage = err.error?.message || 'Invalid verification code.'; }
    });
  }

  onResetPassword() {
    if (this.resetForm.invalid) return;
    this.isLoading = true;
    this.authService.resetPassword(this.tempEmail, this.otpForm.value.otp!, this.resetForm.value.newPassword!).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Password Vault Updated!';
        setTimeout(() => { this.setView('login'); this.loginForm.patchValue({ email: this.tempEmail }); }, 1500);
      },
      error: (err) => { this.isLoading = false; this.errorMessage = err.error?.message || 'Reset failed.'; }
    });
  }
}
