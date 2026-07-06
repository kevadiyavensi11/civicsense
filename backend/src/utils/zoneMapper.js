const ZONE_MASTER_TABLE = {
    // East Zone (Varachha, Mota Varachha)
    "East Zone": [
        "Varachha", "Mota Varachha", "Sarthana", "Simada", "Nana Varachha", "Punagam", "Kapodra"
    ],
    // North Zone (Katargam, Amroli)
    "North Zone": [
        "Katargam", "Amroli", "Gothan", "Kosad", "Ved Road", "Dabholi", "Singanpor"
    ],
    // West Zone (Adajan, Rander)
    "West Zone": [
        "Adajan", "Rander", "Pal", "Palanpur", "Jahangirpura", "Vesu"
    ],
    // South Zone (Udhna, Limbayat)
    "South Zone": [
        "Udhna", "Limbayat", "Bhestan", "Pandesara", "Unn", "Bamroli"
    ],
    // Central Zone (Athwa, Chowk)
    "Central Zone": [
        "Central", "Athwa", "Chowk Bazar", "Nanpura", "Mahidharpura", "Salabatpura", "Gopipura"
    ]
};

const resolveZone = (areaName) => {
    if (!areaName) return null;
    const normalizedArea = areaName.trim().toLowerCase();

    for (const [zone, areas] of Object.entries(ZONE_MASTER_TABLE)) {
        if (areas.some(a => normalizedArea.includes(a.toLowerCase()))) {
            return zone;
        }
    }
    return null; // OR "Unmapped" if we want to allow it but flag it
};

module.exports = { resolveZone, ZONE_MASTER_TABLE };
