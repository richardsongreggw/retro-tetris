import { useEffect, useRef } from 'react'
import './GameBoard.css'

const GameBoard = ({
  board,
  currentPiece,
  position,
  nextPiece,
  score,
  lines,
  level,
  isPaused,
  showTetris,
  showOnScreenControls,
  onMove,
  onRotate,
  onDrop,
  onPause
}) => {
  const touchStartRef = useRef(null)
  const boardRef = useRef(null)
  const downButtonIntervalRef = useRef(null)

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])

    if (currentPiece && !isPaused) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = position.y + y
            const boardX = position.x + x
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              displayBoard[boardY][boardX] = currentPiece.color
            }
          }
        })
      })
    }

    return displayBoard
  }

  // Handle touch controls
  useEffect(() => {
    const handleTouchStart = (e) => {
      e.preventDefault() // Prevent page scrolling
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      }
    }

    const handleTouchMove = (e) => {
      e.preventDefault() // Prevent page scrolling during swipe
    }

    const handleTouchEnd = (e) => {
      e.preventDefault() // Prevent page scrolling
      if (!touchStartRef.current) return

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now()
      }

      const deltaX = touchEnd.x - touchStartRef.current.x
      const deltaY = touchEnd.y - touchStartRef.current.y
      const deltaTime = touchEnd.time - touchStartRef.current.time

      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Tap (rotate)
      if (absX < 30 && absY < 30 && deltaTime < 200) {
        onRotate()
      }
      // Swipe
      else if (absX > absY) {
        if (deltaX > 30) onMove('right')
        else if (deltaX < -30) onMove('left')
      } else {
        if (deltaY > 30) {
          if (deltaTime < 150) onDrop() // Fast swipe = hard drop
          else onMove('down') // Slow swipe = soft drop
        }
      }

      touchStartRef.current = null
    }

    const board = boardRef.current
    if (board) {
      board.addEventListener('touchstart', handleTouchStart, { passive: false })
      board.addEventListener('touchmove', handleTouchMove, { passive: false })
      board.addEventListener('touchend', handleTouchEnd, { passive: false })

      return () => {
        board.removeEventListener('touchstart', handleTouchStart)
        board.removeEventListener('touchmove', handleTouchMove)
        board.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [onMove, onRotate, onDrop])

  const displayBoard = renderBoard()

  // Handle down button hold for acceleration
  const handleDownButtonStart = (e) => {
    e.preventDefault()
    onMove('down') // Immediate first move
    downButtonIntervalRef.current = setInterval(() => {
      onMove('down')
    }, 100) // Adjusted timing
  }

  const handleDownButtonEnd = (e) => {
    if (e) e.preventDefault()
    if (downButtonIntervalRef.current) {
      clearInterval(downButtonIntervalRef.current)
      downButtonIntervalRef.current = null
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (downButtonIntervalRef.current) {
        clearInterval(downButtonIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>RETRO TETRIS</h1>
      </div>

      <div className="game-layout">
        <div className="game-board-container" ref={boardRef}>
          {isPaused && (
            <div className="pause-overlay">
              <div className="pause-message">PAUSED</div>
              <div className="pause-instruction">Press P to resume</div>
            </div>
          )}
          {showTetris && (
            <div className="tetris-overlay">
              <div className="tetris-message">TETRIS!</div>
              <div className="tetris-points">+{1200 * level} pts</div>
            </div>
          )}
          <div className="game-board">
            {displayBoard.map((row, y) => (
              <div key={y} className="board-row">
                {row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="cell"
                    style={{
                      backgroundColor: cell !== 0 ? cell : '#0f380f',
                      borderColor: cell !== 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="game-sidebar">
          <div className="info-panel">
            <h3>SCORE</h3>
            <div className="info-value">{score}</div>
          </div>

          <div className="info-panel">
            <h3>LINES</h3>
            <div className="info-value">{lines}</div>
          </div>

          <div className="info-panel">
            <h3>LEVEL</h3>
            <div className="info-value">{level}</div>
          </div>

          <div className="info-panel next-piece-panel">
            <h3>NEXT</h3>
            <div className="next-piece">
              {nextPiece && nextPiece.shape.map((row, y) => (
                <div key={y} className="next-row">
                  {row.map((cell, x) => (
                    <div
                      key={`${y}-${x}`}
                      className="next-cell"
                      style={{
                        backgroundColor: cell !== 0 ? nextPiece.color : 'transparent'
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button className="pause-button" onClick={onPause}>
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
        </div>
      </div>

      {showOnScreenControls && (
        <div className="on-screen-controls">
          <button className="control-btn control-left" onClick={() => onMove('left')}>
            ◄
          </button>
          <button className="control-btn control-right" onClick={() => onMove('right')}>
            ►
          </button>
          <button className="control-btn control-rotate" onClick={onRotate}>
            ↻
          </button>
          <button
            className="control-btn control-down"
            onMouseDown={handleDownButtonStart}
            onMouseUp={handleDownButtonEnd}
            onMouseLeave={handleDownButtonEnd}
            onTouchStart={handleDownButtonStart}
            onTouchEnd={handleDownButtonEnd}
            onTouchCancel={handleDownButtonEnd}
            onContextMenu={(e) => e.preventDefault()}
          >
            ▼
          </button>
        </div>
      )}
    </div>
  )
}

export default GameBoard
