
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
    <div class="auth-container">
      <div class="background-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>

      <div class="glass-card">
        <div class="header-section">
          <div class="logo-icon">
            <mat-icon>how_to_reg</mat-icon>
          </div>
          <h1>Join Us</h1>
          <p class="subtitle">Create your CivicSense account</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <!-- Name -->
          <div class="form-group">
            <label>Full Name</label>
            <div class="input-wrapper">
              <mat-icon class="field-icon">person_outline</mat-icon>
              <input type="text" formControlName="name" placeholder="Enter your full name">
            </div>
            <div *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.invalid" class="field-error">
              Name is required
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <mat-icon class="field-icon">mail_outline</mat-icon>
              <input type="email" formControlName="email" placeholder="name@example.com">
            </div>
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="field-error">
              Valid email is required
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <mat-icon class="field-icon">lock_outline</mat-icon>
              <input type="password" formControlName="password" placeholder="Min 6 characters">
            </div>
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="field-error">
              Password must be at least 6 chars
            </div>
          </div>

          <!-- Area -->
          <div class="form-group">
             <label>Jurisdiction Area</label>
             <div class="input-wrapper select-wrapper">
               <mat-icon class="field-icon">domain</mat-icon>
               <select formControlName="area">
                 <option value="" disabled selected>Select your jurisdiction</option>
                 <option *ngFor="let area of areas" [value]="area">{{ area }}</option>
               </select>
               <mat-icon class="dropdown-arrow">expand_more</mat-icon>
             </div>
             <div *ngIf="registerForm.get('area')?.touched && registerForm.get('area')?.invalid" class="field-error">
                Area is required for authorities
             </div>
          </div>

          <div class="server-error" *ngIf="errorMessage">
            <mat-icon>error</mat-icon> {{ errorMessage }}
          </div>

          <button class="submit-btn" type="submit" [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="!isLoading">Register Account</span>
            <span *ngIf="isLoading" class="loader"></span>
          </button>

          <div class="footer-link">
            Already have an account? <a routerLink="/login">Log In</a>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

    :host {
      display: block;
      font-family: 'Outfit', sans-serif;
    }

    .auth-container {
      min-height: 100vh;
      width: 100%;
      background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #eef2ff 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding: 20px;
    }

    /* Soft Background Blobs */
    .background-blobs {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      overflow: hidden;
      z-index: 0;
    }
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.6;
    }
    .blob-1 {
      width: 400px; height: 400px;
      background: #bae6fd;
      top: -100px; left: -100px;
      animation: float 15s infinite ease-in-out;
    }
    .blob-2 {
      width: 350px; height: 350px;
      background: #c7d2fe;
      bottom: -80px; right: -80px;
      animation: float 18s infinite ease-in-out reverse;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(20px, 40px); }
    }

    /* Glass Card */
    .glass-card {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.02),
        0 20px 40px -4px rgba(0, 0, 0, 0.04);
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-icon {
      width: 56px; height: 56px;
      background: linear-gradient(135deg, #0ea5e9, #3b82f6);
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      color: white;
      box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.3);
    }
    .logo-icon mat-icon { font-size: 32px; width: 32px; height: 32px; }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px;
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 400;
      margin: 0;
    }

    /* Form Styles */
    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
    }

    .input-wrapper {
      position: relative;
      transition: all 0.2s;
    }

    .field-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 20px;
      pointer-events: none;
      transition: color 0.2s;
    }

    input, select {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      background: white;
      font-size: 0.95rem;
      color: #1e293b;
      outline: none;
      transition: all 0.2s;
      font-family: inherit;
    }

    input::placeholder { color: #cbd5e1; }

    input:focus, select:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    input:focus + .field-icon, input:focus ~ .field-icon {
      color: #3b82f6;
    }

    /* Select specific */
    .select-wrapper {
      position: relative;
    }
    select {
      appearance: none;
      cursor: pointer;
    }
    .dropdown-arrow {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      pointer-events: none;
      font-size: 20px;
    }

    .field-error {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 6px;
      margin-left: 4px;
    }

    /* Button */
    .submit-btn {
      width: 100%;
      padding: 14px;
      margin-top: 12px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
      transition: all 0.2s;
      display: flex; justify-content: center; align-items: center;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 12px -1px rgba(37, 99, 235, 0.3);
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-btn:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    /* Footer */
    .footer-link {
      text-align: center;
      margin-top: 24px;
      color: #64748b;
      font-size: 0.9rem;
    }
    .footer-link a {
      color: #0284c7;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .footer-link a:hover {
      color: #0369a1;
      text-decoration: underline;
    }

    .server-error {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex; align-items: center; gap: 8px;
      font-size: 0.9rem;
    }
    .server-error mat-icon { font-size: 20px; width: 20px; height: 20px; }

    /* Loader */
    .loader {
      width: 20px; height: 20px;
      border: 2px solid #fff;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    /* Responsive */
    @media (max-width: 480px) {
      .glass-card { padding: 24px; border-radius: 20px; }
      h1 { font-size: 1.5rem; }
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
    role: ['authority', Validators.required],
    area: ['', Validators.required]
  });

  areas = [
    'Central Zone',
    'North Zone',
    'West Zone',
    'South West Zone',
    'South Zone',
    'East Zone'
  ];

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
