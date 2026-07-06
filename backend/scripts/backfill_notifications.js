const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Issue = require('../src/models/Issue');
const Notification = require('../src/models/Notification');
const User = require('../src/models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('DB Connection Failed:', error);
        process.exit(1);
    }
};

const backfillNotifications = async () => {
    await connectDB();

    try {
        // 1. Backfill for already assigned issues
        const assignedIssues = await Issue.find({
            status: { $in: ['Open', 'In Progress'] },
            authorityId: { $ne: null }
        });

        console.log(`Found ${assignedIssues.length} already assigned issues.`);

        let createdCount = 0;
        for (const issue of assignedIssues) {
            const exists = await Notification.findOne({
                recipient: issue.authorityId,
                message: { $regex: issue.title }
            });

            if (!exists) {
                let senderId = issue.reportedBy || issue.authorityId; // Fallback
                await Notification.create({
                    recipient: issue.authorityId,
                    recipientRole: 'authority',
                    sender: senderId,
                    title: 'Active Issue Reminder',
                    message: `Reminder: You have an active issue in your zone: ${issue.title} (${issue.zone})`,
                    type: 'warning',
                    createdAt: new Date()
                });
                createdCount++;
            }
        }

        // 2. Fix Unassigned Issues (If Authority Exists for Zone)
        const unassignedIssues = await Issue.find({
            status: { $in: ['Open', 'In Progress'] },
            authorityId: null,
            zone: { $ne: null }
        });

        console.log(`Found ${unassignedIssues.length} unassigned issues.`);
        let fixedCount = 0;

        for (const issue of unassignedIssues) {
            // Find authority for this zone
            const authority = await User.findOne({
                role: 'authority',
                $or: [{ zone: issue.zone }, { area: issue.zone }]
            });

            if (authority) {
                console.log(`Assigning '${issue.title}' (${issue.zone}) to ${authority.name}`);

                issue.authorityId = authority._id;
                issue.jurisdictionArea = issue.zone; // Ensure consistent
                await issue.save();

                await Notification.create({
                    recipient: authority._id,
                    recipientRole: 'authority',
                    sender: issue.reportedBy || authority._id,
                    title: 'New Issue Assigned (Backfill)',
                    message: `An existing issue in your zone has been assigned to you: ${issue.title}`,
                    type: 'alert',
                    createdAt: new Date()
                });
                fixedCount++;
            } else {
                console.log(`No authority found for zone: ${issue.zone} (Issue: ${issue.title})`);
            }
        }

        console.log(`Backfilled ${createdCount} reminders.`);
        console.log(`Fixed and Assigned ${fixedCount} issues.`);
        process.exit();
    } catch (error) {
        console.error('Backfill Error:', error);
        process.exit(1);
    }
};

backfillNotifications();
