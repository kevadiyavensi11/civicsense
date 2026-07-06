
import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../services/admin.service';

declare let L: any;

@Component({
  selector: 'app-zone-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatSelectModule, MatTooltipModule],
  template: `
    <div class="geospatial-container">
      
      <!-- MAIN MONITORING SECTION -->
      <div class="monitoring-card main-glow">
         <div class="card-head">
            <div class="ch-left">
               <mat-icon class="ch-icon">explore</mat-icon>
               <h2>LIVE GEO-SPATIAL MONITORING</h2>
            </div>
            <div class="ch-right">
               <span class="pulse-dot"></span> SMC NETWORK ACTIVE
            </div>
         </div>

         <div class="monitoring-grid">
            <!-- ZONE SIDEBAR -->
            <div class="m-sidebar">
               <div class="sidebar-label">COMMAND QUADS</div>
               <div class="zone-list">
                  <div class="zone-link total">
                     <span>SURAT CITY TOTAL</span>
                     <span class="badge sync">SYNC</span>
                  </div>
                  
                  <div *ngFor="let zone of zones" 
                       class="zone-link" 
                       [class.active]="selectedZoneId === zone.id"
                       (click)="focusZone(zone)">
                     <span>{{ zone.name | uppercase }}</span>
                     <span class="badge" [ngClass]="zone.status.toLowerCase()">{{ zone.status }}</span>
                  </div>
               </div>
            </div>

            <!-- MAP CONTAINER -->
            <div class="map-perspective">
               <div id="geospatial-map"></div>
            </div>
         </div>
      </div>

      <!-- ISSUE STREAM INTELLIGENCE -->
       <div class="monitoring-card stream-card">
          <div class="card-head stream-head">
             <div class="ch-left">
                <mat-icon class="ch-icon blue">database</mat-icon>
                <h3>ISSUE STREAM INTELLIGENCE ({{ issues.length }} SIGNALS • FULL ARCHIVE)</h3>
             </div>
             <div class="ch-right stream-btns">
                <button class="btn-toggle" [class.active]="filterStatus === 'Open'" (click)="toggleStatusFilter('Open')" mat-button><mat-icon>pending_actions</mat-icon> PENDING ONLY</button>
                <button class="btn-toggle" [class.active]="filterCritical" (click)="toggleCriticalFilter()" mat-button><mat-icon>warning</mat-icon> CRITICAL ONLY</button>
                <div class="h-select-group">
                   <span class="s-label">TEMPORAL INTERVAL</span>
                   <select [(ngModel)]="interval" (change)="loadIssues()">
                      <option value="month">Full Archive</option>
                      <option value="today">T-24 Hours</option>
                      <option value="week">Archive 7D</option>
                   </select>
                </div>
                <button class="btn-sync" mat-button (click)="loadIssues()">
                  <mat-icon>sync</mat-icon> Sync Stream
                </button>
             </div>
          </div>

          <div class="stream-table-container">
             <table class="stream-table">
                <thead>
                   <tr>
                      <th>ISSUE / IDENTITY</th>
                      <th>QUADRANT / ZONE</th>
                      <th>PROTOCOL STATUS</th>
                      <th>RISK CLASSIFICATION</th>
                      <th></th>
                   </tr>
                </thead>
                <tbody>
                   <tr *ngFor="let issue of issues" 
                       class="stream-row" 
                       (click)="focusIssue(issue)" 
                       [class.focused-row]="focusedIssueId === issue._id"
                       style="cursor:pointer">
                      <td class="col-identity">
                         <div class="id-icon">
                            <img *ngIf="!issue.imgError" [src]="getImgUrl(issue.imageUrl)" (error)="issue.imgError = true" alt="img">
                            <div *ngIf="issue.imgError" class="id-icon-fallback">
                               {{ issue.title.substring(0, 2) | uppercase }}
                            </div>
                         </div>
                         <div class="id-text">
                            <span class="t-title">{{ issue.title }}</span>
                            <span class="t-fid">FID: {{ issue._id.substring(issue._id.length - 8) }} • {{ issue.createdAt | date:'HH:mm' }} AT {{ issue.createdAt | date:'dd/MM' }}</span>
                         </div>
                      </td>
                      <td class="col-zone"><span class="q-tag">{{ (issue.zone || 'Central') | uppercase }}</span></td>
                      <td class="col-status">
                         <span class="p-badge" [class.resolved]="issue.status === 'Resolved'" [class.in-progress]="issue.status === 'In Progress'">
                            {{ (issue.status || 'PENDING') | uppercase }}
                         </span>
                      </td>
                      <td class="col-risk">
                         <div class="risk-indicator">
                            <div class="r-dot" [ngClass]="issue.priority?.toLowerCase() || 'medium'"></div>
                            <span>{{ (issue.priority || 'NORMAL') | uppercase }}</span>
                         </div>
                      </td>
                      <td class="col-action">
                         <button mat-icon-button class="view-btn" matTooltip="Show on Tactical Map">
                            <mat-icon>location_searching</mat-icon>
                         </button>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>

    </div>
  `,
  styles: [`
    :host { display: block; background: var(--bg-main); min-height: 100vh; color: var(--text-primary); font-family: 'Inter', sans-serif; overflow-x: hidden; transition: background 0.3s ease; }
    
    .geospatial-container { padding: 40px; display: flex; flex-direction: column; gap: 24px; }

    .active-zone { color: #3B82F6 !important; font-weight: 900; }
    
    ::ng-deep .zone-label {
       background: transparent !important;
       border: none !important;
       box-shadow: none !important;
       color: white !important;
       font-weight: 900 !important;
       font-size: 0.65rem !important;
       letter-spacing: 1px !important;
       text-transform: uppercase !important;
       opacity: 0.8;
       text-shadow: 0 0 10px rgba(255,255,255,0.8);
    }
    body.dark-theme ::ng-deep .zone-label { color: white !important; text-shadow: none !important; }
    ::ng-deep .zone-label::before { display: none !important; }

    /* Theme adaptive text */
    h2, h3 { color: var(--text-primary); transition: color 0.3s; }
    .sidebar-label { color: var(--text-muted); }
    .zone-link span { color: var(--text-secondary); }
    .zone-link:hover span { color: var(--text-primary); }
    .id-text .t-title { color: var(--text-primary); }
    .col-risk { color: var(--text-primary); }    /* Card System */
    .monitoring-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; overflow: hidden; transition: all 0.3s; }
    .main-glow { box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .card-head { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); }
    .ch-left { display: flex; align-items: center; gap: 12px; }
    .ch-icon { font-size: 24px; width: 24px; height: 24px; color: #2563EB; }
    .ch-icon.blue { color: #3B82F6; }
    h2 { margin: 0; font-size: 1rem; font-weight: 900; letter-spacing: 1px; color: var(--text-primary); }
    .ch-right { font-size: 0.75rem; font-weight: 800; color: #10B981; display: flex; align-items: center; gap: 8px; letter-spacing: 1px; }
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 10px #22C55E; animation: pulse 2s infinite; }
    
    /* TACTICAL CIRCLE MARKER STYLING */
    ::ng-deep .tactical-signal {
        filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer !important;
    }
    ::ng-deep .tactical-signal:hover { transform: scale(1.2); filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.6)); }
    ::ng-deep .active-signal { filter: drop-shadow(0 0 15px #3B82F6) brightness(1.2); stroke-width: 5px; stroke: #3B82F6; }

    /* Radar Pulse Animation for Focus */
    ::ng-deep .radar-pulse {
        width: 50px; height: 50px; border: 3px solid #3B82F6; border-radius: 50%;
        animation: radar-expand 2s ease-out infinite; opacity: 0;
    }
    @keyframes radar-expand { 0% { transform: scale(0.1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }

    @keyframes dashboardFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

    /* Monitoring Grid */
    .monitoring-grid { display: grid; grid-template-columns: 240px 1fr; height: 500px; }
    
    /* Sidebar */
    .m-sidebar { border-right: 1px solid var(--border-light); padding: 24px 0; display: flex; flex-direction: column; gap: 24px; }
    .sidebar-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); padding: 0 32px; letter-spacing: 2px; }
    .zone-list { display: flex; flex-direction: column; }
    .zone-link { padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s; border-left: 3px solid transparent; }
    .zone-link span { font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); transition: 0.2s; }
    .zone-link:hover { background: var(--bg-surface-alt); }
    .zone-link:hover span { color: var(--text-primary); }
    .zone-link.active { background: rgba(37,99,235,0.08) !important; border-left-color: #2563EB; }
    .zone-link.active span { color: #2563EB; font-weight: 900; }
    
    .badge { font-size: 0.6rem; font-weight: 900; padding: 4px 8px; border-radius: 4px; }
    .badge.sync { background: rgba(16,185,129,0.1); color: #10B981; border: 1px solid rgba(16,185,129,0.2); }
    .badge.crit { background: rgba(239,68,68,0.1); color: #EF4444; border: 1px solid rgba(239,68,68,0.2); box-shadow: 0 0 10px rgba(239,68,68,0.2); }
    .badge.alert { background: rgba(249,115,22,0.1); color: #F97316; border: 1px solid rgba(249,115,22,0.2); }
    
    /* Map */
    .map-perspective { background: #0F172A; }
    #geospatial-map { width: 100%; height: 100%; }

    /* Issue Stream Table */
    .stream-card { margin-top: 8px; }
    .stream-head { padding: 16px 32px; height: 80px; }
    h3 { margin: 0; font-size: 0.85rem; font-weight: 900; color: var(--text-primary); letter-spacing: 1px; }
    
    .stream-btns { display: flex; gap: 12px; }
    .btn-toggle { background: var(--bg-surface-alt); border: 1px solid var(--border-light); color: var(--text-primary); font-size: 0.65rem; font-weight: 800; padding: 0 16px; border-radius: 6px; }
    .btn-toggle.active { background: #3B82F6; color: white; border-color: #3B82F6; }
    .btn-toggle mat-icon { font-size: 16px; width: 16px; height: 16px; margin-right: 4px; }
    
    .h-select-group { display: flex; flex-direction: column; gap: 2px; }
    .s-label { font-size: 0.55rem; color: var(--text-secondary); font-weight: 800; letter-spacing: 1px; }
    .h-select-group select { background: var(--bg-surface-alt); border: 1px solid var(--border-light); color: var(--text-primary); font-size: 0.65rem; font-weight: 800; border-radius: 4px; padding: 4px 8px; outline: none; transition: 0.2s; }
    .h-select-group select:hover { border-color: #3B82F6; }
    
    .btn-sync { background: #F8FAFC; color: #0F172A; font-weight: 800; font-size: 0.75rem; border-radius: 6px; transition: 0.2s; }
    :host-context(body.dark-theme) .btn-sync { background: #1B2430; color: white; border: 1px solid rgba(255,255,255,0.1); }
    .btn-sync:hover { background: #3B82F6 !important; color: white !important; }

    .stream-table-container { padding: 0 32px 32px; overflow-x: auto; max-height: 400px; overflow-y: auto; }
    .stream-table-container::-webkit-scrollbar { width: 5px; height: 5px; }
    .stream-table-container::-webkit-scrollbar-track { background: transparent; }
    .stream-table-container::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 10px; }
    .stream-table-container::-webkit-scrollbar-thumb:hover { background: #3B82F6; }
    .stream-table { width: 100%; border-collapse: collapse; margin-top: 16px; min-width: 800px; }
    .stream-table th { text-align: left; font-size: 0.6rem; color: var(--text-muted); letter-spacing: 2px; padding: 16px 0; border-bottom: 1px solid var(--border-light); }
    .stream-row { border-bottom: 1px solid var(--border-light); transition: 0.2s; }
    .stream-row:hover { background: var(--bg-surface-alt); }
    .stream-row td { padding: 18px 12px; }
    .stream-row.focused-row { background: rgba(37, 99, 235, 0.08) !important; box-shadow: inset 4px 0 0 #3B82F6; }
    
    .view-btn { color: #3B82F6; opacity: 0; transition: 0.2s; }
    .stream-row:hover .view-btn { opacity: 1; }

    .id-icon { 
      width: 44px; height: 44px; border-radius: 12px; 
      background: var(--bg-surface-alt); 
      overflow: hidden; flex-shrink: 0;
      border: 1px solid var(--border-light);
    }
    
    /* Tactical Marker Styles */
    ::ng-deep .pulse-container { display: flex; align-items: center; justify-content: center; z-index: 1000; }
    ::ng-deep .tactical-pulse {
       width: 40px; height: 40px; border: 3px solid #3B82F6; border-radius: 50%;
       animation: tacticalPulse 1.5s infinite ease-out;
       box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }
    @keyframes tacticalPulse {
       0% { transform: scale(0.2); opacity: 0.8; }
       100% { transform: scale(1.5); opacity: 0; }
    }
    
    ::ng-deep .tactical-popup .leaflet-popup-content-wrapper { 
      background: var(--bg-card); color: var(--text-primary); 
      border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      border: 1px solid var(--border-light);
    }
    ::ng-deep .tactical-popup .leaflet-popup-tip { background: var(--bg-card); }
    
    .id-icon img {
       width: 100%; height: 100%; object-fit: cover;
    }
    .id-icon-fallback {
      width: 100%; height: 100%;
      background: #0F172A; color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 0.8rem;
    }
    body.dark-theme .id-icon-fallback { background: #1E293B; }
    .col-identity { display: flex; align-items: center; gap: 16px; }
    .id-text { display: flex; flex-direction: column; gap: 4px; }
    .t-title { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
    .t-fid { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; font-family: monospace; }
    
    .q-tag { font-size: 0.65rem; font-weight: 800; color: var(--text-secondary); background: var(--bg-surface-alt); padding: 4px 10px; border-radius: 4px; }
    .p-badge { font-size: 0.65rem; font-weight: 800; color: #EF4444; background: rgba(239,68,68,0.1); padding: 4px 12px; border-radius: 4px; border: 1px solid rgba(239,68,68,0.2); }
    .p-badge.resolved { color: #10B981; background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.2); }
    .p-badge.in-progress { color: #F59E0B; background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.2); }

    .col-risk { font-size: 0.75rem; font-weight: 800; color: #E2E8F0; display: flex; align-items: center; gap: 8px; }
    .r-dot { width: 8px; height: 8px; border-radius: 50%; }
    .r-dot.high { background: #EF4444; box-shadow: 0 0 10px #EF4444; }
    .r-dot.medium { background: #F59E0B; }
    .r-dot.low { background: #10B981; }
  `]
})
export class ZoneMonitoringComponent implements OnInit, AfterViewInit {
  private adminService = inject(AdminService);
  
