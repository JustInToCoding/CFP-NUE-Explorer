import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/soil', label: 'Soil Lookup' },
  { to: '/farms', label: 'Farms' },
  { to: '/assessments', label: 'Assessments' },
  { to: '/global-n', label: 'Global N' },
]

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <span className={styles.brand}>CFP NUE Explorer</span>
        <ul className={styles.links}>
          {links.map(({ to, label, end }) => (
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
        </ul>
      </div>
    </nav>
  )
}
