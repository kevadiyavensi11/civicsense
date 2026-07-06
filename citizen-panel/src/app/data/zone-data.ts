
export interface Coordinate {
    lat: number;
    lng: number;
}

export interface ZoneBoundary {
    name: string;
    polygon: Coordinate[];
    center: Coordinate;
}

// Standardized Surat Zones (Synchronized across all panels)
export const ZONE_BOUNDARIES: ZoneBoundary[] = [
    {
        name: 'Central Zone',
        center: { lat: 21.1850, lng: 72.8250 },
        polygon: [
            { lat: 21.2000, lng: 72.8100 },
            { lat: 21.2000, lng: 72.8400 },
            { lat: 21.1700, lng: 72.8400 },
            { lat: 21.1700, lng: 72.8100 }
        ]
    },
    {
        name: 'North Zone',
        center: { lat: 21.2300, lng: 72.8350 },
        polygon: [
            { lat: 21.2600, lng: 72.8100 },
            { lat: 21.2600, lng: 72.8600 },
            { lat: 21.2000, lng: 72.8600 },
            { lat: 21.2000, lng: 72.8100 }
        ]
    },
    {
        name: 'East Zone',
        center: { lat: 21.2100, lng: 72.8900 },
        polygon: [
            { lat: 21.2400, lng: 72.8600 },
            { lat: 21.2400, lng: 72.9200 },
            { lat: 21.1800, lng: 72.9200 },
            { lat: 21.1800, lng: 72.8600 }
        ]
    },
    {
        name: 'West Zone',
        center: { lat: 21.1950, lng: 72.7800 },
        polygon: [
            { lat: 21.2300, lng: 72.7500 },
            { lat: 21.2300, lng: 72.8100 },
            { lat: 21.1600, lng: 72.8100 },
            { lat: 21.1600, lng: 72.7500 }
        ]
    },
    {
        name: 'South Zone',
        center: { lat: 21.1350, lng: 72.8350 },
        polygon: [
            { lat: 21.1700, lng: 72.8100 },
            { lat: 21.1700, lng: 72.8600 },
            { lat: 21.1000, lng: 72.8600 },
            { lat: 21.1000, lng: 72.8100 }
        ]
    },
    {
        name: 'South West Zone',
        center: { lat: 21.1450, lng: 72.7750 },
        polygon: [
            { lat: 21.1700, lng: 72.7500 },
            { lat: 21.1700, lng: 72.8100 },
            { lat: 21.1200, lng: 72.8000 },
            { lat: 21.1200, lng: 72.7500 }
        ]
    },
    {
        name: 'South East Zone',
        center: { lat: 21.1550, lng: 72.8900 },
        polygon: [
            { lat: 21.1800, lng: 72.8600 },
            { lat: 21.1800, lng: 72.9200 },
            { lat: 21.1300, lng: 72.9200 },
            { lat: 21.1300, lng: 72.8600 }
        ]
    },
    {
        name: 'Varachha-B Zone',
        center: { lat: 21.2350, lng: 72.9200 },
        polygon: [
            { lat: 21.2500, lng: 72.8900 },
            { lat: 21.2500, lng: 72.9500 },
            { lat: 21.2200, lng: 72.9500 },
            { lat: 21.2200, lng: 72.8900 }
        ]
    }
];
