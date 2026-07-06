
export interface User {
    uid: string;
    _id?: string; 
    email: string;
    role: 'citizen' | 'authority' | 'admin';
    name?: string;
    photoUrl?: string;
    phone?: string;
    address?: string;
    area?: string;
    themePreference?: 'light' | 'dark';
    emailNotificationPreference?: string;
    languagePreference?: string;
    createdAt?: Date;
}
