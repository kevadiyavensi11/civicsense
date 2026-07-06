const User = require('../models/User');
const Issue = require('../models/Issue');
const Area = require('../models/Area');
const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');

// @desc    Get system-wide dashboard stats
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Metrics
        const [totalIssues, totalUsers, totalNotifications, totalMessages] = await Promise.all([
            Issue.countDocuments(),
            User.countDocuments(),
            Notification.countDocuments(),
            ContactMessage.countDocuments()
        ]);

        // 2. Charts Mapping (ngx-charts format: { name: string, value: number })

        // Monthly Trends (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyTrendsRaw = await Issue.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%b %Y", date: "$createdAt" } },
                    count: { $sum: 1 },
                    sortOrder: { $min: "$createdAt" }
                }
            },
            { $sort: { sortOrder: 1 } }
        ]);
        const monthlyTrends = monthlyTrendsRaw.map(item => ({
            name: item._id,
            value: item.count
        }));

        // Category Distribution
        const categoryDataRaw = await Issue.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        const categoryDistribution = categoryDataRaw.map(item => ({
            name: item._id || 'Uncategorized',
            value: item.count
        }));

        // Priority Distribution
        const priorityDataRaw = await Issue.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);
        const priorityDistribution = priorityDataRaw.map(item => ({
            name: item._id || 'Unknown',
            value: item.count
        }));

        res.json({
            totalIssues,
            totalUsers,
            totalNotifications,
            totalMessages,
            monthlyTrends,
            categoryDistribution,
            priorityDistribution
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ message: 'Server Error fetching dashboard stats' });
    }
};

// @desc    Get system stats (legacy)
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getSystemStats = async (req, res) => {
    // ... existing getSystemStats implementation ...
    try {
        // 1. Basic Counts
        const totalUsers = await User.countDocuments() || 0;
        const totalCitizens = await User.countDocuments({ role: 'citizen' }) || 0;
        const totalAuthorities = await User.countDocuments({ role: 'authority' }) || 0;

        const totalIssues = await Issue.countDocuments() || 0;
        const pendingIssues = await Issue.countDocuments({ status: { $in: ['Open', 'In Progress'] } }) || 0;
        const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' }) || 0;

        // 2. Recent Activity
        const recentActivity = await Issue.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('reportedBy', 'name email role')
            .select('title status createdAt reportedBy') || [];

        // 3. Charts Data - with null checks

        // Status Distribution
        const statusDistRaw = await Issue.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const statusDistribution = statusDistRaw.filter(i => i._id) || [];

        // Category Distribution
        const categoryDistRaw = await Issue.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        const categoryDistribution = categoryDistRaw.filter(i => i._id) || [];

        // Priority Distribution
        const priorityDistRaw = await Issue.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);
        const priorityDistribution = priorityDistRaw.filter(i => i._id) || [];

        // Monthly Issues (Last 12 Months)
        const monthlyIssuesRaw = await Issue.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        // Filter out any null _id (e.g. invalid dates)
        const monthlyIssues = monthlyIssuesRaw.filter(i => i._id !== null) || [];

        const responseData = {
            metrics: {
                totalUsers,
                totalCitizens,
                totalAuthorities,
                totalIssues,
                pendingIssues,
                resolvedIssues
            },
            recentActivity,
            charts: {
                statusDistribution,
                categoryDistribution,
                priorityDistribution,
                monthlyIssues
            }
        };

        res.json(responseData);

    } catch (error) {
        console.error('Stats Error Full:', error);
        res.status(500).json({
            message: 'Server Error fetching stats',
            error: error.message
        });
    }
};

// @desc    Get all users with pagination, sorting, and filtering
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role, sortBy = 'createdAt', order = 'desc' } = req.query;

        // Build Query
        const query = {};
        if (role && role !== 'all') {
            query.role = role;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute Query with Pagination
        const users = await User.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-password'); // Exclude password

        const total = await User.countDocuments(query);

        res.json({
            users,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ message: 'Server Error fetching users' });
    }
};

// @desc    Update User Status (Activate/Deactivate) or Role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { status, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (status) user.isActive = status === 'active'; // Assuming User model has isActive or similar
        // If User model doesn't have isActive, we might need to add it or use another field.
        // For now let's assume we can update role too.
        if (role) user.role = role;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server Error updating user' });
    }
};

// @desc    Get detailed complaint analytics for charts
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getComplaintAnalytics = async (req, res) => {
    try {
        // 1. Line Chart: Issues created over last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await Issue.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Heatmap/KPI: Issues by Category
        const categoryDistribution = await Issue.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // 3. Priority Distribution
        const priorityDistribution = await Issue.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        res.json({
            monthlyTrend,
            categoryDistribution,
            priorityDistribution
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server Error fetching analytics' });
    }
};

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get User By ID Error:', error);
        res.status(500).json({ message: 'Server Error fetching user' });
    }
};

exports.getDashboardStats = getDashboardStats;
exports.getSystemStats = getSystemStats;
exports.getUsers = getUsers;
exports.updateUserStatus = updateUserStatus;
exports.getComplaintAnalytics = getComplaintAnalytics;
exports.getUserById = getUserById;
