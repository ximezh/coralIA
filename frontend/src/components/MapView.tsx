import { useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { getReefs, type Reef } from '../utils/api'
import { dhwToColor, STATUS_COLORS, CLUSTER_COLORS } from '../utils/colors'
import type { AppState } from '../App'

import reef0  from '../assets/reefs/reef_0.jpg'
import reef1  from '../assets/reefs/reef_1.jpg'
import reef2  from '../assets/reefs/reef_2.jpg'
import reef3  from '../assets/reefs/reef_3.jpg'
import reef4  from '../assets/reefs/reef_4.jpg'
import reef5  from '../assets/reefs/reef_5.jpg'
import reef6  from '../assets/reefs/reef_6.jpg'
import reef7  from '../assets/reefs/reef_7.jpg'
import reef8  from '../assets/reefs/reef_8.jpg'
import reef9  from '../assets/reefs/reef_9.jpg'
import reef10 from '../assets/reefs/reef_10.jpg'
import reef11 from '../assets/reefs/reef_11.jpg'
import reef12 from '../assets/reefs/reef_12.jpg'
import reef13 from '../assets/reefs/reef_13.jpg'
import reef14 from '../assets/reefs/reef_14.jpg'
import reef15 from '../assets/reefs/reef_15.jpg'
import reef16 from '../assets/reefs/reef_16.jpg'
import reef17 from '../assets/reefs/reef_17.jpg'
import reef18 from '../assets/reefs/reef_18.jpg'
import reef19 from '../assets/reefs/reef_19.jpg'

const REEF_IMAGES: Record<number, string> = {
  0: reef0,  1: reef1,  2: reef2,  3: reef3,  4: reef4,
  5: reef5,  6: reef6,  7: reef7,  8: reef8,  9: reef9,
  10: reef10, 11: reef11, 12: reef12, 13: reef13, 14: reef14,
  15: reef15, 16: reef16, 17: reef17, 18: reef18, 19: reef19,
}

interface Props { state: AppState; update: (p: Partial<AppState>) => void }

function ReefMarkers({ reefs, state, update }: {
  reefs: Reef[]
  state: AppState
  update: (p: Partial<AppState>) => void
}) {
  const updateRef = useRef(update)
  useEffect(() => { updateRef.current = update }, [update])

  return (
    <>
      {reefs.map(reef => {
        const dhw = reef.dhw_computed
        const isSelected = state.selectedReefId === reef.id
        const isCritical = reef.status_computed === 'critical' || reef.status_computed === 'bleached'
        const color = state.layers.m2 ? dhwToColor(dhw) : '#00c9d4'
        const radius = isSelected ? 13 : 8
        const clusterColor = CLUSTER_COLORS[Math.min(reef.cluster, 4)]
        const statusColor = STATUS_COLORS[reef.status_computed as keyof typeof STATUS_COLORS] || '#fff'
        const imgUrl = REEF_IMAGES[reef.id] ?? REEF_IMAGES[0]

        return (
          <div key={reef.id}>
            {/* M1: heatmap glow */}
            {state.layers.m1 && dhw > 1 && (
              <CircleMarker
                center={[reef.lat, reef.lon]}
                radius={22 + dhw * 2.5}
                interactive={false}
                pathOptions={{ color: 'transparent', fillColor: dhwToColor(dhw, 0.18), fillOpacity: 1 }}
              />
            )}

            {/* M3: cluster ring */}
            {state.layers.m3 && (
              <CircleMarker
                center={[reef.lat, reef.lon]}
                interactive={false}
                radius={radius + 8}
                pathOptions={{
                  color: clusterColor, fillColor: 'transparent', fillOpacity: 0,
                  weight: 1.8, dashArray: '4 3', opacity: 0.75,
                }}
              />
            )}

            {/* Pulso para críticos/blanqueados */}
            {isCritical && (
              <CircleMarker
                center={[reef.lat, reef.lon]}
                interactive={false}
                radius={radius + 14}
                pathOptions={{
                  color: reef.status_computed === 'critical' ? '#ff3f52' : '#ff8c42',
                  fillColor: 'transparent', fillOpacity: 0,
                  weight: 1.5, opacity: 0.5, className: 'pulse-ring',
                }}
              />
            )}

            {/* Punto principal */}
            <CircleMarker
              center={[reef.lat, reef.lon]}
              radius={radius}
              pathOptions={{
                color: isSelected ? '#00c9d4' : color,
                fillColor: color, fillOpacity: 0.95,
                weight: isSelected ? 3 : 1.2,
              }}
              eventHandlers={{ click: () => updateRef.current({ selectedReefId: reef.id }) }}
            >
              <Popup maxWidth={360} minWidth={300}>
                <div style={{ background: '#071428', color: '#e8f4ff', borderRadius: 8, overflow: 'hidden', margin: -14 }}>
                  {/* Foto */}
                  <div style={{ position: 'relative', height: 130, overflow: 'hidden', background: '#030d1a' }}>
                    <img src={imgUrl} alt={reef.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #071428 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 8, left: 12, fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: '#e8f4ff', letterSpacing: 1 }}>{reef.name}</div>
                    <div style={{ position: 'absolute', top: 8, right: 8, padding: '3px 10px', borderRadius: 12, background: `${statusColor}cc`, border: `1px solid ${statusColor}`, color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>{reef.status_computed?.toUpperCase()}</div>
                  </div>
                  {/* Stats */}
                  <div style={{ padding: '10px 14px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'rgba(232,244,255,0.5)', marginBottom: 8 }}>{reef.country}</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <Stat label="DHW" val={dhw.toFixed(1)} color={dhwToColor(dhw)} />
                      <Stat label="SST Anomalía" val={`+${reef.sst}°C`} color="#00c9d4" />
                      <Stat label="Recuperación" val={`${reef.recovery}%`} color="#e8f4ff" />
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          </div>
        )
      })}
    </>
  )
}

function Stat({ label, val, color }: { label: string; val: string; color: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 'bold', color }}>{val}</div>
      <div style={{ fontSize: 12, color: 'rgba(232,244,255,0.5)' }}>{label}</div>
    </div>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ padding: '4px 12px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: 1, border: `1px solid ${color}`, background: `${color}22`, color }}>{label}</div>
  )
}

export default function MapView({ state, update }: Props) {
  const { data } = useQuery({
    queryKey: ['reefs', state.year, state.deltaTemp, state.deltaFreq],
    queryFn: () => getReefs(state.year, state.deltaTemp, state.deltaFreq),
    refetchInterval: 15000,
  })
  const reefs = data?.reefs ?? []

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes pulse-critical { 0%,100%{opacity:0.7} 50%{opacity:0.05} }
        .pulse-ring { animation: pulse-critical 1.2s ease-in-out infinite; }
        .leaflet-popup-content-wrapper { background:transparent !important; border:1px solid rgba(26,108,240,0.4) !important; border-radius:10px !important; box-shadow:0 8px 40px rgba(0,0,0,0.8) !important; padding:0 !important; }
        .leaflet-popup-content { margin:0 !important; }
        .leaflet-popup-tip { background:#071428 !important; }
        .leaflet-popup-close-button { color:rgba(232,244,255,0.6) !important; font-size:18px !important; top:6px !important; right:8px !important; z-index:10; }
      `}</style>

      <MapContainer center={[10, 20]} zoom={2} minZoom={2} maxZoom={10}
        style={{ width: '100%', height: '100%', background: '#030d1a' }}
        zoomControl={false} attributionControl={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          opacity={0.6} />
        {reefs.length > 0 && <ReefMarkers reefs={reefs} state={state} update={update} />}
      </MapContainer>

      {/* Año watermark */}
      <div style={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-head)', fontSize: 44, fontWeight: 900, color: 'rgba(255,255,255,0.04)', letterSpacing: 8, pointerEvents: 'none', zIndex: 999, userSelect: 'none' }}>{state.year}</div>

      {/* Layer badges */}
      <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 999, display: 'flex', gap: 6, pointerEvents: 'none' }}>
        {state.layers.m1 && <Badge label="M1 DHW" color="#1a6cf0" />}
        {state.layers.m2 && <Badge label="M2 Estado" color="#00c9d4" />}
        {state.layers.m3 && <Badge label="M3 Cluster" color="#f7c948" />}
      </div>

      {/* Leyenda */}
      <div style={{ position: 'absolute', bottom: 30, right: 14, zIndex: 999, background: 'rgba(7,20,40,0.92)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', backdropFilter: 'blur(20px)', pointerEvents: 'none' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 1.5, color: 'rgba(232,244,255,0.6)', marginBottom: 8, textTransform: 'uppercase' }}>Estrés Térmico (DHW)</div>
        <div style={{ width: 130, height: 8, borderRadius: 4, marginBottom: 5, background: 'linear-gradient(90deg,#1a6cf0,#00c9d4,#f7c948,#ff8c42,#ff3f52)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(232,244,255,0.6)' }}>
          <span>0</span><span>4</span><span>8</span><span>12+</span>
        </div>
      </div>
    </div>
  )
}
