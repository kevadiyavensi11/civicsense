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

    getIssues(status?: string, limit: number = 10, page: number = 1): Observable<any[]> {
        if (environment.useMockData) {
            let issues = this.mockService.getMockIssues();
            if (status) {
                issues = issues.filter(i => i.status === status);
            }
            return of(issues);
        }
        let params: any = { limit, page };
        if (status) params.status = status;

        return this.http.get<any>(this.apiUrl, { params }).pipe(
            map(response => {
                // Backend returns { issues: [], total: ... }
                // We just want the array for the component
                if (response && Array.isArray(response.issues)) {
                    return response.issues;
                }
                // Fallback if backend structure changes or is just an array
                return Array.isArray(response) ? response : [];
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

    updateStatus(id: string, status: string, remarks: string): Observable<any> {
        if (environment.useMockData) {
            console.log(`Mock update status: ${id} -> ${status}`);
            return of({ success: true });
        }
        return this.http.patch(`${this.apiUrl}/${id}`, { status, remarks });
    }

    getZones(): Observable<any[]> {
        if (environment.useMockData) {
            return of([{ zoneName: 'East Zone' }, { zoneName: 'West Zone' }, { zoneName: 'Central Zone' }]);
        }
        // Change apiUrl context to root api (removing /issues path part)
        // Assume default apiUrl is http://localhost:5000/api
        // So this.apiUrl is http://localhost:5000/api/issues
        // We need http://localhost:5000/api/zones
        const zonesUrl = this.apiUrl.replace('/issues', '/zones');
        return this.http.get<any[]>(zonesUrl);
    }

    reverseGeocode(lat: number, lng: number): Observable<any> {
        // Use Backend Proxy which handles Caching & Headers
        return this.http.get(`${this.apiUrl}/geocode?lat=${lat}&lng=${lng}`);
    }

    searchLocation(query: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/search-location?query=${encodeURIComponent(query)}`);
    }
}
