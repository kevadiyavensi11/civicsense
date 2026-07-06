const mongoose = require('mongoose');
const Issue = require('./src/models/Issue');
require('dotenv').config();

const inspect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const issues = await Issue.find({}).sort({ createdAt: -1 }).limit(5);
        console.log('--- LATEST 5 ISSUES ---');
        issues.forEach(i => {
            console.log(`ID: ${i._id}, Title: "${i.title}", CreatedBy: ${i.createdByEmail}`);
        });
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

inspect();
