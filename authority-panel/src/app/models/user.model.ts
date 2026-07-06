
export interface User {
    uid: string;
    _id?: string; // Backend ID
    email: string;
    role: 'citizen' | 'authority' | 'admin';
    name?: string;
    phone?: string; // Backend field
    photoUrl?: string; // Backend field
    phoneNumber?: string; // Legacy/Firebase
    photoURL?: string; // Legacy/Firebase
    address?: string;
    area?: string; // Jurisdiction (Legacy)
    zone?: string; // New Zone Field
    themePreference?: 'light' | 'dark';
    createdAt?: Date;
}
