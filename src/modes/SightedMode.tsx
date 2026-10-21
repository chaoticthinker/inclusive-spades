
import { useEffect, useRef, useState } from 'react'
import './SightedMode.css'

type SightedModeProps = {
  onChangeMode: () => void
}

type SightedStep = 'ready' | 'table'

function SightedMode({ onChangeMode }: SightedModeProps) {
  const [step, setStep] = useState<SightedStep>('ready')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

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
            disabled
            >
            View playable cards — coming next
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
    </main>
  )
}

export default SightedMode
