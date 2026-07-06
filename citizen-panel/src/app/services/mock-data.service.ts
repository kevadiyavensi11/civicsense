
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MockDataService {
    private usersKey = 'civic_mock_users';

    constructor() { }

    private defaultUsers = [
        { id: '1', name: 'John Doe', email: 'citizen@example.com', role: 'citizen', area: 'Bangalore North' },
        { id: '2', name: 'Jane Smith', email: 'authority@example.com', role: 'authority', area: 'Bangalore South' },
        { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', area: 'All' }
    ];

    getMockUser() {
        return {
            uid: 'mock-user-123',
            email: 'citizen@example.com',
            displayName: 'John Doe',
            role: 'citizen'
        };
    }

    getMockIssues() {
        return [
            {
                id: '1',
                title: 'Pothole on Adajan Road',
                description: 'Large pothole causing traffic slowdown near Adajan Patiya.',
                imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
                status: 'Open',
                systemVerified: true,
                priority: 'High',
                createdAt: new Date(),
                location: { lat: 21.1925, lng: 72.8250 },
                zone: 'Central Zone'
            },
            {
                id: '2',
                title: 'Broken Street Link - Chowk Bazaar',
                description: 'Street light at Chowk Bazaar circle is not working.',
                imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
                status: 'Resolved',
                systemVerified: true,
                priority: 'Medium',
                createdAt: new Date(Date.now() - 86400000),
                location: { lat: 21.2300, lng: 72.8350 },
                zone: 'North Zone'
            },
            {
                id: '3',
                title: 'Garbage Dump - Rander Area',
                description: 'Uncollected garbage near the mosque area.',
                imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
                status: 'Open',
                systemVerified: false,
                priority: 'Low',
                createdAt: new Date(Date.now() - 100000000),
                location: { lat: 21.2100, lng: 72.8900 },
                zone: 'East Zone'
            }
        ];
    }

    // --- USERS CRUD ---

    getMockUsers(): any[] {
        const stored = localStorage.getItem(this.usersKey);
        if (stored) {
            return JSON.parse(stored);
        }
        this.saveUsers(this.defaultUsers);
        return this.defaultUsers;
    }

    deleteMockUser(id: string): boolean {
        let users = this.getMockUsers();
        const initialLen = users.length;
        users = users.filter(u => (u.id || u.uid) !== id);

        if (users.length !== initialLen) {
            this.saveUsers(users);
            return true;
        }
        return false;
    }

    updateMockUser(id: string, data: any): any {
        let users = this.getMockUsers();
        let updatedUser = null;

        users = users.map(u => {
            if ((u.id || u.uid) === id) {
                updatedUser = { ...u, ...data };
                return updatedUser;
            }
            return u;
        });

        if (updatedUser) {
            this.saveUsers(users);
        }
        return updatedUser;
    }

    createMockUser(user: any): any {
        const users = this.getMockUsers();
        const newUser = { ...user, id: Date.now().toString() };
        users.unshift(newUser);
        this.saveUsers(users);
        return newUser;
    }

    private saveUsers(users: any[]) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    getMockStats() {
        return {
            users: this.getMockUsers().length,
            issues: 45,
            resolved: 30,
            areas: 12
        };
    }
}
