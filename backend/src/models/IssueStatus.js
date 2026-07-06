const mongoose = require('mongoose');

const issueStatusSchema = new mongoose.Schema({
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    status: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    remarks: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IssueStatus', issueStatusSchema);
