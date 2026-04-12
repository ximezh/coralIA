import type { AppState } from '../App'

interface Props { state: AppState; update: (p: Partial<AppState>) => void }

export default function TopBar({ state, update }: Props) {
  return (
    <div style={{
      height:64, background:'linear-gradient(90deg,#030d1a,#071428,#030d1a)',
      borderBottom:'1px solid rgba(26,108,240,0.3)',
      display:'flex', alignItems:'center', gap:24, padding:'0 20px',
      boxShadow:'0 2px 40px rgba(0,0,0,0.6)'
    }}>
      <div>
        <div style={{ fontFamily:'var(--font-head)', fontSize:30, fontWeight:900,
          letterSpacing:4, background:'linear-gradient(90deg,var(--teal),var(--royal),var(--salmon))',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>CoralIA</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:2, color:'var(--white-dim)' }}>
          PLATAFORMA GLOBAL DE INTELIGENCIA CORALINA
        </div>
      </div>

      <div style={{ width:1, height:36, background:'rgba(26,108,240,0.3)' }} />

      {/* Mode selector */}
      <div style={{ display:'flex', gap:2, background:'rgba(255,255,255,0.05)', borderRadius:6, padding:3 }}>
        {(['historical','simulation'] as const).map(m => (
          <button key={m} onClick={() => update({ mode: m })} style={{
            padding:'5px 14px', border:'none', borderRadius:4, cursor:'pointer',
            fontFamily:'var(--font-body)', fontSize:13, fontWeight:600, letterSpacing:1,
            textTransform:'uppercase',
            background: state.mode === m ? 'var(--royal)' : 'transparent',
            color: state.mode === m ? '#fff' : 'var(--white-dim)',
            boxShadow: state.mode === m ? '0 0 12px var(--royal-glow)' : 'none'
          }}>
            {m === 'historical' ? 'Histórico' : 'Simulación'}
          </button>
        ))}
      </div>

      {/* Year slider */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:16, color:'var(--white-dim)' }}>AÑO</span>
        <span style={{ fontFamily:'var(--font-head)', fontSize:26, fontWeight:700,
          color:'var(--teal)', minWidth:54, textAlign:'center' }}>{state.year}</span>
        <input type="range" min={1980} max={state.mode === 'simulation' ? 2035 : 2025}
          value={state.year} onChange={e => update({ year: parseInt(e.target.value) })}
          style={{ width:160 }} />
      </div>

      <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
        <button onClick={() => update({ showPredict: true })} style={{
          padding:'7px 16px', borderRadius:6, border:'1px solid var(--teal)',
          background:'rgba(0,201,212,0.1)', color:'var(--teal)',
          fontFamily:'var(--font-body)', fontWeight:700, fontSize:18,
          letterSpacing:1, textTransform:'uppercase', cursor:'pointer'
        }}>⚡ Predictor IA</button>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        input[type=range]{-webkit-appearance:none;height:4px;
          background:linear-gradient(90deg,var(--royal),var(--salmon));border-radius:2px;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;
          border-radius:50%;background:var(--teal);cursor:pointer;box-shadow:0 0 8px var(--teal-glow);}
      `}</style>
    </div>
  )
}