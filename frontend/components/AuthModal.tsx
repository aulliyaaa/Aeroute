'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Check, Lock, Sparkles, User, ShieldCheck } from 'lucide-react';
import { loginAccount, registerAccount } from '@/lib/api';
import { AuthResult, MedicalProfile } from '@/lib/types';
import MascotAI from './MascotAI';

interface AuthScreenProps {
  onLoginSuccess: (result: AuthResult) => void;
  onDemoLogin: () => void;
  onSkip?: () => void;
}

export default function AuthScreen({
  onLoginSuccess,
  onDemoLogin,
  onSkip,
}: AuthScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<MedicalProfile>('asthma');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDemoLogin = () => {
    onDemoLogin();
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = authMode === 'register'
        ? await registerAccount({ name, email, password, medicalProfile: selectedProfile })
        : await loginAccount(email, password);
      onLoginSuccess(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Tidak dapat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAF8] text-[#192A24] px-5 py-6 justify-between animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between shrink-0 pb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 rounded-full transition-all duration-300 ${
              step >= 1 ? 'w-7 bg-[#245C49]' : 'w-2 bg-[#E3ECE6]'
            }`}
          />
          <span
            className={`h-2 rounded-full transition-all duration-300 ${
              step >= 2 ? 'w-7 bg-[#245C49]' : 'w-2 bg-[#E3ECE6]'
            }`}
          />
          <span
            className={`h-2 rounded-full transition-all duration-300 ${
              step >= 3 ? 'w-7 bg-[#245C49]' : 'w-2 bg-[#E3ECE6]'
            }`}
          />
        </div>

        {onSkip && step === 1 && (
          <button
            onClick={onSkip}
            className="text-xs font-bold text-[#8A9E93] hover:text-[#245C49] transition-colors"
          >
            Lewati
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto py-4 flex flex-col justify-center">
        
        {step === 1 && (
          <div className="space-y-5 text-center animate-in fade-in duration-300">
            <div className="flex justify-center">
              <div className="relative p-5 rounded-full bg-[#E8F0EB] border border-[#CDE5D7] shadow-sm">
                <MascotAI pose="location" size="2xl" showBadge={true} altText="aeroMaps.png" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight text-[#192A24]">
                Selamat Datang di AeroRoute
              </h1>
              <div className="p-3.5 rounded-2xl bg-[#E8F0EB]/80 border border-[#CDE5D7] text-[#245C49] text-xs font-medium leading-relaxed max-w-xs mx-auto">
                🗺️ <strong>"Yuk masuk dulu!"</strong>
                <p className="text-[11px] mt-0.5 text-[#5C7267]">
                  Aero bakal bantu sesuaikan rute paling bersih sesuai daya tahan dan profil napasmu.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-left max-w-xs mx-auto">
              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full p-3.5 rounded-2xl bg-white border-2 border-[#245C49] flex items-center justify-between group transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-[#245C49] shrink-0">
                    <img
                      src="/mascot/profileee.jpg"
                      alt="Sarah"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#192A24]">Sarah Maharani</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#245C49] text-white font-black">
                        DEMO
                      </span>
                    </div>
                    <p className="text-[10px] text-[#5C7267]">Profil Asma & Sensitivity Tinggi</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#245C49] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#245C49] hover:bg-[#1B4738] text-white font-extrabold text-xs shadow-md shadow-[#245C49]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Atur Profil Napas Sendiri</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                  setStep(3);
                }}
                className="w-full py-2 text-xs font-bold text-[#245C49] hover:underline"
              >
                Sudah punya akun? Masuk
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-2">
              <MascotAI pose="confuse" size="xl" showBadge={false} altText="aeroBingung.png" />
            </div>
            <h2 className="text-xl font-black text-[#192A24] tracking-tight">
              Bagaimana Kondisi Napasmu?
            </h2>
            <p className="text-xs text-[#5C7267]">
              Pilih profil yang paling mendekati agar filter udara bekerja maksimal:
            </p>
          </div>
      
          <div className="space-y-2">
            {[
              {
                id: 'asthma',
                label: 'Asma / Gangguan Paru',
                desc: 'Hipersensitif AQI, wajib prioritas jalur hijau dan bebas asap knalpot.',
                icon: '🫁',
              },
              {
                id: 'sensitive',
                label: 'Sensitif / Alergi Debu',
                desc: 'Mudah batuk/bersin terhadap partikel mikro PM2.5 di atas 100 AQI.',
                icon: '🤧',
              },
              {
                id: 'pregnant_child',
                label: 'Ibu Hamil / Bersama Anak',
                desc: 'Proteksi ganda ekstra ketat dengan jalur koridor pepohonan.',
                icon: '🤰',
              },
              {
                id: 'standard',
                label: 'Standar Normal',
                desc: 'Daya tahan perkotaan normal, optimasi rute seimbang.',
                icon: '👤',
              },
            ].map((opt) => {
              const isSelected = selectedProfile === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedProfile(opt.id as MedicalProfile)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#E8F0EB] border-[#245C49] shadow-sm'
                      : 'bg-white border-[#E3ECE6] hover:bg-[#F8FAF8]'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#192A24]">{opt.label}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#245C49] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-[#5C7267] mt-0.5 leading-snug">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <div className="flex justify-center mb-2">
                <MascotAI pose="jump" size="xl" showBadge={true} altText="aeroJump.png" />
              </div>
              <h2 className="text-xl font-black text-[#192A24] tracking-tight">
                {authMode === 'register' ? 'Lengkapi Akunmu' : 'Masuk ke AeroRoute'}
              </h2>
              <p className="text-xs text-[#5C7267]">
                {authMode === 'register'
                  ? 'Aero siap menyimpan profil dan perjalananmu.'
                  : 'Gunakan email dan password akunmu.'}
              </p>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E3ECE6] shadow-sm">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#5C7267] block">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda"
                      autoComplete="name"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6] text-xs font-bold text-[#192A24] focus:outline-none focus:border-[#245C49]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5C7267] block">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6] text-xs font-bold text-[#192A24] focus:outline-none focus:border-[#245C49]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#5C7267] block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAF8] border border-[#E3ECE6] text-xs font-bold text-[#192A24] focus:outline-none focus:border-[#245C49]"
                  />
                </div>
              </div>
            </div>

            {authMode === 'register' && <div className="p-3 rounded-xl bg-[#E8F0EB] border border-[#CDE5D7] flex items-center justify-between text-xs">
              <span className="text-[#5C7267] font-medium">Profil Kesehatan:</span>
              <span className="font-black text-[#245C49] uppercase flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#245C49]" />
                {selectedProfile}
              </span>
            </div>}

            {errorMessage && (
              <p role="alert" className="text-xs font-semibold text-[#D9534F]">{errorMessage}</p>
            )}
          </div>
        )}
      </div>

      {step > 1 && (
        <div className="flex items-center gap-2 shrink-0 pt-2 border-t border-[#E3ECE6]">
          <button
            onClick={() => {
              if (authMode === 'login') {
                setAuthMode('register');
                setStep(1);
              } else {
                setStep((s) => (s - 1) as 1 | 2);
              }
            }}
            className="py-3 px-5 rounded-2xl bg-[#F8FAF8] hover:bg-[#E8F0EB] text-[#5C7267] font-bold text-xs border border-[#E3ECE6] transition-all"
          >
            Kembali
          </button>
          
          {step === 2 ? (
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#245C49] hover:bg-[#1B4738] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span>Lanjut ke Akun</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isLoading || !email || !password || (authMode === 'register' && !name)}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#245C49] hover:bg-[#1B4738] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span>{isLoading ? 'Menghubungkan...' : authMode === 'register' ? 'Buat Akun & Masuk' : 'Masuk'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}