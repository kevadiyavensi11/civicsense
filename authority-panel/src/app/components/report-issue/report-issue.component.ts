
import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatIconModule,
    MatStepperModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>Report New Issue</h1>
        <p>Complete the form below to alert local authorities.</p>
      </div>

      <mat-card class="form-card">
        <mat-stepper [linear]="true" #stepper>
            
            <!-- STEP 1 -->
            <mat-step [stepControl]="detailsGroup">
                <form [formGroup]="detailsGroup">
                    <ng-template matStepLabel>Details</ng-template>
                    
                    <div class="row">
                        <mat-form-field appearance="outline" class="col">
                            <mat-label>Issue Title</mat-label>
                            <input matInput formControlName="title" placeholder="Brief summary">
                        </mat-form-field>
                        
                        <mat-form-field appearance="outline" class="col">
                            <mat-label>Category</mat-label>
                            <mat-select formControlName="category">
                                <mat-option value="Pothole">Others</mat-option>
                                <mat-option value="Garbage">Garbage</mat-option>
                                <mat-option value="Streetlight">Streetlights</mat-option>
                                <mat-option value="Water">Water Leakage</mat-option>
                            </mat-select>
                        </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" style="width:100%">
                        <mat-label>Description</mat-label>
                        <textarea matInput formControlName="description" rows="4"></textarea>
                    </mat-form-field>

                    <div class="actions">
                        <button mat-flat-button color="primary" matStepperNext>Next</button>
                    </div>
                </form>
            </mat-step>

            <!-- STEP 2 -->
            <mat-step [stepControl]="mediaGroup">
                <form [formGroup]="mediaGroup">
                    <ng-template matStepLabel>Photo</ng-template>
                    
                    <div class="upload-area" (click)="fileInput.click()">
                        <input #fileInput type="file" (change)="onFileSelected($event)" style="display:none">
                        
                        <div *ngIf="!previewUrl" class="placeholder">
                            <mat-icon>cloud_upload</mat-icon>
                            <span>Click to upload image</span>
                        </div>
                        
                        <img *ngIf="previewUrl" [src]="previewUrl" style="max-height: 200px">
                    </div>

                    <div class="actions">
                       <button mat-button matStepperPrevious>Back</button>
                       <button mat-flat-button color="primary" matStepperNext [disabled]="!imageUrl">Next</button>
                    </div>
                </form>
            </mat-step>

            <!-- STEP 3 -->
            <mat-step [stepControl]="locationGroup">
                <form [formGroup]="locationGroup">
                    <ng-template matStepLabel>Location</ng-template>
                    
                    <div class="loc-panel">
                        <p>Coordinates: {{ locationGroup.value.lat ? locationGroup.value.lat + ', ' + locationGroup.value.lng : 'Not set' }}</p>
                        <button type="button" mat-stroked-button (click)="getLocation()">Get Current Location</button>
                    </div>

                    <div class="actions">
                       <button mat-button matStepperPrevious>Back</button>
                       <button mat-flat-button color="primary" matStepperNext>Next</button>
                    </div>
                </form>
            </mat-step>

            <!-- FINAL -->
            <mat-step>
                <ng-template matStepLabel>Confirm</ng-template>
                <p>Please review your details before submitting.</p>
                <div class="actions">
                    <button mat-button matStepperPrevious>Back</button>
                    <button mat-raised-button color="primary" (click)="onSubmit()">Submit Report</button>
                </div>
            </mat-step>

        </mat-stepper>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; }
    .form-header { margin-bottom: 24px; text-align: center; }
    .row { display: flex; gap: 16px; }
    .col { flex: 1; }
    
    .upload-area {
        border: 2px dashed #e2e8f0;
        padding: 40px;
        text-align: center;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 24px;
    }
    .placeholder { display: flex; flex-direction: column; align-items: center; color: #64748b; }
    
    .actions { margin-top: 16px; display: flex; justify-content: flex-end; gap: 12px; }
    
    .loc-panel { 
        background: #f8fafc; 
        padding: 24px; 
        border-radius: 8px; 
        text-align: center;
        margin-bottom: 24px;
    }
  `]
})
export class ReportIssueComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  issueService = inject(IssueService);
  uploadService = inject(FileUploadService);

  detailsGroup = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required]
  });
  mediaGroup = this.fb.group({ imageUrl: ['', Validators.required] });
  locationGroup = this.fb.group({ lat: [0], lng: [0], address: [''] });

  previewUrl: string | null = null;
  imageUrl: string | null = null;

  getLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
      this.locationGroup.patchValue({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.previewUrl = URL.createObjectURL(file);
      this.uploadService.upload(file).subscribe(res => {
        this.imageUrl = res.url;
        this.mediaGroup.patchValue({ imageUrl: res.url });
      });
    }
  }

  onSubmit() {
    const data = { ...this.detailsGroup.value, ...this.mediaGroup.value, location: this.locationGroup.value };
    this.issueService.reportIssue(data).subscribe(() => this.router.navigate(['/citizen/dashboard']));
  }
}
