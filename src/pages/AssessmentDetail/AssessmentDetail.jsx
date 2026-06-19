import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAssessment } from '../../hooks/useAssessments'
import { useFaostatCodes, useFaostatData } from '../../hooks/useFaostat'
import Card from '../../components/Card/Card'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import Badge from '../../components/Badge/Badge'
import EmptyState from '../../components/EmptyState/EmptyState'
import NueSweetspotGauge from '../../components/NueSweetspotGauge/NueSweetspotGauge'
import styles from './AssessmentDetail.module.css'

const fmt = (n) => (n != null ? Number(n).toFixed(3) : '—')
const fmtN = (n) => (n != null ? n.toFixed(1) : '—')
const fmtInt = (n) => (n != null ? Math.round(n).toLocaleString() : '—')

// kg CO₂eq per tonne of product — farm-gate, indicative ranges (Poore & Nemecek 2018 / Our World in Data)
// [good, poor]: below good = low intensity, above poor = high intensity
const INTENSITY_BENCHMARKS = {
  wheat: { good: 500, poor: 1200 }, 'winter wheat': { good: 500, poor: 1200 },
  'spring wheat': { good: 500, poor: 1200 }, barley: { good: 450, poor: 1000 },
  maize: { good: 400, poor: 900 }, corn: { good: 400, poor: 900 },
  rice: { good: 1500, poor: 4000 },
  soybean: { good: 350, poor: 850 }, soya: { good: 350, poor: 850 },
  rapeseed: { good: 500, poor: 1200 }, canola: { good: 500, poor: 1200 },
  sunflower: { good: 450, poor: 1100 },
  potato: { good: 180, poor: 450 }, potatoes: { good: 180, poor: 450 },
  'sugar beet': { good: 120, poor: 320 }, sugarcane: { good: 100, poor: 350 },
  pea: { good: 300, poor: 750 }, peas: { good: 300, poor: 750 },
  bean: { good: 300, poor: 800 }, beans: { good: 300, poor: 800 },
  lentil: { good: 280, poor: 700 }, lentils: { good: 280, poor: 700 },
  coffee: { good: 3000, poor: 8000 },
  _default: { good: 500, poor: 1200 },
}

const getEmissionRating = (balancePerTonne, cropKey) => {
  if (balancePerTonne == null) return null
  if (balancePerTonne < 0) return {
    label: 'Net Carbon Sink', color: '#15803d', bg: '#f0fdf4',
    desc: 'This field sequesters more carbon than it emits — a net positive climate outcome.',
    tier: -1,
  }
  const bench = (cropKey && INTENSITY_BENCHMARKS[cropKey]) ?? INTENSITY_BENCHMARKS._default
  if (balancePerTonne < bench.good) return {
    label: 'Low Emission Intensity', color: '#16a34a', bg: '#f0fdf4',
    desc: `Below ${bench.good.toLocaleString()} kg CO₂eq/t — better than the typical range for this crop.`,
    bench, tier: 0,
  }
  if (balancePerTonne < bench.poor) return {
    label: 'Average Emission Intensity', color: '#d97706', bg: '#fffbeb',
    desc: `Within the typical range of ${bench.good.toLocaleString()}–${bench.poor.toLocaleString()} kg CO₂eq/t for this crop type.`,
    bench, tier: 1,
  }
  return {
    label: 'High Emission Intensity', color: '#dc2626', bg: '#fff1f2',
    desc: `Above ${bench.poor.toLocaleString()} kg CO₂eq/t — higher than the typical range for this crop.`,
    bench, tier: 2,
  }
}

const CROP_EMOJI = [
  [['wheat', 'barley', 'oat', 'rye', 'triticale', 'maize', 'corn', 'sorghum', 'millet', 'teff', 'rice'], '🌾'],
  [['soybean', 'soya', 'groundnut', 'peanut', 'pea', 'bean', 'chickpea', 'lentil', 'alfalfa', 'clover'], '🫘'],
  [['potato', 'cassava', 'yam', 'sweet potato'], '🥔'],
  [['rapeseed', 'canola', 'sunflower', 'linseed'], '🌻'],
  [['coffee'], '☕'],
  [['sugar beet', 'sugarcane', 'sugar cane'], '🍬'],
  [['cotton'], '🪡'],
  [['tomato', 'vegetable', 'onion'], '🥦'],
]
const getCropEmoji = (cropType = '') => {
  const ct = cropType.toLowerCase()
  const match = CROP_EMOJI.find(([keys]) => keys.some(k => ct.includes(k)))
  return match ? match[1] : '🌱'
}

