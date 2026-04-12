import L from 'leaflet'
import { dhwToColor, CLUSTER_COLORS } from '../utils/colors'

interface MarkerOptions {
  dhw: number
  cluster: number
  isSelected: boolean
  showM1: boolean
  showM2: boolean
  showM3: boolean
}

export function createReefIcon(opts: MarkerOptions): L.DivIcon {
  const { dhw, cluster, isSelected, showM1, showM2, showM3 } = opts
  const dotColor = showM2 ? dhwToColor(dhw) : '#00c9d4'
  const clusterColor = CLUSTER_COLORS[Math.min(cluster, 4)]
  const size = isSelected ? 18 : 12
  const pulse = dhw >= 7 || isSelected

  const ringStyle = showM3
    ? `border: 1.5px dashed ${clusterColor}; width: ${size + 10}px; height: ${size + 10}px; top: -5px; left: -5px;`
    : ''

  const glowStyle = showM1
    ? `box-shadow: 0 0 ${8 + dhw * 3}px ${dhwToColor(dhw, 0.6)};`
    : ''

  const pulseHtml = pulse
    ? `<div style="
        position:absolute; border-radius:50%;
        width:${size + 14}px; height:${size + 14}px;
        top:${-(7)}px; left:${-(7)}px;
        border: 2px solid ${dotColor};
        animation: pulse-ring 1.6s ease-out infinite;
        pointer-events:none;
      "></div>`
    : ''

  const ringHtml = showM3
    ? `<div style="
        position:absolute; border-radius:50%; pointer-events:none;
        ${ringStyle}
      "></div>`
    : ''

  const selectedRing = isSelected
    ? `<div style="
        position:absolute; border-radius:50%;
        width:${size + 8}px; height:${size + 8}px;
        top:-4px; left:-4px;
        border: 2px solid rgba(0,201,212,0.9);
        pointer-events:none;
      "></div>`
    : ''

  const html = `
    <div style="position:relative; width:${size}px; height:${size}px;">
      ${pulseHtml}
      ${ringHtml}
      ${selectedRing}
      <div style="
        width:${size}px; height:${size}px; border-radius:50%;
        background:${dotColor};
        ${glowStyle}
        position:relative; z-index:2;
      "></div>
    </div>
  `

  return L.divIcon({
    html,
    className: '',
    iconSize: [size + 20, size + 20],
    iconAnchor: [(size + 20) / 2, (size + 20) / 2],
  })
}
