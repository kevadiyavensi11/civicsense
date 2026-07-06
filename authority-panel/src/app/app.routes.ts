
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardCitizenComponent } from './components/dashboard-citizen/dashboard-citizen.component';
import { DashboardAuthorityComponent } from './components/dashboard-authority/dashboard-authority.component';

import { ReportIssueComponent } from './components/report-issue/report-issue.component';
import { IssueListComponent } from './components/issue-list/issue-list.component';
import { IssueDetailComponent } from './components/issue-detail/issue-detail.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { PublicLayoutComponent } from './components/layout/public-layout/public-layout.component';
import { LandingComponent } from './components/landing/landing.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
    // 1. Root Routes
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: LandingComponent, pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
        ]
    },

    // 2. Authenticated Main Area
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            // Authority Area
            {
                path: 'authority',
                canActivate: [roleGuard(['authority'])],
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'home', loadComponent: () => import('./components/authority-pages/authority-home/authority-home.component').then(m => m.AuthorityHomeComponent) },
                    { path: 'dashboard', component: DashboardAuthorityComponent },
                    { path: 'task-queue', loadComponent: () => import('./components/task-queue/task-queue.component').then(m => m.TaskQueueComponent) },
                    { path: 'notifications', component: NotificationsComponent },
                    { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
                    { path: 'settings', loadComponent: () => import('./components/authority-pages/authority-settings/authority-settings.component').then(m => m.AuthoritySettingsComponent) },
                    { path: 'change-password', loadComponent: () => import('./components/authority-pages/authority-change-password/authority-change-password.component').then(m => m.AuthorityChangePasswordComponent) },
                    { path: 'verified-issues', loadComponent: () => import('./components/authority-pages/verified-issues/verified-issues.component').then(m => m.VerifiedIssuesComponent) },
                    { path: 'critical-alerts', loadComponent: () => import('./components/authority-pages/critical-alerts/critical-alerts.component').then(m => m.CriticalAlertsComponent) },
                    { path: 'assigned-tasks', loadComponent: () => import('./components/authority-pages/assigned-tasks/assigned-tasks.component').then(m => m.AssignedTasksComponent) },
                    { path: 'resolution-history', loadComponent: () => import('./components/authority-pages/resolution-history/resolution-history.component').then(m => m.ResolutionHistoryComponent) },
                    { path: 'reports', loadComponent: () => import('./components/authority-pages/verified-issues/verified-issues.component').then(m => m.VerifiedIssuesComponent) },
                    { path: 'issues/:id', loadComponent: () => import('./components/authority-pages/authority-issue-detail/authority-issue-detail.component').then(m => m.AuthorityIssueDetailComponent) }
                ]
            },

            // Citizen Area
            {
                path: 'citizen',
                canActivate: [roleGuard(['citizen'])],
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'dashboard', component: DashboardCitizenComponent },
                    { path: 'report', component: ReportIssueComponent }
                ]
            },

            // Shared Authenticated Pages
            { path: 'notifications', component: NotificationsComponent },
            { path: 'issues', component: IssueListComponent },
            { path: 'issues/:id', component: IssueDetailComponent },
            { path: 'unauthorized', loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) }
        ]
    },

    // Default Fallback
    { path: '**', redirectTo: 'login' }
];