const isNitrogenRelated = (category) =>
  category?.includes('Non-land') || category?.includes('Land management')

// kg N per kg dry matter for harvested fraction. Source: IPCC 2006 Guidelines Table 11.2.
const CROP_N_CONTENT = {
  // Cereals
  wheat: 0.020, 'winter wheat': 0.020, 'spring wheat': 0.020,
  barley: 0.017, 'winter barley': 0.017, 'spring barley': 0.017,
  maize: 0.013, corn: 0.013,
  rice: 0.012,
  oat: 0.017, oats: 0.017,
  rye: 0.017,
  sorghum: 0.013,
  millet: 0.013,
  triticale: 0.018,
  teff: 0.020,
  // Oilseeds
  rapeseed: 0.035, canola: 0.035,
  sunflower: 0.025,
  soybean: 0.063, soya: 0.063, soybeans: 0.063,
  groundnut: 0.045, peanut: 0.045, peanuts: 0.045,
  linseed: 0.030, flaxseed: 0.030,
  cotton: 0.034,
  // Legumes
  pea: 0.040, peas: 0.040,
  bean: 0.044, beans: 0.044,
  'fava bean': 0.044, 'fava beans': 0.044, 'field bean': 0.044,
  chickpea: 0.040, lentil: 0.040, lentils: 0.040,
  alfalfa: 0.027, clover: 0.024, lucerne: 0.027,
  // Root crops & tubers
  potato: 0.003, potatoes: 0.003,
  'sweet potato': 0.003,
  cassava: 0.003,
  // Sugar crops
  'sugar beet': 0.002,
  sugarcane: 0.001, 'sugar cane': 0.001,
  // Other
  tobacco: 0.038,
  coffee: 0.020,
}

// Biological N fixation rates (kg N/ha/yr). 0 for non-legumes. Source: Peoples et al. 2009 review.
const CROP_BNF = {
  soybean: 150, soya: 150, soybeans: 150,
  alfalfa: 200, lucerne: 200,
  clover: 150,
  pea: 60, peas: 60,
  'field bean': 90, 'fava bean': 90, 'fava beans': 90,
  bean: 40, beans: 40,
  chickpea: 50, lentil: 50, lentils: 50,
  groundnut: 100, peanut: 100,
}

const getCropBnf = (cropType = '') => {
  const key = Object.keys(CROP_BNF).find((k) => cropType.toLowerCase().includes(k))
  return key ? CROP_BNF[key] : 0
}

const calcNBalance = (nueCalc, bnfPerHa, depositionPerHa) => {
  if (!nueCalc || nueCalc.nAppliedPerHa == null) return null
  const synthetic = nueCalc.nAppliedPerHa
  const bnf       = bnfPerHa ?? 0
  const dep       = depositionPerHa ?? null
  const totalInputs = synthetic + bnf + (dep ?? 0)
  const nRemoved    = nueCalc.nRemovedPerHa
  const balance     = nRemoved != null ? totalInputs - nRemoved : null
  return { synthetic, bnf, dep, totalInputs, nRemoved, balance }
}

// FAOSTAT helpers — find a code by label keyword, match farm country to FAOSTAT country list
const findFaoCode = (items = [], ...keywords) =>
  items.find(c => keywords.some(kw => c.label?.toLowerCase().includes(kw.toLowerCase())))

const normStr = s => s.toLowerCase().replace(/[^a-z\s]/g, '').trim()

