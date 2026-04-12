import { useQuery } from '@tanstack/react-query'
import { getReef } from '../utils/api'
import { STATUS_COLORS, STATUS_LABELS, dhwToColor } from '../utils/colors'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
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

const INSIGHTS_ES: Record<number, string> = {
  0:  'Eventos repetidos de blanqueamiento severo desde 1998 han degradado el 50% de la cobertura coralina en aguas poco profundas. El estrés térmico se acelera.',
  1:  'Sistema arrecifal diverso bajo presión creciente por el aumento de la TSM. Los eventos de blanqueamiento localizado se vuelven ocurrencias anuales.',
  2:  'Las temperaturas superficiales récord en 2023 desencadenaron blanqueamiento masivo. La recuperación depende en gran medida de la reducción de nutrientes.',
  3:  'Tendencia progresiva de estrés térmico detectada. La cobertura coralina actual es del 63% de la línea base de 1990. Se aumentó la frecuencia de monitoreo.',
  4:  'Especies sorprendentemente resilientes adaptadas a temperaturas naturalmente variables. Se observa cierta tolerancia al calentamiento en Acropora dominante.',
  5:  'Sistema arrecifal protegido remoto con estrés moderado. La ausencia de factores estresantes locales permite ciclos de recuperación más rápidos.',
  6:  'Zona marina protegida con acceso humano restringido. La biomasa coralina es estable y la diversidad de especies se mantiene alta.',
  7:  'Los sólidos programas de conservación comunitaria han producido recuperación coralina medible. La variabilidad de TSM permanece dentro de los umbrales de tolerancia.',
  8:  'Las olas de calor marinas en el Mar Arábigo se intensifican y correlacionan con mayor frecuencia de blanqueamiento. La trayectoria climática es preocupante.',
  9:  'Doble presión del estrés térmico y la pesca ilegal debilita la resiliencia del arrecife. La capacidad adaptativa está en declive.',
  10: 'El segundo sistema de arrecife de barrera más grande muestra una función ecológica razonable. El blanqueamiento localizado está contenido por áreas protegidas.',
  11: 'Las anomalías térmicas se intensifican en la frontera del Océano Índico. Las porciones sur muestran signos tempranos de síndrome de estrés recurrente.',
  12: 'La reserva marina estrictamente protegida limita los factores estresantes locales. La alta diversidad coralina proporciona un amortiguador de resiliencia natural.',
  13: 'Los eventos de blanqueamiento masivo se correlacionan con fases positivas del IOD. Las presiones del turismo agravan la respuesta al estrés climático.',
  14: 'El sistema arrecifal más austral demuestra adaptación a aguas más frías. Acumulación de DHW relativamente baja en la última década.',
  15: 'Estrés térmico existencial combinado con amenaza de subida del nivel del mar a escala nacional. Los eventos de 2016 y 2020 causaron mortalidad masiva de colonias.',
  16: 'La recuperación post-1998 fue interrumpida por eventos posteriores. La integridad del armazón coralino está comprometida en múltiples sitios.',
  17: 'Sitio del Patrimonio Mundial de la UNESCO que enfrenta mayor presión térmica. Las probabilidades de blanqueamiento aumentan con cada ciclo de El Niño.',
  18: 'Sistema del Pacífico remoto con relativamente baja presión humana directa. Las tendencias de TSM requieren monitoreo continuo.',
  19: 'Sistema moderadamente estresado con signos de cambio de fase hacia dominancia algal en sectores degradados. Se recomienda intervención de gestión.',
}

