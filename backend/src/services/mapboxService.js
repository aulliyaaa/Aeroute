import axios from 'axios';
import { config } from '../config/env.js';

const mapboxProfileByTransport = {
  motor: 'driving',
  mobil: 'driving',
  sepeda: 'cycling',
  jalan: 'walking'
};

export const getRoutesFromMapbox = async (origin, destination, transportMode = 'motor') => {
  try {
    if (!config.mapboxToken) {
      throw new Error('MAPBOX_ACCESS_TOKEN belum dikonfigurasi.');
    }

    const profile = mapboxProfileByTransport[transportMode];
    if (!profile) {
      throw new Error('Mode transportasi tidak didukung.');
    }

    const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}`;

    const response = await axios.get(url, {
      params: {
        alternatives: true,
        geometries: 'geojson',
        overview: 'full',
        steps: true,
        access_token: config.mapboxToken
      }
    });

    if (!response.data.routes || response.data.routes.length === 0) {
      throw new Error('Tidak ada rute ditemukan');
    }

    const routes = response.data.routes;
    
    const toRoute = route => ({
      durationMinutes: Math.round(route.duration / 60),
      distanceKm: Number((route.distance / 1000).toFixed(1)),
      geometry: route.geometry,
      steps: (route.legs || []).flatMap(leg => leg.steps || []).map(step => ({
        instruction: step.maneuver?.instruction || 'Lanjutkan perjalanan sesuai rute.',
        name: step.name || '',
        distanceMeters: step.distance,
        durationSeconds: step.duration
      }))
    });

    const fastest = toRoute(routes[0]);
    const alternative = routes[1] ? toRoute(routes[1]) : null;

    return {
      fastest,
      alternative,
      source: 'mapbox',
      isFallback: false
    };
  } catch (error) {
    console.error('Error Mapbox API (Using Fallback Data):', error.message);
    return {
      fastest: {
        durationMinutes: 25,
        distanceKm: 9.4,
        geometry: null,
        steps: []
      },
      alternative: {
        durationMinutes: 32,
        distanceKm: 10.1,
        geometry: null,
        steps: []
      },
      source: 'fallback',
      isFallback: true
    };
  }
};

export const searchLocations = async query => {
  if (!config.mapboxToken) {
    throw new Error('MAPBOX_ACCESS_TOKEN belum dikonfigurasi.');
  }

  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
    {
      params: {
        access_token: config.mapboxToken,
        country: 'id',
        language: 'id',
        limit: 5,
        types: 'address,poi,place,locality'
      }
    }
  );

  return (response.data.features || []).map(feature => ({
    id: feature.id,
    name: feature.text,
    detail: feature.place_name,
    coordinates: {
      longitude: feature.center[0],
      latitude: feature.center[1]
    }
  }));
};