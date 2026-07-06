const mongoose = require('mongoose');
const Issue = require('./src/models/Issue');
const { resolveZone } = require('./src/utils/zoneResolver');
require('dotenv').config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- MIGRATING ISSUES ---');

        const unmappedIssues = await Issue.find({
            $or: [
                { zone: 'Unassigned' },
                { zone: { $exists: false } },
                { jurisdictionArea: 'Unassigned' }
            ]
        });

        console.log(`Found ${unmappedIssues.length} issues to migrate.`);

        let updatedCount = 0;
        for (const issue of unmappedIssues) {
            const loc = issue.location;
            if (loc && loc.locality) {
                const newZone = await resolveZone(loc.locality, loc.city);
                if (newZone) {
                    issue.zone = newZone;
                    issue.jurisdictionArea = newZone;
                    await issue.save();
                    console.log(`Migrated Issue ${issue._id}: ${loc.locality} -> ${newZone}`);
                    updatedCount++;
                }
            } else if (loc && loc.fullAddress) {
                // Try extracting something from full address if locality is missing
                // Very basic extraction
                const parts = loc.fullAddress.split(',');
                const potentialLocality = parts[parts.length - 4] || parts[0];
                const newZone = await resolveZone(potentialLocality, 'Surat'); // Assume Surat
                if (newZone) {
                    issue.zone = newZone;
                    issue.jurisdictionArea = newZone;
                    issue.location.locality = potentialLocality; // Backfill
                    await issue.save();
                    console.log(`Migrated Issue ${issue._id} (extracted): ${potentialLocality} -> ${newZone}`);
                    updatedCount++;
                }
            }
        }

        console.log(`Successfully migrated ${updatedCount} issues.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

migrate();
