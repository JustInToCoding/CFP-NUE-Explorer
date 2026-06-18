import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.root}>
      <NavBar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
