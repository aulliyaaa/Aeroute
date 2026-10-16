'use client';

import React from 'react';
import { Compass, GitFork, Activity, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'rute' | 'insight' | 'profil';
  onChangeTab: (tab: 'home' | 'rute' | 'insight' | 'profil') => void;
}

export default function BottomNav({ currentTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'rute', label: 'Rute', icon: GitFork },
    { id: 'insight', label: 'Insight', icon: Activity },
    { id: 'profil', label: 'Profil', icon: User },
  ] as const;

  return (
    <nav className="w-full shrink-0 bg-white/95 backdrop-blur-md border-t border-[#E3ECE6] safe-bottom shadow-sm z-30">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#245C49] font-extrabold'
                  : 'text-[#8A9E93] hover:text-[#5C7267]'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#E8F0EB]' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}