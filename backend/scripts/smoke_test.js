try {
    const Issue = require('../src/models/Issue');
    const issueController = require('../src/controllers/issueController');
    const userController = require('../src/controllers/userController');
    console.log('Modules loaded successfully');
    process.exit(0);
} catch (error) {
    console.error('Startup Error:', error);
    process.exit(1);
}
