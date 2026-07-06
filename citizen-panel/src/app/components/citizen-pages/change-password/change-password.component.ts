
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

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
        MatIconModule,
        MatSnackBarModule
    ],
    template: `
    <div class="page-container">
      <div class="content-container">
        <h1 class="page-title">Change Password</h1>
        
        <mat-card class="password-card">
            <p class="section-desc">Ensure your account is using a long, random password to stay secure.</p>

            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Current Password</mat-label>
                    <input matInput formControlName="oldPassword" type="password">
                    <mat-error *ngIf="passwordForm.get('oldPassword')?.hasError('required')">Current password is required</mat-error>
                </mat-form-field>

                <div class="new-password-section">
                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>New Password</mat-label>
                        <input matInput formControlName="newPassword" type="password">
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">New password is required</mat-error>
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">Must be at least 6 characters</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Confirm New Password</mat-label>
                        <input matInput formControlName="confirmPassword" type="password">
                        <mat-error *ngIf="passwordForm.errors?.['mismatch']">Passwords do not match</mat-error>
                    </mat-form-field>
                </div>

                <div class="actions">
                    <button mat-raised-button color="primary" type="submit" [disabled]="passwordForm.invalid || loading">
                        <mat-icon *ngIf="!loading">save</mat-icon>
                        <span *ngIf="loading">Updating...</span>
                        <span *ngIf="!loading">Update Password</span>
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
        background: #f8fafc;
        min-height: 100vh;
        display: flex;
        justify-content: center;
    }
    .content-container {
        width: 100%;
        max-width: 500px;
    }
    .page-title {
        font-size: 1.8rem;
        color: #1e293b;
        margin-bottom: 24px;
        font-weight: 600;
        text-align: left;
    }
    .password-card {
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background: white;
    }
    .section-desc {
        color: #64748b;
        margin-bottom: 24px;
        background: #eff6ff;
        padding: 12px;
        border-radius: 8px;
        border-left: 4px solid #3b82f6;
        font-size: 0.9rem;
    }
    .full-width {
        width: 100%;
        margin-bottom: 8px;
    }
    .new-password-section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #f1f5f9;
        margin-bottom: 8px;
    }
    .actions {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }
    button {
        padding: 0 24px;
        font-weight: 600;
        height: 44px;
    }

    /* DARK THEME */
    :host-context(body.dark-theme) .page-container {
        background: var(--bg-main, #0F172A);
    }
    :host-context(body.dark-theme) .page-title { color: white; }
    :host-context(body.dark-theme) .password-card {
        background: var(--bg-card, #1E293B) !important;
        border: 1px solid var(--border-light, rgba(255,255,255,0.05));
    }
    :host-context(body.dark-theme) .section-desc {
        background: rgba(59, 130, 246, 0.1);
        color: #93c5fd;
        border-left-color: #2563eb;
    }
    :host-context(body.dark-theme) .new-password-section {
        border-top-color: rgba(255,255,255,0.1);
    }
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
                this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
                this.passwordForm.reset();
                this.loading = false;
            },
            error: (err) => {
                const msg = err.error?.message || 'Failed to change password';
                this.snackBar.open(msg, 'Close', { duration: 5000 });
                this.loading = false;
            }
        });
    }
}
