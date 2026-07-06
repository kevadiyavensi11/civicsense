const mongoose = require('mongoose');
const Zone = require('./src/models/Zone');
require('dotenv').config();

// Sourced from citizen-panel/src/app/data/zone-data.ts
// TRANSFORMATION NOTE: Leaflet is {lat, lng}, MongoDB is [lng, lat]
const ZONE_POLYGONS = [
    {
        name: 'West Zone',
        points: [
            { lat: 21.2300, lng: 72.7500 },
            { lat: 21.2300, lng: 72.8100 },
            { lat: 21.1600, lng: 72.8100 },
            { lat: 21.1600, lng: 72.7500 }
        ]
    },
    {
        name: 'Central Zone',
        points: [
            { lat: 21.2000, lng: 72.8100 },
            { lat: 21.2000, lng: 72.8400 },
            { lat: 21.1700, lng: 72.8400 },
            { lat: 21.1700, lng: 72.8100 }
        ]
    },
    {
        name: 'North Zone',
        points: [
            { lat: 21.2600, lng: 72.8100 },
            { lat: 21.2600, lng: 72.8600 },
            { lat: 21.2000, lng: 72.8600 },
            { lat: 21.2000, lng: 72.8100 }
        ]
    },
    {
        name: 'East Zone',
        points: [
            { lat: 21.2400, lng: 72.8600 },
            { lat: 21.2400, lng: 72.9200 },
            { lat: 21.1800, lng: 72.9200 },
            { lat: 21.1800, lng: 72.8600 },
            { lat: 21.2000, lng: 72.8400 }
        ]
    },
    {
        name: 'South Zone',
        points: [
            { lat: 21.1700, lng: 72.8100 },
            { lat: 21.1700, lng: 72.8600 },
            { lat: 21.1000, lng: 72.8600 },
            { lat: 21.1000, lng: 72.8100 }
        ]
    },
    {
        name: 'South West Zone',
        points: [
            { lat: 21.1700, lng: 72.7500 },
            { lat: 21.1700, lng: 72.8100 },
            { lat: 21.1200, lng: 72.7500 }
        ]
    }
];

const seedGeo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- SEEDING GEO ZONES ---');

        for (const z of ZONE_POLYGONS) {
            // Convert to GeoJSON Format: [[[lng, lat], [lng, lat], ...]]
            const coords = z.points.map(p => [p.lng, p.lat]);

            // Close the polygon if not closed
            if (coords.length > 0) {
                const first = coords[0];
                const last = coords[coords.length - 1];
                if (first[0] !== last[0] || first[1] !== last[1]) {
                    coords.push(first);
                }
            }

            const geoPolygon = {
                type: 'Polygon',
                coordinates: [coords]
            };

            // Update existing zones
            const res = await Zone.updateOne(
                { zoneName: z.name },
                { $set: { geoPolygon: geoPolygon } }
            );

            if (res.matchedCount > 0) {
                console.log(`Updated ${z.name}: Polygon Set.`);
            } else {
                console.log(`Skipped ${z.name}: Not found in DB.`);
            }
        }

        console.log('Done.');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedGeo();
