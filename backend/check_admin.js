const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civicsense';

async function checkAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        
        const admin = await User.findOne({ email: 'admin@civicsense.gov' });
        if (admin) {
            console.log('Admin user found:', {
                id: admin._id,
                email: admin.email,
                role: admin.role,
                hasPassword: !!admin.password
            });
        } else {
            console.log('Admin user NOT found!');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdmin();
