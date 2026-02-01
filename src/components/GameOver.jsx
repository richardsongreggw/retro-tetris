import { useState, useEffect } from 'react'
import './GameOver.css'

const GameOver = ({ score, lines, level, onRestart }) => {
  const [initials, setInitials] = useState('')
  const [highScores, setHighScores] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load high scores from localStorage
    const stored = localStorage.getItem('tetris-high-scores')
    if (stored) {
      setHighScores(JSON.parse(stored))
    }
  }, [])

  const saveScore = () => {
    if (initials.trim().length === 0) return

    const newScore = {
      initials: initials.toUpperCase().slice(0, 3),
      score,
      lines,
      level,
      date: new Date().toLocaleDateString()
    }

    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Keep top 10

    setHighScores(updatedScores)
    localStorage.setItem('tetris-high-scores', JSON.stringify(updatedScores))
    setSaved(true)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !saved) {
      saveScore()
    }
  }

  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h1 className="game-over-title">GAME OVER</h1>

        <div className="final-stats">
          <div className="stat">
            <span className="stat-label">Final Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Lines:</span>
            <span className="stat-value">{lines}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level:</span>
            <span className="stat-value">{level}</span>
          </div>
        </div>

        {!saved ? (
          <div className="save-score">
            <label htmlFor="initials">Enter your initials:</label>
            <input
              id="initials"
              type="text"
              maxLength="3"
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="AAA"
              autoFocus
            />
            <button onClick={saveScore} disabled={initials.trim().length === 0}>
              Save Score
            </button>
          </div>
        ) : (
          <p className="saved-message">Score saved!</p>
        )}

        <div className="high-scores">
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
                  <tr key={index} className={entry.initials === initials.toUpperCase() && saved ? 'highlight' : ''}>
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
        </div>

        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  )
}

export default GameOver
