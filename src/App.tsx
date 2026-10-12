
import { useState } from 'react'
import './App.css'

type InformationMode = 'blind' | 'low-vision' | 'sighted'
type Screen = 'welcome' | 'ready'

const modes = [
  {
    id: 'blind',
    title: 'Blind / nonvisual',
    description:
      'Linear game announcements, keyboard-first controls, review and repeat.',
  },
  {
    id: 'low-vision',
    title: 'Low vision',
    description:
      'Large type, high contrast, simplified table, and strong focus cues.',
  },
  {
    id: 'sighted',
    title: 'Sighted',
    description:
      'Visual table, compact game state, and a traditional card layout.',
  },
] as const

function App() {
  const [selectedMode, setSelectedMode] =
    useState<InformationMode | null>(null)

  const [screen, setScreen] = useState<Screen>('welcome')
  const [handStarted, setHandStarted] = useState(false)

  function chooseMode(mode: InformationMode) {
    setSelectedMode(mode)
    setScreen('ready')
  }

  function returnToWelcome() {
    setScreen('welcome')
    setHandStarted(false)
  }

  return (
    <div className="app">
      <header className="site-header">
        <span className="brand">♠ INCLUSIVE SPADES</span>
        {screen === 'ready' ? (
          <span className="current-mode">
            {modes.find((mode) => mode.id === selectedMode)?.title}
          </span>
        ) : (
          <span className="current-mode">CHOOSE YOUR MODE</span>
        )}
      </header>

      {screen === 'welcome' ? (
        <main className="main-content">
          <h1>Play together, your way</h1>
          <p className="intro">
            Choose how game information is presented. Every
            mode uses the same shared table, turn order,
            and outcome.
          </p>

          <div className="mode-grid">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className="mode-card"
                onClick={() => chooseMode(mode.id)}
              >
                <span className="mode-title">
                  {mode.title}
                </span>
                <span className="mode-description">
                  {mode.description}
                </span>
                <span className="mode-action">
                  Explore this mode →
                </span>
              </button>
            ))}
          </div>

          <p className="help-text">
            You can change this setting at any time
            from Accessibility.
          </p>
        </main>
      ) : (
        <main className="game-content">
          <button
            className="back-button"
            onClick={returnToWelcome}
          >
            ← Change information mode
          </button>

          <p className="step-label">STEP 1 OF 5</p>
          <h1>Ready to play?</h1>

          <section
            className="game-summary"
            aria-label="Current game summary"
          >
            <p className="round-label">ROUND 3</p>

            <p className="score-line">
              YOUR TEAM <strong>42</strong>
            </p>

            <p className="score-line">
              OPPONENTS <strong>36</strong>
            </p>

            <p className="game-detail">
              BAGS TO WIN 10
            </p>
          </section>

          {!handStarted ? (
            <button
              className="primary-button"
              onClick={() => setHandStarted(true)}
            >
              START HAND
            </button>
          ) : (
            <div className="game-feedback" role="status">
              <h2>Hand started!</h2>
              <p>
                The next step is to display the
                current trick and playable cards.
              </p>
            </div>
          )}
        </main>
      )}
    </div>
  )
}

export default App
