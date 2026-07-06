import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    private getHeaders(): HttpHeaders {
        // Interceptor handles Authorization now
        return new HttpHeaders();
    }

    getStats(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/admin/stats`, { headers: this.getHeaders() });
    }

    getDashboardStats(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/admin/dashboard-stats`, { headers: this.getHeaders() });
    }

    getSystemStats(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/admin/stats`, { headers: this.getHeaders() });
    }

    getUsers(page: number = 1, limit: number = 10, search: string = '', role: string = ''): Observable<any> {
        let params: any = { page, limit };
        if (search) params.search = search;
        if (role && role !== 'all') params.role = role;

        return this.http.get(`${environment.apiUrl}/admin/users`, { headers: this.getHeaders(), params });
    }

    updateUserStatus(id: string, status: string): Observable<any> {
        return this.http.put(`${environment.apiUrl}/admin/users/${id}`, { status }, { headers: this.getHeaders() });
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/users/${id}`, { headers: this.getHeaders() });
    }

    updateUser(id: string, data: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/users/${id}`, data, { headers: this.getHeaders() });
    }

    getUserById(id: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}/admin/users/${id}`, { headers: this.getHeaders() });
    }

    // Issues
    getIssues(page: number = 1, limit: number = 10, search: string = '', status: string = ''): Observable<any> {
        let params: any = { page, limit };
        if (search) params.search = search;
        if (status && status !== 'All') params.status = status;

        return this.http.get(`${environment.apiUrl}/issues`, { headers: this.getHeaders(), params });
    }

    getIssueById(id: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}/issues/${id}`, { headers: this.getHeaders() });
    }

    updateIssueStatus(id: string, status: string, remarks: string): Observable<any> {
        return this.http.put(`${environment.apiUrl}/issues/${id}/status`, { status, remarks }, { headers: this.getHeaders() });
    }

    deleteIssue(id: string): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/issues/${id}`, { headers: this.getHeaders() });
    }

    bulkUpdateIssues(issueIds: string[], status: string): Observable<any> {
        return this.http.put(`${environment.apiUrl}/issues/bulk`, { issueIds, status }, { headers: this.getHeaders() });
    }

    getAnalytics(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/admin/analytics`, { headers: this.getHeaders() });
    }
}
