
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civicsense');
        console.log('MongoDB Connected for Seeding...');

        const adminEmail = 'admin@civicsense.gov';
        const adminPassword = 'adminpassword123'; // Change this in production!

        const userExists = await User.findOne({ email: adminEmail });
        if (userExists) {
            console.log('Admin already exists.');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const adminUser = await User.create({
            name: 'System Administrator',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            phone: '0000000000',
            isActive: true
        });

        console.log(`Admin created successfully!\nEmail: ${adminEmail}\nPassword: ${adminPassword}`);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
