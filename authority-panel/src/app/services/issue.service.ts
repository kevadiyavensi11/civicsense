import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDataService } from './mock-data.service';

@Injectable({
    providedIn: 'root'
})
export class IssueService {
    private http = inject(HttpClient);
    private mockService = inject(MockDataService);
    private apiUrl = `${environment.apiUrl}/issues`;

    constructor() { }

    getIssues(searchParams?: string | any): Observable<any[]> {
        if (environment.useMockData) {
            let issues = this.mockService.getMockIssues();
            if (typeof searchParams === 'string') {
                issues = issues.filter(i => i.status === searchParams);
            }
            return of(issues);
        }

        let params: any = {};
        if (typeof searchParams === 'string') {
            params.status = searchParams;
        } else if (searchParams) {
            params = searchParams;
        }

        return this.http.get<any>(this.apiUrl, { params }).pipe(
            map((res: any) => {
                if (res && res.issues && Array.isArray(res.issues)) {
                    return res.issues;
                }
                return Array.isArray(res) ? res : [];
            })
        );
    }

    reportIssue(issueData: any): Observable<any> {
        if (environment.useMockData) {
            console.log('Mock report issue:', issueData);
            return of({ success: true, id: 'mock-new-id' });
        }
        return this.http.post(this.apiUrl, issueData);
    }

    getIssueById(id: string): Observable<any> {
        if (environment.useMockData) {
            return of(this.mockService.getMockIssues().find(i => i.id === id));
        }
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updateStatus(id: string, status: string, remarks: string, resolutionImageUrl?: string): Observable<any> {
        if (environment.useMockData) {
            console.log(`Mock update status: ${id} -> ${status}`);
            return of({ success: true });
        }
        return this.http.put(`${this.apiUrl}/${id}/status`, { status, remarks, resolutionImageUrl });
    }

    assignTask(id: string, authorityId?: string): Observable<any> {
        if (environment.useMockData) {
            console.log(`Mock assign task: ${id}`);
            return of({ success: true });
        }
        return this.http.put(`${this.apiUrl}/${id}/assign`, { authorityId });
    }
}
