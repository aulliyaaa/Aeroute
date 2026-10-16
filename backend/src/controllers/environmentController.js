import { getAirQualityData } from '../services/weatherService.js';
import { searchLocations } from '../services/mapboxService.js';

const isValidCoordinates = (latitude, longitude) =>
  Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
  Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;

const getAqiCategory = aqi => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy_sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very_unhealthy';
  return 'hazardous';
};

export const getEnvironment = async (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);
  if (!isValidCoordinates(latitude, longitude)) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_COORDINATES',
      message: 'Koordinat lokasi tidak valid.'
    });
  }

  const airQuality = await getAirQualityData(latitude, longitude);
  return res.status(200).json({
    status: 'success',
    data: {
      locationName: airQuality.locationName,
      aqi: airQuality.aqi,
      aqiCategory: getAqiCategory(airQuality.aqi),
      pm25UgM3: airQuality.pm25Value,
      pm25IsEstimated: airQuality.pm25IsEstimated,
      temperatureC: airQuality.temperatureC,
      humidityPct: airQuality.humidityPct,
      observedAt: airQuality.observedAt,
      source: airQuality.source,
      isFallback: airQuality.isFallback
    }
  });
};

export const findLocations = async (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (query.length < 3 || query.length > 120) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_LOCATION_QUERY',
      message: 'Masukkan minimal 3 karakter untuk mencari lokasi.'
    });
  }

  try {
    const locations = await searchLocations(query);
    return res.status(200).json({ status: 'success', data: { locations } });
  } catch (error) {
    console.error('Location search failed:', error.message);
    return res.status(503).json({
      status: 'error',
      code: 'LOCATION_SEARCH_UNAVAILABLE',
      message: 'Pencarian lokasi sedang tidak tersedia.'
    });
  }
};