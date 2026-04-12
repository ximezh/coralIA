import { useState } from 'react'
import { predictDHW, predictStatus, predictCluster, getScenarios } from '../utils/api'
import { useQuery } from '@tanstack/react-query'
import { dhwToColor, STATUS_COLORS, CLUSTER_COLORS } from '../utils/colors'

const DEFAULTS = {
  Temperature_Maximum: 31.95, Temperature_Mean: 27.63, Temperature_Minimum: 23.7,
  ClimSST: 27.645, SSTA: 0.27, SSTA_DHW: 2.0, SSTA_Frequency: 6.0,
  TSA: -0.71, TSA_DHW: 0.0, Windspeed: 5.0, Depth_m: 6.0, Ocean_Code: 3.0,
}

export default function PredictModal({ onClose }: { onClose: () => void }) {
  const [inputs, setInputs] = useState<Record<string, number>>(DEFAULTS)
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { data: scenariosData } = useQuery({ queryKey: ['scenarios'], queryFn: getScenarios })

  const fields = [
    ['Temperature_Maximum', 'Temp. Máx (°C)'], ['Temperature_Mean', 'Temp. Media (°C)'],
    ['Temperature_Minimum', 'Temp. Mín (°C)'], ['ClimSST', 'SST Climática (°C)'],
    ['SSTA', 'Anomalía SST'], ['SSTA_DHW', 'DHW Anomalía'],
    ['SSTA_Frequency', 'Frecuencia SSTA'], ['TSA', 'Anomalía TSA'],
    ['TSA_DHW', 'DHW TSA'], ['Windspeed', 'Viento (m/s)'],
    ['Depth_m', 'Profundidad (m)'],
  ]

  async function runAll() {
    setLoading(true)
    try {
      const [dhw, status, cluster] = await Promise.all([
        predictDHW(inputs), predictStatus(inputs), predictCluster(inputs)
      ])
      setResults({ dhw, status, cluster })
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  function applyScenario(s: any) {
    setInputs(prev => ({ ...prev, ...s }))
    setResults(null)
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(3,13,26,0.85)', zIndex:2000,
      display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)' }}>
      <div style={{
        background:'linear-gradient(135deg,#071428,#0d1f3c)',
        border:'1px solid rgba(26,108,240,0.4)', borderRadius:14, padding:28,
        width:700, maxWidth:'95vw', maxHeight:'90vh', overflow:'auto',
        boxShadow:'0 30px 80px rgba(0,0,0,0.8)'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:18, fontWeight:700,
              letterSpacing:2, color:'var(--white)' }}>⚡ Predictor IA</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--white-dim)', marginTop:4 }}>
              M1 Regresión · M2 Clasificación · M3 Clustering
            </div>
          </div>
          <button onClick={onClose} style={{
            width:30, height:30, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)',
            background:'rgba(255,255,255,0.05)', cursor:'pointer', color:'var(--white-dim)',
            fontSize:16, display:'flex', alignItems:'center', justifyContent:'center'
          }}>✕</button>
        </div>

        {/* Scenarios */}
        {scenariosData && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:14, color:'var(--royal)',
              letterSpacing:1.5, marginBottom:8 }}>// ESCENARIOS PREDEFINIDOS</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {scenariosData.scenarios.map((s: any) => (
                <button key={s.name} onClick={() => applyScenario(s)} style={{
                  padding:'5px 12px', borderRadius:6, border:'1px solid rgba(26,108,240,0.4)',
                  background:'rgba(26,108,240,0.1)', color:'var(--teal)',
                  fontFamily:'var(--font-mono)', fontSize:14, cursor:'pointer', letterSpacing:.5
                }}>{s.name}</button>
              ))}
            </div>
          </div>
        )}

        {/* Inputs */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
          {fields.map(([key, label]) => (
            <div key={key}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--white-dim)',
                marginBottom:4, letterSpacing:.5 }}>{label}</div>
              <input type="number" step="0.1" value={inputs[key]}
                onChange={e => setInputs(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                style={{
                  width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(26,108,240,0.3)',
                  borderRadius:6, padding:'6px 10px', color:'var(--white)',
                  fontFamily:'var(--font-mono)', fontSize:14, outline:'none'
                }} />
            </div>
          ))}
        </div>

        <button onClick={runAll} disabled={loading} style={{
          width:'100%', padding:12, borderRadius:8, border:'none',
          background: loading ? 'rgba(26,108,240,0.3)' : 'var(--royal)',
          color:'#fff', fontFamily:'var(--font-head)', fontSize:13, letterSpacing:2,
          fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 0 20px var(--royal-glow)'
        }}>
          {loading ? '⏳ PROCESANDO...' : '▶ EJECUTAR PREDICCIÓN'}
        </button>

        {/* Results */}
        {results && (
          <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {/* M1 DHW */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(26,108,240,0.2)',
              borderRadius:10, padding:16 }}>
              <div style={{ fontFamily:'var(--font-head)', fontSize:11, color:'var(--teal)',
                marginBottom:10, letterSpacing:1 }}>M1 — DHW</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:28, fontWeight:'bold',
                color: dhwToColor(results.dhw.dhw) }}>{results.dhw.dhw.toFixed(2)}</div>
              <div style={{ fontSize:14, color:'var(--white-dim)', marginTop:4 }}>°C·semanas</div>
              <div style={{ marginTop:8, fontSize:18, color: dhwToColor(results.dhw.dhw),
                fontWeight:600 }}>{results.dhw.nivel}</div>
            </div>

            {/* M2 Status */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(26,108,240,0.2)',
              borderRadius:10, padding:16 }}>
              <div style={{ fontFamily:'var(--font-head)', fontSize:12, color:'var(--teal)',
                marginBottom:10, letterSpacing:1 }}>M2 — ESTADO</div>
              <div style={{ fontSize:18, fontWeight:700,
                color: STATUS_COLORS[results.status.estado as keyof typeof STATUS_COLORS] || '#fff' }}>
                {results.status.estado}
              </div>
              <div style={{ marginTop:8 }}>
                {Object.entries(results.status.confianza as Record<string,number>).map(([cls, p]) => (
                  <div key={cls} style={{ marginBottom:4 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13,
                      color:'var(--white-dim)', marginBottom:2 }}>
                      <span>{cls}</span><span>{(p*100).toFixed(1)}%</span>
                    </div>
                    <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
                      <div style={{ height:'100%', width:`${p*100}%`, borderRadius:2,
                        background: STATUS_COLORS[cls as keyof typeof STATUS_COLORS] || '#fff' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* M3 Cluster */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(26,108,240,0.2)',
              borderRadius:10, padding:16 }}>
              <div style={{ fontFamily:'var(--font-head)', fontSize:11, color:'var(--teal)',
                marginBottom:10, letterSpacing:1 }}>M3 — CLUSTER</div>
              <div style={{ fontSize:32, fontWeight:900,
                color: CLUSTER_COLORS[results.cluster.cluster] }}>{results.cluster.cluster}</div>
              <div style={{ fontSize:14, color:'var(--white-dim)', marginTop:4, lineHeight:1.4 }}>
                {results.cluster.nombre}
              </div>
              {results.cluster.perfil && (
                <div style={{ marginTop:8, fontSize:12, color:'var(--white-dim)' }}>
                  {results.cluster.perfil.n_sitios?.toLocaleString()} sitios similares ({results.cluster.perfil.pct}% global)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}