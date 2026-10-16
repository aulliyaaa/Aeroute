'use client';

import React, { useState } from 'react';
import {
  Search,
  Mic,
  Bike,
  Car,
  Footprints,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Building2,
  GraduationCap,
  Home as HomeIcon,
  Sun,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { ScenarioPreset } from '@/lib/types';
import MascotAI from './MascotAI';

interface HomeScreenProps {
  onGoToRoute: () => void;
  onSelectDestination: (presetKey: string) => void;
  scenario: ScenarioPreset;
  pollutionSpike: boolean;
}

export default function HomeScreen({
  onGoToRoute,
  onSelectDestination,
  scenario,
  pollutionSpike,
}: HomeScreenProps) {
  const [transportMode, setTransportMode] = useState<'motor' | 'mobil' | 'sepeda' | 'jalan'>('motor');
  const [searchQuery, setSearchQuery] = useState('');
  const [mascotTipIndex, setMascotTipIndex] = useState(0);

  const hasPollutionWarning = pollutionSpike || scenario.currentAqi > 100;

  const normalTips = [
    'Aero udah scan rute Senayan nih. Udara 38% lebih bersih dari arteri Semanggi!',
    'Hari ini kelembaban 72%, koridor pohon trembesi sejuk banget!',
    'Pilihan rute hijau kamu telah menghemat 42µg partikel mikro minggu ini!',
  ];

  const warningTips = [
    'Waspada! Udara sedang sensitif waspada (AQI tinggi). Aero sarankan masker KN95 ya!',
    'Aero membelokkan rute menjauhi Semanggi yang sedang stagnan asap knalpot truk.',
    'Peringatan napas: Hindari jalan Gatot Subroto karena akumulasi gas buang diesel.',
  ];

  const currentTips = hasPollutionWarning ? warningTips : normalTips;

  const handleMascotClick = () => {
    setMascotTipIndex((prev) => (prev + 1) % currentTips.length);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      <div
        className={`relative overflow-hidden rounded-[32px] p-4 border shadow-sm transition-all duration-300 ${
        hasPollutionWarning
          ? 'bg-[#FDF2F2] border-[#F8D7D6] text-[#9F2D29]' 
          : 'bg-[#E8F0EB] border-[#CDE5D7] text-[#245C49]' 
        }`}
      >
        <div
          className={`absolute -top-10 -right-10 w-44 h-44 rounded-full blur-2xl pointer-events-none ${
            hasPollutionWarning ? 'bg-[#F8D7D6]' : 'bg-[#CDE5D7]/50'
          }`}
        />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="space-y-1.5 flex-1">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                hasPollutionWarning ? 'text-[#630000]' : 'text-[#245C49]'
              }`}
            >
              {hasPollutionWarning ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-[#630000]" />
                  PERINGATAN POLUSI MIKRO
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-amber-500 fill-amber-400" />
                  SENIN PAGI · UDARA LEMBAB SEJUK
                </>
              )}
            </span>

            <h1 className="text-xl font-black text-[#192A24] tracking-tight leading-tight">
              Selamat pagi, Sarah!
            </h1>

            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs border ${
                hasPollutionWarning
                  ? 'bg-white text-[#D9534F] border-[#F8D7D6]'
                  : 'bg-white text-[#245C49] border-[#CDE5D7]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  hasPollutionWarning ? 'bg-[#D9534F] animate-ping' : 'bg-[#245C49]'
                }`}
              />
              <span>
                {hasPollutionWarning
                  ? `${pollutionSpike ? 210 : scenario.currentAqi} AQI (Sensitif Waspada)`
                  : '18 AQI Senayan (Sangat Bersih)'}
              </span>
            </div>

            <div
              onClick={handleMascotClick}
              className={`mt-1 cursor-pointer p-2.5 rounded-2xl bg-white/95 border text-[11px] font-semibold shadow-2xs leading-snug hover:bg-white transition-all active:scale-[0.99] ${
                hasPollutionWarning
                  ? 'border-[#F8D7D6] text-[#630000]'
                  : 'border-[#CDE5D7] text-[#192A24]'
              }`}
            >
              "{currentTips[mascotTipIndex % currentTips.length]}"
            </div>
          </div>

          <div
            onClick={handleMascotClick}
            className="flex-shrink-0 cursor-pointer relative group transition-transform active:scale-95"
            title="Klik Aero untuk tips!"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center filter drop-shadow-md">
              <MascotAI
                pose={hasPollutionWarning ? 'masker' : 'happy'}
                size="xl"
                showBadge={true}
                altText={hasPollutionWarning ? 'aeroMasker.png' : 'aeroHappy.png'}
              />
            </div>
            <span
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded-full text-white shadow-sm whitespace-nowrap ${
                hasPollutionWarning ? 'bg-[#D9534F]' : 'bg-[#245C49]'
              }`}
            >
              {hasPollutionWarning ? 'Pakai Masker!' : 'Hai, Sarah! 👋'}
            </span>
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          onSelectDestination('sudirman_binus');
          onGoToRoute();
        }}
        className="cursor-pointer group flex items-center justify-between p-3.5 rounded-2xl bg-[#245C49] text-white shadow-md hover:bg-[#1B4738] transition-all"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1B4738] flex items-center justify-center text-[#BFE0CD]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#1B4738] text-[#BFE0CD]">
                DEMO JURI
              </span>
            </div>
            <p className="text-xs font-bold text-white tracking-tight">
              Sudirman → Kampus Binus
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#BFE0CD] text-[#245C49] font-bold text-xs shadow-sm group-hover:bg-[#A9D7BC] transition-all">
          <span>Mulai</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C7267]">
          <MapPin className="w-4 h-4 text-[#245C49]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari tujuan atau tempat sehat..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-[#E3ECE6] text-[#192A24] placeholder-[#8A9E93] text-xs font-medium focus:outline-none focus:border-[#245C49] shadow-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5C7267] hover:text-[#192A24] cursor-pointer">
          <Mic className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'motor', label: 'Motor', icon: Bike },
          { id: 'mobil', label: 'Mobil', icon: Car },
          { id: 'sepeda', label: 'Sepeda', icon: Bike },
          { id: 'jalan', label: 'Jalan', icon: Footprints },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = transportMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTransportMode(item.id as any)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#245C49] text-white shadow-sm'
                  : 'bg-white text-[#192A24] border border-[#E3ECE6] hover:bg-[#F8FAF8]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-[#5C7267] uppercase">
            KONDISI LOKASI TERKINI
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              pollutionSpike
                ? 'bg-[#FDF2F2] text-[#D9534F] border border-[#F8D7D6]'
                : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
            }`}
          >
            ● {pollutionSpike ? 'Sangat Tidak Sehat' : 'Sensitif Waspada'}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-4xl font-black tracking-tight ${
                pollutionSpike ? 'text-[#D9534F]' : 'text-[#192A24]'
              }`}
            >
              {pollutionSpike ? '210' : '142'}
            </span>
            <span className="text-xs font-bold text-[#5C7267]">AQI US</span>
          </div>
          <span className="text-[11px] text-[#5C7267]">
          Bundaran HI • 4 mnt lalu
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6] text-center">
          <div>
            <span className="block text-[10px] text-[#5C7267]">PM 2.5</span>
            <span className="text-xs font-bold text-[#192A24]">
              {pollutionSpike ? '98.4 µg/m³' : '56.8 µg/m³'}
            </span>
          </div>
          <div className="border-x border-[#E3ECE6]">
            <span className="block text-[10px] text-[#5C7267]">Suhu</span>
            <span className="text-xs font-bold text-[#192A24]">31°C</span>
            <span className="block text-[9px] text-[#5C7267]">Terasa 34°</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#5C7267]">Kelembaban</span>
            <span className="text-xs font-bold text-[#192A24]">72%</span>
            <span className="block text-[9px] text-[#5C7267]">Lembab</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#E8F0EB] border border-[#CDE5D7] flex items-start gap-2.5 text-[11px] text-[#245C49]">
          <ShieldCheck className="w-4 h-4 text-[#245C49] flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Saran Proteksi:</strong> Disarankan masker KN95 jika bersepeda atau bermotor melintasi koridor jalan arteri utama.
          </p>
        </div>
      </div>

      <button
        onClick={onGoToRoute}
        className="w-full py-3.5 px-4 rounded-2xl bg-[#245C49] hover:bg-[#1B4738] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
      >
        <ShieldCheck className="w-4 h-4" />
        <span>Cari Rute Rendah Paparan</span>
      </button>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#192A24]">
            Destinasi Cepat
          </h3>
          <span className="text-[11px] text-[#245C49] font-bold cursor-pointer hover:underline">
            Kelola
          </span>
        </div>

        <div className="space-y-2">
          <div
            onClick={() => {
              onSelectDestination('sudirman_binus');
              onGoToRoute();
            }}
            className="p-3 rounded-2xl bg-white border border-[#E3ECE6] hover:border-[#245C49] flex items-center justify-between cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0EB] text-[#245C49] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#192A24]">Kantor (Sudirman)</p>
                <p className="text-[11px] text-[#5C7267]">6.8 km • Estimasi 22 mnt</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8F0EB] text-[#245C49] font-bold text-[10px]">
                ● 42 AQI
              </span>
              <p className="text-[10px] text-[#5C7267] mt-0.5">Sehat & Bersih</p>
            </div>
          </div>

          <div
            onClick={() => {
              onSelectDestination('sudirman_binus');
              onGoToRoute();
            }}
            className="p-3 rounded-2xl bg-white border-2 border-[#245C49]/40 bg-[#F4F9F6] flex items-center justify-between cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0EB] text-[#245C49] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#192A24] flex items-center gap-1.5">
                  Kampus (Binus University)
                  <span className="text-[9px] px-1 rounded bg-[#245C49] text-white font-extrabold">
                    DEMO
                  </span>
                </p>
                <p className="text-[11px] text-[#5C7267]">12.4 km • Estimasi 38 mnt</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold text-[10px]">
                ● 86 AQI
              </span>
              <p className="text-[10px] text-[#5C7267] mt-0.5">Sedang</p>
            </div>
          </div>

          <div
            onClick={() => {
              onSelectDestination('tebet_scbd');
              onGoToRoute();
            }}
            className="p-3 rounded-2xl bg-white border border-[#E3ECE6] hover:border-[#245C49] flex items-center justify-between cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0EB] text-[#245C49] flex items-center justify-center">
                <HomeIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#192A24]">Rumah (Tebet)</p>
                <p className="text-[11px] text-[#5C7267]">4.1 km • Estimasi 15 mnt</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8F0EB] text-[#245C49] font-bold text-[10px]">
                ● 35 AQI
              </span>
              <p className="text-[10px] text-[#5C7267] mt-0.5">Sangat Baik</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
