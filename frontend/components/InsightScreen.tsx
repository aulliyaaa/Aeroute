'use client';

import React from 'react';
import {
  Activity,
  Trees,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  Info,
  Share2,
  Bookmark,
  Sparkles,
  Leaf,
  Layers,
  Wind,
} from 'lucide-react';
import { RouteAnalysisResponse, ScenarioPreset, MedicalProfile, SavedTrip } from '@/lib/types';
import MascotAI from './MascotAI';

interface InsightScreenProps {
  scenario: ScenarioPreset;
  medicalProfile: MedicalProfile;
  trips: SavedTrip[];
  routeAnalysis: RouteAnalysisResponse['data'] | null;
  isDemoMode: boolean;
  onShare: () => void;
}

export default function InsightScreen({
  scenario,
  medicalProfile,
  trips,
  routeAnalysis,
  isDemoMode,
  onShare,
}: InsightScreenProps) {
  const latestTrip = trips[0];
  const recommendedRoute = routeAnalysis?.routes.find(
    (route) => route.id === routeAnalysis.recommendedRouteId
  );
  const fastestRoute = routeAnalysis?.routes.find(
    (route) => route.id === routeAnalysis.fastestRouteId
  );
  const totalMinutes = trips.reduce((total, trip) => total + trip.durationMinutes, 0);
  const averageAqi = trips.length
    ? Math.round(trips.reduce((total, trip) => total + trip.aqi, 0) / trips.length)
    : null;
  const aqi = latestTrip?.aqi ?? recommendedRoute?.aqi ?? null;
  const pm25 = latestTrip?.pm25UgM3 ?? recommendedRoute?.pm25UgM3 ?? null;
  const exposureReduction = latestTrip?.exposureReductionPercent ?? routeAnalysis?.insight.exposureReductionPercent ?? null;
  const completedTime = latestTrip?.completedAt ?? routeAnalysis?.generatedAt;
  const segments = recommendedRoute?.segments ?? [];
  const distanceKm = latestTrip?.distanceKm ?? recommendedRoute?.distanceKm ?? null;
  const aqiCategory = aqi === null
    ? 'Belum tersedia'
    : aqi <= 50 ? 'Baik' : aqi <= 100 ? 'Sedang' : aqi <= 150 ? 'Tidak sehat bagi kelompok sensitif' : 'Tidak sehat';

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7] text-[#245C49] text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#245C49]" />
          <span>Profil Aktif: {medicalProfile}</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#245C49]"></span>
      </div>

      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#245C49] flex items-center gap-1">
          <Activity className="w-3.5 h-3.5" />
          AI HEALTH INSIGHT
        </span>
        <h2 className="text-xl font-black text-[#192A24] tracking-tight mt-0.5">
          Analisis Rute Cerdas
        </h2>
        <p className="text-xs text-[#5C7267] mt-0.5">
          {scenario.origin.name} → {scenario.destination.name}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#5C7267] uppercase tracking-wider">
            ANALISIS CERDAS PERJALANAN
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F0EB] text-[#245C49] border border-[#CDE5D7]">
            {completedTime
              ? `Selesai ${new Date(completedTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
              : 'Belum ada perjalanan'}
          </span>
        </div>

        <h3 className="text-sm font-bold text-[#192A24]">
          Ringkasan Perjalanan
        </h3>

        <p className="text-xs text-[#5C7267] leading-relaxed">
          {latestTrip
            ? `${latestTrip.origin.name} ke ${latestTrip.destination.name} selesai dalam ${latestTrip.durationMinutes} menit.`
            : routeAnalysis
              ? routeAnalysis.insight.recommendationReason
              : 'Selesaikan perjalanan untuk menyimpan hasil dan melihat insight di sini.'}
        </p>

        <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6] flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#E8F0EB] text-[#245C49]">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] text-[#5C7267] font-medium">Pilihan Cerdas Terkumpul</span>
            <span className="text-xs font-bold text-[#245C49]">
              {totalMinutes
                ? `${(totalMinutes / 60).toFixed(1)} jam ${isDemoMode ? 'trip demo sesi ini' : 'perjalanan tersimpan'} • AQI rata-rata ${averageAqi ?? '—'}`
                : 'Belum ada perjalanan tersimpan'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#245C49] text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase flex items-center gap-1">
            {latestTrip ? isDemoMode ? 'Demo Selesai' : 'Perjalanan Selesai' : 'Analisis Rute'}
          </span>
            <span className="text-xs font-bold text-[#CDE5D7] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#BFE0CD]" />
            {routeAnalysis?.dataQuality.insight.source ?? 'Insight'}
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-white">{aqi ?? '—'}</span>
            <span className="text-base font-bold text-[#CDE5D7]">AQI Rute</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#1B4738] space-y-1">
          <div className="flex items-center gap-1.5 text-[#BFE0CD] font-bold text-xs">
            <TrendingDown className="w-4 h-4 text-[#BFE0CD]" />
            <span>{exposureReduction === null ? 'Estimasi paparan belum tersedia' : `-${exposureReduction}% estimasi paparan`}</span>
          </div>
          <p className="text-[11px] text-white/90 leading-snug">
            {routeAnalysis?.insight.recommendationReason ?? 'Nilai ini merupakan estimasi kualitas udara, bukan diagnosis medis.'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[11px] text-[#CDE5D7]">
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-[#BFE0CD]" />
            <span>{pm25 === null ? 'Data PM2.5 belum tersedia' : <>PM2.5: <strong>{pm25} µg/m³</strong></>}</span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#BFE0CD]" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E3ECE6] shadow-sm">
        <div className="relative h-36 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
            alt={`Rute ${scenario.origin.name} ke ${scenario.destination.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#192A24] text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
              <Trees className="w-3.5 h-3.5 text-[#245C49]" />
              {scenario.origin.name} → {scenario.destination.name}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#245C49] text-[11px] font-extrabold shadow-sm">
              {aqi === null ? 'AQI —' : `AQI ${aqi} • ${aqiCategory}`}
            </span>
          </div>
        </div>

        <div className="p-3 text-xs text-[#5C7267] leading-relaxed">
          {routeAnalysis
            ? `Data AQI menggunakan estimasi dari kualitas udara di titik asal (${routeAnalysis.dataQuality.airQuality.routeAqiMethod}).`
            : 'Belum ada analisis rute tersimpan untuk lokasi ini.'}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#245C49]" />
            <h3 className="text-xs font-bold text-[#192A24] uppercase tracking-wider">
              Kualitas Udara Sepanjang Segmen
            </h3>
          </div>
          <span className="text-[11px] font-medium text-[#5C7267]">Total {distanceKm === null ? '—' : `${distanceKm} km`}</span>
        </div>

        <p className="text-[11px] text-[#5C7267] leading-snug">
          {segments.length
            ? 'Pengukuran kualitas udara yang tersedia untuk segmen rute ini.'
            : 'Data kualitas udara per segmen belum tersedia dari penyedia data.'}
        </p>

        {segments.length > 0 && (
          <>
            <div className="w-full h-2.5 rounded-full overflow-hidden flex gap-0.5 bg-[#E8F0EB]">
              {segments.map((segment) => (
                <div
                  key={segment.name}
                  className="h-full"
                  style={{
                    width: `${100 / segments.length}%`,
                    backgroundColor: segment.aqi <= 50 ? '#245C49' : segment.aqi <= 100 ? '#F59E0B' : '#D9534F',
                  }}
                  title={`${segment.name}: AQI ${segment.aqi}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {segments.map((segment) => (
                <div key={segment.name} className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6]">
                  <span className="text-[11px] font-bold text-[#192A24] flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: segment.aqi <= 50 ? '#245C49' : segment.aqi <= 100 ? '#F59E0B' : '#D9534F' }}
                    />
                    {segment.name}
                  </span>
                  <span className="text-[10px] text-[#5C7267] block mt-0.5">
                    AQI {segment.aqi}{segment.pm25UgM3 === null ? '' : ` · PM2.5 ${segment.pm25UgM3} µg/m³`}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7] shadow-sm space-y-2.5">
        <div className="flex items-center gap-2.5">
          <MascotAI pose="circle" size="md" showBadge={true} altText="aeroCircle.png" />
          <div>
            <h4 className="text-xs font-bold text-[#245C49]">
              Alasan Rekomendasi
            </h4>
            <span className="text-[10px] text-[#5C7267] font-medium">
              AeroRoute AI
            </span>
          </div>
        </div>

        <blockquote className="p-3 rounded-xl bg-white border border-[#CDE5D7] text-xs text-[#192A24] leading-relaxed italic">
          "{routeAnalysis?.insight.recommendationReason ?? scenario.aiExplanation}"
        </blockquote>

        <p className="text-[11px] text-[#245C49] font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#245C49]" />
          {recommendedRoute && fastestRoute
            ? `Durasi rekomendasi ${recommendedRoute.durationMinutes} menit; tercepat ${fastestRoute.durationMinutes} menit.`
            : 'Pilih preset atau cari tujuan untuk mendapatkan rekomendasi rute.'}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#192A24] uppercase tracking-wider">Riwayat Perjalanan</h3>
          <span className="text-[11px] text-[#5C7267]">
            {trips.length} {isDemoMode ? 'demo sesi' : 'tersimpan'}
          </span>
        </div>
        {trips.length === 0 ? (
          <p className="text-xs text-[#5C7267]">Belum ada perjalanan yang selesai.</p>
        ) : trips.slice(0, 5).map((trip) => (
          <div key={trip.id} className="flex items-center justify-between gap-3 py-2 border-t border-[#E3ECE6]">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#192A24] truncate">
                {trip.origin.name} → {trip.destination.name}
              </p>
              <p className="text-[10px] text-[#5C7267]">
                {new Date(trip.completedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <span className="shrink-0 text-xs font-bold text-[#245C49]">AQI {trip.aqi}</span>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#E3ECE6] flex items-start gap-2.5 text-[11px] text-[#5C7267]">
        <Info className="w-4 h-4 text-[#5C7267] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#192A24]">Catatan Transparansi:</strong>{' '}
          {routeAnalysis
            ? 'AQI rute saat ini merupakan estimasi berbasis data di titik asal; belum ada pengukuran tiap segmen. Bukan diagnosis medis.'
            : 'Insight berbasis perjalanan yang tercatat, bukan diagnosis medis.'}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onShare}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#E8F0EB] hover:bg-[#D9E7DD] border border-[#CDE5D7] text-[#245C49] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>Bagikan Rute Sehat</span>
        </button>

        <button
          className="p-3 rounded-2xl bg-white hover:bg-[#F8FAF8] border border-[#E3ECE6] text-[#245C49] transition-all active:scale-95 shadow-sm"
          title="Simpan Bookmark"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
