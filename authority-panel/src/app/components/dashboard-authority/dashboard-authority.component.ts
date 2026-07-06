import { Component, inject, OnInit, AfterViewInit, OnDestroy, PlatformRef, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IssueService } from '../../services/issue.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as L from 'leaflet';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ZONE_BOUNDARIES } from '../../data/zone-data';

@Component({
    selector: 'app-dashboard-authority',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        NgxChartsModule,
        MatSnackBarModule,
        MatDividerModule
    ],
    template: `
    <div class="dashboard-scene">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="dashboard-container">
        
        <!-- INTRO -->
        <div class="header-glass">
            <div>
               <h1>Metric Command Center</h1>
               <p class="subtitle">Real-time Jurisdiction Overview <span *ngIf="currentJurisdiction">for {{currentJurisdiction}}</span></p>
            </div>
        </div>
      
        <!-- HEADER STATS -->
        <div *ngIf="jurisdictionError" class="error-banner">
            <mat-icon>error</mat-icon> Jurisdiction not assigned. Please contact Admin.
        </div>

        <div class="stats-row" *ngIf="!jurisdictionError || issues.length > 0">
            <div class="glass-card stat-item">
                <div class="stat-icon purple"><mat-icon>assignment_ind</mat-icon></div>
                <div>
                   <h3>{{ issues.length }}</h3>
                   <span class="label">Total Assigned</span>
                </div>
            </div>
            <div class="glass-card stat-item">
                <div class="stat-icon blue"><mat-icon>pending_actions</mat-icon></div>
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
                   <span class="label">Critic/High</span>
                </div>
            </div>
        </div>

        <!-- MAP SECTION (Surat Live) -->
        <div class="glass-panel map-panel-container">
            <div class="panel-header map-header-row">
                 <h2><mat-icon>map</mat-icon> Live Geo-Spatial Monitoring (Surat)</h2>
                 <div class="live-tag"><span class="pulse"></span> System Live</div>
            </div>
            <div class="map-layout">
                <div class="map-zones">
                    <div class="zone-header">Active Zones (SMC)</div>
                    <div class="zone-list-scroll">
                        <div class="zone-row" 
                             [class.active]="!selectedZoneName"
                             (click)="panMap(21.1702, 72.8311, '')">
                            <span>All Zones</span>
                            <span class="badge normal">{{ issues.length }} Issues</span>
                        </div>
                        <div class="zone-row" 
                             *ngFor="let zone of zones"
                             [class.active]="selectedZoneName === zone.name"
                             (click)="panMap(zone.center.lat, zone.center.lng, zone.name)">
                            <span>{{ zone.name }}</span> 
                            <span class="badge" [ngClass]="getZoneStatus(zone.name)">{{ getZoneStatusText(zone.name) }}</span>
                        </div>
                    </div>
                </div>
                <div class="map-renderer" id="authority-map"></div>
            </div>
        </div>

        <!-- MAIN CONTENT (Table & Chart) -->

        <div class="split-view">
            <!-- PERFORMANCE CHART -->
            <div class="glass-panel chart-panel">
                <div class="panel-header"><h3>Status Distribution</h3></div>
                <div class="chart-box" *ngIf="chartData.length > 0; else noChart">
                    <ngx-charts-pie-chart
                        [view]="[400, 300]"
                        [scheme]="colorScheme"
                        [results]="chartData"
                        [doughnut]="true"
                        [labels]="true"
                        [legend]="true"
                        [gradient]="false">
                    </ngx-charts-pie-chart>
                </div>
                <ng-template #noChart>
                    <div class="no-chart-placeholder"><p>No data to analyze</p></div>
                </ng-template>
            </div>

            <!-- WEEKLY ACTIVITY -->
            <div class="glass-panel chart-panel">
                <div class="panel-header"><h3>Weekly Resolution Trends</h3></div>
                <div style="height: 300px">
                    <ngx-charts-bar-vertical
                        [view]="[600, 300]"
                        [scheme]="colorScheme"
                        [results]="activityData"
                        [gradient]="false"
                        [xAxis]="true"
                        [yAxis]="true">
                    </ngx-charts-bar-vertical>
                </div>
            </div>
        </div>


      </div>
    </div>

  `,
    styles: [`
    :host { display: block; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    
    .dashboard-scene {
        min-height: 100vh;
        background: var(--bg-main);
        position: relative;
        padding: 24px;
        overflow-x: hidden;
        transition: background 0.3s ease;
    }

    .glow-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.2; z-index: 0; animation: float 12s infinite; }
    .orb-1 { width: 400px; height: 400px; background: #a855f7; top: -100px; right: -100px; }
    .orb-2 { width: 300px; height: 300px; background: #06b6d4; bottom: 0; left: 0; animation-delay: -4s; }
    @keyframes float { 0%{transform:translate(0,0)} 50%{transform:translate(40px,20px)} 100%{transform:translate(0,0)} }

    .dashboard-container { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; }

    .header-glass { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .header-actions { display: flex; align-items: center; gap: 16px; }
    h1 { font-size: 2rem; margin: 0; color: var(--text-primary); font-weight: 700; }
    .subtitle { color: var(--text-secondary); font-size: 1rem; margin: 4px 0 0; }
    
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px; }
    
    .glass-card {
        background: var(--bg-card); 
        backdrop-filter: blur(16px);
        border: 1px solid var(--border-light);
        border-radius: 20px; padding: 24px;
        box-shadow: var(--shadow-sm);
        transition: transform 0.3s ease, background 0.3s ease;
    }
    .glass-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); }
    
    .stat-item { display: flex; align-items: center; gap: 16px; }
    .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
    .stat-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }
    
    .purple { background: linear-gradient(135deg, #a855f7, #7e22ce); }
    .blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .green { background: linear-gradient(135deg, #4ade80, #16a34a); }
    .red { background: linear-gradient(135deg, #f87171, #dc2626); }
    
    .stat-item h3 { font-size: 2rem; margin: 0; line-height: 1; color: var(--text-primary); font-weight: 700; }
    .stat-item .label { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; }

    .split-view { display: grid; grid-template-columns: 2.5fr 1fr; gap: 24px; }
    @media (max-width: 1024px) { .split-view { grid-template-columns: 1fr; } }

    .glass-panel { background: var(--bg-card); backdrop-filter: blur(12px); border-radius: 24px; padding: 24px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .panel-header h2 { margin: 0; font-size: 1.25rem; color: var(--text-primary); }
    .panel-header h3 { margin: 0; font-size: 1.1rem; color: var(--text-primary); }
    
    .table-container { overflow-x: auto; }
    .glass-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
    .glass-table th { text-align: left; padding: 12px 16px; color: #94a3b8; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .table-row { background: white; transition: 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); cursor: pointer; }
    .table-row td { padding: 16px; border-top: 1px solid transparent; border-bottom: 1px solid transparent; }
    .table-row td:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
    .table-row td:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
    .table-row:hover { transform: scale(1.005); box-shadow: 0 8px 16px rgba(0,0,0,0.06); }

    .issue-flex { display: flex; align-items: center; gap: 12px; }
    .thumb { width: 44px; height: 44px; border-radius: 10px; background-size: cover; background-position: center; background-color: #f1f5f9; border: 1px solid #e2e8f0; }
    .issue-text { display: flex; flex-direction: column; }
    .date { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }
    .assign-badge { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 600; margin-top: 4px; display: inline-block; width: max-content; }
    .assign-badge.unassigned { background: #fee2e2; color: #b91c1c; }
    .assign-badge.assigned { background: #dcfce7; color: #15803d; }
    .zone-cell { font-weight: 500; }
    
    .zone-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; background: #e2e8f0; color: #475569; letter-spacing: 0.3px; }
    .zone-badge.zone-north { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }
    .zone-badge.zone-south { background: #fce7f3; color: #db2777; border: 1px solid #fbcfe8; }
    .zone-badge.zone-east { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
    .zone-badge.zone-west { background: #ffedd5; color: #ea580c; border: 1px solid #fed7aa; }
    .zone-badge.zone-central { background: #f3e8ff; color: #9333ea; border: 1px solid #e9d5ff; }

    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; white-space: nowrap; display: inline-block; }
    .status-badge.red-status { background: #fee2e2; color: #ef4444; }
    .status-badge.blue-status { background: #e0f2fe; color: #2563eb; }
    .status-badge.green-status { background: #dcfce7; color: #16a34a; }
    .status-badge.grey-status { background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }

    .priority-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 500; padding: 4px 8px; border-radius: 6px; }
    .priority-pill .dot { width: 8px; height: 8px; border-radius: 50%; }
    .priority-pill.high-prio { color: #dc2626; background: #fef2f2; }
    .priority-pill.high-prio .dot { background: #ef4444; }
    .priority-pill.med-prio { color: #d97706; background: #fffbeb; }
    .priority-pill.med-prio .dot { background: #f59e0b; }
    .priority-pill.low-prio { color: #059669; background: #ecfdf5; }
    .priority-pill.low-prio .dot { background: #10b981; }

    .error-banner {
        background: #fee2e2; color: #b91c1c; padding: 16px; border-radius: 12px;
        margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-weight: 600;
        border: 1px solid #fca5a5;
    }
    .no-tasks { text-align: center; padding: 48px; color: #94a3b8; }
    .no-tasks mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; opacity: 0.5; }
    .no-tasks .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* DARK THEME DASHBOARD OVERRIDES */
    :host-context(body.dark-theme) .dashboard-scene { background: #0f172a; }
    :host-context(body.dark-theme) h1, :host-context(body.dark-theme) .stat-item h3 { color: #f8fafc; }
    :host-context(body.dark-theme) .label, :host-context(body.dark-theme) .subtitle { color: #94a3b8; }
    :host-context(body.dark-theme) .glass-card, :host-context(body.dark-theme) .glass-panel { background: rgba(30, 41, 59, 0.8); border-color: rgba(255, 255, 255, 0.1); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    :host-context(body.dark-theme) .glass-card:hover { background: #1e293b; }
    :host-context(body.dark-theme) .table-row { background: #1e293b; color: #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    :host-context(body.dark-theme) .table-row:hover { background: #334155; }
    :host-context(body.dark-theme) strong { color: #f1f5f9; }
    :host-context(body.dark-theme) .zone-badge { background: #334155; color: #e2e8f0; border-color: #475569; }
    :host-context(body.dark-theme) .zone-badge.zone-north { background: rgba(14, 165, 233, 0.2); color: #38bdf8; border-color: rgba(14, 165, 233, 0.3); }
    :host-context(body.dark-theme) .panel-header h2 { color: #f8fafc; }
    :host-context(body.dark-theme) .no-tasks { color: #64748b; }
    :host-context(body.dark-theme) .map-card h3 { color: #f8fafc; }
    :host-context(body.dark-theme) ::ng-deep .ngx-charts text { fill: #f8fafc !important; }
    :host-context(body.dark-theme) ::ng-deep .ngx-charts .gridline-path { stroke: rgba(255, 255, 255, 0.1) !important; }

    /* Map Section Styles */
    .map-panel-container { padding: 0; overflow: hidden; margin-bottom: 24px; }
    .map-header-row { padding: 16px 24px; border-bottom: 1px solid rgba(226, 232, 240, 0.6); background: rgba(255,255,255,0.4); display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
    .map-header-row h2 { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; color: #334155; font-weight: 600; }
    .live-tag { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .pulse { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); animation: pulse-green 2s infinite; }
    @keyframes pulse-green { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
    .map-layout { display: flex; height: 450px; }
    .map-zones { width: 280px; border-right: 1px solid rgba(226, 232, 240, 0.8); background: rgba(248, 250, 252, 0.5); display: flex; flex-direction: column; }
    .zone-header { padding: 12px 16px; font-weight: 600; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
    .zone-list-scroll { flex: 1; overflow-y: auto; }
    .zone-row { padding: 12px 16px; border-bottom: 1px solid rgba(226, 232, 240, 0.4); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.2s; font-size: 0.9rem; color: #334155; }
    .zone-row:hover { background: rgba(255,255,255,0.8); }
    .zone-row.active { background: #e0f2fe; color: #0284c7; border-left: 3px solid #0284c7; }
    .badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    .badge.normal { background: #dcfce7; color: #166534; }
    .badge.alert { background: #fee2e2; color: #991b1b; }
    .badge.warn { background: #ffedd5; color: #9a3412; }
    .badge.critical { background: #7f1d1d; color: #fecaca; }
    .map-renderer { flex: 1; background: #e2e8f0; position: relative; z-index: 1; }
    
    :host-context(body.dark-theme) .map-zones { background: rgba(30, 41, 59, 0.8); border-right-color: rgba(255,255,255,0.1); }
    :host-context(body.dark-theme) .map-header-row { background: rgba(30, 41, 59, 0.5); border-bottom-color: rgba(255,255,255,0.1); }
    :host-context(body.dark-theme) .zone-row { color: #cbd5e1; border-bottom-color: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) .zone-row:hover { background: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) .map-header-row h2 { color: #f1f5f9; }
    :host-context(body.dark-theme) .zone-row.active { background: rgba(14, 165, 233, 0.2); color: #38bdf8; border-left-color: #38bdf8; }

    /* Divider & Drafts */
    .divider { height: 1px; background: rgba(0,0,0,0.1); margin: 24px 0; }
    :host-context(body.dark-theme) .divider { background: rgba(255,255,255,0.1); }

    .draft-list { display: flex; flex-direction: column; gap: 12px; }
    .draft-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.5); border-radius: 12px; transition: 0.2s; }
    .draft-item:hover { background: rgba(255,255,255,0.9); transform: translateX(5px); }
    .draft-icon { width: 40px; height: 40px; background: #e0f2fe; color: #0284c7; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .draft-info { flex: 1; display: flex; flex-direction: column; }
    .draft-title { font-weight: 600; color: #334155; font-size: 0.9rem; }
    .draft-date { font-size: 0.75rem; color: #64748b; }
    
    :host-context(body.dark-theme) .draft-title { color: #f1f5f9; }
  `]
})
export class DashboardAuthorityComponent implements OnInit, AfterViewInit, OnDestroy {
    issueService = inject(IssueService);
    authService = inject(AuthService);
    platformId = inject(PLATFORM_ID);
    cdr = inject(ChangeDetectorRef);

