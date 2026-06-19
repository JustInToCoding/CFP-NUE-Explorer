import { useState, useMemo } from 'react'
import Card from '../../components/Card/Card'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import EmptyState from '../../components/EmptyState/EmptyState'
import { useFaostatCodes, useFaostatData } from '../../hooks/useFaostat'
import styles from './GlobalNContext.module.css'

const findCode = (items = [], ...keywords) =>
  items.find(c => keywords.some(kw => c.label?.toLowerCase().includes(kw.toLowerCase())))

const parsePoints = (res) =>
  (res?.data ?? [])
    .filter(r => r.Value && !isNaN(parseFloat(r.Value)))
    .map(r => ({ year: parseInt(r.Year, 10), value: parseFloat(r.Value) }))
    .sort((a, b) => a.year - b.year)

function LineChart({ points, unit, color }) {
  if (!points.length) return null

  const sorted = [...points].sort((a, b) => a.year - b.year)
  const W = 560, H = 180
  const PAD = { t: 8, r: 16, b: 28, l: 52 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b

  const vals = sorted.map(p => p.value)
  const minV = Math.min(...vals)
  const maxV = Math.max(...vals)
  const vRange = maxV - minV || 1
  const minX = sorted[0].year
  const maxX = sorted[sorted.length - 1].year
  const xRange = maxX - minX || 1

  const sx = x => PAD.l + ((x - minX) / xRange) * iW
  const sy = y => PAD.t + iH - ((y - minV) / vRange) * iH

  const pathD = sorted
    .map((p, i) => `${i ? 'L' : 'M'}${sx(p.year).toFixed(1)},${sy(p.value).toFixed(1)}`)
    .join('')
  const areaD = `${pathD}L${sx(maxX).toFixed(1)},${(PAD.t + iH).toFixed(1)}L${sx(minX).toFixed(1)},${(PAD.t + iH).toFixed(1)}Z`

  const xRange_ = maxX - minX
  const step = xRange_ <= 10 ? 1 : xRange_ <= 25 ? 5 : 10
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => minV + t * vRange)
  const fmtV = v => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(v < 10 ? 1 : 0)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {yTicks.map((v, i) => {
        const y = sy(v)
        return (
          <g key={i}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#f0f0f0" strokeWidth="1" />
            <text x={PAD.l - 4} y={y + 3.5} textAnchor="end" fontSize="9.5" fill="#9ca3af">{fmtV(v)}</text>
          </g>
        )
      })}
      <path d={areaD} fill={color} fillOpacity="0.07" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {[sorted[0], sorted[sorted.length - 1]].map(p => (
        <circle key={p.year} cx={sx(p.year)} cy={sy(p.value)} r="3.5" fill={color} />
      ))}
      {sorted.filter(p => p.year % step === 0).map(p => (
        <text key={p.year} x={sx(p.year)} y={H - 5} textAnchor="middle" fontSize="9.5" fill="#9ca3af">{p.year}</text>
      ))}
      <text transform={`translate(11,${PAD.t + iH / 2}) rotate(-90)`} textAnchor="middle" fontSize="9" fill="#9ca3af">{unit}</text>
    </svg>
  )
}

