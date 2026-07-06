import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
    template: `
    <div class="container">
      <mat-card>
        <mat-icon color="warn" class="large-icon">block</mat-icon>
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <div class="actions">
          <a mat-raised-button color="primary" routerLink="/">Go Home</a>
          <a mat-button routerLink="/login">Login with different account</a>
        </div>
      </mat-card>
    </div>
  `,
    styles: [`
    .container { display: flex; justify-content: center; align-items: center; height: 80vh; background-color: #f5f5f5; }
    mat-card { text-align: center; padding: 40px; max-width: 400px; display: flex; flex-direction: column; align-items: center; }
    .large-icon { font-size: 64px; height: 64px; width: 64px; margin-bottom: 20px; }
    h1 { margin-bottom: 10px; color: #333; }
    p { margin-bottom: 30px; color: #666; }
    .actions { display: flex; gap: 10px; }
  `]
})
export class UnauthorizedComponent { }
