const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));
// app.use(helmet());

// Routes
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/issues', require('./src/routes/issueRoutes'));
app.use('/api/areas', require('./src/routes/areaRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/zones', require('./src/routes/zoneRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/authority', require('./src/routes/authorityRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));
app.use('/api/citizen/contact', require('./src/routes/contactRoutes'));

// Root Route
app.get('/', (req, res) => {
    res.send('CivicSense API is running...');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