const matchFaoCountry = (farmCountry, countries) => {
  if (!farmCountry || !countries?.length) return null
  const fn = normStr(farmCountry)
  let c = countries.find(x => normStr(x.label) === fn)
  if (c) return c
  c = countries.find(x => fn.includes(normStr(x.label)) || normStr(x.label).includes(fn))
  if (c) return c
  const farmWords = new Set(fn.split(/\s+/).filter(w => w.length > 3))
  let best = null, bestScore = 0
  for (const x of countries) {
    const score = normStr(x.label).split(/\s+/).filter(w => w.length > 3 && farmWords.has(w)).length
    if (score > bestScore) { bestScore = score; best = x }
  }
  return bestScore > 0 ? best : null
}

const parseFaoPoints = (res) =>
  (res?.data ?? [])
    .filter(r => r.Value && !isNaN(parseFloat(r.Value)))
    .map(r => ({ year: parseInt(r.Year, 10), value: parseFloat(r.Value) }))
    .sort((a, b) => a.year - b.year)

const parseNPct = (typeStr) => {
  const m = typeStr?.match(/(\d+\.?\d*)\s*%\s*N/i)
  return m ? parseFloat(m[1]) : null
}

const calcNUE = (run, manualCropNPct = null) => {
  if (!run?.inputData) return null

  const fertilisers = run.inputData.fertiliser?.fertilisers ?? []
  const area = run.inputData.cropDetails?.area?.value
  const yieldVal = run.inputData.cropDetails?.farmGate?.value
                ?? run.inputData.cropDetails?.cropYield?.value
  const yieldUnit = run.inputData.cropDetails?.farmGate?.unit
                 ?? run.inputData.cropDetails?.cropYield?.unit ?? ''
  const cropType = (
    run.runMetadata?.subCategory ?? run.inputData.cropDetails?.cropType ?? ''
  ).toLowerCase()

  if (!area || !fertilisers.length) return null

  let nAppliedPerHa = 0
  for (const f of fertilisers) {
    // real API: predefinedApplicationRate (kg/ha), predefinedFertiliserType has "X% N"
    // mock: amount (total kg), nitrogenPercentage
    const nPct = f.nitrogenPercentage ?? parseNPct(f.predefinedFertiliserType ?? f.type)
    if (nPct == null) continue
    if (f.predefinedApplicationRate != null) {
      const ratePerHa = f.predefinedApplicationRate.value ?? 0
      const isNBasis = f.predefinedFertiliserApplicationRateBasis === 'nitrogen'
      nAppliedPerHa += isNBasis ? ratePerHa : ratePerHa * nPct / 100
    } else if (f.amount != null) {
      nAppliedPerHa += (f.amount.value / area) * nPct / 100
    }
  }

  const cropKey = Object.keys(CROP_N_CONTENT).find((k) => cropType.includes(k))
  const cropNContent = cropKey
    ? CROP_N_CONTENT[cropKey]
    : manualCropNPct != null ? manualCropNPct / 100 : null

  let nRemovedPerHa = null
  if (cropNContent != null && yieldVal != null) {
    const yieldKgPerHa = (yieldUnit.toLowerCase().includes('tonne') ? yieldVal * 1000 : yieldVal) / area
    nRemovedPerHa = yieldKgPerHa * cropNContent
  }

  const nue = nAppliedPerHa > 0 && nRemovedPerHa != null
    ? (nRemovedPerHa / nAppliedPerHa) * 100
    : null

  return { nAppliedPerHa, nRemovedPerHa, nue, cropKey, cropType, usingManual: !cropKey && manualCropNPct != null }
}

