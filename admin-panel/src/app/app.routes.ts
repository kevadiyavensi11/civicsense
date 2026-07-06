import { Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './components/layout/admin-layout/admin-layout.component';
import { ZoneMonitoringComponent } from './components/zone-monitoring/zone-monitoring.component';

export const routes: Routes = [
    { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
    { path: 'admin/login', component: AdminLoginComponent },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                component: DashboardAdminComponent
            },
            {
                path: 'zone-map',
                component: ZoneMonitoringComponent
            },
            {
                path: 'users',
                loadComponent: () => import('./components/users/user-list/user-list.component').then(m => m.UserListComponent)
            },
            {
                path: 'issues',
                loadComponent: () => import('./components/issues/issue-list/issue-list.component').then(m => m.IssueListComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent)
            },
            {
                path: 'contact-messages',
                loadComponent: () => import('./components/contact-messages/contact-messages.component').then(m => m.ContactMessagesComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'change-password',
                loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent)
            }
        ]
    },
    {
        path: '**', redirectTo: 'admin/login'
    }
];
