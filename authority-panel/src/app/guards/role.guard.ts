import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter, switchMap } from 'rxjs/operators';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        console.log(`[RoleGuard] Checking access for ${state.url}. Waiting for loading...`);

        // Wait until loading is false
        return authService.loading$.pipe(
            filter(loading => {
                const isLoading = loading;
                return !isLoading;
            }),
            take(1),
            switchMap(() => {
                console.log('[RoleGuard] Loading complete. Checking User...');
                return authService.user$;
            }),
            take(1),
            map(user => {
                console.log('[RoleGuard] User State:', user);

                // 1. Check if user is authenticated
                if (!user) {
                    console.warn('[RoleGuard] No user found after restore. Redirecting to login.');
                    router.navigate(['/login']);
                    return false;
                }

                // 2. Check if user has required role
                // Normalize roles to lowercase to be safe
                const userRole = user.role?.toLowerCase() || '';
                const allowed = allowedRoles.map(r => r.toLowerCase());

                if (allowed.includes(userRole)) {
                    console.log('[RoleGuard] Access Granted.');
                    return true;
                }

                // 3. Strict Redirect
                console.warn(`[RoleGuard] Role Mismatch. User: ${userRole}, Required: ${allowed}`);

                if (userRole === 'citizen') {
                    router.navigate(['/citizen/dashboard']);
                } else if (userRole === 'authority') {
                    router.navigate(['/authority/dashboard']);
                } else if (userRole === 'admin') {
                    router.navigate(['/admin/dashboard']);
                } else {
                    router.navigate(['/login']);
                }

                return false;
            })
        );
    };
};
