import axios from 'axios';
import { config } from '../config/env.js';

export const getAirQualityData = async (lat, lng) => {
  try {
    if (!config.waqiToken) {
      throw new Error('WAQI_API_TOKEN belum dikonfigurasi.');
    }

    const geoResponse = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lng}/`, {
      params: { token: config.waqiToken }
    });

    if (geoResponse.data.status === 'ok') {
      const data = geoResponse.data.data;
      const aqi = Number.isFinite(Number(data.aqi)) ? Number(data.aqi) : 110;
      const pm25Value = Number(data.iaqi?.pm25?.v);
      const hasPm25Measurement = Number.isFinite(pm25Value);
      const temperatureC = Number(data.iaqi?.t?.v);
      const humidityPct = Number(data.iaqi?.h?.v);

      return {
        aqi,
        pm25Value: hasPm25Measurement ? pm25Value : Math.round(aqi * 0.35),
        pm25IsEstimated: !hasPm25Measurement,
        temperatureC: Number.isFinite(temperatureC) ? temperatureC : null,
        humidityPct: Number.isFinite(humidityPct) ? humidityPct : null,
        locationName: data.city?.name || 'DKI Jakarta',
        source: 'waqi',
        observedAt: data.time?.iso || null,
        isFallback: false
      };
    } else {
      throw new Error('Gagal mengambil data WAQI');
    }
  } catch (error) {
    console.error('Error WAQI API (Using Fallback Data):', error.message);
    return {
      aqi: 110,
      pm25Value: 48,
      pm25IsEstimated: true,
      temperatureC: null,
      humidityPct: null,
      locationName: 'Sudirman - Kuningan Corridor',
      source: 'fallback',
      observedAt: null,
      isFallback: true
    };
  }
};