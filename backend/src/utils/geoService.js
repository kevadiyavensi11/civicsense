const axios = require('axios');

// Basic cache to prevent spamming Nominatim (Free Tier Rules)
const cache = new Map();

const getAddressFromCoordinates = async (lat, lng) => {
    try {
        if (!lat || !lng) throw new Error('Coordinates required');

        // Create a cache key (rounding to 4 decimal places ~11m precision)
        // const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        // if (cache.has(cacheKey)) {
        //     console.log('[GeoService] Returning cached location');
        //     return cache.get(cacheKey);
        // }

        // Delay to respect rate limits (1 second absolute minimum between calls)
        await new Promise(resolve => setTimeout(resolve, 1200));

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

        // Nominatim Usage Policy: "Provide a valid User-Agent"
        const headers = { 'User-Agent': 'CivicSense-Platform/1.0 (admin@civicsense.gov.in)' };

        const response = await axios.get(url, { headers });
        const data = response.data;

        if (!data || !data.address) {
            throw new Error('Nominatim returned no address');
        }

        // Parse OSM structure
        const addr = data.address;

        // Extract fields
        const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || addr.locality || 'Unknown Locality';
        const city = addr.city || addr.town || addr.municipality || 'Surat'; // Fallback for project context
        const state = addr.state || 'Gujarat';
        const pincode = addr.postcode || '';

        const result = {
            fullAddress: data.display_name,
            locality: locality,
            city: city,
            state: state,
            pincode: pincode,
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lon)
        };

        // Save to cache - DISABLED
        // cache.set(cacheKey, result);
        // if (cache.size > 100) {
        //     const firstKey = cache.keys().next().value;
        //     cache.delete(firstKey);
        // }

        return result;

    } catch (error) {
        console.warn('GeoService Error:', error.message);
        // FALLBACK: If geo service fails, return structured object with raw coords
        // This ensures the system "NEVER blocks issue creation"
        return {
            fullAddress: `GPS Location: ${lat}, ${lng}`,
            locality: 'Unmapped',
            city: 'Unknown',
            state: 'Unknown',
            pincode: '',
            lat: lat,
            lng: lng
        };
    }
};

// Address -> Coords (Forward Geocoding)
const getCoordinatesFromAddress = async (query) => {
    try {
        if (!query) throw new Error('Query required');

        await new Promise(resolve => setTimeout(resolve, 1200));

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=1`;
        const headers = { 'User-Agent': 'CivicSense-Platform/1.0 (admin@civicsense.gov.in)' };

        const response = await axios.get(url, { headers });
        const data = response.data;

        if (!data || data.length === 0) {
            throw new Error('No results found');
        }

        const result = data[0];
        const addr = result.address || {};

        return {
            fullAddress: result.display_name,
            locality: addr.suburb || addr.neighbourhood || addr.residential || addr.locality || 'Unknown',
            city: addr.city || addr.town || addr.municipality || 'Surat',
            state: addr.state || 'Gujarat',
            pincode: addr.postcode || '',
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
        };

    } catch (error) {
        console.warn('Forward Geo Failed:', error.message);
        return null;
    }
};

module.exports = { getAddressFromCoordinates, getCoordinatesFromAddress };
