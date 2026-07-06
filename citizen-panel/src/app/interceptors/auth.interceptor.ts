import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    // BREAKING CIRCULAR DEPENDENCY:
    // Do not inject AuthService here. Access localStorage directly.
    // AuthService depends on HttpClient, which depends on Interceptor.

    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('token');
        if (token) {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next(authReq);
        }
    }

    return next(req);
};
