const mongoose = require('mongoose');
const Issue = require('./src/models/Issue');
require('dotenv').config();

const clean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const res = await Issue.deleteMany({ title: 'dscac' });
        console.log(`Deleted ${res.deletedCount} issues with title 'dscac'.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

clean();
