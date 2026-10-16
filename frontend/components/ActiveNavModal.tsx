'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  X,
  Sparkles,
  Trees,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MascotAI from './MascotAI';

interface ActiveNavModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
  selectedRoute: 'green' | 'red';
}

export default function ActiveNavModal({
  isOpen,
  onClose,
  onFinish,
  selectedRoute,
}: ActiveNavModalProps) {
  const [speed, setSpeed] = useState(38);
  const [distanceRemaining, setDistanceRemaining] = useState(7.9);
  const [stepIndex, setStepIndex] = useState(0);

  const navSteps = [
    { instruction: '250m Belok Kiri ke Jl. Asia Afrika', note: 'Memasuki Koridor Bersih Senayan', aqi: 24, safe: true },
    { instruction: '800m Lurus terus melintasi Hutan Kota GBK', note: 'Area Kanopi Rindang (Filter Alami)', aqi: 20, safe: true },
    { instruction: '1.2 km Ambil jalur kanan menuju Palmerah', note: 'Menghindari Simpang Semanggi (-38% Emisi)', aqi: 28, safe: true },
    { instruction: '300m Tiba di Kampus Binus Anggrek', note: 'Perjalanan Bersih Selesai!', aqi: 32, safe: true },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setDistanceRemaining((prev) => (prev > 0.5 ? Number((prev - 0.2).toFixed(1)) : 0.3));
      setSpeed(Math.floor(35 + Math.random() * 8));
      setStepIndex((prev) => (prev + 1) % navSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = navSteps[stepIndex];

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
            {currentStep.instruction}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#CDE5D7] font-medium">
            <Trees className="w-3.5 h-3.5 text-[#BFE0CD]" />
            <span>{currentStep.note}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#E3ECE6] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5C7267] font-bold">Sensor Udara Real-Time</span>
            <span className="px-2 py-0.5 rounded-full bg-[#E8F0EB] text-[#245C49] font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#245C49] animate-ping" />
              Sensor Aktif
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-black text-[#245C49] tracking-tight">
                {currentStep.aqi}
              </span>
              <span className="text-xs text-[#5C7267] font-bold ml-1">AQI Realtime</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#192A24]">42 µg PM2.5</span>
              <span className="block text-[10px] text-[#245C49] font-bold">
                Terproteksi dari Asap Semanggi
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E3ECE6] text-center text-xs">
            <div>
              <span className="block text-[10px] text-[#5C7267]">Kecepatan</span>
              <span className="font-extrabold text-[#192A24]">{speed} km/j</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#5C7267]">Jarak Sisa</span>
              <span className="font-extrabold text-[#192A24]">{distanceRemaining} km</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#5C7267]">Estimasi Tiba</span>
              <span className="font-extrabold text-[#245C49]">09:15</span>
            </div>
          </div>

          <div className="pt-1 border-t border-[#E3ECE6]">
            <MascotAI
              pose="map"
              size="sm"
              message="Udara di segmen ini bersih banget! Tetap ikuti jalur Senayan ya!"
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
