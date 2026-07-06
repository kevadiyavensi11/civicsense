
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dashboard-scene">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="dashboard-container">
        <div class="glass-panel contact-header fade-in">
          <div class="hero-content">
            <div class="badge-pill">Contact Assistance</div>
            <h1>Get in Touch</h1>
            <p>Our support team is here to help you with any queries or system-related issues.</p>
          </div>
          <div class="hero-visual">
             <div class="floating-icon">
                 <mat-icon>support_agent</mat-icon>
             </div>
          </div>
        </div>

        <div class="contact-grid">
          <!-- Contact Info -->
          <div class="info-section">
            <div class="glass-panel info-card">
              <div class="icon-box blue"><mat-icon>alternate_email</mat-icon></div>
              <div class="info-data">
                <h4>Email Support</h4>
                <p>support&#64;govtech.org</p>
              </div>
            </div>

            <div class="glass-panel info-card">
              <div class="icon-box green"><mat-icon>phone_in_talk</mat-icon></div>
              <div class="info-data">
                <h4>Helpdesk Number</h4>
                <p>+91-XXXXXXXXXX</p>
              </div>
            </div>

            <div class="glass-panel info-card">
              <div class="icon-box orange"><mat-icon>location_on</mat-icon></div>
              <div class="info-data">
                <h4>Office Headquarters</h4>
                <p>Government IT Center, Sector 12, Gujarat</p>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="glass-panel form-section">
            <h3><mat-icon>send</mat-icon> Send a Message</h3>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <mat-form-field appearance="outline" class="col">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="name" placeholder="John Doe">
                  <mat-error *ngIf="contactForm.get('name')?.hasError('required')">Name is required</mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="col">
                  <mat-label>Email Address</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="john&#64;example.com">
                  <mat-error *ngIf="contactForm.get('email')?.hasError('required')">Email is required</mat-error>
                  <mat-error *ngIf="contactForm.get('email')?.hasError('email')">Invalid email address</mat-error>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Subject</mat-label>
                <input matInput formControlName="subject" placeholder="General Query">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Message</mat-label>
                <textarea matInput formControlName="message" rows="5" placeholder="How can we help you?"></textarea>
                <mat-error *ngIf="contactForm.get('message')?.hasError('required')">Message is required</mat-error>
                <mat-error *ngIf="contactForm.get('message')?.hasError('minlength')">Message must be at least 10 characters</mat-error>
              </mat-form-field>

              <button class="cta-btn-3d" type="submit" [disabled]="contactForm.invalid || isSubmitting">
                <mat-icon [class.spin]="isSubmitting">{{ isSubmitting ? 'sync' : 'send' }}</mat-icon> 
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-scene {
        min-height: 100vh;
        background: #f8fafc;
        position: relative;
        overflow: hidden;
        padding: 24px;
    }
    .glow-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; z-index: 0; animation: float 10s infinite; }
    .orb-1 { width: 300px; height: 300px; background: #60a5fa; top: -50px; left: -50px; }
    .orb-2 { width: 400px; height: 400px; background: #34d399; bottom: -100px; right: -100px; animation-delay: -5s; }
    @keyframes float { 0%{transform:translate(0,0)} 50%{transform:translate(30px,30px)} 100%{transform:translate(0,0)} }

    .dashboard-container { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

    .glass-panel {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: 24px;
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        padding: 32px;
        margin-bottom: 24px;
    }

    .contact-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(239, 246, 255,0.8), rgba(255, 255, 255, 0.4));
    }
    .hero-content { max-width: 700px; }
    .badge-pill { display: inline-block; padding: 6px 12px; background: #dbeafe; color: #2563eb; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 16px; }
    h1 { font-size: 2.5rem; color: #1e293b; margin-bottom: 12px; font-weight: 800; }
    p { color: #64748b; font-size: 1.1rem; line-height: 1.6; }

    .hero-visual { position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
    .floating-icon {
        width: 100px; height: 100px; background: white; border-radius: 24px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        animation: iconFloat 4s ease-in-out infinite;
    }
    .floating-icon mat-icon { font-size: 48px; width: 48px; height: 48px; color: #2563eb; }
    @keyframes iconFloat { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-15px) rotate(5deg)} }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .info-section { display: flex; flex-direction: column; gap: 16px; }
    .info-card { 
      padding: 24px !important; margin-bottom: 0 !important;
      display: flex; align-items: center; gap: 20px;
      transition: all 0.3s;
    }
    .info-card:hover { transform: translateX(8px); background: #ffffff; }

    .icon-box { 
      width: 50px; height: 50px; border-radius: 12px; 
      display: flex; align-items: center; justify-content: center; 
      color: white; flex-shrink: 0;
    }
    .blue { background: linear-gradient(135deg, #60a5fa, #2563eb); }
    .green { background: linear-gradient(135deg, #34d399, #10b981); }
    .orange { background: linear-gradient(135deg, #fbbf24, #d97706); }

    .info-data h4 { margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 700; }
    .info-data p { margin: 4px 0 0; font-size: 0.95rem; color: #64748b; }

    .form-section h3 {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1e293b;
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .form-section h3 mat-icon { color: #2563eb; }

    .form-row { display: flex; gap: 16px; }
    .col { flex: 1; }
    .full-width { width: 100%; }

    .cta-btn-3d {
        padding: 12px 32px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white; border: none; border-radius: 12px;
        font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;
        box-shadow: 0 4px 0 #1e40af, 0 8px 15px rgba(37,99,235,0.2);
        transition: transform 0.1s, opacity 0.2s;
        margin-top: 10px;
    }
    .cta-btn-3d:active { transform: translateY(4px); box-shadow: 0 0 0 #1e40af; }
    .cta-btn-3d:disabled { opacity: 0.7; cursor: not-allowed; }

    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .fade-in { animation: fadeIn 0.8s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 900px) {
      .contact-grid { grid-template-columns: 1fr; }
      .contact-header { flex-direction: column; text-align: center; }
      .hero-visual { margin-top: 24px; }
      .form-row { flex-direction: column; gap: 0; }
      h1 { font-size: 1.8rem; }
    }

    /* DARK THEME */
    :host-context(body.dark-theme) .dashboard-scene { background: #0f172a; }
    :host-context(body.dark-theme) .glass-panel { background: rgba(30,41,59,0.7); border-color: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) h1, 
    :host-context(body.dark-theme) .form-section h3,
    :host-context(body.dark-theme) .info-data h4 { color: #f1f5f9; }
    :host-context(body.dark-theme) p,
    :host-context(body.dark-theme) .info-data p { color: #94a3b8; }
    :host-context(body.dark-theme) .floating-icon { background: #1e293b; }
    :host-context(body.dark-theme) .floating-icon mat-icon { color: #60a5fa; }
    :host-context(body.dark-theme) .badge-pill { background: #1e293b; color: #60a5fa; }
    :host-context(body.dark-theme) .info-card:hover { background: #1e293b; }
  `]
})
export class ContactUsComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  isSubmitting = false;

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      this.http.post(`${environment.apiUrl}/contact/create`, this.contactForm.value)
        .subscribe({
          next: () => {
            this.snackBar.open('Message sent successfully!', 'Close', { duration: 5000 });
            this.contactForm.reset();
            this.isSubmitting = false;
          },
          error: (err: any) => {
            console.error('Contact error:', err);
            this.snackBar.open('Failed to send message. Please try again.', 'Close', { duration: 5000 });
            this.isSubmitting = false;
          }
        });
    }
  }
}
