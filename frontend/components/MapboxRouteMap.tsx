'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Layers, Crosshair, Sparkles } from 'lucide-react';

interface MapboxRouteMapProps {
  selectedRoute: 'green' | 'red';
  onSelectRoute: (route: 'green' | 'red') => void;
  showHeatmap: boolean;
  pollutionSpike: boolean;
  originName?: string;
  destName?: string;
  isSimulating?: boolean;
}

const DEFAULT_MAPBOX_TOKEN =
  'pk.eyJ1IjoiOW1hbnVzaWEiLCJhIjoiY212OW5rYmZiMDJ3dTJ3cTF2am1oZGpmNiJ9.e7hRdqqwVtEw4y1KZwHGfQ';

export default function MapboxRouteMap({
  selectedRoute,
  onSelectRoute,
  showHeatmap,
  pollutionSpike,
  originName = 'FX Sudirman (Pintu Senayan)',
  destName = 'Kampus Binus Anggrek',
  isSimulating = false,
}: MapboxRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [carProgress, setCarProgress] = useState(0);

  useEffect(() => {
    if (!isSimulating) {
      setCarProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setCarProgress((prev) => (prev >= 100 ? 0 : prev + 1.2));
    }, 100);
    return () => clearInterval(interval);
  }, [isSimulating]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || DEFAULT_MAPBOX_TOKEN;
    if (!token || !mapContainerRef.current) return;

    let isMounted = true;

    import('mapbox-gl')
      .then((mapboxglModule) => {
        if (!isMounted || !mapContainerRef.current) return;
        const mapboxgl = (mapboxglModule as any).default || mapboxglModule;
        mapboxgl.accessToken = token;

        try {
          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/light-v11', 
            center: [106.797, -6.213],
            zoom: 13.2,
            attributionControl: false,
          });

          mapInstanceRef.current = map;

          map.on('load', () => {
            if (!isMounted) return;
            setMapLoaded(true);

            const greenGeojson = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [106.8041, -6.2255],
                  [106.8015, -6.2220],
                  [106.7990, -6.2165],
                  [106.7945, -6.2105],
                  [106.7880, -6.2060],
                  [106.7822, -6.2017],
                ],
              },
            };

            const redGeojson = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [106.8041, -6.2255],
                  [106.8166, -6.2185],
                  [106.8110, -6.2120],
                  [106.8000, -6.2050],
                  [106.7822, -6.2017],
                ],
              },
            };

            map.addSource('route-green', { type: 'geojson', data: greenGeojson as any });
            map.addSource('route-red', { type: 'geojson', data: redGeojson as any });

            map.addLayer({
              id: 'route-green-casing',
              type: 'line',
              source: 'route-green',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#A7D4C0',
                'line-width': selectedRoute === 'green' ? 10 : 6,
                'line-opacity': 0.6,
              },
            });

            map.addLayer({
              id: 'route-green-core',
              type: 'line',
              source: 'route-green',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#245C49',
                'line-width': selectedRoute === 'green' ? 5 : 3.5,
              },
            });

            map.addLayer({
              id: 'route-red-core',
              type: 'line',
              source: 'route-red',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#D9534F',
                'line-width': selectedRoute === 'red' ? 5 : 3.5,
                'line-dasharray': [2, 2],
                'line-opacity': selectedRoute === 'red' ? 0.9 : 0.6,
              },
            });

            const startEl = document.createElement('div');
            startEl.className = 'w-5 h-5 rounded-full bg-[#245C49] border-2 border-white shadow-md flex items-center justify-center';
            startEl.innerHTML = '<div class="w-2 h-2 rounded-full bg-white"></div>';
            new mapboxgl.Marker(startEl).setLngLat([106.8041, -6.2255]).addTo(map);

            const endEl = document.createElement('div');
            endEl.className = 'w-5 h-5 rounded-full bg-[#245C49] border-2 border-white shadow-md flex items-center justify-center';
            endEl.innerHTML = '<div class="w-2 h-2 rounded-full bg-white"></div>';
            new mapboxgl.Marker(endEl).setLngLat([106.7822, -6.2017]).addTo(map);
          });

          map.on('error', () => {
            setUseFallback(true);
          });
        } catch (err) {
          console.warn('Mapbox error, using fallback light map vector', err);
          setUseFallback(true);
        }
      })
      .catch(() => {
        setUseFallback(true);
      });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (_) {}
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;
    try {
      if (map.getLayer('route-green-core')) {
        map.setPaintProperty('route-green-core', 'line-width', selectedRoute === 'green' ? 5 : 3.5);
        map.setPaintProperty('route-green-casing', 'line-width', selectedRoute === 'green' ? 10 : 5);
      }
      if (map.getLayer('route-red-core')) {
        map.setPaintProperty('route-red-core', 'line-width', selectedRoute === 'red' ? 5 : 3.5);
        map.setPaintProperty('route-red-core', 'line-opacity', selectedRoute === 'red' ? 0.95 : 0.55);
      }
    } catch (_) {}
  }, [selectedRoute, mapLoaded]);

  const greenPathD = 'M 290 260 C 230 240, 200 170, 160 130 S 130 90, 110 60';
  const redPathD = 'M 290 260 C 330 200, 310 130, 230 110 S 140 80, 110 60';

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-[#E3ECE6] bg-[#EEF3F0]">
      <div
        ref={mapContainerRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          mapLoaded && !useFallback ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {(!mapLoaded || useFallback) && (
        <div className="absolute inset-0 w-full h-full bg-[#EBF0F2]">
          <svg
            className="w-full h-full object-cover select-none"
            viewBox="0 0 400 320"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="softGreenGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#245C49" />
                <stop offset="100%" stopColor="#327A63" />
              </linearGradient>

              <radialGradient id="softSmogHeat" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D9534F" stopOpacity={pollutionSpike ? '0.45' : '0.25'} />
                <stop offset="60%" stopColor="#E26D68" stopOpacity={pollutionSpike ? '0.2' : '0.08'} />
                <stop offset="100%" stopColor="#D9534F" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="100%" height="100%" fill="#EAF0F2" />

            <path
              d="M 60 0 Q 130 150 160 320"
              fill="none"
              stroke="#D6E5EB"
              strokeWidth="10"
            />

            <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="0" y1="70" x2="400" y2="70" />
              <line x1="0" y1="150" x2="400" y2="150" />
              <line x1="0" y1="230" x2="400" y2="230" />
              <line x1="90" y1="0" x2="90" y2="320" />
              <line x1="170" y1="0" x2="170" y2="320" />
              <line x1="270" y1="0" x2="270" y2="320" />
              <line x1="350" y1="0" x2="350" y2="320" />
              <path d="M 20 270 L 380 50" />
              <path d="M 50 50 L 350 270" />
            </g>

            <g stroke="#F1D8A8" strokeWidth="4" opacity="0.65">
              <path d="M 0 150 L 400 150" />
              <path d="M 270 0 L 270 320" />
            </g>

            <ellipse cx="210" cy="180" rx="50" ry="34" fill="#D6EEDF" />
            <ellipse cx="140" cy="90" rx="35" ry="24" fill="#D6EEDF" />
            <text x="185" y="195" fill="#245C49" fontSize="7.5" fontWeight="700" opacity="0.8">
              Gelora Bung Karno
            </text>
            <text x="195" y="145" fill="#64748B" fontSize="9" fontWeight="800" opacity="0.4">
              Jakarta
            </text>
            <text x="300" y="70" fill="#64748B" fontSize="8" fontWeight="600" opacity="0.5">
              North Jakarta
            </text>
            <text x="260" y="270" fill="#64748B" fontSize="8" fontWeight="600" opacity="0.5">
              South Jakarta
            </text>
            <text x="40" y="105" fill="#64748B" fontSize="8" fontWeight="600" opacity="0.5">
              West Jakarta
            </text>

            {showHeatmap && (
              <g>
                <circle cx="310" cy="165" r={pollutionSpike ? '52' : '38'} fill="url(#softSmogHeat)" />
                <ellipse cx="245" cy="120" rx="32" ry="18" fill="url(#softSmogHeat)" />
              </g>
            )}

            <g
              className="cursor-pointer transition-all duration-300"
              onClick={() => onSelectRoute('red')}
            >
              <path
                d={redPathD}
                fill="none"
                stroke="#F8D7D6"
                strokeWidth={selectedRoute === 'red' ? 9 : 5}
                strokeLinecap="round"
                opacity={selectedRoute === 'red' ? 0.9 : 0.4}
              />
              <path
                d={redPathD}
                fill="none"
                stroke="#D9534F"
                strokeWidth={selectedRoute === 'red' ? 4 : 2.5}
                strokeLinecap="round"
                opacity={selectedRoute === 'red' ? 1 : 0.6}
              />
            </g>

            <g
              className="cursor-pointer transition-all duration-300"
              onClick={() => onSelectRoute('green')}
            >
              <path
                d={greenPathD}
                fill="none"
                stroke="#CDE5D7"
                strokeWidth={selectedRoute === 'green' ? 11 : 6}
                strokeLinecap="round"
                opacity={selectedRoute === 'green' ? 0.9 : 0.5}
              />
              {/* Solid dark green core */}
              <path
                d={greenPathD}
                fill="none"
                stroke="#245C49"
                strokeWidth={selectedRoute === 'green' ? 4.5 : 3}
                strokeLinecap="round"
              />
              <path
                d={greenPathD}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>

            {isSimulating && (
              <g transform={`translate(${290 - carProgress * 1.8}, ${260 - carProgress * 2})`}>
                <circle r="7" fill="#245C49" fillOpacity="0.3" className="animate-ping" />
                <circle r="5" fill="#245C49" stroke="#FFFFFF" strokeWidth="2" />
              </g>
            )}

            <g transform="translate(290, 260)" className="cursor-pointer">
              <circle r="8" fill="#245C49" fillOpacity="0.25" />
              <circle r="5.5" fill="#245C49" stroke="#FFFFFF" strokeWidth="2" />
              <circle r="2" fill="#FFFFFF" />
            </g>

            <g transform="translate(110, 60)" className="cursor-pointer">
              <circle r="8" fill="#245C49" fillOpacity="0.25" />
              <circle r="5.5" fill="#245C49" stroke="#FFFFFF" strokeWidth="2" />
              <circle r="2" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      )}

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-xs font-bold text-[#192A24] shadow-sm border border-[#E3ECE6]">
          <span className="w-2 h-2 rounded-full bg-[#245C49]"></span>
          <span className="truncate max-w-[140px] sm:max-w-xs">
            FX Sudirman → Binus Anggrek
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 text-xs font-bold text-[#245C49] shadow-sm border border-[#E3ECE6]">
          <Sparkles className="w-3.5 h-3.5 text-[#245C49]" />
          <span>-38% Polusi</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-10">
        <button
          onClick={() => {
            const map = mapInstanceRef.current;
            if (map) {
              map.flyTo({ center: [106.797, -6.213], zoom: 13.2 });
            }
          }}
          title="Center on Route"
          className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-[#192A24] border border-[#E3ECE6] shadow-md flex items-center justify-center transition-all active:scale-95"
        >
          <Crosshair className="w-4 h-4 text-[#192A24]" />
        </button>
        <button
          onClick={() => onSelectRoute(selectedRoute === 'green' ? 'red' : 'green')}
          title="Switch Active Route"
          className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-[#192A24] border border-[#E3ECE6] shadow-md flex items-center justify-center transition-all active:scale-95"
        >
          <Layers className="w-4 h-4 text-[#192A24]" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">
        <button
          onClick={() => onSelectRoute('green')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
            selectedRoute === 'green'
              ? 'bg-[#245C49] text-white'
              : 'bg-white/90 text-[#245C49] border border-[#E3ECE6]'
          }`}
        >
          AeroRoute (Hijau)
        </button>
        <button
          onClick={() => onSelectRoute('red')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
            selectedRoute === 'red'
              ? 'bg-[#D9534F] text-white'
              : 'bg-white/90 text-[#D9534F] border border-[#E3ECE6]'
          }`}
        >
          Cepat (Merah)
        </button>
      </div>
    </div>
  );
}
