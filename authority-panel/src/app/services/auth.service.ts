import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    authState,
    getIdToken,
    User as FirebaseUser
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, switchMap, BehaviorSubject, map, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private http: HttpClient = inject(HttpClient);
    private platformId = inject(PLATFORM_ID); // SSR Safety
    private router = inject(Router);

    // Main source of truth for user state + role
    private userProfileSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userProfileSubject.asObservable();
    get currentUserValue(): User | null { return this.userProfileSubject.value; }

    // Loading state to block AuthGuard until initialization finishes
    loading$ = new BehaviorSubject<boolean>(true);

    constructor() {
        // 1. Initial Load: Check LocalStorage (Custom JWT Flow)
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            if (token) {
                this.loadUserProfile();
            } else {
                this.loading$.next(false); // No token, no loading needed
            }
        } else {
            this.loading$.next(false); // SSR, not loading
        }

        // 2. Monitor Firebase Auth State (Hybrid/Backup Flow)
        authState(this.auth).pipe(
            switchMap(firebaseUser => {
                if (!firebaseUser) return of(null);
                // If we have a firebase user, ensure we fetch our DB profile
                return this.loadUserProfileObservable();
            })
        ).subscribe();
    }

    private loadUserProfile() {
        this.loadUserProfileObservable().subscribe({
            next: () => this.loading$.next(false),
            error: () => this.loading$.next(false)
        });
    }

    private loadUserProfileObservable(): Observable<User | null> {
        return this.http.get<User>(`${environment.apiUrl}/users/profile`).pipe(
            map(profile => {
                if (profile) {
                    if (!profile.role) (profile as any).role = 'authority'; // Default to authority
                    this.userProfileSubject.next(profile);
                    return profile;
                }
                return null;
            }),
            catchError(err => {
                console.error('Failed to restore session', err);
                // Only clear if strictly unauthorized (401/403) to avoid logout on network error
                if (err.status === 401 || err.status === 403) {
                    if (isPlatformBrowser(this.platformId)) localStorage.removeItem('token');
                    this.userProfileSubject.next(null);
                }
                return of(null);
            })
        );
    }

    private handleError(err: any): string {
        let message = 'An unexpected error occurred. Please try again.';

        // 1. Firebase Errors
        const code = err.code || err.error?.code;
        if (code) {
            switch (code) {
                case 'auth/invalid-email': return 'Invalid email address.';
                case 'auth/user-not-found': return 'Account not found. Please register.';
                case 'auth/wrong-password': return 'Incorrect password.';
                case 'auth/email-already-in-use': return 'Email already registered. Please login.';
                case 'auth/weak-password': return 'Password must be at least 6 characters.';
                case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
                case 'auth/network-request-failed': return 'Network error. Please check your connection.';
            }
        }

        // 2. Backend Errors (Standard 4xx/5xx)
        if (err.error && err.error.message) {
            return err.error.message;
        }

        // 3. Fallbacks
        if (err.message) return err.message;

        return message;
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/login`, { email, password }).pipe(
            map((response: any) => {
                // Store token
                localStorage.setItem('token', response.token);
                // Update state
                this.userProfileSubject.next(response);
                return response;
            }),
            catchError(err => {
                console.error('Login Error:', err);
                throw this.handleError(err);
            })
        );
    }

    register(email: string, password: string, userData: any): Observable<any> {
        return from(
            createUserWithEmailAndPassword(this.auth, email, password)
                .then(async (userCredential) => {
                    const token = await getIdToken(userCredential.user);
                    return this.http.post(
                        `${environment.apiUrl}/users`,
                        { ...userData, email, password }, // Send password for Bcrypt Hashing
                        { headers: { Authorization: `Bearer ${token}` } }
                    ).toPromise();
                })
        ).pipe(
            catchError(err => {
                console.error('Registration Error:', err);
                throw this.handleError(err);
            })
        );
    }

    logout(): Observable<void> {
        return from(signOut(this.auth)).pipe(
            map(() => {
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.clear();
                }
                this.userProfileSubject.next(null);
                this.router.navigate(['/login']);
            })
        );
    }

    // UPDATED: Prefer LocalStorage for immediate Interceptor availability
    async getToken(): Promise<string | null> {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            if (token) return token;
        }
        const user = this.auth.currentUser;
        if (user) return await getIdToken(user);
        return null;
    }

    loginWithGoogle(token: string): Observable<boolean> {
        return this.http.post<any>(`${environment.apiUrl}/users/google-login`, { token }).pipe(
            map((response: any) => {
                localStorage.setItem('token', response.token);
                // Update state
                this.userProfileSubject.next(response);
                return true;
            }),
            catchError(err => {
                console.error('Google Login Error:', err);
                return of(false);
            })
        );
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/forgot-password`, { email, role: 'authority' });
    }

    verifyOtp(email: string, otp: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/verify-otp`, { email, otp });
    }

    resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/users/reset-password`, { email, otp, newPassword });
    }

    updateProfile(data: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/users/profile`, data).pipe(
            map((updatedUser: any) => {
                if (updatedUser.token) {
                    localStorage.setItem('token', updatedUser.token);
                }
                this.userProfileSubject.next(updatedUser);
                return updatedUser;
            })
        );
    }

    changePassword(passwords: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/users/change-password`, passwords);
    }

    updateAuthoritySettings(settings: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/authority/settings`, settings).pipe(
            map((response: any) => {
                // Update local user state with new settings
                const currentUser = this.userProfileSubject.value;
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...response.settings };
                    this.userProfileSubject.next(updatedUser);
                    this.applyTheme((updatedUser as any).themePreference);
                }
                return response;
            })
        );
    }

    // Helper to toggle theme instantly
    toggleTheme(): void {
        const currentUser = this.userProfileSubject.value;
        if (!currentUser) return;

        const currentTheme = (currentUser as any).themePreference || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Optimistic UI Update
        this.applyTheme(newTheme);

        // Call Backend
        this.updateAuthoritySettings({ themePreference: newTheme }).subscribe({
            error: () => {
                // Revert on failure
                this.applyTheme(currentTheme);
            }
        });
    }

    private applyTheme(theme: string) {
        if (!isPlatformBrowser(this.platformId)) return;

        const body = document.body;
        if (theme === 'dark') {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
    }
    uploadAvatar(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('photo', file);
        return this.http.post(`${environment.apiUrl}/users/profile/photo`, formData).pipe(
            map((response: any) => {
                const currentUser = this.userProfileSubject.value;
                if (currentUser) {
                    this.userProfileSubject.next({ ...currentUser, photoUrl: response.photoUrl });
                }
                return response;
            })
        );
    }

    getCurrentUserId(): string | null {
        const user = this.userProfileSubject.value;
        return user ? (user as any)._id || (user as any).id : null;
    }
}
