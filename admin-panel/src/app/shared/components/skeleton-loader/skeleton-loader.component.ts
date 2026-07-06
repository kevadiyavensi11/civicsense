
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="skeleton-container" [style.height]="height" [style.width]="width" [style.border-radius]="borderRadius">
      <div class="shimmer"></div>
    </div>
  `,
    styles: [`
    .skeleton-container {
      background-color: rgba(255, 255, 255, 0.05);
      position: relative;
      overflow: hidden;
      display: inline-block;
    }
    
    .shimmer {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `]
})
export class SkeletonLoaderComponent {
    @Input() width = '100%';
    @Input() height = '20px';
    @Input() borderRadius = '4px';
}
