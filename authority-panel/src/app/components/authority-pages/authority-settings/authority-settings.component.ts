import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-authority-settings',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="page-container" [class.dark-mode]="isDarkMode">
      <div class="settings-container">
        <h1 class="page-title">Account Settings</h1>
        
        <mat-card class="settings-card">
            <div class="setting-section">
                <h3>Preferences</h3>
                
                <!-- Dark Mode -->
                <div class="setting-row">
                    <div class="setting-info">
                        <span class="label">Dark Mode</span>
                        <span class="desc">Enable dark theme for the dashboard</span>
                    </div>
                    <mat-slide-toggle 
                        color="primary" 
                        [(ngModel)]="isDarkMode"
                        (change)="toggleTheme()">
                    </mat-slide-toggle>
                </div>

                <!-- Email Notifications -->
                <div class="setting-row">
                    <div class="setting-info">
                        <span class="label">Email Notifications</span>
                        <span class="desc">Manage your email alert preferences</span>
                    </div>
                    <mat-form-field appearance="outline" class="setting-input">
                        <mat-select [(ngModel)]="settings.emailNotificationPreference">
                            <mat-option value="all">All Notifications</mat-option>
                            <mat-option value="assigned">Only Assigned Tasks</mat-option>
                            <mat-option value="high_priority">Only High Priority</mat-option>
                            <mat-option value="none">No Emails</mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>

                <!-- Language -->
                <div class="setting-row">
                    <div class="setting-info">
                        <span class="label">Language</span>
                        <span class="desc">Select your preferred language</span>
                    </div>
                    <mat-form-field appearance="outline" class="setting-input">
                        <mat-select [(ngModel)]="settings.languagePreference">
                            <mat-option value="en">English</mat-option>
                            <mat-option value="hi" disabled>
                                Hindi <span class="badge">Coming Soon</span>
                            </mat-option>
                            <mat-option value="gu" disabled>
                                Gujarati <span class="badge">Coming Soon</span>
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
            </div>

            <div class="actions">
                <button mat-raised-button color="primary" 
                    (click)="saveSettings()" 
                    [disabled]="isLoading">
                    <mat-spinner diameter="20" *ngIf="isLoading" class="spinner"></mat-spinner>
                    <span *ngIf="!isLoading">Save Changes</span>
                </button>
            </div>
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
        transition: background 0.3s ease;
    }
    .settings-container {
        width: 100%;
        max-width: 800px;
    }
    .page-title {
        font-size: 1.8rem;
        color: #1e293b;
        margin-bottom: 24px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
    }
    .settings-card {
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background: white;
    }
    .setting-section h3 {
        color: #64748b;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
        margin-bottom: 24px;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 8px;
    }
    .setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #f1f5f9;
        transition: all 0.2s;
    }
    .setting-row:last-child {
        border-bottom: none;
    }
    .setting-info {
        display: flex;
        flex-direction: column;
        max-width: 60%;
    }
    .setting-info .label {
        font-size: 1rem;
        font-weight: 500;
        color: #334155;
        margin-bottom: 4px;
    }
    .setting-info .desc {
        font-size: 0.875rem;
        color: #94a3b8;
    }
    .setting-input {
        width: 220px;
        margin-bottom: -1.25em;
    }
    .actions {
        margin-top: 32px;
        display: flex;
        justify-content: flex-end;
    }
    .badge {
        background: #e2e8f0;
        color: #64748b;
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 8px;
        text-transform: uppercase;
        font-weight: bold;
    }
    .spinner {
        margin-right: 8px;
        display: inline-block;
    }

    /* Dark Mode Styles (Simulated for container context) */
    :host-context(body.dark-theme) .page-container {
        background: #0f172a;
    }
    :host-context(body.dark-theme) .settings-card {
        background: #1e293b;
        color: #f8fafc;
    }
    :host-context(body.dark-theme) .page-title {
        color: #f8fafc;
    }
    :host-context(body.dark-theme) .label {
        color: #e2e8f0;
    }
    :host-context(body.dark-theme) .desc {
        color: #94a3b8;
    }
    :host-context(body.dark-theme) .setting-section h3 {
        color: #94a3b8;
        border-bottom-color: #334155;
    }
    :host-context(body.dark-theme) .setting-row {
        border-bottom-color: #334155;
    }
  `]
})
export class AuthoritySettingsComponent implements OnInit {
    authService = inject(AuthService);
    snackBar = inject(MatSnackBar);

    isLoading = false;
    isDarkMode = false;
    settings = {
        themePreference: 'light',
        emailNotificationPreference: 'all',
        languagePreference: 'en'
    };

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                // Map user preferences if they exist
                this.settings.themePreference = (user as any).themePreference || 'light';
                this.settings.emailNotificationPreference = (user as any).emailNotificationPreference || 'all';
                this.settings.languagePreference = (user as any).languagePreference || 'en';

                this.isDarkMode = this.settings.themePreference === 'dark';
                this.applyTheme();
            }
        });
    }

    toggleTheme() {
        this.settings.themePreference = this.isDarkMode ? 'dark' : 'light';
        this.applyTheme();
    }

    applyTheme() {
        const body = document.body;
        if (this.isDarkMode) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
    }

    saveSettings() {
        this.isLoading = true;
        this.authService.updateAuthoritySettings(this.settings).subscribe({
            next: (res) => {
                this.isLoading = false;
                this.snackBar.open('Settings updated successfully', 'Close', {
                    duration: 3000,
                    panelClass: ['success-snackbar'],
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (err) => {
                this.isLoading = false;
                this.snackBar.open('Failed to update settings', 'Close', {
                    duration: 3000,
                    panelClass: ['error-snackbar'],
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            }
        });
    }
}
