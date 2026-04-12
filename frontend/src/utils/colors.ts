export type ReefStatus = 'healthy' | 'risk' | 'bleached' | 'critical'

export const STATUS_COLORS: Record<ReefStatus, string> = {
  healthy:  '#00e5b0',
  risk:     '#f7c948',
  bleached: '#ff8c42',
  critical: '#ff3f52',
}

export const STATUS_LABELS: Record<ReefStatus, string> = {
  healthy:  'Sano',
  risk:     'En Riesgo',
  bleached: 'Blanqueado',
  critical: 'Crítico',
}

export function dhwToColor(dhw: number, alpha = 1): string {
  const t = Math.min(dhw / 10, 1)
  if (t < 0.3) {
    const s = t / 0.3
    return `rgba(${Math.round(26 + s * (-26))},${Math.round(108 + s * 93)},${Math.round(240 + s * -28)},${alpha})`
  } else if (t < 0.5) {
    const s = (t - 0.3) / 0.2
    return `rgba(${Math.round(s * 247)},201,${Math.round(72 - s * 72)},${alpha})`
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25
    return `rgba(${Math.round(247 + s * 8)},${Math.round(201 - s * 61)},${Math.round(72 - s * 72)},${alpha})`
  } else {
    const s = (t - 0.75) / 0.25
    return `rgba(255,${Math.round(140 - s * 140)},${Math.round(66 - s * 66)},${alpha})`
  }
}

export function statusFromDHW(dhw: number): ReefStatus {
  if (dhw >= 8) return 'critical'
  if (dhw >= 6) return 'bleached'
  if (dhw >= 4) return 'risk'
  return 'healthy'
}

export const CLUSTER_COLORS = [
  '#00e5b0', // 0 — verde
  '#f7c948', // 1 — amarillo
  '#ff8c42', // 2 — naranja
  '#ff3f52', // 3 — rojo
  '#b020f0', // 4 — crítico
]
