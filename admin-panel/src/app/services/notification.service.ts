import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'warning' | 'success';
    sender?: {
        name: string;
        role: string;
    };
    isRead: boolean;
    createdAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/notifications`;

    getMyNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(this.apiUrl);
    }

    getSentNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.apiUrl}/sent`);
    }

    sendNotification(data: {
        recipientId?: string;
        recipientEmail?: string;
        recipientRole?: string;
        title: string;
        message: string;
        type?: string;
    }): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    markAsRead(id: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/read`, {});
    }
}
