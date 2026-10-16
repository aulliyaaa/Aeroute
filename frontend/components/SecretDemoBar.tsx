'use client';

import React, { useState } from 'react';
import { Sliders, Zap, Flame, Sparkles, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { MedicalProfile } from '@/lib/types';
import MascotAI from './MascotAI';

interface SecretDemoBarProps {
  onLoadPreset: (scenarioId: string) => void;
  pollutionSpike: boolean;
  onTogglePollutionSpike: () => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  medicalProfile: MedicalProfile;
  onChangeProfile: (profile: MedicalProfile) => void;
  onSimulateDrive: () => void;
  isSimulating: boolean;
}

export default function SecretDemoBar({
  onLoadPreset,
  pollutionSpike,
  onTogglePollutionSpike,
  showHeatmap,
  onToggleHeatmap,
  medicalProfile,
  onChangeProfile,
  onSimulateDrive,
  isSimulating,
}: SecretDemoBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
      {/* Floating Pill Toggle (Light Theme) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#245C49] border border-[#CDE5D7] shadow-lg text-xs font-bold transition-all active:scale-95"
      >
        <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
        <span>DEMO JURI PANEL</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {/* Expanded Secret Control Drawer (Light Theme) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 p-4 rounded-3xl bg-white border border-[#E3ECE6] shadow-2xl text-[#192A24] space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#E3ECE6]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#245C49]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#245C49]">
                Fitur Sakti Presentasi
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E8F0EB] text-[#245C49] font-mono font-bold">
              SECRET
            </span>
          </div>

          {/* 1. 1-TAP SCENARIO PRESETS */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#5C7267]">1-Tap Skenario Otomatis:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onLoadPreset('sudirman_binus')}
                className="px-2.5 py-2 rounded-xl bg-[#E8F0EB] hover:bg-[#D9E7DD] border border-[#CDE5D7] text-[11px] font-bold text-left transition-all text-[#245C49] leading-tight"
              >
                🎯 FX Sudirman → Binus
              </button>
              <button
                onClick={() => onLoadPreset('tebet_scbd')}
                className="px-2.5 py-2 rounded-xl bg-[#F8FAF8] hover:bg-[#EEF3F0] border border-[#E3ECE6] text-[11px] font-bold text-left transition-all text-[#5C7267] leading-tight"
              >
                🏢 Tebet → SCBD
              </button>
            </div>
          </div>

          {/* 2. INSTANT AQI / SMOG SPIKE TOGGLE */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#5C7267]">Simulasi Status AQI Instan:</span>
            <button
              onClick={onTogglePollutionSpike}
              className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                pollutionSpike
                  ? 'bg-[#FDF2F2] text-[#D9534F] border border-[#F8D7D6] shadow-sm'
                  : 'bg-[#E8F0EB] text-[#245C49] border border-[#CDE5D7]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {pollutionSpike ? (
                  <Flame className="w-3.5 h-3.5 text-[#D9534F] animate-pulse" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#245C49]" />
                )}
                {pollutionSpike ? 'Spike Polusi Semanggi (AQI 210)' : 'Normal Pagi Sejuk (AQI 58)'}
              </span>
              <span className="text-[10px] underline font-medium">Ubah Status</span>
            </button>
          </div>

          {/* 3. MEDICAL PROFILE QUICK SWITCH */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#5C7267]">Ganti Profil Medis:</span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                onClick={() => onChangeProfile('asthma')}
                className={`p-1.5 rounded-lg font-bold border transition-all ${
                  medicalProfile === 'asthma'
                    ? 'bg-[#245C49] text-white border-[#245C49]'
                    : 'bg-[#F8FAF8] text-[#5C7267] border-[#E3ECE6] hover:bg-[#E8F0EB]'
                }`}
              >
                🫁 Asma / Paru
              </button>
              <button
                onClick={() => onChangeProfile('sensitive')}
                className={`p-1.5 rounded-lg font-bold border transition-all ${
                  medicalProfile === 'sensitive'
                    ? 'bg-[#245C49] text-white border-[#245C49]'
                    : 'bg-[#F8FAF8] text-[#5C7267] border-[#E3ECE6] hover:bg-[#E8F0EB]'
                }`}
              >
                🤧 Alergi Debu
              </button>
              <button
                onClick={() => onChangeProfile('pregnant_child')}
                className={`p-1.5 rounded-lg font-bold border transition-all ${
                  medicalProfile === 'pregnant_child'
                    ? 'bg-[#245C49] text-white border-[#245C49]'
                    : 'bg-[#F8FAF8] text-[#5C7267] border-[#E3ECE6] hover:bg-[#E8F0EB]'
                }`}
              >
                🤰 Ibu Hamil/Anak
              </button>
              <button
                onClick={() => onChangeProfile('standard')}
                className={`p-1.5 rounded-lg font-bold border transition-all ${
                  medicalProfile === 'standard'
                    ? 'bg-[#245C49] text-white border-[#245C49]'
                    : 'bg-[#F8FAF8] text-[#5C7267] border-[#E3ECE6] hover:bg-[#E8F0EB]'
                }`}
              >
                👤 Standar
              </button>
            </div>
          </div>

          {/* 4. MAP VISUAL EXTRAS */}
          <div className="flex items-center justify-between pt-1 border-t border-[#E3ECE6] text-xs">
            <span className="text-[#5C7267] text-[11px]">Heatmap Overlay:</span>
            <button
              onClick={onToggleHeatmap}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                showHeatmap
                  ? 'bg-[#E8F0EB] text-[#245C49] border-[#CDE5D7]'
                  : 'bg-[#F8FAF8] text-[#8A9E93] border-[#E3ECE6]'
              }`}
            >
              {showHeatmap ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          {/* 5. SIMULATED LIVE NAVIGATION */}
          <button
            onClick={onSimulateDrive}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-[#245C49] hover:bg-[#1B4738] text-white shadow-sm'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Hentikan Simulasi GPS' : 'Simulasi GPS Bergerak'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
