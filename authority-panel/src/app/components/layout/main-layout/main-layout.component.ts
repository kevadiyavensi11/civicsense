
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
    <div class="app-shell" [class.dark-mode]="(authService.user$ | async)?.themePreference === 'dark'">
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
    }

    .shell-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      scroll-behavior: smooth;
    }

    .content-container {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    /* Transition for theme switching */
    .app-shell {
      transition: background 0.3s ease;
    }

    @media (max-width: 1024px) {
      .shell-sidebar { display: none; } /* Mobile sidebar hidden by default */
      .shell-content { padding: 20px; }
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);

  constructor() {
    this.authService.user$.subscribe(user => {
      if (user) {
        const theme = (user as any).themePreference || 'light';
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
      }
    });
  }
}
