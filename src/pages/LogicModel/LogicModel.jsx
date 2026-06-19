import styles from './LogicModel.module.css'

export default function LogicModel() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.tag}>Logic Model</span>
        <h1 className={styles.title}>Our Theory of Change</h1>
        <p className={styles.subtitle}>
          The causal chain connecting tool access to measurable sustainability outcomes
          across farming and supply-chain operations.
        </p>
      </header>

      <div className={styles.chain}>
        <div className={`${styles.step} ${styles.stepIf}`}>
          <span className={styles.stepLabel}>If</span>
          <p className={styles.stepText}>
            farmers and crop processors can access clear NUE scores, nutrient balance
            visualisations, and scenario planning tools,
          </p>
        </div>
        <div className={styles.arrow}>→</div>
        <div className={`${styles.step} ${styles.stepThen}`}>
          <span className={styles.stepLabel}>Then</span>
          <p className={styles.stepText}>
            they can identify nutrient inefficiencies, compare management options, and adopt
            better nutrient management practices,
          </p>
        </div>
        <div className={styles.arrow}>→</div>
        <div className={`${styles.step} ${styles.stepLeading}`}>
          <span className={styles.stepLabel}>Leading to</span>
          <p className={styles.stepText}>
            improved NUE, reduced nitrogen losses, lower GHG emissions, and more profitable
            and sustainable agricultural supply chains.
          </p>
        </div>
      </div>

      <div className={styles.supportingGrid}>
        <div className={styles.supportCard}>
          <h2 className={styles.supportTitle}>Making NUE Visible</h2>
          <p className={styles.supportText}>
            Making NUE visible and understandable through AI-assisted explanations,
            benchmarking, and visualizations will help users identify nutrient inefficiencies
            and improvement opportunities.
          </p>
        </div>
        <div className={styles.supportCard}>
          <h2 className={styles.supportTitle}>Connecting to Business Outcomes</h2>
          <p className={styles.supportText}>
            Connecting NUE performance to GHG emissions and business outcomes will increase
            motivation among farmers, processors, and sustainability teams to adopt improved
            nutrient management practices.
          </p>
        </div>
      </div>
    </div>
  )
}
