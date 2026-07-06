import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    photoUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private userProfileSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userProfileSubject.asObservable();
    private platformId = inject(PLATFORM_ID);

    private readonly TOKEN_KEY = 'adminToken';
    private readonly USER_KEY = 'adminUser';
    private readonly LOGIN_STATE_KEY = 'isAdminLoggedIn';

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.restoreSession();
        }
    }

    private restoreSession() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userStr = localStorage.getItem(this.USER_KEY);
        const isLoggedIn = localStorage.getItem(this.LOGIN_STATE_KEY);

        console.log('[AuthDebug] Restore check:', { token: !!token, userStr: !!userStr, loggedIn: isLoggedIn });

        if (token && userStr && isLoggedIn === 'true') {
            try {
                const user = JSON.parse(userStr);
                console.log('[AuthDebug] Parsed user:', user);
                // Robust role check (case insensitive)
                const role = (user.role || '').toLowerCase();

                if (role === 'admin') {
                    this.userProfileSubject.next(user);
                    console.log('[AuthDebug] Session restored successfully.');
                } else {
                    console.warn('[AuthDebug] Invalid role during restore:', role);
                    // this.logout(); // Optional: Don't auto-logout immediately to let debug see state, but secure flow requires it.
                    this.logout();
                }
            } catch (e) {
                console.error('[AuthDebug] Parse error:', e);
                this.logout();
            }
        } else {
            console.log('[AuthDebug] No valid session found.');
        }
    }

    login(email: string, password: string): Observable<boolean> {
        console.log('[AuthService] Posting login to:', `${environment.apiUrl}/users/login`);
        return this.http.post<any>(`${environment.apiUrl}/users/login`, { email, password }).pipe(
            tap(response => {
                console.log('[AuthService] Received response:', response);
                if (response.token) {
                    // Start: Verify Admin Role before login
                    const role = (response.role || '').toLowerCase();
                    if (role !== 'admin') {
                        console.error('[AuthService] Role Mismatch:', role);
                        throw new Error('Unauthorized Access: Admins only.');
                    }
                    // End: Verify Admin Role

                    const user: User = {
                        id: response._id,
                        name: response.name,
                        email: response.email,
                        role: response.role
                    };

                    this.setSession(response.token, user);
                    this.userProfileSubject.next(user);
                }
            }),
            map(() => true),
            catchError((error) => {
                console.error('[AuthService] Login Error Trace:', error);
                return of(false);
            })
        );
    }

    loginWithGoogle(token: string): Observable<boolean> {
        return this.http.post<any>(`${environment.apiUrl}/users/google-login`, { token }).pipe(
            tap(response => this.handleAuthResponse(response)),
            map(() => true),
            catchError(error => {
                console.error('Google Login Error:', error);
                return of(false);
            })
        );
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/forgot-password`, { email, role: 'admin' });
    }

    verifyOtp(email: string, otp: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/verify-otp`, { email, otp });
    }

    resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/reset-password`, { email, otp, newPassword });
    }

    private handleAuthResponse(response: any) {
        if (response.token) {
            const role = (response.role || '').toLowerCase();
            if (role !== 'admin') {
                console.error('Unauthorized Access: Admins only.');
                return;
            }

            const user: User = {
                id: response._id,
                name: response.name,
                email: response.email,
                role: response.role
            };

            this.setSession(response.token, user);
            this.userProfileSubject.next(user);
        }
    }

    private setSession(token: string, user: User) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            localStorage.setItem(this.LOGIN_STATE_KEY, 'true');
        }
    }

    logout(): Observable<void> {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
            localStorage.removeItem(this.LOGIN_STATE_KEY);
        }
        this.userProfileSubject.next(null);
        this.router.navigate(['/admin/login']);
        return of(void 0);
    }

    // Profile & Security
    updateProfile(data: Partial<User>): Observable<any> {
        console.log('[AuthService] Sending Profile Update to:', `${environment.apiUrl}/users/profile`);
        return this.http.put(`${environment.apiUrl}/users/profile`, data).pipe(
            timeout(15000),
            tap({
                next: (res) => console.log('[AuthService] Profile Update Response:', res),
                error: (err) => console.error('[AuthService] Profile Update Error:', err)
            }),
            tap((response: any) => {
                if (response && response._id) {
                    const updated = { ...this.userProfileSubject.value, ...response, id: response._id };
                    this.userProfileSubject.next(updated);
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
                    }
                }
            })
        );
    }

    changePassword(data: any): Observable<any> {
        console.log('[AuthService] Transmitting Change Password to:', `${environment.apiUrl}/users/change-password`);
        return this.http.put(`${environment.apiUrl}/users/change-password`, data).pipe(
            timeout(15000),
            tap({
                next: (res) => console.log('[AuthService] Password Update SUCCESS:', res),
                error: (err) => console.error('[AuthService] Password Update ERROR:', err)
            })
        );
    }

    uploadAvatar(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('photo', file);
        return this.http.post(`${environment.apiUrl}/users/profile/photo`, formData).pipe(
            tap((response: any) => {
                if (response.photoUrl) {
                    const updated = { ...this.userProfileSubject.value!, photoUrl: response.photoUrl };
                    this.userProfileSubject.next(updated);
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
                    }
                }
            })
        );
    }
}
