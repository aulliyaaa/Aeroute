import { ScenarioPreset } from './types';

export const SCENARIO_SUDIRMAN_BINUS: ScenarioPreset = {
  id: 'sudirman_binus',
  title: 'FX Sudirman → Kampus Binus',
  subtitle: 'Skenario Unggulan Demo Juri',
  origin: {
    name: 'FX Sudirman (Pintu Senayan)',
    detail: 'Jl. Jenderal Sudirman, Senayan, Jakarta Selatan',
    coords: [-6.2255, 106.8041],
  },
  destination: {
    name: 'Kampus Binus Anggrek (Palmerah)',
    detail: 'Jl. Raya Kebon Jeruk No.27, Kemanggisan, Jakarta Barat',
    coords: [-6.2017, 106.7822],
  },
  greenRoute: {
    id: 'green',
    title: '32 mnt (+7 mnt vs arteri) • 8.4 km',
    durationMinutes: 32,
    durationComparisonText: '+7 mnt vs arteri',
    distanceKm: 8.4,
    aqi: 58,
    aqiLabel: 'Paparan Polusi Rendah (AQI 58)',
    aqiColor: 'green',
    badge: 'RECOMMENDED',
    partikelTerhindar: '-42µg Partikel Terhindar',
    corridorName: 'Koridor Taman Senayan',
    description: 'Mengarahkan via koridor hijau Senayan-Palmerah untuk memangkas inhalasi PM2.5 sebesar 38% dari kemacetan padat Semanggi.',
  },
  redRoute: {
    id: 'red',
    title: '25 mnt Tercepat • 7.1 km',
    durationMinutes: 25,
    durationComparisonText: 'Tercepat',
    distanceKm: 7.1,
    aqi: 154,
    aqiLabel: 'Paparan Polusi Tinggi (AQI 154)',
    aqiColor: 'red',
    badge: 'Tercepat',
    warning: 'Kemacetan padat & asap knalpot Jl. Gatot Subroto',
    description: 'Rute tercepat namun melintasi bottleneck Semanggi & arteri tol dalam kota dengan konsentrasi aerosol hitam pekat.',
  },
  aiExplanation:
    'AI membelokkan rute Anda menjauhi simpang Semanggi yang sedang mengalami stagnasi polusi akibat kemacetan truk jam 08:30. Anda diarahkan melewati koridor teduh pepohonan Senayan yang menurunkan konsentrasi partikel mikro hingga 30% lebih bersih.',
  exposureSavingsPct: 38,
  avoidedParticulateUg: 42,
  cigaretteEquivalent: 2.4,
  segments: [
    { name: '1. Titik Awal', aqi: 68, status: 'Sedang', color: '#f59e0b', pct: 25 },
    { name: '2. Senayan Hijau', aqi: 22, status: 'Bersih', color: '#10b981', pct: 35 },
    { name: '3. Koridor Slipi', aqi: 54, status: 'Sedang', color: '#f59e0b', pct: 25 },
    { name: '4. Area Kampus', aqi: 35, status: 'Baik', color: '#10b981', pct: 15 },
  ],
  currentAqi: 142,
  currentAqiStatus: 'Sensitif Waspada',
  currentLocationName: 'Bundaran HI • 4 mnt lalu',
  pm25: 56.8,
  temp: 31,
  humidity: 72,
};

export const SCENARIO_TEBET_SCBD: ScenarioPreset = {
  id: 'tebet_scbd',
  title: 'Rumah (Tebet) → Kantor SCBD',
  subtitle: 'Koridor Pagi Komuter',
  origin: {
    name: 'Rumah (Tebet Barat)',
    detail: 'Jl. Tebet Barat Dalam Raya, Jakarta Selatan',
    coords: [-6.2378, 106.8522],
  },
  destination: {
    name: 'Pacific Place (SCBD)',
    detail: 'Jl. Jenderal Sudirman Kav 52-53, Jakarta Selatan',
    coords: [-6.2248, 106.8098],
  },
  greenRoute: {
    id: 'green',
    title: '24 mnt (+4 mnt) • 6.2 km',
    durationMinutes: 24,
    durationComparisonText: '+4 mnt vs Casablanca',
    distanceKm: 6.2,
    aqi: 45,
    aqiLabel: 'Paparan Polusi Rendah (AQI 45)',
    aqiColor: 'green',
    badge: 'RECOMMENDED',
    partikelTerhindar: '-34µg Partikel Terhindar',
    corridorName: 'Taman Tebet Eco Park Corridor',
    description: 'Menghindari flyover Casablanca yang padat emisi, melipir via jalur lingkar perumahan rindang.',
  },
  redRoute: {
    id: 'red',
    title: '20 mnt Tercepat • 5.1 km',
    durationMinutes: 20,
    durationComparisonText: 'Tercepat',
    distanceKm: 5.1,
    aqi: 168,
    aqiLabel: 'Paparan Polusi Ekstrem (AQI 168)',
    aqiColor: 'red',
    badge: 'Tercepat',
    warning: 'Gas buang diesel pekat Flyover Casablanca',
    description: 'Kemacetan total dengan paparan NO2 tinggi di atas jalan layang non-tol.',
  },
  aiExplanation:
    'AeroRoute mendeteksi inversi suhu pagi di koridor Casablanca yang mengurung asap kendaraan. Mengalihkan ke rute selatan memotong akumulasi paparan 45%.',
  exposureSavingsPct: 45,
  avoidedParticulateUg: 34,
  cigaretteEquivalent: 1.9,
  segments: [
    { name: '1. Tebet Barat', aqi: 48, status: 'Baik', color: '#10b981', pct: 30 },
    { name: '2. Tendean Koridor', aqi: 52, status: 'Sedang', color: '#f59e0b', pct: 30 },
    { name: '3. Senopati Hijau', aqi: 28, status: 'Sangat Baik', color: '#10b981', pct: 25 },
    { name: '4. SCBD Gate', aqi: 40, status: 'Baik', color: '#10b981', pct: 15 },
  ],
  currentAqi: 156,
  currentAqiStatus: 'Tidak Sehat',
  currentLocationName: 'Tebet Timur • 2 mnt lalu',
  pm25: 64.2,
  temp: 30,
  humidity: 78,
};

// Polyline sample coordinates for Sudirman -> Binus Anggrek
export const ROUTE_COORDS = {
  // AeroRoute green path: through Senayan parks & Palmerah tree-lined streets
  green: [
    { lat: -6.2255, lng: 106.8041 }, // FX Sudirman
    { lat: -6.2220, lng: 106.8015 }, // Gelora Bung Karno gate
    { lat: -6.2165, lng: 106.7990 }, // Jalan Asia Afrika (lush green canopy)
    { lat: -6.2105, lng: 106.7945 }, // Tentara Pelajar (canal & green buffer)
    { lat: -6.2060, lng: 106.7880 }, // Palmerah Barat
    { lat: -6.2017, lng: 106.7822 }, // Binus Anggrek
  ],
  // Traditional fast red path: right through Semanggi jam & Gatot Subroto highway exhaust
  red: [
    { lat: -6.2255, lng: 106.8041 }, // FX Sudirman
    { lat: -6.2185, lng: 106.8166 }, // Simpang Susun Semanggi (high smog hotspot)
    { lat: -6.2120, lng: 106.8110 }, // Gatot Subroto Arteri
    { lat: -6.2050, lng: 106.8000 }, // Slipi Jaya toll interchange
    { lat: -6.2017, lng: 106.7822 }, // Binus Anggrek
  ],
};

