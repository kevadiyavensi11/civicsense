
require('dotenv').config({ path: '../.env' }); // Adjust path if needed
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User'); // Adjust path to models
const Issue = require('../src/models/Issue'); // Adjust path to models
const IssueStatus = require('../src/models/IssueStatus'); // Adjust path to models

const seedTestScenario = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civicsense');
        console.log('MongoDB Connected for Seeding Test Scenario...');

        // 1. Create Citizen
        const citizenEmail = 'citizen_test@civicsense.gov';
        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let citizen = await User.findOne({ email: citizenEmail });
        if (!citizen) {
            citizen = await User.create({
                name: 'Test Citizen',
                email: citizenEmail,
                password: hashedPassword,
                role: 'citizen',
                phone: '1111111111',
                isActive: true
            });
            console.log('Created Test Citizen:', citizenEmail);
        } else {
            console.log('Test Citizen already exists:', citizenEmail);
        }

        // 2. Create Authority
        const authorityEmail = 'authority_test@civicsense.gov';
        const testArea = 'Test Zone Alpha';

        let authority = await User.findOne({ email: authorityEmail });
        if (!authority) {
            authority = await User.create({
                name: 'Test Authority',
                email: authorityEmail,
                password: hashedPassword,
                role: 'authority',
                phone: '2222222222',
                area: testArea,
                isActive: true
            });
            console.log('Created Test Authority:', authorityEmail);
        } else {
            // Ensure area matches for test
            if (authority.area !== testArea) {
                authority.area = testArea;
                await authority.save();
                console.log('Updated Authority Area to:', testArea);
            }
            console.log('Test Authority already exists:', authorityEmail);
        }

        // 3. Create Issue
        const issueTitle = 'Test Verify Authority Success';
        let issue = await Issue.findOne({ title: issueTitle });

        if (!issue) {
            issue = await Issue.create({
                title: issueTitle,
                description: 'This is a test issue to verify the Authority Panel success flow.',
                category: 'Pothole',
                imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', // Dummy URL
                location: {
                    lat: 28.7041,
                    lng: 77.1025,
                    address: 'Test Location, Delhi'
                },
                priority: 'Medium',
                status: 'Open',
                aiVerified: true,
                reportedBy: citizen._id,
                createdById: citizen._id.toString(),
                createdByRole: 'CITIZEN',
                createdByEmail: citizen.email,
                jurisdictionArea: testArea // MATCHES AUTHORITY AREA
            });
            console.log('Created Test Issue:', issueTitle);

            // Log Initial Status
            await IssueStatus.create({
                issueId: issue._id,
                status: 'Open',
                updatedBy: citizen._id,
                remarks: 'Initial Report'
            });
        } else {
            // Reset status if it exists so we can test again
            issue.status = 'Open';
            await issue.save();
            console.log('Reset Test Issue Status to Open');
        }

        console.log('\n--- TEST SCENARIO READY ---');
        console.log(`Authority URL: http://localhost:4202 (Check angular.json)`);
        console.log(`Login: ${authorityEmail} / ${password}`);
        console.log(`Issue to Resolve: "${issueTitle}"`);

        process.exit();
    } catch (error) {
        console.error('Error seeding test scenario:', error);
        process.exit(1);
    }
};

seedTestScenario();
