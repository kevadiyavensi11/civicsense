const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Pothole', 'Garbage', 'Streetlight'
    imageUrl: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        fullAddress: { type: String },
        state: { type: String },
        city: { type: String },
        locality: { type: String },
        pincode: { type: String },
        accuracy: { type: Number }, // Accuracy radius in meters
        source: { type: String, enum: ['GPS', 'Manual', 'Wi-Fi/IP'], default: 'GPS' }
    },
    zone: { type: String }, // e.g., "North Zone"
    authorityId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned Authority
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Open'
    },
    resolutionImageUrl: { type: String }, // NEW: Proof of resolution
    systemVerified: { type: Boolean, default: false },
    priorityLevel: { type: Number, default: 0 }, // 0-100 system score
    verificationRemarks: { type: String }, // System Auto-generated remarks
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    createdById: { type: String, required: true, index: true }, // MANDATORY: Citizen ID String
    createdByRole: { type: String, required: true, default: 'CITIZEN' }, // MANDATORY: Role
    createdByEmail: { type: String, required: true, index: true }, // MANDATORY: Email
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    jurisdictionArea: { type: String, required: false, index: true }, // Required: false for now to support legacy data
    assignedAuthorityId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
