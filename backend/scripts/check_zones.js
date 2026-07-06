
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Issue = require('../src/models/Issue');

const checkZones = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civicsense');
        console.log('--- DB ZONE DIAGNOSTIC ---');

        // 1. Check Authorities
        const authorities = await User.find({ role: 'authority' });
        console.log(`\n1. Found ${authorities.length} Authorities:`);
        authorities.forEach(a => {
            console.log(`   - Name: ${a.name}, Email: ${a.email}, Area: "${a.area}"`);
        });

        // 2. Check Issues by Zone
        const issues = await Issue.aggregate([
            { $group: { _id: "$jurisdictionArea", count: { $sum: 1 } } }
        ]);
        console.log('\n2. Issues grouped by Jurisdiction Area:');
        issues.forEach(i => {
            console.log(`   - Area: "${i._id}", Count: ${i.count}`);
        });

        // 3. Check Mismatches (Orphans)
        const authorityAreas = authorities.map(a => a.area).filter(Boolean);
        console.log(`\n3. Checking for orphaned issues (Zones with no Authority):`);

        // This is a rough check
        for (const i of issues) {
            const zone = i._id;
            const hasAuthority = authorityAreas.some(area =>
                new RegExp(`^${area}$`, 'i').test(zone)
            );
            if (!hasAuthority) {
                console.log(`   [WARNING] ${i.count} issues in "${zone}" have NO matching Authority.`);
            } else {
                console.log(`   [OK] "${zone}" is covered by an Authority.`);
            }
        }

        console.log('\n--- END DIAGNOSTIC ---');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkZones();
