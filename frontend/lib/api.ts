import {
  AuthResult,
  AuthUser,
  EnvironmentData,
  RouteAnalysisRequest,
  RouteAnalysisResponse,
  SaveTripRequest,
  SavedTrip,
  SearchLocation,
} from './types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const authTokenKey = 'aeroute_token';

interface ApiEnvelope<T> {
  data?: T;
  message?: string;
}

const normalizeUser = (user: AuthUser): AuthUser => ({
  ...user,
  avatarUrl: user.avatarUrl ? new URL(user.avatarUrl, `${apiBaseUrl}/`).toString() : null,
});

const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
  includeToken = true
): Promise<T> => {
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (includeToken && typeof window !== 'undefined') {
    const token = window.localStorage.getItem(authTokenKey);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.data) {
    throw new Error(payload?.message || 'Permintaan ke server gagal.');
  }
  return payload.data;
};

export const registerAccount = async (input: {
  name: string;
  email: string;
  password: string;
  medicalProfile: AuthUser['medicalProfile'];
}) => {
  const result = await apiRequest<AuthResult>('/auth/register', {
  method: 'POST',
  body: JSON.stringify(input),
  }, false);
  return { ...result, user: normalizeUser(result.user) };
};

export const loginAccount = async (email: string, password: string) => {
  const result = await apiRequest<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, false);
  return { ...result, user: normalizeUser(result.user) };
};

export const getCurrentUser = async () =>
  normalizeUser((await apiRequest<{ user: AuthUser }>('/auth/me')).user);

export const updateAccountProfile = async (input: Partial<Pick<AuthUser, 'name' | 'medicalProfile' | 'transportMode' | 'strategy'>>) =>
  normalizeUser((await apiRequest<{ user: AuthUser }>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(input),
  })).user);

export const saveAuthToken = (token: string) => {
  if (typeof window !== 'undefined') window.localStorage.setItem(authTokenKey, token);
};

export const getSavedAuthToken = () =>
  typeof window !== 'undefined' ? window.localStorage.getItem(authTokenKey) : null;

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') window.localStorage.removeItem(authTokenKey);
};

export const uploadProfilePhoto = async (file: File) => {
  const body = new FormData();
  body.append('avatar', file);
  const result = await apiRequest<{ avatarUrl: string }>('/auth/avatar', { method: 'POST', body });
  return { avatarUrl: new URL(result.avatarUrl, `${apiBaseUrl}/`).toString() };
};

export const analyzeRoute = (request: RouteAnalysisRequest) =>
  apiRequest<RouteAnalysisResponse['data']>('/get-route-and-exposure', {
    method: 'POST',
    body: JSON.stringify(request),
  });

export const getEnvironment = (latitude: number, longitude: number) =>
  apiRequest<EnvironmentData>(`/environment?latitude=${latitude}&longitude=${longitude}`, {}, false);

export const searchLocations = (query: string) =>
  apiRequest<{ locations: SearchLocation[] }>(`/locations/search?q=${encodeURIComponent(query)}`, {}, false)
    .then(result => result.locations);

export const saveTrip = (trip: SaveTripRequest) =>
  apiRequest<{ trip: SavedTrip }>('/trips', {
    method: 'POST',
    body: JSON.stringify(trip),
  }).then(result => result.trip);

export const getTrips = () =>
  apiRequest<{ trips: SavedTrip[] }>('/trips').then(result => result.trips);