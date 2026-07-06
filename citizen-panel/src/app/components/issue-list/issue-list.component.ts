import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../services/issue.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-issue-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterModule, MatProgressSpinnerModule],
    template: `
    <div class="page-container">
      
      <div class="feed-header">
        <div class="header-content">
            <h1 class="text-gradient">Live Incident Feed</h1>
            <p>Real-time civic data stream verified by system protocols.</p>
        </div>
      </div>

      <div class="issue-grid">
        <div class="issue-card" *ngFor="let issue of issues" [routerLink]="['/issues', issue._id]">
           
           <div class="card-image-wrapper">
               <div class="card-image" [style.background-image]="'url(' + issue.imageUrl + ')'"></div>
               <span class="status-badge" [class]="issue.status.replace(' ','-')">{{ issue.status }}</span>
               
               <div class="verified-badge" *ngIf="issue.systemVerified" title="System Verified">
                   <mat-icon>verified</mat-icon>
               </div>
           </div>
           
           <div class="card-body">
               <div class="meta-row">
                   <span class="category"><mat-icon>category</mat-icon> {{ issue.category }}</span>
                   <span class="date">{{ issue.createdAt | date:'MMM d, h:mm a' }}</span>
               </div>
               
               <h3>{{ issue.title }}</h3>
               
               <div class="location-row">
                   <mat-icon>place</mat-icon>
                   <span [title]="issue.location?.address">
                       {{ issue.location?.area || issue.location?.locality || issue.area || 'Unknown Area' }}, {{ issue.location?.city || 'India' }}
                   </span>
                   <span class="zone-tag" *ngIf="issue.jurisdictionArea || issue.zone">{{ issue.jurisdictionArea || issue.zone }}</span>
               </div>
               
               <div class="action-row">
                    <span class="view-details">View Data <mat-icon>arrow_forward</mat-icon></span>
               </div>
           </div>
        </div>
      </div>
      
      <div class="empty-feed" *ngIf="!isLoading && issues.length === 0">
        <mat-icon>check_circle_outline</mat-icon>
        <h3>All Caught Up!</h3>
        <p>No active issues found.</p>
      </div>

      <div class="loading-state" *ngIf="isLoading">
          <mat-spinner diameter="40" color="accent"></mat-spinner>
          <p>Syncing Feed Data...</p>
      </div>

    </div>
  `,
    styles: [`
    /* Container & Grid */
    .page-container { max-width: 1400px; margin: 0 auto; padding: 24px; }
    
    .feed-header { margin-bottom: 32px; }
    .header-content h1 { font-size: 2rem; color: var(--text-primary, #1e293b); margin: 0 0 8px; font-weight: 700; }
    .header-content p { color: var(--text-secondary, #64748b); margin: 0; font-size: 1rem; }

    .issue-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
        gap: 24px; 
    }

    /* Clean Card Design */
    .issue-card { 
        background: white;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        display: flex; flex-direction: column;
        height: 100%;
        position: relative;
    }

    .issue-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px -8px rgba(0,0,0,0.12);
        border-color: #cbd5e1;
    }

    /* Image Section */
    .card-image-wrapper {
        height: 180px;
        position: relative;
        overflow: hidden;
        background: #f1f5f9;
        border-bottom: 1px solid #f1f5f9;
    }

    .card-image {
        width: 100%; height: 100%;
        background-size: cover; background-position: center;
        transition: transform 0.5s ease;
    }
    .issue-card:hover .card-image { transform: scale(1.05); }

    /* Badges */
    .status-badge {
        position: absolute; top: 12px; right: 12px;
        padding: 4px 10px; border-radius: 6px;
        font-size: 0.75rem; font-weight: 600;
        text-transform: capitalize;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .status-badge.Open { color: #dc2626; border-left: 3px solid #dc2626; }
    .status-badge.Resolved { color: #16a34a; border-left: 3px solid #16a34a; }
    .status-badge.In-Progress { color: #2563eb; border-left: 3px solid #2563eb; }
    .status-badge.Rejected { color: #475569; border-left: 3px solid #475569; }

    .verified-badge {
        position: absolute; top: 12px; left: 12px;
        background: white; color: #0891b2;
        width: 28px; height: 28px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .verified-badge mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* Card Body */
    .card-body {
        padding: 16px;
        display: flex; flex-direction: column; gap: 12px; flex: 1;
    }

    .meta-row {
        display: flex; justify-content: space-between; align-items: center;
        font-size: 0.8rem; color: #64748b;
    }
    .category { display: flex; align-items: center; gap: 4px; font-weight: 500; color: #475569; }
    .category mat-icon { font-size: 16px; width: 16px; height: 16px; color: #94a3b8; }

    h3 {
        margin: 0; font-size: 1.1rem; font-weight: 600;
        color: #1e293b; line-height: 1.4;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }

    .location-row {
        display: flex; align-items: flex-start; gap: 8px;
        font-size: 0.85rem; color: #64748b; line-height: 1.3;
    }
    .location-row mat-icon { font-size: 18px; width: 18px; height: 18px; margin-top: 1px; color: #94a3b8; }
    
    .zone-tag {
        margin-left: auto; font-size: 0.7rem; font-weight: 600;
        background: #f1f5f9; color: #475569;
        padding: 2px 8px; border-radius: 4px;
        white-space: nowrap;
        max-width: 100px; overflow: hidden; text-overflow: ellipsis;
    }

    /* Footer / Action */
    .action-row {
        margin-top: auto; padding-top: 12px;
        border-top: 1px solid #f1f5f9;
        display: flex; justify-content: flex-end;
    }
    .view-details {
        font-size: 0.85rem; font-weight: 600; color: #2563eb;
        display: flex; align-items: center; gap: 4px;
        transition: gap 0.2s;
    }
    .issue-card:hover .view-details { gap: 8px; text-decoration: underline; }

    /* Empty & Loading */
    .empty-feed, .loading-state { text-align: center; padding: 40px; color: #94a3b8; }
    .empty-feed mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; opacity: 0.5; }

    /* DARK THEME */
    :host-context(body.dark-theme) .header-content h1 { color: #f8fafc; }
    :host-context(body.dark-theme) .text-gradient {
        background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    :host-context(body.dark-theme) .header-content p { color: #94a3b8; }
    
    :host-context(body.dark-theme) .issue-card {
        background: #1e293b;
        border-color: #334155;
    }
    :host-context(body.dark-theme) .issue-card:hover { border-color: #475569; background: #233147; }
    :host-context(body.dark-theme) .card-image-wrapper { background: #0f172a; border-bottom-color: #334155; }
    
    :host-context(body.dark-theme) h3 { color: #f1f5f9; }
    :host-context(body.dark-theme) .meta-row,
    :host-context(body.dark-theme) .location-row,
    :host-context(body.dark-theme) .category { color: #94a3b8; }
    
    :host-context(body.dark-theme) .status-badge { background: #0f172a; color: white; }
    :host-context(body.dark-theme) .verified-badge { background: #0f172a; color: #22d3ee; }
    :host-context(body.dark-theme) .zone-tag { background: #334155; color: #cbd5e1; }
    :host-context(body.dark-theme) .action-row { border-top-color: #334155; }
    :host-context(body.dark-theme) .view-details { color: #60a5fa; }
  `]
})
export class IssueListComponent implements OnInit {
    issueService = inject(IssueService);
    issues: any[] = [];
    isLoading = true;

    ngOnInit() {
        this.isLoading = true;
        this.issueService.getIssues().subscribe({
            next: (data: any) => {
                this.issues = Array.isArray(data) ? data : (data.issues || []);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load issues', err);
                this.isLoading = false;
            }
        });
    }

    onCardMove(event: MouseEvent) { }
    onCardLeave(event: MouseEvent) { }
}
