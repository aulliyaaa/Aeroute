'use client';

import React, { useRef, useState } from 'react';
import {
  ShieldCheck,
  User,
  Heart,
  Wind,
  Bike,
  Car,
  Footprints,
  Baby,
  Activity,
  Check,
  Camera,
  LogOut,
  LogIn,
} from 'lucide-react';
import { MedicalProfile, RouteStrategy, SavedTrip, TransportMode } from '@/lib/types';
import MascotAI from './MascotAI';

interface ProfileScreenProps {
  userName: string;
  email?: string;
  avatarUrl: string | null;
  isAvatarUploading: boolean;
  onUploadAvatar: (file: File) => void;
  medicalProfile: MedicalProfile;
  onChangeProfile: (p: MedicalProfile) => void;
  transportMode: TransportMode;
  onChangeTransportMode: (mode: TransportMode) => void;
  strategy: RouteStrategy;
  onChangeStrategy: (strategy: RouteStrategy) => void;
  trips: SavedTrip[];
  isDemoMode: boolean;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export default function ProfileScreen({
  userName,
  email,
  avatarUrl,
  isAvatarUploading,
  onUploadAvatar,
  medicalProfile,
  onChangeProfile,
  transportMode,
  onChangeTransportMode,
  strategy,
  onChangeStrategy,
  trips,
  isDemoMode,
  isLoggedIn,
  onLogout,
  onOpenLogin,
}: ProfileScreenProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const totalMinutes = trips.reduce((total, trip) => total + trip.durationMinutes, 0);
  const averageAqi = trips.length
    ? Math.round(trips.reduce((total, trip) => total + trip.aqi, 0) / trips.length)
    : null;
  const exposureReductions = trips
    .map((trip) => trip.exposureReductionPercent)
    .filter((value): value is number => value !== null);
  const averageReduction = exposureReductions.length
    ? Math.round(exposureReductions.reduce((total, value) => total + value, 0) / exposureReductions.length)
    : null;
  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-[#245C49] shadow-sm">
              {avatarUrl
                ? <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-[#5C7267]"><User className="w-7 h-7" /></div>}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) onUploadAvatar(file);
                event.currentTarget.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isAvatarUploading}
              aria-label="Unggah foto profil"
              title={isAvatarUploading ? 'Mengunggah foto' : 'Unggah foto profil'}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#245C49] text-white border-2 border-white disabled:opacity-60"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-[#192A24]">{userName}</h2>
              <ShieldCheck className="w-4 h-4 text-[#245C49]" />
            </div>
            <p className="text-[11px] text-[#5C7267]">{email || 'Mode demo'} • Jakarta</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#E8F0EB] text-[#245C49] text-[10px] font-bold border border-[#CDE5D7]">
              ● {isDemoMode ? 'Profil Demo' : 'Profil Aktif'} • {medicalProfile.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Proteksi Rute Aktif Pill (Screenshot 1) */}
        <div className="p-3 rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white text-[#245C49] shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#192A24]">Proteksi Rute Aktif</p>
              <p className="text-[10px] text-[#5C7267]">
                Filter mikro-partikel & jalur hijau terhubung
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#245C49] text-white font-extrabold text-[10px] shadow-sm">
            Aktif
          </span>
        </div>
      </div>

      {/* 2. AIR QUALITY SENSITIVITY CLINICAL PROFILE (Screenshot 1) */}
      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#245C49]" />
            <h3 className="text-xs font-bold text-[#192A24] uppercase tracking-wider">
              Sensitivitas Kualitas Udara
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#5C7267]">Profil Klinis</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div
            onClick={() => onChangeProfile('standard')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              medicalProfile === 'standard'
                ? 'bg-[#E8F0EB] border-2 border-[#245C49]'
                : 'bg-[#F8FAF8] border-[#E3ECE6] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <User className="w-4 h-4 text-[#5C7267]" />
              {medicalProfile === 'standard' && <Check className="w-4 h-4 text-[#245C49] stroke-[3]" />}
            </div>
            <p className="text-xs font-bold text-[#192A24]">Standar</p>
            <p className="text-[10px] text-[#5C7267] mt-0.5">Daya tahan normal</p>
          </div>

          <div
            onClick={() => onChangeProfile('sensitive')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              medicalProfile === 'sensitive'
                ? 'bg-[#E8F0EB] border-2 border-[#245C49]'
                : 'bg-[#F8FAF8] border-[#E3ECE6] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Wind className="w-4 h-4 text-[#245C49]" />
              {medicalProfile === 'sensitive' && <Check className="w-4 h-4 text-[#245C49] stroke-[3]" />}
            </div>
            <p className="text-xs font-bold text-[#192A24]">Sensitif / Alergi</p>
            <p className="text-[10px] text-[#5C7267] mt-0.5">Reaksi debu halus</p>
          </div>

          {/* Asma / Paru */}
          <div
            onClick={() => onChangeProfile('asthma')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              medicalProfile === 'asthma'
                ? 'bg-[#E8F0EB] border-2 border-[#245C49]'
                : 'bg-[#F8FAF8] border-[#E3ECE6] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Heart className="w-4 h-4 text-[#245C49]" />
              {medicalProfile === 'asthma' && <Check className="w-4 h-4 text-[#245C49] stroke-[3]" />}
            </div>
            <p className="text-xs font-bold text-[#192A24]">Asma / Paru</p>
            <p className="text-[10px] text-[#5C7267] mt-0.5">Hipersensitif AQI</p>
          </div>

          <div
            onClick={() => onChangeProfile('pregnant_child')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              medicalProfile === 'pregnant_child'
                ? 'bg-[#E8F0EB] border-2 border-[#245C49]'
                : 'bg-[#F8FAF8] border-[#E3ECE6] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Baby className="w-4 h-4 text-[#245C49]" />
              {medicalProfile === 'pregnant_child' && <Check className="w-4 h-4 text-[#245C49] stroke-[3]" />}
            </div>
            <p className="text-xs font-bold text-[#192A24]">Ibu Hamil / Anak</p>
            <p className="text-[10px] text-[#5C7267] mt-0.5">Perlindungan ganda</p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E3ECE6] space-y-2">
          <span className="text-[11px] font-bold text-[#192A24] block">
            Strategi Optimasi Rute
          </span>

          <div
            onClick={() => onChangeStrategy('balance')}
            className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition-all ${
              strategy === 'balance'
                ? 'bg-[#E8F0EB] border-[#245C49]'
                : 'bg-white border-[#E3ECE6]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                strategy === 'balance'
                  ? 'border-[#245C49] bg-[#245C49]'
                  : 'border-[#CBD5E1]'
              }`}
            >
              {strategy === 'balance' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <p className="text-xs font-bold text-[#192A24]">
                Seimbangkan Waktu & Kualitas Udara
              </p>
              <p className="text-[10px] text-[#5C7267] mt-0.5 leading-snug">
                Toleransi selisih waktu maks: +10 menit demi rute 40% lebih bersih
              </p>
            </div>
          </div>

          <div
            onClick={() => onChangeStrategy('cleanest')}
            className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition-all ${
              strategy === 'cleanest'
                ? 'bg-[#E8F0EB] border-[#245C49]'
                : 'bg-white border-[#E3ECE6]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                strategy === 'cleanest'
                  ? 'border-[#245C49] bg-[#245C49]'
                  : 'border-[#CBD5E1]'
              }`}
            >
              {strategy === 'cleanest' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <p className="text-xs font-bold text-[#192A24]">
                Prioritaskan Rute Paling Bersih
              </p>
              <p className="text-[10px] text-[#5C7267] mt-0.5 leading-snug">
                Mengabaikan waktu tempuh, pilih AQI terendah & koridor pepohonan
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Bike className="w-4 h-4 text-[#245C49]" />
            <h3 className="text-xs font-bold text-[#192A24] uppercase tracking-wider">
              Mode Transportasi Utama
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#5C7267]">Multi-moda</span>
        </div>

        <div
          onClick={() => onChangeTransportMode('motor')}
          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            transportMode === 'motor'
              ? 'bg-[#E8F0EB] border-[#245C49]'
              : 'bg-white border-[#E3ECE6]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-[#245C49] shadow-2xs">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#192A24] flex items-center gap-1.5">
                Sepeda Motor
                <span className="px-1.5 py-0.2 rounded bg-[#CDE5D7] text-[#245C49] font-extrabold text-[9px]">
                  Primer
                </span>
              </p>
              <p className="text-[10px] text-[#5C7267]">Dengan proteksi masker N95 / KF94</p>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              transportMode === 'motor' ? 'border-[#245C49] bg-[#245C49]' : 'border-[#CBD5E1]'
            }`}
          >
            {transportMode === 'motor' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </div>

        <div
          onClick={() => onChangeTransportMode('mobil')}
          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            transportMode === 'mobil'
              ? 'bg-[#E8F0EB] border-[#245C49]'
              : 'bg-white border-[#E3ECE6]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F8FAF8] text-[#5C7267]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#192A24]">Mobil Pribadi / Taksi</p>
              <p className="text-[10px] text-[#5C7267]">Dengan sirkulasi filter kabin HEPA</p>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              transportMode === 'mobil' ? 'border-[#245C49] bg-[#245C49]' : 'border-[#CBD5E1]'
            }`}
          >
            {transportMode === 'mobil' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </div>

        <div
          onClick={() => onChangeTransportMode('jalan')}
          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            transportMode === 'jalan' || transportMode === 'sepeda'
              ? 'bg-[#E8F0EB] border-[#245C49]'
              : 'bg-white border-[#E3ECE6]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F8FAF8] text-[#5C7267]">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#192A24]">Sepeda & Jalan Kaki</p>
              <p className="text-[10px] text-[#5C7267]">Memilih trotoar teduh & taman kota</p>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              transportMode === 'jalan' || transportMode === 'sepeda' ? 'border-[#245C49] bg-[#245C49]' : 'border-[#CBD5E1]'
            }`}
          >
            {(transportMode === 'jalan' || transportMode === 'sepeda') && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E3ECE6] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#245C49]" />
            <h3 className="text-xs font-bold text-[#192A24] uppercase tracking-wider">
              Ringkasan Perjalanan
            </h3>
          </div>
            <span className="text-[11px] font-semibold text-[#5C7267]">Semua waktu</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7]">
              <span className="text-xl font-black text-[#245C49]">{trips.length}</span>
            <span className="block text-[10px] text-[#5C7267] font-medium leading-tight mt-1">
                {isDemoMode ? 'Trip Demo Sesi Ini' : 'Perjalanan Tercatat'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7]">
              <span className="text-xl font-black text-[#245C49]">{(totalMinutes / 60).toFixed(1)}j</span>
            <span className="block text-[10px] text-[#5C7267] font-medium leading-tight mt-1">
                Waktu Tempuh
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#CDE5D7] border border-[#BFE0CD]">
              <span className="text-xl font-black text-[#245C49]">{averageAqi ?? '—'}</span>
            <span className="block text-[10px] text-[#245C49] font-bold leading-tight mt-1">
                AQI Rata-rata
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F8FAF8] border border-[#E3ECE6] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5C7267]">Pengurangan Paparan dari Analisis</span>
            <span className="font-bold text-[#245C49]">{averageReduction === null ? '—' : `${averageReduction}%`}</span>
          </div>

          <div className="w-full h-2.5 bg-[#E8F0EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#245C49] rounded-full"
              style={{ width: `${averageReduction ?? 0}%` }}
            />
          </div>

          <p className="text-[10px] text-[#5C7267] leading-snug">
            {isDemoMode
              ? 'Ringkasan demo hanya tersedia selama sesi ini.'
              : trips.length
                ? 'Ringkasan dihitung dari perjalanan yang tersimpan di akun ini.'
                : 'Selesaikan perjalanan untuk mulai membangun ringkasan akun.'}
          </p>
        </div>
      </div>

      <div className="pt-1">
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="w-full py-3 px-4 rounded-2xl bg-[#FDF2F2] hover:bg-[#FBEAEA] border border-[#F8D7D6] text-[#D9534F] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun (Logout)</span>
          </button>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full py-3 px-4 rounded-2xl bg-[#245C49] hover:bg-[#1B4738] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Akun Lain</span>
          </button>
        )}
      </div>
    </div>
  );
}
