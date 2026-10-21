
import { getDemoTrickWinner } from './game/demoGame'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  PlayingCard,
  getCardName,
  type PlayingCardData,
} from './components/PlayingCard'
import BlindMode from './modes/BlindMode'

type InformationMode = 'blind' | 'low-vision' | 'sighted'

type Screen =
  | 'welcome'
  | 'blind'
  | 'ready'
  | 'trick'
  | 'cards'
  | 'confirm'
  | 'result'

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


const sampleCards: PlayingCardData[] = [
  { rank: '8', suit: 'clubs' },
  { rank: 'Q', suit: 'clubs' },
]


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

  const [selectedCard, setSelectedCard] =
    useState<PlayingCardData | null>(null)

  const [playedCard, setPlayedCard] =
    useState<PlayingCardData | null>(null)

  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [screen])

  function selectCard(card: PlayingCardData) {
    setSelectedCard(card)
    setScreen('confirm')
  }

  function cancelCard() {
    setSelectedCard(null)
    setScreen('cards')
  }

  function confirmCard() {
    if (!selectedCard) return

    setPlayedCard(selectedCard)
    setSelectedCard(null)
    setScreen('result')
  }

function chooseMode(mode: InformationMode) {
  setSelectedMode(mode)

  if (mode === 'blind') {
    setScreen('blind')
  } else {
    setScreen('ready')
  }
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


      {screen === 'blind' && (
        <BlindMode onChangeMode={returnToWelcome} />
      )}

      {screen === 'welcome' && (
        <main className="main-content">
          <h1 ref={headingRef} tabIndex={-1}>Play together, your way</h1>
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
          <h1 ref={headingRef} tabIndex={-1}>Ready to play?</h1>

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
          <h1 ref={headingRef} tabIndex={-1}>Trick {sampleTrick.number}</h1>

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
            type="button"
            className="back-button"
            onClick={() => setScreen('trick')}
          >
            ← Back to current trick
          </button>

          <p className="step-label">STEP 3 OF 5</p>
          <h1 ref={headingRef} tabIndex={-1}>Choose a card</h1>

          <p className="card-instruction">
            Clubs are led. Play a club.
          </p>

          <div
            className="playable-cards"
            role="group"
            aria-label="Playable cards"
          >
            {sampleCards.map((card) => (
              <PlayingCard
                key={`${card.rank}-${card.suit}`}
                card={card}
                playable={true}
                onSelect={selectCard}
              />
            ))}
          </div>

          <p className="focus-hint">
            Yellow outline shows keyboard focus.
          </p>

          <button
            type="button"
            className="secondary-button review-button"
            onClick={() => setScreen('trick')}
          >
            REVIEW GAME STATE
          </button>
        </main>
      )}

      
      {screen === 'confirm' && selectedCard && (
        <main className="game-content">
          <button
            type="button"
            className="back-button"
            onClick={cancelCard}
          >
            ← Back to playable cards
          </button>

          <p className="step-label">STEP 4 OF 5</p>
          <h1 ref={headingRef} tabIndex={-1}>Confirm play</h1>

          <h2 className="confirm-question">
            Play the {getCardName(selectedCard)}?
          </h2>

          <section
            className="selected-card-panel"
            aria-label="Selected card"
          >
            <div
              className="selected-card-face"
              aria-hidden="true"
            >
              {selectedCard.rank} ♣
            </div>

            <p className="valid-play">
              VALID PLAY
            </p>
          </section>

          <div className="confirmation-actions">
            <button
              type="button"
              className="primary-button"
              onClick={confirmCard}
            >
              PLAY CARD
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={cancelCard}
            >
              CANCEL
            </button>
          </div>
        </main>
      )}

      
      {screen === 'result' && playedCard && (() => {
        const winner = getDemoTrickWinner(playedCard)

        return (
          <main className="game-content">
            <p className="step-label">STEP 5 OF 5</p>
            <h1 ref={headingRef} tabIndex={-1}>Trick complete</h1>

            <h2 className="trick-winner">
              {winner.player.toUpperCase()} WINS
            </h2>

            <p className="winning-card">
              {getCardName(winner.card)} takes the trick.
            </p>

            <section
              className="updated-score"
              aria-label="Updated trick counts"
            >
              <p>YOUR TEAM　3 TRICKS</p>
              <p>OPPONENTS　1 TRICK</p>
              <p className="next-leader">
                {winner.player.toUpperCase()} LEADS NEXT
              </p>
            </section>

            <p className="demo-note">
              Demonstration result using the sample trick.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setSelectedCard(null)
                setPlayedCard(null)
                setScreen('ready')
              }}
            >
              RESTART DEMO
            </button>
          </main>
        )
      })()}



    </div>
  )
}

export default App
