import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

const dataLinks = [
  { to: '/farms', label: 'Farms' },
  { to: '/assessments', label: 'Assessments' },
  { to: '/global-n', label: 'Global N' },
  { to: '/soil', label: 'Soil Lookup' },
]

const projectLinks = [
  { to: '/', label: 'About', end: true },
  { to: '/value-proposition', label: 'WIn Win narrative' },
  { to: '/logic-model', label: 'Logic Model' },
  { to: '/foundation', label: 'Foundation' },
  { to: '/roadmap', label: 'Roadmap' },
]

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <span className={styles.brand}>Cool Farm Platform NUE Explorer</span>
        <ul className={styles.links}>
          {projectLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${styles.link}${isActive ? ` ${styles.active}` : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className={styles.divider} aria-hidden="true" />
          {dataLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `${styles.link}${isActive ? ` ${styles.active}` : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className={styles.divider} aria-hidden="true" />
          <li>
            <a href="/mockup.html" className={styles.link} target="_blank" rel="noopener noreferrer">
              Mockup ↗
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