export default function AssessmentDetail() {
  const { id } = useParams()
  const { data: assessment, isLoading, isError, error } = useAssessment(id)

  // FAOSTAT national NUE benchmark — hooks must be unconditional, data query enabled once codes + country resolve
  const esbEl   = useFaostatCodes('ESB', 'elements')
  const esbIt   = useFaostatCodes('ESB', 'items')
  const esbCtry = useFaostatCodes('ESB', 'countries')

  const farmCountry = assessment?.farm?.country
  const nueElCode  = useMemo(() => findFaoCode(esbEl.data?.data, 'efficiency', 'nue'),                     [esbEl.data])
  const depElCode  = useMemo(() => findFaoCode(esbEl.data?.data, 'atmospheric deposition', 'deposition'),  [esbEl.data])
  const esbNItCode = useMemo(() => findFaoCode(esbIt.data?.data, 'nitrogen (n)', 'nitrogen'),              [esbIt.data])
  const ctryMatch  = useMemo(() => matchFaoCountry(farmCountry, esbCtry.data?.data),                       [farmCountry, esbCtry.data])

  const ctryNueQ = useFaostatData('ESB',
    { area: ctryMatch?.code, element: nueElCode?.code, item: esbNItCode?.code },
    { enabled: !!ctryMatch && !!nueElCode && !!esbNItCode }
  )
  const ctryDepQ = useFaostatData('ESB',
    { area: ctryMatch?.code, element: depElCode?.code, item: esbNItCode?.code },
    { enabled: !!ctryMatch && !!depElCode && !!esbNItCode }
  )
  const ctryNuePoints = useMemo(() => parseFaoPoints(ctryNueQ.data), [ctryNueQ.data])
  const latestCtryNUE = ctryNuePoints[ctryNuePoints.length - 1]
  const depPoints     = useMemo(() => parseFaoPoints(ctryDepQ.data), [ctryDepQ.data])
  const latestDep     = depPoints[depPoints.length - 1]

  const [manualCropNPct, setManualCropNPct] = useState(null)

  if (isLoading) return <LoadingSpinner label="Loading assessment..." />

  if (isError) {
    return (
      <div className={styles.page}>
        <Link to="/assessments" className={styles.back}>
          ← Assessments
        </Link>
        <ErrorBanner message={error?.message} />
      </div>
    )
  }

  if (!assessment) return null

  const run = assessment.submittedRun ?? assessment.draftRun
  const summary = run?.resultSummary
  const flagData =
    run?.resultAggregations?.assessmentYearGhgsByFlagCategory?.data ??
    run?.resultAggregations?.byFlag ??
    run?.resultDisaggregated?.resultsByFlag ??
    []

  const nueWarnings = (run?.inputDataValidationReport?.modelInput?.fertiliser ?? [])
    .filter((w) => w.message?.toLowerCase().includes('nitrogen use efficiency') || w.message?.toLowerCase().includes('nue'))

  const nueCalc = calcNUE(run, manualCropNPct)
  const nue = nueCalc?.nue

  const bnfPerHa      = nueCalc ? getCropBnf(nueCalc.cropType) : null
  const depositionPerHa = latestDep?.value ?? null
  const nBalance      = calcNBalance(nueCalc, bnfPerHa, depositionPerHa)

  const balanceClass = nBalance?.balance == null ? ''
    : nBalance.balance < -10  ? styles.balanceDeficit
    : nBalance.balance <= 20  ? styles.balanceSustain
    : nBalance.balance <= 60  ? styles.balanceMid
    : styles.balanceHigh
  const balanceLabel = nBalance?.balance == null ? ''
    : nBalance.balance < -10  ? 'N deficit — possible soil mining'
    : nBalance.balance <= 20  ? 'Balanced'
    : nBalance.balance <= 60  ? 'Moderate N surplus'
    : 'High N surplus — leaching risk'
  const nueMining = nue != null && nue > 90
  const nueClass = nue == null
    ? ''
    : nue < 50  ? styles.nueLow
    : nue < 70  ? styles.nueMid
    : nue <= 90 ? styles.nueHigh
    : styles.nueMining

  // Field context
  const cropDisplay  = run?.runMetadata?.subCategory ?? run?.inputData?.cropDetails?.cropType
  const areaHa       = run?.inputData?.cropDetails?.area?.value
  const yieldRaw     = run?.inputData?.cropDetails?.farmGate?.value ?? run?.inputData?.cropDetails?.cropYield?.value
  const yieldRawUnit = (run?.inputData?.cropDetails?.farmGate?.unit ?? run?.inputData?.cropDetails?.cropYield?.unit ?? '').toLowerCase()
  const totalYieldT  = yieldRaw != null ? (yieldRawUnit.includes('tonne') ? yieldRaw : yieldRaw / 1000) : null
  const yieldPerHaT  = totalYieldT != null && areaHa ? totalYieldT / areaHa : null

  // Emission intensity
  const netBalance      = summary?.assessmentYear?.CO2eq?.balance
  const balancePerHa    = areaHa && netBalance != null ? netBalance / areaHa : null
  const balancePerTonne = totalYieldT && totalYieldT > 0 && netBalance != null ? netBalance / totalYieldT : null
  const emissionRating  = getEmissionRating(balancePerTonne, nueCalc?.cropKey)

  return (
    <div className={styles.page}>
      <Link to="/assessments" className={styles.back}>
        ← Assessments
      </Link>

      <div className={styles.topRow}>
        <h1 className={styles.title}>{assessment.name}</h1>
        <div className={styles.meta}>
          <Badge variant={assessment.status === 'Submitted' ? 'success' : 'warning'}>
            {assessment.status ?? 'Unknown'}
          </Badge>
          <Badge variant="info">{assessment.pathway}</Badge>
          {assessment.farm && (
            <span className={styles.farmLabel}>🏡 {assessment.farm.name}</span>
          )}
        </div>
      </div>

      {/* Field context strip */}
      {(cropDisplay || areaHa || yieldPerHaT || assessment.farm?.country) && (
        <div className={styles.fieldBar}>
          {cropDisplay && (
            <span className={styles.fieldChip}>
              <span className={styles.fieldChipIcon}>{getCropEmoji(cropDisplay)}</span>
              <span className={styles.fieldChipText}>{cropDisplay}</span>
            </span>
          )}
          {areaHa && (
            <span className={styles.fieldChip}>
              <span className={styles.fieldChipIcon}>📐</span>
              <span className={styles.fieldChipText}>{areaHa % 1 < 0.05 ? Math.round(areaHa) : areaHa.toFixed(1)} ha field</span>
            </span>
          )}
          {yieldPerHaT && (
            <span className={styles.fieldChip}>
              <span className={styles.fieldChipIcon}>📦</span>
              <span className={styles.fieldChipText}>{yieldPerHaT.toFixed(1)} t / ha yield</span>
            </span>
          )}
          {assessment.farm?.country && (
            <span className={styles.fieldChip}>
              <span className={styles.fieldChipIcon}>📍</span>
              <span className={styles.fieldChipText}>{assessment.farm.country}</span>
            </span>
          )}
        </div>
      )}

      {summary && (
        <div className={styles.summaryRow}>
          <Card className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Emissions</p>
            <p className={styles.summaryValue}>
              {fmt(summary.assessmentYear?.CO2eq?.emissions)}
              <span className={styles.unit}> kg CO₂eq</span>
            </p>
            <p className={styles.summaryHint}>N₂O, CO₂ &amp; CH₄ released</p>
          </Card>
          <Card className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Removals</p>
            <p className={styles.summaryValue}>
              {fmt(summary.assessmentYear?.CO2eq?.removals)}
              <span className={styles.unit}> kg CO₂eq</span>
            </p>
            <p className={styles.summaryHint}>carbon sequestered in soil</p>
          </Card>
          <Card className={`${styles.summaryCard} ${styles.balanceCard}`}>
            <p className={styles.summaryLabel}>Net Balance</p>
            <p className={styles.summaryValue}>
              {fmt(summary.assessmentYear?.CO2eq?.balance)}
              <span className={styles.unit}> kg CO₂eq</span>
            </p>
            <p className={styles.summaryHint}>emissions minus removals</p>
          </Card>
        </div>
      )}

      {/* Emission intensity card */}
      {(balancePerHa != null || balancePerTonne != null) && (
        <Card>
          <h2 className={styles.sectionTitle}>Emission Intensity</h2>
          <p className={styles.sectionDesc}>
            Total emissions divided by field area and crop yield — these per-unit figures make it
            possible to compare across different farm sizes and benchmark against typical values.
          </p>

          <div className={styles.intensityStats}>
            {balancePerHa != null && (
              <div className={styles.intensityStat}>
                <span className={styles.intensityValue}>{fmtInt(balancePerHa)}</span>
                <span className={styles.intensityUnit}>kg CO₂eq / ha</span>
                <span className={styles.intensityLabel}>per hectare</span>
              </div>
            )}
            {balancePerTonne != null && (
              <div className={styles.intensityStat}>
                <span className={styles.intensityValue}>{fmtInt(balancePerTonne)}</span>
                <span className={styles.intensityUnit}>kg CO₂eq / tonne</span>
                <span className={styles.intensityLabel}>per tonne of crop</span>
              </div>
            )}
            {emissionRating && (
              <div className={styles.intensityRating} style={{ background: emissionRating.bg }}>
                <p className={styles.intensityRatingLabel} style={{ color: emissionRating.color }}>
                  {emissionRating.label}
                </p>
                <p className={styles.intensityRatingDesc}>{emissionRating.desc}</p>
              </div>
            )}
          </div>

          {/* Visual benchmark scale */}
          {emissionRating?.bench && balancePerTonne != null && (
            <div className={styles.benchScale}>
              <p className={styles.benchScaleTitle}>How does this compare?</p>
              <div className={styles.benchBar}>
                <div className={styles.benchBarFill} />
                {(() => {
                  const { good, poor } = emissionRating.bench
                  const max = poor * 1.6
                  const pct = Math.min(100, Math.max(0, (balancePerTonne / max) * 100))
                  const goodPct = (good / max) * 100
                  const poorPct = (poor / max) * 100
                  return (
                    <>
                      <div className={styles.benchMarkerGood} style={{ left: `${goodPct}%` }} />
                      <div className={styles.benchMarkerPoor} style={{ left: `${poorPct}%` }} />
                      <div className={styles.benchMarker} style={{ left: `${pct}%` }}>
                        <div className={styles.benchMarkerDot} style={{ borderColor: emissionRating.color }} />
                        <div className={styles.benchMarkerVal} style={{ color: emissionRating.color }}>
                          {fmtInt(balancePerTonne)} kg/t
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
              <div className={styles.benchLabels}>
                <span>0</span>
                <span style={{ left: `${(emissionRating.bench.good / (emissionRating.bench.poor * 1.6)) * 100}%`, position: 'absolute' }}>
                  {emissionRating.bench.good.toLocaleString()} — typical low
                </span>
                <span style={{ left: `${(emissionRating.bench.poor / (emissionRating.bench.poor * 1.6)) * 100}%`, position: 'absolute' }}>
                  {emissionRating.bench.poor.toLocaleString()} — typical high
                </span>
              </div>
              <p className={styles.benchNote}>
                Indicative farm-gate benchmarks for {cropDisplay ?? 'this crop'} (kg CO₂eq per tonne).
                Source: Poore &amp; Nemecek 2018.
              </p>
            </div>
          )}
          {emissionRating?.tier === -1 && (
            <p className={styles.sinkNote}>
              🌱 Net carbon sink: removals exceed emissions for this assessment year.
            </p>
          )}
        </Card>
      )}

      {nueCalc && (
        <Card className={styles.nueCard}>
          <h2 className={styles.sectionTitle}>Nitrogen Use Efficiency</h2>
          <div className={styles.nueRow}>
            <div className={styles.nueMetric}>
              <span className={`${styles.nueValue} ${nueClass}`}>
                {nue != null ? `${nue.toFixed(1)}%` : '—'}
              </span>
              <span className={styles.nueLabel}>NUE</span>
              {nueMining && (
                <span className={styles.nueNote}>soil N mining risk</span>
              )}
            </div>
            <div className={styles.nueStat}>
              <span className={styles.nueStatValue}>{fmtN(nueCalc.nAppliedPerHa)}</span>
              <span className={styles.nueStatLabel}>kg N / ha applied</span>
            </div>
            {nueCalc.nRemovedPerHa != null && (
              <div className={styles.nueStat}>
                <span className={styles.nueStatValue}>{fmtN(nueCalc.nRemovedPerHa)}</span>
                <span className={styles.nueStatLabel}>kg N / ha removed (est.)</span>
              </div>
            )}
          </div>
          {!nueCalc.cropKey && (
            <div className={styles.nueManualRow}>
              <label className={styles.nueManualLabel} htmlFor="crop-n-pct">
                {nueCalc.cropType
                  ? <><strong>"{nueCalc.cropType}"</strong> not in lookup table —</>
                  : 'Unknown crop —'
                }
                {' '}enter N content to estimate NUE:
              </label>
              <div className={styles.nueManualField}>
                <input
                  id="crop-n-pct"
                  type="number"
                  min="0.1"
                  max="15"
                  step="0.1"
                  placeholder="e.g. 2.0"
                  value={manualCropNPct ?? ''}
                  onChange={e => setManualCropNPct(e.target.value ? parseFloat(e.target.value) : null)}
                />
                <span>% N in harvested dry matter</span>
              </div>
            </div>
          )}

          <p className={styles.nueDesc}>
            NUE = N removed in harvest ÷ N applied (synthetic fertilisers only). Optimal range: 70–80%. Below 50% = N surplus risk. Above 90% = soil N mining risk.
            {nueCalc.cropKey
              ? ` Crop N content for ${nueCalc.cropKey}: ${(CROP_N_CONTENT[nueCalc.cropKey] * 100).toFixed(1)}% N (IPCC 2006 Table 11.2).`
              : nueCalc.usingManual
              ? ` Using manually entered crop N content of ${manualCropNPct.toFixed(1)}%.`
              : ''}
            {nueMining && ' NUE > 90% indicates the crop may be drawing on soil N reserves beyond applied fertiliser.'}
          </p>

          {farmCountry && (ctryNueQ.isLoading || latestCtryNUE) && (
            <div className={styles.nueBenchmark}>
              {ctryNueQ.isLoading ? (
                <span className={styles.nueBenchmarkLoading}>Loading national NUE…</span>
              ) : (
                <>
                  <span className={styles.nueBenchmarkLabel}>National cropland NUE</span>
                  <span className={styles.nueBenchmarkValue}>{latestCtryNUE.value.toFixed(1)}%</span>
                  <span className={styles.nueBenchmarkCountry}>{ctryMatch.label}, {latestCtryNUE.year} · FAOSTAT ESB</span>
                  <span className={styles.nueBenchmarkNote}>Full N budget (fertiliser + manure + deposition + fixation) — broader than farm calc above</span>
                </>
              )}
            </div>
          )}
        </Card>
      )}

      {nueCalc && nue != null && (
        <Card>
          <h2 className={styles.sectionTitle}>NUE Sweetspot</h2>
          <p className={styles.sectionDesc}>
            Optimal NUE range for this crop and climate. Below the sweetspot: N losses exceed uptake.
            Above: crop draws on soil N reserves (mining). Range adjusted for IPCC climate zone.
          </p>
          <NueSweetspotGauge
            nue={nue}
            cropKey={nueCalc.cropKey}
            cropLabel={nueCalc.cropKey}
            climate={assessment.farm?.climate}
          />
        </Card>
      )}

      {nueWarnings.length > 0 && (
        <div className={styles.nueWarnings}>
          {nueWarnings.map((w, i) => (
            <div key={i} className={styles.nueAlert}>
              <Badge variant="n2o">NUE</Badge>
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}

      {nBalance && (
        <Card>
          <h2 className={styles.sectionTitle}>Farm-gate N Balance</h2>
          <p className={styles.sectionDesc}>
            N inputs minus N removed in harvest (kg N/ha). A positive balance is a surplus — potential leaching or N₂O risk. Negative is a deficit — possible soil N mining.
          </p>

          <div className={styles.nBalanceGrid}>
            <div className={styles.nBalanceCol}>
              <h3 className={styles.nBalanceColTitle}>Inputs (kg N/ha)</h3>
              <div className={styles.nBalanceRow}>
                <span>Synthetic fertiliser</span>
                <span>{fmtN(nBalance.synthetic)}</span>
              </div>
              <div className={styles.nBalanceRow}>
                <span>Biological N fixation{nBalance.bnf > 0 ? ` (${nueCalc.cropKey})` : ''}</span>
                <span>{nBalance.bnf > 0 ? fmtN(nBalance.bnf) : <span className={styles.nBalanceMuted}>0 (non-legume)</span>}</span>
              </div>
              <div className={styles.nBalanceRow}>
                <span>
                  Atmospheric deposition
                  {nBalance.dep != null && latestDep && (
                    <span className={styles.nBalanceMuted}> · FAOSTAT {latestDep.year}</span>
                  )}
                </span>
                <span>
                  {nBalance.dep != null
                    ? fmtN(nBalance.dep)
                    : <span className={styles.nBalanceMuted}>loading…</span>}
                </span>
              </div>
              <div className={`${styles.nBalanceRow} ${styles.nBalanceTotal}`}>
                <span>Total inputs</span>
                <span>{fmtN(nBalance.totalInputs)}</span>
              </div>
            </div>

            <div className={styles.nBalanceCol}>
              <h3 className={styles.nBalanceColTitle}>Outputs (kg N/ha)</h3>
              <div className={styles.nBalanceRow}>
                <span>N removed in harvest</span>
                <span>{nBalance.nRemoved != null ? fmtN(nBalance.nRemoved) : <span className={styles.nBalanceMuted}>—</span>}</span>
              </div>
              <div className={`${styles.nBalanceRow} ${styles.nBalanceTotal}`}>
                <span>Total outputs</span>
                <span>{nBalance.nRemoved != null ? fmtN(nBalance.nRemoved) : '—'}</span>
              </div>
            </div>
          </div>

          {nBalance.balance != null && (
            <div className={`${styles.nBalanceResult} ${balanceClass}`}>
              <span className={styles.nBalanceResultValue}>
                {nBalance.balance >= 0 ? '+' : ''}{fmtN(nBalance.balance)} kg N/ha
              </span>
              <span className={styles.nBalanceResultLabel}>{balanceLabel}</span>
            </div>
          )}

          {nBalance.balance == null && (
            <p className={styles.nBalanceMuted} style={{ marginTop: '0.5rem' }}>
              Add crop N content above to complete the balance calculation.
            </p>
          )}
        </Card>
      )}

      <Card>
        <h2 className={styles.sectionTitle}>N₂O Emissions by FLAG Category</h2>
        <p className={styles.sectionDesc}>
          N₂O is the primary nitrogen-related GHG. Rows highlighted in purple are
          nitrogen-relevant FLAG categories — lower N₂O per unit of output indicates
          better NUE.
        </p>

        {flagData.length === 0 ? (
          <EmptyState
            icon="📉"
            title="No FLAG results available"
            description="Results appear once the assessment has a submitted run. Each row will show N₂O, CO₂, CH₄, and CO₂eq per FLAG category."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>FLAG Category</th>
                  <th>N₂O (kg)</th>
                  <th>CO₂ (kg)</th>
                  <th>CH₄ (kg)</th>
                  <th>CO₂eq (kg)</th>
                  <th>NUE relevance</th>
                </tr>
              </thead>
              <tbody>
                {flagData.map((row, i) => (
                  <tr
                    key={i}
                    className={isNitrogenRelated(row.flagCategory) ? styles.flagNRow : ''}
                  >
                    <td className={styles.flagCategory}>{row.flagCategory}</td>
                    <td className={styles.n2o}>{fmt(row.N2O)}</td>
                    <td>{fmt(row.CO2)}</td>
                    <td>{fmt(row.CH4)}</td>
                    <td>{fmt(row.CO2eq)}</td>
                    <td>
                      {isNitrogenRelated(row.flagCategory) ? (
                        <Badge variant="n2o">N-related</Badge>
                      ) : (
                        <span className={styles.dash}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {run?.inputData && (
        <Card>
          <h2 className={styles.sectionTitle}>Input Data</h2>
          <pre className={styles.json}>
            {JSON.stringify(run.inputData, null, 2)}
          </pre>
        </Card>
      )}

      <div className={styles.chatbotBanner}>
        <div className={styles.chatbotIcon}>🤖</div>
        <div className={styles.chatbotBody}>
          <p className={styles.chatbotTitle}>Need help interpreting these results?</p>
          <p className={styles.chatbotDesc}>
            The Cool Farm Nitrogen Navigator is an AI assistant trained on the Cool Farm
            methodology, FAOSTAT data, and NUE research literature. Ask it to explain your
            NUE score, what your N balance means in practice, or how to reduce emissions
            per tonne of output.
          </p>
        </div>
        <a
          href="https://chatgpt.com/g/g-6a3500247c2081919f67bd93bcae4888-cool-farm-nitrogen-navigator"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.chatbotBtn}
        >
          Open Chatbot →
        </a>
      </div>
    </div>
  )
}
