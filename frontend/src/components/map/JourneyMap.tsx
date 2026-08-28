import { useEffect, useRef, useState, useCallback } from 'react';
import { Map as MapLibreMap, Marker, Popup, type GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapControls } from './MapControls';
import { FollowTrainButton } from './FollowTrainButton';
import { getRouteBounds } from '../../utils/geo';
import type { TrainRoute, LiveJourney, GeographicFeature } from '../../types';

interface JourneyMapProps {
  route: TrainRoute;
  liveJourney: LiveJourney;
  features?: GeographicFeature[];
  className?: string;
}

export function JourneyMap({ route, liveJourney, features = [], className = '' }: JourneyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const trainMarkerRef = useRef<Marker | null>(null);
  const stationMarkersRef = useRef<Marker[]>([]);
  const poiMarkersRef = useRef<Marker[]>([]);
  const isMapRemovedRef = useRef(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [showRecenter, setShowRecenter] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapStyleType, setMapStyleType] = useState<'backdrop-dark' | 'streets-v2-dark' | 'streets-v2' | 'outdoor-v2'>('backdrop-dark');

  const maptilerKey = import.meta.env.VITE_MAPTILER_API_KEY || '8IP9mXyG1YNXPzrkgg8p';
  const getStyleUrl = (styleName: string) =>
    `https://api.maptiler.com/maps/${styleName}/style.json?key=${maptilerKey}`;

  // Helper to add GeoJSON line layers
  const addRouteLayersToMap = useCallback((mapInstance: MapLibreMap, coords: [number, number][]) => {
    if (!mapInstance || !mapInstance.isStyleLoaded()) return;

    const validCoords = coords.filter(c => Array.isArray(c) && c.length >= 2 && !isNaN(c[0]) && !isNaN(c[1]));
    if (validCoords.length < 2) return;

    const geojsonData: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: validCoords,
      },
    };

    const existingSource = mapInstance.getSource('train-route') as GeoJSONSource | undefined;
    if (existingSource) {
      existingSource.setData(geojsonData);
      return;
    }

    try {
      mapInstance.addSource('train-route', {
        type: 'geojson',
        data: geojsonData,
        lineMetrics: true,
      });

      // 1. Neon glow underlayer (wide cyan glow)
      if (!mapInstance.getLayer('route-glow')) {
        mapInstance.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'train-route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#00e5ff',
            'line-width': 10,
            'line-opacity': 0.35,
            'line-blur': 3,
          },
        });
      }

      // 2. High-contrast dark casing
      if (!mapInstance.getLayer('route-casing')) {
        mapInstance.addLayer({
          id: 'route-casing',
          type: 'line',
          source: 'train-route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#0a0f1d',
            'line-width': 6,
            'line-opacity': 0.95,
          },
        });
      }

      // 3. Bright Cyan Core Railway Polyline
      if (!mapInstance.getLayer('route-line')) {
        mapInstance.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'train-route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#00f0ff',
            'line-width': 3.5,
            'line-opacity': 1,
          },
        });
      }

      // 4. White Railway Track Ties
      if (!mapInstance.getLayer('route-ties')) {
        mapInstance.addLayer({
          id: 'route-ties',
          type: 'line',
          source: 'train-route',
          layout: { 'line-join': 'round', 'line-cap': 'butt' },
          paint: {
            'line-color': '#ffffff',
            'line-width': 1.8,
            'line-dasharray': [2, 4],
            'line-opacity': 0.85,
          },
        });
      }
    } catch (err) {
      console.error('[JourneyMap] Error adding route layers:', err);
    }
  }, []);

  // ─── Initialize Map Instance ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;

    isMapRemovedRef.current = false;
    setIsMapLoaded(false);

    const coords = route.geometry?.coordinates ?? [];
    const bounds = getRouteBounds(coords);

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: getStyleUrl(mapStyleType),
      bounds: bounds,
      fitBoundsOptions: { padding: 60, maxZoom: 12 },
      attributionControl: false,
    });

    map.on('dragstart', () => {
      setIsFollowing(false);
      setShowRecenter(true);
    });

    map.on('load', () => {
      if (isMapRemovedRef.current) return;
      setIsMapLoaded(true);

      const currentCoords = route.geometry?.coordinates ?? [];
      addRouteLayersToMap(map, currentCoords);

      map.resize();
      if (currentCoords.length > 0) {
        map.fitBounds(getRouteBounds(currentCoords), { padding: 60, maxZoom: 12, duration: 0 });
      }
    });

    mapRef.current = map;

    // ResizeObserver ensures canvas always matches container size
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current && !isMapRemovedRef.current) {
        mapRef.current.resize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      isMapRemovedRef.current = true;
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      trainMarkerRef.current = null;
      setIsMapLoaded(false);
    };
  }, [route.id, mapStyleType]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Update GeoJSON Route when Route Data Changes ─────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded || isMapRemovedRef.current) return;

    const coords = route.geometry?.coordinates ?? [];
    addRouteLayersToMap(map, coords);
  }, [route.geometry, isMapLoaded, addRouteLayersToMap]);

  // ─── Station Markers ──────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || isMapRemovedRef.current) return;

    stationMarkersRef.current.forEach(m => m.remove());
    stationMarkersRef.current = [];

    route.stations.forEach((st) => {
      if (!st.latitude || !st.longitude || (st.latitude === 0 && st.longitude === 0)) return;

      const isCurrent =
        st.id === liveJourney.currentStation?.id ||
        st.code === liveJourney.currentStation?.code ||
        st.status === 'CURRENT';
      const isPassed = st.status === 'PASSED';

      const el = document.createElement('div');
      el.className = 'station-marker';
      el.style.cssText = 'cursor:pointer;';
      el.innerHTML = `
        <div style="
          width:${isCurrent ? '14px' : '10px'};
          height:${isCurrent ? '14px' : '10px'};
          border-radius:50%;
          background:${isCurrent ? '#00e5ff' : isPassed ? '#10b981' : '#94a3b8'};
          border:2px solid ${isCurrent ? '#ffffff' : '#0f172a'};
          box-shadow:${isCurrent ? '0 0 0 4px rgba(0,229,255,0.4), 0 2px 6px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.4)'};
          transition:transform 0.2s;
        "></div>
      `;

      const popup = new Popup({ offset: 12, closeButton: false }).setHTML(`
        <div style="padding:6px;font-family:system-ui,sans-serif;min-width:130px;background:#0f172a;color:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.5);">
          <div style="font-weight:700;font-size:12px;color:#00e5ff;">${st.name}</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:2px;">
            ${st.code ? `<span style="background:#1e293b;padding:1px 4px;border-radius:3px;font-family:monospace;">${st.code}</span>` : ''}
            ${st.scheduledDeparture ? `&nbsp;Dept: ${st.scheduledDeparture}` : st.scheduledArrival ? `&nbsp;Arr: ${st.scheduledArrival}` : ''}
          </div>
          <div style="font-size:10px;font-weight:600;margin-top:3px;color:${isPassed ? '#10b981' : isCurrent ? '#00e5ff' : '#94a3b8'};">
            ${isPassed ? '✓ Passed' : isCurrent ? '📍 Current Station' : '⏳ Upcoming Station'}
          </div>
        </div>
      `);

      const marker = new Marker({ element: el })
        .setLngLat([st.longitude, st.latitude])
        .setPopup(popup)
        .addTo(map);

      stationMarkersRef.current.push(marker);
    });
  }, [route.stations, liveJourney.currentStation?.id, isMapLoaded]);

  // ─── Live Train Location Marker ───────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !liveJourney.location || isMapRemovedRef.current) return;

    const { lng, lat } = liveJourney.location;

    if (!trainMarkerRef.current) {
      const el = document.createElement('div');
      el.style.cssText = 'cursor:pointer;position:relative;';
      el.innerHTML = `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;inset:-10px;background:rgba(0,229,255,0.3);border-radius:50%;animation:train-pulse 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="
            width:38px;height:38px;
            background:linear-gradient(135deg,#0284c7,#00e5ff);
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
            border:2.5px solid #ffffff;
            box-shadow:0 4px 14px rgba(0,0,0,0.6);
            position:relative;z-index:2;
          ">🚆</div>
        </div>
      `;

      if (!document.getElementById('train-marker-keyframes')) {
        const style = document.createElement('style');
        style.id = 'train-marker-keyframes';
        style.textContent = `@keyframes train-pulse{0%{transform:scale(0.95);opacity:0.8}70%{transform:scale(1.8);opacity:0}100%{transform:scale(1.8);opacity:0}}`;
        document.head.appendChild(style);
      }

      const popup = new Popup({ offset: 22, closeButton: false }).setHTML(`
        <div style="padding:8px;font-family:system-ui,sans-serif;background:#0f172a;color:#ffffff;border-radius:8px;min-width:160px;box-shadow:0 6px 16px rgba(0,0,0,0.6);">
          <div style="font-weight:700;font-size:13px;color:#00e5ff;">${liveJourney.train.name}</div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:3px;">
            ${liveJourney.currentStation ? `📍 Near ${liveJourney.currentStation.name}` : ''}
          </div>
          <div style="font-size:10px;color:#94a3b8;margin-top:3px;">
            ${liveJourney.distanceTravelledKm} km covered • ${liveJourney.completionPercent}% complete
          </div>
          <div style="font-size:10px;font-weight:600;margin-top:3px;color:${liveJourney.status.state === 'ON_TIME' ? '#10b981' : '#f59e0b'};">
            ● ${liveJourney.status.state === 'ON_TIME' ? 'On Time' : `Delayed by ${liveJourney.status.delayMinutes} min`}
          </div>
        </div>
      `);

      trainMarkerRef.current = new Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
    } else {
      trainMarkerRef.current.setLngLat([lng, lat]);
    }

    if (isFollowing && map) {
      map.easeTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 8), duration: 1200 });
    }
  }, [liveJourney.location, isFollowing]);

  // ─── POI / Feature Markers ────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || isMapRemovedRef.current) return;

    poiMarkersRef.current.forEach(m => m.remove());
    poiMarkersRef.current = [];

    const iconMap: Record<string, string> = { water: '💧', terrain: '⛰️', infrastructure: '🌉', place: '🏛️' };
    features.forEach((feat) => {
      if (!feat.latitude || !feat.longitude) return;
      const el = document.createElement('div');
      el.style.cssText = 'cursor:pointer;width:26px;height:26px;border-radius:50%;background:#1e293b;border:1px solid #475569;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.4);';
      el.textContent = iconMap[feat.type] || '📍';
      const marker = new Marker({ element: el }).setLngLat([feat.longitude, feat.latitude]).addTo(map);
      poiMarkersRef.current.push(marker);
    });
  }, [features]);

  const handleRecenter = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (liveJourney.location) {
      setIsFollowing(true);
      setShowRecenter(false);
      map.flyTo({ center: [liveJourney.location.lng, liveJourney.location.lat], zoom: 9, essential: true });
    } else if (route.geometry?.coordinates?.length) {
      map.fitBounds(getRouteBounds(route.geometry.coordinates), { padding: 60 });
    }
  }, [liveJourney.location, route.geometry]);

  const handleFitRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map || !route.geometry?.coordinates?.length) return;
    setIsFollowing(false);
    setShowRecenter(false);
    map.fitBounds(getRouteBounds(route.geometry.coordinates), { padding: 60, maxZoom: 12, duration: 1000 });
  }, [route.geometry]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* MapLibre container with explicit absolute positioning */}
      <div
        ref={mapContainerRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Top Controls: Fit Route + Map Style Selector */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <select
          value={mapStyleType}
          onChange={(e) => setMapStyleType(e.target.value as any)}
          aria-label="Map style selector"
          style={{
            background: 'rgba(15,23,42,0.92)',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            outline: 'none',
          }}
        >
          <option value="backdrop-dark">🌑 Dark Terrain (Backdrop)</option>
          <option value="streets-v2-dark">🌃 Dark Streets</option>
          <option value="outdoor-v2">🏔️ Topo Terrain (Outdoor)</option>
          <option value="streets-v2">🗺️ Crisp Streets</option>
        </select>

        <button
          onClick={handleFitRoute}
          title="Fit entire railway route"
          style={{
            background: 'rgba(15,23,42,0.92)',
            color: '#00e5ff',
            border: '1px solid rgba(0,229,255,0.3)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          <span>🗺️</span> Fit Route
        </button>
      </div>

      <FollowTrainButton visible={showRecenter} onClick={handleRecenter} />

      <MapControls
        className="absolute bottom-6 right-6"
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onResetBearing={() => mapRef.current?.resetNorthPitch()}
        onToggleFullscreen={() => {
          if (!mapContainerRef.current) return;
          if (!document.fullscreenElement) mapContainerRef.current.requestFullscreen().catch(() => {});
          else document.exitFullscreen().catch(() => {});
        }}
        onToggleFollow={() => {
          if (!isFollowing) handleRecenter();
          else setIsFollowing(false);
        }}
        isFollowing={isFollowing}
      />
    </div>
  );
}
