const mongoose = require('mongoose');
const Zone = require('./src/models/Zone');
require('dotenv').config();

const SURAT_ZONES = [
    {
        zoneName: 'Central Zone',
        state: 'Gujarat',
        city: 'Surat',
        localities: [
            'Athwagate', 'Nanpura', 'Chowk Bazar', 'Gopipura', 'Mahidharpura', 'Haripura', 'Rampura',
            'Begampura', 'Salabatpura', 'Sagrampura', 'Rudarpura', 'Sonifalia', 'Wadi Falia', 'Kelapith'
        ]
    },
    {
        zoneName: 'West Zone',
        state: 'Gujarat',
        city: 'Surat',
        localities: [
            'Rander', 'Adajan', 'Pal', 'Palanpur', 'Jahangirpura', 'Pisad', 'Variyav', 'Bhesan',
            'Jahangirabad', 'Mora', 'Sultanabad', 'Bhatpore', 'Ichhapore'
        ]
    },
    {
        zoneName: 'North Zone',
        state: 'Gujarat',
        city: 'Surat',
        localities: [
            'Katargam', 'Ved Road', 'Dabholi', 'Singanpore', 'Gotalawadi', 'Nani Bahucharaji',
            'Phulpada', 'Amroli', 'Chhapra Bhatha', 'Kosad', 'Utran', 'Variav', 'Sayan'
        ]
    },
    {
        zoneName: 'East Zone',
        state: 'Gujarat',
        city: 'Surat',
        localities: [
            'Varachha', 'Kapodra', 'Puna', 'Sarthana', 'Simada', 'Nana Varachha', 'Mota Varachha',
            'Karanj', 'Laskana', 'Pasodara', 'Khadsad', 'Abrama', 'Valak'
        ]
    },
    {
        zoneName: 'South Zone',
        state: 'Gujarat',
        city: 'Surat',
        localities: [
            'Udhna', 'Limbayat', 'Pandesara', 'Bhestan', 'Unn', 'Bamroli', 'Gabheni', 'Jiav',
            'Budia', 'Dindoli', 'Godadara', 'Parvat', 'Magob', 'Kharvasa'
        ]
    },
    {
        zoneName: 'South West Zone',
        state: 'Gujarat',
        city: 'Surat',
        localities: [
            'Athwa', 'Vesu', 'Dumas', 'Piplod', 'Bhimrad', 'Sarsana', 'Althan', 'Bhatar',
            'Bamroli', 'Magdalla', 'Gaviyar', 'Vanta', 'Dumas Road'
        ]
    },
    {
        zoneName: 'South East Zone',
        state: 'Gujarat',
        city: 'Surat',
        localities: [
            'Limbayat', 'Dindoli', 'Parvat', 'Godadara', 'Magob', 'Dumbhal', 'Anjana', 'Mithi Khadi'
        ]
    }
];

const seedZones = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Seeding Zones ---');

        await Zone.deleteMany({}); // Clear old zones
        console.log('Cleared existing zones.');

        for (const z of SURAT_ZONES) {
            // Normalize localities for easier matching
            z.localities = z.localities.map(l => l.toLowerCase());
            await Zone.create(z);
        }

        console.log(`Successfully seeded ${SURAT_ZONES.length} zones.`);
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedZones();
