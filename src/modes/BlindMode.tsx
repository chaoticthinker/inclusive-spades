
import { useCallback, useEffect, useRef, useState } from 'react'
import './BlindMode.css'

type BlindModeProps = {
  onChangeMode: () => void
}

type BlindStep = 'join' | 'announcement' | 'cards'
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

            <p>
              Clubs are led. You can play the eight of clubs
              or the queen of clubs.
            </p>

            <p className="blind-placeholder">
              In our next step, we'll add interactive
              card selection and confirmation.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={() => goToStep('announcement')}
            >
              Back to game announcement
            </button>
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
