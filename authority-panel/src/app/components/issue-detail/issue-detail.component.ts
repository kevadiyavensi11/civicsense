import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule, MatIconModule, MatDividerModule],
  template: `
    <div class="container" *ngIf="issue">
      <mat-card class="detail-card">
        <div class="header">
          <h1>{{ issue.title }}</h1>
          <span class="status-badge" [class]="issue.status.replace(' ','-').toLowerCase()">{{ issue.status }}</span>
        </div>
        
        <div class="content">
          <!-- Main Issue Image -->
          <div class="image-section">
             <div class="img-wrapper main-img" [style.backgroundImage]="'url(' + issue.imageUrl + ')'"></div>
             <p class="img-label">Reported Issue</p>
          </div>

          <!-- System Verification Card -->
          <div class="verification-card" *ngIf="issue">
             <div class="verification-header">
                <mat-icon>verified_user</mat-icon>
                <span>System Verification Report</span>
             </div>
             <div class="verification-body">
                <div class="verification-metric">
                    <span class="m-label">Verification</span>
                    <span class="m-val">{{ issue.systemVerified ? 'Confirmed' : 'Uncertain' }}</span>
                </div>
                <div class="verification-metric">
                    <span class="m-label">Priority Assessment</span>
                    <span class="m-val priority-text">{{ issue.priority }}</span>
                </div>
             </div>
             <div class="verification-remarks" *ngIf="issue.verificationRemarks">
                 <strong>System Observation:</strong> "{{ issue.verificationRemarks }}"
             </div>
          </div>

          <!-- Text Details -->
          <div class="details">
             <div class="detail-item">
                 <span class="label">Description:</span>
                 <p>{{ issue.description }}</p>
             </div>
             <div class="detail-grid">
                 <div class="item"><span class="label">Category:</span> {{ issue.category }}</div>
                 <div class="item"><span class="label">Priority:</span> {{ issue.priority }}</div>
                 <div class="item"><span class="label">Verified:</span> {{ issue.systemVerified ? 'Yes' : 'No' }}</div>
                 <div class="item"><span class="label">Reporter:</span> {{ issue.reportedBy?.name || 'Anonymous' }}</div>
             </div>
             <div class="detail-item">
                 <span class="label">Location:</span>
                 <p class="address">{{ issue.location?.address || issue.location?.fullAddress }}</p>
                 <a *ngIf="issue.location?.lat" 
                    href="https://www.google.com/maps?q={{issue.location.lat}},{{issue.location.lng}}" 
                    target="_blank" class="map-link">View on Map</a>
             </div>
          </div>
        </div>

        <!-- RESOLUTION SECTION (Only if Resolved) -->
        <div class="resolution-section" *ngIf="issue.status === 'Resolved'">
            <mat-divider></mat-divider>
            <h3><mat-icon class="check-icon">check_circle</mat-icon> Resolution Details</h3>
            
            <div class="res-content">
                <div class="res-image" *ngIf="issue.resolutionImageUrl">
                    <div class="img-wrapper proof-img" [style.backgroundImage]="'url(' + issue.resolutionImageUrl + ')'"></div>
                    <p class="img-label">Proof of Resolution</p>
                </div>
                <div class="res-info">
                    <p><strong>Remarks:</strong> {{ issue.resolutionRemarks || issue.latestStatusLog?.remarks || 'No remarks provided.' }}</p>
                    <p class="res-date" *ngIf="issue.latestStatusLog">Resolved on {{ issue.latestStatusLog.createdAt | date:'medium' }}</p>
                </div>
            </div>
        </div>

        <mat-card-actions align="end">
           <button mat-stroked-button [routerLink]="dashboardPath">Back to Dashboard</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
    .detail-card { padding: 24px; border-radius: 12px; }
    
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 1px solid #eee; padding-bottom: 16px; }
    h1 { margin: 0; font-size: 1.8rem; color: var(--text-primary); }
    
    .status-badge { padding: 6px 16px; border-radius: 20px; color: white; font-weight: 600; font-size: 0.9rem; text-transform: capitalize; }
    .status-badge.open { background: #ef4444; }
    .status-badge.in-progress { background: #3b82f6; }
    .status-badge.resolved { background: #10b981; }
    .status-badge.rejected { background: #64748b; }

    .content { display: flex; gap: 32px; flex-wrap: wrap; margin-bottom: 24px; }
    .image-section { flex: 1; min-width: 300px; }
    .img-wrapper { width: 100%; height: 250px; background-size: cover; background-position: center; border-radius: 8px; border: 1px solid #ddd; }
    .img-label { color: #888; font-size: 0.8rem; text-align: center; margin-top: 4px; }
    
    /* Verification Card Styles */
    .verification-card {
        flex: 1;
        min-width: 250px;
        background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%);
        border: 1px solid #bae6fd;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .verification-header { display: flex; align-items: center; gap: 8px; color: #0284c7; font-weight: bold; margin-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px; }
    .verification-body { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .verification-metric { display: flex; flex-direction: column; }
    .m-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; }
    .m-val { font-size: 1.1rem; font-weight: 700; color: #334155; }
    .verification-remarks { font-size: 0.9rem; color: #475569; background: rgba(255,255,255,0.5); padding: 8px; border-radius: 6px; font-style: italic; }

    .details { flex: 1.5; min-width: 300px; display: flex; flex-direction: column; gap: 16px; }
    .label { font-weight: 600; color: #555; margin-right: 8px; }
    .detail-item p { margin: 4px 0 0; color: #333; line-height: 1.5; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .address { font-size: 0.95rem; }
    .map-link { color: var(--primary-main); font-size: 0.9rem; text-decoration: none; display: inline-block; margin-top: 4px; }

    /* Resolution Section */
    .resolution-section { margin-top: 24px; padding-top: 24px; }
    .resolution-section h3 { display: flex; align-items: center; gap: 8px; color: #10b981; margin-bottom: 16px; margin-top: 16px; } 
    .check-icon { font-size: 24px; height: 24px; width: 24px; }
    
    .res-content { display: flex; gap: 24px; background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0; flex-wrap: wrap; }
    .res-image { width: 200px; }
    .proof-img { height: 150px; }
    .res-info { flex: 1; }
    .res-date { color: #666; font-size: 0.85rem; margin-top: 8px; }

    /* Dark Mode Support */
    :host-context(body.dark-theme) {
        .detail-card { background: #1e293b; color: #f1f5f9; border: 1px solid #334155; }
        .header { border-bottom-color: #334155; }
        h1 { color: #f1f5f9; }
        .label { color: #94a3b8; }
        .detail-item p, .item { color: #cbd5e1; }
        .img-wrapper { border-color: #475569; }
        
        .res-content { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
        .res-date { color: #9ca3af; }
    }
  `]
})
export class IssueDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  issueService = inject(IssueService);
  authService = inject(AuthService);
  issue: any = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.issueService.getIssueById(id).subscribe(data => this.issue = data);
    }
  }

  get dashboardPath(): string {
    const userRole = (this.authService.currentUserValue as any)?.role;
    return userRole === 'authority' ? '/authority/dashboard' : '/citizen/dashboard';
  }
}
