import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { map, filter, switchMap, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Wait until loading is false
    return authService.loading$.pipe(
        filter(loading => !loading),
        take(1),
        switchMap(() => authService.user$),
        take(1),
        map(user => {
            if (environment.useMockData) return true;
            if (user && (user.role === 'citizen')) return true; // Strict citizen check
            router.navigate(['/login']);
            return false;
        })
    );
};
