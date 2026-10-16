'use client';

import React from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  X,
  Sparkles,
  Trees,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RouteAnalysisOption } from '@/lib/types';
import MascotAI from './MascotAI';

interface ActiveNavModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
  selectedRoute: 'green' | 'red';
  destinationName: string;
  routeData: RouteAnalysisOption | null;
}

export default function ActiveNavModal({
  isOpen,
  onClose,
  onFinish,
  selectedRoute,
  destinationName,
  routeData,
}: ActiveNavModalProps) {
  if (!isOpen) return null;

  const steps = routeData?.steps ?? [];
  const currentStep = steps[0];
  const distanceRemaining = routeData?.distanceKm ?? null;
  const arrivalTime = routeData
    ? new Date(Date.now() + routeData.durationMinutes * 60000)
    : null;

  const handleComplete = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#245C49', '#10b981', '#CDE5D7', '#38bdf8'],
    });
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-[#E3ECE6] shadow-2xl p-5 space-y-4 text-[#192A24] relative overflow-hidden">

        <div className="p-4 rounded-2xl bg-[#245C49] text-white shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/20 text-white shadow-sm">
                <ArrowUpRight className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#CDE5D7]">
                PANDUAN NAVIGASI AKTIF
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-black text-white leading-tight">
            {currentStep?.instruction ?? `Ikuti rute pada peta menuju ${destinationName}.`}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#CDE5D7] font-medium">
            <Trees className="w-3.5 h-3.5 text-[#BFE0CD]" />
            <span>{currentStep?.name || (currentStep ? 'Instruksi dari Mapbox' : 'Instruksi belokan belum tersedia')}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#E3ECE6] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5C7267] font-bold">Kualitas Udara Rute</span>
            <span className="px-2 py-0.5 rounded-full bg-[#E8F0EB] text-[#245C49] font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Panduan tanpa GPS
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-black text-[#245C49] tracking-tight">
                {routeData?.aqi ?? '—'}
              </span>
              <span className="text-xs text-[#5C7267] font-bold ml-1">AQI estimasi</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#192A24]">
                {routeData ? `${routeData.pm25UgM3} µg/m³ PM2.5` : 'PM2.5 —'}
              </span>
              <span className="block text-[10px] text-[#245C49] font-bold">
                {selectedRoute === 'green' ? 'Rute rekomendasi' : 'Rute tercepat'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E3ECE6] text-center text-xs">
            <div>
              <span className="block text-[10px] text-[#5C7267]">Kecepatan</span>
              <span className="font-extrabold text-[#192A24]">—</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#5C7267]">Jarak Rute</span>
              <span className="font-extrabold text-[#192A24]">{distanceRemaining === null ? '—' : `${distanceRemaining.toFixed(1)} km`}</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#5C7267]">Estimasi Tiba</span>
              <span className="font-extrabold text-[#245C49]">
                {arrivalTime?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) ?? '—'}
              </span>
            </div>
          </div>

          <div className="pt-1 border-t border-[#E3ECE6]">
            <MascotAI
              pose="map"
              size="sm"
              message="Ikuti instruksi rute yang ditampilkan. Pelacakan GPS tidak digunakan."
            />
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleComplete}
            className="w-full py-3 px-4 rounded-2xl bg-[#245C49] hover:bg-[#1B4738] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Selesaikan Perjalanan (Lihat AI Insight)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F8FAF8] text-[#5C7267] font-semibold text-xs border border-[#E3ECE6] transition-all"
          >
            Kembali ke Peta
          </button>
        </div>
      </div>
    </div>
  );
}