  map: any;
  issues: any[] = [];
  issueMarkers: Map<string, any> = new Map();
  interval: string = 'month';
  selectedZoneId: string | null = null;
  filterStatus: string = 'All';
  filterCritical: boolean = false;
  
  zones = [
    { id: 'central', name: 'Central Zone', status: 'CRIT', color: '#3B82F6', coords: [21.195, 72.825], bounds: [[21.18, 72.81], [21.21, 72.84]] },
    { id: 'east', name: 'East Zone', status: 'CRIT', color: '#EF4444', coords: [21.215, 72.863], bounds: [[21.20, 72.85], [21.23, 72.88]] },
    { id: 'west', name: 'West Zone', status: 'CRIT', color: '#F97316', coords: [21.215, 72.802], bounds: [[21.20, 72.78], [21.23, 72.82]] },
    { id: 'north', name: 'North Zone', status: 'ALERT', color: '#10B981', coords: [21.229, 72.825], bounds: [[21.21, 72.81], [21.25, 72.84]] },
    { id: 'south', name: 'South Zone', status: 'CRIT', color: '#7E22CE', coords: [21.168, 72.855], bounds: [[21.15, 72.84], [21.18, 72.87]] },
    { id: 'swest', name: 'South West Zone', status: 'CRIT', color: '#EC4899', coords: [21.173, 72.781], bounds: [[21.15, 72.76], [21.19, 72.80]] },
    { id: 'seast', name: 'South East Zone', status: 'CRIT', color: '#FCD34D', coords: [21.155, 72.840], bounds: [[21.14, 72.82], [21.17, 72.86]] }
  ];

