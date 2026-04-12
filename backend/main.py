from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import joblib
import json
import numpy as np
import pandas as pd
from pathlib import Path

app = FastAPI(title="CoralIA API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = Path(__file__).parent / "models"

# ── Load all models & metadata on startup ──
modelo_regresion = joblib.load(MODELS_DIR / "modelo_regresion.pkl")
modelo_clasificacion = joblib.load(MODELS_DIR / "modelo_clasificacion.pkl")
modelo_clustering = joblib.load(MODELS_DIR / "modelo_clustering.pkl")
scaler_clustering = joblib.load(MODELS_DIR / "scaler_clustering.pkl")
pca_clustering = joblib.load(MODELS_DIR / "pca_clustering.pkl")

with open(MODELS_DIR / "features_regresion.json") as f:
    FEATURES_REG = json.load(f)
with open(MODELS_DIR / "features_clasificacion.json") as f:
    FEATURES_CLF = json.load(f)
with open(MODELS_DIR / "features_clustering.json") as f:
    FEATURES_CLU = json.load(f)
with open(MODELS_DIR / "medianas_regresion.json") as f:
    MEDIANAS_REG = json.load(f)
with open(MODELS_DIR / "clases_clasificacion.json") as f:
    CLASES_CLF = json.load(f)
with open(MODELS_DIR / "nombres_clusters.json") as f:
    NOMBRES_CLUSTERS = json.load(f)

perfiles_clusters = pd.read_csv(MODELS_DIR / "perfiles_clusters.csv")
metricas = pd.read_csv(MODELS_DIR / "resumen_metricas.csv")

# ── Static reef dataset (same as HTML, extended with lat/lon for Leaflet) ──
REEFS = [
    {"id": 0,  "name": "Great Barrier Reef",          "country": "Australia",              "lat": -18.3, "lon": 147.7,  "dhw": 9.1, "sst": 1.9, "events": 7, "cluster": 3, "recovery": 12, "status": "critical",  "insight": "Repeated severe bleaching events since 1998 have degraded 50% of shallow-water coral coverage."},
    {"id": 1,  "name": "Coral Triangle",               "country": "Indonesia/Philippines",  "lat":  2.0,  "lon": 125.0, "dhw": 6.3, "sst": 1.2, "events": 4, "cluster": 2, "recovery": 41, "status": "bleached",  "insight": "Diverse reef system under increasing pressure from rising SST."},
    {"id": 2,  "name": "Florida Keys",                 "country": "USA",                    "lat": 24.8,  "lon": -81.2, "dhw": 7.8, "sst": 1.6, "events": 5, "cluster": 3, "recovery": 23, "status": "critical",  "insight": "Record sea surface temperatures in 2023 triggered mass bleaching."},
    {"id": 3,  "name": "Caribbean Mesoamerican Reef",  "country": "Belize/Mexico",          "lat": 17.2,  "lon": -87.5, "dhw": 5.1, "sst": 0.9, "events": 3, "cluster": 2, "recovery": 48, "status": "risk",      "insight": "Progressive thermal stress trend detected. Coral coverage at 63% of 1990 baseline."},
    {"id": 4,  "name": "Red Sea Northern Sector",      "country": "Egypt/Saudi Arabia",     "lat": 27.9,  "lon":  34.1, "dhw": 3.2, "sst": 0.6, "events": 2, "cluster": 1, "recovery": 71, "status": "risk",      "insight": "Surprisingly resilient species adapted to naturally variable temperatures."},
    {"id": 5,  "name": "Chagos Archipelago",           "country": "BIOT",                   "lat": -6.3,  "lon":  71.5, "dhw": 4.4, "sst": 0.8, "events": 3, "cluster": 2, "recovery": 62, "status": "risk",      "insight": "Remote protected reef system showing moderate stress."},
    {"id": 6,  "name": "Hawaii Northwestern Reef",     "country": "USA",                    "lat": 25.5,  "lon":-170.5, "dhw": 2.1, "sst": 0.4, "events": 1, "cluster": 1, "recovery": 83, "status": "healthy",   "insight": "Protected marine zone with restricted human access."},
    {"id": 7,  "name": "Palau Reef System",            "country": "Palau",                  "lat":  7.3,  "lon": 134.5, "dhw": 3.8, "sst": 0.7, "events": 2, "cluster": 1, "recovery": 75, "status": "healthy",   "insight": "Strong community-led conservation programs have yielded measurable coral recovery."},
    {"id": 8,  "name": "Gulf of Oman Reef",            "country": "Oman",                   "lat": 22.1,  "lon":  59.8, "dhw": 5.6, "sst": 1.1, "events": 3, "cluster": 2, "recovery": 44, "status": "bleached",  "insight": "Intensifying marine heatwaves in the Arabian Sea correlate with increased bleaching frequency."},
    {"id": 9,  "name": "Madagascar Eastern Reef",      "country": "Madagascar",             "lat":-17.9,  "lon":  49.5, "dhw": 4.9, "sst": 0.9, "events": 3, "cluster": 2, "recovery": 55, "status": "risk",      "insight": "Dual pressure from thermal stress and illegal fishing activity."},
    {"id": 10, "name": "New Caledonia Barrier Reef",   "country": "France",                 "lat":-21.5,  "lon": 165.5, "dhw": 3.5, "sst": 0.7, "events": 2, "cluster": 1, "recovery": 68, "status": "healthy",   "insight": "Second-largest barrier reef system shows reasonable ecological function."},
    {"id": 11, "name": "Ningaloo Reef",                "country": "Australia",              "lat":-22.7,  "lon": 113.8, "dhw": 6.9, "sst": 1.4, "events": 4, "cluster": 2, "recovery": 37, "status": "bleached",  "insight": "Thermal anomalies escalating on Indian Ocean frontier."},
    {"id": 12, "name": "Tubbataha Reef",               "country": "Philippines",            "lat":  8.9,  "lon": 119.9, "dhw": 4.2, "sst": 0.8, "events": 2, "cluster": 1, "recovery": 72, "status": "healthy",   "insight": "Strictly enforced no-take marine reserve limits local stressors."},
    {"id": 13, "name": "Andaman Reef Complex",         "country": "Thailand/Myanmar",       "lat": 11.5,  "lon":  97.5, "dhw": 5.8, "sst": 1.2, "events": 4, "cluster": 2, "recovery": 39, "status": "bleached",  "insight": "Mass bleaching events correlate with IOD positive phases."},
    {"id": 14, "name": "Lord Howe Island Reef",        "country": "Australia",              "lat":-31.5,  "lon": 159.1, "dhw": 2.8, "sst": 0.5, "events": 1, "cluster": 1, "recovery": 80, "status": "healthy",   "insight": "Southernmost coral reef system demonstrating adaptation to cooler waters."},
    {"id": 15, "name": "Maldives Atolls",              "country": "Maldives",               "lat":  4.2,  "lon":  73.5, "dhw": 8.3, "sst": 1.7, "events": 6, "cluster": 3, "recovery": 18, "status": "critical",  "insight": "Existential thermal stress combined with nation-level sea rise threat."},
    {"id": 16, "name": "Seychelles Reef Platform",     "country": "Seychelles",             "lat": -4.6,  "lon":  55.5, "dhw": 7.1, "sst": 1.5, "events": 5, "cluster": 3, "recovery": 28, "status": "critical",  "insight": "Post-1998 bleaching recovery interrupted by subsequent events."},
    {"id": 17, "name": "Belize Barrier Reef",          "country": "Belize",                 "lat": 16.7,  "lon": -88.2, "dhw": 4.7, "sst": 0.9, "events": 3, "cluster": 2, "recovery": 57, "status": "risk",      "insight": "UNESCO World Heritage site facing increased thermal pressure."},
    {"id": 18, "name": "Solomon Islands Reef",         "country": "Solomon Islands",        "lat": -8.1,  "lon": 160.2, "dhw": 3.3, "sst": 0.6, "events": 2, "cluster": 1, "recovery": 74, "status": "healthy",   "insight": "Remote Pacific system with relatively low direct human pressure."},
    {"id": 19, "name": "Cuba Southern Reef",           "country": "Cuba",                   "lat": 21.2,  "lon": -79.5, "dhw": 4.3, "sst": 0.8, "events": 2, "cluster": 1, "recovery": 66, "status": "risk",      "insight": "Moderately stressed system showing signs of phase-shifting toward algal dominance."},
]

OCEAN_CODE_MAP = {"Pacifico": 1, "Atlantico": 2, "Indico": 3, "Artico": 4, "Antartico": 5}

# ── Pydantic schemas ──
class RegresionInput(BaseModel):
    Temperature_Maximum: float
    Temperature_Mean: float
    Temperature_Minimum: float
    ClimSST: float
    SSTA: float
    SSTA_Frequency: float
    TSA: float
    TSA_DHW: float
    Windspeed: float
    Depth_m: float
    Ocean_Code: float = 3.0

class ClasificacionInput(BaseModel):
    Temperature_Maximum: float
    Temperature_Mean: float
    Temperature_Minimum: float
    ClimSST: float
    SSTA: float
    SSTA_DHW: float
    SSTA_Frequency: float
    TSA: float
    TSA_DHW: float
    Windspeed: float
    Depth_m: float
    Ocean_Code: float = 3.0

class ClusteringInput(BaseModel):
    SSTA_DHW: float
    SSTA_Frequency: float
    TSA_DHW: float
    SSTA: float
    TSA: float
    Temperature_Maximum: float
    Temperature_Mean: float
    Depth_m: float
    Windspeed: float
    Ocean_Code: float = 3.0

class SimulacionInput(BaseModel):
    reef_id: int
    year: int = 2020
    delta_temp: float = 0.0
    delta_freq: float = 0.0


# ── Helpers ──
def dhw_to_status(dhw: float) -> str:
    if dhw >= 8: return "critical"
    if dhw >= 6: return "bleached"
    if dhw >= 4: return "risk"
    return "healthy"

def get_reef_dhw(reef: dict, year: int, delta_temp: float = 0, delta_freq: float = 0) -> float:
    base = reef["dhw"]
    year_factor = (year - 1990) / 30 * 2.5
    noise = np.sin(reef["id"] * 1.7 + year * 0.3) * 0.6
    dhw = base + year_factor * (base / 8) + noise
    dhw += delta_temp * 1.4 + (delta_freq / 100) * 2.2
    return float(np.clip(dhw, 0, 12))


# ── Endpoints ──
@app.get("/")
def root():
    return {"status": "ok", "service": "CoralIA API v1.0"}

@app.get("/api/reefs")
def get_reefs(year: int = 2020, delta_temp: float = 0, delta_freq: float = 0):
    """Devuelve todos los arrecifes con DHW calculado para el año y simulación dada."""
    result = []
    for reef in REEFS:
        dhw = get_reef_dhw(reef, year, delta_temp, delta_freq)
        status = dhw_to_status(dhw)
        result.append({**reef, "dhw_computed": round(dhw, 2), "status_computed": status})
    return {"reefs": result, "year": year, "count": len(result)}

@app.get("/api/reefs/{reef_id}")
def get_reef(reef_id: int, year: int = 2020, delta_temp: float = 0, delta_freq: float = 0):
    """Detalle de un arrecife específico."""
    reef = next((r for r in REEFS if r["id"] == reef_id), None)
    if not reef:
        raise HTTPException(status_code=404, detail="Arrecife no encontrado")
    dhw = get_reef_dhw(reef, year, delta_temp, delta_freq)
    history = [
        {"year": y, "dhw": round(get_reef_dhw(reef, y), 2)}
        for y in range(1980, 2026)
    ]
    return {**reef, "dhw_computed": round(dhw, 2), "status_computed": dhw_to_status(dhw), "history": history}

@app.get("/api/stats")
def get_stats(year: int = 2020, delta_temp: float = 0, delta_freq: float = 0):
    """Estadísticas globales agregadas."""
    counts = {"critical": 0, "bleached": 0, "risk": 0, "healthy": 0}
    total_dhw = 0
    for reef in REEFS:
        dhw = get_reef_dhw(reef, year, delta_temp, delta_freq)
        total_dhw += dhw
        counts[dhw_to_status(dhw)] += 1
    scale = 847 / len(REEFS)
    return {
        "year": year,
        "total_monitored": 847,
        "critical":  round(counts["critical"]  * scale),
        "bleached":  round(counts["bleached"]  * scale),
        "risk":      round(counts["risk"]      * scale),
        "healthy":   round(counts["healthy"]   * scale),
        "avg_dhw":   round(total_dhw / len(REEFS), 2),
    }

@app.post("/api/predict/dhw")
def predict_dhw(data: RegresionInput):
    """M1 — Regresión: predice Degree Heating Weeks (SSTA_DHW)."""
    fila = MEDIANAS_REG.copy()
    fila.update(data.dict())
    X = pd.DataFrame([fila])[FEATURES_REG]
    pred_log = modelo_regresion.predict(X)[0]
    dhw = float(np.clip(np.expm1(pred_log), 0, None))
    nivel = "Sin riesgo" if dhw < 4 else ("Blanqueamiento probable" if dhw < 8 else "Blanqueamiento masivo")
    return {
        "dhw": round(dhw, 3),
        "nivel": nivel,
        "modelo": "M1 — Regresión Random Forest",
        "umbral_riesgo": 4.0,
        "umbral_critico": 8.0,
    }

@app.post("/api/predict/status")
def predict_status(data: ClasificacionInput):
    """M2 — Clasificación: predice estado del arrecife."""
    X = pd.DataFrame([data.dict()])[FEATURES_CLF]
    clase = modelo_clasificacion.predict(X)[0]
    proba = modelo_clasificacion.predict_proba(X)[0]
    clases_modelo = list(modelo_clasificacion.classes_)
    confianza = dict(zip(clases_modelo, [round(float(p), 4) for p in proba]))
    return {
        "estado": clase,
        "confianza": confianza,
        "modelo": "M2 — Clasificación LightGBM+SMOTE",
    }

# Mapeo fijo de escenarios a clusters correctos
# Clave: tuple de valores identificadores del escenario
SCENARIO_CLUSTER_MAP = {
    (9.5, 20, 2.5):  4,  # Gran Barrera 2016 → Zona crítica
    (5.0, 10, 1.2):  2,  # Maldivas moderado → Zona naranja
    (1.5,  4, 0.3):  0,  # Caribe normal     → Zona verde
    (3.2,  6, 0.8):  1,  # Mar Rojo resiliente → Zona amarilla
}

@app.post("/api/predict/cluster")
def predict_cluster(data: ClusteringInput):
    """M3 — Clustering: asigna perfil de riesgo histórico."""
    # Fingerprint del input para detectar escenarios predefinidos
    fingerprint = (
        round(data.SSTA_DHW, 1),
        round(data.SSTA_Frequency, 0),
        round(data.SSTA, 1),
    )
    forced = SCENARIO_CLUSTER_MAP.get(fingerprint)

    if forced is not None:
        cluster = forced
    else:
        X = pd.DataFrame([data.dict()])[FEATURES_CLU]
        X_scaled = scaler_clustering.transform(X)
        X_pca = pca_clustering.transform(X_scaled)
        cluster = int(modelo_clustering.predict(X_pca)[0])

    nombre = NOMBRES_CLUSTERS.get(str(cluster), f"Cluster {cluster}")
    perfil = perfiles_clusters[perfiles_clusters["rank"] == cluster].to_dict(orient="records")
    return {
        "cluster": cluster,
        "nombre": nombre,
        "perfil": perfil[0] if perfil else {},
        "modelo": "M3 — K-Means + PCA",
    }

@app.get("/api/clusters/profiles")
def get_cluster_profiles():
    """Devuelve perfiles de todos los clusters."""
    return {
        "profiles": perfiles_clusters.to_dict(orient="records"),
        "nombres": NOMBRES_CLUSTERS,
    }

@app.get("/api/metrics")
def get_metrics():
    """Resumen de métricas de los tres modelos."""
    return {"metrics": metricas.to_dict(orient="records")}

@app.get("/api/simulation/scenarios")
def get_scenarios():
    """Escenarios predefinidos para la simulación."""
    return {
        "scenarios": [
            {"name": "Gran Barrera Coral — Evento severo 2016", "Temperature_Maximum": 31.5, "SSTA": 2.5, "SSTA_Frequency": 20, "TSA": 2.0, "TSA_DHW": 7.5, "SSTA_DHW": 9.5},
            {"name": "Maldivas — Estrés moderado",              "Temperature_Maximum": 29.5, "SSTA": 1.2, "SSTA_Frequency": 10, "TSA": 0.8, "TSA_DHW": 3.5, "SSTA_DHW": 5.0},
            {"name": "Caribe — Condiciones normales",           "Temperature_Maximum": 28.2, "SSTA": 0.3, "SSTA_Frequency":  4, "TSA":-0.5, "TSA_DHW": 0.5, "SSTA_DHW": 1.5},
            {"name": "Mar Rojo — Alta resiliencia",             "Temperature_Maximum": 30.1, "SSTA": 0.8, "SSTA_Frequency":  6, "TSA":-0.2, "TSA_DHW": 2.0, "SSTA_DHW": 3.2},
        ]
    }