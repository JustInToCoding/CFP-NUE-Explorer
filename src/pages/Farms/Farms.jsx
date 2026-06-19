import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFarms, useCreateFarm } from '../../hooks/useFarms'
import { useFarmSoil } from '../../hooks/useSoil'
import Card from '../../components/Card/Card'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import EmptyState from '../../components/EmptyState/EmptyState'
import Badge from '../../components/Badge/Badge'
import styles from './Farms.module.css'

const CLIMATE_ZONES = [
  'Tropical Montane', 'Tropical Wet', 'Tropical Moist', 'Tropical Dry',
  'Warm Temperate Moist', 'Warm Temperate Dry', 'Cool Temperate Moist',
  'Cool Temperate Dry', 'Boreal Moist', 'Boreal Dry',
]

const EMPTY_FORM = {
  name: '',
  country: 'Netherlands (Kingdom of the)',
  latitude: '',
  longitude: '',
  climate: 'Cool Temperate Moist',
  annualAverageTemperature: { value: 10, unit: '°C' },
}

function FarmRow({ farm }) {
  const { data, isLoading } = useFarmSoil(farm)
  const navigate = useNavigate()
  return (
    <tr
      className={styles.clickableRow}
      onClick={() => navigate(`/assessments?farmId=${farm.id}`)}
      title="View assessments for this farm"
    >
      <td className={styles.farmName}>{farm.name}</td>
      <td>{farm.country}</td>
      <td><Badge variant="info">{farm.climate}</Badge></td>
      <td className={styles.coords}>
        {farm.latitude?.toFixed(2)}°, {farm.longitude?.toFixed(2)}°
      </td>
      <td>{farm.annualAverageTemperature?.value} {farm.annualAverageTemperature?.unit}</td>
      <td className={styles.soilCell}>
        {isLoading
          ? <span className={styles.soilLoading}>…</span>
          : data?.ipccSoilClass
          ? <Badge variant="n2o">{data.ipccSoilClass}</Badge>
          : '—'}
      </td>
      <td className={styles.soilCell}>
        {isLoading
          ? <span className={styles.soilLoading}>…</span>
          : data?.wrbSoilClass ?? '—'}
      </td>
    </tr>
  )
}

export default function Farms() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data, isLoading, isError, error, refetch } = useFarms()
  const createFarm = useCreateFarm()

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createFarm.mutateAsync({
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const farmList = Array.isArray(data) ? data : data?.farms ?? data?.data ?? data?.items ?? []

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Farms</h1>
          <p className={styles.subtitle}>Registered farms and their environmental context</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New Farm'}
        </button>
      </div>

      {showForm && (
        <Card>
          <h2 className={styles.formTitle}>Register Farm</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Farm Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="e.g. Green Acres"
                />
              </div>
              <div className={styles.field}>
                <label>Country *</label>
                <input
                  required
                  value={form.country}
                  onChange={(e) => setField('country', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Latitude *</label>
                <input
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  required
                  value={form.latitude}
                  onChange={(e) => setField('latitude', e.target.value)}
                  placeholder="52.0"
                />
              </div>
              <div className={styles.field}>
                <label>Longitude *</label>
                <input
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  required
                  value={form.longitude}
                  onChange={(e) => setField('longitude', e.target.value)}
                  placeholder="5.3"
                />
              </div>
              <div className={styles.field}>
                <label>Climate Zone *</label>
                <select
                  value={form.climate}
                  onChange={(e) => setField('climate', e.target.value)}
                >
                  {CLIMATE_ZONES.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Avg. Temperature (°C) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={form.annualAverageTemperature.value}
                  onChange={(e) =>
                    setField('annualAverageTemperature', {
                      value: parseFloat(e.target.value),
                      unit: '°C',
                    })
                  }
                  placeholder="10"
                />
              </div>
            </div>
            {createFarm.isError && <ErrorBanner message={createFarm.error?.message} />}
            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={createFarm.isPending}
              >
                {createFarm.isPending ? 'Saving...' : 'Save Farm'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {isLoading && <LoadingSpinner label="Loading farms..." />}
      {isError && <ErrorBanner message={error?.message} onRetry={refetch} />}

      {!isLoading && !isError && farmList.length === 0 && (
        <Card>
          <EmptyState
            icon="🏡"
            title="No farms yet"
            description="Register a farm above to get started. Farm location and climate zone determine the N2O emission factors used in assessments."
            action={
              <button className={styles.primaryBtn} onClick={() => setShowForm(true)}>
                + New Farm
              </button>
            }
          />
        </Card>
      )}

      {!isLoading && !isError && farmList.length > 0 && (
        <Card className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Climate</th>
                  <th>Coordinates</th>
                  <th>Avg Temp</th>
                  <th>IPCC Soil Class</th>
                  <th>WRB Soil Class</th>
                </tr>
              </thead>
              <tbody>
                {farmList.map((farm) => (
                  <FarmRow key={farm.id} farm={farm} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
