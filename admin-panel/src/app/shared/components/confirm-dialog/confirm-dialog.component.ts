
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="confirm-dialog card-3d">
        <div class="icon-area" [ngClass]="data.type || 'warn'">
            <mat-icon>{{data.icon || 'warning'}}</mat-icon>
        </div>
        <h2>{{data.title}}</h2>
        <p>{{data.message}}</p>
        
        <div class="dialog-actions">
            <button mat-button (click)="dialogRef.close(false)">Cancel</button>
            <button mat-flat-button [color]="data.type === 'info' ? 'primary' : 'warn'" (click)="dialogRef.close(true)">
                {{data.confirmText || 'Confirm'}}
            </button>
        </div>
    </div>
  `,
    styles: [`
    .confirm-dialog {
        padding: 32px;
        text-align: center;
        background: var(--bg-surface);
        border: 1px solid var(--border-light);
    }
    .icon-area {
        width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 24px;
        display: flex; align-items: center; justify-content: center;
    }
    .icon-area mat-icon { font-size: 32px; width: 32px; height: 32px; }
    
    .icon-area.warn { background: rgba(244, 63, 94, 0.1); color: #f43f5e; box-shadow: 0 0 20px rgba(244, 63, 94, 0.2); }
    .icon-area.info { background: rgba(6, 182, 212, 0.1); color: #06b6d4; box-shadow: 0 0 20px rgba(6, 182, 212, 0.2); }
    
    h2 { font-size: 1.5rem; margin-bottom: 8px; color: var(--text-primary); }
    p { color: var(--text-secondary); margin-bottom: 32px; line-height: 1.5; }
    
    .dialog-actions { display: flex; gap: 16px; justify-content: center; }
  `]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, type?: 'warn' | 'info', icon?: string, confirmText?: string }
    ) { }
}
