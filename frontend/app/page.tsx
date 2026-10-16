'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import {
  analyzeRoute,
  clearAuthToken,
  getCurrentUser,
  getEnvironment,
  getSavedAuthToken,
  getTrips,
  saveAuthToken,
  saveTrip,
  searchLocations,
  uploadProfilePhoto,
  updateAccountProfile,
} from '@/lib/api';
import {
  AuthResult,
  EnvironmentData,
  MedicalProfile,
  RouteAnalysisResponse,
  RouteStrategy,
  SavedTrip,
  SaveTripRequest,
  ScenarioPreset,
  TransportMode,
} from '@/lib/types';
import { Smartphone, Monitor, CheckCircle, Sparkles } from 'lucide-react';

export default function AeroRouteApp() {
  const [currentTab, setCurrentTab] = useState<'home' | 'rute' | 'insight' | 'profil'>('home');
  const [scenario, setScenario] = useState<ScenarioPreset>(SCENARIO_SUDIRMAN_BINUS);
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysisResponse['data'] | null>(null);
  const analysisRequestId = useRef(0);
  const [selectedRoute, setSelectedRoute] = useState<'green' | 'red'>('green');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [pollutionSpike, setPollutionSpike] = useState(false);
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile>('asthma');
  const [transportMode, setTransportMode] = useState<TransportMode>('motor');
  const [strategy, setStrategy] = useState<RouteStrategy>('balance');
  const [environment, setEnvironment] = useState<EnvironmentData | null>(null);
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [tripStartedAt, setTripStartedAt] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Sarah Maharani');
  const [userEmail, setUserEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    let isActive = true;
    if (!getSavedAuthToken()) {
      setSessionReady(true);
      return () => { isActive = false; };
    }

    getCurrentUser()
      .then((user) => {
        if (!isActive) return;
        setUserName(user.name);
        setUserEmail(user.email);
        setAvatarUrl(user.avatarUrl);
        setMedicalProfile(user.medicalProfile);
        setTransportMode(user.transportMode);
        setStrategy(user.strategy);
        setIsLoggedIn(true);
        void getTrips().then(setTrips).catch(() => setTrips([]));
      })
      .catch(() => clearAuthToken())
      .finally(() => {
        if (isActive) setSessionReady(true);
      });

    return () => { isActive = false; };
  }, []);

  const envLat = !isDemoMode && userCoords ? userCoords.lat : scenario.origin.coords[0];
  const envLon = !isDemoMode && userCoords ? userCoords.lon : scenario.origin.coords[1];

  useEffect(() => {
    let isActive = true;
    getEnvironment(envLat, envLon)
      .then((data) => { if (isActive) setEnvironment(data); })
      .catch(() => { if (isActive) setEnvironment(null); });
    return () => { isActive = false; };
  }, [envLat, envLon]);;

  const runRouteAnalysis = async (
    targetScenario: ScenarioPreset,
    mode: TransportMode,
    demoSpike = pollutionSpike,
    selectedStrategy = strategy,
    selectedMedicalProfile = medicalProfile
  ) => {
    const requestId = ++analysisRequestId.current;
    setRouteAnalysis(null);
    try {
      const analysis = await analyzeRoute({
        origin: {
          name: targetScenario.origin.name,
          coordinates: {
            latitude: targetScenario.origin.coords[0],
            longitude: targetScenario.origin.coords[1],
          },
        },
        destination: {
          name: targetScenario.destination.name,
          coordinates: {
            latitude: targetScenario.destination.coords[0],
            longitude: targetScenario.destination.coords[1],
          },
        },
        transportMode: mode,
        strategy: selectedStrategy,
        medicalProfile: selectedMedicalProfile,
        demoMode: isDemoMode,
        pollutionSpike: isDemoMode && demoSpike,
      });
      if (requestId === analysisRequestId.current) setRouteAnalysis(analysis);
    } catch (error) {
      if (requestId === analysisRequestId.current) {
        console.warn('Route analysis unavailable; using preset data.', error);
        showToast('Backend belum tersambung; data demo tetap ditampilkan.');
      }
    }
  };

  const handleLoadPreset = (scenarioId: string, mode: TransportMode = transportMode) => {
    const selectedScenario = scenarioId === 'sudirman_binus'
      ? SCENARIO_SUDIRMAN_BINUS
      : SCENARIO_TEBET_SCBD;
    setScenario(selectedScenario);
    setSelectedRoute('green');
    setCurrentTab('rute');
    setTransportMode(mode);
    void runRouteAnalysis(selectedScenario, mode);
  };

  const handleSearchDestination = async (query: string, mode: TransportMode) => {
    try {
      const matches = await searchLocations(query);
      const destination = matches[0];
      if (!destination) {
        showToast('Lokasi tidak ditemukan. Coba nama tempat yang lebih spesifik.');
        return;
      }
      const selectedScenario: ScenarioPreset = {
        ...scenario,
        id: 'custom_destination',
        title: `${scenario.origin.name} → ${destination.name}`,
        destination: {
          name: destination.name,
          detail: destination.detail,
          coords: [destination.coordinates.latitude, destination.coordinates.longitude],
        },
      };
      setScenario(selectedScenario);
      setTransportMode(mode);
      setSelectedRoute('green');
      setCurrentTab('rute');
      void runRouteAnalysis(selectedScenario, mode);
    } catch (error) {
      console.warn('Location search unavailable.', error);
      showToast(error instanceof Error ? error.message : 'Pencarian lokasi gagal.');
    }
  };

  const handleTogglePollutionSpike = () => {
    const nextState = !pollutionSpike;
    setPollutionSpike(nextState);
    if (isDemoMode && currentTab === 'rute') {
      void runRouteAnalysis(scenario, transportMode, nextState);
    }
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
    clearAuthToken();
    setIsLoggedIn(false);
    setIsDemoMode(false);
    setTrips([]);
    setAvatarUrl(null);
    setIsLogoutModalOpen(false);
    showToast(`Sampai jumpa, ${userName}! 👋🏻`);
  };

  const handleLoginSuccess = (result: AuthResult) => {
    saveAuthToken(result.token);
    setIsLoggedIn(true);
    setIsDemoMode(false);
    setUserName(result.user.name);
    setUserEmail(result.user.email);
    setAvatarUrl(result.user.avatarUrl);
    setMedicalProfile(result.user.medicalProfile);
    setTransportMode(result.user.transportMode);
    setStrategy(result.user.strategy);
    void getTrips().then(setTrips).catch(() => setTrips([]));
    showToast(`Selamat datang, ${result.user.name}!`);
  };

  const handleDemoLogin = () => {
    clearAuthToken();
    setIsLoggedIn(true);
    setIsDemoMode(true);
    setUserName('Sarah Maharani');
    setUserEmail('');
    setAvatarUrl('/mascot/profileee.jpg');
    setMedicalProfile('asthma');
    setTransportMode('motor');
    setStrategy('balance');
    showToast('Mode demo aktif.');
  };

  const handleUploadAvatar = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) {
      showToast('Pilih foto PNG, JPEG, atau WebP maksimal 3 MB.');
      return;
    }

    setIsAvatarUploading(true);
    try {
      if (isDemoMode) {
        const preview = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Foto tidak dapat dibaca.'));
          reader.readAsDataURL(file);
        });
        setAvatarUrl(preview);
        showToast('Foto Sarah demo diganti untuk sesi ini.');
      } else {
        const result = await uploadProfilePhoto(file);
        setAvatarUrl(result.avatarUrl);
        showToast('Foto profil berhasil disimpan.');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Upload foto gagal.');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleChangeMedicalProfile = async (profile: MedicalProfile) => {
    setMedicalProfile(profile);
    if (getSavedAuthToken()) {
      try {
        await updateAccountProfile({ medicalProfile: profile });
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Profil gagal disimpan.');
        return;
      }
    }
    if (currentTab === 'rute') {
      void runRouteAnalysis(scenario, transportMode, pollutionSpike, strategy, profile);
    }
  };

  const handleChangeTransportMode = async (mode: TransportMode) => {
    setTransportMode(mode);
    if (getSavedAuthToken()) {
      try {
        await updateAccountProfile({ transportMode: mode });
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Moda gagal disimpan.');
        return;
      }
    }
    if (currentTab === 'rute') {
      void runRouteAnalysis(scenario, mode);
    }
  };

  const handleChangeStrategy = async (nextStrategy: RouteStrategy) => {
    setStrategy(nextStrategy);
    if (getSavedAuthToken()) {
      try {
        await updateAccountProfile({ strategy: nextStrategy });
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Strategi gagal disimpan.');
        return;
      }
    }
    if (currentTab === 'rute') {
      void runRouteAnalysis(scenario, transportMode, pollutionSpike, nextStrategy, medicalProfile);
    }
  };

  const handleStartNavigation = () => {
    setTripStartedAt(new Date().toISOString());
    setIsNavModalOpen(true);
  };

  const handleFinishNavigation = async () => {
    const completedAt = new Date().toISOString();
    const selectedRouteId = selectedRoute === 'green'
      ? routeAnalysis?.recommendedRouteId
      : routeAnalysis?.fastestRouteId;
    const route = routeAnalysis?.routes.find((option) => option.id === selectedRouteId);
    const presetRoute = selectedRoute === 'green' ? scenario.greenRoute : scenario.redRoute;
    const trip: SaveTripRequest = {
      analysisId: routeAnalysis?.analysisId ?? null,
      origin: {
        name: scenario.origin.name,
        coordinates: { latitude: scenario.origin.coords[0], longitude: scenario.origin.coords[1] },
      },
      destination: {
        name: scenario.destination.name,
        coordinates: { latitude: scenario.destination.coords[0], longitude: scenario.destination.coords[1] },
      },
      routeId: route?.id ?? presetRoute.id,
      durationMinutes: route?.durationMinutes ?? presetRoute.durationMinutes,
      distanceKm: route?.distanceKm ?? presetRoute.distanceKm,
      aqi: route?.aqi ?? presetRoute.aqi,
      pm25UgM3: route?.pm25UgM3 ?? environment?.pm25UgM3 ?? scenario.pm25,
      exposureReductionPercent: routeAnalysis?.insight.exposureReductionPercent ?? scenario.exposureSavingsPct,
      startedAt: tripStartedAt ?? completedAt,
      completedAt,
    };

    setIsNavModalOpen(false);
    setCurrentTab('insight');
    try {
      if (getSavedAuthToken() && !isDemoMode) {
        const savedTrip = await saveTrip(trip);
        setTrips((existing) => [savedTrip, ...existing]);
        showToast('Perjalanan tersimpan. Insight diperbarui.');
      } else {
        const localTrip: SavedTrip = { ...trip, id: `local_${Date.now()}`, createdAt: completedAt };
        setTrips((existing) => [localTrip, ...existing]);
        showToast('Perjalanan demo selesai.');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Perjalanan gagal disimpan.');
    }
  };

  return (
    <main className="min-h-screen bg-[#EEF3F0] flex flex-col items-center justify-start text-[#192A24] relative">
      {isDemoMode && <SecretDemoBar
        onLoadPreset={handleLoadPreset}
        pollutionSpike={pollutionSpike}
        onTogglePollutionSpike={handleTogglePollutionSpike}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        medicalProfile={medicalProfile}
        onChangeProfile={handleChangeMedicalProfile}
        onSimulateDrive={() => {
          setIsSimulating(!isSimulating);
          showToast(isSimulating ? 'Simulasi Berhenti' : 'Simulasi GPS Berjalan');
        }}
        isSimulating={isSimulating}
      />}

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

        {!sessionReady ? (
          <div className="flex-1" aria-busy="true" />
        ) : !isLoggedIn ? (
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            onDemoLogin={handleDemoLogin}
            onSkip={handleDemoLogin}
          />
        ) : (
          <>
            <div className="shrink-0">
              <Header
                currentTab={currentTab}
                medicalProfile={medicalProfile}
                userName={userName}
                avatarUrl={avatarUrl}
                liveAqi={pollutionSpike ? 210 : environment?.aqi ?? scenario.currentAqi}
                isLoggedIn={isLoggedIn}
                onProfileClick={() => setCurrentTab('profil')}
                onOpenAuthModal={() => setIsLoggedIn(false)}
              />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-4">
              {currentTab === 'home' && (
                <HomeScreen
                  onGoToRoute={() => setCurrentTab('rute')}
                  onSelectDestination={handleLoadPreset}
                  onSearchDestination={handleSearchDestination}
                  transportMode={transportMode}
                  onChangeTransportMode={handleChangeTransportMode}
                  environment={environment}
                  userName={userName}
                  isDemoMode={isDemoMode}
                  scenario={scenario}
                  pollutionSpike={pollutionSpike}
                  onLocationDetected={(lat, lon) => setUserCoords({ lat, lon })}
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
                  onStartNavigation={handleStartNavigation}
                  onShareRoute={handleShareRoute}
                  isSimulating={isSimulating}
                  routeAnalysis={routeAnalysis}
                />
              )}

              {currentTab === 'insight' && (
                <InsightScreen
                  scenario={scenario}
                  medicalProfile={medicalProfile}
                  trips={trips}
                  routeAnalysis={routeAnalysis}
                  isDemoMode={isDemoMode}
                  onShare={handleShareRoute}
                />
              )}

              {currentTab === 'profil' && (
                <ProfileScreen
                  userName={userName}
                  email={userEmail}
                  avatarUrl={avatarUrl}
                  isAvatarUploading={isAvatarUploading}
                  onUploadAvatar={handleUploadAvatar}
                  trips={trips}
                  isDemoMode={isDemoMode}
                  medicalProfile={medicalProfile}
                  onChangeProfile={handleChangeMedicalProfile}
                  transportMode={transportMode}
                  onChangeTransportMode={handleChangeTransportMode}
                  strategy={strategy}
                  onChangeStrategy={handleChangeStrategy}
                  isLoggedIn={isLoggedIn && !isDemoMode}
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
          onFinish={handleFinishNavigation}
          selectedRoute={selectedRoute}
          destinationName={scenario.destination.name}
          routeData={routeAnalysis?.routes.find((route) => route.id === (
            selectedRoute === 'green' ? routeAnalysis.recommendedRouteId : routeAnalysis.fastestRouteId
          )) ?? null}
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