export default function RightPanel({ state, update }: Props) {
  const { data: reef } = useQuery({
    queryKey: ['reef', state.selectedReefId, state.year, state.deltaTemp, state.deltaFreq],
    queryFn: () => state.selectedReefId !== null
      ? getReef(state.selectedReefId, state.year, state.deltaTemp, state.deltaFreq)
      : null,
    enabled: state.selectedReefId !== null,
  })

  return (
    <div style={{
      width: 300, background: 'var(--navy-glass)',
      borderLeft: '1px solid rgba(26,108,240,0.2)',
      display: 'flex', flexDirection: 'column', overflow: 'auto',
      backdropFilter: 'blur(20px)',
    }}>
      {!reef ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', flex: 1, textAlign: 'center', gap: 12, padding: 20 }}>
          <div style={{ fontSize: 48, opacity: .25 }}>🪸</div>
          <div style={{ fontSize: 15, color: 'var(--white-dim)', lineHeight: 1.6 }}>
            Selecciona un arrecife en el mapa para ver su análisis detallado
          </div>
        </div>
      ) : (
        <>
          {/* Foto */}
          <div style={{ position: 'relative', height: 170, overflow: 'hidden', background: '#030d1a', flexShrink: 0 }}>
            <img
              src={REEF_IMAGES[reef.id]}
              alt={reef.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #071428 0%, transparent 55%)' }} />
            {(() => {
              const st = reef.status_computed as keyof typeof STATUS_COLORS
              const col = STATUS_COLORS[st] || '#fff'
              return (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  padding: '4px 12px', borderRadius: 14,
                  background: `${col}cc`, border: `1px solid ${col}`,
                  color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700,
                  fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                }}>● {STATUS_LABELS[st] || st}</div>
              )
            })()}
          </div>

          {/* Contenido */}
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700,
                color: 'var(--white)', letterSpacing: 1, lineHeight: 1.2 }}>{reef.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--white-dim)', marginTop: 4 }}>
                {reef.lat.toFixed(2)}°, {reef.lon.toFixed(2)}° · {reef.country}
              </div>
            </div>

            {[
              { label: 'DHW Actual',     val: `${reef.dhw_computed.toFixed(1)} °C·sem`, color: dhwToColor(reef.dhw_computed) },
              { label: 'SST Anomalía',   val: `+${reef.sst}°C`,   color: 'var(--teal)' },
              { label: 'Eventos Blanqueamiento', val: String(reef.events), color: 'var(--white)' },
              { label: 'Recuperación',   val: `${reef.recovery}%`,
                color: reef.recovery > 60 ? 'var(--healthy)' : reef.recovery > 35 ? 'var(--risk)' : 'var(--salmon)' },
            ].map(m => (
              <div key={m.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: 16, color: 'var(--white-dim)', fontWeight: 500 }}>{m.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: m.color as string, fontWeight: 'bold' }}>
                  {m.val}
                </span>
              </div>
            ))}

            {reef.history && (
              <div style={{ margin: '14px 0', background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 10 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--white-dim)',
                  letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  Historial DHW 1980–2025
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={reef.history}>
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'rgba(232,244,255,0.4)' }}
                      tickLine={false} axisLine={false} ticks={[1980, 1990, 2000, 2010, 2020, 2025]} />
                    <YAxis hide domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ background: '#071428', border: '1px solid rgba(26,108,240,0.4)',
                      borderRadius: 6, fontSize: 14, fontFamily: 'var(--font-mono)' }}
                      labelStyle={{ color: 'var(--teal)' }} itemStyle={{ color: 'var(--salmon)' }} />
                    <Line type="monotone" dataKey="dhw" stroke="var(--salmon)" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div style={{ background: 'rgba(26,108,240,0.08)', border: '1px solid rgba(26,108,240,0.25)',
              borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--royal)',
                letterSpacing: 2, marginBottom: 8 }}>⚠ ANÁLISIS</div>
              <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--white-dim)' }}>
                {INSIGHTS_ES[reef.id] ?? reef.insight}
              </div>
            </div>

            <button onClick={() => update({ selectedReefId: null })} style={{
              padding: '10px 0', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)', color: 'var(--white-dim)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16,
              letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
            }}>✕ Cerrar</button>
          </div>
        </>
      )}
    </div>
  )
}
