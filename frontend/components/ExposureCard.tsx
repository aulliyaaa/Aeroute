'use client';

import React from 'react';
import { HeartPulse, AlertCircle } from 'lucide-react';
import { MedicalProfile } from '@/lib/types';
import MascotAI from './MascotAI';

interface ExposureCardProps {
  selectedRoute: 'green' | 'red';
  medicalProfile: MedicalProfile;
  aiExplanation?: string;
}

export default function ExposureCard({
  selectedRoute,
  medicalProfile,
  aiExplanation = 'Mengarahkan via koridor hijau Senayan-Palmerah untuk memangkas inhalasi PM2.5 sebesar 38% dari kemacetan padat Semanggi.',
}: ExposureCardProps) {
  const isGreen = selectedRoute === 'green';

  return (
    <div className="w-full space-y-3">

      <div className="rounded-2xl p-4 bg-[#E8F0EB] border border-[#CDE5D7] text-[#192A24] shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">

            <MascotAI
              pose={isGreen ? 'circle' : 'masker'}
              size="md"
              showBadge={true}
              altText={isGreen ? 'aeroCircle.png' : 'aeroMasker.png'}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#245C49]">
                  AeroRoute AI Engine
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#245C49] text-white font-extrabold text-[9px] uppercase tracking-wider">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-[#5C7267]">
                Aero AI Companion • Rekomendasi Dinamis
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#192A24] leading-relaxed">
          {isGreen
            ? aiExplanation
            : 'PERINGATAN AI: Rute merah melintasi Semanggi dengan stagnasi aerosol hitam 154 AQI. Berisiko memicu gangguan napas akut pada profil sensitif!'}
        </p>
      </div>

      <div className="rounded-2xl p-4 bg-white border border-[#E3ECE6] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#245C49]" />
            <h4 className="text-xs font-bold text-[#192A24] uppercase tracking-wider">
              AI Personal Exposure Impact
            </h4>
          </div>
          <span className="text-[11px] font-bold text-[#245C49]">
            {isGreen ? 'Proteksi Optimal' : 'Beban Tinggi'}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#5C7267] font-medium">Pengurangan Beban Inhalasi</span>
            <span className="font-extrabold text-[#245C49]">
              {isGreen ? '-38% Lebih Ringan' : '+74% Paparan Ekstrem'}
            </span>
          </div>

          <div className="relative w-full h-2.5 bg-[#E8F0EB] rounded-full overflow-hidden border border-[#CDE5D7]">
            {isGreen ? (
              <div
                className="h-full bg-[#245C49] rounded-full transition-all duration-700"
                style={{ width: '62%' }}
              />
            ) : (
              <div
                className="h-full bg-[#D9534F] rounded-full transition-all duration-700"
                style={{ width: '92%' }}
              />
            )}
          </div>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E3ECE6]">
          <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6]">
            <span className="block text-[10px] text-[#5C7267] font-medium">Partikel PM2.5</span>
            <span
              className={`text-sm font-black ${
                isGreen ? 'text-[#245C49]' : 'text-[#D9534F]'
              }`}
            >
              {isGreen ? '-42 µg Terhindar' : '+68 µg Terhirup'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6]">
            <span className="block text-[10px] text-[#5C7267] font-medium">Ekuivalen Paparan</span>
            <span className="text-sm font-black text-[#192A24]">
              {isGreen ? '2.4 Rokok Batal' : '3.8 Rokok Pasif'}
            </span>
          </div>
        </div>

        {!isGreen && (
          <div className="p-2.5 rounded-xl bg-[#FDF2F2] border border-[#F8D7D6] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#D9534F] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#D9534F] leading-snug">
              <strong>Peringatan Klinis Asma:</strong> Paparan PM2.5 Semanggi berpotensi memicu batuk kering dan iritasi saluran pernapasan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
