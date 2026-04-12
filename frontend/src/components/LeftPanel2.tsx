import { useQuery } from '@tanstack/react-query'
import { getStats } from '../utils/api'
import type { AppState } from '../App'

interface Props { state: AppState; update: (p: Partial<AppState>) => void }

export default function LeftPanel({ state, update }: Props) {
  const { data: stats } = useQuery({
    queryKey: ['stats', state.year, state.deltaTemp, state.deltaFreq],
    queryFn: () => getStats(state.year, state.deltaTemp, state.deltaFreq),
    refetchInterval: 10000,
  })

  const layers = [
    { key: 'm1', label: 'Estrés Térmico', desc: 'DHW Regresión', badge: 'M1' },
    { key: 'm2', label: 'Estado Arrecife', desc: 'Clasificación', badge: 'M2' },
    { key: 'm3', label: 'Perfil Riesgo',   desc: 'Clustering', badge: 'M3' },
  ] as const

  return (
    <div style={{
      width:220, background:'var(--navy-glass)', borderRight:'1px solid rgba(26,108,240,0.2)',
      display:'flex', flexDirection:'column', overflow:'auto', padding:'16px 12px',
      backdropFilter:'blur(20px)'
    }}>
      {/* Layers */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:16, letterSpacing:2,
          textTransform:'uppercase', color:'var(--royal)', marginBottom:10,
          borderBottom:'1px solid rgba(26,108,240,0.2)', paddingBottom:6 }}>
          // Capas
        </div>
        {layers.map(l => {
          const active = state.layers[l.key]
          return (
            <div key={l.key} onClick={() => update({ layers: { ...state.layers, [l.key]: !active } })}
              style={{
                display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
                borderRadius:6, marginBottom:4, cursor:'pointer',
                background: active ? 'rgba(26,108,240,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'var(--royal)' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <div style={{
                width:28, height:16, borderRadius:8, position:'relative',
                background: active ? 'var(--royal)' : 'rgba(255,255,255,0.1)', flexShrink:0,
                transition:'background 0.3s'
              }}>
                <div style={{
                  position:'absolute', top:2, borderRadius:'50%', width:12, height:12,
                  background: active ? '#fff' : 'rgba(255,255,255,0.4)',
                  left: active ? 14 : 2, transition:'left 0.3s',
                  boxShadow: active ? '0 0 6px rgba(255,255,255,0.5)' : 'none'
                }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{l.label}</div>
                <div style={{ fontSize:12.5, color:'var(--white-dim)', marginTop:1 }}>{l.desc}</div>
              </div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:12, padding:'2px 6px',
                borderRadius:3, background:'rgba(26,108,240,0.2)', color:'var(--royal)',
                border:'1px solid rgba(26,108,240,0.3)' }}>{l.badge}</div>
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:16, letterSpacing:2,
          textTransform:'uppercase', color:'var(--royal)', marginBottom:10,
          borderBottom:'1px solid rgba(26,108,240,0.2)', paddingBottom:6 }}>
          // Estado Global
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
          {[
            { label:'CRÍTICOS',   val: stats?.critical,  cls:'critical' },
            { label:'BLANQUEADOS',val: stats?.bleached,  cls:'warning' },
            { label:'EN RIESGO',  val: stats?.risk,      cls:'warning' },
            { label:'SANOS',      val: stats?.healthy,   cls:'ok' },
          ].map(s => (
            <div key={s.label} style={{
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:6, padding:8, textAlign:'center'
            }}>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize:20, fontWeight:'bold',
                color: s.cls === 'critical' ? 'var(--salmon)' : s.cls === 'ok' ? 'var(--healthy)' : 'var(--bleached)'
              }}>{s.val ?? '—'}</div>
              <div style={{ fontSize:13, color:'var(--white-dim)', marginTop:3, letterSpacing:.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:10, padding:'8px 10px', background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.07)', borderRadius:6 }}>
          <div style={{ fontSize:15, color:'var(--white-dim)', marginBottom:4 }}>DHW GLOBAL PROM.</div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:18, color:'var(--teal)',
            fontWeight:'bold' }}>{stats?.avg_dhw?.toFixed(1) ?? '—'}</div>
          <div style={{ marginTop:4, height:4, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:2,
              width: `${Math.min(((stats?.avg_dhw ?? 0) / 10) * 100, 100)}%`,
              background:'linear-gradient(90deg,var(--royal),var(--salmon))',
              transition:'width 0.8s'
            }} />
          </div>
        </div>
      </div>

      {/* Simulation */}
      {state.mode === 'simulation' && (
        <div style={{ background:'rgba(255,95,109,0.05)', border:'1px solid rgba(255,95,109,0.2)',
          borderRadius:8, padding:12 }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:16, letterSpacing:2,
            textTransform:'uppercase', color:'var(--salmon)', marginBottom:12 }}>
            // Simulación
          </div>
          {[
            { label:'Δ Temperatura', key:'deltaTemp' as const, unit:'°C', step:0.5, min:-2, max:4 },
            { label:'Δ Frecuencia',  key:'deltaFreq' as const, unit:'%',  step:10,  min:-40, max:100 },
          ].map(ctrl => (
            <div key={ctrl.key} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <span style={{ fontSize:15, color:'var(--white-dim)' }}>{ctrl.label}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--salmon)' }}>
                  {(state[ctrl.key] >= 0 ? '+' : '')}{state[ctrl.key]}{ctrl.unit}
                </span>
              </div>
              <div style={{ display:'flex', gap:4 }}>
                {[-1,1].map(dir => (
                  <button key={dir} onClick={() => {
                    const next = Math.max(ctrl.min, Math.min(ctrl.max,
                      state[ctrl.key] + dir * ctrl.step))
                    update({ [ctrl.key]: Math.round(next * 10) / 10 } as any)
                  }} style={{
                    flex:1, padding:'4px 0', borderRadius:4, cursor:'pointer',
                    border:'1px solid rgba(255,95,109,0.3)', background:'rgba(255,95,109,0.1)',
                    color:'var(--salmon)', fontSize:14
                  }}>{dir > 0 ? '+' : '−'}</button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => {
  if (state.simActive) {
    update({ simActive: false, deltaTemp: 0, deltaFreq: 0 })
            } else {
              update({ simActive: true })
            }
          }} style={{
            width: '100%', padding: 9, borderRadius: 6, border: '1px solid var(--salmon)',
            background: state.simActive ? 'var(--salmon-bright)' : 'rgba(255,95,109,0.15)',
            color: state.simActive ? '#fff' : 'var(--salmon)',
            fontFamily: 'var(--font-head)', fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700
          }}>
            {state.simActive ? '■ Reiniciar' : '▶ Ejecutar'}
          </button>
        </div>
      )}
    </div>
  )
}