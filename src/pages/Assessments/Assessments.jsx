import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAssessments } from '../../hooks/useAssessments'
import { useFarm } from '../../hooks/useFarms'
import Card from '../../components/Card/Card'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import EmptyState from '../../components/EmptyState/EmptyState'
import Badge from '../../components/Badge/Badge'
import styles from './Assessments.module.css'

const PATHWAYS = [
  'All', 'Annuals v3', 'Perennials v3', 'Perennials v2',
  'Paddy Rice v3', 'Beef v3', 'Dairy v3', 'Potatoes v3', 'Example v1',
]

const STATUS_VARIANTS = {
  'Submitted': 'success',
  'In progress': 'warning',
  'Not started': 'default',
  'Edit in progress': 'info',
}

const fmtBalance = (n) => {
  if (n == null) return '—'
  const abs = Math.abs(n)
  const sign = n < 0 ? '−' : '+'
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)} Mt`
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)} kt`
  return `${sign}${abs.toFixed(0)}`
}

const getActiveRun = (a) => a.submittedRun ?? a.draftRun

// Best-effort N balance from list data — only works when the API includes inputData in the list response
const quickNBalance = (run) => {
  if (!run?.inputData) return null
  const fertilisers = run.inputData.fertiliser?.fertilisers ?? []
  const area = run.inputData.cropDetails?.area?.value
  if (!area || !fertilisers.length) return null
  let nApplied = 0
  for (const f of fertilisers) {
    const nPct = f.nitrogenPercentage ?? parseFloat(f.predefinedFertiliserType?.match(/(\d+\.?\d*)\s*%\s*N/i)?.[1])
    if (!nPct) continue
    if (f.predefinedApplicationRate != null) {
      const rate = f.predefinedApplicationRate.value ?? 0
      nApplied += f.predefinedFertiliserApplicationRateBasis === 'nitrogen' ? rate : rate * nPct / 100
    } else if (f.amount != null) {
      nApplied += (f.amount.value / area) * nPct / 100
    }
  }
  return nApplied > 0 ? nApplied : null
}

export default function Assessments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const farmId = searchParams.get('farmId') || null

  const [pathway, setPathway] = useState('All')
  const apiParams = {
    ...(pathway !== 'All' ? { pathway } : {}),
    ...(farmId ? { farmId } : {}),
  }
  const { data, isLoading, isError, error, refetch } = useAssessments(apiParams)
  const farmQuery = useFarm(farmId)

  const allList = Array.isArray(data) ? data : data?.assessments ?? data?.data ?? data?.items ?? []
  // filter client-side as fallback (mock API ignores farmId param)
  const list = farmId
    ? allList.filter((a) => (a.farmId ?? a.farm?.id) === farmId)
    : allList
  const total = data?.totalAssessments

  const farmName = farmQuery.data?.name ?? list[0]?.farm?.name

  const clearFarmFilter = () =>
    setSearchParams((p) => { p.delete('farmId'); return p })

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Assessments</h1>
          <p className={styles.subtitle}>
            GHG assessments — click any row to view N₂O emissions by FLAG category
            {total != null && <span className={styles.total}> · {total} total</span>}
          </p>
        </div>
      </div>

      {farmId && (
        <div className={styles.farmChip}>
          <span>
            Farm: <strong>{farmName ?? '…'}</strong>
          </span>
          <button className={styles.farmChipClear} onClick={clearFarmFilter} aria-label="Clear farm filter">
            ×
          </button>
        </div>
      )}

      <div className={styles.filters}>
        {PATHWAYS.map((p) => (
          <button
            key={p}
            className={`${styles.filterBtn} ${pathway === p ? styles.filterActive : ''}`}
            onClick={() => setPathway(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner label="Loading assessments..." />}
      {isError && <ErrorBanner message={error?.message} onRetry={refetch} />}

      {!isLoading && !isError && list.length === 0 && (
        <Card>
          <EmptyState
            icon="📊"
            title="No assessments found"
            description="Assessments will appear here once the /assessments endpoint is available."
          />
        </Card>
      )}

      {!isLoading && !isError && list.length > 0 && (
        <Card className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Crop</th>
                <th>Pathway</th>
                <th>Status</th>
                <th>Farm</th>
                <th>Net CO₂eq</th>
                <th>N Applied</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => {
                const run = getActiveRun(a)
                const balance = run?.resultSummary?.assessmentYear?.CO2eq?.balance
                  ?? run?.resultSummary?.lifeCycle?.CO2eq?.balance
                const crop = run?.runMetadata?.subCategory
                const isPositive = balance != null && balance >= 0

                return (
                  <tr key={a.id}>
                    <td className={styles.name}>{a.name}</td>
                    <td className={styles.crop}>{crop ?? '—'}</td>
                    <td>
                      <Badge variant="info">{a.pathway}</Badge>
                    </td>
                    <td>
                      <Badge variant={STATUS_VARIANTS[a.status] ?? 'default'}>
                        {a.status ?? '—'}
                      </Badge>
                    </td>
                    <td>{a.farm?.name ?? '—'}</td>
                    <td className={isPositive ? styles.balancePos : styles.balanceNeg}>
                      {fmtBalance(balance)}
                      {balance != null && <span className={styles.unit}> kg CO₂eq</span>}
                    </td>
                    <td>
                      {(() => {
                        const nApp = quickNBalance(run)
                        if (nApp == null) return <span className={styles.date}>—</span>
                        return (
                          <span className={styles.nBal}>
                            {nApp.toFixed(1)}<span className={styles.unit}> kg/ha</span>
                          </span>
                        )
                      })()}
                    </td>
                    <td className={styles.date}>
                      {a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <Link to={`/assessments/${a.id}`} className={styles.viewLink}>
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
