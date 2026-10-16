import { getRoutesFromMapbox } from '../services/mapboxService.js';
import { getAirQualityData } from '../services/weatherService.js';
import { generateHealthInsight } from '../services/aiService.js';

const supportedTransportModes = new Set(['motor', 'mobil', 'sepeda', 'jalan']);
const supportedStrategies = new Set(['balance', 'cleanest']);
const supportedMedicalProfiles = new Set(['standard', 'sensitive', 'asthma', 'pregnant_child']);

const isValidLocation = location => {
  const { latitude, longitude } = location?.coordinates || {};
  return typeof location?.name === 'string' && location.name.trim().length > 0 &&
    Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
    Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
};

const getAqiCategory = aqi => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy_sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very_unhealthy';
  return 'hazardous';
};

export const processRouteAnalysis = async (req, res) => {
  try {
    const {
      origin,
      destination,
      transportMode,
      strategy,
      medicalProfile,
      demoMode = false,
      pollutionSpike = false
    } = req.body || {};

    if (
      !isValidLocation(origin) ||
      !isValidLocation(destination) ||
      !supportedTransportModes.has(transportMode) ||
      !supportedStrategies.has(strategy) ||
      !supportedMedicalProfiles.has(medicalProfile) ||
      typeof demoMode !== 'boolean' ||
      typeof pollutionSpike !== 'boolean'
    ) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_ROUTE_ANALYSIS_REQUEST',
        message: 'Asal, tujuan, moda, strategi, atau profil kesehatan tidak valid.'
      });
    }

    const startCoordinates = [origin.coordinates.longitude, origin.coordinates.latitude];
    const endCoordinates = [destination.coordinates.longitude, destination.coordinates.latitude];
    const routesData = await getRoutesFromMapbox(startCoordinates, endCoordinates, transportMode);
    const airQuality = await getAirQualityData(
      origin.coordinates.latitude,
      origin.coordinates.longitude
    );
    const demoOverride = demoMode && pollutionSpike;
    const fastestAqi = demoOverride ? 210 : Math.min(Math.round(airQuality.aqi * 1.2), 300);
    const alternativeAqi = demoOverride ? 132 : Math.max(Math.round(airQuality.aqi * 0.45), 20);
    const alternative = routesData.alternative;
    const alternativeImprovesAqi = alternative && alternativeAqi < fastestAqi;
    const alternativeWithinTimeLimit = alternative &&
      alternative.durationMinutes <= routesData.fastest.durationMinutes + 10;
    const recommendedRouteId = strategy === 'cleanest' && alternative
      ? 'route_alternative'
      : alternativeImprovesAqi && alternativeWithinTimeLimit
        ? 'route_alternative'
        : 'route_fastest';

    const aiInsight = await generateHealthInsight({
      userProfile: medicalProfile,
      fastestAqi,
      aeroAqi: alternative ? alternativeAqi : fastestAqi,
      durationFastest: routesData.fastest.durationMinutes,
      durationAero: alternative?.durationMinutes || routesData.fastest.durationMinutes
    });

    const mapRoute = (id, route, aqi, isFastest) => ({
      id,
      durationMinutes: route.durationMinutes,
      distanceKm: route.distanceKm,
      aqi,
      aqiCategory: getAqiCategory(aqi),
      aqiIsEstimated: true,
      pm25UgM3: airQuality.pm25Value,
      estimatedPm25InhaledUg: null,
      geometry: route.geometry,
      steps: route.steps || [],
      segments: [],
      warning: aqi > 100
        ? 'Estimasi AQI di atas 100. Pertimbangkan kondisi kualitas udara sebelum bepergian.'
        : null,
      isFastest
    });

    const routeOptions = [
      mapRoute('route_fastest', routesData.fastest, fastestAqi, true)
    ];
    if (alternative) {
      routeOptions.push(mapRoute('route_alternative', alternative, alternativeAqi, false));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        analysisId: `analysis_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        origin,
        destination,
        transportMode,
        strategy,
        medicalProfile,
        recommendedRouteId,
        fastestRouteId: 'route_fastest',
        routes: routeOptions,
        insight: {
          exposureReductionPercent: aiInsight.inhalation_reduction_percent,
          exposureScorePercent: aiInsight.exposure_score_percent,
          recommendationReason: aiInsight.recommendation_reason,
          warning: aiInsight.ai_alert_warning
        },
        dataQuality: {
          routing: {
            source: routesData.source,
            isFallback: routesData.isFallback
          },
          airQuality: {
            source: airQuality.source,
            observedAt: airQuality.observedAt,
            isFallback: airQuality.isFallback,
            pm25IsEstimated: airQuality.pm25IsEstimated,
            routeAqiMethod: demoOverride ? 'demo-override' : 'single-point-heuristic',
            demoOverride
          },
          insight: {
            source: aiInsight.source,
            isFallback: aiInsight.isFallback
          }
        }
      }
    });

  } catch (error) {
    console.error('Error Controller:', error.message);
    return res.status(500).json({
      status: 'error',
      code: 'ROUTE_ANALYSIS_FAILED',
      message: 'Gagal memproses analisis rute.'
    });
  }
};