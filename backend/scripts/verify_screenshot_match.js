const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config({ path: 'backend/.env' });

const verifyMatch = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const targetZone = "North Zone";
        console.log(`\n--- SEARCHING FOR AUTHORITY IN: ${targetZone} ---`);

        const authority = await User.findOne({
            role: 'authority',
            area: targetZone
        });

        if (authority) {
            console.log("✅ MATCH FOUND!");
            console.log(`User: ${authority.email}`);
            console.log(`Role: ${authority.role}`);
            console.log(`Area: ${authority.area}`);
            console.log("\nRESULT: This user WILL see the issue from your screenshot.");
        } else {
            console.log("❌ NO AUTHORITY FOUND for North Zone.");
            console.log("To fix: Update an authority's area to 'North Zone'.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

verifyMatch();
