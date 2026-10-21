import {
  getCardName,
  type PlayingCardData,
} from '../components/PlayingCard'

import { getDemoTrickWinner } from '../game/demoGame'
import { useCallback, useEffect, useRef, useState } from 'react'
import './BlindMode.css'

type BlindModeProps = {
  onChangeMode: () => void
}

type BlindStep =
  | 'join'
  | 'announcement'
  | 'cards'
  | 'confirm'
  | 'result'
type ReviewPanel = 'details' | 'hand' | null

const players = [
  { position: 'North', name: 'Maya' },
  { position: 'West', name: 'Theo' },
  { position: 'South', name: 'Jordan (you)' },
  { position: 'East', name: 'Sam' },
]

const gameAnnouncement =
  'Round 3, trick 1. Clubs are led. ' +
  'Maya has played the king of clubs. ' +
  'It is your turn.'

const handCards = [
  'Eight of clubs, playable',
  'Queen of clubs, playable',
]

function BlindMode({ onChangeMode }: BlindModeProps) {
  const [step, setStep] = useState<BlindStep>('join')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const cardToRefocus = useRef<string | null>(null)
  const cardButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [reviewPanel, setReviewPanel] =
    useState<ReviewPanel>(null)
  const [liveMessage, setLiveMessage] = useState('')

  const headingRef = useRef<HTMLHeadingElement>(null)
  const reviewRef = useRef<HTMLHeadingElement>(null)
  const announcementTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null)

  // Announce information when requested.
  const announce = useCallback((message: string) => {
    if (announcementTimer.current !== null) {
      clearTimeout(announcementTimer.current)
    }

    // Clear the old message before repeating it.
    setLiveMessage('')

    announcementTimer.current = setTimeout(() => {
      setLiveMessage(message)
      announcementTimer.current = null
    }, 100)
  }, [])

  // Move focus to the new screen heading.
  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  // Move focus to expanded review information.
  useEffect(() => {
    if (reviewPanel !== null) {
      reviewRef.current?.focus()
    }
  }, [reviewPanel])

  // Clear scheduled announcements when leaving.
  useEffect(() => {
    return () => {
      if (announcementTimer.current !== null) {
        clearTimeout(announcementTimer.current)
      }
    }
  }, [])

  const repeatAnnouncement = useCallback(() => {
    announce(gameAnnouncement)
  }, [announce])

  const showHand = useCallback(() => {
    setReviewPanel('hand')
    announce(
      'Your playable cards are the eight of clubs ' +
      'and the queen of clubs.'
    )
  }, [announce])

  // Keyboard shortcuts for the announcement screen.
  useEffect(() => {
    if (step !== 'announcement') return

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null

      // Do not interfere with typing or modified shortcuts.
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey ||
        event.repeat ||
        target?.closest(
          'input, textarea, select, [contenteditable="true"]'
        )
      ) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === 'r') {
        event.preventDefault()
        repeatAnnouncement()
      }

      if (key === 'h') {
        event.preventDefault()
        showHand()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [step, repeatAnnouncement, showHand])

  function goToStep(nextStep: BlindStep) {
    setReviewPanel(null)
    setLiveMessage('')
    setStep(nextStep)
  }

  // Convert the selected demo card into shared card data.
  const demoPlayedCard: PlayingCardData | null = selectedCard
    ? {
        rank: selectedCard.startsWith('Queen') ? 'Q' : '8',
        suit: 'clubs',
      }
    : null

  // All presentation modes use the same winner calculation.
  const demoWinner = demoPlayedCard
    ? getDemoTrickWinner(demoPlayedCard)
    : null

  const resultAnnouncement = demoWinner
    ? (
        `${demoWinner.player} wins the trick with the ` +
        `${getCardName(demoWinner.card)}. ` +
        'Your team has 3 tricks. ' +
        'Opponents have 1 trick. ' +
        `${demoWinner.player} leads next.`
      )
    : ''

  
  function chooseCard(card: string) {
    setSelectedCard(card)
    cardToRefocus.current = card
    goToStep('confirm')
  }

  function cancelCardSelection() {
    setSelectedCard(null)
    goToStep('cards')
  }

  useEffect(() => {
  if (step === 'cards' && cardToRefocus.current) {
    return
  }

  headingRef.current?.focus()
}, [step])


  function confirmPlay() {
    if (!selectedCard || !demoWinner) return

    goToStep('result')
    announce(resultAnnouncement)
  }

  return (
    <main className="blind-layout">
      <aside className="blind-sidebar" aria-label="Game status">
        <h2>ROUND 3</h2>

        <div className="blind-stat">
          <h3>Your team</h3>
          <p>42 points · 2 tricks</p>
        </div>

        <div className="blind-stat">
          <h3>Opponents</h3>
          <p>36 points · 1 trick</p>
        </div>

        <section className="keyboard-help">
          <h3>Keyboard help</h3>
          <p>Tab: Move focus</p>
          <p>Enter or Space: Activate controls</p>
          <p>R: Repeat game announcement</p>
          <p>H: Review your hand</p>
        </section>
      </aside>

      <div className="blind-content">
        <button
          type="button"
          className="back-button"
          onClick={onChangeMode}
        >
          ← Change information mode
        </button>

        {step === 'join' && (
          <>
            <p className="step-label">STEP 1 OF 5</p>

            <h1 ref={headingRef} tabIndex={-1}>
              Join the table
            </h1>

            <h2 className="blind-welcome">
              Welcome, Jordan
            </h2>

            <section
              className="blind-players"
              aria-labelledby="players-heading"
            >
              <h3 id="players-heading" className="sr-only">
                Players at the table
              </h3>

              <ul>
                {players.map((player) => (
                  <li key={player.position}>
                    {player.position} · {player.name}
                  </li>
                ))}
              </ul>
            </section>

            <p className="blind-bags">
              Bags to win: 10
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => goToStep('announcement')}
            >
              Start hand
            </button>
          </>
        )}

        {step === 'announcement' && (
          <>
            <p className="step-label">STEP 2 OF 5</p>

            <h1 ref={headingRef} tabIndex={-1}>
              Review the game announcement
            </h1>

            <section
              className="blind-announcement"
              aria-labelledby="announcement-heading"
            >
              <h2 id="announcement-heading">
                Screen reader announcement
              </h2>

              <p>{gameAnnouncement}</p>
            </section>

            <p className="blind-current-trick">
              Current trick: Theo 4♣ · Maya K♣ ·
              Sam waiting
            </p>

            <div className="blind-controls">
              <button
                type="button"
                className="secondary-button"
                onClick={repeatAnnouncement}
                aria-keyshortcuts="R"
              >
                Repeat announcement
              </button>

              <button
                type="button"
                className="secondary-button"
                aria-expanded={reviewPanel === 'details'}
                aria-controls="blind-review-details"
                onClick={() => {
                  setReviewPanel(
                    reviewPanel === 'details' ? null : 'details'
                  )
                }}
              >
                More details
              </button>

              <button
                type="button"
                className="secondary-button"
                aria-expanded={reviewPanel === 'hand'}
                aria-controls="blind-review-hand"
                aria-keyshortcuts="H"
                onClick={showHand}
              >
                Review hand
              </button>
            </div>

            {reviewPanel === 'details' && (
              <section
                id="blind-review-details"
                className="blind-review-panel"
                aria-labelledby="details-heading"
              >
                <h2
                  id="details-heading"
                  ref={reviewRef}
                  tabIndex={-1}
                >
                  Detailed game state
                </h2>

                <dl>
                  <dt>Round</dt>
                  <dd>3</dd>
                  <dt>Current trick</dt>
                  <dd>1</dd>
                  <dt>Lead suit</dt>
                  <dd>Clubs</dd>
                  <dt>Theo played</dt>
                  <dd>Four of clubs</dd>
                  <dt>Maya played</dt>
                  <dd>King of clubs</dd>
                  <dt>Sam</dt>
                  <dd>Waiting</dd>
                  <dt>Current player</dt>
                  <dd>You</dd>
                </dl>
              </section>
            )}

            {reviewPanel === 'hand' && (
              <section
                id="blind-review-hand"
                className="blind-review-panel"
                aria-labelledby="hand-heading"
              >
                <h2
                  id="hand-heading"
                  ref={reviewRef}
                  tabIndex={-1}
                >
                  Review your hand
                </h2>

                <p>You have two playable cards:</p>

                <ul>
                  {handCards.map((card) => (
                    <li key={card}>{card}</li>
                  ))}
                </ul>
              </section>
            )}

            <button
              type="button"
              className="primary-button blind-continue"
              onClick={() => goToStep('cards')}
            >
              Continue to playable cards
            </button>
          </>
        )}

        
        {step === 'cards' && (
          <>
            <p className="step-label">STEP 3 OF 5</p>

            <h1 ref={headingRef} tabIndex={-1}>
              Choose a playable card
            </h1>

            <p className="blind-card-instructions">
              Clubs are led. You have two playable cards.
              Use Tab to move between cards and Enter or
              Space to select one.
            </p>

            <section
              className="blind-card-list"
              aria-labelledby="playable-cards-heading"
            >
              <h2 id="playable-cards-heading">
                Your playable cards
              </h2>

              <div className="blind-card-options">
                {handCards.map((card) => {
                  const cardName = card.replace(', playable', '')

                  return (
                    <button
                      key={card}
                      type="button"
                      className="blind-card-option"
                      ref={(element) => {
                        cardButtonRefs.current[card] = element
                      }}
                      onClick={() => chooseCard(card)}
                      aria-label={`Play ${cardName}`}
                    >
                      <span aria-hidden="true">
                        ♣
                      </span>

                      <span>{cardName}</span>

                      <span className="blind-card-valid">
                        Playable
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <button
              type="button"
              className="secondary-button"
              onClick={() => goToStep('announcement')}
            >
              Back to game announcement
            </button>
          </>
        )}

        
      
    {step === 'confirm' && selectedCard && (
      <>
        <p className="step-label">STEP 4 OF 5</p>

        <h1
          ref={headingRef}
          tabIndex={-1}
          aria-describedby="blind-confirm-description"
        >
          Confirm your card
        </h1>

        <section
          className="blind-confirm-panel"
          aria-labelledby="blind-confirm-question"
        >
          <h2
            id="blind-confirm-question"
            className="blind-confirm-question"
          >
            Play the {selectedCard.replace(', playable', '')}?
          </h2>

          <p
            id="blind-confirm-description"
            className="blind-valid-play"
          >
            Valid play. Clubs are led, and this card
            follows suit.
          </p>

          <p>
            You can confirm your selection or cancel
            to choose a different card.
          </p>
        </section>

        <div className="blind-controls">
          <button
            type="button"
            className="primary-button"
            onClick={confirmPlay}
          >
            Confirm play
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={cancelCardSelection}
          >
            Cancel and return to cards
          </button>
        </div>
      </>
    )}


      
    {step === 'result' && demoWinner && (
      <>
        <p className="step-label">STEP 5 OF 5</p>

        <h1
          ref={headingRef}
          tabIndex={-1}
          aria-describedby="blind-result-summary"
        >
          Trick complete
        </h1>

        <section
          className="blind-result-panel"
          aria-labelledby="blind-winner-heading"
        >
          <h2 id="blind-winner-heading">
            {demoWinner.player} wins the trick
          </h2>

          <p id="blind-result-summary">
            {getCardName(demoWinner.card)} takes the trick.
          </p>

          <dl className="blind-result-details">
            <dt>Winning player</dt>
            <dd>{demoWinner.player}</dd>

            <dt>Winning card</dt>
            <dd>{getCardName(demoWinner.card)}</dd>

            <dt>Your team's tricks</dt>
            <dd>3</dd>

            <dt>Opponents' tricks</dt>
            <dd>1</dd>

            <dt>Next player to lead</dt>
            <dd>{demoWinner.player}</dd>
          </dl>
        </section>

        <div className="blind-controls">
          <button
            type="button"
            className="secondary-button"
            onClick={() => announce(resultAnnouncement)}
          >
            Repeat trick result
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setSelectedCard(null)
              cardToRefocus.current = null
              goToStep('join')
            }}
          >
            Restart demo
          </button>
        </div>

        <p className="demo-note">
          Demonstration result using the sample trick.
        </p>
      </>
    )}



      </div>

      {/* Dedicated screen-reader announcement region */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {liveMessage}
      </div>
    </main>
  )
}

export default BlindMode
