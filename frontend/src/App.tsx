import { useState, useCallback } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'

export interface AppState {
  year: number
  mode: 'historical' | 'simulation'
  deltaTemp: number
  deltaFreq: number
  simActive: boolean
  selectedReefId: number | null
  layers: { m1: boolean; m2: boolean; m3: boolean }
  showPredict: boolean
  view: 'dashboard' | 'analytics'
}

export default function App() {
  const [state, setState] = useState<AppState>({
    year: 2020,
    mode: 'historical',
    deltaTemp: 0,
    deltaFreq: 0,
    simActive: false,
    selectedReefId: null,
    layers: { m1: true, m2: true, m3: true },
    showPredict: false,
    view: 'dashboard',
  })

  const update = useCallback(
    (patch: Partial<AppState>) => setState(s => ({ ...s, ...patch })),
    []
  )

  return (
    <>
      <LoadingScreen />

      {/* View switcher tab */}
      <div style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10000, display: 'flex', gap: 4,
        background: 'rgba(7,20,40,0.95)', border: '1px solid rgba(26,108,240,0.3)',
        borderRadius: 8, padding: 4, backdropFilter: 'blur(20px)',
      }}>
        {(['dashboard', 'analytics'] as const).map(v => (
          <button key={v} onClick={() => update({ view: v })} style={{
            padding: '5px 18px', border: 'none', borderRadius: 5, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: 1.5,
            textTransform: 'uppercase',
            background: state.view === v ? 'var(--royal)' : 'transparent',
            color: state.view === v ? '#fff' : 'var(--white-dim)',
            boxShadow: state.view === v ? '0 0 10px var(--royal-glow)' : 'none',
          }}>
            {v === 'dashboard' ? '🗺 Mapa' : '📊 Análisis'}
          </button>
        ))}
      </div>

      {state.view === 'dashboard'
        ? <Dashboard state={state} update={update} />
        : <Analytics />
      }
    </>
  )
}
