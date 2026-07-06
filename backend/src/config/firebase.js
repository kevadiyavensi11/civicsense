const admin = require('firebase-admin');

let firebaseEnabled = false;

try {
    if (process.env.NODE_ENV === 'production') {
        const serviceAccount = require('../../serviceAccountKey.json');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        firebaseEnabled = true;
        console.log('Firebase Admin Initialized');
    } else {
        console.log('Firebase disabled (development mode)');
    }
} catch (error) {
    console.error('Firebase Init Failed:', error.message);
}

module.exports = { admin, firebaseEnabled };
