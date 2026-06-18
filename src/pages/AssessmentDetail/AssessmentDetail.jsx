import { useParams, Link } from 'react-router-dom'
import { useAssessment } from '../../hooks/useAssessments'
import Card from '../../components/Card/Card'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import Badge from '../../components/Badge/Badge'
import EmptyState from '../../components/EmptyState/EmptyState'
import styles from './AssessmentDetail.module.css'

const fmt = (n) => (n != null ? Number(n).toFixed(3) : '—')

const isNitrogenRelated = (category) =>
  category?.includes('Non-land') || category?.includes('Land management')

export default function AssessmentDetail() {
  const { id } = useParams()
  const { data: assessment, isLoading, isError, error } = useAssessment(id)

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
    run?.resultDisaggregated?.resultsByFlag ??
    run?.resultAggregations?.byFlag ??
    []

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

      {summary && (
        <div className={styles.summaryRow}>
          <Card className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Emissions</p>
            <p className={styles.summaryValue}>
              {fmt(summary.assessmentYear?.CO2eq?.emissions)}
              <span className={styles.unit}> kg CO₂eq</span>
            </p>
          </Card>
          <Card className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Removals</p>
            <p className={styles.summaryValue}>
              {fmt(summary.assessmentYear?.CO2eq?.removals)}
              <span className={styles.unit}> kg CO₂eq</span>
            </p>
          </Card>
          <Card className={`${styles.summaryCard} ${styles.balanceCard}`}>
            <p className={styles.summaryLabel}>Net Balance</p>
            <p className={styles.summaryValue}>
              {fmt(summary.assessmentYear?.CO2eq?.balance)}
              <span className={styles.unit}> kg CO₂eq</span>
            </p>
          </Card>
        </div>
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
                    className={isNitrogenRelated(row.flagCategory) ? styles.nueRow : ''}
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
    </div>
  )
}
