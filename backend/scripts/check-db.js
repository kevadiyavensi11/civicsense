require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Issue = require('../src/models/Issue');

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const userCount = await User.countDocuments();
        const issueCount = await Issue.countDocuments();

        console.log('-----------------------------------');
        console.log(`Total Users: ${userCount}`);
        console.log(`Total Issues: ${issueCount}`);
        console.log('-----------------------------------');

        if (issueCount > 0) {
            const sampleIssue = await Issue.findOne();
            console.log('Sample Issue Status:', sampleIssue.status);
            console.log('Sample Issue Category:', sampleIssue.category);
            console.log('Sample Issue CreatedAt:', sampleIssue.createdAt);
        }

        process.exit();
    } catch (err) {
        console.error('DB Check Error:', err);
        process.exit(1);
    }
};

checkDb();
