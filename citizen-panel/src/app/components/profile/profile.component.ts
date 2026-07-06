import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, 
    MatButtonModule, MatIconModule, MatFormFieldModule, 
    MatInputModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="profile-wizard" *ngIf="profileForm">
        
        <!-- VIEW MODE -->
        <ng-container *ngIf="!isEditing">
          <div class="view-header">
            <div class="avatar-large-view" [style.background-image]="(user$ | async)?.photoUrl ? 'url(' + (user$ | async)?.photoUrl + ')' : ''">
               <span *ngIf="!(user$ | async)?.photoUrl">
                {{ (user$ | async)?.name?.charAt(0)?.toUpperCase() || (user$ | async)?.email?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <h2 class="view-name">{{ (user$ | async)?.name || 'Guest User' }}</h2>
            <div class="role-badge">{{ (user$ | async)?.role | uppercase }}</div>
          </div>

          <div class="view-details">
            <div class="detail-row">
              <mat-icon>person</mat-icon>
              <div class="detail-info">
                <label>FULL NAME</label>
                <p>{{ (user$ | async)?.name || 'Not set' }}</p>
              </div>
            </div>
            <div class="detail-row">
              <mat-icon>email</mat-icon>
              <div class="detail-info">
                <label>EMAIL ADDRESS</label>
                <p>{{ (user$ | async)?.email }}</p>
              </div>
            </div>
            <div class="detail-row">
              <mat-icon>phone</mat-icon>
              <div class="detail-info">
                <label>PHONE NUMBER</label>
                <p>{{ (user$ | async)?.phone || 'Not set' }}</p>
              </div>
            </div>
          </div>

          <button mat-raised-button color="primary" class="edit-entry-btn" (click)="isEditing = true">
            <mat-icon>edit</mat-icon> Edit Profile
          </button>
        </ng-container>

        <!-- EDIT MODE -->
        <ng-container *ngIf="isEditing">
          <div class="avatar-section">
            <div class="avatar-wrapper" (click)="fileInput.click()">
              <div class="avatar-large" [style.background-image]="(user$ | async)?.photoUrl ? 'url(' + (user$ | async)?.photoUrl + ')' : ''">
                <span *ngIf="!(user$ | async)?.photoUrl">
                  {{ (user$ | async)?.name?.charAt(0)?.toUpperCase() || (user$ | async)?.email?.charAt(0)?.toUpperCase() }}
                </span>
                <div class="avatar-overlay">
                  <mat-icon>camera_alt</mat-icon>
                </div>
              </div>
              <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" hidden>
            </div>
            <div class="role-badge">{{ (user$ | async)?.role | uppercase }}</div>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="saveChanges()" class="profile-form">
            <div class="form-field-group">
              <label>Full Name</label>
              <div class="input-with-icon">
                <mat-icon>person</mat-icon>
                <input type="text" formControlName="name" placeholder="Enter full name">
              </div>
            </div>

            <div class="form-field-group">
              <label>Phone Number</label>
              <div class="input-with-icon">
                <mat-icon>phone</mat-icon>
                <input type="text" formControlName="phone" placeholder="Enter phone number">
              </div>
            </div>

            <div class="static-field-group">
              <div class="static-label">EMAIL ADDRESS (CANNOT CHANGE)</div>
              <div class="static-content">
                <mat-icon>email</mat-icon>
                <span>{{ (user$ | async)?.email }}</span>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" mat-button color="warn" (click)="isEditing = false">Cancel</button>
              <button type="submit" mat-raised-button color="primary" [disabled]="profileForm.invalid || isSaving">
                <mat-icon *ngIf="!isSaving">save</mat-icon>
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: calc(100vh - 64px);
    }
    .profile-wizard {
      width: 100%;
      max-width: 480px;
      background: white;
      padding: 48px;
      border-radius: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.06);
      text-align: center;
    }

    /* VIEW MODE STYLES */
    .view-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 32px;
    }
    .avatar-large-view {
      width: 130px;
      height: 130px;
      background: #1e3a8a;
      background-size: cover;
      background-position: center;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.8rem;
      font-weight: 700;
      box-shadow: 0 8px 25px rgba(30, 58, 138, 0.2);
      margin-bottom: 20px;
      border: 5px solid white;
    }
    .view-name {
      font-size: 1.8rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 12px;
    }
    .view-details {
      text-align: left;
      margin-bottom: 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .detail-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 20px;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #f1f5f9;
    }
    .detail-row mat-icon { color: #1e3a8a; font-size: 22px; }
    .detail-info label { font-size: 0.65rem; color: #94a3b8; font-weight: 800; display: block; margin-bottom: 2px; }
    .detail-info p { margin: 0; font-weight: 600; color: #334155; }
    .edit-entry-btn { width: 100%; border-radius: 12px; height: 52px; font-weight: 700; font-size: 1rem; background-color: #1e3a8a !important; }

    /* EDIT MODE STYLES */
    .avatar-section {
      margin-bottom: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .avatar-wrapper {
      position: relative;
      cursor: pointer;
      margin-bottom: 16px;
    }
    .avatar-large {
      width: 120px;
      height: 120px;
      background: #1e3a8a;
      background-size: cover;
      background-position: center;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.5rem;
      font-weight: 700;
      border: 4px solid white;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .avatar-overlay {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #334155;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }
    .avatar-overlay mat-icon { font-size: 18px; width: 18px; height: 18px; }
    
    .role-badge {
      background: #eff6ff;
      color: #1e40af;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      text-align: left;
    }

    .form-field-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 8px;
    }
    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0 16px;
      transition: border-color 0.2s;
    }
    .input-with-icon:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    .input-with-icon mat-icon { color: #94a3b8; font-size: 20px; margin-right: 12px; }
    .input-with-icon input {
      border: none;
      background: transparent;
      padding: 14px 0;
      width: 100%;
      color: #1e293b;
      font-weight: 500;
      outline: none;
    }

    .static-field-group {
      background: #f8fafc;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1px solid #f1f5f9;
    }
    .static-label { font-size: 0.7rem; color: #94a3b8; font-weight: 700; margin-bottom: 6px; }
    .static-content { display: flex; align-items: center; gap: 12px; color: #475569; font-weight: 500; font-size: 0.9rem; }
    .static-content mat-icon { font-size: 18px; color: #1e3a8a; }

    .form-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 12px;
    }
    .form-actions button { border-radius: 12px; padding: 0 24px; height: 48px; }

    /* DARK THEME */
    :host-context(body.dark-theme) .page-container { background: #020617; }
    :host-context(body.dark-theme) .profile-wizard { background: #1e293b; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
    :host-context(body.dark-theme) .avatar-large, 
    :host-context(body.dark-theme) .avatar-large-view { border-color: #334155; }
    :host-context(body.dark-theme) .view-name { color: #f1f5f9; }
    :host-context(body.dark-theme) .detail-row { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) .detail-info p { color: #f1f5f9; }
    :host-context(body.dark-theme) .detail-row mat-icon { color: #3b82f6; }
    :host-context(body.dark-theme) .role-badge { background: #334155; color: #94a3b8; }
    :host-context(body.dark-theme) .input-with-icon { background: #0f172a; border-color: #334155; }
    :host-context(body.dark-theme) .input-with-icon input { color: #f1f5f9; }
    :host-context(body.dark-theme) .static-field-group { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) .static-content { color: #f1f5f9; }
    :host-context(body.dark-theme) .static-content mat-icon { color: #3b82f6; }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  user$ = this.authService.user$;
  profileForm!: FormGroup;
  isSaving = false;
  isEditing = false;

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.profileForm = this.fb.group({
          name: [user.name || '', [Validators.required]],
          phone: [user.phone || '']
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.snackBar.open('Uploading photo...', 'Close', { duration: 2000 });
      this.authService.uploadAvatar(file).subscribe({
        next: () => this.snackBar.open('Profile photo updated!', 'OK', { duration: 3000 }),
        error: (err) => this.snackBar.open('Upload failed: ' + err.message, 'Close', { duration: 5000 })
      });
    }
  }

  saveChanges() {
    if (this.profileForm.invalid) return;
    this.isSaving = true;
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.isEditing = false;
        this.snackBar.open('Profile updated successfully!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.isSaving = false;
        this.snackBar.open('Update failed: ' + err.message, 'Close', { duration: 5000 });
      }
    });
  }

  resetForm() {
    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({ name: user.name, phone: user.phone });
        this.isEditing = false;
      }
    });
  }
}
