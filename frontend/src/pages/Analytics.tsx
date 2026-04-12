// pages/Analytics.tsx
// Página secundaria: métricas de modelos + perfiles de clusters.
// Se puede activar desde el TopBar con react-router si se desea.

import { useQuery } from '@tanstack/react-query'
import { getMetrics, getClusterProfiles } from '../utils/api'
import { CLUSTER_COLORS } from '../utils/colors'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts'

export default function Analytics() {
  const { data: metricsData } = useQuery({ queryKey: ['metrics'], queryFn: getMetrics })
  const { data: clustersData } = useQuery({ queryKey: ['clusterProfiles'], queryFn: getClusterProfiles })

  const metrics = metricsData?.metrics ?? []
  const profiles = clustersData?.profiles ?? []
  const nombres = clustersData?.nombres ?? {}

  return (
    <div style={{
      padding: 32, overflowY: 'auto', height: '100vh',
      background: 'var(--navy)', color: 'var(--white)',
    }}>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 900,
        letterSpacing: 4, color: 'var(--teal)', marginBottom: 8 }}>
        ANÁLISIS
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--white-dim)',
        marginBottom: 32 }}>
        Resumen de métricas · Perfiles de clusters
      </div>

      {/* Model metrics */}
      <Section title="// Métricas de Modelos">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {metrics.map((m: any) => (
            <div key={m.Modelo} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(26,108,240,0.25)',
              borderRadius: 10, padding: 20,
            }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, color: 'var(--teal)',
                marginBottom: 6, letterSpacing: 1 }}>{m.Modelo}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--white-dim)',
                marginBottom: 12 }}>{m.Algoritmo}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 'bold',
                color: 'var(--royal)' }}>{Number(m.Valor).toFixed(3)}</div>
              <div style={{ fontSize: 16, color: 'var(--white-dim)', marginTop: 4 }}>{m.Metrica}</div>
              <div style={{ marginTop: 10, fontSize: 16, color: 'rgba(232,244,255,0.4)',
                fontFamily: 'var(--font-mono)' }}>{m.Extra}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Cluster profiles */}
      <Section title="// Perfiles de Clusters">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {profiles.map((p: any) => {
            const col = CLUSTER_COLORS[p.rank] ?? '#aaa'
            const nombre = nombres[String(p.rank)] ?? `Cluster ${p.rank}`
            return (
              <div key={p.rank} style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${col}44`,
                borderLeft: `4px solid ${col}`,
                borderRadius: 8, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 20,
              }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 900,
                  color: col, minWidth: 32 }}>{p.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 19, color: col }}>{nombre}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16,
                    color: 'var(--white-dim)', marginTop: 4 }}>
                    {p.n_sitios?.toLocaleString()} sitios · {p.pct}% global
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px 16px' }}>
                  {[
                    ['DHW prom.', Number(p.DHW_prom).toFixed(2)],
                    ['SSTA_Frec.', Number(p.SSTA_Frequency).toFixed(1)],
                    ['Temp. Máx', `${Number(p.Temperature_Maximum).toFixed(1)}°C`],
                    ['SSTA', Number(p.SSTA).toFixed(2)],
                    ['TSA_DHW', Number(p.TSA_DHW).toFixed(2)],
                    ['Profundidad', `${Number(p.Depth_m).toFixed(1)}m`],
                  ].map(([lbl, val]) => (
                    <div key={lbl} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16,
                        fontWeight: 'bold', color: 'var(--white)' }}>{val}</div>
                      <div style={{ fontSize: 12, color: 'var(--white-dim)',
                        letterSpacing: .5 }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--royal)',
        letterSpacing: 2, marginBottom: 16, borderBottom: '1px solid rgba(26,108,240,0.2)',
        paddingBottom: 8 }}>{title}</div>
      {children}
    </div>
  )
}
