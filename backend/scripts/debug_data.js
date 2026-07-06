const mongoose = require('mongoose');
const User = require('../src/models/User');
const Issue = require('../src/models/Issue');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const targetEmail = 'kevdiyaprakruti@gmail.com';
        const user = await User.findOne({ email: targetEmail });

        console.log('\n--- TARGET USER ---');
        if (user) {
            console.log(JSON.stringify(user, null, 2));

            const issues = await Issue.find({
                $or: [
                    { reportedBy: user._id },
                    { createdByEmail: user.email }
                ]
            });
            console.log(`\n--- ISSUES FOR ${user.email} (${user._id}) ---`);
            console.log(`Count: ${issues.length}`);
            console.log(JSON.stringify(issues, null, 2));
        } else {
            console.log('User not found in DB matching:', targetName);
            // Dump all users just in case
            const allUsers = await User.find({}).select('name email role');
            console.log('All Users:', JSON.stringify(allUsers, null, 2));
        }

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
