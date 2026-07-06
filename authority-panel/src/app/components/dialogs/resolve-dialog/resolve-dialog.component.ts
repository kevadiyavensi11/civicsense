import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileUploadService } from '../../../services/file-upload.service';

@Component({
    selector: 'app-resolve-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressBarModule,
        FormsModule
    ],
    template: `
    <h2 mat-dialog-title>Resolve Issue</h2>
    <mat-dialog-content>
      <p class="intro-text">Provide verification proof that this issue has been resolved.</p>
      
      <!-- Image Upload Area -->
      <div class="upload-area" (click)="fileInput.click()" [class.has-image]="imageUrl">
          <input #fileInput type="file" (change)="onFileSelected($event)" style="display:none" accept="image/*">
          
          <div *ngIf="!imageUrl && !isUploading" class="placeholder">
               <mat-icon>add_a_photo</mat-icon>
               <span>Upload Resolution Proof</span>
          </div>

          <div *ngIf="isUploading" class="uploading">
               <mat-progress-bar mode="indeterminate"></mat-progress-bar>
               <span>Uploading...</span>
          </div>

          <img *ngIf="imageUrl && !isUploading" [src]="imageUrl" class="preview-img">
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Resolution Notes</mat-label>
        <textarea matInput [(ngModel)]="remarks" rows="3" placeholder="Describe how the issue was solved..."></textarea>
      </mat-form-field>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!imageUrl || isUploading" (click)="submit()">
          Mark Resolved
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .intro-text { color: #64748b; margin-bottom: 20px; }
    .full-width { width: 100%; margin-top: 16px; }
    
    .upload-area {
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background: #f8fafc;
        transition: all 0.2s;
    }
    .upload-area:hover { background: #f1f5f9; border-color: #94a3b8; }
    .upload-area.has-image { border-style: solid; border-color: #cbd5e1; padding: 0; }
    
    .placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #64748b; }
    .placeholder mat-icon { font-size: 32px; width: 32px; height: 32px; }
    
    .preview-img { width: 100%; height: 100%; object-fit: cover; }
    
    .uploading { width: 80%; text-align: center; }
  `]
})
export class ResolveDialogComponent {
    dialogRef = inject(MatDialogRef<ResolveDialogComponent>);
    uploadService = inject(FileUploadService);

    imageUrl: string | null = null;
    remarks: string = '';
    isUploading = false;

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.isUploading = true;
            this.uploadService.upload(file).subscribe({
                next: (res) => {
                    this.imageUrl = res.url; // Use 'url' property from response
                    this.isUploading = false;
                },
                error: () => {
                    this.isUploading = false;
                    alert('Upload failed');
                }
            });
        }
    }

    submit() {
        this.dialogRef.close({ imageUrl: this.imageUrl, remarks: this.remarks });
    }
}
