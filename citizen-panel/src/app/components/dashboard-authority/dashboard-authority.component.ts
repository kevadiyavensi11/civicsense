
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../services/issue.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard-authority',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatChipsModule, RouterModule, NgxChartsModule],
  template: `
    <div class="dashboard-scene">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="dashboard-container">
        
        <!-- INTRO -->
        <div class="header-glass">
            <div>
               <h1>Metric Command Center</h1>
               <p class="subtitle">Real-time Jurisdiction Overview</p>
            </div>
            <div class="status-indicator">
                <span class="live-dot"></span> System Online
            </div>
        </div>
      
        <!-- HEADER STATS -->
        <div class="stats-row">
            <div class="glass-card stat-item">
                <div class="stat-icon purple"><mat-icon>assignment_ind</mat-icon></div>
                <div>
                   <h3>{{ issues.length }}</h3>
                   <span class="label">Assigned</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="stat-icon orange"><mat-icon>pending_actions</mat-icon></div>
                <div>
                   <h3>{{ getPendingCount() }}</h3>
                   <span class="label">Action Req.</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="stat-icon green"><mat-icon>check_circle</mat-icon></div>
                <div>
                   <h3>{{ getResolvedCount() }}</h3>
                   <span class="label">Resolved</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="stat-icon red"><mat-icon>warning</mat-icon></div>
                <div>
                   <h3>{{ getHighPriorityCount() }}</h3>
                   <span class="label">Critical</span>
                </div>
            </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="split-view">
            
            <!-- TASK TABLE -->
            <div class="glass-panel main-panel">
                <div class="panel-header">
                    <h2>Task Queue</h2>
                </div>

                <div class="table-container">
                    <table class="glass-table">
                        <thead>
                            <tr>
                                <th>Issue Data</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let issue of issues" class="table-row">
                                <td>
                                    <div class="issue-flex">
                                        <div class="thumb" [style.background-image]="'url(' + (issue.imageUrl || 'assets/placeholder.jpg') + ')'"></div>
                                        <div class="issue-text">
                                            <strong>{{ issue.title }}</strong>
                                            <span class="date">{{ issue.createdAt | date:'shortDate' }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="loc-cell">{{ issue.area || 'N/A' }}</td>
                                <td>
                                    <span class="status-badge" [class]="issue.status">{{ issue.status }}</span>
                                </td>
                                <td>
                                    <div class="priority-pill" [class]="issue.priority">
                                        <span class="dot"></span> {{ issue.priority }}
                                    </div>
                                </td>
                                <td>
                                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" [matMenuTriggerData]="{issue: issue}">
                                        <mat-icon>more_vert</mat-icon>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- SIDEBAR -->
            <div class="side-stack">
                 <div class="glass-card map-card">
                      <h3><mat-icon>map</mat-icon> Area Map</h3>
                      <div class="holo-map">
                          <div class="grid-lines"></div>
                          <mat-icon class="map-icon">location_on</mat-icon>
                          <div class="radar-scan"></div>
                      </div>
                 </div>

                 <div class="glass-card chart-card">
                      <h3>Performance</h3>
                      <div class="chart-box">
                           <ngx-charts-pie-chart
                              [view]="[250, 200]"
                              [scheme]="colorScheme"
                              [results]="chartData"
                              [doughnut]="true"
                              [legend]="false">
                           </ngx-charts-pie-chart>
                      </div>
                 </div>
            </div>
        </div>

      </div>
    </div>

    <!-- ACTION MENU -->
    <mat-menu #actionMenu="matMenu">
        <ng-template matMenuContent let-issue="issue">
            <button mat-menu-item (click)="quickUpdate(issue, 'In Progress')">
                <mat-icon>play_circle</mat-icon> Mark In Progress
            </button>
            <button mat-menu-item (click)="quickUpdate(issue, 'Resolved')">
                <mat-icon>check_circle</mat-icon> Mark Resolved
            </button>
             <button mat-menu-item routerLink="/issues/{{issue._id}}">
                <mat-icon>visibility</mat-icon> View Details
            </button>
        </ng-template>
    </mat-menu>
  `,
  styles: [`
    :host { display: block; }
    
    .dashboard-scene {
        min-height: 100vh;
        background: #f1f5f9;
        position: relative;
        padding: 24px;
        overflow-x: hidden;
    }

    .glow-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.3; z-index: 0; animation: float 12s infinite; }
    .orb-1 { width: 400px; height: 400px; background: #a855f7; top: -100px; right: -100px; }
    .orb-2 { width: 300px; height: 300px; background: #06b6d4; bottom: 0; left: 0; animation-delay: -4s; }
    @keyframes float { 0%{transform:translate(0,0)} 50%{transform:translate(40px,20px)} 100%{transform:translate(0,0)} }

    .dashboard-container { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; }

    /* Header */
    .header-glass { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    h1 { font-size: 2rem; margin: 0; color: #1e293b; }
    .subtitle { color: #64748b; font-size: 1rem; margin: 4px 0 0; }
    
    .status-indicator { display: flex; align-items: center; gap: 8px; font-weight: 600; color: #10b981; background: rgba(16,185,129,0.1); padding: 8px 16px; border-radius: 30px; border: 1px solid rgba(16,185,129,0.2); }
    .live-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
    @keyframes pulse { 0%{opacity:1} 50%{opacity:0.4} 100%{opacity:1} }

    /* Stats Grid */
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px; }
    
    .glass-card {
        background: rgba(255,255,255,0.7); backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.6);
        border-radius: 20px; padding: 24px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.03);
        transition: transform 0.3s;
    }
    .glass-card:hover { transform: translateY(-5px); background: white; }
    
    .stat-item { display: flex; align-items: center; gap: 16px; }
    .stat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .stat-icon mat-icon { font-size: 24px; width: 24px; height: 24px; }
    
    .purple { background: linear-gradient(135deg, #a855f7, #7e22ce); }
    .orange { background: linear-gradient(135deg, #fb923c, #ea580c); }
    .green { background: linear-gradient(135deg, #4ade80, #16a34a); }
    .red { background: linear-gradient(135deg, #f87171, #dc2626); }
    
    .stat-item h3 { font-size: 1.8rem; margin: 0; line-height: 1; color: #1e293b; }
    .stat-item .label { color: #64748b; font-size: 0.85rem; font-weight: 500; }

    /* Layout */
    .split-view { display: grid; grid-template-columns: 2.5fr 1fr; gap: 24px; }
    @media (max-width: 1000px) { .split-view { grid-template-columns: 1fr; } }

    /* Table */
    .glass-panel { background: rgba(255,255,255,0.6); backdrop-filter: blur(12px); border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.8); }
    .panel-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
    
    .glass-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
    .glass-table th { text-align: left; padding: 12px; color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
    .table-row { background: white; transition: 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    .table-row td { padding: 16px; border-top: 1px solid transparent; border-bottom: 1px solid transparent; }
    .table-row td:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
    .table-row td:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
    .table-row:hover { transform: scale(1.01); box-shadow: 0 8px 16px rgba(0,0,0,0.05); }

    .issue-flex { display: flex; align-items: center; gap: 12px; }
    .thumb { width: 40px; height: 40px; border-radius: 8px; background-size: cover; background-color: #eee; }
    .issue-text { display: flex; flex-direction: column; }
    .date { font-size: 0.75rem; color: #94a3b8; }
    .loc-cell { font-weight: 500; color: #64748b; }

    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .status-badge.Open { background: #fee2e2; color: #ef4444; }
    .status-badge.Resolved { background: #dcfce7; color: #166534; }
    .status-badge.In.Progress { background: #e0f2fe; color: #0284c7; }

    .priority-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; }
    .priority-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: #ccc; }
    .priority-pill.High .dot { background: #ef4444; }
    .priority-pill.Medium .dot { background: #f59e0b; }

    /* Sidebar */
    .side-stack { display: flex; flex-direction: column; gap: 24px; }
    .holo-map {
        height: 200px; background: #1e293b; border-radius: 16px; position: relative; overflow: hidden;
        display: flex; align-items: center; justify-content: center; margin-top: 12px;
    }
    .grid-lines {
        position: absolute; width: 200%; height: 200%;
        background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 20px 20px; transform: rotateX(45deg);
    }
    .map-icon { color: #06b6d4; font-size: 32px; width: 32px; height: 32px; position: relative; z-index: 2; }
    .radar-scan {
        position: absolute; width: 100%; height: 2px; background: rgba(6,182,212,0.8);
        box-shadow: 0 0 10px #06b6d4; animation: scan 3s infinite linear;
    }
    @keyframes scan { 0%{top:0} 100%{top:100%} }
    
    .chart-box { display: flex; justify-content: center; margin-top: 12px; }
  `]
})
export class DashboardAuthorityComponent implements OnInit {
  issueService = inject(IssueService);
  issues: any[] = [];
  chartData: any[] = [];

  colorScheme: any = { domain: ['#10b981', '#f87171', '#f59e0b', '#06b6d4'] };

  ngOnInit() {
    this.refreshIssues();
  }

  refreshIssues() {
    this.issueService.getIssues().subscribe(data => {
      this.issues = data;
      this.calculateStats();
    });
  }

  calculateStats() {
    const statusCounts: { [key: string]: number } = {};
    if (this.issues.length === 0) return;
    this.issues.forEach(i => statusCounts[i.status] = (statusCounts[i.status] || 0) + 1);
    this.chartData = Object.keys(statusCounts).map(status => ({ name: status, value: statusCounts[status] }));
  }

  quickUpdate(issue: any, status: string) {
    this.issueService.updateStatus(issue._id, status, 'Quick update via Dashboard').subscribe(() => this.refreshIssues());
  }

  getPendingCount() { return this.issues.filter(i => i.status === 'Open').length; }
  getResolvedCount() { return this.issues.filter(i => i.status === 'Resolved').length; }
  getHighPriorityCount() { return this.issues.filter(i => i.priority === 'High' || i.priority === 'Critical').length; }
}
