import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'warning' | 'success';
    sender?: {
        _id: string;
        name: string;
        email: string;
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
    
    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    getMyNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(this.apiUrl).pipe(
            tap(notes => {
                const unread = notes.filter(note => !note.isRead).length;
                this.unreadCountSubject.next(unread);
            })
        );
    }

    getSentNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.apiUrl}/sent`);
    }

    sendNotification(data: {
        recipientId?: string;
        recipientRole?: string;
        title: string;
        message: string;
        type?: string;
    }): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    markAsRead(id: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/read`, {}).pipe(
            tap(() => this.refreshCount())
        );
    }

    markAllAsRead(): Observable<any> {
        return this.http.put(`${this.apiUrl}/read-all`, {}).pipe(
            tap(() => this.unreadCountSubject.next(0))
        );
    }

    refreshCount(): void {
        this.getMyNotifications().subscribe();
    }
}
