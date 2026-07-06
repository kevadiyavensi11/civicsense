import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-user-view-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatChipsModule
    ],
    template: `
    <div class="m-header">
      <h2 class="m-title"><mat-icon class="title-icon">account_circle</mat-icon> User Details</h2>
      <button class="m-close" (click)="dialogRef.close()"><mat-icon>close</mat-icon></button>
    </div>

    <div class="dialog-content">
      <div class="user-profile-header">
        <div class="avatar-placeholder large">
          <img [src]="'https://ui-avatars.com/api/?name=' + (data.user.name || 'User') + '&background=0F172A&color=fff&bold=true&length=1&size=80'" alt="Avatar">
        </div>
        <div class="user-info-main">
          <h3>{{data.user.name}}</h3>
          <p class="email">{{data.user.email}}</p>
          <div class="capsule-badge" [ngClass]="getRoleClass(data.user.role)">
            <mat-icon class="role-icon">shield</mat-icon>
            {{data.user.role | titlecase}}
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="details-grid">
        <div class="detail-item">
            <span class="label">User ID</span>
            <span class="value">{{data.user._id}}</span>
        </div>
        <div class="detail-item">
            <span class="label">Joined Date</span>
            <span class="value">{{data.user.createdAt | date:'mediumDate'}}</span>
        </div>
        <div class="detail-item" *ngIf="data.user.role === 'authority'">
            <span class="label">Assigned Area</span>
            <span class="value">{{data.user.area || 'N/A'}}</span>
        </div>
        
        <!-- Social Login Info -->
        <div class="detail-item" *ngIf="data.user.googleId">
            <span class="label">Linked Account</span>
            <span class="value"><mat-icon inline style="vertical-align: middle; font-size: 16px;">google</mat-icon> Google</span>
        </div>
        <div class="detail-item" *ngIf="data.user.githubId">
            <span class="label">Linked Account</span>
            <span class="value"><mat-icon inline style="vertical-align: middle; font-size: 16px;">code</mat-icon> GitHub</span>
        </div>
      </div>
    </div>

    <div class="dialog-actions">
      <button class="btn-flat" (click)="dialogRef.close()">CLOSE</button>
    </div>
  `,
    styles: [`
    * { box-sizing: border-box; }
    :host { display: block; border-radius: 20px; overflow: hidden; background: white; width: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    
    .m-header { 
        display: flex; justify-content: space-between; align-items: center; 
        padding: 24px 32px; background: #0F172A; color: white;
    }
    .m-title { display: flex; align-items: center; gap: 12px; margin: 0; font-size: 1.15rem; font-weight: 800; color: white; font-family: 'Poppins', sans-serif; letter-spacing: -0.5px; }
    .title-icon { color: #10B981; font-size: 24px; width: 24px; height: 24px; }
    
    .m-close { background: transparent; border: none; color: #94A3B8; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; border-radius: 8px; padding: 4px; }
    .m-close:hover { color: white; background: rgba(255,255,255,0.1); }
    
    .dialog-content { padding: 32px; min-width: 450px; background: #F8FAFC; }
    
    .user-profile-header { display: flex; align-items: center; gap: 24px; margin-bottom: 32px; }
    .avatar-placeholder.large {
        width: 80px; height: 80px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden;
    }
    .avatar-placeholder.large img { width: 100%; height: 100%; object-fit: cover; }
    
    .user-info-main { display: flex; flex-direction: column; gap: 4px; }
    .user-info-main h3 { margin: 0; font-size: 1.4rem; font-weight: 700; color: #0F172A; }
    .email { color: #64748B; margin: 0 0 8px 0; font-size: 0.9rem; }

    .capsule-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: fit-content; }
    .role-icon { font-size: 14px; width: 14px; height: 14px; }

    mat-divider { margin: 0 0 24px 0; border-top-color: #E2E8F0; }

    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .detail-item { display: flex; flex-direction: column; gap: 6px; }
    .label { color: #94A3B8; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .value { font-size: 0.95rem; color: #0F172A; font-weight: 600; display: flex; align-items: center; gap: 8px; }

    .purple-badge { background-color: #F3E8FF; color: #7E22CE; border: 1px solid #E9D5FF; }
    .blue-badge { background-color: #DBEAFE; color: #1D4ED8; border: 1px solid #BFDBFE; }
    .green-badge { background-color: #DCFCE7; color: #15803D; border: 1px solid #BBF7D0; }
    
    .dialog-actions { display: flex; justify-content: flex-end; padding: 20px 32px; border-top: 1px solid #E2E8F0; background: white; }
    .btn-flat { 
        background: transparent; border: none; color: #64748B; font-weight: 700; font-size: 0.75rem; 
        letter-spacing: 0.5px; padding: 10px 16px; cursor: pointer; transition: 0.2s; border-radius: 8px;
    }
    .btn-flat:hover { color: #0F172A; background: #F1F5F9; }
  `]
})
export class UserViewDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<UserViewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: any }
    ) { }

    getRoleClass(role: string): string {
        switch (role) {
            case 'admin': return 'purple-badge';
            case 'authority': return 'blue-badge';
            default: return 'green-badge';
        }
    }
}