    issues: any[] = [];
    zones = ZONE_BOUNDARIES;
    selectedZoneName: string = '';

    chartData: any[] = [];
    activityData: any[] = [
        { name: 'Mon', value: 12 },
        { name: 'Tue', value: 19 },
        { name: 'Wed', value: 15 },
        { name: 'Thu', value: 24 },
        { name: 'Fri', value: 8 },
        { name: 'Sat', value: 5 },
        { name: 'Sun', value: 2 }
    ];

    currentJurisdiction: string | null = null;
    jurisdictionError = false;
    loading = true;

    private map: L.Map | undefined;
    private markers: L.Marker[] = [];
    private zonePolygons: L.Polygon[] = [];

    // Removed local toggleTheme to use logic in HeaderComponent

    // Color Scheme for Chart
    colorScheme: any = {
        domain: ['#ef4444', '#3b82f6', '#10b981', '#64748b'] // Red (Open), Blue (InProg), Green (Resolved), Grey (Rejected)
    };

    ngOnInit() {
        // Fetch User Context
        this.authService.user$.subscribe(user => {
            if (user && (user.role === 'authority' || user.role === 'admin')) {
                this.currentJurisdiction = user.zone || user.area || null;
                this.refreshIssues(); // Always refresh to see if we have assignments
            } else if (!user) {
                this.loading = false;
            }
        });

        // Theme is now globally managed by AuthService & MainLayout
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.initMap();
        }
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    refreshIssues() {
        this.loading = true;
        this.issueService.getIssues().subscribe({
            next: (data: any) => {
                const rawIssues = Array.isArray(data) ? data : (data.issues || []);
                this.issues = rawIssues;

                console.log('Authority Dashboard Issues (Locations):', this.issues.map(i => ({ title: i.title, loc: i.location })));

                // Smart Jurisdiction Error Handling
                if (!this.currentJurisdiction && this.issues.length === 0) {
                    this.jurisdictionError = true;
                } else {
                    this.jurisdictionError = false;
                }

                this.calculateStats();
                this.updateMapMarkers();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error fetching issues:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    updateMapMarkers() {
        if (!this.map || !isPlatformBrowser(this.platformId)) return;

        // Clear existing
        this.markers.forEach(m => m.remove());
        this.markers = [];

        const bounds = L.latLngBounds([]);

        // Filter issues based on selected zone
        const filteredIssues = this.issues.filter(issue => 
            !this.selectedZoneName || 
            issue.zone === this.selectedZoneName || 
            (issue.area && issue.area.includes(this.selectedZoneName))
        );

        filteredIssues.forEach(issue => {
            if (issue.location && issue.location.lat && issue.location.lng) {
                const lat = parseFloat(issue.location.lat);
                const lng = parseFloat(issue.location.lng);

                if (isNaN(lat) || isNaN(lng)) return;

                const marker = L.marker([lat, lng])
                    .bindPopup(`<b>${issue.title}</b><br>${issue.status}`)
                    .addTo(this.map!);

                this.markers.push(marker);
                bounds.extend([lat, lng]);
            }
        });

        if (this.markers.length > 0) {
            this.map.fitBounds(bounds, { padding: [50, 50] });
        } else if (!this.selectedZoneName) {
            this.map.setView([21.1702, 72.8311], 12);
        }
    }

    initMap() {
        const mapContainer = document.getElementById('authority-map');
        if (!mapContainer || this.map) return;

        this.map = L.map('authority-map', { zoomControl: false }).setView([21.1702, 72.8311], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        this.drawZones();

        setTimeout(() => {
            this.map?.invalidateSize();
            this.updateMapMarkers();
        }, 100);
    }

    panMap(lat: number, lng: number, zoneName?: string) {
        if (zoneName) this.selectedZoneName = zoneName;
        if (this.map) {
            this.map.setView([lat, lng], 14); 
            this.drawZones(); // Refresh highlighting
            this.updateMapMarkers(); // Filter issues
        }
    }

    drawZones() {
        if (!this.map) return;
        
        // Clear old polygons
        this.zonePolygons.forEach(p => p.remove());
        this.zonePolygons = [];

        this.zones.forEach(zone => {
            const latLngs = zone.polygon.map(c => [c.lat, c.lng] as L.LatLngExpression);
            const isSelected = zone.name === this.selectedZoneName;
            
            const poly = L.polygon(latLngs, {
                color: isSelected ? '#3b82f6' : '#94a3b8',
                weight: isSelected ? 3 : 1,
                fillColor: isSelected ? '#3b82f6' : '#cbd5e1',
                fillOpacity: isSelected ? 0.3 : 0.05
            }).addTo(this.map!);

            poly.bindTooltip(zone.name, { sticky: true });
            
            // Allow clicking polygon to select zone
            poly.on('click', () => {
                this.panMap(zone.center.lat, zone.center.lng, zone.name);
            });

            this.zonePolygons.push(poly);
        });
    }

    getZoneStatus(zoneName: string): string {
        // Dynamic status based on issue density (simulation)
        const count = this.issues.filter(i => i.zone === zoneName || i.area?.includes(zoneName)).length;
        if (count > 5) return 'critical';
        if (count > 2) return 'warn';
        return 'normal';
    }

    getZoneStatusText(zoneName: string): string {
        const status = this.getZoneStatus(zoneName);
        if (status === 'critical') return 'Critical';
        if (status === 'warn') return 'Alert';
        return 'Normal';
    }

    calculateStats() {
        if (this.issues.length === 0) {
            this.chartData = [];
            return;
        }

        const statusCounts: { [key: string]: number } = {
            'Open': 0, 'In Progress': 0, 'Resolved': 0, 'Rejected': 0
        };

        this.issues.forEach(i => {
            const s = i.status;
            if (statusCounts[s] !== undefined) statusCounts[s]++;
            else statusCounts[s] = (statusCounts[s] || 0) + 1;
        });

        this.chartData = [
            { name: 'Open', value: statusCounts['Open'] },
            { name: 'In Progress', value: statusCounts['In Progress'] },
            { name: 'Resolved', value: statusCounts['Resolved'] },
            { name: 'Rejected', value: statusCounts['Rejected'] }
        ].filter(d => d.value > 0);
    }

    getPendingCount() {
        return this.issues.filter(i => i.status === 'In Progress' || i.status === 'Open').length;
    }

    getResolvedCount() {
        return this.issues.filter(i => i.status === 'Resolved').length;
    }

    getHighPriorityCount() {
        return this.issues.filter(i => i.priority === 'High' || i.status === 'Critical').length;
    }
}
