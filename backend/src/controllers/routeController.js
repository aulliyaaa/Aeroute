import { getRoutesFromMapbox } from '../services/mapboxService.js';
import { getAirQualityData } from '../services/weatherService.js';
import { generateHealthInsight } from '../services/aiService.js';

export const processRouteAnalysis = async (req, res) => {
  try {
    const { origin, destination, user_profile } = req.body;

    const startCoord = origin || [106.8227, -6.2088]; 
    const endCoord = destination || [106.7824, -6.2018];
    const profile = user_profile || 'Asma / Paru-paru';

    const routesData = await getRoutesFromMapbox(startCoord, endCoord);
    const airQuality = await getAirQualityData(startCoord[1], startCoord[0]);
    const aiInsight = await generateHealthInsight({
      userProfile: profile,
      fastestAqi: airQuality.fastestRouteAqi,
      aeroAqi: airQuality.aeroRouteAqi,
      durationFastest: routesData.fastest.durationMinutes,
      durationAero: routesData.aero.durationMinutes
    });

    return res.status(200).json({
      status: 'success',
      data: {
        destination_name: 'Binus University (Anggrek Campus)',
        origin_name: 'Sudirman Central Business District',
        user_profile: profile,
        routes: {
          aero_route: {
            title: 'AeroRoute (Rekomendasi)',
            duration_minutes: routesData.aero.durationMinutes,
            distance_km: routesData.aero.distanceKm,
            aqi: airQuality.aeroRouteAqi,
            aqi_status: 'Bersih / Sangat Baik',
            pm25: Math.round(airQuality.pm25Value * 0.4),
            inhalation_status: 'Rendah (12.4 µg)',
            geometry: routesData.aero.geometry
          },
          fastest_route: {
            title: 'Rute Tercepat',
            duration_minutes: routesData.fastest.durationMinutes,
            distance_km: routesData.fastest.distanceKm,
            aqi: airQuality.fastestRouteAqi,
            aqi_status: 'Sensitif / Tinggi',
            pm25: airQuality.pm25Value,
            inhalation_status: 'Tinggi (31.8 µg)',
            geometry: routesData.fastest.geometry
          }
        },
        ai_analysis: {
          inhalation_reduction_percent: aiInsight.inhalation_reduction_percent,
          exposure_score_percent: aiInsight.exposure_score_percent,
          recommendation_reason: aiInsight.recommendation_reason,
          ai_alert_warning: aiInsight.ai_alert_warning
        }
      }
    });

  } catch (error) {
    console.error('Error Controller:', error.message);
    return res.status(500).json({ status: 'error', message: 'Gagal memproses rute.' });
  }
};