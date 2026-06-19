import Card from '../../components/Card/Card'
import styles from './ValueProposition.module.css'

const pillars = [
  {
    icon: '🎯',
    label: 'Goal',
    color: styles.pillarGreen,
    text: 'To develop a visual, user-friendly dashboard interface on the Cool Farm Platform that elevates existing agronomic models, enabling crop processors to benchmark farm-gate performance and directly quantify the impact of nitrogen use efficiency (NUE) optimisation on GHG emissions reduction.',
  },
  {
    icon: '🚀',
    label: 'Mission',
    color: styles.pillarTeal,
    text: 'To deliver the advanced visualization tools necessary for crop processors to make informed decisions, optimizing farm-gate nutrient use efficiency while clearly demonstrating and quantifying its direct impact on greenhouse gas (GHG) emissions reduction.',
  },
  {
    icon: '🔭',
    label: 'Vision',
    color: styles.pillarPurple,
    text: 'To lead the transition towards data-driven, sustainable agriculture by making complex nitrogen metrics clear, actionable and universally accessible for agri-processing organisations in crop farming worldwide.',
  },
]

export default function ValueProposition() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.tag}>Value Proposition</span>
        <h1 className={styles.title}>Goal, Mission &amp; Vision</h1>
        <p className={styles.subtitle}>
          The strategic intent behind the CFP NUE Explorer — from immediate product goal
          to long-term vision for sustainable agriculture.
        </p>
      </header>

      <div className={styles.pillarGrid}>
        {pillars.map(({ icon, label, color, text }) => (
          <Card key={label} className={`${styles.pillarCard} ${color}`}>
            <div className={styles.pillarTop}>
              <span className={styles.pillarIcon}>{icon}</span>
              <span className={styles.pillarLabel}>{label}</span>
            </div>
            <p className={styles.pillarText}>{text}</p>
          </Card>
        ))}
      </div>

      <section className={styles.competitiveSection}>
        <div className={styles.competitiveHeader}>
          <span className={styles.tag}>Market Research</span>
          <h2 className={styles.sectionTitle}>Competitive Analysis</h2>
          <p className={styles.competitiveSubtitle}>
            How Cool Farm stands out as the only platform that makes NUE visible,
            actionable, and impactful for farmers, processors, and the planet.
          </p>
        </div>
        <div className={styles.competitiveImageWrap}>
          <img
            src="/competitive-analysis.jpeg"
            alt="Market research: How Cool Farm stands out on NUE — competitive comparison table"
            className={styles.competitiveImage}
          />
        </div>
      </section>
    </div>
  )
}
