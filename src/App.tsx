
import { useState } from 'react'
import './App.css'

type InformationMode = 'blind' | 'low-vision' | 'sighted'
type Screen = 'welcome' | 'ready' | 'trick' | 'cards'

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

// Sample game state based on the Figma prototype.
// Later, our Spades engine will supply this information.
const sampleTrick = {
  number: 1,
  leadSuit: 'Clubs',
  players: {
    north: { name: 'Maya', card: 'K ♣' },
    west: { name: 'Theo', card: '4 ♣' },
    east: { name: 'Sam', card: null },
    south: { name: 'You', card: null },
  },
}

function TrickTable() {
  const { players } = sampleTrick

  return (
    <section
      className="trick-table"
      aria-label="Current trick"
      aria-describedby="trick-description"
    >
      <div className="table-player table-north">
        <span>{players.north.name}</span>
        <strong>{players.north.card}</strong>
      </div>

      <div className="table-player table-west">
        <span>{players.west.name}</span>
        <strong>{players.west.card}</strong>
      </div>

      <div className="table-player table-east">
        <span>{players.east.name}</span>
        <span>WAITING</span>
      </div>

      <div className="table-player table-south">
        <strong>YOUR TURN</strong>
      </div>
    </section>
  )
}

function App() {
  const [selectedMode, setSelectedMode] =
    useState<InformationMode | null>(null)

  const [screen, setScreen] = useState<Screen>('welcome')

  function chooseMode(mode: InformationMode) {
    setSelectedMode(mode)
    setScreen('ready')
  }

  function returnToWelcome() {
    setScreen('welcome')
  }

  function startHand() {
    setScreen('trick')
  }

  return (
    <div className="app">
      <header className="site-header">
        <span className="brand">♠ INCLUSIVE SPADES</span>
        <span className="current-mode">
          {selectedMode
            ? modes.find(
                (mode) => mode.id === selectedMode
              )?.title
            : 'CHOOSE YOUR MODE'}
        </span>
      </header>

      {screen === 'welcome' && (
        <main className="main-content">
          <h1>Play together, your way</h1>
          <p className="intro">
            Choose how game information is presented.
            Every mode uses the same shared table,
            turn order, and outcome.
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
      )}

      {screen === 'ready' && (
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

          <button
            className="primary-button"
            onClick={startHand}
          >
            START HAND
          </button>
        </main>
      )}

      {screen === 'trick' && (
        <main className="game-content">
          <button
            className="back-button"
            onClick={() => setScreen('ready')}
          >
            ← Back to game summary
          </button>

          <p className="step-label">STEP 2 OF 5</p>
          <h1>Trick {sampleTrick.number}</h1>

          <h2 className="lead-suit">
            {sampleTrick.leadSuit.toUpperCase()} LED
          </h2>

          <p id="trick-description" className="sr-only">
            Clubs are led. Theo played the four of clubs.
            Maya played the king of clubs. Sam is waiting.
            It is your turn.
          </p>

          <TrickTable />

          <button
            className="primary-button trick-action"
            onClick={() => setScreen('cards')}
          >
            VIEW PLAYABLE CARDS
          </button>
        </main>
      )}

      {screen === 'cards' && (
        <main className="game-content">
          <button
            className="back-button"
            onClick={() => setScreen('trick')}
          >
            ← Back to current trick
          </button>

          <p className="step-label">STEP 3 OF 5</p>
          <h1>Choose a card</h1>
          <p className="intro">
            Clubs are led. Play a club.
          </p>

          <div className="game-feedback" role="status">
            <h2>Your cards are coming next!</h2>
            <p>
              In our next development step, we'll build
              the accessible playing card components
              from your Figma design.
            </p>
          </div>
        </main>
      )}
    </div>
  )
}

export default App
