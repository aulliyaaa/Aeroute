export type MedicalProfile = 'standard' | 'sensitive' | 'asthma' | 'pregnant_child';

export type TransportMode = 'motor' | 'mobil' | 'sepeda' | 'jalan';
export type RouteStrategy = 'balance' | 'cleanest';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  medicalProfile: MedicalProfile;
  transportMode: TransportMode;
  strategy: RouteStrategy;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export interface EnvironmentData {
  locationName: string;
  aqi: number;
  aqiCategory: RouteAnalysisOption['aqiCategory'];
  pm25UgM3: number;
  pm25IsEstimated: boolean;
  temperatureC: number | null;
  humidityPct: number | null;
  observedAt: string | null;
  source: string;
  isFallback: boolean;
}

export interface SearchLocation extends ApiLocation {
  id: string;
  detail: string;
}

export interface SavedTrip {
  id: string;
  analysisId: string | null;
  origin: ApiLocation;
  destination: ApiLocation;
  routeId: string;
  durationMinutes: number;
  distanceKm: number;
  aqi: number;
  pm25UgM3: number | null;
  exposureReductionPercent: number | null;
  startedAt: string;
  completedAt: string;
  createdAt: string;
}

export type SaveTripRequest = Omit<SavedTrip, 'id' | 'createdAt'>;

export interface ApiLocation {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface RouteAnalysisRequest {
  origin: ApiLocation;
  destination: ApiLocation;
  transportMode: TransportMode;
  strategy: RouteStrategy;
  medicalProfile: MedicalProfile;
  demoMode?: boolean;
  pollutionSpike?: boolean;
}

export interface RouteAnalysisOption {
  id: string;
  durationMinutes: number;
  distanceKm: number;
  aqi: number;
  aqiCategory: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  aqiIsEstimated: boolean;
  pm25UgM3: number;
  estimatedPm25InhaledUg: number | null;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  } | null;
  steps: Array<{
    instruction: string;
    name: string;
    distanceMeters: number;
    durationSeconds: number;
  }>;
  segments: Array<{
    name: string;
    aqi: number;
    pm25UgM3: number | null;
    observedAt: string | null;
  }>;
  warning: string | null;
  isFastest: boolean;
}

export interface RouteAnalysisResponse {
  status: 'success';
  data: {
    analysisId: string;
    generatedAt: string;
    origin: ApiLocation;
    destination: ApiLocation;
    transportMode: TransportMode;
    strategy: RouteStrategy;
    medicalProfile: MedicalProfile;
    recommendedRouteId: string;
    fastestRouteId: string;
    routes: RouteAnalysisOption[];
    insight: {
      exposureReductionPercent: number;
      exposureScorePercent: number;
      recommendationReason: string;
      warning: string;
    };
    dataQuality: {
      routing: { source: string; isFallback: boolean };
      airQuality: {
        source: string;
        observedAt: string | null;
        isFallback: boolean;
        pm25IsEstimated: boolean;
        routeAqiMethod: string;
      };
      insight: { source: string; isFallback: boolean };
    };
  };
}

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

