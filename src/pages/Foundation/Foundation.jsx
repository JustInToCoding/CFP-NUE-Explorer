import Card from '../../components/Card/Card'
import styles from './Foundation.module.css'

const assumptions = [
  {
    icon: '🛠️',
    title: 'Prototype Development',
    items: [
      'The chatbot can accurately retrieve and synthesize information from the Cool Farm methodology, FAOSTAT datasets, scientific literature, and trusted NUE resources to provide reliable, evidence-based responses.',
      'Users prefer a conversational interface for exploring NUE concepts, benchmarking results, and scenario planning rather than navigating multiple datasets and documents.',
      'The prototype dataset is representative for initial testing, but validation with operational farm data will be required as real-world data contains missing values and varying quality.',
    ],
  },
  {
    icon: '🔗',
    title: 'Theory of Change',
    items: [
      'Making NUE visible and understandable through AI-assisted explanations, benchmarking, and visualizations will help users identify nutrient inefficiencies and improvement opportunities.',
      'Connecting NUE performance to GHG emissions and business outcomes will increase motivation among farmers, processors, and sustainability teams to adopt improved nutrient management practices.',
    ],
  },
  {
    icon: '🤝',
    title: 'Adoption Pathway',
    items: [
      'Existing Cool Farm members and partners will participate in testing and validation because the solution builds on data, workflows, and sustainability programmes they already support.',
      'Training, webinars, and guided onboarding will be sufficient for users to understand, trust, and apply NUE insights in their decision-making processes.',
    ],
  },
  {
    icon: '⚙️',
    title: 'Implementation Pathway',
    items: [
      'The solution can be integrated into existing Cool Farm infrastructure and member networks, enabling efficient piloting, validation, and scaling across multiple regions and supply chains.',
      'The project team has the necessary skills, resources, budget, and time to develop the tools, validate the prototype, and achieve TRL 6 within the proposed 12-month timeframe.',
    ],
  },
]

export default function Foundation() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.tag}>Foundation</span>
        <h1 className={styles.title}>Our Assumptions</h1>
        <p className={styles.subtitle}>
          The key assumptions underlying the prototype's design, theory of change,
          adoption pathway, and implementation plan.
        </p>
      </header>

      <div className={styles.grid}>
        {assumptions.map(({ icon, title, items }) => (
          <Card key={title} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>{icon}</span>
              <h2 className={styles.cardTitle}>{title}</h2>
            </div>
            <ul className={styles.list}>
              {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
