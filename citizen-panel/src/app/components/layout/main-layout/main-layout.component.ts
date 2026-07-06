
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-shell citizen-shell">
      <app-sidebar class="shell-sidebar"></app-sidebar>
      
      <div class="shell-main">
        <app-header class="shell-header"></app-header>
        
        <main class="shell-content">
          <div class="content-container">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --sidebar-width: 280px;
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .app-shell {
      display: flex;
      height: 100vh;
      width: 100%;
      background: var(--bg-main);
      overflow: hidden;
    }

    .shell-sidebar {
      width: var(--sidebar-width);
      flex-shrink: 0;
      z-index: 1000;
      box-shadow: 20px 0 30px -10px rgba(30, 58, 95, 0.05);
    }

    .shell-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .shell-header {
      flex-shrink: 0;
      z-index: 999;
      background: white;
      border-bottom: 1px solid var(--border-light);
    }

    .shell-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      scroll-behavior: smooth;
      background: #f8fafc; /* Standard light background */
      transition: background 0.3s ease;
    }

    /* DARK THEME ADAPTATION */
    :host-context(body.dark-theme) .shell-header {
      background: #0F172A;
      border-bottom-color: rgba(255, 255, 255, 0.05);
    }

    :host-context(body.dark-theme) .shell-content {
      background: #020617; /* Deeper dark background for contrast */
    }

    .content-container {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    @media (max-width: 1024px) {
      .shell-sidebar { display: none; }
      .shell-content { padding: 20px; }
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
}
