const mongoose = require('mongoose');
const Area = require('./src/models/Area');
const Zone = require('./src/models/Zone');
require('dotenv').config();

// Base Surat Coordinates
const SURAT_LAT = 21.1702;
const SURAT_LNG = 72.8311;

// Offsets to simulate distribution (rough approximation)
const ZONE_OFFSETS = {
    'Central Zone': { lat: 0, lng: 0 },
    'West Zone': { lat: 0.02, lng: -0.04 },
    'North Zone': { lat: 0.04, lng: 0 },
    'East Zone': { lat: 0, lng: 0.04 },
    'South Zone': { lat: -0.04, lng: 0 },
    'South West Zone': { lat: -0.03, lng: -0.03 },
    'South East Zone': { lat: -0.03, lng: 0.03 }
};

const seedAreas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Seeding Areas ---');

        await Area.deleteMany({});
        console.log('Cleared existing areas.');

        const zones = await Zone.find({});
        if (zones.length === 0) {
            console.error('No zones found! Please run seed_zones.js first.');
            process.exit(1);
        }

        let totalAreas = 0;

        for (const zone of zones) {
            const offset = ZONE_OFFSETS[zone.zoneName] || { lat: 0, lng: 0 };

            // Distribute localities slightly around the zone center
            let locIndex = 0;
            for (const localityName of zone.localities) {
                // capitalize properly
                let formattedName = localityName.charAt(0).toUpperCase() + localityName.slice(1);

                // Handle known duplicates from seed_zones.js
                if (formattedName === 'Bamroli' || formattedName === 'Limbayat' || formattedName === 'Dindoli' || formattedName === 'Magob') {
                    formattedName = `${formattedName} (${zone.zoneName})`;
                }

                // Also Parvat and Godadara typically appear in multiple lists in the provided seed
                if (formattedName === 'Parvat' || formattedName === 'Godadara') {
                    formattedName = `${formattedName} (${zone.zoneName})`;
                }

                // Small random jitter so they aren't all on top of each other
                const jitterLat = (Math.random() - 0.5) * 0.02;
                const jitterLng = (Math.random() - 0.5) * 0.02;

                const areaData = {
                    areaName: formattedName,
                    zoneId: zone._id,
                    city: zone.city,
                    state: zone.state,
                    pincode: '39500' + (locIndex % 9), // Mock pincode
                    centerLocation: {
                        type: 'Point',
                        coordinates: [
                            SURAT_LNG + offset.lng + jitterLng,
                            SURAT_LAT + offset.lat + jitterLat
                        ]
                    }
                };

                // Use updateOne with upsert to avoid duplicate errors on re-runs and handle the unique constraint gracefully
                // actually simpler to just try-catch or ensure names are unique. 
                // The formatting above should resolve the specific "Bamroli" error.
                await Area.create(areaData);
                totalAreas++;
                locIndex++;
            }
        }

        console.log(`Successfully seeded ${totalAreas} areas linked to zones.`);
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedAreas();
