
import { Component, AfterViewInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { IssueService } from '../../services/issue.service';
import { ChangeDetectorRef } from '@angular/core';
import { ZONE_BOUNDARIES } from '../../data/zone-data';

declare const L: any;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="landing-content">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="page-container hero-grid">
          <div class="hero-text">
            <div class="gov-label luxe-fade">
              <span class="active-dot"></span> Digital Governance Initiative
            </div>
            <h1 class="hero-heading">
              Modern Civic Issue <br>Governance System
            </h1>
            <p class="hero-description">
              A professional digital infrastructure for citizens to report local issues. 
              Powered by automated verification and priority-based department routing 
              for efficient administrative response.
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary" routerLink="/register">
                Report New Issue
              </button>
              <button class="btn btn-outline" routerLink="/issues">
                Browse Public Feed
              </button>
            </div>
          </div>

          <div class="hero-visual">
            <div class="integrity-card luxe-shadow">
              <div class="card-header">
                <mat-icon class="text-secondary">verified_user</mat-icon>
                <h3>Portal Integrity</h3>
              </div>
              <div class="card-body">
                <div class="status-row">
                  <span class="label">System Status</span>
                  <span class="value success-text">Active & Secure</span>
                </div>
                <div class="status-row">
                  <span class="label">Zones Monitored</span>
                  <span class="value">8 SMC Zones</span>
                </div>
                <div class="status-row">
                  <span class="label">Daily Reports</span>
                  <span class="value">1,240 Verified</span>
                </div>
                <div class="integrity-bar">
                  <div class="fill" style="width: 92%"></div>
                </div>
                <div class="integrity-meta">92% System Resolution Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- INFO BOXES SECTION -->
      <section class="metrics-section">
        <div class="page-container">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="m-icon icon-blue"><mat-icon>analytics</mat-icon></div>
              <div class="m-info">
                <h3>15k+</h3>
                <p>Total Reports</p>
              </div>
            </div>
            <div class="metric-card">
              <div class="m-icon icon-purple"><mat-icon>domain</mat-icon></div>
              <div class="m-info">
                <h3>08</h3>
                <p>Active Zones</p>
              </div>
            </div>
            <div class="metric-card">
              <div class="m-icon icon-green"><mat-icon>check_circle</mat-icon></div>
              <div class="m-info">
                <h3>12k+</h3>
                <p>Issues Resolved</p>
              </div>
            </div>
            <div class="metric-card">
              <div class="m-icon icon-red"><mat-icon>timer</mat-icon></div>
              <div class="m-info">
                <h3>24h</h3>
                <p>Avg. resolution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MAP SECTION (INTERACTIVE) -->
      <section class="map-explorer-section">
        <div class="page-container">
          <div class="section-title-wrap">
            <h2 class="section-title">Live Geo-Spatial Monitoring (Surat)</h2>
            <p class="section-subtitle">Official SMC jurisdiction surveillance data synchronized across the digital collective.</p>
          </div>

          <div class="map-panel-container luxe-shadow">
            <div class="map-header-row">
                 <h2><mat-icon>map</mat-icon> Live Geo-Spatial Monitoring (Surat)</h2>
                 <div class="live-tag"><span class="pulse"></span> SYSTEM LIVE</div>
            </div>
            <div class="map-layout">
                <div class="map-zones">
                    <div class="zone-header">Active Zones (SMC)</div>
                    <div class="zone-list-scroll scrollbar-hidden">
                        <div class="zone-row" 
                             [class.active]="!selectedZoneName"
                             (click)="selectZone({ name: '', center: { lat: 21.1702, lng: 72.8311 } })">
                            <span>All Zones</span>
                            <span class="badge normal">{{ issues_list.length }} Reports</span>
                        </div>
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
        </div>
      </section>

      <!-- ABOUT SYSTEM SECTION -->
      <section class="about-section">
        <div class="page-container">
          <div class="section-title-wrap">
            <h2 class="section-title">Smart Governance Framework</h2>
            <p class="section-subtitle">How our system ensures accountability and speed.</p>
          </div>

          <div class="about-grid">
            <div class="about-card">
              <mat-icon class="a-icon">verified</mat-icon>
              <h3>Smart Verification</h3>
              <p>Automated validation using geographical tagging and AI-driven duplicate detection.</p>
            </div>
            <div class="about-card">
              <mat-icon class="a-icon">speed</mat-icon>
              <h3>Priority Routing</h3>
              <p>Issues are instantly ranked by severity and routed to the corresponding department.</p>
            </div>
            <div class="about-card">
              <mat-icon class="a-icon">visibility</mat-icon>
              <h3>Full Transparency</h3>
              <p>Real-time status tracking and audit logs for every reported civic complaint.</p>
            </div>
            <div class="about-card">
              <mat-icon class="a-icon">lock</mat-icon>
              <h3>Secure Platform</h3>
              <p>End-to-end encryption for citizen data and multi-level administrative authorization.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- WORKFLOW SECTION -->
      <section class="workflow-section">
        <div class="page-container">
          <div class="section-title-wrap">
            <h2 class="section-title">Workflow Lifecycle</h2>
            <p class="section-subtitle">A streamlined process from citizen report to official resolution.</p>
          </div>

          <div class="modern-stepper">
            <div class="step">
              <div class="s-circle active"><mat-icon>add_a_photo</mat-icon></div>
              <div class="s-content">
                <h4>Report</h4>
                <p>Snap and upload geo-tagged photo</p>
              </div>
            </div>
            <div class="step-link"></div>
            <div class="step">
              <div class="s-circle"><mat-icon>fact_check</mat-icon></div>
              <div class="s-content">
                <h4>Verify</h4>
                <p>System validates authenticity</p>
              </div>
            </div>
            <div class="step-link"></div>
            <div class="step">
              <div class="s-circle"><mat-icon>low_priority</mat-icon></div>
              <div class="s-content">
                <h4>Route</h4>
                <p>Automated priority assignment</p>
              </div>
            </div>
            <div class="step-link"></div>
            <div class="step">
              <div class="s-circle"><mat-icon>engineering</mat-icon></div>
              <div class="s-content">
                <h4>Resolve</h4>
                <p>On-ground action by authorities</p>
              </div>
            </div>
            <div class="step-link"></div>
            <div class="step">
              <div class="s-circle"><mat-icon>checklist_rtl</mat-icon></div>
              <div class="s-content">
                <h4>Audit</h4>
                <p>Verification of resolution</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      --primary: #1E3A5F;
      --secondary: #2563EB;
      --bg-main: #F1F5F9;
      --text-primary: #0F172A;
      --text-secondary: #475569;
      --border-light: #E2E8F0;
      --gradient: linear-gradient(to right, #f8fafc, #eef2f7);
    }

    .landing-content {
      background: var(--gradient);
      padding-bottom: 80px;
    }

    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
    }

    /* --- HERO SECTION --- */
    .hero-section {
      padding: 80px 0;
      margin-bottom: 40px;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 60px;
    }
    .hero-text { max-width: 550px; }
    .hero-heading { font-size: 3.5rem; line-height: 1.1; margin-bottom: 24px; font-weight: 800; color: var(--primary); }
    .hero-description { font-size: 1.15rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 32px; }
    .hero-actions { display: flex; gap: 16px; }

    .gov-label { 
      display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: var(--secondary);
      text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px;
    }
    .active-dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 10px #10B981; }

    /* --- INTEGRITY CARD --- */
    .integrity-card {
      background: white; padding: 40px; border-radius: 20px; border: 1px solid var(--border-light);
    }
    .card-header { display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
    .card-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--primary); }
    .status-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 0.95rem; }
    .status-row .label { color: #64748B; font-weight: 500; }
    .status-row .value { font-weight: 700; color: var(--primary); }
    .status-row .success-text { color: #10B981; }
    .integrity-bar { height: 8px; background: #F1F5F9; border-radius: 4px; margin: 24px 0 12px; overflow: hidden; }
    .integrity-bar .fill { height: 100%; background: var(--secondary); border-radius: 4px; }
    .integrity-meta { font-size: 0.8rem; font-weight: 700; color: #94A3B8; text-align: center; }

    /* --- METRICS SECTION --- */
    .metrics-section { margin-bottom: 80px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .metric-card {
      background: white; padding: 24px; border-radius: 16px; border: 1px solid var(--border-light);
      display: flex; align-items: center; gap: 20px; transition: 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .metric-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .m-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .icon-blue { background: #EFF6FF; color: #2563EB; }
    .icon-purple { background: #F5F3FF; color: #7C3AED; }
    .icon-green { background: #ECFDF5; color: #10B981; }
    .icon-red { background: #FFF1F2; color: #E11D48; }
    .m-info h3 { margin: 0; font-size: 1.5rem; font-weight: 800; color: var(--primary); }
    .m-info p { margin: 0; font-size: 0.85rem; font-weight: 600; color: #64748B; text-transform: uppercase; }

    /* --- MAP SECTION (AUTHORITATIVE STYLE) --- */
    .map-explorer-section { padding: 80px 0; margin-bottom: 40px; }
    .section-title-wrap { text-align: center; margin-bottom: 50px; }
    .section-title { font-size: 2.5rem; font-weight: 800; color: var(--primary); margin-bottom: 12px; letter-spacing: -1px; }
    .section-subtitle { font-size: 1.1rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto; }

    .map-panel-container { background: white; border-radius: 24px; overflow: hidden; border: 1px solid var(--border-light); }
    .map-header-row { padding: 16px 24px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; }
    .map-header-row h2 { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; color: #334155; font-weight: 700; margin: 0; }
    
    .live-tag { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; background: #DCFCE7; color: #15803D; padding: 4px 10px; border-radius: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .pulse { width: 8px; height: 8px; background: #22C55E; border-radius: 50%; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); animation: pulse-green 2s infinite; }
    @keyframes pulse-green { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }

    .map-layout { display: flex; height: 500px; }
    .map-zones { width: 280px; border-right: 1px solid var(--border-light); background: #F8FAFC; display: flex; flex-direction: column; }
    .zone-header { padding: 12px 16px; font-weight: 700; color: #64748B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border-light); }
    .zone-list-scroll { flex: 1; overflow-y: auto; }
    .zone-row { padding: 16px; border-bottom: 1px solid rgba(226, 232, 240, 0.5); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s; }
    .zone-row:hover { background: #F1F5F9; }
    .zone-row.active { background: #EFF6FF; border-left: 3px solid #2563EB; color: #2563EB; font-weight: 600; }
    .zone-row span { font-size: 0.95rem; }

    .badge { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; }
    .badge.normal { background: #DCFCE7; color: #166534; }
    .badge.warn { background: #FFEDD5; color: #9A3412; }
    .badge.critical { background: #FEE2E2; color: #991B1B; }

    .map-canvas-wrap { flex: 1; background: #E2E8F0; }
    .map-canvas { width: 100%; height: 100%; }

    .luxe-shadow { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); }

    .luxe-fade { animation: luxeFade 1.2s ease-out; }
    @keyframes luxeFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .scrollbar-hidden::-webkit-scrollbar { display: none; }

    /* --- ABOUT SECTION --- */
    .about-section { padding: 80px 0; margin-bottom: 40px; }
    .about-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .about-card {
      background: white; padding: 40px 32px; border-radius: 20px; border: 1px solid var(--border-light);
      text-align: center; transition: 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
    }
    .about-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .a-icon { font-size: 40px; width: 40px; height: 40px; color: var(--secondary); margin-bottom: 24px; }
    .about-card h3 { font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-bottom: 12px; }
    .about-card p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

    /* --- WORKFLOW SECTION --- */
    .workflow-section { padding: 80px 0; }
    .modern-stepper { display: flex; align-items: flex-start; justify-content: space-between; gap: 0; }
    .step { display: flex; flex-direction: column; align-items: center; text-align: center; width: 180px; position: relative; z-index: 2; }
    .s-circle { 
      width: 64px; height: 64px; background: white; border: 2px solid #E2E8F0; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; color: #94A3B8; margin-bottom: 20px;
      transition: 0.3s;
    }
    .s-circle.active { background: var(--secondary); border-color: var(--secondary); color: white; box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2); }
    .step-link { flex: 1; height: 2px; background: #E2E8F0; margin-top: 32px; position: relative; top: 0; z-index: 1; }
    .s-content h4 { font-size: 1rem; font-weight: 700; color: var(--primary); margin-bottom: 6px; }
    .s-content p { font-size: 0.8rem; color: #64748B; padding: 0 10px; margin: 0; line-height: 1.4; }

    @media (max-width: 1024px) {
      .hero-grid, .metrics-grid, .about-grid { grid-template-columns: 1fr; }
      .map-layout { flex-direction: column; height: auto; }
      .map-zones { width: 100%; height: 300px; border-right: none; border-bottom: 1px solid var(--border-light); }
      .modern-stepper { flex-direction: column; gap: 40px; padding-left: 50% }
      .step-link { display: none; }
    }
  `]
})
export class LandingComponent implements AfterViewInit {
  issueService = inject(IssueService);
  cdr = inject(ChangeDetectorRef);
  private map: any;
  private markers: any[] = [];
  private zonePolygons: any[] = [];

  issues_list: any[] = [];
  zones = ZONE_BOUNDARIES;
  selectedZoneName: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initMap(), 100);
      this.loadLiveIssues();
    }
  }

  private loadLiveIssues(): void {
    this.issueService.getIssues(undefined, 50).subscribe({
      next: (data) => {
        this.issues_list = data;
        this.updateMapMarkers();
        this.cdr.detectChanges();
      }
    });
  }

  private updateMapMarkers(): void {
    if (!this.map) return;
    
    // Clear existing markers if any
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const filteredIssues = this.issues_list.filter(issue => 
      !this.selectedZoneName || 
      issue.zone === this.selectedZoneName || 
      issue.area === this.selectedZoneName
    );

    filteredIssues.forEach(issue => {
      const lat = parseFloat(issue.location?.lat);
      const lng = parseFloat(issue.location?.lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup(`<strong>${issue.title}</strong><br>${issue.status}`);
        
        this.markers.push(marker);
      }
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    } else if (!this.selectedZoneName) {
      this.map.setView([21.1702, 72.8311], 12);
    }
  }

  private initMap(): void {
    this.map = L.map('landing-map', { zoomControl: false }).setView([21.1702, 72.8311], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.drawZones();

    setTimeout(() => {
        this.map?.invalidateSize();
        this.updateMapMarkers();
    }, 200);
  }

  selectZone(zone: any): void {
    this.selectedZoneName = zone.name;
    if (this.map) {
      if (this.selectedZoneName) {
        this.map.flyTo([zone.center.lat, zone.center.lng], 14, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      } else {
        this.map.flyTo([21.1702, 72.8311], 12, { duration: 1.5 });
      }
      this.drawZones();
      this.updateMapMarkers();
    }
  }

  private drawZones(): void {
    if (!this.map) return;
    
    this.zonePolygons.forEach(p => p.remove());
    this.zonePolygons = [];

    this.zones.forEach(zone => {
      const latLngs = zone.polygon.map(c => [c.lat, c.lng]);
      const isSelected = zone.name === this.selectedZoneName;
      
      const poly = L.polygon(latLngs, {
        color: isSelected ? '#1d4ed8' : '#94a3b8',
        weight: isSelected ? 3 : 1,
        fillColor: isSelected ? '#3b82f6' : '#cbd5e1',
        fillOpacity: isSelected ? 0.2 : 0.05
      }).addTo(this.map);

      poly.bindTooltip(zone.name, { sticky: true });
      
      poly.on('click', () => {
          this.selectZone(zone);
      });

      this.zonePolygons.push(poly);
    });
  }

  getZoneStatus(zoneName: string): string {
    const count = this.issues_list.filter(i => i.zone === zoneName || i.area === zoneName).length;
    if (count > 5) return 'critical';
    if (count > 2) return 'warn';
    return 'normal';
  }

  getZoneStatusText(zoneName: string): string {
    const status = this.getZoneStatus(zoneName);
    return status === 'critical' ? 'Critical' : status === 'warn' ? 'Alert' : 'Normal';
  }
}
