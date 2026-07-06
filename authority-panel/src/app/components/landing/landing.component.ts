import { Component, OnInit, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import * as L from 'leaflet';
import { ZONE_BOUNDARIES } from '../../data/zone-data';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule
    ],
    template: `
      <div class="home-container">
        
        <!-- HERO SECTION -->
        <section class="hero-section">
            <div class="hero-content">
                <span class="govt-pill">🇮🇳 Digital Governance Initiative</span>
                <h1>Civic Issue Reporting & Governance System</h1>
                <p>A government-oriented digital platform enabling citizens to report civic issues, powered by system verification and priority levels for faster administrative action.</p>
                
                <div class="hero-actions">
                    <button mat-raised-button color="primary" routerLink="/login">
                        <mat-icon>login</mat-icon> Authority Login
                    </button>
                    <button mat-stroked-button color="primary" routerLink="/register">
                         <mat-icon>person_add</mat-icon> Citizen Registration
                    </button>
                    <!-- <button mat-stroked-button color="primary" routerLink="/issues">
                        <mat-icon>article</mat-icon> View All Reports
                    </button> -->
                </div>
            </div>
            
            <div class="hero-stats-card">
                <div class="live-status">
                    <mat-icon>verified_user</mat-icon> System Status: Active
                </div>
                <div class="stat-row">
                    <span>Zone Monitoring</span> <span class="badge online">Online</span>
                </div>
                <div class="stat-row">
                    <span>System Validation</span> <span class="badge active">Active</span>
                </div>
                 <div class="stat-row">
                    <span>Reports Today</span> <span class="badge count">1,240</span>
                </div>
            </div>
        </section>
  
        <!-- WORKFLOW PROCESS -->
        <section class="workflow-section">
            <h2 class="sec-title">Workflow Process</h2>
            <div class="workflow-steps">
                <div class="step">
                    <div class="step-circle">1</div>
                    <h4>Citizen Reports</h4>
                    <p>Uploads geo-tagged image via portal.</p>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <div class="step-circle">2</div>
                    <h4>Issue Verification</h4>
                    <p>System validates authenticity & duplicates.</p>
                </div>
                 <div class="step-line"></div>
                <div class="step">
                    <div class="step-circle">3</div>
                    <h4>Priority Assigned</h4>
                    <p>Auto-ranked based on severity & location.</p>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <div class="step-circle">4</div>
                    <h4>Authority Action</h4>
                    <p>Department resolves & uploads proof.</p>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <div class="step-circle">5</div>
                    <h4>Digital Audit</h4>
                    <p>Final status logged for transparency.</p>
                </div>
            </div>
        </section>
  
        <!-- LIVE GEOSPATIAL MONITORING -->
        <section class="map-section">
            <div class="map-panel-container luxe-shadow">
                <div class="map-header-row">
                     <h2><mat-icon>map</mat-icon> Live Geo-Spatial Monitoring (Surat)</h2>
                     <div class="live-tag"><span class="pulse"></span> System Live</div>
                </div>
                <div class="map-layout">
                    <div class="map-zones">
                        <div class="zone-header">Active Zones (SMC)</div>
                        <div class="zone-list-scroll scrollbar-hidden">
                            <div class="zone-row" 
                                 *ngFor="let zone of zones"
                                 [class.active]="selectedZoneName === zone.name"
                                 (click)="selectZone(zone)">
                                <span>{{ zone.name }}</span> 
                                <span class="badge" [ngClass]="getZoneStatus(zone.name)">{{ getZoneStatusText(zone.name) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="map-canvas-wrap">
                        <div id="landing-map" class="map-canvas"></div>
                    </div>
                </div>
            </div>
        </section>
  
        <!-- CORE CAPABILITIES -->
        <section class="capabilities-section">
            <h2 class="sec-title">Core Capabilities</h2>
            <div class="cap-grid">
                 <div class="cap-card">
                    <div class="cap-icon"><mat-icon>image_search</mat-icon></div>
                    <h4>Fake Report Detection</h4>
                    <p>System algorithms analyze image metadata and visual content to filter out spam or manipulated uploads.</p>
                </div>
                <div class="cap-card">
                    <div class="cap-icon"><mat-icon>sort</mat-icon></div>
                    <h4>Smart Priority Classification</h4>
                    <p>Issues are automatically categorized as Critical, High, or Low based on public safety impact.</p>
                </div>
                <div class="cap-card">
                    <div class="cap-icon"><mat-icon>auto_fix_high</mat-icon></div>
                    <h4>Auto Category Correction</h4>
                    <p>The system intelligently re-labels misclassified issues to ensure correct department routing.</p>
                </div>
                 <div class="cap-card">
                    <div class="cap-icon"><mat-icon>rate_review</mat-icon></div>
                    <h4>Automated Audit Remarks</h4>
                    <p>Neutral, system-generated remarks provide an initial objective assessment for every report.</p>
                </div>
                 <div class="cap-card">
                    <div class="cap-icon"><mat-icon>trending_up</mat-icon></div>
                    <h4>Transparent Status Tracking</h4>
                    <p>Real-time updates visible to citizens, ensuring administrative accountability.</p>
                </div>
            </div>
        </section>
  
        <!-- GOVT STATS BAR -->
        <section class="stats-bar">
             <div class="stat-block">
                 <span class="s-label">ISSUES VERIFIED</span>
                 <span class="s-value">15,402</span>
             </div>
             <div class="stat-block">
                 <span class="s-label">CRITICAL ALERTS</span>
                 <span class="s-value crit">84</span>
             </div>
             <div class="stat-block">
                 <span class="s-label">AVG. RESOLUTION TIME</span>
                 <span class="s-value">24 Hours</span>
             </div>
             <div class="stat-block">
                 <span class="s-label">RESPONSE RATE</span>
                 <span class="s-value good">92.5%</span>
             </div>
        </section>
  
      </div>
    `,
    styles: [`
      :host { display: block; font-family: 'Inter', system-ui, sans-serif; background: #f8fafc; color: #1e293b; }
      
      /* Global Section Styles */
      section { padding: 60px 10%; }
      .sec-title { text-align: center; color: #0f4c75; font-size: 2rem; margin-bottom: 40px; font-weight: 700; }
  
      /* HERO */
      .hero-section {
          display: flex; align-items: center; justify-content: space-between;
          min-height: 80vh; background: white; padding: 40px 10%;
          position: relative;
          overflow: hidden;
      }
      .hero-content { max-width: 600px; z-index: 1; }
      .govt-pill { 
          display: inline-block; background: rgba(15, 76, 117, 0.1); color: #0f4c75; 
          padding: 6px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: 700; 
          text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.5px;
          border-left: 3px solid #0f4c75;
      }
      h1 { font-size: 3rem; line-height: 1.2; color: #0f4c75; margin-bottom: 24px; font-weight: 800; }
      p { font-size: 1.1rem; color: #475569; line-height: 1.6; margin-bottom: 32px; }
      
      .hero-actions { display: flex; gap: 16px; }
      .hero-actions button { height: 48px; padding: 0 24px; font-size: 1rem; }
  
      .hero-stats-card {
          background: white; width: 320px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); 
          border-radius: 8px; padding: 24px; border-top: 5px solid #0f4c75;
          z-index: 1;
      }
      .live-status { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #0f4c75; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
      .stat-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 0.95rem; color: #475569; }
      .badge { padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
      .badge.online { background: #dcfce7; color: #166534; }
      .badge.active { background: #dcfce7; color: #15803d; }
      .badge.count { font-size: 1rem; color: #0f4c75; padding: 0; background: none; }
  
      /* WORKFLOW */
      .workflow-section { background: white; }
      .workflow-steps { display: flex; justify-content: center; align-items: flex-start; gap: 20px; }
      .step { text-align: center; width: 180px; position: relative; }
      .step-circle { 
          width: 56px; height: 56px; background: #0f4c75; color: white; 
          border-radius: 50%; display: flex; align-items: center; justify-content: center; 
          margin: 0 auto 16px; font-weight: 700; font-size: 1.4rem;
          box-shadow: 0 4px 15px rgba(15, 76, 117, 0.2);
      }
      .step h4 { margin: 0 0 8px; font-weight: 700; color: #0f4c75; font-size: 1rem; }
      .step p { margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.4; }
      .step-line { flex: 1; height: 3px; background: #cbd5e1; margin-top: 28px; min-width: 40px; }
  
      .map-section { padding: 60px 10%; background: #f8fafc; }
      
      .map-panel-container { background: white; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; }
      .map-header-row { padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; }
      .map-header-row h2 { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; color: #334155; font-weight: 700; margin: 0; }
      
      .live-tag { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; background: #DCFCE7; color: #15803D; padding: 4px 10px; border-radius: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
      .pulse { width: 8px; height: 8px; background: #22C55E; border-radius: 50%; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); animation: pulse-green 2s infinite; }
      @keyframes pulse-green { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }

      .map-layout { display: flex; height: 500px; }
      .map-zones { width: 300px; border-right: 1px solid #e2e8f0; background: #F8FAFC; display: flex; flex-direction: column; }
      .zone-header { padding: 12px 16px; font-weight: 700; color: #64748B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; }
      .zone-list-scroll { flex: 1; overflow-y: auto; }
      .zone-row { padding: 16px; border-bottom: 1px solid rgba(226, 232, 240, 0.5); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s; font-size: 0.95rem; color: #334155; }
      .zone-row:hover { background: #F1F5F9; }
      .zone-row.active { background: #EFF6FF; border-left: 3px solid #2563EB; color: #2563EB; font-weight: 600; }

      .badge { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; }
      .badge.normal { background: #DCFCE7; color: #166534; }
      .badge.warn { background: #FFEDD5; color: #9A3412; }
      .badge.critical { background: #FEE2E2; color: #991B1B; }

      .map-canvas-wrap { flex: 1; position: relative; }
      .map-canvas { width: 100%; height: 100%; }

      .luxe-shadow { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); }
      .scrollbar-hidden::-webkit-scrollbar { display: none; }
  
      /* CAPABILITIES */
      .capabilities-section { background: white; }
      .cap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
      .cap-card { 
          padding: 30px; border-left: 5px solid #0f4c75; background: #f8fafc;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.2s;
      }
      .cap-card:hover { transform: translateY(-5px); background: #f1f5f9; }
      .cap-icon { color: #0f4c75; margin-bottom: 16px; }
      .cap-icon mat-icon { font-size: 40px; width: 40px; height: 40px; }
      .cap-card h4 { font-size: 1.25rem; font-weight: 700; color: #0f4c75; margin-bottom: 12px; }
      .cap-card p { color: #64748b; line-height: 1.5; }
  
      /* STATS BAR */
      .stats-bar { 
          background: #0f4c75; color: white; display: flex; 
          justify-content: space-around; padding: 50px 10%;
      }
      .stat-block { text-align: center; }
      .s-label { display: block; font-size: 0.85rem; opacity: 0.8; letter-spacing: 1px; margin-bottom: 12px; }
      .s-value { font-size: 2.5rem; font-weight: 700; }
      .s-value.crit { color: #fca5a5; }
      .s-value.good { color: #86efac; }
  
      /* FOOTER */
      .home-footer { 
          background: #1e293b; color: #94a3b8; padding: 60px 10%;
          display: flex; justify-content: space-between; align-items: flex-start;
          flex-wrap: wrap; gap: 40px;
      }
      .footer-content { max-width: 500px; }
      .footer-content h3 { color: white; font-size: 1.2rem; margin-bottom: 12px; }
      .disclaimer { font-size: 0.9rem; font-style: italic; margin-top: 16px; opacity: 0.7; }
      .footer-meta { text-align: right; font-size: 0.9rem; }
      
      /* Responsive */
      @media (max-width: 1024px) {
          .hero-section { flex-direction: column; text-align: center; }
          .hero-stats-card { margin-top: 40px; width: 100%; max-width: 400px; }
          .workflow-steps { flex-wrap: wrap; }
          .step-line { display: none; }
          .map-wrapper { flex-direction: column; height: auto; }
          .zone-list { width: 100%; height: 300px; }
          .map-container { height: 300px; }
      }
      
      /* Dark Mode Overrides */
      :host-context(body.dark-theme) { background: #0f172a; color: #e2e8f0; }
      :host-context(body.dark-theme) .hero-section { background: #0f172a; }
      :host-context(body.dark-theme) h1 { color: #f8fafc; }
      :host-context(body.dark-theme) .hero-stats-card { background: #1e293b; border-color: #38bdf8; }
      :host-context(body.dark-theme) .live-status { color: #38bdf8; border-color: #334155; }
      :host-context(body.dark-theme) .stat-row { color: #cbd5e1; }
      :host-context(body.dark-theme) .badge { background: #334155; color: #e2e8f0; }
      :host-context(body.dark-theme) .badge.count { color: #38bdf8; }
      
      :host-context(body.dark-theme) .workflow-section,
      :host-context(body.dark-theme) .capabilities-section { background: #1e293b; }
      :host-context(body.dark-theme) .sec-title,
      :host-context(body.dark-theme) .govt-pill, 
      :host-context(body.dark-theme) .step h4,
      :host-context(body.dark-theme) .cap-card h4 { color: #38bdf8; }
      
      :host-context(body.dark-theme) .step-circle, 
      :host-context(body.dark-theme) .stats-bar { background: #1e293b; border: 1px solid #334155; }
      :host-context(body.dark-theme) .cap-card { background: #0f172a; border-left-color: #38bdf8; }
      :host-context(body.dark-theme) .cap-icon { color: #38bdf8; }
      
      :host-context(body.dark-theme) .zone-list { background: #1e293b; border-color: #334155; }
      :host-context(body.dark-theme) .zone-count-big { color: #38bdf8; border-color: #334155; }
      :host-context(body.dark-theme) .z-item { border-bottom-color: #334155; }
      :host-context(body.dark-theme) .z-item:hover { background: #334155; }
      :host-context(body.dark-theme) .z-name { color: #f1f5f9; }
    `]
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
    platformId = inject(PLATFORM_ID);
    zones = ZONE_BOUNDARIES;
    selectedZoneName: string = 'Central Zone';

    private map: L.Map | undefined;

    ngOnInit() {
        // Any init logic
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

    initMap() {
        const mapContainer = document.getElementById('landing-map');
        if (!mapContainer) return;

        this.map = L.map('landing-map', { zoomControl: false }).setView([21.1702, 72.8311], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Standardized markers from zone data
        this.zones.forEach(zone => {
            L.marker([zone.center.lat, zone.center.lng])
                .bindPopup(`<b>${zone.name}</b>`)
                .addTo(this.map!);
        });

        setTimeout(() => { this.map?.invalidateSize(); }, 500);
    }

    selectZone(zone: any) {
        this.selectedZoneName = zone.name;
        if (this.map) {
            this.map.flyTo([zone.center.lat, zone.center.lng], 14, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }

    getZoneStatus(zoneName: string): string {
        return 'normal'; // Simulation
    }

    getZoneStatusText(zoneName: string): string {
        return 'Normal';
    }

    panMap(lat: number, lng: number) {
        this.map?.setView([lat, lng], 14);
    }
}
