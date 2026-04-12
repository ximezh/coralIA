import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export interface Reef {
  id: number
  name: string
  country: string
  lat: number
  lon: number
  dhw: number
  sst: number
  events: number
  cluster: number
  recovery: number
  status: string
  insight: string
  dhw_computed: number
  status_computed: string
}

export interface ReefDetail extends Reef {
  history: { year: number; dhw: number }[]
}

export interface GlobalStats {
  year: number
  total_monitored: number
  critical: number
  bleached: number
  risk: number
  healthy: number
  avg_dhw: number
}

export interface DHWPrediction {
  dhw: number
  nivel: string
  modelo: string
  umbral_riesgo: number
  umbral_critico: number
}

export interface StatusPrediction {
  estado: string
  confianza: Record<string, number>
  modelo: string
}

export interface ClusterPrediction {
  cluster: number
  nombre: string
  perfil: Record<string, number>
  modelo: string
}

export interface Metric {
  Modelo: string
  Algoritmo: string
  Metrica: string
  Valor: number
  Extra: string
}

// ── Reef endpoints ──
export const getReefs = (year = 2020, deltaTemp = 0, deltaFreq = 0) =>
  api.get<{ reefs: Reef[]; year: number; count: number }>('/reefs', {
    params: { year, delta_temp: deltaTemp, delta_freq: deltaFreq }
  }).then(r => r.data)

export const getReef = (id: number, year = 2020, deltaTemp = 0, deltaFreq = 0) =>
  api.get<ReefDetail>(`/reefs/${id}`, {
    params: { year, delta_temp: deltaTemp, delta_freq: deltaFreq }
  }).then(r => r.data)

export const getStats = (year = 2020, deltaTemp = 0, deltaFreq = 0) =>
  api.get<GlobalStats>('/stats', {
    params: { year, delta_temp: deltaTemp, delta_freq: deltaFreq }
  }).then(r => r.data)

// ── Prediction endpoints ──
export const predictDHW = (data: Record<string, number>) =>
  api.post<DHWPrediction>('/predict/dhw', data).then(r => r.data)

export const predictStatus = (data: Record<string, number>) =>
  api.post<StatusPrediction>('/predict/status', data).then(r => r.data)

export const predictCluster = (data: Record<string, number>) =>
  api.post<ClusterPrediction>('/predict/cluster', data).then(r => r.data)

// ── Metadata ──
export const getMetrics = () =>
  api.get<{ metrics: Metric[] }>('/metrics').then(r => r.data)

export const getScenarios = () =>
  api.get<{ scenarios: any[] }>('/simulation/scenarios').then(r => r.data)

export const getClusterProfiles = () =>
  api.get<{ profiles: any[]; nombres: Record<string, string> }>('/clusters/profiles').then(r => r.data)
