import { Link } from 'react-router-dom'
import Card from '../../components/Card/Card'
import styles from './Home.module.css'

const features = [
  {
    to: '/farms',
    icon: '🏡',
    title: 'Farms',
    desc: 'Browse farms with location, climate zone, soil class, and SoilGrids properties.',
    accent: styles.accentTeal,
  },
  {
    to: '/assessments',
    icon: '📊',
    title: 'Assessments',
    desc: 'View GHG assessments with NUE scores, N balance, emission intensity, and FLAG breakdowns.',
    accent: styles.accentPurple,
  },
  {
    to: '/global-n',
    icon: '🌍',
    title: 'Global N Context',
    desc: 'Country-level NUE and fertiliser data from FAOSTAT — benchmark farms against national averages.',
    accent: styles.accentGreen,
  },
  {
    to: '/soil',
    icon: '🪨',
    title: 'Soil Lookup',
    desc: 'Identify IPCC and WRB soil classes for any coordinate and retrieve SoilGrids data.',
    accent: styles.accentBrown,
  },
]

const projectPages = [
  {
    to: '/value-proposition',
    icon: '🎯',
    title: 'Value Proposition',
    desc: 'Goal, mission and vision — plus competitive analysis of how Cool Farm stands out on NUE.',
    accent: styles.accentGreen,
  },
  {
    to: '/win-win',
    icon: '🏆',
    title: 'Win-Win Narrative',
    desc: 'One feature, three wins — how a single NUE number creates value for farmers, sourcing teams, and sustainability leads.',
    accent: styles.accentGreen,
  },
  {
    to: '/logic-model',
    icon: '🔗',
    title: 'Logic Model',
    desc: 'The theory of change connecting tool access to measurable NUE and emissions outcomes.',
    accent: styles.accentTeal,
  },
  {
    to: '/foundation',
    icon: '🏗️',
    title: 'Foundation',
    desc: 'The key assumptions underlying the prototype design, adoption pathway, and implementation plan.',
    accent: styles.accentPurple,
  },
  {
    to: '/roadmap',
    icon: '📅',
    title: 'Roadmap',
    desc: 'A 12-month adoption pathway from TRL 4 prototype to TRL 6 validation in the real environment.',
    accent: styles.accentBrown,
  },
]

export default function Home() {
  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <p className={styles.label}>Cool Farm Platform NUE Explorer</p>
        <h1 className={styles.title}>The hackathon output addresses Challenge D – NUE in the Wild by developing a minimum viable decision-support platform that transforms nitrogen-flow data into actionable insights, helping farmers, processors, and sustainability teams improve NUE while demonstrating the impact of these improvements on GHG emissions reduction. </h1>
        <p className={styles.disclaimer}>
          <strong>AI Use Disclaimer</strong> — AI tools were used solely for language refinement,
          rewriting, and structuring of content. All ideas, concepts, visualisations, technical
          solutions, methodology, and strategic recommendations presented in this project are the
          result of collaborative team effort. All outputs were reviewed and validated by the
          project team.
        </p>
      </header>

      {/* ── Context blocks ── */}
      <section className={styles.sections}>
        <Card className={styles.section}>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionTag}>Context</span>
          </div>
          <h2 className={styles.sectionTitle}>Problem Statement</h2>
          <p className={styles.sectionBody}>
            Agricultural supply chains need to reduce GHG emissions and improve nutrient efficiency,
            yet most sustainability platforms focus on carbon accounting, traceability, or compliance
            rather than Nutrient Use Efficiency (NUE). While fertiliser data is often collected,
            farmers and processors lack clear tools to visualise nutrient inputs, outputs, losses,
            and their impact on emissions. This limits their ability to identify inefficiencies,
            compare interventions, and make informed decisions that improve both productivity and
            sustainability.
          </p>
        </Card>

        <Card className={styles.section}>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionTag}>Platform</span>
          </div>
          <h2 className={styles.sectionTitle}>What Cool Farm Is</h2>
          <p className={styles.sectionBody}>
            Cool Farm is a globally recognised sustainability platform that helps food companies,
            processors, and farmers measure and improve environmental performance across agricultural
            supply chains. Building on its existing farm-gate NUE and GHG models, Cool Farm is
            uniquely positioned to transform complex nutrient data into actionable insights. By
            combining benchmarking, visualisation, scenario planning, and AI-assisted decision
            support, the platform can help users better understand nitrogen flows, identify
            inefficiencies, and quantify the relationship between NUE improvements and emissions
            reductions.
          </p>
        </Card>

        <Card className={styles.section}>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionTag}>Research Question</span>
          </div>
          <p className={styles.sectionBody}>
            Does providing farmers and crop processors with visual NUE scores, nutrient balance
            breakdowns, and scenario planning tools — integrated with existing GHG models on the
            Cool Farm Platform — increase the rate of nutrient management practice change beyond
            what GHG or compliance-focused reporting alone achieves, and does this result in
            measurable improvements in farm-gate NUE and reductions in N-related GHG emissions
            per tonne of output?
          </p>
        </Card>
      </section>

      {/* ── Methodology ── */}
      <section className={styles.methodologySection}>
        <Card className={styles.methodologyCard}>
          <div className={styles.methodologyHeader}>
            <span className={styles.sectionTag}>Methodology</span>
            <h2 className={styles.sectionTitle}>Our Methodology</h2>
          </div>
          <p className={styles.methodologyBody}>
            The Cool Farm methodology uses farm-level activity data, scientifically validated models,
            and open-source sustainability indicators to assess environmental performance in
            agricultural supply chains. For Nitrogen Use Efficiency (NUE), the methodology follows
            Oenema et al. (2015), calculating the efficiency of nitrogen utilization in annual crop
            production based on nitrogen inputs and outputs. The methodology enables benchmarking,
            scenario analysis, and the quantification of links between nutrient management and
            greenhouse gas emissions, providing actionable insights for farmers, processors, and
            food companies.
          </p>
        </Card>
      </section>

      {/* ── Mockup iframe ── */}
      <section className={styles.mockupSection}>
        <h2 className={styles.navTitle}>Design Mockup</h2>
        <div className={styles.mockupWrap}>
          <iframe
            src="/mockup.html"
            title="CFP NUE Explorer Mockup"
            className={styles.mockupFrame}
          />
        </div>
        <p className={styles.mockupNote}>
          Interactive mockup — scroll inside to explore. <a href="/mockup.html" target="_blank" rel="noopener noreferrer">Open full screen ↗</a>
        </p>
      </section>
    </div>
  )
}
