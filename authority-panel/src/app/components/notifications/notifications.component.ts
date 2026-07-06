import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService, Notification } from '../../services/notification.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="page-container">
      <div class="max-w-4xl w-full">
        <h1 class="page-title">Notifications</h1>

        <mat-tab-group class="notification-tabs" animationDuration="0ms" (selectedTabChange)="onTabChange($event)">
            <!-- INBOX TAB -->
            <mat-tab label="Inbox">
                <div class="inbox-container">
                    <div *ngIf="notifications.length === 0" class="empty-state">
                        <mat-icon>notifications_off</mat-icon>
                        <p>No notifications yet.</p>
                    </div>

                    <mat-card *ngFor="let note of notifications" class="note-card" [class.unread]="!note.isRead">
                        <div class="note-header">
                            <span class="note-title">{{ note.title }}</span>
                            <span class="note-date">{{ note.createdAt | date:'medium' }}</span>
                        </div>
                        <p class="note-msg">{{ note.message }}</p>
                        <div class="note-footer">
                            <span class="sender">From: {{ note.sender?.role | titlecase }}</span>
                        </div>
                    </mat-card>
                </div>
            </mat-tab>

            <!-- SENT HISTORY TAB -->
            <mat-tab label="Sent History">
                <div class="inbox-container">
                    <div *ngIf="sentNotifications.length === 0" class="empty-state">
                        <mat-icon>outbox</mat-icon>
                        <p>No sent messages yet.</p>
                    </div>

                    <mat-card *ngFor="let note of sentNotifications" class="note-card">
                        <div class="note-header">
                            <span class="note-title">{{ note.title }}</span>
                            <span class="note-date">{{ note.createdAt | date:'medium' }}</span>
                        </div>
                        <p class="note-msg">{{ note.message }}</p>
                        <div class="note-footer">
                            <span class="recipient" *ngIf="note.recipient">To: {{ note.recipient.name || note.recipient.email }}</span>
                            <span class="recipient" *ngIf="note.recipientRole">To Group: {{ note.recipientRole | titlecase }}</span>
                        </div>
                    </mat-card>
                </div>
            </mat-tab>

            <!-- SEND TAB -->
            <mat-tab label="Send Notification">
                <mat-card class="compose-card">
                    <h3>Send Message to Citizen</h3>
                    <p class="hint-text">Use this form to send a direct notification to a citizen regarding their issues or other matters.</p>
                    
                    <form [formGroup]="sendForm" (ngSubmit)="sendNotification()">
                        <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Citizen Email</mat-label>
                            <input matInput formControlName="recipientEmail" type="email" placeholder="citizen@example.com">
                            <mat-error *ngIf="sendForm.get('recipientEmail')?.hasError('required')">Required</mat-error>
                            <mat-error *ngIf="sendForm.get('recipientEmail')?.hasError('email')">Invalid email</mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Title</mat-label>
                            <input matInput formControlName="title" placeholder="e.g., Issue Resolved">
                            <mat-error *ngIf="sendForm.get('title')?.hasError('required')">Required</mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Message</mat-label>
                            <textarea matInput formControlName="message" rows="4" placeholder="Type your message..."></textarea>
                            <mat-error *ngIf="sendForm.get('message')?.hasError('required')">Required</mat-error>
                        </mat-form-field>

                        <div class="actions">
                            <button mat-raised-button color="primary" type="submit" [disabled]="sendForm.invalid || sending">
                                <mat-icon *ngIf="!sending">send</mat-icon>
                                <span *ngIf="sending">Sending...</span>
                                <span *ngIf="!sending">Send Notification</span>
                            </button>
                        </div>
                    </form>
                </mat-card>
            </mat-tab>
        </mat-tab-group>
      </div>
    </div>
    `,
  styles: [`
        .page-container { padding: 32px; display: flex; justify-content: center; background: #f8fafc; min-height: 100vh; }
        .max-w-4xl { max-width: 800px; width: 100%; }
        .page-title { font-size: 1.8rem; font-weight: 600; color: #1e293b; margin-bottom: 24px; }
        .inbox-container { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; min-height: 300px; }
        .note-card { padding: 16px; border-left: 4px solid transparent; box-shadow: 0 1px 3px rgba(0,0,0,0.1); background: white; }
        .note-card.unread { border-left-color: #3b82f6; background: #f0f9ff; }
        .note-header { display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center; }
        .note-title { font-weight: 600; color: #0f172a; font-size: 1.1rem; }
        .note-date { font-size: 0.8rem; color: #64748b; }
        .note-msg { color: #334155; margin-bottom: 12px; line-height: 1.5; }
        .note-footer { display: flex; justify-content: flex-end; font-size: 0.75rem; color: #94a3b8; font-weight: 500; font-style: italic; }
        
        .compose-card { padding: 24px; margin-top: 16px; border-radius: 8px; }
        .compose-card h3 { margin-top: 0; color: #1e293b; }
        .hint-text { color: #64748b; font-size: 0.9rem; margin-bottom: 20px; }
        .full-width { width: 100%; margin-bottom: 8px; }
        .actions { display: flex; justify-content: flex-end; margin-top: 16px; }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; padding: 60px 0; }
        .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.3; }

        /* DARK THEME */
        :host-context(body.dark-theme) .page-container { background: #0f172a; }
        :host-context(body.dark-theme) .page-title { color: #f8fafc; }
        :host-context(body.dark-theme) .note-card { background: #1e293b; color: #f8fafc; } 
        :host-context(body.dark-theme) .note-card.unread { background: #1e293b; border-left-color: #60a5fa; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2); }
        :host-context(body.dark-theme) .note-title { color: #f1f5f9; }
        :host-context(body.dark-theme) .note-date { color: #94a3b8; }
        :host-context(body.dark-theme) .note-msg { color: #cbd5e1; }
        :host-context(body.dark-theme) .compose-card { background: #1e293b; border: 1px solid #334155; }
        :host-context(body.dark-theme) .compose-card h3 { color: #f8fafc; }
        :host-context(body.dark-theme) .hint-text { color: #94a3b8; }
        
        /* Dark Theme Form Inputs */
        :host-context(body.dark-theme) ::ng-deep .mdc-text-field--outlined { background-color: #0f172a !important; color: white !important; }
        :host-context(body.dark-theme) ::ng-deep .mat-mdc-input-element { color: white !important; }
        :host-context(body.dark-theme) ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__leading,
        :host-context(body.dark-theme) ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__notch,
        :host-context(body.dark-theme) ::ng-deep .mdc-text-field--outlined .mdc-notched-outline__trailing { border-color: #475569 !important; }
    `]
})
export class NotificationsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private snackBar = inject(MatSnackBar);

  notifications: any[] = [];
  sentNotifications: any[] = [];
  sendForm: FormGroup;
  sending = false;

  constructor() {
    this.sendForm = this.fb.group({
      recipientEmail: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  onTabChange(event: any) {
    if (event.index === 0) {
      this.loadNotifications();
    } else if (event.index === 1) {
      this.loadSentHistory();
    }
  }

  loadNotifications() {
    this.notificationService.getMyNotifications().subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error('Failed to load notifications', err)
    });
  }

  loadSentHistory() {
    this.notificationService.getSentNotifications().subscribe({
      next: (data) => this.sentNotifications = data,
      error: (err) => console.error('Failed to load sent history', err)
    });
  }

  sendNotification() {
    if (this.sendForm.invalid) return;

    this.sending = true;
    this.notificationService.sendNotification(this.sendForm.value).subscribe({
      next: () => {
        this.snackBar.open('Notification sent successfully', 'Close', { duration: 3000 });
        this.sendForm.reset();
        this.sending = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(err.error?.message || 'Failed to send', 'Close', { duration: 3000 });
        this.sending = false;
      }
    });
  }
}
