const Area = require('../models/Area');
const Zone = require('../models/Zone');

// @desc    Create new Area
// @route   POST /api/areas
// @access  Private (Admin)
const createArea = async (req, res) => {
    try {
        const { areaName, zoneId, city, state, pincode, centerLocation, boundary } = req.body;

        const zone = await Zone.findById(zoneId);
        if (!zone) {
            return res.status(404).json({ message: 'Zone not found' });
        }

        const area = await Area.create({
            areaName,
            zoneId,
            city,
            state,
            pincode,
            centerLocation,
            boundary
        });

        res.status(201).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all areas
// @route   GET /api/areas
// @access  Private
const getAreas = async (req, res) => {
    try {
        const areas = await Area.find().populate('zoneId', 'zoneName city');
        res.json(areas);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Resolve Area by Lat/Lng
// @route   POST /api/areas/resolve
// @access  Public
const resolveArea = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        // 1. Try to find if point is within any Area polygon (most accurate)
        let area = await Area.findOne({
            boundary: {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    }
                }
            }
        }).populate('zoneId');

        // 2. If no polygon match (or no polygons defined), find nearest centerLocation
        if (!area) {
            area = await Area.findOne({
                centerLocation: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: 5000 // 5km radius search
                    }
                }
            }).populate('zoneId');
        }

        if (!area) {
            return res.status(404).json({ message: 'No service area found for this location.' });
        }

        res.json({
            success: true,
            area: {
                _id: area._id,
                areaName: area.areaName,
                zone: area.zoneId,
                city: area.city
            }
        });

    } catch (error) {
        console.error('Resolve Area Error:', error);
        res.status(500).json({ message: 'Server Error resolving location' });
    }
};

exports.createArea = createArea;
exports.getAreas = getAreas;
exports.resolveArea = resolveArea;
