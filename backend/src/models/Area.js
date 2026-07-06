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
