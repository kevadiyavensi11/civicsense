import { Component, Inject, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { IssueStatusDialogComponent } from '../issue-status-dialog/issue-status-dialog.component';

@Component({
    selector: 'app-issue-view-dialog',
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
    <div class="dialog-header">
      <h2>Issue Details</h2>
      <button mat-icon-button (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div class="dialog-content">
      <div class="issue-header">
        <div class="image-preview" *ngIf="data.issue.imageUrl">
            <img [src]="data.issue.imageUrl" alt="Issue Image">
        </div>
        <div class="issue-main-info">
            <h3>{{data.issue.title}}</h3>
            <div class="badges">
                <mat-chip-set>
                    <mat-chip [class]="getStatusClass(data.issue.status)">{{data.issue.status}}</mat-chip>
                    <mat-chip class="priority-badge">{{data.issue.priority | titlecase}} Priority</mat-chip>
                </mat-chip-set>
            </div>
            <p class="description">{{data.issue.description}}</p>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="details-grid">
        <div class="detail-item">
            <span class="label">Category</span>
            <span class="value">{{data.issue.category}}</span>
        </div>
        <div class="detail-item">
            <span class="label">Date Reported</span>
            <span class="value">{{data.issue.createdAt | date:'medium'}}</span>
        </div>
        <div class="detail-item">
            <span class="label">Location Logic</span>
            <span class="value">{{data.issue.jurisdictionArea || 'Zone Pending'}}</span>
            <span class="sub-value">{{data.issue.location?.lat | number:'1.4-4'}}, {{data.issue.location?.lng | number:'1.4-4'}}</span>
        </div>
        <div class="detail-item" style="grid-column: span 2">
            <span class="label">Full Address</span>
            <span class="value">
                <mat-icon inline style="font-size: 14px;">location_on</mat-icon>
                {{data.issue.location?.address || data.issue.location?.fullAddress || 'Address Pending'}}
            </span>
            <div class="address-badges" style="margin-top: 8px; display: flex; gap: 8px;">
                <span class="tag-badge">{{data.issue.location?.locality || data.issue.location?.area || 'Locality N/A'}}</span>
                <span class="tag-badge">{{data.issue.location?.city || 'City N/A'}}</span>
                <span class="tag-badge">{{data.issue.location?.pincode || 'Pin N/A'}}</span>
            </div>
        </div>
        <div class="detail-item">
            <span class="label">Reported By</span>
            <span class="value">{{data.issue.reportedBy?.name || 'Anonymous'}}</span>
            <span class="sub-value">{{data.issue.reportedBy?.email}}</span>
        </div>
      </div>

       <div class="verification-section" *ngIf="data.issue.systemVerified">
          <h4>System Verification Report</h4>
          <div class="verification-grid">
             <div class="verification-tags">
                <span class="tag" [class.verified]="data.issue.systemVerified">{{ data.issue.systemVerified ? 'System Verified' : 'Unverified' }}</span>
                <span class="tag priority-tag">{{ data.issue.priority }} Priority</span>
            </div>
          </div>
          <div class="verification-remarks-box" *ngIf="data.issue.verificationRemarks">
             <span class="label">Observation:</span> "{{ data.issue.verificationRemarks }}"
          </div>
       </div>
       
       <div class="resolution-section" *ngIf="data.issue.resolutionImageUrl">
            <h4>✅ Resolution Proof</h4>
            <div class="resolution-content">
                <img [src]="data.issue.resolutionImageUrl" alt="Resolution Proof">
                <p *ngIf="data.issue.remarks" class="res-remarks">"{{data.issue.remarks}}"</p>
            </div>
       </div>
    </div>

    <div class="dialog-actions">
       <button mat-stroked-button (click)="updateStatus()">
        <mat-icon>edit</mat-icon> Update Status
      </button>
      <button mat-button (click)="dialogRef.close()">Close</button>
    </div>
  `,
    styles: [`
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 24px 0; }
    h2 { margin: 0; color: var(--primary-main); font-family: 'Outfit', sans-serif; }
    
    .dialog-content { padding: 24px; min-width: 500px; max-width: 700px; max-height: 80vh; overflow-y: auto; }
    
    .issue-header { display: flex; gap: 24px; margin-bottom: 24px; }
    .image-preview { width: 150px; height: 150px; border-radius: 12px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1); }
    .image-preview img { width: 100%; height: 100%; object-fit: cover; }
    
    .issue-main-info h3 { margin: 0 0 12px 0; font-size: 1.5rem; line-height: 1.2; }
    .badges { margin-bottom: 12px; }
    .description { color: var(--text-secondary); line-height: 1.5; margin: 0; font-size: 0.95rem; }

    mat-divider { margin: 16px 0; border-top-color: rgba(255,255,255,0.1); }

    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 16px; }
    .detail-item { display: flex; flex-direction: column; gap: 4px; }
    .label { color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 1rem; color: var(--text-primary); font-weight: 500; }
    .sub-value { font-size: 0.85rem; color: var(--text-secondary); }

    .verification-section { margin-top: 24px; background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; }
    .verification-section h4 { margin: 0 0 12px 0; font-size: 1rem; color: var(--primary-light); }
    .verification-grid { display: flex; gap: 24px; align-items: center; }
    .verification-tags { display: flex; gap: 8px; flex-wrap: wrap; }
    .tag { background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; }
    .tag.verified { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
    .verification-remarks-box { margin-top: 12px; font-size: 0.9rem; color: #cbd5e1; font-style: italic; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px; }

    .dialog-actions { display: flex; justify-content: space-between; padding: 0 24px 24px; }

    .red-badge { background-color: rgba(239, 68, 68, 0.2) !important; color: #ef4444 !important; }
    .blue-badge { background-color: rgba(59, 130, 246, 0.2) !important; color: #3b82f6 !important; }
    .green-badge { background-color: rgba(34, 197, 94, 0.2) !important; color: #22c55e !important; }
    .tag-badge { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.1); }
    .priority-badge { background-color: rgba(255, 255, 255, 0.1) !important; color: var(--text-primary) !important; }
    
    .resolution-section { margin-top: 24px; padding: 16px; border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; background: rgba(34, 197, 94, 0.05); }
    .resolution-section h4 { color: #22c55e; margin: 0 0 12px 0; font-size: 1rem; }
    .resolution-content { display: flex; gap: 16px; align-items: start; }
    .resolution-content img { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 2px solid #22c55e; }
    .res-remarks { font-style: italic; color: var(--text-secondary); margin: 0; }
  `]
})
export class IssueViewDialogComponent implements OnInit {
    dialog = inject(MatDialog);
    adminService = inject(AdminService);
    toast = inject(ToastService);
    cdr = inject(ChangeDetectorRef);

    constructor(
        public dialogRef: MatDialogRef<IssueViewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { issue: any }
    ) {
        console.log('Issue View Dialog Location:', this.data.issue.location);
    }

    ngOnInit() {
        if (this.data.issue?._id) {
            this.adminService.getIssueById(this.data.issue._id).subscribe({
                next: (fullIssue) => {
                    console.log('Full issue details loaded:', fullIssue);
                    // Update with full details (specifically latestStatusLog for AI score fallback)
                    this.data.issue = { ...this.data.issue, ...fullIssue };
                    this.cdr.detectChanges(); // Force UI update
                },
                error: (err) => console.error('Failed to fetch full issue details', err)
            });
        }
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'open': return 'red-badge';
            case 'in progress': return 'blue-badge';
            case 'resolved': return 'green-badge';
            default: return '';
        }
    }

    updateStatus() {
        const dialogRef = this.dialog.open(IssueStatusDialogComponent, {
            width: '500px',
            data: { title: this.data.issue.title, currentStatus: this.data.issue.status }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.adminService.updateIssueStatus(this.data.issue._id, result.status, result.remarks).subscribe({
                    next: (updatedIssue) => {
                        this.data.issue.status = updatedIssue.status; // Update local view
                        this.toast.success('Status updated');
                        this.dialogRef.close(true); // Close and signal refresh
                    },
                    error: () => this.toast.error('Update failed')
                });
            }
        });
    }
}
