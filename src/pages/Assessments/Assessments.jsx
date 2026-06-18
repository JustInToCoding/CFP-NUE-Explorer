import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAssessments } from '../../hooks/useAssessments'
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

export default function Assessments() {
  const [pathway, setPathway] = useState('All')
  const params = pathway !== 'All' ? { pathway } : {}
  const { data, isLoading, isError, error, refetch } = useAssessments(params)

  const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Assessments</h1>
          <p className={styles.subtitle}>
            GHG assessments — click any row to view N2O emissions by FLAG category
          </p>
        </div>
      </div>

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
            description="Assessments will appear here once the /assessments endpoint is available. Each assessment run contains N2O emissions per FLAG category."
          />
        </Card>
      )}

      {!isLoading && !isError && list.length > 0 && (
        <Card className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Pathway</th>
                <th>Status</th>
                <th>Farm</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id}>
                  <td className={styles.name}>{a.name}</td>
                  <td>
                    <Badge variant="info">{a.pathway}</Badge>
                  </td>
                  <td>
                    <Badge variant={STATUS_VARIANTS[a.status] ?? 'default'}>
                      {a.status ?? '—'}
                    </Badge>
                  </td>
                  <td>{a.farm?.name ?? '—'}</td>
                  <td className={styles.date}>
                    {a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <Link to={`/assessments/${a.id}`} className={styles.viewLink}>
                      View NUE data →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
