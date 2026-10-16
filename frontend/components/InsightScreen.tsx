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
  Cigarette,
  Leaf,
  Layers,
} from 'lucide-react';
import { ScenarioPreset, MedicalProfile } from '@/lib/types';
import MascotAI from './MascotAI';

interface InsightScreenProps {
  scenario: ScenarioPreset;
  medicalProfile: MedicalProfile;
  onShare: () => void;
}

export default function InsightScreen({
  scenario,
  medicalProfile,
  onShare,
}: InsightScreenProps) {
  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7] text-[#245C49] text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#245C49]" />
          <span>Skenario Aktif: Pengguna Asma / Alergi Ringan</span>
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
            Selesai Pukul 09.15
          </span>
        </div>

        <h3 className="text-sm font-bold text-[#192A24]">
          Ringkasan Paparan Perjalanan Hari Ini
        </h3>

        <p className="text-xs text-[#5C7267] leading-relaxed">
          Napas Anda terlindungi dengan pemilihan koridor udara optimal tanpa mengorbankan waktu tempuh.
        </p>

        <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6] flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#E8F0EB] text-[#245C49]">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] text-[#5C7267] font-medium">Pilihan Cerdas Terkumpul</span>
            <span className="text-xs font-bold text-[#245C49]">
              3.2 jam perjalanan terlindungi minggu ini
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#245C49] text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase flex items-center gap-1">
            🛡️ Terlindungi
          </span>
          <span className="text-xs font-bold text-[#CDE5D7] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#BFE0CD]" />
            Optimalisasi AI
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-white">42</span>
            <span className="text-base font-bold text-[#CDE5D7]">µg Partikel Terhindar</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#1B4738] space-y-1">
          <div className="flex items-center gap-1.5 text-[#BFE0CD] font-bold text-xs">
            <TrendingDown className="w-4 h-4 text-[#BFE0CD]" />
            <span>-38% Akumulasi Racun Napas</span>
          </div>
          <p className="text-[11px] text-white/90 leading-snug">
            Mengurangi beban infiltrasi paru secara signifikan dibandingkan rute standar jalan arteri Semanggi.
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[11px] text-[#CDE5D7]">
          <div className="flex items-center gap-1.5">
            <Cigarette className="w-3.5 h-3.5 text-[#BFE0CD]" />
            <span>Ekuivalen: <strong>2.4 batang asap rokok pasif</strong> tereliminasi</span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#BFE0CD]" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E3ECE6] shadow-sm">
        <div className="relative h-36 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
            alt="Koridor Hijau Senayan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#192A24] text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
              <Trees className="w-3.5 h-3.5 text-[#245C49]" />
              Koridor Hijau Senayan
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#245C49] text-[11px] font-extrabold shadow-sm">
              AQI 22 • Sangat Baik
            </span>
          </div>
        </div>

        <div className="p-3 text-xs text-[#5C7267] leading-relaxed">
          Pohon trembesi dan mahoni di segmen ini berfungsi sebagai bio-filter alami penyerap aerosol jalan raya.
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
          <span className="text-[11px] font-medium text-[#5C7267]">Total 14.8 km</span>
        </div>

        <p className="text-[11px] text-[#5C7267] leading-snug">
          Variasi kualitas udara mikro yang Anda lalui dari keberangkatan hingga tujuan akhir.
        </p>

        <div className="w-full h-2.5 rounded-full overflow-hidden flex gap-0.5 bg-[#E8F0EB]">
          <div className="h-full bg-amber-400 rounded-l-full" style={{ width: '25%' }} title="Titik Awal" />
          <div className="h-full bg-[#245C49]" style={{ width: '35%' }} title="Senayan Hijau" />
          <div className="h-full bg-amber-400" style={{ width: '25%' }} title="Slipi" />
          <div className="h-full bg-[#34A853] rounded-r-full" style={{ width: '15%' }} title="Kampus" />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6]">
            <span className="text-[11px] font-bold text-[#192A24] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              1. Titik Awal
            </span>
            <span className="text-[10px] text-[#5C7267] block mt-0.5">AQI 68 · Sedang</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#E8F0EB] border border-[#CDE5D7]">
            <span className="text-[11px] font-bold text-[#245C49] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#245C49]" />
              2. Senayan Hijau
            </span>
            <span className="text-[10px] text-[#245C49] font-semibold block mt-0.5">AQI 22 · Bersih</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6]">
            <span className="text-[11px] font-bold text-[#192A24] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              3. Koridor Slipi
            </span>
            <span className="text-[10px] text-[#5C7267] block mt-0.5">AQI 54 · Sedang</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6]">
            <span className="text-[11px] font-bold text-[#192A24] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              4. Area Kampus
            </span>
            <span className="text-[10px] text-[#5C7267] block mt-0.5">AQI 35 · Baik</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7] shadow-sm space-y-2.5">
        <div className="flex items-center gap-2.5">
          <MascotAI pose="circle" size="md" showBadge={true} altText="aeroCircle.png" />
          <div>
            <h4 className="text-xs font-bold text-[#245C49]">
              Mengapa Rute Hijau Direkomendasikan?
            </h4>
            <span className="text-[10px] text-[#5C7267] font-medium">
              AeroRoute AI
            </span>
          </div>
        </div>

        <blockquote className="p-3 rounded-xl bg-white border border-[#CDE5D7] text-xs text-[#192A24] leading-relaxed italic">
          "{scenario.aiExplanation}"
        </blockquote>

        <p className="text-[11px] text-[#245C49] font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#245C49]" />
          Hanya berbeda +3 menit dari rute terpadat, namun 2x lebih sejuk.
        </p>
      </div>

      <div className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#E3ECE6] flex items-start gap-2.5 text-[11px] text-[#5C7267]">
        <Info className="w-4 h-4 text-[#5C7267] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#192A24]">Catatan Transparansi Medis:</strong> Estimasi paparan dihitung berdasarkan durasi dan rata-rata stasiun sensor terdekat. Bukan diagnosis medis klinis.
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
