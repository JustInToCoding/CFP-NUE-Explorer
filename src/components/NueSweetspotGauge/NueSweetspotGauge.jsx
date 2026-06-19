import styles from './NueSweetspotGauge.module.css'

const SWEETSPOT_RANGES = [
  { match: ['wheat', 'barley', 'oat', 'rye', 'triticale'],                          min: 60, max: 80 },
  { match: ['maize', 'corn', 'sorghum', 'millet', 'teff'],                          min: 52, max: 74 },
  { match: ['rice'],                                                                  min: 40, max: 65 },
  { match: ['soybean', 'soya', 'groundnut', 'peanut', 'alfalfa', 'clover', 'lucerne'], min: 25, max: 55 },
  { match: ['pea', 'bean', 'chickpea', 'lentil'],                                   min: 30, max: 60 },
  { match: ['rapeseed', 'canola', 'sunflower', 'linseed', 'flaxseed'],              min: 50, max: 72 },
  { match: ['cotton'],                                                                min: 45, max: 68 },
  { match: ['potato', 'cassava', 'sweet potato'],                                   min: 48, max: 70 },
  { match: ['sugar beet', 'sugarcane', 'sugar cane'],                               min: 52, max: 73 },
  { match: ['tobacco'],                                                               min: 48, max: 68 },
  { match: ['coffee'],                                                                min: 40, max: 62 },
]

// IPCC 2006 climate zones — wetter = more N leaching = harder to achieve high NUE
const CLIMATE_ADJUST = {
  'Tropical Wet':           -10,
  'Tropical Moist':          -6,
  'Tropical Dry':            +4,
  'Warm Temperate Moist':    -3,
  'Warm Temperate Dry':      +4,
  'Cool Temperate Moist':     0,
  'Cool Temperate Dry':      +3,
  'Boreal Moist':            +3,
  'Boreal Dry':              +5,
  'Polar Wet':               +4,
  'Polar Dry':               +6,
}

export const getSweetspot = (cropKey, climate) => {
  const entry = cropKey
    ? SWEETSPOT_RANGES.find(r => r.match.some(m => cropKey.includes(m)))
    : null
  const base = entry ?? { min: 50, max: 73 }
  const adj = (climate && CLIMATE_ADJUST[climate] != null) ? CLIMATE_ADJUST[climate] : 0
  return {
    min: Math.max(12, base.min + adj),
    max: Math.min(95, base.max + adj),
    hasClimate: !!climate && CLIMATE_ADJUST[climate] != null,
  }
}

const getZoneStatus = (nue, sweetMin, sweetMax) => {
  if (nue == null) return null
  if (nue < sweetMin * 0.5) return {
    icon: '🔴',
    label: 'Very Low Efficiency',
    color: '#dc2626',
    bg: '#fff1f2',
    border: '#fecdd3',
    msg: 'NUE is critically low. The majority of applied nitrogen is being lost to the environment — through leaching, volatilisation, or runoff — before the crop can absorb it. Significant economic and environmental losses are likely.',
  }
  if (nue < sweetMin) return {
    icon: '⚠️',
    label: 'Below the Sweetspot',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    msg: 'NUE is below the optimal range for this crop and climate. Some applied nitrogen is not being captured by the crop. Consider split applications, better timing, or inhibitor-coated fertilisers to improve uptake.',
  }
  if (nue <= sweetMax) return {
    icon: '✅',
    label: 'In the Sweetspot',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    msg: 'NUE is in the optimal range. Most applied nitrogen is being efficiently captured by the crop — a good balance between crop productivity and minimising environmental N losses.',
  }
  if (nue <= 100) return {
    icon: '⚠️',
    label: 'Above Sweetspot — Soil N Mining Risk',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    msg: 'The crop is drawing on soil nitrogen reserves beyond what is being applied. If sustained, this depletes long-term soil fertility and can reduce future yields without additional N inputs.',
  }
  return {
    icon: '🔴',
    label: 'Active Soil N Mining',
    color: '#dc2626',
    bg: '#fff1f2',
    border: '#fecdd3',
    msg: 'N removed in harvest significantly exceeds N applied. Soil N stocks are being depleted. Increasing fertiliser application or adding organic matter inputs would help restore the nitrogen balance.',
  }
}

const MAX_PCT = 130