export default function GlobalNContext() {
  const [areaCode, setAreaCode] = useState('')

  const esbEl = useFaostatCodes('ESB', 'elements')
  const esbIt = useFaostatCodes('ESB', 'items')
  const rfnEl = useFaostatCodes('RFN', 'elements')
  const rfnIt = useFaostatCodes('RFN', 'items')
  const ctries = useFaostatCodes('ESB', 'countries')

  const codesLoading = esbEl.isLoading || esbIt.isLoading || rfnEl.isLoading || rfnIt.isLoading || ctries.isLoading
  const codesError = esbEl.error || esbIt.error || rfnEl.error || rfnIt.error

  const nueEl  = useMemo(() => findCode(esbEl.data?.data, 'efficiency', 'nue'),           [esbEl.data])
  const esbNIt = useMemo(() => findCode(esbIt.data?.data, 'nitrogen (n)', 'nitrogen'),    [esbIt.data])
  const auEl   = useMemo(() => findCode(rfnEl.data?.data, 'agricultural use'),             [rfnEl.data])
  const rfnNIt = useMemo(() => findCode(rfnIt.data?.data, 'nitrogen (n)', 'nitrogen'),    [rfnIt.data])

  const countryList = useMemo(
    () => [...(ctries.data?.data ?? [])].sort((a, b) => a.label.localeCompare(b.label)),
    [ctries.data]
  )

  const nueQ   = useFaostatData('ESB', { area: areaCode, element: nueEl?.code,  item: esbNIt?.code }, { enabled: !!areaCode && !!nueEl  && !!esbNIt })
  const nfertQ = useFaostatData('RFN', { area: areaCode, element: auEl?.code,   item: rfnNIt?.code }, { enabled: !!areaCode && !!auEl   && !!rfnNIt })

  const nuePoints   = useMemo(() => parsePoints(nueQ.data),   [nueQ.data])
  const nfertPoints = useMemo(() => parsePoints(nfertQ.data), [nfertQ.data])

  const latestNUE   = nuePoints[nuePoints.length - 1]
  const latestNFert = nfertPoints[nfertPoints.length - 1]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Global N Context</h1>
          <p className={styles.subtitle}>
            Country-level nitrogen data from{' '}
            <a href="https://www.fao.org/faostat/" target="_blank" rel="noreferrer" className={styles.extLink}>FAOSTAT</a>
            {' '}— benchmark your farm NUE against national averages.
          </p>
        </div>
      </div>

      {codesLoading && <LoadingSpinner label="Loading FAOSTAT metadata…" />}

      {codesError && (
        <ErrorBanner message="Could not load FAOSTAT metadata. The API may be temporarily unavailable." />
      )}

      {!codesLoading && !codesError && (
        <>
          <Card>
            <label className={styles.pickerLabel} htmlFor="country-select">Country</label>
            <select
              id="country-select"
              className={styles.picker}
              value={areaCode}
              onChange={e => setAreaCode(e.target.value)}
            >
              <option value="">— Select a country —</option>
              {countryList.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>

            {nueEl && auEl && (
              <p className={styles.metaNote}>
                NUE element: <strong>{nueEl.label}</strong>
                {' · '}Fertilizer element: <strong>{auEl.label}</strong>
              </p>
            )}
            {!nueEl && esbEl.data && (
              <p className={styles.metaNote} style={{ color: 'var(--color-error)' }}>
                NUE element not found in ESB. Available: {esbEl.data.data?.map(e => e.label).join(', ')}
              </p>
            )}
          </Card>

          {areaCode && (
            <div className={styles.dataGrid}>
              <Card>
                <div className={styles.cardTop}>
                  <h2 className={styles.cardTitle}>Cropland NUE</h2>
                  {latestNUE && (
                    <span className={styles.latestVal}>
                      {latestNUE.year}: <strong>{latestNUE.value.toFixed(1)}%</strong>
                    </span>
                  )}
                </div>
                <p className={styles.cardDesc}>
                  N removed in harvest ÷ all N inputs (fertiliser + manure + atmospheric deposition + N fixation). Full-budget NUE from FAOSTAT ESB.
                </p>
                {nueQ.isLoading && <LoadingSpinner />}
                {nueQ.isError  && <ErrorBanner message={nueQ.error?.message} />}
                {!nueQ.isLoading && !nueQ.isError && (
                  nuePoints.length
                    ? <LineChart points={nuePoints} unit="%" color="#7c3aed" />
                    : <EmptyState icon="📊" title="No NUE data" description="No NUE data for this country in FAOSTAT ESB." />
                )}
              </Card>

              <Card>
                <div className={styles.cardTop}>
                  <h2 className={styles.cardTitle}>N Fertilizer Use</h2>
                  {latestNFert && (
                    <span className={styles.latestVal}>
                      {latestNFert.year}: <strong>{(latestNFert.value / 1000).toFixed(0)} kt N</strong>
                    </span>
                  )}
                </div>
                <p className={styles.cardDesc}>
                  Total agricultural nitrogen fertilizer consumption. Source: FAOSTAT RFN.
                </p>
                {nfertQ.isLoading && <LoadingSpinner />}
                {nfertQ.isError  && <ErrorBanner message={nfertQ.error?.message} />}
                {!nfertQ.isLoading && !nfertQ.isError && (
                  nfertPoints.length
                    ? <LineChart points={nfertPoints} unit="t N" color="#0891b2" />
                    : <EmptyState icon="🌾" title="No fertilizer data" description="No N fertilizer data for this country in FAOSTAT RFN." />
                )}
              </Card>
            </div>
          )}
        </>
      )}

      <p className={styles.attribution}>
        Source: Food and Agriculture Organization of the United Nations (FAO), FAOSTAT.
        ESB = Cropland Nutrient Balance · RFN = Fertilizers by Nutrient.
      </p>
    </div>
  )
}
