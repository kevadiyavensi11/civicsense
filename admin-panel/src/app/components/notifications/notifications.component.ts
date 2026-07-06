
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
    selector: 'app-admin-notifications',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatRadioModule,
        MatTabsModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="notifications-content fade-in">
        <div class="max-w-4xl w-full">
            <mat-tab-group class="notification-tabs custom-tabs" animationDuration="200ms" (selectedTabChange)="onTabChange($event)">
                <!-- INBOX TAB -->
                <mat-tab>
                    <ng-template mat-tab-label>
                        <mat-icon>inbox</mat-icon>
                        <span>Inbox</span>
                    </ng-template>
                    <div class="tab-content inbox-container">
                        <div *ngIf="notifications.length === 0" class="empty-state">
                            <div class="icon-circle">
                                <mat-icon>notifications_off</mat-icon>
                            </div>
                            <p>No notifications yet.</p>
                        </div>

                        <mat-card *ngFor="let note of notifications" class="note-card card-3d" [class.unread]="!note.isRead">
                            <div class="note-header">
                                <span class="note-title">{{ note.title }}</span>
                                <span class="note-date">{{ note.createdAt | date:'medium' }}</span>
                            </div>
                            <p class="note-msg">{{ note.message }}</p>
                            <div class="note-footer">
                                <span class="sender-tag">
                                    <mat-icon>person</mat-icon>
                                    Sent By: {{ note.sender?.role | titlecase }}
                                </span>
                            </div>
                        </mat-card>
                    </div>
                </mat-tab>

                <!-- SENT TAB -->
                <mat-tab>
                    <ng-template mat-tab-label>
                        <mat-icon>send</mat-icon>
                        <span>Sent History</span>
                    </ng-template>
                    <div class="tab-content inbox-container">
                        <div *ngIf="sentNotifications.length === 0" class="empty-state">
                            <div class="icon-circle">
                                <mat-icon>outbox</mat-icon>
                            </div>
                            <p>No sent messages yet.</p>
                        </div>

                        <mat-card *ngFor="let note of sentNotifications" class="note-card card-3d">
                            <div class="note-header">
                                <span class="note-title">{{ note.title }}</span>
                                <span class="note-date">{{ note.createdAt | date:'medium' }}</span>
                            </div>
                            <p class="note-msg">{{ note.message }}</p>
                            <div class="note-footer">
                                <span class="recipient-tag" *ngIf="note.recipient">
                                    <mat-icon>alternate_email</mat-icon>
                                    To: {{ note.recipient.email }}
                                </span>
                                <span class="recipient-tag" *ngIf="note.recipientRole">
                                    <mat-icon>group</mat-icon>
                                    To Group: {{ note.recipientRole | titlecase }}
                                </span>
                            </div>
                        </mat-card>
                    </div>
                </mat-tab>

                <!-- COMPOSE TAB -->
                <mat-tab>
                    <ng-template mat-tab-label>
                        <mat-icon>add_alert</mat-icon>
                        <span>Send Notification</span>
                    </ng-template>
                    <div class="tab-content">
                        <mat-card class="compose-card card-3d">
                            <div class="form-header">
                                <h3>Compose Message</h3>
                                <p>Broadcast a new system alert or personal message.</p>
                            </div>
                            
                            <form [formGroup]="sendForm" (ngSubmit)="sendNotification()" class="form-grid">
                                
                                <div class="type-selector-box">
                                    <label class="field-label">Delivery Method</label>
                                    <mat-radio-group formControlName="recipientType" color="primary" class="fancy-radio-group">
                                        <mat-radio-button value="email">
                                            <div class="radio-content">
                                                <mat-icon>person</mat-icon>
                                                <span>Personal</span>
                                            </div>
                                        </mat-radio-button>
                                        <mat-radio-button value="role">
                                            <div class="radio-content">
                                                <mat-icon>groups</mat-icon>
                                                <span>Mass Broadcast</span>
                                            </div>
                                        </mat-radio-button>
                                    </mat-radio-group>
                                </div>

                                <div class="input-section fade-in" *ngIf="sendForm.get('recipientType')?.value === 'email'">
                                    <mat-form-field appearance="outline" class="full-width">
                                        <mat-label>Recipient's Email</mat-label>
                                        <input matInput formControlName="recipientEmail" placeholder="e.g. citizen@civicsense.gov">
                                        <mat-icon matPrefix>alternate_email</mat-icon>
                                    </mat-form-field>
                                </div>

                                <div class="input-section fade-in" *ngIf="sendForm.get('recipientType')?.value === 'role'">
                                    <mat-form-field appearance="outline" class="full-width">
                                        <mat-label>Target Audience</mat-label>
                                        <mat-select formControlName="recipientRole">
                                            <mat-option value="citizen">Citizens</mat-option>
                                            <mat-option value="authority">Authorities</mat-option>
                                            <mat-option value="all">Everyone</mat-option>
                                        </mat-select>
                                        <mat-icon matPrefix>groups</mat-icon>
                                    </mat-form-field>
                                </div>

                                <mat-form-field appearance="outline" class="full-width">
                                    <mat-label>Subject</mat-label>
                                    <input matInput formControlName="title" placeholder="e.g. System Update">
                                    <mat-icon matPrefix>subtitles</mat-icon>
                                </mat-form-field>

                                <mat-form-field appearance="outline" class="full-width">
                                    <mat-label>Message Content</mat-label>
                                    <textarea matInput formControlName="message" rows="5" placeholder="Enter message here..."></textarea>
                                    <mat-icon matPrefix>message</mat-icon>
                                </mat-form-field>

                                <div class="actions">
                                    <button mat-flat-button class="submit-btn" type="submit" [disabled]="sendForm.invalid || sending">
                                        <mat-icon *ngIf="!sending">send</mat-icon>
                                        <mat-spinner diameter="20" *ngIf="sending" color="accent" style="margin-right: 8px"></mat-spinner>
                                        {{ sending ? 'Sending...' : 'Dispatch Message' }}
                                    </button>
                                </div>
                            </form>
                        </mat-card>
                    </div>
                </mat-tab>
            </mat-tab-group>
        </div>
    </div>
    `,
    styles: [`
        .notifications-content { padding: 32px; display: flex; justify-content: center; }
        .max-w-4xl { max-width: 900px; width: 100%; }
        .card-3d { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .tab-content { padding-top: 24px; }
        
        ::ng-deep .custom-tabs .mat-mdc-tab-header { background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-light); padding: 4px; }
        ::ng-deep .custom-tabs .mat-mdc-tab.mdc-tab--active { background: rgba(37, 99, 235, 0.1); border-radius: 8px; }
        ::ng-deep .custom-tabs .mat-mdc-tab .mdc-tab__text-label { color: var(--text-secondary); font-weight: 700; }
        ::ng-deep .custom-tabs .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label { color: var(--secondary); }
        ::ng-deep .custom-tabs .mat-mdc-tab-labels mat-icon { margin-right: 8px; font-size: 20px; }

        .inbox-container { display: flex; flex-direction: column; gap: 16px; min-height: 400px; }
        .note-card { padding: 24px; border-left: 6px solid #e2e8f0; transition: transform 0.2s; }
        .note-card.unread { border-left-color: #2563eb; background: #f8fafc; }
        .note-card:hover { transform: translateX(8px); }
        .note-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .note-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
        .note-date { font-size: 0.85rem; color: #64748b; }
        .note-msg { color: #475569; line-height: 1.6; }
        .note-footer { display: flex; justify-content: flex-end; margin-top: 12px; }
        .sender-tag, .recipient-tag { font-size: 0.8rem; font-weight: 600; color: #64748b; display: flex; align-items: center; gap: 6px; background: #f1f5f9; padding: 4px 12px; border-radius: 20px; }

        .compose-card { padding: 32px; background: var(--bg-card); }
        .form-header { margin-bottom: 24px; }
        .form-header h3 { margin: 0; color: var(--text-primary); font-weight: 800; font-size: 1.25rem; }
        .form-header p { margin: 4px 0 0; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; }
        .field-label { display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .type-selector-box { background: var(--bg-surface-alt); padding: 20px; border-radius: 14px; margin-bottom: 24px; border: 1px solid var(--border-light); }
        .fancy-radio-group { display: flex; gap: 24px; }
        .radio-content { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.9rem; color: var(--text-primary); }
        ::ng-deep .mdc-radio__outer-circle { border-color: var(--text-muted) !important; }
        
        .full-width { width: 100%; }
        .actions { display: flex; justify-content: flex-end; }
        .submit-btn { padding: 12px 24px; height: 50px; background: #2563eb; color: white; border-radius: 12px; font-weight: 600; }
        
        .empty-state { padding: 80px 0; text-align: center; color: #64748b; }
        .icon-circle { width: 64px; height: 64px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Fix for Transparent/Overlapping Select Dropdown */
        ::ng-deep .mat-mdc-select-panel {
            background-color: white !important;
            border-radius: 12px !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
            padding: 4px 0 !important;
            margin-top: 4px !important;
        }

        ::ng-deep .mat-mdc-option {
            color: #1e293b !important;
        }

        /* DARK THEME */
        :host-context(body.dark-theme) .card-3d { background: #1e293b; border-color: #334155; }
        :host-context(body.dark-theme) .note-title,
        :host-context(body.dark-theme) .form-header h3,
        :host-context(body.dark-theme) .field-label { color: white !important; }
        :host-context(body.dark-theme) .form-header p { color: #94A3B8 !important; }
        :host-context(body.dark-theme) .note-msg,
        :host-context(body.dark-theme) .note-date { color: #94a3b8; }
        :host-context(body.dark-theme) .type-selector-box,
        :host-context(body.dark-theme) .icon-circle { background: #0f172a; }
        :host-context(body.dark-theme) .note-card.unread { background: rgba(37, 99, 235, 0.1); }
        :host-context(body.dark-theme) ::ng-deep .mat-mdc-select-panel {
            background-color: #1e293b !important;
            border-color: #475569 !important;
        }
        :host-context(body.dark-theme) ::ng-deep .mat-mdc-option {
            color: #f1f5f9 !important;
        }
        :host-context(body.dark-theme) ::ng-deep .mdc-form-field, 
        :host-context(body.dark-theme) ::ng-deep .mdc-label,
        :host-context(body.dark-theme) .radio-content span { color: white !important; }
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
            recipientType: ['email', Validators.required],
            recipientEmail: [''],
            recipientRole: [''],
            title: ['', Validators.required],
            message: ['', Validators.required]
        });

        this.sendForm.get('recipientType')?.valueChanges.subscribe(type => {
            if (type === 'email') {
                this.sendForm.get('recipientEmail')?.setValidators([Validators.required, Validators.email]);
                this.sendForm.get('recipientRole')?.clearValidators();
            } else {
                this.sendForm.get('recipientRole')?.setValidators([Validators.required]);
                this.sendForm.get('recipientEmail')?.clearValidators();
            }
            this.sendForm.get('recipientEmail')?.updateValueAndValidity();
            this.sendForm.get('recipientRole')?.updateValueAndValidity();
        });
    }

    ngOnInit() {
        this.loadNotifications();
    }

    onTabChange(event: any) {
        if (event.index === 0) this.loadNotifications();
        else if (event.index === 1) this.loadSentHistory();
    }

    loadNotifications() {
        this.notificationService.getMyNotifications().subscribe(data => this.notifications = data);
    }

    loadSentHistory() {
        this.notificationService.getSentNotifications().subscribe(data => this.sentNotifications = data);
    }

    sendNotification() {
        if (this.sendForm.invalid) return;
        this.sending = true;
        const formVal = this.sendForm.value;
        const data: any = { title: formVal.title, message: formVal.message, type: 'info' };

        if (formVal.recipientType === 'email') data.recipientEmail = formVal.recipientEmail;
        else data.recipientRole = formVal.recipientRole;

        this.notificationService.sendNotification(data).subscribe({
            next: () => {
                this.snackBar.open('Notification sent', 'Close', { duration: 3000 });
                this.sendForm.reset({ recipientType: 'email' });
                this.sending = false;
            },
            error: (err) => {
                this.snackBar.open(err.error?.message || 'Failed to send', 'Close', { duration: 3000 });
                this.sending = false;
            }
        });
    }
}