  ngOnInit() {
    this.loadIssues();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
      if (this.issues.length > 0) {
        this.renderMarkers();
      }
    }, 500);
  }

  loadIssues() {
    // We'll pass status 'Open' if the toggle is on, or 'All'
    const status = this.filterStatus === 'Open' ? 'Open' : '';
    this.adminService.getIssues(1, 200, '', status).subscribe(res => {
      let filtered = res.issues;
      
      // Secondary local filtering for 'Critical' priority if needed
      if (this.filterCritical) {
        filtered = filtered.filter((i: any) => i.priority === 'Critical' || i.priority === 'High');
      }

      this.issues = filtered;
      this.renderMarkers();
    });
  }

  toggleStatusFilter(status: string) {
    this.filterStatus = this.filterStatus === status ? 'All' : status;
    this.loadIssues();
  }

  toggleCriticalFilter() {
    this.filterCritical = !this.filterCritical;
    this.loadIssues();
  }

  initMap() {
    this.map = L.map('geospatial-map', { zoomControl: false }).setView([21.1702, 72.8311], 12);
    
    // Select theme-appropriate tiles
    const isDark = document.body.classList.contains('dark-theme');
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    
    L.tileLayer(tileUrl, {
      attribution: '&copy; CivicSense'
    }).addTo(this.map);

    this.renderZones();
  }

  renderZones() {
    const isDark = document.body.classList.contains('dark-theme');
    
    this.zones.forEach(zone => {
      L.rectangle(zone.bounds, {
        color: zone.color,
        weight: 2,
        fillColor: zone.color,
        fillOpacity: isDark ? 0.1 : 0.35,
        dashArray: '5, 5'
      }).addTo(this.map)
      .bindTooltip(zone.name, { permanent: true, direction: 'center', className: 'zone-label' });
    });
  }

  getImgUrl(url: string | undefined): string {
    if (!url) return 'assets/placeholder.png'; // Fallback
    if (url.startsWith('http')) return url;
    // Remove leading / if present and prefix with backend base (without /api)
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    return `http://localhost:5000/${cleanPath}`;
  }

  focusedIssueId: string | null = null;
  focusGlow: any = null;

  focusIssue(issue: any) {
    if (!issue.location?.lat || !issue.location?.lng) return;
    this.focusedIssueId = issue._id;
    
    // 1. Scroll back to map view (Top of page)
    const scrollArea = document.querySelector('.scroll-area');
    if (scrollArea) {
      scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 2. Smoothly fly to the location
    this.map.flyTo([issue.location.lat, issue.location.lng], 17, {
      duration: 1.5,
      easeLinearity: 0.1
    });

    // 3. Tactical Highlight Animation (Radar Pulse)
    if (this.focusGlow) { this.map.removeLayer(this.focusGlow); }
    
    // Find the original marker and highlight it
    const marker = this.issueMarkers.get(issue._id);
    if (marker) {
       L.DomUtil.addClass(marker._path, 'active-signal');
       setTimeout(() => L.DomUtil.removeClass(marker._path, 'active-signal'), 3000);
    }

    const radarIcon = L.divIcon({
      className: 'radar-container',
      html: `<div class="radar-pulse"></div>`,
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });
    
    this.focusGlow = L.marker([issue.location.lat, issue.location.lng], { icon: radarIcon }).addTo(this.map);
    setTimeout(() => { if (this.focusGlow) this.map.removeLayer(this.focusGlow); }, 4000);

    // 4. Open the popup for this marker
    if (marker) {
      setTimeout(() => marker.openPopup(), 1500);
    }
  }

  renderMarkers() {
    if (!this.map) {
      console.warn('Map not ready for marker rendering');
      return;
    }
    
    // Clear previous markers
    this.issueMarkers.forEach(m => m.remove());
    this.issueMarkers.clear();
    
    this.issues.forEach(issue => {
      if (issue.location?.lat && issue.location?.lng) {
        const priorityColor = issue.priority === 'High' ? '#EF4444' : (issue.priority === 'Medium' ? '#F59E0B' : '#10B981');
        const isDark = document.body.classList.contains('dark-theme');
        
        const marker = L.circleMarker([issue.location.lat, issue.location.lng], {
          radius: 9,
          fillColor: priorityColor,
          color: isDark ? '#FFF' : '#0F172A',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9,
          className: 'tactical-signal'
        }).addTo(this.map)
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 8px; min-width: 200px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
               <span style="color: #64748B; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">${issue.category}</span>
               <span style="background: ${priorityColor}15; color: ${priorityColor}; padding: 2px 8px; border-radius: 4px; font-size: 0.6rem; font-weight: 800; border: 1px solid ${priorityColor}30;">${issue.priority || 'NORMAL'}</span>
            </div>
            <div style="font-weight: 900; font-size: 1rem; margin-bottom: 6px; color: ${isDark ? '#FFF' : '#0F172A'}">${issue.title}</div>
            <div style="color: #64748B; font-size: 0.75rem; line-height: 1.5; margin-bottom: 12px; font-style: italic;">"${issue.description || 'No description provided'}"</div>
            <div style="padding-top: 10px; border-top: 1px solid #E2E8F0; display: flex; flex-direction: column; gap: 4px;">
               <div style="font-size: 0.65rem; color: #94A3B8;"><mat-icon style="font-size: 10px; height: 10px; width: 10px;">location_on</mat-icon> ${issue.location.fullAddress}</div>
               <div style="font-size: 0.65rem; font-weight: 700; color: #3B82F6; text-transform: uppercase;">SECTOR: ${issue.zone || 'Unassigned'}</div>
            </div>
          </div>
        `, { maxWidth: 300, className: 'tactical-popup' });

        this.issueMarkers.set(issue._id, marker);
      }
    });
  }

  focusZone(zone: any) {
    if (!zone) {
      this.selectedZoneId = null;
      this.map.flyTo([21.1702, 72.8311], 12, { animate: true, duration: 1.5 });
      return;
    }
    this.selectedZoneId = zone.id;
    this.map.flyTo(zone.coords, 14, { animate: true, duration: 1.5 });
  }
}
