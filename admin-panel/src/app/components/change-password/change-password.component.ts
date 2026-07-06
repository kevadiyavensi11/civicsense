import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="page-container">
      <div class="content-container">
        <h1 class="page-title">Access Credentials</h1>
        
        <mat-card class="password-card card-3d">
            <p class="section-desc">Maintain your security by updating your authentication credentials regularly.</p>

            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Current Identity Key (Old Password)</mat-label>
                    <input matInput formControlName="oldPassword" type="password">
                    <mat-icon matSuffix>vpn_key</mat-icon>
                    <mat-error *ngIf="passwordForm.get('oldPassword')?.hasError('required')">Current password is required</mat-error>
                </mat-form-field>

                <div class="new-password-section">
                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>New Access Credential</mat-label>
                        <input matInput formControlName="newPassword" type="password">
                        <mat-icon matSuffix>lock</mat-icon>
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">New password is required</mat-error>
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">Must be at least 6 characters</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Confirm New Credential</mat-label>
                        <input matInput formControlName="confirmPassword" type="password">
                        <mat-icon matSuffix>verified_user</mat-icon>
                        <mat-error *ngIf="passwordForm.errors?.['mismatch']">Passwords do not match</mat-error>
                    </mat-form-field>
                </div>

                <div class="actions">
                    <button mat-raised-button color="primary" class="update-btn" type="submit" [disabled]="passwordForm.invalid || loading">
                        <mat-icon *ngIf="!loading">security_update_good</mat-icon>
                        <span *ngIf="loading">TRANSMITTING...</span>
                        <span *ngIf="!loading">UPDATE ACCESS KEY</span>
                    </button>
                </div>
            </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
        padding: 32px;
        background: var(--bg-body);
        min-height: calc(100vh - 120px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .content-container {
        width: 100%;
        max-width: 550px;
    }
    .page-title {
        font-size: 1.8rem;
        color: var(--text-primary);
        margin-bottom: 24px;
        font-weight: 800;
        letter-spacing: -0.5px;
        text-align: center;
    }
    .password-card {
        padding: 40px;
        border-radius: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        box-shadow: var(--shadow-xl);
    }
    .section-desc {
        color: var(--text-secondary);
        background: rgba(59, 130, 246, 0.05);
        padding: 16px;
        border-radius: 12px;
        border-left: 4px solid #3b82f6;
        font-size: 0.9rem;
        font-weight: 500;
        line-height: 1.5;
    }
    :host-context(body.dark-theme) .section-desc { color: white !important; }
    .full-width {
        width: 100%;
        margin-bottom: 8px;
    }
    .new-password-section {
        margin-top: 16px;
        padding-top: 24px;
        border-top: 1px solid var(--border-light);
        margin-bottom: 8px;
    }
    .actions {
        margin-top: 24px;
        display: flex;
        justify-content: center;
    }
    .update-btn {
        width: 100%;
        height: 52px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 0.9rem;
        letter-spacing: 1px;
        background-color: #3b82f6 !important;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  passwordForm: FormGroup;
  loading = false;

  constructor() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    this.loading = true;
    const { oldPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword({ oldPassword, newPassword }).subscribe({
      next: () => {
        this.snackBar.open('Authentication credentials updated successfully', 'OK', { duration: 3000 });
        this.passwordForm.reset();
        this.loading = false;
      },
      error: (err) => {
        const msg = err.error?.message || 'Update failed: ' + (err.message || 'Unknown error');
        this.snackBar.open(msg, 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }
}
