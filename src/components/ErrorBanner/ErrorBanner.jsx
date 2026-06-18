import styles from './ErrorBanner.module.css'

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className={styles.banner} role="alert">
      <span className={styles.icon}>⚠</span>
      <p className={styles.message}>{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
