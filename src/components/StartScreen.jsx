import { useState, useEffect } from 'react'
import './StartScreen.css'

const StartScreen = ({ onStart, showOnScreenControls, setShowOnScreenControls }) => {
  const [showHighScores, setShowHighScores] = useState(false)
  const [highScores, setHighScores] = useState([])
  const [hasTouch] = useState('ontouchstart' in window || navigator.maxTouchPoints > 0)

  useEffect(() => {
    const stored = localStorage.getItem('tetris-high-scores')
    if (stored) {
      setHighScores(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="game-title">RETRO TETRIS</h1>

        <div className="game-info">
          <p className="creation-date">Created: January 31, 2025</p>
          <p className="author">Built with Claude Code</p>
        </div>

        {!showHighScores ? (
          <>
            <div className="controls-section">
              <h2>Keyboard Controls</h2>
              <div className="controls-grid">
                <div className="control-item">
                  <span className="key">← →</span>
                  <span className="action">Move left/right</span>
                </div>
                <div className="control-item">
                  <span className="key">↑ / Space</span>
                  <span className="action">Rotate</span>
                </div>
                <div className="control-item">
                  <span className="key">↓</span>
                  <span className="action">Soft drop</span>
                </div>
                <div className="control-item">
                  <span className="key">Enter</span>
                  <span className="action">Hard drop</span>
                </div>
                <div className="control-item">
                  <span className="key">P</span>
                  <span className="action">Pause</span>
                </div>
              </div>

              <h2>Touch Controls</h2>
              <div className="touch-controls">
                <p>Swipe left/right: Move</p>
                <p>Tap: Rotate</p>
                <p>Swipe down: Drop</p>
              </div>
            </div>

            {hasTouch && (
              <div className="controls-toggle">
                <label className="toggle-label">
                  <span>On-Screen Controls</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={showOnScreenControls}
                      onChange={(e) => setShowOnScreenControls(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </div>
                </label>
                <p className="toggle-hint">Show buttons for easier touch control</p>
              </div>
            )}

            <div className="button-group">
              <button className="start-button" onClick={onStart}>
                {hasTouch ? 'Tap to Start' : 'Press SPACE or Click to Start'}
              </button>
              <button className="high-scores-button" onClick={() => setShowHighScores(true)}>
                View High Scores
              </button>
            </div>
          </>
        ) : (
          <div className="high-scores-view">
            <h2>HIGH SCORES</h2>
            {highScores.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Lines</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {highScores.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.initials}</td>
                      <td>{entry.score}</td>
                      <td>{entry.lines}</td>
                      <td>{entry.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-scores">No high scores yet!</p>
            )}
            <button className="back-button" onClick={() => setShowHighScores(false)}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StartScreen
