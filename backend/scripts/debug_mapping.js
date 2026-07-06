const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('../src/models/User');
const Issue = require('../src/models/Issue');

// Load env vars
dotenv.config({ path: 'backend/.env' });

const logData = [];
const customLog = (msg) => {
    console.log(msg);
    logData.push(msg);
};

const checkMapping = async () => {
    try {
        customLog(`Connecting to: ${process.env.MONGO_URI ? 'URI Found' : 'URI Missing'}`);
        await mongoose.connect(process.env.MONGO_URI);
        customLog('Connected to DB');

        customLog('\n--- ALL USERS ---');
        const users = await User.find({});
        customLog(`Total Users: ${users.length}`);
        users.forEach(u => customLog(`- ${u.email} [${u.role}] (Area: '${u.area}')`));

        customLog('\n--- ISSUES ---');
        const issues = await Issue.find({}).select('title jurisdictionArea status');
        customLog(`Total Issues: ${issues.length}`);
        issues.forEach(i => customLog(`- ${i.title} [Zone: '${i.jurisdictionArea}']`));

        customLog('\n--- ANALYSIS ---');
        const authorities = users.filter(u => u.role === 'authority');
        authorities.forEach(auth => {
            if (!auth.area) {
                customLog(`WARN: Authority ${auth.email} has NO area.`);
            } else {
                const count = issues.filter(i => i.jurisdictionArea && i.jurisdictionArea.toLowerCase() === auth.area.toLowerCase()).length;
                customLog(`Authority ${auth.email} (${auth.area}) should see ${count} issues.`);
            }
        });

    } catch (err) {
        customLog(`Error: ${err.message}`);
    } finally {
        await mongoose.disconnect();
        customLog('Done.');
        fs.writeFileSync('debug_output.txt', logData.join('\n'));
    }
};

checkMapping();
