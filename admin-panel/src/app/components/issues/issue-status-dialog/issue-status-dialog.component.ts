import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-issue-status-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule
    ],
    template: `
    <h2 mat-dialog-title>Update Issue Status</h2>
    <form [formGroup]="statusForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <p>Updating status for: <strong>{{data.title}}</strong></p>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Open">Open</mat-option>
            <mat-option value="In Progress">In Progress</mat-option>
            <mat-option value="Resolved">Resolved</mat-option>
            <mat-option value="Rejected">Rejected</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Remarks / Resolution Notes</mat-label>
          <textarea matInput formControlName="remarks" rows="3" placeholder="Explain the action taken..."></textarea>
          <mat-error *ngIf="statusForm.get('remarks')?.hasError('required')">Remarks are required</mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="statusForm.invalid || isSubmitting">
          {{isSubmitting ? 'Updating...' : 'Update Status'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
    styles: [`
    .full-width { width: 100%; margin-bottom: 16px; }
    mat-dialog-content { min-width: 400px; }
  `]
})
export class IssueStatusDialogComponent {
    statusForm;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<IssueStatusDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, currentStatus: string }
    ) {
        this.statusForm = this.fb.group({
            status: [data.currentStatus || 'Open', Validators.required],
            remarks: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.statusForm.valid) {
            this.isSubmitting = true;
            this.dialogRef.close(this.statusForm.value);
        }
    }
}
