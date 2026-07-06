import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-landing-immersive',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './landing-immersive.component.html',
    styleUrls: ['./landing-immersive.component.css']
})
export class LandingImmersiveComponent {

    systemModules = [
        {
            title: 'REPORT ISSUE',
            desc: 'Submit civic grievances via AI-verified channels.',
            icon: '📍',
            link: '/report-issue',
            status: 'ONLINE',
            delay: '0s'
        },
        {
            title: 'MY DASHBOARD',
            desc: 'Track status updates and historical data.',
            icon: '📊',
            link: '/dashboard',
            status: 'ACTIVE',
            delay: '0s'
        },
        {
            title: 'LIVE ALERTS',
            desc: 'Real-time notifications from Authority.',
            icon: '⚡',
            link: '/notifications',
            status: 'LIVE',
            delay: '2s'
        }
    ];

}
