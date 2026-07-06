const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Issue = require('../src/models/Issue');

dotenv.config({ path: 'backend/.env' });

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected DB');

        // 1. Standardize Authority Zones
        const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
        const authorities = await User.find({ role: 'authority' });

        let i = 0;
        for (const auth of authorities) {
            const newZone = zones[i % zones.length];
            auth.area = newZone;
            await auth.save({ validateBeforeSave: false }); // Bypass validation for User if needed
            console.log(`Updated Authority ${auth.email} -> ${newZone}`);
            i++;
        }

        // 2. Distribute Issues
        const issues = await Issue.find({});
        i = 0;

        // Find a valid user ID to use as fallback fallback
        const fallbackUser = authorities[0]?._id || new mongoose.Types.ObjectId();
        const fallbackEmail = authorities[0]?.email || 'system@fix.com';

        for (const issue of issues) {
            // FIX MANDATORY FIELDS
            if (!issue.location) issue.location = {};
            if (!issue.location.lat) issue.location.lat = 21.1702; // Surat Lat
            if (!issue.location.lng) issue.location.lng = 72.8311; // Surat Lng
            if (!issue.location.address) issue.location.address = `Auto-fixed Address ${i}`;

            if (!issue.createdById) issue.createdById = fallbackUser.toString();
            if (!issue.createdByRole) issue.createdByRole = 'CITIZEN';
            if (!issue.createdByEmail) issue.createdByEmail = fallbackEmail;
            if (!issue.reportedBy) issue.reportedBy = fallbackUser;
            if (!issue.imageUrl) issue.imageUrl = 'https://via.placeholder.com/300';
            if (!issue.category) issue.category = 'Others';

            // ASSIGN ZONE
            if (!zones.includes(issue.jurisdictionArea)) {
                issue.jurisdictionArea = zones[i % zones.length];
            }
            i++;

            try {
                await issue.save();
            } catch (innerErr) {
                console.log(`Failed to validate Issue ${issue._id}, forcing save...`);
                // Use updateOne to bypass mongoose schema validation if save fails
                await Issue.updateOne({ _id: issue._id }, {
                    $set: {
                        jurisdictionArea: issue.jurisdictionArea,
                        location: issue.location,
                        createdById: issue.createdById,
                        createdByRole: issue.createdByRole,
                        createdByEmail: issue.createdByEmail,
                        reportedBy: issue.reportedBy
                    }
                });
            }
        }
        console.log(`Processed ${issues.length} issues.`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
    }
};

fixData();
