
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IssueService } from '../../../services/issue.service';

@Component({
    selector: 'app-critical-alerts',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
    template: `
    <div class="page-container">
      <h1 class="page-title text-danger">
          <mat-icon color="warn">warning_amber</mat-icon> Critical Emergency Alerts
      </h1>
      
      <div class="alerts-grid">
         <div class="alert-card" *ngFor="let issue of criticalIssues" [routerLink]="['/authority/issues', issue._id]">
            <div class="alert-header">
                <span class="alert-id">CRITICAL ALERT #{{issue.ticketNumber || issue._id | slice:0:6}}</span>
                <span class="time-elapsed">{{ issue.createdAt | date:'shortTime' }}</span>
            </div>
            
            <div class="alert-body">
                <h2>{{ issue.title }}</h2>
                <div class="location">
                   <mat-icon>place</mat-icon>
                   {{ issue.location?.address || 'Unknown Location' }}
                </div>
                <div class="category-tag">{{ issue.category }}</div>
            </div>

            <div class="alert-footer">
                <button mat-flat-button color="warn">IMMEDIATE ACTION REQUIRED</button>
            </div>
         </div>
      </div>
      
      <div class="empty-state" *ngIf="criticalIssues.length === 0">
          <mat-icon class="text-success">check_circle</mat-icon>
          <h3>No Critical Alerts</h3>
          <p>All emergency systems are stable.</p>
      </div>
    </div>
  `,
    styles: [`
    .page-container {
        padding: 24px;
        background: #fef2f2; /* Light Red Background */
        min-height: 100vh;
    }

    .page-title {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #dc2626;
        font-weight: 800;
        margin-bottom: 32px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .alerts-grid {
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    }

    .alert-card {
        background: white;
        border: 2px solid #dc2626; /* Red Border */
        border-left-width: 8px;
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
        cursor: pointer;
        transition: transform 0.2s;
    }
    .alert-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.2);
    }

    .alert-header {
        display: flex; justify-content: space-between;
        margin-bottom: 16px;
        font-weight: 700;
        color: #991b1b;
    }
    
    .alert-body h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 12px;
    }
    
    .location {
        display: flex; align-items: center; gap: 6px;
        font-size: 1.1rem;
        color: #4b5563;
        margin-bottom: 16px;
    }

    .category-tag {
        display: inline-block;
        background: #fee2e2;
        color: #991b1b;
        padding: 4px 12px;
        border-radius: 4px;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
    }

    .alert-footer {
        margin-top: 24px;
        display: flex; justify-content: flex-end;
    }

    .empty-state {
        text-align: center;
        padding: 60px;
        color: #64748b;
    }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; color: #16a34a; }
  `]
})
export class CriticalAlertsComponent implements OnInit {
    issueService = inject(IssueService);
    criticalIssues: any[] = [];

    ngOnInit() {
        this.issueService.getIssues().subscribe((data: any) => {
            const issues = Array.isArray(data) ? data : (data.issues || []);
            // Filter for Critical
            this.criticalIssues = issues.filter((i: any) =>
                (i.priority && i.priority.toLowerCase() === 'high') ||
                (i.status === 'Critical')
            );
        });
    }
}
