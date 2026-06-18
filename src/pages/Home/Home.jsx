import { Link } from 'react-router-dom'
import Card from '../../components/Card/Card'
import styles from './Home.module.css'

const features = [
  {
    to: '/soil',
    icon: '🌍',
    title: 'Soil Lookup',
    desc: 'Identify IPCC and WRB soil classes for any coordinate — used as N2O emission factors in assessments.',
    accent: styles.accentGreen,
  },
  {
    to: '/farms',
    icon: '🏡',
    title: 'Farms',
    desc: 'Browse and register farms with location, climate zone, and temperature data.',
    accent: styles.accentTeal,
  },
  {
    to: '/assessments',
    icon: '📊',
    title: 'Assessments',
    desc: 'View GHG assessments with N2O emissions by FLAG category — the core NUE signal.',
    accent: styles.accentPurple,
  },
]

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cool Farm Platform</h1>
        <p className={styles.subtitle}>
          Explore NUE-related data: nitrogen emissions, soil characteristics, and GHG results
          across farm assessments.
        </p>
      </header>

      <section className={styles.grid}>
        {features.map(({ to, icon, title, desc, accent }) => (
          <Link key={to} to={to} className={styles.featureLink}>
            <Card className={`${styles.featureCard} ${accent}`}>
              <span className={styles.featureIcon}>{icon}</span>
              <h2 className={styles.featureTitle}>{title}</h2>
              <p className={styles.featureDesc}>{desc}</p>
              <span className={styles.arrow}>Go →</span>
            </Card>
          </Link>
        ))}
      </section>

      <Card className={styles.infoCard}>
        <h3 className={styles.infoTitle}>NUE in the CFP Context</h3>
        <p className={styles.infoText}>
          Nitrogen Use Efficiency (NUE) is not a single field in the CFP API — it is derived
          from N2O emissions per FLAG category, fertilizer inputs, and soil nitrogen dynamics.
          Lower N2O per unit of crop output signals better NUE.
        </p>
        <ul className={styles.infoList}>
          <li>N2O emissions — direct and indirect nitrogen losses tracked per FLAG category</li>
          <li>FLAG categories — separates on-farm nitrogen from inputs &amp; dispatches</li>
          <li>IPCC soil class — controls the N2O emission factor applied to a given field</li>
        </ul>
      </Card>
    </div>
  )
}
