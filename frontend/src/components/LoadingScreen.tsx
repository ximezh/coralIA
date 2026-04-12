import { useEffect, useState } from 'react'

const MSGS = [
  'INICIALIZANDO SEÑALES SATELITALES...',
  'CARGANDO MODELOS DE IA...',
  'CALIBRANDO SENSORES TÉRMICOS...',
  'CONECTANDO A MAPAS OSM...',
]

export default function LoadingScreen() {
  const [done, setDone] = useState(false)
  const [msg, setMsg] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setMsg(m => (m + 1) % MSGS.length), 600)
    const t = setTimeout(() => { setDone(true); clearInterval(iv) }, 2400)
    return () => { clearInterval(iv); clearTimeout(t) }
  }, [])

  if (done) return null

  return (
    <div style={{
      position:'fixed', inset:0, background:'var(--navy)', zIndex:9000,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16
    }}>
      <div style={{ fontFamily:'var(--font-head)', fontSize:70, fontWeight:900,
        letterSpacing:8, color:'var(--teal)', textShadow:'0 0 30px var(--teal-glow)' }}>
        CoralIA
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--royal)',
        letterSpacing:3, marginTop:-8 }}>
        PLATAFORMA GLOBAL DE INTELIGENCIA CORALINA
      </div>
      <div style={{ width:300, height:3, background:'rgba(255,255,255,0.1)', borderRadius:2, overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:2,
          background:'linear-gradient(90deg, var(--royal), var(--teal))',
          animation:'load-fill 2.2s cubic-bezier(0.4,0,0.2,1) forwards'
        }} />
      </div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--white-dim)', letterSpacing:2 }}>
        {MSGS[msg]}
      </div>
      <style>{`@keyframes load-fill { from{width:0} to{width:100%} }`}</style>
    </div>
  )
}