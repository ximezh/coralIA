// pages/Dashboard.tsx
// Vista principal: compone el mapa + paneles lateral.
// App.tsx lo usa directamente sin react-router por ahora.

import { useState, useCallback } from 'react'
import TopBar from '../components/TopBar'
import LeftPanel from '../components/LeftPanel2'
import MapView from '../components/MapView'
import RightPanel from '../components/RightPanel'
import PredictModal from '../components/PredictModal'
import type { AppState } from '../App'

interface Props {
  state: AppState
  update: (patch: Partial<AppState>) => void
}

export default function Dashboard({ state, update }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <TopBar state={state} update={update} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftPanel state={state} update={update} />
        <MapView state={state} update={update} />
        <RightPanel state={state} update={update} />
      </div>
      {state.showPredict && (
        <PredictModal onClose={() => update({ showPredict: false })} />
      )}
    </div>
  )
}
