
import { useEffect, useRef, useState } from 'react'
import {
  PlayingCard,
  getCardName,
  type PlayingCardData,
} from '../components/PlayingCard'
import { getDemoTrickWinner } from '../game/demoGame'
import './SightedMode.css'

type SightedModeProps = {
  onChangeMode: () => void
}

type SightedStep =
  | 'ready'
  | 'table'
  | 'cards'
  | 'confirm'
  | 'result'

  const playableCards: PlayingCardData[] = [
  { rank: '8', suit: 'clubs' },
  { rank: 'Q', suit: 'clubs' },
]

function SightedMode({ onChangeMode }: SightedModeProps) {
  const [step, setStep] = useState<SightedStep>('ready')
  const [selectedCard, setSelectedCard] =
  useState<PlayingCardData | null>(null)
  const [playedCard, setPlayedCard] =
  useState<PlayingCardData | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

function chooseCard(card: PlayingCardData) {
  setSelectedCard(card)
  setStep('confirm')
}

function cancelCard() {
  setSelectedCard(null)
  setStep('cards')
}

function confirmCard() {
  if (!selectedCard) return

  setPlayedCard(selectedCard)
  setSelectedCard(null)
  setStep('result')
}

  return (
    <main className="sighted-layout">
      <button
        type="button"
        className="sighted-back"
        onClick={onChangeMode}
      >
        ← Change information mode
      </button>

      {step === 'ready' && (
        <div className="sighted-ready">
          <p className="sighted-eyebrow">STEP 1 OF 5</p>

          <h1 ref={headingRef} tabIndex={-1}>
            Ready to play?
          </h1>

          <p className="sighted-intro">
            You're joining Maya, Theo, and Sam
            for the next hand of Spades.
          </p>

          <section
            className="sighted-summary"
            aria-label="Game summary"
          >
            <div className="sighted-summary-header">
              <span>ROUND 3</span>
              <span>10 BAGS TO WIN</span>
            </div>

            <div className="sighted-score-grid">
              <div>
                <span className="sighted-score-label">
                  YOUR TEAM
                </span>
                <strong>42</strong>
                <span>POINTS</span>
              </div>

              <div>
                <span className="sighted-score-label">
                  OPPONENTS
                </span>
                <strong>36</strong>
                <span>POINTS</span>
              </div>
            </div>
          </section>

          <button
            type="button"
            className="sighted-primary"
            onClick={() => setStep('table')}
          >
            Start hand →
          </button>
        </div>
      )}

      {step === 'table' && (
        <div className="sighted-game">
          <div className="sighted-game-heading">
            <div>
              <p className="sighted-eyebrow">STEP 2 OF 5</p>
              <h1 ref={headingRef} tabIndex={-1}>
                Trick 1
              </h1>
            </div>

            <div className="sighted-mini-score">
              <span>Your team: 42</span>
              <span>Opponents: 36</span>
            </div>
          </div>

          <div className="sighted-table-status">
            <strong>♣ Clubs led</strong>
            <span>Your turn to play</span>
          </div>

          <section
            className="sighted-card-table"
            aria-label="Current Spades table"
          >
            <div className="sighted-seat sighted-north">
              <span className="sighted-player">Maya</span>
              <span className="sighted-table-card">
                K ♣
              </span>
            </div>

            <div className="sighted-seat sighted-west">
              <span className="sighted-player">Theo</span>
              <span className="sighted-table-card">
                4 ♣
              </span>
            </div>

            <div className="sighted-table-center">
              <span>TRICK 1</span>
              <strong>♠</strong>
            </div>

            <div className="sighted-seat sighted-east">
              <span className="sighted-player">Sam</span>
              <span className="sighted-waiting">
                Waiting
              </span>
            </div>

            <div className="sighted-seat sighted-south">
              <span className="sighted-player">
                You
              </span>
              <span className="sighted-turn">
                YOUR TURN
              </span>
            </div>
          </section>

          <div className="sighted-game-actions">
            <p>
              Clubs are led. You'll need to play
              a club.
            </p>

            <button
            type="button"
            className="sighted-primary"
            onClick={() => setStep('cards')}
            >
            View playable cards →
            </button>
          </div>

          <button
            type="button"
            className="sighted-back"
            onClick={() => setStep('ready')}
          >
            ← Back to game summary
          </button>
        </div>
      )}
      
{step === 'cards' && (
  <div className="sighted-game sighted-selection">
    <p className="sighted-eyebrow">STEP 3 OF 5</p>

    <h1 ref={headingRef} tabIndex={-1}>
      Choose a card
    </h1>

    <div className="sighted-selection-info">
      <span className="sighted-suit-label">
        ♣ CLUBS LED
      </span>
      <p>
        It's your turn. Select a playable card
        from your hand.
      </p>
    </div>

    <section
      className="sighted-hand"
      aria-labelledby="sighted-hand-heading"
    >
      <h2 id="sighted-hand-heading">
        Your hand
      </h2>

      <div
        className="sighted-hand-cards"
        role="group"
        aria-label="Playable cards"
      >
        {playableCards.map((card) => (
          <PlayingCard
            key={`${card.rank}-${card.suit}`}
            card={card}
            playable={true}
            onSelect={chooseCard}
          />
        ))}
      </div>

      <p className="sighted-hand-hint">
        Select a card to review your play.
        You can also use Tab and Enter.
      </p>
    </section>

    <button
      type="button"
      className="sighted-back"
      onClick={() => setStep('table')}
    >
      ← Back to the table
    </button>
  </div>
)}


{step === 'confirm' && selectedCard && (
  <div className="sighted-game sighted-confirm">
    <p className="sighted-eyebrow">STEP 4 OF 5</p>

    <h1 ref={headingRef} tabIndex={-1}>
      Confirm your play
    </h1>

    <p className="sighted-confirm-intro">
      You're about to play the
      {' '}{getCardName(selectedCard)}.
    </p>

    <section
      className="sighted-confirm-panel"
      aria-label="Selected card confirmation"
    >
      <div
        className="sighted-selected-card"
        aria-hidden="true"
      >
        <span>{selectedCard.rank}</span>
        <span>♣</span>
      </div>

      <div className="sighted-confirm-details">
        <span className="sighted-valid-label">
          ✓ VALID PLAY
        </span>

        <h2>
          {getCardName(selectedCard)}
        </h2>

        <p>
          Clubs are led. This card follows suit.
        </p>
      </div>
    </section>

    <div className="sighted-confirm-actions">
      <button
        type="button"
        className="sighted-primary"
        onClick={confirmCard}
      >
        Play card →
      </button>

      <button
        type="button"
        className="sighted-secondary"
        onClick={cancelCard}
      >
        Cancel
      </button>
    </div>
  </div>
)}


{step === 'result' && playedCard && (() => {
  const winner = getDemoTrickWinner(playedCard)

  return (
    <div className="sighted-game sighted-result">
      <p className="sighted-eyebrow">STEP 5 OF 5</p>

      <h1 ref={headingRef} tabIndex={-1}>
        Trick complete
      </h1>

      <section
        className="sighted-result-panel"
        aria-label="Trick result"
      >
        <div className="sighted-result-icon" aria-hidden="true">
          ♣
        </div>

        <h2>{winner.player} wins!</h2>

        <p>
          {getCardName(winner.card)} takes the trick.
        </p>

        <div className="sighted-result-scores">
          <div>
            <span>YOUR TEAM</span>
            <strong>3</strong>
            <span>TRICKS</span>
          </div>

          <div>
            <span>OPPONENTS</span>
            <strong>1</strong>
            <span>TRICK</span>
          </div>
        </div>

        <p className="sighted-next-leader">
          {winner.player} leads next
        </p>
      </section>

      <p className="demo-note">
        Demonstration result using the sample trick.
      </p>

      <button
        type="button"
        className="sighted-primary"
        onClick={() => {
          setSelectedCard(null)
          setPlayedCard(null)
          setStep('ready')
        }}
      >
        Restart demo →
      </button>
    </div>
  )
})()}

    </main>
  )
}

export default SightedMode
