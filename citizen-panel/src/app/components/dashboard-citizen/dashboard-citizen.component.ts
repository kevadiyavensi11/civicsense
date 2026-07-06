import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../services/issue.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-dashboard-citizen',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule, NgxChartsModule],
    template: `
    <div class="dashboard-scene">
      <!-- Ambient Background -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="dashboard-container">
        
        <!-- HERO BANNER -->
        <div class="glass-panel hero-banner">
          <div class="hero-content">
             <div class="badge-pill">Citizen Portal v3.0</div>
             <h1>Welcome Back, <span class="highlight">{{ currentUser?.name || 'Change Maker' }}</span></h1>
             <p>Your reports are actively improving the city's infrastructure.</p>


             <div class="action-row">
                 <button class="cta-btn-3d" routerLink="/citizen/report">
                     <mat-icon>add_a_photo</mat-icon> New Report
                 </button>
                 <button class="logout-btn" (click)="logout()">
                     <mat-icon>logout</mat-icon> Logout
                 </button>
             </div>
          </div>
          <div class="hero-visual">
             <div class="floating-icon">
                 <mat-icon>volunteer_activism</mat-icon>
             </div>
          </div>
        </div>

        <!-- 3D STATS GRID -->
        <div class="stats-grid">
            <div class="glass-card stat-card plain">
                <div class="card-inner">
                    <div class="icon-box blue"><mat-icon>assignment</mat-icon></div>
                    <div class="stat-data">
                        <h3>{{ issues.length }}</h3>
                        <p>Total Reports</p>
                    </div>
                </div>
            </div>

            <div class="glass-card stat-card success">
                <div class="card-inner">
                    <div class="icon-box green"><mat-icon>check_circle</mat-icon></div>
                    <div class="stat-data">
                        <h3>{{ getResolvedCount() }}</h3>
                        <p>Resolved</p>
                    </div>
                </div>
            </div>

            <div class="glass-card stat-card warning">
                <div class="card-inner">
                    <div class="icon-box orange"><mat-icon>schedule</mat-icon></div>
                    <div class="stat-data">
                        <h3>{{ getPendingCount() }}</h3>
                        <p>Pending</p>
                    </div>
                </div>
            </div>
            
            <div class="glass-card stat-card info">
                <div class="card-inner">
                    <div class="icon-box cyan"><mat-icon>trending_up</mat-icon></div>
                    <div class="stat-data">
                        <h3>{{ getResolutionRate() }}%</h3>
                        <p>Success Rate</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- CONTENT SPLIT -->
        <div class="split-layout">
            
            <!-- RECENT ACTIVITY LIST -->
            <div class="glass-panel activity-panel">
                <div class="panel-header">
                    <h3>Recent Activity</h3>
                    <a routerLink="/issues" class="link">View All</a>
                </div>

                <div class="activity-list">
                    <div class="activity-item" *ngFor="let issue of issues.slice(0, 5)" routerLink="/issues/{{issue._id}}">
                        <div class="thumb" [style.background-image]="'url(' + issue.imageUrl + ')'"></div>
                        <div class="info">
                            <h4>{{ issue.title }}</h4>
                            <span>{{ issue.area }}</span>
                        </div>
                        <div class="status-pill" [class]="issue.status.replace(' ', '-')">{{ issue.status }}</div>
                    </div>
                    
                    <div *ngIf="issues.length === 0" class="empty-state">
                        <mat-icon>inbox</mat-icon>
                        <p>No activity recorded.</p>
                    </div>
                </div>
            </div>

            <!-- ANALYTICS CHART -->
            <div class="glass-panel chart-panel">
                <div class="panel-header">
                    <h3>Status Analytics</h3>
                </div>
                <div class="chart-container" *ngIf="issueStatusData.length > 0">
                    <ngx-charts-pie-chart
                        [view]="[280, 240]"
                        [scheme]="colorScheme"
                        [results]="issueStatusData"
                        [doughnut]="true"
                        [legend]="false"
                        [labels]="true">
                    </ngx-charts-pie-chart>
                </div>
            </div>
        </div>

      </div>
    </div>
    `,
    styles: [`
    :host { display: block; }

    .dashboard-scene {
        min-height: 100vh;
        background: #f8fafc; /* Fallback */
        position: relative;
        overflow: hidden;
        padding: 24px;
    }

    /* Ambient Orbs */
    .glow-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; z-index: 0; animation: float 10s infinite; }
    .orb-1 { width: 300px; height: 300px; background: #60a5fa; top: -50px; left: -50px; }
    .orb-2 { width: 400px; height: 400px; background: #34d399; bottom: -100px; right: -100px; animation-delay: -5s; }
    @keyframes float { 0%{transform:translate(0,0)} 50%{transform:translate(30px,30px)} 100%{transform:translate(0,0)} }

    .dashboard-container { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

    /* Glass Panels */
    .glass-panel {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: 24px;
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        padding: 32px;
        margin-bottom: 24px;
    }

    /* Hero Banner */
    .hero-banner {
        display: flex; justify-content: space-between; align-items: center;
        background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4));
    }
    .hero-content { max-width: 500px; }
    .badge-pill { display: inline-block; padding: 6px 12px; background: #dbeafe; color: #2563eb; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 16px; }
    .hero-banner h1 { font-size: 2rem; color: #1e293b; margin-bottom: 12px; }
    .highlight { color: #2563eb; }
    .hero-banner p { color: #64748b; margin-bottom: 24px; font-size: 1.1rem; }

    .cta-btn-3d {
        padding: 12px 24px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white; border: none; border-radius: 12px;
        font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;
        box-shadow: 0 4px 0 #1e40af, 0 10px 20px rgba(37,99,235,0.3);
        transition: transform 0.1s;
    }
    .cta-btn-3d:active { transform: translateY(4px); box-shadow: 0 0 0 #1e40af; }
    
    .action-row { display: flex; gap: 12px; align-items: center; }

    .logout-btn {
        padding: 12px 24px;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px;
        font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;
        transition: all 0.2s;
    }
    .logout-btn:hover { background: rgba(239, 68, 68, 0.2); transform: translateY(-2px); }

    .hero-visual { position: relative; width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; }
    .floating-icon {
        width: 100px; height: 100px; background: white; border-radius: 24px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        animation: iconFloat 4s ease-in-out infinite;
    }
    .floating-icon mat-icon { font-size: 48px; width: 48px; height: 48px; color: #2563eb; }
    @keyframes iconFloat { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-15px) rotate(5deg)} }

    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 24px; }
    
    .glass-card {
        background: rgba(255,255,255,0.6); backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.6);
        border-radius: 20px; padding: 24px;
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
    }
    .glass-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); background: white; }

    .card-inner { display: flex; align-items: center; gap: 20px; }
    .icon-box { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; }
    .icon-box mat-icon { font-size: 28px; width: 28px; height: 28px; }
    
    .blue { background: linear-gradient(135deg, #60a5fa, #2563eb); }
    .green { background: linear-gradient(135deg, #34d399, #10b981); }
    .orange { background: linear-gradient(135deg, #fbbf24, #d97706); }
    .cyan { background: linear-gradient(135deg, #22d3ee, #0891b2); }

    .stat-data h3 { font-size: 1.8rem; margin: 0; color: #1e293b; line-height: 1; }
    .stat-data p { margin: 4px 0 0; color: #64748b; font-size: 0.9rem; }

    /* Split Layout */
    .split-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    @media (max-width: 900px) { .split-layout { grid-template-columns: 1fr; } }

    .panel-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .panel-header h3 { font-size: 1.2rem; color: #1e293b; margin: 0; }
    .link { color: #2563eb; text-decoration: none; font-weight: 500; }

    .activity-list { display: flex; flex-direction: column; gap: 12px; }
    .activity-item {
        display: flex; align-items: center; gap: 16px;
        padding: 12px; border-radius: 12px;
        background: rgba(255,255,255,0.5); border: 1px solid transparent;
        transition: 0.2s; cursor: pointer;
    }
    .activity-item:hover { background: white; border-color: #e2e8f0; transform: translateX(4px); }

    .thumb { width: 48px; height: 48px; border-radius: 10px; background-size: cover; background-color: #e2e8f0; }
    .info { flex: 1; }
    .info h4 { margin: 0 0 4px; font-size: 0.95rem; color: #1e293b; }
    .info span { font-size: 0.8rem; color: #64748b; }

    .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .status-pill.Open { background: #fee2e2; color: #ef4444; }
    .status-pill.Resolved { background: #dcfce7; color: #166534; }
    
    .chart-container { display: flex; justify-content: center; }
    .empty-state { text-align: center; color: #94a3b8; padding: 40px; }

    /* DARK THEME */
    :host-context(body.dark-theme) .dashboard-scene { background: #020617; }
    :host-context(body.dark-theme) .hero-banner { 
        background: linear-gradient(135deg, rgba(30,41,59,0.95), rgba(30,41,59,0.8)); 
        border-color: rgba(255,255,255,0.1); 
    }
    :host-context(body.dark-theme) .hero-banner h1, 
    :host-context(body.dark-theme) .panel-header h3, 
    :host-context(body.dark-theme) .stat-data h3,
    :host-context(body.dark-theme) .info h4 { color: #f8fafc !important; }
    
    :host-context(body.dark-theme) .hero-banner p,
    :host-context(body.dark-theme) .stat-data p,
    :host-context(body.dark-theme) .info span { color: #94a3b8 !important; }

    :host-context(body.dark-theme) .badge-pill { background: #1e293b; color: #60a5fa; }
    :host-context(body.dark-theme) .floating-icon { background: #1e293b; }
    :host-context(body.dark-theme) .floating-icon mat-icon { color: #60a5fa; }

    :host-context(body.dark-theme) .glass-panel,
    :host-context(body.dark-theme) .glass-card { 
        background: rgba(30,41,59,0.8) !important; 
        border-color: rgba(255,255,255,0.08) !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    :host-context(body.dark-theme) .glass-card:hover { background: #1e293b !important; }

    :host-context(body.dark-theme) .activity-item { background: rgba(15, 23, 42, 0.4); }
    :host-context(body.dark-theme) .activity-item:hover { background: #1e293b; border-color: #334155; }
    
    /* Chart label contrast fix */
    :host-context(body.dark-theme) ::ng-deep .ngx-charts text { fill: #94a3b8 !important; }
    
    /* Specific status colors */
    .status-pill.In-Progress { background: #dbeafe; color: #2563eb; }
    :host-context(body.dark-theme) .status-pill.In-Progress { background: rgba(37, 99, 235, 0.15); color: #60a5fa; }
    :host-context(body.dark-theme) .status-pill.Open { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    :host-context(body.dark-theme) .status-pill.Resolved { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    
    :host-context(body.dark-theme) .empty-state { color: #64748b; }
    `]
})
export class DashboardCitizenComponent implements OnInit {
    issueService = inject(IssueService);
    authService = inject(AuthService);
    cdr = inject(ChangeDetectorRef); // MANDATORY: Force UI Update
    issues: any[] = [];
    issueStatusData: any[] = [];
    colorScheme: Color = { name: 'custom', selectable: true, group: ScaleType.Ordinal, domain: ['#10b981', '#ef4444', '#f59e0b', '#06b6d4'] };
    currentUser: User | null = null;

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                console.log('Citizen Logged In:', { citizenId: user._id, email: user.email }); // Instruction 8
                this.refreshIssues();
            }
        });
    }

    refreshIssues() {
        // Fetch more items to ensure dashboard stats (pending/resolved) are accurate based on recent history
        this.issueService.getIssues(undefined, 100).subscribe({
            next: (data) => {
                this.issues = data;
                console.log('Fetched Reports Count:', this.issues.length);
                this.prepareChartData();
                this.cdr.detectChanges(); // MANDATORY: Force UI Update
            },
            error: (err) => console.error('Error loading reports', err)
        });
    }

    prepareChartData() {
        const counts: any = {};
        if (!this.issues.length) return;
        this.issues.forEach(i => counts[i.status] = (counts[i.status] || 0) + 1);
        this.issueStatusData = Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
    }

    getResolvedCount() { return this.issues.filter(i => i.status === 'Resolved').length; }
    getPendingCount() { return this.issues.filter(i => i.status === 'Open').length; }
    getResolutionRate() { return this.issues.length ? Math.round((this.getResolvedCount() / this.issues.length) * 100) : 0; }

    logout() {
        this.authService.logout().subscribe();
    }
}
