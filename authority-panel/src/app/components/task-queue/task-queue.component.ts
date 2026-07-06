import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../services/issue.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ResolveDialogComponent } from '../dialogs/resolve-dialog/resolve-dialog.component';

@Component({
  selector: 'app-task-queue',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    RouterModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="task-queue-scene">
      <div class="header-section">
        <div class="title-area">
          <h1>Task Queue</h1>
          <p class="subtitle">Efficiently manage and track all assigned civic issues</p>
        </div>
        <div class="refresh-area">
           <button mat-flat-button color="primary" (click)="refreshIssues()" [disabled]="isRefreshing">
             <mat-icon [class.spin]="isRefreshing">refresh</mat-icon> 
             {{ isRefreshing ? 'Refreshing...' : 'Refresh Queue' }}
           </button>
        </div>
      </div>

      <!-- FILTERS -->
      <div class="filters-glass">
        <div class="filter-row">
           <mat-form-field appearance="outline" class="search-field">
             <mat-label>Search issues...</mat-label>
             <input matInput [(ngModel)]="searchQuery" (input)="applyFilters()" placeholder="Search by title">
             <mat-icon matPrefix>search</mat-icon>
           </mat-form-field>

           <mat-form-field appearance="outline" class="dropdown-field">
             <mat-label>Zone</mat-label>
             <mat-select [(ngModel)]="selectedZone" (selectionChange)="applyFilters()">
               <mat-option value="all">All Zones</mat-option>
               <mat-option *ngFor="let zone of zones" [value]="zone">{{zone}}</mat-option>
             </mat-select>
           </mat-form-field>

           <mat-form-field appearance="outline" class="dropdown-field">
             <mat-label>Status</mat-label>
             <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
               <mat-option value="all">All Statuses</mat-option>
               <mat-option value="Open">Open</mat-option>
               <mat-option value="In Progress">In Progress</mat-option>
               <mat-option value="Resolved">Resolved</mat-option>
               <mat-option value="Rejected">Rejected</mat-option>
             </mat-select>
           </mat-form-field>

           <mat-form-field appearance="outline" class="dropdown-field">
             <mat-label>Priority</mat-label>
             <mat-select [(ngModel)]="selectedPriority" (selectionChange)="applyFilters()">
               <mat-option value="all">All Priorities</mat-option>
               <mat-option value="Low">Low</mat-option>
               <mat-option value="Medium">Medium</mat-option>
               <mat-option value="High">High</mat-option>
               <mat-option value="Critical">Critical</mat-option>
             </mat-select>
           </mat-form-field>
        </div>
      </div>

      <!-- TABLE / CARDS -->
      <div class="content-container">
        
        <!-- Desktop Table View -->
        <div class="table-frame glass-panel desktop-only">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Issue Data</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Priority</th>
                <th class="text-right">Control</th>
              </tr>
            </thead>
            <tbody *ngIf="filteredIssues.length > 0; else noTasks">
              <tr *ngFor="let issue of paginatedIssues" class="table-row">
                <td>
                  <div class="issue-main">
                    <div class="issue-thumb" [style.background-image]="'url(' + (issue.imageUrl || 'assets/placeholder-issue.jpg') + ')'"></div>
                    <div class="issue-info">
                      <strong class="title">{{ issue.title }}</strong>
                      <span class="meta">{{ issue.createdAt | date:'longDate' }} • ID: {{issue._id | slice:-6}}</span>
                    </div>
                  </div>
                </td>
                <td class="col-zone">
                    <span class="zone-badge" [ngClass]="getZoneClass(issue.zone)">
                        {{ issue.zone || 'Global' }}
                    </span>
                </td>
                <td class="col-status">
                    <span class="status-pill" [ngClass]="getStatusClass(issue.status)">{{ issue.status }}</span>
                </td>
                <td class="col-priority">
                    <div class="priority-badge" [ngClass]="getPriorityClass(issue.priority)">
                        <span class="p-dot"></span> {{ issue.priority }}
                    </div>
                </td>
                <td class="text-right">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" [matMenuTriggerData]="{issue: issue}">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="mobile-only card-list">
           <div *ngFor="let issue of paginatedIssues" class="issue-card animate-in">
              <div class="card-header">
                  <span class="status-chip small" [ngClass]="getStatusClass(issue.status)">{{ issue.status }}</span>
                  <div class="priority-indicator small" [ngClass]="getPriorityClass(issue.priority)">
                      <span class="pulse-dot"></span> {{ issue.priority }}
                  </div>
              </div>
              <div class="card-body">
                  <div class="card-thumb" [style.background-image]="'url(' + (issue.imageUrl || 'assets/placeholder-issue.jpg') + ')'"></div>
                  <div class="card-info">
                      <h3>{{ issue.title }}</h3>
                      <p>{{ issue.zone }}</p>
                      <span class="date">{{ issue.createdAt | date }}</span>
                  </div>
              </div>
              <div class="card-actions">
                  <button mat-button color="primary" routerLink="/authority/issues/{{issue._id}}">View Details</button>
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" [matMenuTriggerData]="{issue: issue}">
                      <mat-icon>settings</mat-icon>
                  </button>
              </div>
           </div>
        </div>

        <ng-template #noTasks>
          <div class="empty-state">
            <mat-icon class="huge-icon">inbox</mat-icon>
            <h3>No Issues Found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        </ng-template>

        <mat-paginator 
          [length]="filteredIssues.length"
          [pageSize]="pageSize" 
          [pageSizeOptions]="[10, 25, 50]"
          (page)="onPageChange($event)"
          class="modern-paginator">
        </mat-paginator>

      </div>
    </div>

    <!-- SHARED ACTION MENU -->
    <mat-menu #actionMenu="matMenu">
        <ng-template matMenuContent let-issue="issue">
            <button mat-menu-item *ngIf="!issue.assignedAuthorityId" (click)="assignToMe(issue)">
                <mat-icon>assignment_ind</mat-icon> Claim Task
            </button>
            <button mat-menu-item (click)="quickUpdate(issue, 'In Progress')" *ngIf="issue.assignedAuthorityId && issue.status === 'Open'">
                 <mat-icon>play_circle</mat-icon> Start Work
            </button>
            <button mat-menu-item (click)="quickUpdate(issue, 'Resolved')" *ngIf="issue.status === 'In Progress'">
                <mat-icon>check_circle</mat-icon> Resolve
            </button>
            <button mat-menu-item (click)="quickUpdate(issue, 'Rejected')" *ngIf="issue.status === 'In Progress'">
                <mat-icon>block</mat-icon> Reject
            </button>
             <button mat-menu-item routerLink="/authority/issues/{{issue._id}}">
                <mat-icon>visibility</mat-icon> Full View
            </button>
        </ng-template>
    </mat-menu>
  `,
  styles: [`
    .task-queue-scene { padding: 40px; background: var(--bg-main); min-height: 100vh; transition: background 0.3s ease; }
    
    .header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    h1 { font-size: 32px; font-weight: 800; color: var(--text-primary); margin: 0; }
    .subtitle { color: var(--text-secondary); margin-top: 4px; font-size: 16px; }

    .filters-glass {
        background: var(--bg-card); 
        border-radius: 16px; 
        padding: 16px 24px;
        box-shadow: var(--shadow-sm); 
        margin-bottom: 24px;
        border: 1px solid var(--border-light);
    }
    .filter-row { 
        display: flex; 
        gap: 16px; 
        align-items: center; 
        flex-wrap: nowrap; 
    }
    .search-field, .dropdown-field { 
        border-radius: 8px;
    }
    .search-field { flex: 2; min-width: 250px; }
    .dropdown-field { flex: 1; min-width: 160px; }
    
    ::ng-deep .filters-glass .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .filters-glass .mat-mdc-text-field-wrapper { background-color: var(--bg-card) !important; }

    .glass-panel { background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-light); box-shadow: var(--shadow-card); overflow: hidden; }
    
    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { padding: 14px 24px; text-align: left; background: transparent; color: var(--text-secondary); font-size: 11px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid var(--border-light); letter-spacing: 0.05em; }
    .table-row { border-bottom: 1px solid var(--border-light); transition: 0.2s; }
    .table-row:hover { background: var(--bg-main); filter: brightness(0.95); }
    .table-row td { padding: 16px 24px; vertical-align: middle; color: var(--text-primary); }

    .issue-main { display: flex; align-items: center; gap: 14px; }
    .issue-thumb { width: 44px; height: 44px; border-radius: 10px; background-size: cover; background-position: center; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .issue-info .title { color: var(--text-primary); font-size: 14px; font-weight: 600; display: block; margin-bottom: 2px; }
    .issue-info .meta { font-size: 11px; color: var(--text-secondary); font-weight: 500; }

    /* Zone Column Styling */
    .col-zone { width: 140px; }
    .zone-badge { 
        padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;
        background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; display: inline-block;
    }
    .zone-central-zone { background: #eff6ff; color: #2563eb; border-color: #dbeafe; }
    .zone-north-zone { background: #f5f3ff; color: #7c3aed; border-color: #ede9fe; }
    .zone-east-zone { background: #ecfdf5; color: #059669; border-color: #d1fae5; }
    .zone-west-zone { background: #fff7ed; color: #d97706; border-color: #ffedd5; }

    /* Status Column Styling */
    .col-status { width: 150px; }
    .status-pill { 
        padding: 5px 12px; border-radius: 100px; font-size: 11px; font-weight: 800; text-transform: uppercase;
        display: inline-flex; align-items: center; justify-content: center; min-width: 90px;
    }
    .status-pill.red-status { background: #fee2e2; color: #991b1b; }
    .status-pill.blue-status { background: #e0f2fe; color: #075985; }
    .status-pill.green-status { background: #dcfce7; color: #166534; }
    
    /* Priority Column Styling */
    .col-priority { width: 140px; }
    .priority-badge { 
        display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; 
        padding: 4px 10px; border-radius: 6px; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569;
    }
    .p-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    
    .priority-badge.critical { background: #450a0a; color: white; border: none; }
    .priority-badge.critical .p-dot { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
    
    .priority-badge.high { background: #fef2f2; color: #991b1b; border-color: #fee2e2; }
    .priority-badge.high .p-dot { background: #ef4444; animation: pulse 1.5s infinite; }
    
    .priority-badge.medium { background: #fffbeb; color: #92400e; border-color: #fef3c7; }
    .priority-badge.medium .p-dot { background: #f59e0b; }
    
    .priority-badge.low { background: #f0fdf4; color: #166534; border-color: #dcfce7; }
    .priority-badge.low .p-dot { background: #22c55e; }
    
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }


    .empty-state { text-align: center; padding: 100px 40px; color: #94a3b8; }
    .huge-icon { font-size: 80px; width: 80px; height: 80px; opacity: 0.2; margin-bottom: 20px; }
    
    .text-right { text-align: right; }
    .modern-paginator { background: transparent; padding-top: 10px; }

    .spin { animation: spin-anim 1s linear infinite; }
    @keyframes spin-anim { 100% { transform: rotate(360deg); } }

    /* RESPONSIVITY */
    .mobile-only { display: none; }
    @media (max-width: 900px) {
        .task-queue-scene { padding: 20px; }
        .desktop-only { display: none; }
        .mobile-only { display: block; }
        .filter-row { flex-direction: column; align-items: stretch; }
        .search-field { min-width: 100%; }
        
        .card-list { display: flex; flex-direction: column; gap: 16px; }
        .issue-card { background: var(--bg-card); border-radius: 16px; padding: 16px; border: 1px solid var(--border-light); }
        .card-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .card-body { display: flex; gap: 12px; }
        .card-thumb { width: 60px; height: 60px; border-radius: 10px; flex-shrink: 0; background-size: cover; }
        .card-info h3 { margin: 0; font-size: 16px; font-weight: 700; color: var(--text-primary); }
        .card-info p { margin: 4px 0; font-size: 13px; color: var(--text-secondary); }
        .card-info .date { font-size: 12px; color: var(--text-muted); }
        .card-actions { border-top: 1px solid var(--border-light); margin-top: 12px; padding-top: 8px; display: flex; justify-content: space-between; }
    }
  `]
})
export class TaskQueueComponent implements OnInit {
  issueService = inject(IssueService);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  cdr = inject(ChangeDetectorRef);

  allIssues: any[] = [];
  filteredIssues: any[] = [];
  paginatedIssues: any[] = [];

  pageSize = 10;
  pageIndex = 0;
  isRefreshing = false;

  // Filters
  searchQuery = '';
  selectedZone = 'all';
  selectedStatus = 'all';
  selectedPriority = 'all';

  zones: string[] = ['Central Zone', 'North Zone', 'West Zone', 'South West Zone', 'South Zone', 'East Zone'];

  ngOnInit() {
    this.refreshIssues();
  }

  refreshIssues() {
    this.isRefreshing = true;
    this.cdr.detectChanges();

    // Fetch with a high limit to ensure client-side filters work on a good dataset
    // Since this component is built for client-side filtering/pagination
    this.issueService.getIssues({ limit: 1000 }).subscribe({
      next: (data: any) => {
        this.allIssues = Array.isArray(data) ? data : (data.issues || []);
        console.log('Refresh successful, issues count:', this.allIssues.length);
        this.applyFilters();
        this.isRefreshing = false;
        this.cdr.detectChanges();
        this.snackBar.open('Queue updated successfully', 'Close', { duration: 2000 });
      },
      error: (err: any) => {
        console.error('Refresh failed:', err);
        this.isRefreshing = false;
        this.snackBar.open('Failed to refresh queue', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.filteredIssues = this.allIssues.filter(issue => {
      const matchSearch = issue.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchZone = this.selectedZone === 'all' || issue.zone === this.selectedZone;
      const matchStatus = this.selectedStatus === 'all' || issue.status === this.selectedStatus;
      const matchPrio = this.selectedPriority === 'all' || issue.priority === this.selectedPriority;
      return matchSearch && matchZone && matchStatus && matchPrio;
    });
    this.pageIndex = 0;
    this.updatePagination();
  }

  updatePagination() {
    const start = this.pageIndex * this.pageSize;
    this.paginatedIssues = this.filteredIssues.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  // Same logic as before for actions...
  assignToMe(issue: any) {
    this.issueService.assignTask(issue._id).subscribe({
      next: () => {
        this.snackBar.open('Task Claimed!', 'Close', { duration: 2000 });
        this.refreshIssues();
      }
    });
  }

  quickUpdate(issue: any, status: string) {
    if (status === 'Resolved') {
      const dialogRef = this.dialog.open(ResolveDialogComponent, { data: { issue } });
      dialogRef.afterClosed().subscribe(res => {
        if (res) this.updateIssueStatus(issue, 'Resolved', res.remarks, res.imageUrl);
      });
      return;
    }
    this.updateIssueStatus(issue, status);
  }

  updateIssueStatus(issue: any, status: string, remarks?: string, imageUrl?: string) {
    this.issueService.updateStatus(issue._id, status, remarks || '', imageUrl).subscribe({
      next: () => {
        this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 2000 });
        this.refreshIssues();
      }
    });
  }

  // Utilities
  getZoneClass(zone: string): string {
    return zone ? `zone-${zone.toLowerCase().replace(/ /g, '-')}` : '';
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s === 'open') return 'red-status';
    if (s.includes('progress')) return 'blue-status';
    if (s === 'resolved') return 'green-status';
    return '';
  }

  getPriorityClass(prio: string): string {
    return prio ? prio.toLowerCase() : '';
  }
}
