
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, MatSelectModule],
  template: `
    <div class="auth-page">
      <div class="auth-visual">
        <div class="visual-content">
          <mat-icon class="v-icon">how_to_reg</mat-icon>
          <h2>Establish Digital Identity</h2>
          <p>Join the Surat Municipal Digital Collective to participate in active governance and real-time civic reporting.</p>
          
          <div class="v-steps">
            <div class="v-step">
              <div class="v-step-num">01</div>
              <div class="v-step-text">Verify Identity</div>
            </div>
            <div class="v-step">
              <div class="v-step-num">02</div>
              <div class="v-step-text">Register Area</div>
            </div>
            <div class="v-step">
              <div class="v-step-num">03</div>
              <div class="v-step-text">Begin Reporting</div>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="container-sm">
          <div class="auth-card">
            <div class="card-header">
              <h1>Create Account</h1>
              <p class="subtitle">Complete the fields below to register</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-group">
                  <label>Full Legal Name</label>
                  <div class="input-group">
                    <mat-icon>person</mat-icon>
                    <input type="text" formControlName="name" placeholder="As per official proof">
                  </div>
                </div>

                <div class="form-group">
                  <label>Email Address</label>
                  <div class="input-group">
                    <mat-icon>mail</mat-icon>
                    <input type="email" formControlName="email" placeholder="example@domain.com">
                  </div>
                </div>

                <div class="form-group">
                  <label>Secure Password</label>
                  <div class="input-group">
                    <mat-icon>lock_open</mat-icon>
                    <input type="password" formControlName="password" placeholder="Minimum 6 characters">
                  </div>
                </div>

                <div class="form-group">
                  <label>Active Residency Zone</label>
                  <div class="input-group">
                    <mat-icon>location_city</mat-icon>
                    <select formControlName="area">
                      <option value="" disabled>Select your municipality zone</option>
                      <option value="Central Zone">Central Zone</option>
                      <option value="North Zone">North Zone</option>
                      <option value="East Zone">East Zone</option>
                      <option value="West Zone">West Zone</option>
                      <option value="South Zone">South Zone</option>
                      <option value="South West Zone">South West Zone</option>
                      <option value="South East Zone">South East Zone</option>
                      <option value="Varachha-B Zone">Varachha-B Zone</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="terms-check">
                <input type="checkbox" id="terms" checked>
                <label for="terms">I agree to the <a>Digital Governance Terms</a> and <a>Privacy Policy</a>.</label>
              </div>

              <div class="alert alert-error" *ngIf="errorMessage">
                <mat-icon>error_outline</mat-icon> {{ errorMessage }}
              </div>

              <button class="btn btn-primary w-full btn-lg" type="submit" [disabled]="registerForm.invalid || isLoading">
                <span *ngIf="!isLoading">Establish Account</span>
                <span *ngIf="isLoading" class="loader"></span>
              </button>

              <p class="auth-footer">
                Already registered? <a routerLink="/login">Sign In Instead</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: flex; min-height: 100vh; background: var(--bg-main); }

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
    }

    .visual-content { position: relative; z-index: 10; max-width: 500px; }
    .v-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 32px; color: #E0F2FE; }
    .visual-content h2 { font-size: 2.5rem; color: white; margin-bottom: 24px; line-height: 1.2; }
    .visual-content p { font-size: 1.125rem; opacity: 0.8; line-height: 1.6; margin-bottom: 48px; }

    .v-steps { display: flex; flex-direction: column; gap: 24px; }
    .v-step { display: flex; align-items: center; gap: 20px; }
    .v-step-num { 
      width: 40px; height: 40px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;
    }
    .v-step-text { font-weight: 600; font-size: 1rem; color: #E0F2FE; }

    .auth-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
    .container-sm { width: 100%; max-width: 500px; }

    .auth-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 48px;
      box-shadow: 0 10px 40px -10px rgba(30, 58, 95, 0.12);
      border: 1px solid var(--border-light);
    }

    .card-header { text-align: left; margin-bottom: 32px; }
    .card-header h1 { font-size: 2rem; margin-bottom: 8px; color: var(--primary); }
    .subtitle { color: var(--text-secondary); font-size: 1rem; }

    .form-grid { display: grid; gap: 20px; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
    
    .input-group {
      position: relative; background: #F8FAFC; border: 1px solid var(--border-light);
      border-radius: var(--radius-md); display: flex; align-items: center; padding: 0 16px; transition: 0.2s;
    }
    .input-group:focus-within { border-color: var(--secondary); background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
    .input-group mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--text-muted); }
    .input-group input, .input-group select {
      flex: 1; border: none; background: transparent; padding: 12px; font-size: 0.95rem; color: var(--text-primary); outline: none;
    }

    .terms-check { display: flex; gap: 12px; margin: 24px 0; align-items: flex-start; }
    .terms-check input { margin-top: 4px; }
    .terms-check label { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; }
    .terms-check a { color: var(--secondary); font-weight: 600; cursor: pointer; }

    .auth-footer { text-align: center; margin-top: 32px; font-size: 0.95rem; color: var(--text-secondary); }
    .auth-footer a { color: var(--secondary); font-weight: 700; text-decoration: none; cursor: pointer; }

    .alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 20px; font-size: 0.9rem; }
    .alert-error { background: #FEF2F2; color: #B91C1C; border: 1px solid #FEE2E2; }

    .w-full { width: 100%; }
    .loader {
      width: 20px; height: 20px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    @media (max-width: 1100px) {
      .auth-visual { display: none; }
      .auth-form-side { background: white; }
    }
    @media (max-width: 480px) {
      .auth-card { padding: 32px 24px; border: none; box-shadow: none; }
    }
  `]
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['citizen', Validators.required],
    area: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password, name, role, area } = this.registerForm.value;

      this.authService.register(email!, password!, { name, role, area }).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (errString) => {
          this.isLoading = false;
          this.errorMessage = errString;
        }
      });
    }
  }
}
