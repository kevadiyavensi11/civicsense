# Database Schemas (Mongoose Models)

## 1. Area.js
Location: `src/models/Area.js`
```javascript
const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    areaName: { type: String, required: true, trim: true },
    zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
    city: { type: String, required: true, default: 'Surat' },
    state: { type: String, required: true, default: 'Gujarat' },
    pincode: { type: String, required: false }, // Optional initially
    centerLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    boundary: { // Optional polygon for precise area matching
        type: { type: String, enum: ['Polygon'] },
        coordinates: { type: [[[Number]]] }
    }
}, { timestamps: true });

// Ensure unique areas within a city
areaSchema.index({ areaName: 1, city: 1 }, { unique: true });

// Geospatial index for proximity search
areaSchema.index({ centerLocation: "2dsphere" });
areaSchema.index({ boundary: "2dsphere" });

module.exports = mongoose.model('Area', areaSchema);
```

## 2. Issue.js
Location: `src/models/Issue.js`
```javascript
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
    aiVerified: { type: Boolean, default: false },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    createdById: { type: String, required: true, index: true }, // MANDATORY: Citizen ID String
    createdByRole: { type: String, required: true, default: 'CITIZEN' }, // MANDATORY: Role
    createdByEmail: { type: String, required: true, index: true }, // MANDATORY: Email
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    jurisdictionArea: { type: String, required: false, index: true }, // Required: false for now to support legacy data
    assignedAuthorityId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
```

## 3. IssueStatus.js
Location: `src/models/IssueStatus.js`
```javascript
const mongoose = require('mongoose');

const issueStatusSchema = new mongoose.Schema({
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    status: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    remarks: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IssueStatus', issueStatusSchema);
```

## 4. User.js
Location: `src/models/User.js`
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    phone: { type: String },
    role: {
        type: String,
        enum: ['citizen', 'authority', 'admin'],
        default: 'citizen'
    },
    photoUrl: { type: String },
    area: { type: String }, // specific sub-area (optional)
    // Authority Routing Fields
    state: { type: String },
    city: { type: String },
    zone: { type: String }, // e.g. "West Zone"
    isActive: { type: Boolean, default: true },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    otp: { type: String },
    otpExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

## 5. Zone.js
Location: `src/models/Zone.js`
```javascript
const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
    zoneName: { type: String, required: true, unique: true }, // e.g. "North Zone"
    state: { type: String, required: true, default: 'Gujarat' },
    city: { type: String, required: true, default: 'Surat' },
    localities: [{ type: String }], // List of localities that belong to this zone
    geoPolygon: { // Optional: For future GeoJSON implementation
        type: { type: String, enum: ['Polygon'], default: 'Polygon' },
        coordinates: { type: [[[Number]]] } // Array of arrays of arrays of numbers
    }
}, { timestamps: true });

zoneSchema.index({ type: "2dsphere" }); // Index for geospatial queries if using polygons

module.exports = mongoose.model('Zone', zoneSchema);
```

## 6. Notification.js
Location: `src/models/Notification.js`
```javascript
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // If null, look at recipientRole
    },
    recipientRole: {
        type: String,
        enum: ['citizen', 'authority', 'admin', 'all'],
        default: null // If null, look at recipient
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'alert', 'warning', 'success'],
        default: 'info'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
notificationSchema.index({ recipient: 1, recipientRole: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
```
