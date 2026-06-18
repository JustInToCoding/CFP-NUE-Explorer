import { useState } from 'react'
import { useSoilCharacteristic } from '../../hooks/useSoil'
import Card from '../../components/Card/Card'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import Badge from '../../components/Badge/Badge'
import styles from './SoilLookup.module.css'

const EXAMPLES = [
  { label: 'Netherlands', lat: 52.37, lng: 4.9 },
  { label: 'Iowa, USA', lat: 42.0, lng: -93.5 },
  { label: 'Sao Paulo', lat: -23.5, lng: -46.6 },
  { label: 'Punjab, India', lat: 30.7, lng: 76.7 },
]

export default function SoilLookup() {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const { mutate, data, isPending, error, reset } = useSoilCharacteristic()

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate({ latitude: parseFloat(lat), longitude: parseFloat(lng) })
  }

  const applyExample = (example) => {
    setLat(String(example.lat))
    setLng(String(example.lng))
    reset()
  }

  const isRateLimit = data?.type === 'SoilGridsRateLimitHit'
  const result = data && !isRateLimit ? data : null

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Soil Characteristic Lookup</h1>
      <p className={styles.subtitle}>
        Retrieve IPCC and WRB soil classifications for a given coordinate. The IPCC soil class
        determines which N2O emission factor is applied to that field in CFP assessments.
      </p>

      <div className={styles.layout}>
        <Card className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Coordinates</h2>

          <div className={styles.examples}>
            <span className={styles.examplesLabel}>Quick examples:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                className={styles.exampleBtn}
                onClick={() => applyExample(ex)}
              >
                {ex.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lat">
                Latitude
                <span className={styles.range}>-90 to 90</span>
              </label>
              <input
                id="lat"
                className={styles.input}
                type="number"
                step="any"
                min="-90"
                max="90"
                required
                placeholder="e.g. 52.37"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="lng">
                Longitude
                <span className={styles.range}>-180 to 180</span>
              </label>
              <input
                id="lng"
                className={styles.input}
                type="number"
                step="any"
                min="-180"
                max="180"
                required
                placeholder="e.g. 4.9"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submit} disabled={isPending}>
              {isPending ? 'Looking up...' : 'Get Soil Data'}
            </button>
          </form>

          {error && (
            <div className={styles.error}>
              <span>⚠</span> {error.message}
            </div>
          )}
        </Card>

        <div className={styles.results}>
          {isPending && <LoadingSpinner label="Fetching soil data..." />}

          {isRateLimit && (
            <Card className={styles.rateLimitCard}>
              <span className={styles.rateLimitIcon}>⏱</span>
              <h3>SoilGrids Rate Limit Reached</h3>
              <p>The upstream SoilGrids service is temporarily rate-limited. Please try again shortly.</p>
            </Card>
          )}

          {result && (
            <div className={styles.resultCards}>
              <Card className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <span className={styles.resultIcon}>🌱</span>
                  <div>
                    <h3 className={styles.resultLabel}>IPCC Soil Class</h3>
                    <p className={styles.resultCaption}>Determines N2O emission factor</p>
                  </div>
                </div>
                <div className={styles.resultValue}>{result.ipccSoilClass ?? '—'}</div>
                <Badge variant="n2o">N2O EF relevant</Badge>
              </Card>

              <Card className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <span className={styles.resultIcon}>🔬</span>
                  <div>
                    <h3 className={styles.resultLabel}>WRB Soil Class</h3>
                    <p className={styles.resultCaption}>World Reference Base classification</p>
                  </div>
                </div>
                <div className={styles.resultValue}>{result.wrbSoilClass ?? '—'}</div>
                <Badge variant="info">WRB 2022</Badge>
              </Card>

              <Card className={styles.coordCard}>
                <h4 className={styles.coordTitle}>Queried location</h4>
                <div className={styles.coordGrid}>
                  <span className={styles.coordLabel}>Latitude</span>
                  <span className={styles.coordValue}>{lat}°</span>
                  <span className={styles.coordLabel}>Longitude</span>
                  <span className={styles.coordValue}>{lng}°</span>
                </div>
              </Card>
            </div>
          )}

          {!isPending && !result && !isRateLimit && !error && (
            <Card className={styles.placeholder}>
              <p>Enter coordinates on the left to retrieve soil characteristics.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
