'use client';

import React from 'react';
import MapboxRouteMap from './MapboxRouteMap';
import RouteComparisonCard from './RouteComparisonCard';
import ExposureCard from './ExposureCard';
import { ArrowUpDown, Share2, Navigation, Info } from 'lucide-react';
import {
  MedicalProfile,
  RouteAnalysisOption,
  RouteAnalysisResponse,
  RouteOption,
  ScenarioPreset,
} from '@/lib/types';

interface RouteScreenProps {
  scenario: ScenarioPreset;
  selectedRoute: 'green' | 'red';
  onSelectRoute: (route: 'green' | 'red') => void;
  showHeatmap: boolean;
  pollutionSpike: boolean;
  medicalProfile: MedicalProfile;
  onStartNavigation: () => void;
  onShareRoute: () => void;
  isSimulating: boolean;
  routeAnalysis?: RouteAnalysisResponse['data'] | null;
}

const toRouteOption = (
  route: RouteAnalysisOption | undefined,
  fallback: RouteOption,
  isRecommended: boolean,
  fastestDuration: number
): RouteOption => {
  if (!route) return fallback;

  const aqiColor = route.aqi > 150 ? 'red' : route.aqi > 100 ? 'amber' : 'green';
  const aqiDescriptions = {
    good: 'baik',
    moderate: 'sedang',
    unhealthy_sensitive: 'tidak sehat bagi kelompok sensitif',
    unhealthy: 'tidak sehat',
    very_unhealthy: 'sangat tidak sehat',
    hazardous: 'berbahaya',
  };

  return {
    ...fallback,
    durationMinutes: route.durationMinutes,
    durationComparisonText: route.isFastest
      ? 'Tercepat'
      : `+${Math.max(0, route.durationMinutes - fastestDuration)} mnt vs tercepat`,
    distanceKm: route.distanceKm,
    aqi: route.aqi,
    aqiLabel: `Paparan polusi ${aqiDescriptions[route.aqiCategory]} (AQI ${route.aqi})`,
    aqiColor,
    badge: isRecommended ? 'RECOMMENDED' : route.isFastest ? 'Tercepat' : undefined,
    corridorName: undefined,
    partikelTerhindar: route.estimatedPm25InhaledUg === null
      ? undefined
      : `${route.estimatedPm25InhaledUg} µg estimasi PM2.5 terhirup`,
    warning: route.warning || undefined,
  };
};

export default function RouteScreen({
  scenario,
  selectedRoute,
  onSelectRoute,
  showHeatmap,
  pollutionSpike,
  medicalProfile,
  onStartNavigation,
  onShareRoute,
  isSimulating,
  routeAnalysis,
}: RouteScreenProps) {
  const isGreen = selectedRoute === 'green';
  const recommendedRoute = routeAnalysis?.routes.find(
    (route) => route.id === routeAnalysis.recommendedRouteId
  );
  const fastestRoute = routeAnalysis?.routes.find(
    (route) => route.id === routeAnalysis.fastestRouteId
  );
  const greenRoute = toRouteOption(
    recommendedRoute,
    scenario.greenRoute,
    true,
    fastestRoute?.durationMinutes ?? scenario.redRoute.durationMinutes
  );
  const redRoute = toRouteOption(
    fastestRoute,
    scenario.redRoute,
    false,
    fastestRoute?.durationMinutes ?? scenario.redRoute.durationMinutes
  );
  const selectedRouteData = routeAnalysis?.routes.find(
    (route) => route.id === (isGreen ? recommendedRoute?.id : fastestRoute?.id)
  );

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-300">
      <MapboxRouteMap
        selectedRoute={selectedRoute}
        onSelectRoute={onSelectRoute}
        showHeatmap={showHeatmap}
        pollutionSpike={pollutionSpike}
        originName={scenario.origin.name}
        destName={scenario.destination.name}
        isSimulating={isSimulating}
        routeGeometries={{
          green: recommendedRoute?.geometry?.coordinates ?? null,
          red: fastestRoute?.geometry?.coordinates ?? null,
        }}
        exposureReductionPercent={routeAnalysis?.insight.exposureReductionPercent}
        originCoordinates={routeAnalysis
          ? [routeAnalysis.origin.coordinates.longitude, routeAnalysis.origin.coordinates.latitude]
          : undefined}
        destinationCoordinates={routeAnalysis
          ? [routeAnalysis.destination.coordinates.longitude, routeAnalysis.destination.coordinates.latitude]
          : undefined}
      />

      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm flex items-center justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex items-start gap-2.5">
            <div className="w-3 h-3 rounded-full border-2 border-[#245C49] bg-white mt-0.5 flex-shrink-0" />
            <div className="leading-tight">
              <span className="text-[10px] uppercase font-bold text-[#5C7267]">DARI</span>
              <p className="text-xs font-bold text-[#192A24] truncate max-w-[210px] sm:max-w-xs">
                {scenario.origin.name}
              </p>
            </div>
          </div>

          <div className="h-2 border-l border-dashed border-[#CBD5E1] ml-1.5" />

          <div className="flex items-start gap-2.5">
            <div className="w-3 h-3 rounded-full border-2 border-[#245C49] bg-[#245C49] mt-0.5 flex-shrink-0" />
            <div className="leading-tight">
              <span className="text-[10px] uppercase font-bold text-[#5C7267]">KE</span>
              <p className="text-xs font-bold text-[#192A24] truncate max-w-[210px] sm:max-w-xs">
                {scenario.destination.name}
              </p>
            </div>
          </div>
        </div>

        <button
          className="p-2.5 rounded-full bg-[#F8FAF8] hover:bg-[#E8F0EB] text-[#245C49] border border-[#E3ECE6] transition-all active:scale-95 flex-shrink-0"
          title="Tukar Titik Asal & Tujuan"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      <RouteComparisonCard
        greenRoute={greenRoute}
        redRoute={redRoute}
        selectedRoute={selectedRoute}
        onSelectRoute={onSelectRoute}
      />

      <ExposureCard
        selectedRoute={selectedRoute}
        medicalProfile={medicalProfile}
        aiExplanation={routeAnalysis?.insight.recommendationReason ?? scenario.aiExplanation}
        routeData={selectedRouteData}
        exposureReductionPercent={routeAnalysis?.insight.exposureReductionPercent}
        exposureScorePercent={routeAnalysis?.insight.exposureScorePercent}
        insightWarning={routeAnalysis?.insight.warning}
      />

      <div className="flex items-center gap-2 px-2 text-[11px] text-[#5C7267]">
        <Info className="w-4 h-4 text-[#5C7267] flex-shrink-0" />
        <p>
          {routeAnalysis
            ? 'AQI rute adalah estimasi dari data kualitas udara di titik asal.'
            : 'Estimasi paparan berdasarkan pemodelan polusi temporal & durasi tempuh.'}
        </p>
      </div>

      {/* Action Bar Normal (Bukan Sticky/Floating) */}
      <div className="pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onShareRoute}
            className="p-3.5 rounded-2xl bg-white border border-[#E3ECE6] text-[#245C49] hover:bg-[#F8FAF8] transition-all active:scale-95 flex-shrink-0 shadow-sm"
            title="Bagikan Rute Sehat"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={onStartNavigation}
            className={`flex-1 py-3.5 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
              isGreen
                ? 'bg-[#245C49] hover:bg-[#1B4738] text-white shadow-[#245C49]/20'
                : 'bg-[#D9534F] hover:bg-[#C94743] text-white shadow-[#D9534F]/20'
            }`}
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>
              {isGreen ? 'Mulai Navigasi Sehat' : 'Lanjut Rute Tercepat (Beresiko)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}