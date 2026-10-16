'use client';

import React from 'react';
import { X, Heart, ShieldAlert, LogOut } from 'lucide-react';
import MascotAI from './MascotAI';

interface LogoutModalProps {
  isOpen: boolean;
  userName?: string;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export default function LogoutModal({
  isOpen,
  userName = 'Sarah Maharani',
  onClose,
  onConfirmLogout,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[32px] bg-white border border-[#E3ECE6] shadow-2xl p-6 space-y-4 text-[#192A24] relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 bg-[#F8FAF8] border border-[#E3ECE6] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sad Mascot Illustration (Inspired by Dribbble Card 3 in Image 2) */}
        <div className="pt-2 flex flex-col items-center space-y-3">
          <div className="relative p-3 rounded-full bg-[#E8F0EB]/60">
            <MascotAI pose="sad" size="xl" showBadge={false} />
            <div className="absolute -top-1 -right-1 p-1 rounded-full bg-white text-rose-500 shadow-sm border border-[#E3ECE6]">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
          </div>

          {/* Sad Thought Bubble */}
          <div className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#E3ECE6] text-[#5C7267] text-xs font-medium leading-relaxed shadow-2xs">
            🥺 <strong className="text-[#192A24]">"Aero bakal kangen nemenin kamu..."</strong>
            <p className="mt-1 text-[11px]">
              Jangan lupa selalu pakai masker jika melintasi jalan arteri padat polusi ya, Sarah!
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#192A24] tracking-tight">
              Yakin Mau Keluar?
            </h2>
            <p className="text-xs text-[#5C7267] mt-0.5">
              Sesi proteksi rute bersih untuk <strong>{userName}</strong> akan dinonaktifkan.
            </p>
          </div>
        </div>

        {/* Action Buttons (Inspired by Dribbble Action Layout) */}
        <div className="space-y-2 pt-2">
          {/* Primary: Stay with Aero */}
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#245C49] hover:bg-[#1B4738] text-white font-black text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <span>Tetap Bersama Aero</span>
          </button>

          {/* Secondary: Confirm Logout */}
          <button
            onClick={onConfirmLogout}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#FDF2F2] hover:bg-[#FBEAEA] text-[#D9534F] font-bold text-xs border border-[#F8D7D6] transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ya, Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}

