
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

import { LandingImmersiveComponent } from './components/landing-immersive/landing-immersive.component';
import { AboutComponent } from './components/about/about.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';

export const routes: Routes = [
    // 1. Root Routes (Public Layout)
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: LandingComponent, pathMatch: 'full' },
            { path: 'design-preview', component: LandingImmersiveComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'about', component: AboutComponent },
            { path: 'contact', component: ContactUsComponent },
            { path: 'register', component: RegisterComponent }
        ]
    },

    // 2. Authenticated Routes (Main App Layout)
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            // Citizen Area
            {
                path: 'citizen',
                canActivate: [roleGuard(['citizen'])],
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'dashboard', component: DashboardCitizenComponent },
                    { path: 'report', component: ReportIssueComponent },
                    { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
                    { path: 'change-password', loadComponent: () => import('./components/citizen-pages/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
                    { path: 'notifications', loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent) }
                ]
            },

            // Authority Area
            {
                path: 'authority',
                canActivate: [roleGuard(['authority'])],
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'dashboard', component: DashboardAuthorityComponent }
                ]
            },

            // Admin Area


            // Shared Authenticated Pages (Accessible inside App Layout)
            { path: 'issues', component: IssueListComponent },
            { path: 'issues/:id', component: IssueDetailComponent },

            // Unauthorized
            { path: 'unauthorized', loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) }
        ]
    },

    // 3. Fallback
    { path: '**', redirectTo: 'login' }
];
