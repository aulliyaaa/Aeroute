'use client';

import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { MedicalProfile } from '@/lib/types';

interface HeaderProps {
  currentTab: string;
  medicalProfile: MedicalProfile;
  liveAqi?: number;
  isLoggedIn: boolean;
  onProfileClick: () => void;
  onSecretTrigger?: () => void;
  onOpenAuthModal?: () => void;
}

const SUBTITLE: Record<string, string> = {
  home: 'Home',
  rute: 'Route',
  insight: 'AI Insight',
  profil: 'Profile',
};

export default function Header({
  currentTab,
  liveAqi = 18,
  isLoggedIn,
  onProfileClick,
  onSecretTrigger,
  onOpenAuthModal,
}: HeaderProps) {
  const [logoErr, setLogoErr] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F8FAF8]/95 backdrop-blur-md border-b border-[#E3ECE6] px-4 py-2.5">
      <div className="flex items-center justify-between">
        
        <button
          onClick={onSecretTrigger}
          title="AeroRoute"
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          {logoErr ? (
            <b className="text-lg font-black text-[#245C49] tracking-tight">
              Aeroute
            </b>
          ) : (
            <img
              src="/mascot/aeroute.png"
              alt="Aeroute"
              className="h-7 w-auto object-contain transition-transform group-active:scale-95"
              onError={() => setLogoErr(true)}
            />
          )}
          
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F0EB] text-[#245C49] text-[11px] font-extrabold border border-[#CDE5D7]">
            <span className="w-2 h-2 rounded-full bg-[#245C49] animate-pulse" />
            <span>{liveAqi} AQI</span>
          </div>

          {isLoggedIn ? (
            <button
              onClick={onProfileClick}
              className="relative p-0.5 rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none"
              title="Profil Sarah Maharani"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Sarah Maharani"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#245C49] text-white text-xs font-bold shadow-sm hover:bg-[#1B4738] active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}