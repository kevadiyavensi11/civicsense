import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);

    let authReq = req;

    // Only inject token if we are in the browser
    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('adminToken');
        if (token) {
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    }

    return next(authReq).pipe(
        timeout(10000), // Abort request after 10 seconds of silence
        catchError((error: any) => {
            // Handle 401 Unauthorized globally
            if (error.status === 401 && !req.url.includes('/login')) {
                console.warn('[AuthInterceptor] 401 Unauthorized detected. Redirecting to login.');

                if (isPlatformBrowser(platformId)) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    localStorage.removeItem('isAdminLoggedIn');
                    router.navigate(['/admin/login']);
                }
            }
            return throwError(() => error);
        })
    );
};
