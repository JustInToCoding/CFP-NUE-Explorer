import styles from './Badge.module.css'

const variantMap = {
  default: styles.default,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
  n2o: styles.n2o,
}

export default function Badge({ children, variant = 'default' }) {
  return (
    <span className={`${styles.badge} ${variantMap[variant] ?? styles.default}`}>
      {children}
    </span>
  )
}
