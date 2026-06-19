import { useState } from 'react'
import { useNavigate, useInRouterContext } from 'react-router-dom'
import styles from './Settings.module.css'

const read = (key) => localStorage.getItem(key) ?? ''

function NavigateBack() {
  const navigate = useNavigate()
  return (
    <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
      Back
    </button>
  )
}

export default function Settings({ onSave, isGate = false }) {
  const inRouter = useInRouterContext()

  const [cfpToken,    setCfpToken]    = useState(() => read('cfp_token'))
  const [faoUser,     setFaoUser]     = useState(() => read('faostat_username'))
  const [faoPassword, setFaoPassword] = useState(() => read('faostat_password'))
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('cfp_token', cfpToken.trim())
    localStorage.setItem('faostat_username', faoUser.trim())
    localStorage.setItem('faostat_password', faoPassword)
    setSaved(true)
    onSave?.()
    if (!isGate) setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    localStorage.removeItem('cfp_token')
    localStorage.removeItem('faostat_username')
    localStorage.removeItem('faostat_password')
    window.location.reload()
  }

  return (
    <div className={isGate ? styles.gate : styles.page}>
      <div className={styles.card}>
        {isGate && (
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🌱</span>
            <h1 className={styles.brandName}>CFP NUE Explorer</h1>
          </div>
        )}

        <h2 className={styles.title}>{isGate ? 'API Credentials' : 'Settings'}</h2>
        <p className={styles.subtitle}>
          {isGate
            ? 'Enter your credentials to get started. They are stored only in your browser.'
            : 'Update your API credentials. Changes take effect immediately.'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Cool Farm Platform</legend>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cfp-token">API Token *</label>
              <input
                id="cfp-token"
                className={styles.input}
                type="password"
                required
                placeholder="Your CFP API token"
                value={cfpToken}
                onChange={(e) => setCfpToken(e.target.value)}
                autoComplete="current-password"
              />
              <span className={styles.hint}>Required for all CFP data. Find it in your account settings at app.coolfarm.org.</span>
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>FAOSTAT <span className={styles.optional}>(optional)</span></legend>
            <p className={styles.fieldsetDesc}>Only needed for the Global N Context page.</p>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="fao-user">Username</label>
              <input
                id="fao-user"
                className={styles.input}
                type="text"
                placeholder="your@email.com"
                value={faoUser}
                onChange={(e) => setFaoUser(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="fao-pass">Password</label>
              <input
                id="fao-pass"
                className={styles.input}
                type="password"
                placeholder="FAOSTAT password"
                value={faoPassword}
                onChange={(e) => setFaoPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </fieldset>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryBtn}>
              {saved ? '✓ Saved' : isGate ? 'Get Started' : 'Save'}
            </button>
            {!isGate && inRouter && <NavigateBack />}
          </div>
        </form>

        {!isGate && (
          <div className={styles.danger}>
            <button type="button" className={styles.clearBtn} onClick={handleClear}>
              Clear all credentials & reload
            </button>
          </div>
        )}

        <p className={styles.privacy}>
          Credentials are stored in your browser's localStorage and never sent anywhere except the respective APIs.
        </p>
      </div>
    </div>
  )
}
