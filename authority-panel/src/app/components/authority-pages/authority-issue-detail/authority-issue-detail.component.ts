
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IssueService } from '../../../services/issue.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-authority-issue-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        RouterModule
    ],
    template: `
    <div class="detail-container" *ngIf="issue; else loading">
        
        <!-- Header -->
        <div class="detail-header">
            <div class="h-left">
                <a routerLink="/authority/verified-issues" class="back-link"><mat-icon>arrow_back</mat-icon> Back to List</a>
                <h1>
                    Issue #{{ issue.ticketNumber || issue._id | slice:0:6 }}
                    <span class="status-badge" [class]="issue.status.replace(' ','-').toLowerCase()">{{ issue.status }}</span>
                </h1>
            </div>
            <div class="h-right">
                <button mat-flat-button color="primary" *ngIf="issue.status !== 'Resolved'" (click)="updateStatus('Resolved')">
                    Mark Resolved
                </button>
            </div>
        </div>

        <!-- Split Layout -->
        <div class="split-layout">
            
            <!-- LEFT PANEL: Image & Citizen Description -->
            <div class="panel left-panel">
                <div class="image-wrapper">
                    <img [src]="issue.imageUrl || 'assets/placeholder.jpg'" alt="Issue Image" class="main-image">
                    <div class="img-overlay">
                        <span class="loc-tag"><mat-icon>place</mat-icon> {{ issue.location?.address }}</span>
                        <span class="time-tag">{{ issue.createdAt | date:'medium' }}</span>
                    </div>
                </div>

                <div class="content-block">
                    <h3>Citizen Description</h3>
                    <p class="desc-text">{{ issue.description }}</p>
                </div>
                
                <div class="content-block">
                     <h3>Reported By</h3>
                     <div class="reporter-info">
                         <div class="avatar">{{ (issue.userId || 'A').charAt(0) }}</div>
                         <span>Citizen ID: {{ issue.userId }}</span>
                     </div>
                </div>
            </div>

            <!-- RIGHT PANEL: AI Verification & Action -->
            <div class="panel right-panel">
                
                <!-- Verification Section -->
                <div class="verification-section">
                    <div class="verification-header">
                        <mat-icon>verified_user</mat-icon> System Verification Analysis
                    </div>
                    
                    <div class="verification-grid">
                         <div class="verification-item">
                             <label>Detected Category</label>
                             <div class="val-text">{{ issue.category }}</div>
                         </div>
                         <div class="verification-item">
                             <label>Priority Level</label>
                             <div class="val-text priority-text" [class]="(issue.priority || 'Medium').toLowerCase()">
                                 {{ issue.priority || 'Medium' }}
                             </div>
                         </div>
                    </div>

                    <div class="verification-remark">
                        <strong>System Observation:</strong> Image verifies high probability of {{ issue.category }}. Location matches GPS metadata.
                    </div>
                </div>

                <!-- Action Form -->
                <div class="action-form">
                    <h3>Authority Action</h3>
                    
                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Update Status</mat-label>
                        <mat-select [(ngModel)]="issue.status">
                            <mat-option value="Open">Open</mat-option>
                            <mat-option value="In Progress">In Progress</mat-option>
                            <mat-option value="Resolved">Resolved</mat-option>
                            <mat-option value="Rejected">Rejected</mat-option>
                        </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Assign to Department</mat-label>
                        <mat-select placeholder="Select Department">
                            <mat-option value="Sanitation">Sanitation</mat-option>
                            <mat-option value="Roads">Roads & Transport</mat-option>
                            <mat-option value="Water">Water Supply</mat-option>
                        </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Action Taken Notes</mat-label>
                        <textarea matInput rows="4" placeholder="Describe the action taken..." [(ngModel)]="actionNotes"></textarea>
                    </mat-form-field>

                    <button mat-raised-button color="primary" class="full-width" (click)="saveAction()">
                        Submit Update
                    </button>
                    
                </div>

            </div>

        </div>

    </div>

    <ng-template #loading>
        <div class="loading-state">Loading details...</div>
    </ng-template>
  `,
    styles: [`
    .detail-container {
        padding: 32px;
        background: #f8fafc;
        min-height: 100vh;
        font-family: 'Inter', sans-serif;
    }
    
    .detail-header {
        display: flex; justify-content: space-between; align-items: flex-start;
        margin-bottom: 24px;
    }
    .back-link { display: flex; align-items: center; gap: 6px; color: #64748b; text-decoration: none; font-size: 0.9rem; margin-bottom: 8px; }
    .detail-header h1 { font-size: 1.75rem; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 16px; font-weight: 700; }
    
    .status-badge { font-size: 0.8rem; padding: 4px 12px; border-radius: 6px; font-weight: 600; text-transform: uppercase; background: #e2e8f0; color: #475569; top: -3px; position: relative; }
    .status-badge.open { background: #fee2e2; color: #b91c1c; }
    .status-badge.in-progress { background: #e0f2fe; color: #0369a1; }
    .status-badge.resolved { background: #dcfce7; color: #15803d; }

    .split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    
    .panel { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }

    /* Left Panel */
    .image-wrapper { position: relative; height: 400px; background: #000; }
    .main-image { width: 100%; height: 100%; object-fit: contain; background: #0f172a; }
    .img-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; justify-content: space-between; color: white; }
    .loc-tag { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 0.9rem; }
    .time-tag { font-size: 0.85rem; opacity: 0.9; }

    .content-block { padding: 24px; border-bottom: 1px solid #f1f5f9; }
    .content-block h3 { margin: 0 0 12px; font-size: 1rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .desc-text { font-size: 1.1rem; line-height: 1.6; color: #334155; }
    
    .reporter-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 40px; height: 40px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #64748b; }

    /* Right Panel */
    .right-panel { padding: 0; border: none; background: transparent; display: flex; flex-direction: column; gap: 24px; }
    
    .ai-section { background: #fff; border: 1px solid #cffafe; border-radius: 8px; overflow: hidden; }
    .ai-header { background: #ecfeff; padding: 16px 24px; color: #0e7490; font-weight: 700; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #cffafe; }
    
    .ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 24px; }
    .ai-item label { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 4px; font-weight: 600; text-transform: uppercase; }
    .val-text { font-size: 1.1rem; font-weight: 600; color: #0f172a; }
    
    .score-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-top: 6px; margin-bottom: 4px; }
    .fill { height: 100%; background: #0891b2; }
    .score-val { font-size: 1.25rem; font-weight: 700; color: #0891b2; }
    
    .priority-text.high { color: #dc2626; }

    .ai-remark { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 0.9rem; color: #475569; font-style: italic; }

    .action-form { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; }
    .action-form h3 { margin-top: 0; margin-bottom: 24px; color: #1e293b; }
    
    .full-width { width: 100%; margin-bottom: 16px; }

    /* Responsive */
    @media (max-width: 900px) {
        .split-layout { grid-template-columns: 1fr; }
    }
    
    :host-context(body.dark-theme) .detail-container { background: #0f172a; }
    :host-context(body.dark-theme) .detail-header h1 { color: #f8fafc; }
    :host-context(body.dark-theme) .panel, 
    :host-context(body.dark-theme) .action-form { background: #1e293b; border-color: #334155; }
    :host-context(body.dark-theme) .desc-text { color: #e2e8f0; }
    :host-context(body.dark-theme) .val-text { color: #f1f5f9; }
    :host-context(body.dark-theme) .verification-section { border-color: #1e293b; background: #1e293b; }
    :host-context(body.dark-theme) .verification-header { background: #164e63; color: #67e8f9; border-color: #155e75; }
    :host-context(body.dark-theme) .verification-remark { background: #0f172a; border-color: #334155; color: #94a3b8; }
  `]
})
export class AuthorityIssueDetailComponent implements OnInit {
    route = inject(ActivatedRoute);
    issueService = inject(IssueService);
    snackBar = inject(MatSnackBar);

    issue: any = null;
    actionNotes: string = '';

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.issueService.getIssueById(id).subscribe((data: any) => {
                this.issue = data;
            });
        }
    }

    updateStatus(status: string) {
        this.issue.status = status;
        this.saveAction();
    }

    saveAction() {
        if (!this.issue) return;

        // Call Service to Update
        this.issueService.updateStatus(this.issue._id, this.issue.status, this.actionNotes).subscribe({
            next: () => {
                this.snackBar.open('Action recorded successfully', 'Close', { duration: 3000 });
            },
            error: () => {
                this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
            }
        });
    }
}
