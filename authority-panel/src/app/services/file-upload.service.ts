import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/upload`;

    upload(file: File): Observable<{ url: string }> {
        if (environment.useMockData) {
            return of({ url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80' });
        }
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(this.apiUrl, formData);
    }
}
