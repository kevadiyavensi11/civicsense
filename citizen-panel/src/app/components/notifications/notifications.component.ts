import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
    selector: 'app-citizen-notifications',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
    template: `
    <div class="page-container">
        <div class="header">
            <h1>Notifications</h1>
            <!-- <button mat-stroked-button color="primary">Mark all as read</button> -->
        </div>

        <div *ngIf="notifications.length === 0" class="empty-state">
            <mat-icon>notifications_off</mat-icon>
            <p>You have no new notifications.</p>
        </div>

        <div class="notes-list">
            <mat-card *ngFor="let note of notifications" class="note-card" [class.unread]="!note.isRead">
                <div class="icon-area">
                    <mat-icon [class.info]="note.type==='info'" [class.success]="note.type==='success'" [class.alert]="note.type==='alert'">
                        {{ getIcon(note.type) }}
                    </mat-icon>
                </div>
                <div class="content-area">
                    <div class="note-header">
                        <span class="title">{{ note.title }}</span>
                        <span class="time">{{ note.createdAt | date:'short' }}</span>
                    </div>
                    <p class="message">{{ note.message }}</p>
                    <div class="meta">
                        <span>From: {{ note.sender?.role | titlecase }}</span>
                    </div>
                </div>
            </mat-card>
        </div>
    </div>
    `,
    styles: [`
        .page-container { padding: 24px; max-width: 800px; margin: 0 auto; min-height: 80vh; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        h1 { margin: 0; color: #1e293b; font-size: 2.2rem; font-weight: 800; }
        
        .notes-list { display: flex; flex-direction: column; gap: 16px; }
        .note-card { 
            display: flex; flex-direction: row; padding: 20px; 
            background: white; border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            transition: all 0.2s;
        }
        .note-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .note-card.unread { background: #f0f9ff; border-left: 4px solid #3b82f6; }
        
        .icon-area { padding-right: 20px; display: flex; align-items: flex-start; }
        .icon-area mat-icon { font-size: 32px; width: 32px; height: 32px; color: #64748b; }
        .icon-area mat-icon.success { color: #10b981; }
        .icon-area mat-icon.alert { color: #ef4444; }
        
        .content-area { flex: 1; }
        .note-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .title { font-weight: 700; color: #0f172a; font-size: 1.1rem; }
        .time { font-size: 0.85rem; color: #94a3b8; font-weight: 500; }
        .message { color: #334155; margin: 0 0 12px; line-height: 1.6; font-size: 0.95rem; }
        .meta { font-size: 0.8rem; color: #64748b; font-weight: 600; opacity: 0.8; }
        
        .empty-state { text-align: center; color: #94a3b8; padding: 80px 0; }
        .empty-state mat-icon { font-size: 80px; width: 80px; height: 80px; margin-bottom: 24px; opacity: 0.2; }

        /* DARK THEME (Fixed Specificity) */
        :host-context(body.dark-theme) h1 { color: #f1f5f9 !important; }
        :host-context(body.dark-theme) .note-card { 
            background: #1e293b !important; 
            border-color: #334155; 
            color: #f1f5f9;
        }
        :host-context(body.dark-theme) .note-card.unread { 
            background: rgba(37, 99, 235, 0.1) !important; 
            border-left-color: #3b82f6; 
        }
        :host-context(body.dark-theme) .title { color: #f8fafc !important; }
        :host-context(body.dark-theme) .message { color: #cbd5e1; }
        :host-context(body.dark-theme) .meta { color: #94a3b8; }
        :host-context(body.dark-theme) .icon-area mat-icon:not(.success):not(.alert) { color: #475569; }
    `]
})
export class NotificationsComponent implements OnInit {
    notificationService = inject(NotificationService);
    notifications: Notification[] = [];

    ngOnInit() {
        this.notificationService.getMyNotifications().subscribe({
            next: (data) => this.notifications = data,
            error: (err) => console.error(err)
        });
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return 'check_circle';
            case 'alert': return 'error';
            case 'warning': return 'warning';
            default: return 'info';
        }
    }
}
