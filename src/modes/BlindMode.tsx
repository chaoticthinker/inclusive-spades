
import { useEffect, useRef, useState } from 'react'
import './BlindMode.css'

type BlindModeProps = {
  onChangeMode: () => void
}

type BlindStep = 'join' | 'announcement'

const players = [
  { position: 'North', name: 'Maya' },
  { position: 'West', name: 'Theo' },
  { position: 'South', name: 'Jordan (you)' },
  { position: 'East', name: 'Sam' },
]

function BlindMode({ onChangeMode }: BlindModeProps) {
  const [step, setStep] = useState<BlindStep>('join')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

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
          <p>Enter or Space: Select</p>
          <p>R: Repeat game state (coming soon)</p>
          <p>H: Review hand (coming soon)</p>
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
              onClick={() => setStep('announcement')}
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
                Current game announcement
              </h2>

              <p>
                Round 3, trick 1. Clubs are led.
                Maya has played the king of clubs.
                It is your turn.
              </p>
            </section>

            <p className="blind-placeholder">
              Next, we'll add repeatable announcements,
              keyboard shortcuts, and playable cards.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setStep('join')}
            >
              Back to table
            </button>
          </>
        )}
      </div>
    </main>
  )
}

export default BlindMode
