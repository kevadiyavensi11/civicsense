
import { Component, OnInit, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import * as L from 'leaflet';

@Component({
    selector: 'app-authority-home',
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
      
      <!-- HERO SECTION: MODERN GLASSMISM -->
      <section class="hero-section">
          <div class="mesh-glow"></div>
          <div class="hero-content">
              <span class="govt-pill">🇮🇳 National Civic Tech Initiative</span>
              <h1>Transforming Cities <br><span class="gradient-text">Through Intelligence.</span></h1>
              <p>CivicSense is the next-generation governance layer. Empowering authorities with real-time AI analytics, automated verification, and high-precision geospatial oversight.</p>
              
              <div class="hero-actions">
                  <button mat-flat-button class="btn-primary" routerLink="/authority/dashboard">
                      <mat-icon>terminal</mat-icon> Open Command Center
                  </button>
                  <button mat-stroked-button class="btn-secondary" routerLink="/issues">
                      <mat-icon>explore</mat-icon> Audit Feed
                  </button>
              </div>
          </div>
          
          <div class="hero-visual">
              <div class="status-card-premium">
                  <div class="card-glow"></div>
                  <div class="status-header">
                      <div class="live-blink"></div>
                      <span>SYSTEM CORE: ACTIVE</span>
                  </div>
                  <div class="metrics">
                      <div class="metric">
                          <label>Active Nodes</label>
                          <div class="value">8 Strategic Zones</div>
                      </div>
                      <div class="metric">
                          <label>AI Confidence</label>
                          <div class="value green">99.4%</div>
                      </div>
                      <div class="metric">
                          <label>Uptime</label>
                          <div class="value">99.9%</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- INNOVATION STRIP -->
      <section class="innovation-strip">
          <div class="strip-item"><mat-icon>verified</mat-icon> AI-Powered Audit</div>
          <div class="strip-item"><mat-icon>security</mat-icon> Secure Civic Gateway</div>
          <div class="strip-item"><mat-icon>rocket_launch</mat-icon> Rapid Resolution</div>
          <div class="strip-item"><mat-icon>dashboard</mat-icon> Real-time Dashboards</div>
      </section>

      <!-- MISSION CAPABILITIES -->
      <section class="capabilities">
          <div class="sec-header-v2">
              <span class="sub-label">Advanced Modules</span>
              <h2>Platform Governance Tools</h2>
          </div>

          <div class="cap-modern-grid">
              <div class="cap-modern-card shadow-blue">
                  <div class="icon-wrap"><mat-icon>radar</mat-icon></div>
                  <h3>Pre-Verification AI</h3>
                  <p>Smart algorithms instantly detect duplicates and out-of-scope images before they reach human review.</p>
                  <div class="card-footer-link">LEARN MORE <mat-icon>arrow_right_alt</mat-icon></div>
              </div>
              <div class="cap-modern-card shadow-purple">
                  <div class="icon-wrap"><mat-icon>layers</mat-icon></div>
                  <h3>Geo-Targeted Routing</h3>
                  <p>Automatic assignment of reports to specific ward officers based on verified GPS coordinate polygons.</p>
                   <div class="card-footer-link">LEARN MORE <mat-icon>arrow_right_alt</mat-icon></div>
              </div>
              <div class="cap-modern-card shadow-green">
                  <div class="icon-wrap"><mat-icon>auto_awesome</mat-icon></div>
                  <h3>Semantic Labeling</h3>
                  <p>Deep-learning translation of visual defects into technical municipal categories with automated scores.</p>
                   <div class="card-footer-link">LEARN MORE <mat-icon>arrow_right_alt</mat-icon></div>
              </div>
          </div>
      </section>

      <!-- LIVE GEOSPATIAL MAP (SYNCED WITH CITIZEN PANEL) -->
      <section class="geospatial-hub">
          <div class="sec-header-v2">
              <span class="sub-label">Live Monitoring</span>
              <h2>SMC Jurisdictional Overview</h2>
          </div>

          <div class="map-layout-premium">
              <div class="map-sidebar">
                  <div class="sidebar-head">
                      <h3>Active Strategic Zones</h3>
                      <p>Monitoring {{ zones.length }} municipal regions</p>
                  </div>
                  
                  <div class="zone-list-scroll">
                      <div class="zone-row" 
                           *ngFor="let zone of zones"
                           [class.active]="selectedZoneName === zone.name"
                           (click)="selectZone(zone)">
                          <div class="zone-info">
                              <span class="z-name">{{ zone.name }}</span>
                              <span class="z-meta">{{ zone.issues }} Issues Reported</span>
                          </div>
                          <span class="badge" [ngClass]="getZoneStatusClass(zone.status)">
                              {{ zone.status }}
                          </span>
                      </div>
                  </div>

                  <div class="map-stats">
                      <div class="m-stat">
                          <span class="val">1,240</span>
                          <span class="lab">Reports Today</span>
                      </div>
                      <div class="m-stat">
                          <span class="val">92%</span>
                          <span class="lab">Resolution</span>
                      </div>
                  </div>
              </div>
              <div id="home-map" class="map-main-frame"></div>
          </div>
      </section>

      <!-- GLOBAL METRICS -->
      <section class="global-metrics-v2">
          <div class="metric-v2">
              <span class="m-val">15.4K</span>
              <span class="m-lab">Citizens Served</span>
          </div>
          <div class="metric-v2">
              <span class="m-val">22</span>
              <span class="m-lab">Avg Resolution Hrs</span>
          </div>
          <div class="metric-v2">
              <span class="m-val green">99.4%</span>
              <span class="m-lab">AI Accuracy</span>
          </div>
          <div class="metric-v2">
               <span class="m-val blue">8+</span>
               <span class="m-lab">Municipal Zones</span>
          </div>
      </section>

    </div>
  `,
    styles: [`
    :host { display: block; font-family: 'Outfit', sans-serif; background: #0b0f19; color: #f8fafc; }
    
    section { padding: 100px 10%; position: relative; }
    
    /* GRADIENTS & GLOWS */
    .mesh-glow {
        position: absolute; top: 0; left: 0; right: 0; height: 100%;
        background: radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 10% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 40%);
        pointer-events: none; z-index: 0;
    }

    .gradient-text {
        background: linear-gradient(90deg, #3b82f6, #9333ea);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* HERO */
    .hero-section {
        display: flex; align-items: center; justify-content: space-between;
        min-height: 90vh; gap: 60px; padding-top: 140px;
    }
    .hero-content { flex: 1.2; z-index: 1; }
    .govt-pill {
        display: inline-flex; align-items: center; background: rgba(59, 130, 246, 0.1);
        color: #60a5fa; padding: 10px 20px; border-radius: 100px;
        font-size: 0.9rem; font-weight: 800; text-transform: uppercase;
        letter-spacing: 1px; margin-bottom: 30px; border: 1px solid rgba(59, 130, 246, 0.2);
    }
    h1 { font-size: 4.5rem; line-height: 1; margin-bottom: 30px; font-weight: 900; letter-spacing: -2px; }
    p { font-size: 1.3rem; color: #94a3b8; line-height: 1.6; margin-bottom: 50px; max-width: 600px; }
    
    .hero-actions { display: flex; gap: 20px; }
    .btn-primary { 
        height: 60px !important; padding: 0 40px !important; font-size: 1.1rem !important; 
        background: #2563eb !important; color: white !important; font-weight: 700 !important;
        border-radius: 15px !important; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3) !important;
    }
    .btn-secondary { 
        height: 60px !important; padding: 0 40px !important; font-size: 1.1rem !important; 
        border: 2px solid #1e293b !important; color: #f8fafc !important; font-weight: 700 !important;
        border-radius: 15px !important;
    }

    /* PREMIUM STATUS CARD */
    .hero-visual { flex: 0.8; display: flex; justify-content: center; }
    .status-card-premium {
        width: 380px; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 30px;
        padding: 40px; position: relative; overflow: hidden;
    }
    .card-glow {
        position: absolute; top: -50px; right: -50px; width: 150px; height: 150px;
        background: rgba(37, 99, 235, 0.4); filter: blur(60px); opacity: 0.5;
    }
    .status-header { 
        display: flex; align-items: center; gap: 12px; margin-bottom: 40px;
        font-weight: 900; letter-spacing: 2px; color: #60a5fa; font-size: 0.85rem;
    }
    .live-blink { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 15px #22c55e; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

    .metrics { display: flex; flex-direction: column; gap: 30px; }
    .metric label { font-size: 0.85rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; }
    .metric .value { font-size: 1.8rem; font-weight: 800; color: #f8fafc; }
    .metric .value.green { color: #4ade80; }

    /* INNOVATION STRIP */
    .innovation-strip {
        background: rgba(30, 41, 59, 0.4); border-y: 1px solid rgba(255, 255, 255, 0.05);
        display: flex; justify-content: space-around; padding: 40px 10%;
    }
    .strip-item { display: flex; align-items: center; gap: 12px; font-weight: 700; color: #94a3b8; font-size: 0.95rem; }
    .strip-item mat-icon { color: #3b82f6; }

    /* CAPABILITIES V2 */
    .capabilities { background: #070a13; }
    .sec-header-v2 { text-align: center; margin-bottom: 80px; }
    .sub-label { color: #3b82f6; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; font-size: 0.9rem; margin-bottom: 12px; display: block; }
    .sec-header-v2 h2 { font-size: 3rem; font-weight: 900; letter-spacing: -1px; }

    .cap-modern-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px; }
    .cap-modern-card {
        background: #111827; padding: 50px; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: default;
    }
    .cap-modern-card:hover { transform: translateY(-15px); border-color: rgba(59, 130, 246, 0.5); }
    .icon-wrap { 
        width: 80px; height: 80px; background: rgba(59, 130, 246, 0.1); border-radius: 24px;
        display: flex; align-items: center; justify-content: center; margin-bottom: 35px;
        color: #3b82f6;
    }
    .icon-wrap mat-icon { font-size: 40px; width: 40px; height: 40px; }
    .cap-modern-card h3 { font-size: 1.6rem; font-weight: 800; margin-bottom: 20px; }
    .cap-modern-card p { color: #94a3b8; line-height: 1.7; font-size: 1.1rem; margin-bottom: 30px; }
    .card-footer-link { font-weight: 800; font-size: 0.85rem; letter-spacing: 1px; color: #3b82f6; display: flex; align-items: center; gap: 8px; opacity: 0; transition: 0.3s; }
    .cap-modern-card:hover .card-footer-link { opacity: 1; }

    /* GEOSPATIAL MAP V2 (LIGHT THEMED BOX WITHIN DARK PAGE) */
    .map-layout-premium { display: flex; height: 650px; background: white; border-radius: 40px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 40px 100px rgba(0,0,0,0.6); }
    .map-sidebar { width: 380px; padding:0; display: flex; flex-direction: column; border-right: 1px solid #f1f5f9; background: #fafcfe; color: #1e293b; }
    .sidebar-head { padding: 32px; border-bottom: 1px solid #f1f5f9; }
    .sidebar-head h3 { font-size: 1.25rem; font-weight: 800; margin: 0; color: #0f172a; }
    .sidebar-head p { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; }
    
    .zone-list-scroll { flex: 1; overflow-y: auto; padding: 16px; }
    .zone-row { 
        padding: 16px 20px; border-radius: 16px; margin-bottom: 8px; cursor: pointer; 
        display: flex; align-items: center; justify-content: space-between; transition: 0.2s;
        border: 1px solid transparent;
    }
    .zone-row:hover { background: #f1f5f9; }
    .zone-row.active { background: #eff6ff; border-color: #3b82f6; box-shadow: 0 4px 10px rgba(59,130,246,0.1); }
    .zone-info { display: flex; flex-direction: column; gap: 2px; }
    .zone-info .z-name { font-weight: 700; color: #1e293b; font-size: 0.95rem; }
    .zone-info .z-meta { font-size: 0.75rem; color: #64748b; font-weight: 600; }

    .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
    .badge.normal { background: #dcfce7; color: #15803d; }
    .badge.warn { background: #ffedd5; color: #9a3412; }
    .badge.critical { background: #fee2e2; color: #991b1b; }

    .map-stats { display: flex; gap: 30px; padding: 32px; border-top: 1px solid #f1f5f9; background: #fff; }
    .m-stat { display: flex; flex-direction: column; }
    .m-stat .val { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
    .m-stat .lab { font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; }

    .map-main-frame { flex: 1; background: #f8fafc; }

    /* GLOBAL METRICS V2 */
    .global-metrics-v2 { 
        padding: 100px 10%; display: grid; grid-template-columns: repeat(4, 1fr);
        background: linear-gradient(to bottom, #070a13, #0b0f19);
    }
    .metric-v2 { text-align: center; display: flex; flex-direction: column; border-right: 1px solid rgba(255, 255, 255, 0.05); }
    .metric-v2:last-child { border: none; }
    .m-val { font-size: 4rem; font-weight: 900; letter-spacing: -2px; color: #f8fafc; margin-bottom: 10px; }
    .m-val.green { color: #4ade80; }
    .m-val.blue { color: #3b82f6; }
    .m-lab { font-size: 1rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }

    /* RESPONSIVE */
    @media (max-width: 1200px) {
        h1 { font-size: 3.5rem; }
        .hero-section { flex-direction: column; text-align: center; }
        .hero-actions { justify-content: center; }
        .map-layout-premium { flex-direction: column; height: auto; }
        .map-sidebar { width: 100%; }
        .map-main-frame { height: 400px; }
        .global-metrics-v2 { grid-template-columns: repeat(2, 1fr); gap: 60px; }
    }
  `]
})
export class AuthorityHomeComponent implements OnInit, AfterViewInit, OnDestroy {
    platformId = inject(PLATFORM_ID);
    private map: L.Map | undefined;

    zones = [
        { name: 'Central Zone', issues: 142, status: 'Normal', coords: [21.1963, 72.8272] },
        { name: 'North Zone', issues: 120, status: 'Normal', coords: [21.2288, 72.8222] },
        { name: 'East Zone', issues: 89, status: 'Moderate', coords: [21.2188, 72.8711] },
        { name: 'West Zone', issues: 76, status: 'Resolved', coords: [21.1988, 72.7822] },
        { name: 'South Zone', issues: 165, status: 'Normal', coords: [21.1488, 72.8422] },
        { name: 'South West Zone', issues: 210, status: 'Critical', coords: [21.1688, 72.7922] },
        { name: 'South East Zone', issues: 134, status: 'Normal', coords: [21.1788, 72.8622] },
        { name: 'Varachha-B Zone', issues: 54, status: 'Normal', coords: [21.2388, 72.8911] },
    ];
    selectedZoneName = 'Central Zone';

    ngOnInit() { }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => this.initMap(), 500);
        }
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    initMap() {
        const mapContainer = document.getElementById('home-map');
        if (!mapContainer) return;

        this.map = L.map('home-map', { zoomControl: false }).setView([21.1702, 72.8311], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.drawZoneMarkers();
        this.map.invalidateSize();
    }

    drawZoneMarkers() {
        if (!this.map) return;
        this.zones.forEach(zone => {
            const color = zone.status === 'Resolved' ? '#10B981' : zone.status === 'Critical' ? '#E11D48' : '#1E3A5F';
            L.circleMarker(zone.coords as L.LatLngExpression, {
                radius: 10,
                fillColor: color,
                color: "#fff",
                weight: 3,
                opacity: 0.8,
                fillOpacity: 0.4
            }).addTo(this.map!).bindPopup(`<strong>${zone.name}</strong><br>Status: ${zone.status}`);
        });
    }

    selectZone(zone: any) {
        this.selectedZoneName = zone.name;
        this.map?.setView(zone.coords as L.LatLngExpression, 13);
    }

    getZoneStatusClass(status: string) {
        switch(status) {
            case 'Critical': return 'critical';
            case 'Moderate': return 'warn';
            case 'Resolved': return 'normal';
            default: return 'normal';
        }
    }
}
