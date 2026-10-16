'use client';

import React from 'react';
import { RouteOption } from '@/lib/types';
import { Check, AlertTriangle, ShieldCheck, Trees } from 'lucide-react';

interface RouteComparisonCardProps {
  greenRoute: RouteOption;
  redRoute: RouteOption;
  selectedRoute: 'green' | 'red';
  onSelectRoute: (id: 'green' | 'red') => void;
}

export default function RouteComparisonCard({
  greenRoute,
  redRoute,
  selectedRoute,
  onSelectRoute,
}: RouteComparisonCardProps) {
  return (
    <div className="space-y-3 w-full">
      <div
        onClick={() => onSelectRoute('green')}
        role="button"
        tabIndex={0}
        className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 cursor-pointer text-left ${
          selectedRoute === 'green'
            ? 'bg-[#E8F0EB] border-2 border-[#245C49]/60 shadow-sm ring-1 ring-[#245C49]/20'
            : 'bg-white border border-[#E3ECE6] hover:bg-[#F8FAF8] opacity-90'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#245C49] text-white font-extrabold text-[10px] tracking-wide uppercase shadow-sm">
            <span>RECOMMENDED</span>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              selectedRoute === 'green'
                ? 'bg-[#245C49] text-white shadow-sm'
                : 'border border-[#CBD5E1] bg-white'
            }`}
          >
            {selectedRoute === 'green' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-[#192A24] tracking-tight">32 mnt</span>
          <span className="text-xs font-semibold text-[#5C7267]">
            (+7 mnt vs arteri)
          </span>
          <span className="text-xs text-[#5C7267]">• 8.4 km</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#245C49] mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#245C49]" />
          <span>Paparan Polusi Rendah (AQI 58)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#CDE5D7]">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-[#CDE5D7] text-[#245C49] text-[11px] font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#245C49]" />
            -42µg Partikel Terhindar
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-[#CDE5D7] text-[#5C7267] text-[11px] font-medium shadow-2xs">
            <Trees className="w-3.5 h-3.5 text-[#245C49]" />
            Koridor Taman Senayan
          </span>
        </div>
      </div>

      <div
        onClick={() => onSelectRoute('red')}
        role="button"
        tabIndex={0}
        className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 cursor-pointer text-left ${
          selectedRoute === 'red'
            ? 'bg-[#FDF2F2] border-2 border-[#D9534F]/60 shadow-sm'
            : 'bg-white border border-[#E3ECE6] hover:bg-[#F8FAF8] opacity-85'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#192A24] tracking-tight">25 mnt</span>
            <span className="text-xs font-bold text-[#D9534F]">Tercepat</span>
            <span className="text-xs text-[#5C7267]">• 7.1 km</span>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              selectedRoute === 'red'
                ? 'bg-[#D9534F] text-white shadow-sm'
                : 'border border-[#CBD5E1] bg-[#F1F5F3]'
            }`}
          >
            {selectedRoute === 'red' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9534F] mb-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9534F]" />
          <span>Paparan Polusi Tinggi (AQI 154)</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#5C7267] pt-1 border-t border-[#E3ECE6]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#D9534F] flex-shrink-0" />
          <span className="truncate">Kemacetan padat & asap knalpot Jl. Gatot Subroto</span>
        </div>
      </div>
    </div>
  );
}
