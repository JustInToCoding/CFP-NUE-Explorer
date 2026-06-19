import Card from '../../components/Card/Card'
import styles from './ValueProposition.module.css'

const personas = [
  {
    emoji: '👩‍🌾',
    name: 'Sarah',
    role: 'Farmer',
    accent: styles.personaGreen,
    text: 'Sees her NUE score for free, alongside the GHG assessment she already completes for her buyer. Lower N surplus is direct margin — fertiliser is her biggest cost — so reducing waste pays for itself while cutting emissions.',
  },
  {
    emoji: '🌿',
    name: 'Sophie',
    role: 'Sustainable Sourcing',
    accent: styles.personaTeal,
    text: 'Gets Sarah\'s score rolled up into trends, regional breakdowns, and practice adoption data. She can finally point to evidence — not just an ask — when building supplier programmes, and report progress against CSRD and retailer targets.',
  },
  {
    emoji: '👔',
    name: 'Marcus',
    role: 'VP of Sustainability',
    accent: styles.personaPurple,
    text: 'Sees one metric: the cost and emissions gap between his best and worst suppliers. That\'s the business case his board needs — proof that funding agronomy support delivers a return, not just a pledge.',
  },
]

export default function ValueProposition() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.tag}>WIn Win narrative</span>
        <h1 className={styles.title}>One Feature, Three Wins</h1>
        <p className={styles.subtitle}>
          A single farm-level number — kg grain per kg nitrogen — travels up the supply chain,
          creating value at each step without anyone re-entering data.
        </p>
      </header>

      <div className={styles.personaGrid}>
        {personas.map(({ emoji, name, role, accent, text }) => (
          <Card key={name} className={`${styles.personaCard} ${accent}`}>
            <div className={styles.personaTop}>
              <span className={styles.personaEmoji}>{emoji}</span>
              <div>
                <div className={styles.personaName}>{name}</div>
                <div className={styles.personaRole}>{role}</div>
              </div>
            </div>
            <p className={styles.personaText}>{text}</p>
          </Card>
        ))}
      </div>

      <div className={styles.footer}>
        One dataset. Sarah gets more profitable, Sophie gets a programme that works, Marcus gets the evidence to fund it.
      </div>
    </div>
  )
}
