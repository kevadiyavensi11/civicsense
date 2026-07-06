
import { Component, inject, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { FileUploadService } from '../../services/file-upload.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangeDetectorRef } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { isPointInPolygon } from '../../utils/geo-utils';
import { ZONE_BOUNDARIES } from '../../data/zone-data';
import * as L from 'leaflet'; // LEAFLET IMPORT

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatIconModule,
    MatStepperModule, MatProgressSpinnerModule, MatProgressBarModule
  ],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>Report New Issue</h1>
        <p>Complete the form below to alert local authorities.</p>
      </div>

      <mat-card class="form-card">
        <mat-stepper [linear]="true" #stepper (selectionChange)="onStepChange($event)">
            <!-- Custom Icons for Stepper -->
            <ng-template matStepperIcon="edit"><mat-icon>edit</mat-icon></ng-template>
            <ng-template matStepperIcon="camera"><mat-icon>camera_alt</mat-icon></ng-template>
            <ng-template matStepperIcon="location"><mat-icon>location_on</mat-icon></ng-template>
            <ng-template matStepperIcon="done"><mat-icon>check_circle</mat-icon></ng-template>
            <ng-template matStepperIcon="number" let-index="index">
                <mat-icon *ngIf="index === 0">edit</mat-icon>
                <mat-icon *ngIf="index === 1">camera_alt</mat-icon>
                <mat-icon *ngIf="index === 2">location_on</mat-icon>
                <mat-icon *ngIf="index === 3">check_circle</mat-icon>
            </ng-template>
            
            <!-- STEP 1: DETAILS -->
            <mat-step [stepControl]="detailsGroup">
                <form [formGroup]="detailsGroup">
                    <ng-template matStepLabel>Details</ng-template>
                    
                    <div class="row">
                        <mat-form-field appearance="outline" class="col">
                            <mat-label>Issue Title</mat-label>
                            <input matInput formControlName="title" placeholder="Brief summary" autocomplete="off">
                        </mat-form-field>
                        
                        <mat-form-field appearance="outline" class="col">
                            <mat-label>Category</mat-label>
                            <mat-select formControlName="category">
                                <mat-option value="Pothole">Pothole</mat-option>
                                <mat-option value="Garbage">Garbage</mat-option>
                                <mat-option value="Streetlight">Streetlights</mat-option>
                                <mat-option value="Water">Water Leakage</mat-option>
                                <mat-option value="Traffic">Traffic Issue</mat-option>
                                <mat-option value="Drainage">Drainage</mat-option>
                                <mat-option value="Noise">Noise Pollution</mat-option>
                                <mat-option value="Parking">Illegal Parking</mat-option>
                                <mat-option value="Signage">Road Signage</mat-option>
                                <mat-option value="Animals">Stray Animals</mat-option>
                                <mat-option value="Others">Others</mat-option>
                            </mat-select>
                        </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" style="width:100%" *ngIf="detailsGroup.get('category')?.value === 'Others'">
                        <mat-label>Specify Category</mat-label>
                        <input matInput formControlName="otherCategory" placeholder="e.g. Fallen Tree">
                    </mat-form-field>

                    <mat-form-field appearance="outline" style="width:100%">
                        <mat-label>Description</mat-label>
                        <textarea matInput formControlName="description" rows="4"></textarea>
                    </mat-form-field>

                    <div class="actions">
                        <button mat-flat-button color="primary" matStepperNext>Next</button>
                    </div>
                </form>
            </mat-step>

            <!-- STEP 2: PHOTO -->
            <mat-step [stepControl]="mediaGroup">
                <form [formGroup]="mediaGroup">
                    <ng-template matStepLabel>Photo</ng-template>
                     <div class="upload-area" (click)="!isUploading && fileInput.click()" [class.disabled]="isUploading">
                        <input #fileInput type="file" (change)="onFileSelected($event)" style="display:none" [disabled]="isUploading">
                        
                        <div *ngIf="!previewUrl && !isUploading" class="placeholder">
                            <mat-icon>cloud_upload</mat-icon>
                            <span>Click to upload image</span>
                        </div>
                        
                        <div *ngIf="isUploading" class="uploading-state">
                            <mat-spinner diameter="40"></mat-spinner>
                            <p>Uploading... {{ uploadProgress }}%</p>
                            <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
                        </div>

                        <img *ngIf="previewUrl && !isUploading" [src]="previewUrl" style="max-height: 200px">
                    </div>

                    <div class="actions">
                       <button mat-button matStepperPrevious [disabled]="isUploading">Back</button>
                       <button mat-flat-button color="primary" matStepperNext [disabled]="!imageUrl || isUploading">
                           {{ isUploading ? 'Uploading...' : 'Next' }}
                       </button>
                    </div>
                </form>
            </mat-step>

            <!-- STEP 3: LOCATION (MAP) -->
            <mat-step [stepControl]="locationGroup">
                <ng-template matStepLabel>Location</ng-template>
                
                <div class="loc-panel">
                    <div id="map" class="map-container"></div>
                    
                    <div class="map-controls">
                        <button mat-raised-button color="accent" (click)="startSmartGPS()">
                            <mat-icon>my_location</mat-icon> Use GPS
                        </button>
                        <p class="hint">Click map or drag marker to adjust.</p>
                        
                        <!-- NEW: Accuracy Status Badge -->
                        <span class="acc-badge" *ngIf="locationStatus" [ngClass]="getAccuracyClass()">
                            {{ locationStatus }}
                        </span>
                    </div>
                    
                    <div *ngIf="locationGroup.value.lat" class="coords-box">
                        <p><strong>Lat:</strong> {{ locationGroup.value.lat | number:'1.5-5' }}</p>
                        <p><strong>Lng:</strong> {{ locationGroup.value.lng | number:'1.5-5' }}</p>
                    </div>

                    <mat-form-field appearance="outline" style="width: 100%; margin-top: 16px;">
                        <mat-label>Select Zone</mat-label>
                        <mat-select formControlName="zone" (selectionChange)="onZoneManualSelect()">
                            <mat-option *ngFor="let z of zones" [value]="z.zoneName">
                                {{ z.zoneName }}
                            </mat-option>
                        </mat-select>
                        <mat-error *ngIf="locationGroup.get('zone')?.hasError('required')">
                            You must select a zone.
                        </mat-error>
                        <mat-hint *ngIf="locationGroup.get('zone')?.value">
                            <mat-icon style="font-size: 14px; height: 14px; width: 14px; vertical-align: middle;">my_location</mat-icon> 
                            Zone selected (detected or manual)
                        </mat-hint>
                         <mat-hint *ngIf="!locationGroup.get('zone')?.value">
                            <mat-icon style="font-size: 14px; height: 14px; width: 14px; vertical-align: middle;">info</mat-icon> 
                            Please select a zone manually
                        </mat-hint>
                    </mat-form-field>

                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 16px;">
                        <mat-form-field appearance="outline" style="flex: 1;">
                            <mat-label>Detected Address</mat-label>
                            <input matInput formControlName="address" placeholder="Enter address manually..." (focus)="stopGPS()" (keyup.enter)="manualSearch()">
                            <mat-icon matSuffix (click)="manualSearch()" style="cursor: pointer" title="Search Location">search</mat-icon>
                            <mat-hint>Type address and click search to pin on map</mat-hint>
                        </mat-form-field>
                        <button mat-mini-fab color="primary" (click)="manualSearch()" title="Search">
                            <mat-icon>search</mat-icon>
                        </button>
                    </div>

                    <!-- Warning for Low Accuracy -->
                    <div *ngIf="locationStatus.includes('Low') || locationStatus.includes('Medium')" class="warning-box">
                         <mat-icon>warning</mat-icon>
                         <span>GPS signal is weak. Please verify the pin location manually on the map.</span>
                    </div>
                </div>

                <div class="actions">
                   <button mat-button matStepperPrevious>Back</button>
                   <button mat-flat-button color="primary" matStepperNext [disabled]="!locationGroup.get('zone')?.value">Next</button>
                </div>
            </mat-step>

            <!-- STEP 4: CONFIRM -->
            <mat-step>
                <ng-template matStepLabel>Submit</ng-template>
                <div class="confirm-container">
                    <h2 class="step-title">Final Review</h2>
                    <p class="step-subtitle">Please verify all details before official submission.</p>

                    <div class="ai-report-card">
                        <div class="ai-report-header">
                            <div class="ai-info">
                                <mat-icon>verified</mat-icon>
                                <h3>Official Validation Report</h3>
                            </div>
                        </div>

                        <div class="report-content">
                            <div class="report-image">
                                <img [src]="previewUrl" alt="Report Evidence">
                                <div class="image-overlay"></div>
                            </div>
                            
                            <div class="report-details">
                                <div class="detail-item">
                                    <label>Status</label>
                                    <span>Ready for Submission</span>
                                </div>
                                <div class="detail-item">
                                    <label>Incident Type</label>
                                    <span>{{ detailsGroup.value.category }} Reported</span>
                                </div>
                                <div class="detail-item">
                                    <label>Priority</label>
                                    <span class="priority-pill" [class]="verificationResult?.priority || 'High'">
                                        {{ verificationResult?.priority || 'High' }}
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <label>Reference</label>
                                    <span class="status-confirmed">
                                        <mat-icon>check_circle</mat-icon> Verified Details
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="actions">
                        <button mat-button matStepperPrevious [disabled]="isValidating">Back</button>
                        <button mat-raised-button color="primary" class="submit-btn" (click)="onSubmit()" [disabled]="isValidating">
                            <mat-icon *ngIf="!isValidating">send</mat-icon>
                            {{ isValidating ? 'Validating...' : 'Submit Report' }}
                        </button>
                    </div>
                </div>
            </mat-step>

        </mat-stepper>
      </mat-card>
      
      <!-- SYSTEM VALIDATION OVERLAY -->
      <div class="validation-overlay" *ngIf="isValidating">
          <mat-spinner diameter="60" color="accent"></mat-spinner>
          <h2>System is validating your report...</h2>
          <p>Verifying image authenticity & assessing priority level.</p>
      </div>
      
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; }
    .form-header { margin-bottom: 24px; text-align: center; }
    .row { display: flex; gap: 16px; }
    .col { flex: 1; }
    .upload-area { border: 2px dashed #e2e8f0; padding: 40px; text-align: center; border-radius: 8px; cursor: pointer; margin-bottom: 24px; }
    .placeholder { display: flex; flex-direction: column; align-items: center; color: #64748b; }
    .uploading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    
    .map-container { 
        height: 350px; 
        width: 100%; 
        border-radius: 8px; 
        margin-bottom: 16px; 
        z-index: 0;
        border: 1px solid #ccc;
    }
.loc-panel { background: #f8fafc; padding: 16px; border-radius: 8px; }
    .map-controls { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
    .hint { font-size: 0.9em; color: #64748b; margin: 0; }
    .coords-box { display: flex; gap: 24px; font-family: monospace; background: #e2e8f0; padding: 8px 16px; border-radius: 4px; }
    
    .actions { margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px; }

    /* CONFIRM / AI REPORT WIZARD STYLES */
    .confirm-container { width: 100%; text-align: left; }
    .step-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
    .step-subtitle { color: #64748b; margin-bottom: 32px; font-size: 0.95rem; }

    .ai-report-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
    }

    .ai-report-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 16px;
    }

    .ai-info { display: flex; align-items: center; gap: 12px; }
    .ai-info mat-icon { color: #3b82f6; font-size: 28px; width: 28px; height: 28px; }
    .ai-info h3 { margin: 0; font-size: 1.1rem; color: #1e293b; letter-spacing: -0.5px; }

    .confidence-badge {
        background: #ecfdf5;
        color: #10b981;
        padding: 6px 16px;
        border-radius: 99px;
        font-weight: 700;
        font-size: 0.85rem;
        border: 1px solid rgba(16, 185, 129, 0.1);
    }

    .report-content { display: flex; gap: 40px; }
    .report-image { 
        width: 140px; height: 140px; flex-shrink: 0; border-radius: 12px; 
        overflow: hidden; position: relative; border: 4px solid #f8fafc;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .report-image img { width: 100%; height: 100%; object-fit: cover; }
    
    .report-details { flex-grow: 1; display: grid; gap: 16px; }
    .detail-item { display: flex; justify-content: space-between; align-items: center; }
    .detail-item label { color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-item span { color: #1e293b; font-weight: 700; font-size: 1rem; }

    .priority-pill { padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; text-transform: uppercase; }
    .priority-pill.High { background: #fee2e2; color: #ef4444; }
    .priority-pill.Medium { background: #fef9c3; color: #ca8a04; }
    .priority-pill.Low { background: #dcfce7; color: #16a34a; }

    .status-confirmed { display: flex; align-items: center; gap: 6px; color: #10b981; }
    .status-confirmed mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .ai-diagnostic {
        margin-top: 16px; 
        padding-top: 16px; 
        border-top: 1px dashed #e2e8f0; 
        color: #64748b; 
        font-size: 0.85rem; 
        line-height: 1.6;
    }

    .submit-btn { padding: 0 40px !important; height: 48px !important; border-radius: 12px !important; font-size: 1rem !important; }

    .ai-pulse { animation: ai-pulse 2s infinite ease-in-out; }
    @keyframes ai-pulse { 
        0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); }
        50% { transform: scale(1.1); filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4)); }
        100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); }
    }

    /* DARK THEME */
    :host-context(body.dark-theme) .step-title { color: white; }
    :host-context(body.dark-theme) .ai-report-card { background: #1e293b; border-color: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) .ai-info h3 { color: white; }
    :host-context(body.dark-theme) .ai-report-header { border-bottom-color: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) .detail-item span { color: #f1f5f9; }
    :host-context(body.dark-theme) .report-image { border-color: #334155; }
    :host-context(body.dark-theme) .ai-diagnostic { border-top-color: rgba(255,255,255,0.05); color: #94a3b8; }
    :host-context(body.dark-theme) .confidence-badge { background: rgba(16, 185, 129, 0.1); }
    :host-context(body.dark-theme) .form-header h1 { color: #f8fafc; }
    :host-context(body.dark-theme) .form-header p { color: #94a3b8; }
    
    :host-context(body.dark-theme) .form-card { 
        background-color: #1e293b !important; 
        border: 1px solid #334155;
    }

    /* STEPPER PREMIUM OVERRIDES (Green/Teal Wizard Theme) */
    ::ng-deep .mat-horizontal-stepper-header-container { padding: 0 40px; margin-bottom: 24px; }
    ::ng-deep .mat-step-header { overflow: visible !important; }
    ::ng-deep .mat-step-header .mat-step-icon {
        width: 44px; height: 44px; font-size: 20px;
        background-color: #f1f5f9; color: #94a3b8; border-radius: 50%;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid #e2e8f0;
    }
    ::ng-deep .mat-step-header .mat-step-icon-selected,
    ::ng-deep .mat-step-header .mat-step-icon-state-edit,
    ::ng-deep .mat-step-header .mat-step-icon-state-done {
        background-color: #10b981 !important;
        color: white !important;
        border-color: #10b981 !important;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        transform: scale(1.1);
    }
    ::ng-deep .mat-step-header .mat-step-label {
        font-family: 'Poppins', sans-serif !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
        font-size: 0.75rem !important;
        margin-top: 8px !important;
    }
    ::ng-deep .mat-step-header .mat-step-label.mat-step-label-active { color: #10b981 !important; }
    
    /* Connection Line Styling */
    ::ng-deep .mat-stepper-horizontal-line {
        border-top-width: 4px !important;
        margin: 0 -16px !important;
        border-top-color: #f1f5f9 !important;
    }
    ::ng-deep .mat-step-header[aria-selected="true"] ~ .mat-stepper-horizontal-line,
    ::ng-deep .mat-step-header[aria-selected="false"] ~ .mat-stepper-horizontal-line {
         /* Grey by default */
    }
    
    /* DARK THEME STEPPER EXTRAS */
    :host-context(body.dark-theme) ::ng-deep .mat-step-header .mat-step-icon {
        background-color: #0f172a; border-color: #334155; color: #475569;
    }
    :host-context(body.dark-theme) ::ng-deep .mat-stepper-horizontal-line {
        border-top-color: #1e293b !important;
    }
    :host-context(body.dark-theme) ::ng-deep .mat-step-header .mat-step-label { color: #64748b; }

    /* Form Fields Dark Mode */
    :host-context(body.dark-theme) ::ng-deep .mdc-text-field--outlined {
        background-color: #0f172a !important;
        color: #f1f5f9 !important;
    }
    :host-context(body.dark-theme) ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__leading,
    :host-context(body.dark-theme) ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__notch,
    :host-context(body.dark-theme) ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__trailing {
        border-color: #334155 !important;
    }
    :host-context(body.dark-theme) ::ng-deep .mat-mdc-input-element,
    :host-context(body.dark-theme) ::ng-deep .mat-mdc-select-value,
    :host-context(body.dark-theme) ::ng-deep .mat-mdc-select-arrow svg {
        color: #f1f5f9 !important;
        fill: #f1f5f9 !important;
    }
    :host-context(body.dark-theme) ::ng-deep .mat-mdc-form-field-label {
        color: #94a3b8 !important;
    }

    /* Panels & Upload */
    :host-context(body.dark-theme) .upload-area {
        border-color: #334155;
        background-color: #0f172a;
    }
    :host-context(body.dark-theme) .placeholder { color: #64748b; }
    
    :host-context(body.dark-theme) .loc-panel {
        background-color: #111827;
        color: #f1f5f9;
        border-color: #1e293b;
    }
    :host-context(body.dark-theme) .coords-box {
        background-color: #0f172a;
        color: #94a3b8;
    }
    :host-context(body.dark-theme) .acc-high { background: rgba(22, 163, 74, 0.1); border-color: rgba(22, 163, 74, 0.2); }
    :host-context(body.dark-theme) .acc-medium { background: rgba(234, 179, 8, 0.1); border-color: rgba(234, 179, 8, 0.2); }
    :host-context(body.dark-theme) .acc-low { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); }
    
    :host-context(body.dark-theme) .summary p strong { color: #f1f5f9; }
    :host-context(body.dark-theme) .summary p { color: #cbd5e1; }

    /* System Overlay */
    .validation-overlay {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.85);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
        animation: fadeIn 0.3s ease;
    }
    .validation-overlay h2 {
        margin-top: 20px;
        letter-spacing: 2px;
        color: #22d3ee;
        text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
    }
    .validation-overlay p {
        color: #94a3b8;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class ReportIssueComponent implements OnInit, AfterViewInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  issueService = inject(IssueService);
  uploadService = inject(FileUploadService);
  cdr = inject(ChangeDetectorRef);

  detailsGroup = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    otherCategory: [''],
    description: ['', Validators.required]
  });
  mediaGroup = this.fb.group({ imageUrl: ['', Validators.required] });
  locationGroup = this.fb.group({
    lat: [null as number | null], // Validators removed to unblock MatStepper
    lng: [null as number | null], // Validators removed to unblock MatStepper
    accuracy: [null as number | null],
    source: ['GPS'],
    zone: ['', Validators.required],
    address: ['']
  });

  zoneManuallySet = false;
  onZoneManualSelect() {
    this.zoneManuallySet = true;
  }

  // GPS Logic
  private gpsReadings: { lat: number, lng: number }[] = [];
  private readonly REQUIRED_READINGS = 5;
  locationStatus: string = 'Waiting for GPS...';
  // 'High Accuracy (Active)' | 'Medium Accuracy' | 'Approximate - Verify Pin'

  // State
  gpsRetryCount = 0;
  maxRetries = 3;
  gpsWatchId: number | null = null;
  isUploading = false;
  uploadProgress = 0;
  previewUrl: string | null = null;
  imageUrl: string | null = null;
  zones: any[] = [];
  detectedAddress: string = '';

  // Leaflet Map
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  // Default to Surat
  private defaultLat = 21.1702;
  private defaultLng = 72.8311;

  ngAfterViewInit(): void {
    // Map will be initialized when the step is opened to avoid size issues
  }

  onStepChange(event: any) {
    // Index 2 is the Location Step
    if (event.selectedIndex === 2) {
      setTimeout(() => {
        this.initMap();
      }, 100); // Small delay to allow DOM to render
    }
  }

  private initMap(): void {
    if (this.map) return; // Already init

    this.map = L.map('map', {
      maxBounds: [[6.0, 68.0], [37.0, 98.0]], // India Bounds
      minZoom: 4
    }).setView([this.defaultLat, this.defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Click handler
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      // Manual Override
      this.updateMarker(e.latlng.lat, e.latlng.lng, 0, 'Manual');
    });

    // Try to get current location immediately if not set
    if (this.locationGroup.value.lat === null) {
      this.startSmartGPS();
    }
  }

  // ---------------------------------------------------------
  // ROBUST GPS SYSTEM (Government-Grade)
  // ---------------------------------------------------------
  startSmartGPS() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    this.isUploading = true; 
    this.locationStatus = 'Detecting precise location...';
    this.gpsReadings = [];

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000 // Reduced to 10s for snappier feedback
    };

    this.stopGPS();

    this.gpsWatchId = navigator.geolocation.watchPosition(
      (pos) => this.processGPSReading(pos),
      (err) => {
        console.warn('High Accuracy GPS failed, trying standard...', err);
        // Fallback to simpler one-shot if watch fails
        navigator.geolocation.getCurrentPosition(
            (p) => this.processGPSReading(p),
            (e) => this.handleGPSError(e),
            { enableHighAccuracy: false, timeout: 5000 }
        );
      },
      options
    );
  }

  processGPSReading(pos: GeolocationPosition) {
    const { latitude, longitude, accuracy } = pos.coords;
    console.log(`[GPS Reading] Lat: ${latitude}, Lng: ${longitude}, Acc: ${accuracy}m`);

    // Collect reading
    this.gpsReadings.push({ lat: latitude, lng: longitude });

    // Update Status immediately based on latest accuracy
    this.updateAccuracyStatus(accuracy);

    // If we have enough readings, average them for stability
    if (this.gpsReadings.length >= this.REQUIRED_READINGS) {
      const avgLat = this.gpsReadings.reduce((sum, r) => sum + r.lat, 0) / this.gpsReadings.length;
      const avgLng = this.gpsReadings.reduce((sum, r) => sum + r.lng, 0) / this.gpsReadings.length;

      console.log(`[GPS Stable]Averaged ${this.REQUIRED_READINGS} readings: ${avgLat}, ${avgLng}`);

      // Stop watching to save battery once we have a stable lock
      // UNLESS user wants to keep tracking? 
      // Guide says: "Collect at least 5... Use averaged location"
      // It implies we settle on this.
      if (accuracy <= 20) {
        this.stopGPS(); // Lock it in
        this.locationStatus = 'High Accuracy (Locked)';
      }

      // Update Map with Averaged Location
      this.updateMarker(avgLat, avgLng, accuracy, 'GPS');
      this.map?.setView([avgLat, avgLng], 18);
      this.isUploading = false; // Hide Spinner
    } else {
      // Update map with generic reading while waiting for average
      // This ensures user sees progress
      this.updateMarker(latitude, longitude, accuracy, 'GPS');
      if (!this.map?.getBounds().contains([latitude, longitude])) {
        this.map?.setView([latitude, longitude], 18);
      }
    }
  }

  handleGPSError(err: GeolocationPositionError) {
    console.warn('[GPS Error]', err);
    // Fallback Logic:
    // If High Accuracy failed, browser might have already tried network.
    // We will now manually stop and set status to allow Manual Pin.
    this.isUploading = false;
    this.stopGPS();

    this.locationStatus = 'GPS Signal Weak - Please set location manually';
    // alert('Precise GPS failed. Please adjust the pin manually on the map.'); // REMOVED BLOCKING ALERT

    // If we had SOME readings, use the last one
    if (this.gpsReadings.length > 0) {
      const last = this.gpsReadings[this.gpsReadings.length - 1];
      this.updateMarker(last.lat, last.lng, 100, 'GPS'); // weak acc
      this.map?.setView([last.lat, last.lng], 15);
    } else {
      // Absolute fail - Default to Center
      // Do not block. Just let them drag.
      this.locationStatus = 'GPS Failed - Click map to set location';
    }
  }

  updateAccuracyStatus(acc: number) {
    if (acc <= 20) {
      this.locationStatus = `High Accuracy(${Math.round(acc)}m)`;
    } else if (acc <= 50) {
      this.locationStatus = `Medium Accuracy(${Math.round(acc)}m)`;
    } else {
      this.locationStatus = `Approximate(${Math.round(acc)}m) - Verify Pin`;
    }
  }

  getAccuracyClass() {
    if (this.locationStatus.includes('High')) return 'acc-high';
    if (this.locationStatus.includes('Medium')) return 'acc-medium';
    return 'acc-low'; // For Approximate/Low
  }

  private updateMarker(lat: number, lng: number, accuracy: number = 0, source: 'GPS' | 'Manual' = 'Manual') {
    // 1. Strict India Bounds Check (approximate box)
    if (lat < 6.0 || lat > 37.0 || lng < 68.0 || lng > 98.0) {
      return;
    }

    // CRITICAL FIX: Set Coordinate Immediately (Don't wait for API)
    this.locationGroup.patchValue({ lat, lng, accuracy, source });

    // Set placeholder address while fetching - FORCE NON-EMPTY
    const currentAddr = this.locationGroup.get('address')?.value;
    if (!currentAddr || currentAddr === '') {
      this.locationGroup.get('address')?.setValue('Location selected from map');
    }
    this.detectedAddress = 'Fetching...';

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      const icon = L.icon({
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      this.marker = L.marker([lat, lng], { draggable: true, icon }).addTo(this.map!);
      this.marker.on('dragend', (event) => {
        this.stopGPS(); // Stop GPS if user manually moves pin
        const position = event.target.getLatLng();
        this.updateMarker(position.lat, position.lng, 0, 'Manual');
      });
    }

    // Remove client-side detectZone call
    this.cdr.detectChanges();

    // 2. Reverse Geocode (Backend Proxy with Zone)
    this.issueService.reverseGeocode(lat, lng).subscribe({
      next: (res: any) => {
        if (res.fullAddress || res.locality) {

          const shortAddr = [res.locality, res.city, res.state, res.pincode].filter(Boolean).join(', ');
          this.detectedAddress = shortAddr || res.fullAddress;

          this.locationGroup.patchValue({
            address: this.detectedAddress
          });

          // HANDLE OUTSIDE LIMITS: Prevent patching "Outside Municipal Limits" into the form value
          const isOutside = res.zone === 'Outside Municipal Limits';
          
          if (!this.zoneManuallySet) {
            if (isOutside) {
              this.locationGroup.patchValue({ zone: '' }); // Force user to pick or move marker
            } else {
              this.locationGroup.patchValue({ zone: res.zone });
            }
          }

          if (this.marker) {
            const displayZone = isOutside ? 'ZONE NOT DETECTED' : (this.locationGroup.get('zone')?.value || res.zone);
            const popupContent = isOutside 
                ? `<b style="color: #e11d48">⚠️ Outside Limits</b><br>Please move the marker inside a valid zone or select one manually.`
                : `<b>Zone: ${displayZone}</b><br>${this.detectedAddress}`;
            
            this.marker.bindPopup(popupContent).openPopup();
          }

        } else {
          // Fallback
          this.locationGroup.patchValue({ address: 'Location selected from map' });
          if (!this.zoneManuallySet) this.locationGroup.patchValue({ zone: '' });
        }
        this.cdr.detectChanges();
      },
      error: () => {
        console.warn('Geocode failed.');
        this.locationGroup.patchValue({ address: 'Location selected (Offline)' });
        this.cdr.detectChanges();
      }
    });
  }

  resetLocation() {
    this.locationGroup.patchValue({ lat: null, lng: null, zone: '' });
    this.locationGroup.get('address')?.setValue('');
    this.detectedAddress = '';
    if (this.marker) {
      this.map?.removeLayer(this.marker);
      this.marker = undefined;
    }
    this.cdr.detectChanges();
  }

  detectZone(lat: number, lng: number) {
    if (!this.zones) return;

    // Import logic dynamically or use if imported at top
    // Implemented inline for simplicity or imported
    const detected = ZONE_BOUNDARIES.find(z => isPointInPolygon({ lat, lng }, z.polygon));

    if (detected) {
      console.log('✅ Auto-Detected Zone:', detected.name);

      // Fuzzy Match (Case Insensitive)
      const match = this.zones.find(z => z.zoneName.toLowerCase().trim() === detected.name.toLowerCase().trim());

      if (match) {
        this.locationGroup.patchValue({ zone: match.zoneName });
      } else {
        console.warn('Zone detected but not found in active API zones list:', detected.name);
        // FORCE ASSIGNMENT: If we found a polygon but not in list, use it anyway or fallback
        if (this.zones.length > 0) {
          this.locationGroup.patchValue({ zone: this.zones[0].zoneName }); // Fallback to first available
        }
      }
    } else {
      console.log('⚠️ No zone detected for coordinates. FORCE ASSIGNING DEFAULT.');
      // FORCE ASSIGNMENT: Never leave empty
      if (this.zones.length > 0) {
        this.locationGroup.patchValue({ zone: this.zones[0].zoneName });
      }
    }
  }

  stopGPS() {
    if (this.gpsWatchId !== null) {
      navigator.geolocation.clearWatch(this.gpsWatchId);
      this.gpsWatchId = null;
      this.locationStatus = 'Manual Mode';
      this.isUploading = false;
    }
  }

  manualSearch() {
    const query = this.locationGroup.get('address')?.value;
    if (!query || query.length < 3) return;

    this.stopGPS(); // Ensure GPS doesn't override
    this.isUploading = true;

    this.issueService.searchLocation(query).subscribe({
      next: (res) => {
        this.isUploading = false;
        if (res && res.lat && res.lng) {
          // Update Marker & Map
          this.updateMarker(res.lat, res.lng, 0, 'Manual');
          this.map?.setView([res.lat, res.lng], 16);
          // Update text properly
          const shortAddr = [res.locality, res.city, res.state].filter(Boolean).join(', ');
          this.detectedAddress = shortAddr || res.fullAddress;
          this.locationGroup.patchValue({
            address: this.detectedAddress,
            lat: res.lat,
            lng: res.lng,
            zone: res.zone // Use Backend Zone
          });
        } else {
          alert('Address not found. Please try a different query.');
        }
      },
      error: (err) => {
        this.isUploading = false;
        alert('Search failed. Please try again.');
      }
    });
  }

  // File Upload Handlers
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.previewUrl = URL.createObjectURL(file);
      this.isUploading = true;

      this.uploadService.upload(file).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
            this.cdr.detectChanges();
          } else if (event.type === HttpEventType.Response) {
            this.isUploading = false;
            this.imageUrl = event.body?.url || null;
            if (this.imageUrl) {
              this.mediaGroup.patchValue({ imageUrl: this.imageUrl });
            }
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          this.isUploading = false;
          this.imageUrl = null;
          this.mediaGroup.patchValue({ imageUrl: '' }); // Ensure invalid
          alert('Image upload failed. Please try again.');
          console.error(err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngOnInit() {
    // Pre-fetch zones to ensure they are ready when step is reached
    this.loadZones();

    // Handle "Other" category validation
    this.detailsGroup.get('category')?.valueChanges.subscribe(val => {
      const otherCtrl = this.detailsGroup.get('otherCategory');
      if (val === 'Others') {
        otherCtrl?.setValidators([Validators.required]);
      } else {
        otherCtrl?.clearValidators();
        otherCtrl?.setValue('');
      }
      otherCtrl?.updateValueAndValidity();
    });
  }

  loadZones() {
    this.issueService.getZones().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.zones = data;
        } else {
          console.warn('[ReportIssue] No zones found from API, using static fallback.');
          this.zones = ZONE_BOUNDARIES.map(z => ({ zoneName: z.name }));
        }
        console.log('[ReportIssue] Zones Loaded:', this.zones.length);
      },
      error: (err) => {
        console.error('[ReportIssue] Failed to load zones, using fallback', err);
        this.zones = ZONE_BOUNDARIES.map(z => ({ zoneName: z.name }));
      }
    });
  }

  // Validation State
  isValidating = false;
  verificationResult: any = null;

  onSubmit() {
    if (!this.locationGroup.get('zone')?.value) {
      alert('Please select a zone.');
      return;
    }

    this.isValidating = true; // Start validation animation

    const locationRaw = this.locationGroup.getRawValue();
    const finalZone = locationRaw.zone || (this.zones.length > 0 ? this.zones[0].zoneName : 'Unassigned');
    const formVal = this.detailsGroup.value;
    const finalCategory = formVal.category === 'Others' ? formVal.otherCategory : formVal.category;

    const data = {
      ...formVal,
      category: finalCategory,
      imageUrl: this.imageUrl,
      location: locationRaw,
      zone: finalZone
    };

    this.issueService.reportIssue(data).subscribe({
      next: (res: any) => {
        // Stop validating
        this.isValidating = false;

        // Capture Result from Backend Response
        this.verificationResult = {
          verified: res.systemVerified,
          priority: res.priority,
          remarks: res.verificationRemarks || 'System Verification Complete'
        };

        // Delay redirect slightly so user sees the "Success" badge
        setTimeout(() => {
          alert(`✅ Issue verified by system!\nPriority Assigned: ${this.verificationResult.priority}`);
          this.router.navigate(['/citizen/dashboard']);
        }, 1000);
      },
      error: (err) => {
        this.isValidating = false;
        console.error('Submission Failed:', err);
        const code = err.error?.code;
        if (code === 'DUPLICATE_REPORT') {
          alert('⚠️ Duplicate Issue Detected.\n\nIt seems you (or someone else) already reported this recently.');
        } else {
          alert('Failed to submit report. ' + (err.error?.message || 'Unknown Error'));
        }
      }
    });
  }
}
