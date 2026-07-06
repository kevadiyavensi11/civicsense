
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    template: `
    <div class="dashboard-scene">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="dashboard-container">
        <div class="glass-panel info-header fade-in">
          <div class="hero-content">
            <div class="badge-pill">About the System</div>
            <h1>Civic Issue Reporting & Governance System</h1>
            <p>Empowering citizens to build smarter, safer, and more efficient cities through technology-driven governance.</p>
          </div>
          <div class="hero-visual">
             <div class="floating-icon">
                 <mat-icon>info</mat-icon>
             </div>
          </div>
        </div>

        <div class="content-grid">
          <!-- Description & Purpose -->
          <div class="glass-panel section-card">
            <h3><mat-icon>description</mat-icon> Project Overview</h3>
            <p>
              The Civic Issue Reporting System is a digital bridge between citizens and local government authorities. 
              Our mission is to streamline the process of reporting, tracking, and resolving public infrastructure 
              issues such as potholes, non-functional streetlights, and sanitation problems.
            </p>
            <p>
              By leveraging geo-spatial technology and automated verified workflows, we ensure that every report 
              is directed to the correct department with the right priority level, reducing administrative delays 
              and increasing accountability.
            </p>
          </div>

          <!-- Benefits -->
          <div class="glass-panel section-card">
            <h3><mat-icon>auto_awesome</mat-icon> Key Benefits</h3>
            <ul class="benefit-list">
              <li>
                <mat-icon class="check">check_circle</mat-icon>
                <span><strong>Real-Time Tracking:</strong> Monitor the status of your reports from submission to resolution.</span>
              </li>
              <li>
                <mat-icon class="check">check_circle</mat-icon>
                <span><strong>Geo-Tagged Verification:</strong> Automated location tagging ensures precise identification of issues.</span>
              </li>
              <li>
                <mat-icon class="check">check_circle</mat-icon>
                <span><strong>Priority-Based Action:</strong> System-assigned priority levels ensure critical issues are addressed first.</span>
              </li>
              <li>
                <mat-icon class="check">check_circle</mat-icon>
                <span><strong>Direct Accountability:</strong> Direct routing to zone-specific authorities for faster response.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Workflow Summary -->
        <div class="glass-panel workflow-panel section-card">
          <h3><mat-icon>alt_route</mat-icon> How It Works (Workflow)</h3>
          <div class="workflow-steps">
            <div class="step-card">
              <div class="step-num">1</div>
              <h4>Capture & Report</h4>
              <p>Take a photo of the issue and submit it with a geo-tag on our portal.</p>
            </div>
            <div class="step-card">
              <div class="step-num">2</div>
              <h4>System Audit</h4>
              <p>The system validates the report, checks for duplicates, and assigns priority.</p>
            </div>
            <div class="step-card">
              <div class="step-num">3</div>
              <h4>Department Action</h4>
              <p>Local authorities receive the task and begin the resolution process.</p>
            </div>
            <div class="step-card">
              <div class="step-num">4</div>
              <h4>Resolution</h4>
              <p>Once fixed, evidence is uploaded and the citizen is notified instantly.</p>
            </div>
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

    .info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4));
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .section-card h3 {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1e293b;
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .section-card h3 mat-icon { color: #2563eb; }

    .benefit-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
    .benefit-list li { display: flex; gap: 12px; align-items: flex-start; }
    .benefit-list .check { color: #10b981; font-size: 20px; width: 20px; height: 20px; margin-top: 2px; }
    .benefit-list span { color: #475569; font-size: 1rem; line-height: 1.5; }
    .benefit-list strong { color: #1e293b; color: #2563eb; }

    .workflow-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }
    .step-card {
      background: white;
      padding: 24px;
      border-radius: 20px;
      border: 1px solid #f1f5f9;
      text-align: center;
      transition: transform 0.3s;
    }
    .step-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
    .step-num {
      width: 40px; height: 40px;
      background: #2563eb;
      color: white;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      font-weight: 800;
      font-size: 1.2rem;
    }
    .step-card h4 { color: #1e293b; font-weight: 700; margin-bottom: 8px; }
    .step-card p { font-size: 0.9rem; color: #64748b; margin: 0; }

    .fade-in { animation: fadeIn 0.8s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 900px) {
      .content-grid { grid-template-columns: 1fr; }
      .info-header { flex-direction: column; text-align: center; }
      .hero-visual { margin-top: 24px; }
      h1 { font-size: 1.8rem; }
    }

    /* DARK THEME */
    :host-context(body.dark-theme) .dashboard-scene { background: #0f172a; }
    :host-context(body.dark-theme) .glass-panel { background: rgba(30,41,59,0.7); border-color: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) h1, 
    :host-context(body.dark-theme) .section-card h3,
    :host-context(body.dark-theme) .step-card h4 { color: #f1f5f9; }
    :host-context(body.dark-theme) p,
    :host-context(body.dark-theme) .benefit-list span { color: #94a3b8; }
    :host-context(body.dark-theme) .step-card { background: rgba(15, 23, 42, 0.5); border-color: rgba(255,255,255,0.05); }
    :host-context(body.dark-theme) .floating-icon { background: #1e293b; }
    :host-context(body.dark-theme) .floating-icon mat-icon { color: #60a5fa; }
    :host-context(body.dark-theme) .badge-pill { background: #1e293b; color: #60a5fa; }
  `]
})
export class AboutComponent { }
