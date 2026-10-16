export type MedicalProfile = 'standard' | 'sensitive' | 'asthma' | 'pregnant_child';

export interface RouteOption {
  id: 'green' | 'red';
  title: string;
  durationMinutes: number;
  durationComparisonText: string;
  distanceKm: number;
  aqi: number;
  aqiLabel: string;
  aqiColor: string; // 'green' | 'amber' | 'red'
  badge?: string; // 'RECOMMENDED' | 'Tercepat'
  partikelTerhindar?: string;
  corridorName?: string;
  warning?: string;
  description?: string;
}

export interface RouteSegment {
  name: string;
  aqi: number;
  status: string;
  color: string;
  pct: number;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  origin: {
    name: string;
    detail: string;
    coords: [number, number]; // [lat, lng]
  };
  destination: {
    name: string;
    detail: string;
    coords: [number, number];
  };
  greenRoute: RouteOption;
  redRoute: RouteOption;
  aiExplanation: string;
  exposureSavingsPct: number;
  avoidedParticulateUg: number;
  cigaretteEquivalent: number;
  segments: RouteSegment[];
  currentAqi: number;
  currentAqiStatus: string;
  currentLocationName: string;
  pm25: number;
  temp: number;
  humidity: number;
}

