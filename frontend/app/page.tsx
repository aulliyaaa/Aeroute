'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/components/HomeScreen';
import RouteScreen from '@/components/RouteScreen';
import InsightScreen from '@/components/InsightScreen';
import ProfileScreen from '@/components/ProfileScreen';
import SecretDemoBar from '@/components/SecretDemoBar';
import ActiveNavModal from '@/components/ActiveNavModal';
import AuthScreen from '@/components/AuthModal';
import LogoutModal from '@/components/LogoutModal';
import { SCENARIO_SUDIRMAN_BINUS, SCENARIO_TEBET_SCBD } from '@/lib/presets';
import { MedicalProfile, ScenarioPreset } from '@/lib/types';
import { Smartphone, Monitor, CheckCircle, Sparkles } from 'lucide-react';

export default function AeroRouteApp() {
  const [currentTab, setCurrentTab] = useState<'home' | 'rute' | 'insight' | 'profil'>('home');
  const [scenario, setScenario] = useState<ScenarioPreset>(SCENARIO_SUDIRMAN_BINUS);
  const [selectedRoute, setSelectedRoute] = useState<'green' | 'red'>('green');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [pollutionSpike, setPollutionSpike] = useState(false);
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile>('asthma');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('Sarah Maharani');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLoadPreset = (scenarioId: string) => {
    if (scenarioId === 'sudirman_binus') {
      setScenario(SCENARIO_SUDIRMAN_BINUS);
      setSelectedRoute('green');
      setCurrentTab('rute');
      showToast('Skenario FX Sudirman → Binus Dimuat!');
    } else {
      setScenario(SCENARIO_TEBET_SCBD);
      setSelectedRoute('green');
      setCurrentTab('rute');
      showToast('Skenario Tebet → SCBD Dimuat!');
    }
  };

  const handleTogglePollutionSpike = () => {
    const nextState = !pollutionSpike;
    setPollutionSpike(nextState);
    if (nextState) {
      showToast('SPIKE POLUSI SEMANGGI: AQI Naik ke 210!');
    } else {
      showToast('STATUS PULIH: Polusi Normal Pagi Sejuk (AQI 58)');
    }
  };

  const handleShareRoute = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast('🔗 Tautan Rute Sehat Berhasil Disalin!');
  };

  const handleConfirmLogout = () => {
    setIsLoggedIn(false);
    setIsLogoutModalOpen(false);
    showToast('Sampai jumpa, Sarah! 👋🏻');
  };

  const handleLoginSuccess = (user: { name: string; profile: MedicalProfile }) => {
    setIsLoggedIn(true);
    setUserName(user.name);
    setMedicalProfile(user.profile);
    showToast(`Selamat datang kembali, ${user.name}!`);
  };

  return (
    <main className="min-h-screen bg-[#EEF3F0] flex flex-col items-center justify-start text-[#192A24] relative">
      <SecretDemoBar
        onLoadPreset={handleLoadPreset}
        pollutionSpike={pollutionSpike}
        onTogglePollutionSpike={handleTogglePollutionSpike}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        medicalProfile={medicalProfile}
        onChangeProfile={(p) => {
          setMedicalProfile(p);
          showToast(`Profil Medis: ${p.toUpperCase()}`);
        }}
        onSimulateDrive={() => {
          setIsSimulating(!isSimulating);
          showToast(isSimulating ? 'Simulasi Berhenti' : 'Simulasi GPS Berjalan');
        }}
        isSimulating={isSimulating}
      />

      <aside aria-label="Controls" className="hidden lg:flex items-center gap-2 fixed top-4 left-4 z-40 bg-white border border-[#E3ECE6] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#5C7267] shadow-md">
        <span className="text-[#245C49] font-black flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#245C49]" />
          AeroRoute PWA
        </span>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setIsPhoneFrame(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
            isPhoneFrame ? 'bg-[#245C49] text-white font-bold' : 'hover:text-[#192A24]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Mobile View
        </button>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
            !isPhoneFrame ? 'bg-[#245C49] text-white font-bold' : 'hover:text-[#192A24]'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Full Width
        </button>
      </aside>

      {toastMessage && (
        <div className="fixed top-14 z-50 px-4 py-2.5 rounded-2xl bg-[#245C49] text-white font-bold text-xs shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-4 h-4 text-[#CDE5D7]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isPhoneFrame
            ? 'max-w-[430px] h-screen sm:h-[880px] my-0 sm:my-6 sm:rounded-[44px] sm:border-[8px] sm:border-[#CBD5E1] sm:shadow-[0_12px_45px_rgba(0,0,0,0.08)] bg-[#F8FAF8] overflow-hidden'
            : 'max-w-2xl h-screen bg-[#F8FAF8] overflow-hidden'
        }`}
      >
        {isPhoneFrame && (
          <div className="hidden sm:flex justify-center pt-2.5 pb-1 bg-[#F8FAF8] shrink-0 z-10">
            <div className="w-24 h-3.5 rounded-full bg-[#E2E8F0] flex items-center justify-between px-3">
              <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
              <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            </div>
          </div>
        )}

        {!isLoggedIn ? (
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            onSkip={() => setIsLoggedIn(true)}
          />
        ) : (
          <>
            <div className="shrink-0">
              <Header
                currentTab={currentTab}
                medicalProfile={medicalProfile}
                liveAqi={pollutionSpike ? 210 : scenario.currentAqi}
                isLoggedIn={isLoggedIn}
                onProfileClick={() => setCurrentTab('profil')}
                onOpenAuthModal={() => setIsLoggedIn(false)}
              />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-4">
              {currentTab === 'home' && (
                <HomeScreen
                  onGoToRoute={() => setCurrentTab('rute')}
                  onSelectDestination={(id) => handleLoadPreset(id)}
                  scenario={scenario}
                  pollutionSpike={pollutionSpike}
                />
              )}

              {currentTab === 'rute' && (
                <RouteScreen
                  scenario={scenario}
                  selectedRoute={selectedRoute}
                  onSelectRoute={setSelectedRoute}
                  showHeatmap={showHeatmap}
                  pollutionSpike={pollutionSpike}
                  medicalProfile={medicalProfile}
                  onStartNavigation={() => setIsNavModalOpen(true)}
                  onShareRoute={handleShareRoute}
                  isSimulating={isSimulating}
                />
              )}

              {currentTab === 'insight' && (
                <InsightScreen
                  scenario={scenario}
                  medicalProfile={medicalProfile}
                  onShare={handleShareRoute}
                />
              )}

              {currentTab === 'profil' && (
                <ProfileScreen
                  medicalProfile={medicalProfile}
                  onChangeProfile={(p) => {
                    setMedicalProfile(p);
                    showToast(`Profil Medis Diperbarui: ${p}`);
                  }}
                  isLoggedIn={isLoggedIn}
                  onLogout={() => setIsLogoutModalOpen(true)}
                  onOpenLogin={() => setIsLoggedIn(false)}
                />
              )}
            </div>

            <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />
          </>
        )}

        <ActiveNavModal
          isOpen={isNavModalOpen}
          onClose={() => setIsNavModalOpen(false)}
          onFinish={() => {
            setIsNavModalOpen(false);
            setCurrentTab('insight');
            showToast('Perjalanan Bersih Selesai! Menampilkan AI Health Insight...');
          }}
          selectedRoute={selectedRoute}
        />

        <LogoutModal
          isOpen={isLogoutModalOpen}
          userName={userName}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirmLogout={handleConfirmLogout}
        />
      </div>
    </main>
  );
}