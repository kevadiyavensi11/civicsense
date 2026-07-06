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
