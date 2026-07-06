const Zone = require('../models/Zone');

// @desc    Create a new Zone
// @route   POST /api/zones
// @access  Admin
const createZone = async (req, res) => {
    try {
        const { zoneName, state, city, localities } = req.body;

        const existing = await Zone.findOne({ zoneName });
        if (existing) return res.status(400).json({ message: 'Zone already exists' });

        const zone = await Zone.create({ zoneName, state, city, localities });
        res.status(201).json(zone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Zones
// @route   GET /api/zones
// @access  Public (for registration dropdowns)
const getZones = async (req, res) => {
    try {
        const zones = await Zone.find({}).sort({ zoneName: 1 });
        res.json(zones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add localities to a zone
// @route   PUT /api/zones/:id/localities
const updateZoneLocalities = async (req, res) => {
    try {
        const { localities } = req.body; // Array of strings
        const zone = await Zone.findById(req.params.id);

        if (!zone) return res.status(404).json({ message: 'Zone not found' });

        // Merge unique
        const newLocalities = [...new Set([...zone.localities, ...localities])];
        zone.localities = newLocalities;
        await zone.save();

        res.json(zone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createZone = createZone;
exports.getZones = getZones;
exports.updateZoneLocalities = updateZoneLocalities;
