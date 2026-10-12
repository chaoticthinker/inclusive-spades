
import { useState } from 'react'
import './App.css'

type InformationMode = 'blind' | 'low-vision' | 'sighted'

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

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="/">
          ♠ INCLUSIVE SPADES
        </a>
        <nav aria-label="Main navigation">
          <a href="#main">Choose mode</a>
        </nav>
      </header>

      <main id="main" className="main-content">
        <h1>Play together, your way</h1>
        <p className="intro">
          Choose how game information is presented. Every mode
          uses the same shared table, turn order, and outcome.
        </p>

        <div className="mode-grid">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`mode-card ${
                selectedMode === mode.id ? 'selected' : ''
              }`}
              aria-pressed={selectedMode === mode.id}
              onClick={() => setSelectedMode(mode.id)}
            >
              <span className="mode-title">{mode.title}</span>
              <span className="mode-description">
                {mode.description}
              </span>
              <span className="mode-action">
                {selectedMode === mode.id
                  ? 'Selected ✓'
                  : 'Explore this mode →'}
              </span>
            </button>
          ))}
        </div>

        <p className="help-text">
          You can change this setting at any time from Accessibility.
        </p>
        <p className="selection-status" role="status">
          {selectedMode
            ? `${modes.find((mode) => mode.id === selectedMode)?.title} mode selected.`
            : 'No information mode selected yet.'}
        </p>
      </main>
    </div>
  )
}

export default App
