
import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { ContactService } from '../../services/contact.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-contact-messages',
    standalone: true,
    imports: [
        CommonModule, FormsModule, MatTableModule, MatIconModule,
        MatButtonModule, MatFormFieldModule, MatInputModule,
        MatDialogModule, MatSnackBarModule, RouterModule, MatBadgeModule
    ],
    template: `
    <div class="contact-content fade-in">
        <div class="search-bar card-3d">
            <mat-form-field appearance="outline">
                <mat-label>Search messages</mat-label>
                <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Search by name or email">
                <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="loadMessages()" [disabled]="isLoading">
                <mat-icon [class.spin]="isLoading">refresh</mat-icon> Refresh
            </button>
        </div>

        <div class="table-container card-3d">
            <div *ngIf="isLoading" class="loading-overlay">
                <mat-icon class="spin">sync</mat-icon>
                <span>Loading messages...</span>
            </div>

            <table mat-table [dataSource]="filteredMessages" *ngIf="!isLoading && filteredMessages.length > 0">
                <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef> # </th>
                    <td mat-cell *matCellDef="let i = index"> {{i + 1}} </td>
                </ng-container>

                <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef> Name </th>
                    <td mat-cell *matCellDef="let msg"> {{msg.name}} </td>
                </ng-container>

                <ng-container matColumnDef="email">
                    <th mat-header-cell *matHeaderCellDef> Email </th>
                    <td mat-cell *matCellDef="let msg"> {{msg.email}} </td>
                </ng-container>

                <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef> Date </th>
                    <td mat-cell *matCellDef="let msg"> {{msg.createdAt | date:'medium'}} </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef> Actions </th>
                    <td mat-cell *matCellDef="let msg">
                        <button mat-icon-button color="primary" (click)="viewMessage(msg)" matTooltip="View Message">
                            <mat-icon>visibility</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="deleteMessage(msg._id)" matTooltip="Delete">
                            <mat-icon>delete</mat-icon>
                        </button>
                    </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="!isLoading && filteredMessages.length === 0" class="empty-state">
                <mat-icon>mail_outline</mat-icon>
                <p>No contact messages found.</p>
            </div>
        </div>
    </div>
    `,
    styles: [`
    .contact-content { padding: 32px; display: flex; flex-direction: column; gap: 24px; max-width: 1400px; margin: 0 auto; }
    .card-3d { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .search-bar { padding: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
    .search-bar mat-form-field { flex: 1; margin-bottom: -1.25em; }
    .table-container { position: relative; overflow: hidden; min-height: 400px; }
    table { width: 100%; }
    .loading-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255,255,255,0.8); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
    .empty-state { padding: 80px 0; text-align: center; color: #64748b; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    /* DARK THEME */
    :host-context(body.dark-theme) .card-3d { background: #1e293b; border-color: #334155; }
    :host-context(body.dark-theme) .loading-overlay { background: rgba(15, 23, 42, 0.8); color: white; }
    :host-context(body.dark-theme) th { color: #94a3b8; border-bottom-color: #334155; }
    :host-context(body.dark-theme) td { color: #f1f5f9; border-bottom-color: #334155; }
    :host-context(body.dark-theme) .empty-state { color: #94a3b8; }
    `]
})
export class ContactMessagesComponent implements OnInit {
    contactService = inject(ContactService);
    dialog = inject(MatDialog);
    snackBar = inject(MatSnackBar);
    cdr = inject(ChangeDetectorRef);
    platformId = inject(PLATFORM_ID);

    messages: any[] = [];
    filteredMessages: any[] = [];
    isLoading = false;
    searchTerm = '';
    displayedColumns: string[] = ['id', 'name', 'email', 'date', 'actions'];

    ngOnInit() {
        this.loadMessages();
    }

    loadMessages() {
        this.isLoading = true;
        this.contactService.getMessages().subscribe({
            next: (data) => {
                this.messages = data;
                this.applyFilter();
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('Fetch messages error:', err);
                this.isLoading = false;
                this.snackBar.open('Failed to load messages', 'Close', { duration: 3000 });
                this.cdr.markForCheck();
            }
        });
    }

    applyFilter() {
        if (!this.searchTerm) {
            this.filteredMessages = [...this.messages];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredMessages = this.messages.filter(m =>
                m.name?.toLowerCase().includes(term) ||
                m.email?.toLowerCase().includes(term)
            );
        }
    }

    viewMessage(message: any) {
        this.dialog.open(MessageDetailDialog, {
            data: message,
            width: '600px',
            panelClass: 'glass-dialog'
        });
    }

    deleteMessage(id: string) {
        if (confirm('Are you sure you want to delete this message?')) {
            this.contactService.deleteMessage(id).subscribe({
                next: () => {
                    this.snackBar.open('Message deleted', 'Close', { duration: 3000 });
                    this.loadMessages();
                },
                error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 })
            });
        }
    }
}

@Component({
    selector: 'message-detail-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>Message from {{data.name}}</h2>
    <mat-dialog-content>
      <div style="padding: 10px 0;">
        <p><strong>Email:</strong> {{data.email}}</p>
        <p><strong>Subject:</strong> {{data.subject || 'No Subject'}}</p>
        <p><strong>Date:</strong> {{data.createdAt | date:'medium'}}</p>
        <hr style="opacity: 0.1; margin: 16px 0;">
        <p style="white-space: pre-wrap; line-height: 1.6; color: #334155;" class="msg-text">{{data.message}}</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
    styles: [`
    :host-context(body.dark-theme) .msg-text { color: #cbd5e1 !important; }
    h2 { font-weight: 800; color: #1e293b; }
    :host-context(body.dark-theme) h2 { color: #f1f5f9; }
    :host-context(body.dark-theme) p { color: #94a3b8; }
    :host-context(body.dark-theme) strong { color: #f1f5f9; }
  `]
})
export class MessageDetailDialog {
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
}