function GaugeSvg({ nue, sweetMin, sweetMax }) {
  const W = 600, H = 88
  const PL = 10, PR = 10
  const barY = 34, barH = 34
  const iW = W - PL - PR

  const px = pct => PL + (Math.min(Math.max(pct, 0), MAX_PCT) / MAX_PCT) * iW

  const zones = [
    { from: 0,        to: sweetMin, fill: '#fecaca' },
    { from: sweetMin, to: sweetMax, fill: '#86efac' },
    { from: sweetMax, to: 100,      fill: '#fde68a' },
    { from: 100,      to: MAX_PCT,  fill: '#fca5a5' },
  ].filter(z => z.to > z.from)

  const mx = nue != null ? px(Math.min(Math.max(nue, 0), MAX_PCT)) : null
  const clamped = (nue ?? 0) > MAX_PCT
  const nueText = nue != null
    ? `${clamped ? '>' : ''}${clamped ? MAX_PCT : nue.toFixed(0)}%`
    : null

  const ticks = [0, sweetMin, sweetMax, 100].filter((t, i, arr) =>
    arr.every((o, j) => j === i || Math.abs(o - t) >= 6)
  )

  // Zone name labels — show shorter variants when zone is narrow
  const labelCfg = [
    { from: 0,        to: sweetMin, full: 'Too Low',       short: 'Low',   color: '#b91c1c' },
    { from: sweetMin, to: sweetMax, full: 'Sweetspot ✓',  short: '✓',    color: '#15803d', bold: true },
    { from: sweetMax, to: 100,      full: 'Mining Risk',   short: 'Risk',  color: '#92400e' },
    { from: 100,      to: MAX_PCT,  full: 'Mining',        short: '',      color: '#991b1b' },
  ].filter(z => z.to > z.from)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
      {/* Zone colour fills */}
      {zones.map((z, i) => (
        <rect key={i}
          x={px(z.from)} y={barY}
          width={Math.max(0, px(z.to) - px(z.from))}
          height={barH}
          fill={z.fill}
        />
      ))}

      {/* Bar outer border */}
      <rect x={PL} y={barY} width={iW} height={barH}
        fill="none" stroke="#d1d5db" strokeWidth="1" rx="3" />

      {/* Sweetspot bracket — green outline */}
      <rect
        x={px(sweetMin) - 1} y={barY - 4}
        width={Math.max(0, px(sweetMax) - px(sweetMin)) + 2} height={barH + 8}
        fill="none" stroke="#16a34a" strokeWidth="2.5" rx="4"
      />

      {/* 100% boundary — dashed vertical rule */}
      <line x1={px(100)} y1={barY + 2} x2={px(100)} y2={barY + barH - 2}
        stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="4,3" />

      {/* Zone labels inside bar */}
      {labelCfg.map((z, i) => {
        const x1 = px(z.from), x2 = px(Math.min(z.to, MAX_PCT))
        const zW = x2 - x1
        const cx = (x1 + x2) / 2
        const PX_PER_CH = 7.5
        const text = zW >= z.full.length * PX_PER_CH ? z.full
          : zW >= z.short.length * PX_PER_CH + 4 ? z.short
          : null
        if (!text) return null
        return (
          <text key={i}
            x={cx} y={barY + barH / 2 + 4.5}
            textAnchor="middle"
            fontSize="12"
            fontWeight={z.bold ? '700' : '500'}
            fill={z.color}
          >
            {text}
          </text>
        )
      })}

      {/* Tick marks & labels */}
      {ticks.map(t => {
        const x = px(t)
        const anchor = t === 0 ? 'start' : 'middle'
        return (
          <g key={t}>
            <line x1={x} y1={barY + barH} x2={x} y2={barY + barH + 5} stroke="#9ca3af" strokeWidth="1" />
            <text x={x} y={barY + barH + 17} textAnchor={anchor} fontSize="10" fill="#6b7280">{t}%</text>
          </g>
        )
      })}
      <text x={PL + iW} y={barY + barH + 17} textAnchor="end" fontSize="10" fill="#d1d5db">{MAX_PCT}%</text>

      {/* Marker */}
      {mx != null && (
        <>
          {/* Vertical line */}
          <line x1={mx} y1={barY - 14} x2={mx} y2={barY + barH + 4}
            stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
          {/* Downward-pointing triangle */}
          <polygon
            points={`${mx - 8},${barY - 14} ${mx + 8},${barY - 14} ${mx},${barY - 3}`}
            fill="#111827"
          />
          {/* Value badge */}
          {(() => {
            const badgeW = 50, badgeH = 22, badgeR = 11
            const badgeX = Math.min(Math.max(mx - badgeW / 2, PL), PL + iW - badgeW)
            return (
              <>
                <rect x={badgeX} y={barY - 38} width={badgeW} height={badgeH} rx={badgeR} fill="#111827" />
                <text x={badgeX + badgeW / 2} y={barY - 22}
                  textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
                  {nueText}
                </text>
              </>
            )
          })()}
        </>
      )}
    </svg>
  )
}

export default function NueSweetspotGauge({ nue, cropKey, cropLabel, climate }) {
  const { min: sweetMin, max: sweetMax, hasClimate } = getSweetspot(cropKey, climate)
  const status = getZoneStatus(nue, sweetMin, sweetMax)
  const cropDisplay = cropLabel ?? cropKey ?? 'general crops'

  return (
    <div className={styles.wrap}>
      {/* Status interpretation */}
      {status && (
        <div className={styles.status} style={{ background: status.bg, borderColor: status.border }}>
          <span className={styles.statusIcon}>{status.icon}</span>
          <div>
            <p className={styles.statusLabel} style={{ color: status.color }}>{status.label}</p>
            <p className={styles.statusMsg}>{status.msg}</p>
          </div>
        </div>
      )}

      {/* Gauge */}
      <GaugeSvg nue={nue} sweetMin={sweetMin} sweetMax={sweetMax} />

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: '#fca5a5' }} />
          <div>
            <strong>Too Low</strong>
            <span> — N lost before crop uptake (leaching, volatilisation)</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: '#86efac' }} />
          <div>
            <strong>Sweetspot</strong>
            <span> — optimal efficiency, crop captures most applied N</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: '#fde68a' }} />
          <div>
            <strong>Mining Risk</strong>
            <span> — crop draws on soil N reserves, depleting long-term fertility</span>
          </div>
        </div>
      </div>

      {/* Context footer */}
      <p className={styles.context}>
        Sweetspot for <strong>{cropDisplay}</strong>
        {hasClimate
          ? <> in <strong>{climate}</strong> climate</>
          : climate ? <> (climate zone "{climate}" not matched — using crop default)</> : ''}
        {': '}
        <strong>{sweetMin}–{sweetMax}%</strong>
        {hasClimate && (() => {
          const d = CLIMATE_ADJUST[climate]
          if (!d) return null
          const sign = d > 0 ? '+' : ''
          return (
            <span className={styles.climateAdj}>
              {' '}({sign}{d}pp vs temperate baseline due to {d < 0 ? 'higher rainfall and leaching' : 'drier conditions'})
            </span>
          )
        })()}
      </p>
    </div>
  )
}
