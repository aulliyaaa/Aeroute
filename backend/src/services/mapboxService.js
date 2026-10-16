import axios from 'axios';
import { config } from '../config/env.js';

export const getRoutesFromMapbox = async (origin, destination) => {
  try {
    const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}`;

    const response = await axios.get(url, {
      params: {
        alternatives: true,
        geometries: 'geojson',
        overview: 'full',
        access_token: config.mapboxToken
      }
    });

    if (!response.data.routes || response.data.routes.length === 0) {
      throw new Error('Tidak ada rute ditemukan');
    }

    const routes = response.data.routes;
    
    const fastest = {
      durationMinutes: Math.round(routes[0].duration / 60),
      distanceKm: (routes[0].distance / 1000).toFixed(1),
      geometry: routes[0].geometry
    };

    const altRoute = routes[1] || routes[0];
    const aero = {
      durationMinutes: routes[1] ? Math.round(altRoute.duration / 60) : fastest.durationMinutes + 4,
      distanceKm: (altRoute.distance / 1000).toFixed(1),
      geometry: altRoute.geometry
    };

    return { fastest, aero };
  } catch (error) {
    console.error('Error Mapbox API (Using Fallback Data):', error.message);
    return {
      fastest: { 
        durationMinutes: 25, 
        distanceKm: 9.4, 
        geometry: null 
    },
      aero: { 
        durationMinutes: 32, 
        distanceKm: 10.1, 
        geometry: null 
    }
    };
  }
};