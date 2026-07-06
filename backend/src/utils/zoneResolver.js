const Zone = require('../models/Zone');

// In-Memory Fallback to catch generic keywords if DB matching is too specific
const GENERIC_KEYWORD_MAP = {
    'varachha': 'East Zone',
    'katargam': 'North Zone',
    'adajan': 'West Zone',
    'udhna': 'South Zone',
    'athwa': 'South West Zone',
    'vesu': 'South West Zone',
    'central': 'Central Zone',
    'surat': 'Central Zone' // Extreme fallback
};

/**
 * Resolves a zone based on address components.
 * Priority:
 * 1. Exact DB match (regex on list)
 * 2. Partial DB match (contains word)
 * 3. Keyword Map
 * @param {string} locality - Suburb/Neighbourhood
 * @param {string} city - City name
 * @returns {Promise<string|null>} Zone Name or null
 */
const resolveZone = async (locality, city) => {
    try {
        if (!locality) return null;

        const normalizedLocality = locality.toLowerCase().trim();
        const terms = normalizedLocality.split(/[\s,]+/).filter(t => t.length > 3); // Split into significant words

        // 1. EXACT/FUZZY DB MATCH
        // Check if any stored locality matches the input string partially
        // We iterate through all zones (cached or queried)
        // For efficiency, we query where localities matches any term

        // Construct regex for each term
        const regexConditions = terms.map(term => new RegExp(term, 'i'));

        const dbZone = await Zone.findOne({
            localities: { $in: regexConditions }
        });

        if (dbZone) {
            console.log(`[ZoneResolver] DB Match: "${locality}" -> ${dbZone.zoneName}`);
            return dbZone.zoneName;
        }

        // 2. CHECK LEGACY FALLBACK
        for (const [key, zoneName] of Object.entries(GENERIC_KEYWORD_MAP)) {
            if (normalizedLocality.includes(key)) {
                console.log(`[ZoneResolver] Keyword Match: "${locality}" -> ${zoneName}`);
                return zoneName;
            }
        }

        console.warn(`[ZoneResolver] Unmapped area: "${locality}"`);
        return null;
    } catch (error) {
        console.error('Zone Resolution Error:', error);
        return null;
    }
};

const resolveZoneFromCoords = async (lat, lng) => {
    try {
        if (!lat || !lng) return null;

        // MongoDB Geo-Query
        const zone = await Zone.findOne({
            geoPolygon: {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)] // Input: [lng, lat]
                    }
                }
            }
        });

        if (zone) {
            console.log(`[ZoneResolver] Geo Match: (${lat},${lng}) -> ${zone.zoneName}`);
            return zone.zoneName;
        }
        return null;
    } catch (error) {
        console.error('Geo Zone Resolution Error:', error);
        return null;
    }
};

module.exports = { resolveZone, resolveZoneFromCoords };
