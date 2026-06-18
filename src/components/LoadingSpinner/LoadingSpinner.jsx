import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} role="status" aria-label={label} />
      <p className={styles.label}>{label}</p>
    </div>
  )
}
