import styles from './Roadmap.module.css'

const phases = [
  {
    period: 'Months 1–3',
    badge: 'TRL 4',
    color: styles.phaseGreen,
    title: 'Prototype Development & Preparation',
    items: [
      'Develop and refine the NUE visualization prototype and scenario-planning functionality.',
      'Recruit pilot partners (processors, sustainability teams, selected farmers).',
      'Define success metrics, data requirements, and adoption schemes.',
    ],
  },
  {
    period: 'Months 4–5',
    badge: 'User Testing',
    color: styles.phaseTeal,
    title: 'Pilot Testing',
    items: [
      'Conduct pilot testing with early adopters using real farm and supply-chain data.',
      'Gather feedback on usability, visualization, NUE metrics, and decision-support value.',
      'Refine dashboards, workflows, and reporting features.',
    ],
  },
  {
    period: 'Months 5–6',
    badge: 'Capacity',
    color: styles.phaseAmber,
    title: 'Training & Onboarding',
    items: [
      'Deliver onboarding sessions and training materials.',
      'Run webinars to introduce the innovation and demonstrate practical use cases.',
      'Continue developing adoption incentives and implementation guidance.',
    ],
  },
  {
    period: 'Months 6–8',
    badge: 'Iteration',
    color: styles.phasePurple,
    title: 'Reflection & Refinement',
    items: [
      'Collect user feedback from testing and webinars.',
      'Assess adoption barriers, user needs, and business value.',
      'Improve functionality, visualization, and user experience based on findings.',
    ],
  },
  {
    period: 'Months 9–12',
    badge: 'TRL 6',
    color: styles.phaseBlue,
    title: 'Validation in Real Environment',
    items: [
      'Deploy the improved tool within participating organizations and supply chains.',
      'Validate performance using operational data and real-world decision-making processes.',
      'Produce a pilot evaluation report and roadmap for wider deployment.',
    ],
  },
]

export default function Roadmap() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.tag}>Roadmap</span>
        <h1 className={styles.title}>12-Month Adoption Pathway</h1>
        <p className={styles.subtitle}>
          From prototype development at TRL 4 to validated deployment at TRL 6 —
          five phases covering testing, training, iteration, and real-world validation.
        </p>
      </header>

      <div className={styles.timeline}>
        {phases.map(({ period, badge, color, title, items }) => (
          <div key={period} className={`${styles.phase} ${color}`}>
            <div className={styles.phasePeriod}>{period}</div>
            <div className={styles.phaseBadge}>{badge}</div>
            <h2 className={styles.phaseTitle}>{title}</h2>
            <ul className={styles.phaseList}>
              {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
