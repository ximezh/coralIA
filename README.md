# 🪸 CoralIA — Plataforma Global de Inteligencia Coralina

> Monitoreo en tiempo real, predicción y simulación del estado de salud de los arrecifes de coral del mundo mediante machine learning.

**Samsung Innovation Campus · Proyecto Final Machine Learning · 2026**

---

## ¿Qué es CoralIA?

CoralIA es una plataforma web que combina un mapa interactivo con tres modelos de inteligencia artificial entrenados con datos reales de la NOAA (41,361 registros · 93 países · 1980–2020) para monitorear, clasificar y predecir el estado de 847 arrecifes de coral alrededor del mundo.

---

## Funcionalidades principales

| Funcionalidad | Descripción |
|---|---|
| 🗺 Mapa Leaflet + OSM | Mapa real y gratuito. Sin Google Maps, sin API keys, sin costos |
| 🔴 Alertas parpadeantes | Detección visual de arrecifes en estado crítico o blanqueado |
| 📸 Panel de detalle | Foto, métricas, historial DHW 1980–2025 y análisis en español |
| 🔵 Capas M1 / M2 / M3 | Tres vistas del mapa: estrés térmico, estado y perfil de riesgo |
| ⏩ Línea de tiempo | Slider de año desde 1980 hasta 2035 |
| 🌡 Simulación climática | Ajusta temperatura y frecuencia de anomalías y ve el impacto en tiempo real |
| ⚡ Predictor IA | Ingresa condiciones oceanográficas y obtén predicciones de los 3 modelos |
| 📊 Vista Analytics | Métricas de los modelos y perfiles de los 5 clusters de riesgo |

---

## Modelos de Machine Learning

### M1 — Regresión: Predicción de Estrés Térmico (DHW)
- **Algoritmo:** Random Forest Regressor
- **Target:** `SSTA_DHW` (Degree Heating Weeks)
- **Precisión:** R² = 0.90 | MAE = 0.75 DHW | RMSE = 1.54 DHW
- **Interpretación:** DHW < 4 sin riesgo · DHW 4–8 blanqueamiento probable · DHW > 8 blanqueamiento masivo

### M2 — Clasificación: Estado del Arrecife
- **Algoritmo:** LightGBM + SMOTE
- **Target:** `reef_status` (Sano / En Riesgo / Blanqueado / Crítico)
- **Precisión:** Accuracy = 85.6% | F1 macro = 0.58 | F1 weighted = 0.86

### M3 — Clustering: Perfiles de Riesgo Histórico
- **Algoritmo:** K-Means + PCA (6 componentes)
- **Clusters:** 5 perfiles (Zona verde → Zona crítica)
- **Silhouette Score:** 0.213

---

## Estructura del proyecto

```
coralIA/
├── backend/
│   ├── main.py               # API FastAPI con todos los endpoints
│   ├── requirements.txt      # Dependencias Python
│   └── models/
│       ├── *.pkl             # Modelos entrenados (no incluidos en repo)
│       ├── *.json            # Metadatos y features
│       └── *.csv             # Perfiles de clusters y métricas
├── frontend/
│   ├── src/
│   │   ├── components/       # TopBar, LeftPanel, MapView, RightPanel, PredictModal
│   │   ├── pages/            # Dashboard, Analytics
│   │   └── utils/            # api.ts, colors.ts, markers.ts
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Instalación y uso

### Requisitos
- Python 3.10+
- Node.js 18+
- Los archivos `.pkl` de los modelos entrenados (ver sección Modelos)

### Backend

```bash
cd coralIA/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd coralIA/frontend
npm install
npm run dev
```

Abre **http://localhost:3000**

---

## Modelos entrenados

Los archivos `.pkl` no están incluidos en este repositorio por su tamaño. Para obtenerlos:

1. Descarga el dataset original: [NOAA Global Coral Bleaching Database (BCO-DMO)](https://www.kaggle.com/datasets/mehrdat/coral-reef-global-bleaching)
2. Ejecuta el notebook `CoralIA_Notebook.ipynb` completo
3. Los modelos se exportan automáticamente a la carpeta `backend/models/`

O bien, descarga los `.pkl` pre-entrenados desde [Releases](../../releases).

---

## Imágenes de arrecifes

Las imágenes locales de cada arrecife tampoco están incluidas en el repositorio. Para agregarlas:

1. Descarga 20 fotos de arrecifes desde [Pexels](https://www.pexels.com/search/coral%20reef/) o [Unsplash](https://unsplash.com/s/photos/coral-reef)
2. Nómbralas `reef_0.jpg` hasta `reef_19.jpg`
3. Colócalas en `frontend/src/assets/reefs/`

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Mapa | Leaflet + OpenStreetMap (gratuito, sin API key) |
| Gráficas | Recharts |
| Backend | FastAPI + Uvicorn |
| ML | scikit-learn · LightGBM · imbalanced-learn |
| Datos | NOAA / BCO-DMO Global Coral Bleaching Database |

---

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/reefs` | Todos los arrecifes con DHW computado |
| GET | `/api/reefs/{id}` | Detalle + historial 1980–2025 |
| GET | `/api/stats` | Conteos globales por estado |
| POST | `/api/predict/dhw` | M1 — Predicción de estrés térmico |
| POST | `/api/predict/status` | M2 — Clasificación del estado |
| POST | `/api/predict/cluster` | M3 — Perfil de riesgo histórico |
| GET | `/api/clusters/profiles` | Perfiles de los 5 clusters |
| GET | `/api/metrics` | Métricas de los 3 modelos |
| GET | `/api/simulation/scenarios` | Escenarios predefinidos |

---

## Dataset

**NOAA Global Coral Bleaching Database (BCO-DMO)**
- 41,361 registros · 93 países · 1980–2020
- Variables: temperatura máxima/media/mínima, SST, anomalías SSTA/TSA, DHW, viento, profundidad, frecuencia de eventos

---

*Desarrollado como proyecto final del curso de Machine Learning — Samsung Innovation Campus 2026*
