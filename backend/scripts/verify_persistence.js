const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Issue = require('../src/models/Issue');

dotenv.config({ path: 'backend/.env' });

const verifyPersistence = async () => {
    try {
        console.log(`\nConnecting to: ${process.env.MONGO_URI}`);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB successfully.');

        console.log('\n--- LITMUS TEST: LATEST 5 ISSUES ---');
        // Fetch last 5 issues sorted by createdAt desc
        const issues = await Issue.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title status createdAt _id jurisdictionArea');

        if (issues.length === 0) {
            console.log('⚠️ No issues found in the database.');
        } else {
            issues.forEach((issue, index) => {
                console.log(`${index + 1}. [${issue.status}] "${issue.title}" (ID: ${issue._id})`);
                console.log(`   Zone: ${issue.jurisdictionArea} | Created: ${issue.createdAt}`);
            });
        }

        console.log('\n-------------------------------------');
        console.log('IF YOU SEE YOUR ISSUE ABOVE: It IS in the database.');
        console.log('IF NOT: The backend might be connected to a different DB than you think.');
        console.log('-------------------------------------\n');

    } catch (err) {
        console.error('❌ DB Connection Failed:', err.message);
    } finally {
        await mongoose.disconnect();
    }
};

verifyPersistence();
