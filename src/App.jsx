import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import GameOver from './components/GameOver'
import { TETROMINOS, createBoard, checkCollision } from './gameLogic'
import {
  initAudio,
  playMoveSound,
  playRotateSound,
  playDropSound,
  playHardDropSound,
  playLineClearSound,
  playTetrisSound,
  playLevelUpSound,
  playGameOverSound,
  playLockSound
} from './sounds'

const App = () => {
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'paused', 'gameOver'
  const [board, setBoard] = useState(createBoard())
  const [currentPiece, setCurrentPiece] = useState(null)
  const [nextPiece, setNextPiece] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [dropTime, setDropTime] = useState(1000)
  const [gameSpeed, setGameSpeed] = useState(1000)
  const [showTetris, setShowTetris] = useState(false)
  const dropIntervalRef = useRef(null)

  const getRandomPiece = () => {
    const pieces = Object.keys(TETROMINOS)
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    return {
      shape: TETROMINOS[randomPiece].shape,
      color: TETROMINOS[randomPiece].color
    }
  }

  const startGame = () => {
    initAudio() // Initialize audio on user interaction
    setBoard(createBoard())
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameSpeed(1000)
    const firstPiece = getRandomPiece()
    const second = getRandomPiece()
    setCurrentPiece(firstPiece)
    setNextPiece(second)
    setPosition({ x: 3, y: 0 })
    setGameState('playing')
  }

  const movePiece = useCallback((dir) => {
    if (gameState !== 'playing' || !currentPiece) return

    const newPos = {
      x: position.x + (dir === 'left' ? -1 : dir === 'right' ? 1 : 0),
      y: position.y + (dir === 'down' ? 1 : 0)
    }

    if (!checkCollision(currentPiece.shape, board, newPos)) {
      setPosition(newPos)
      if (dir === 'down') {
        setDropTime(gameSpeed)
        playDropSound()
      } else {
        playMoveSound()
      }
    } else if (dir === 'down') {
      mergePieceToBoard()
    }
  }, [gameState, currentPiece, position, board, gameSpeed])

  const rotatePiece = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return

    const rotated = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    )

    if (!checkCollision(rotated, board, position)) {
      setCurrentPiece({ ...currentPiece, shape: rotated })
      playRotateSound()
    }
  }, [gameState, currentPiece, board, position])

  const hardDrop = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return

    let newY = position.y
    while (!checkCollision(currentPiece.shape, board, { x: position.x, y: newY + 1 })) {
      newY++
    }
    setPosition({ ...position, y: newY })
    playHardDropSound()
    mergePieceToBoard()
  }, [gameState, currentPiece, board, position])

  const mergePieceToBoard = () => {
    playLockSound() // Piece locks into place

    const newBoard = board.map(row => [...row])

    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardY = position.y + y
          const boardX = position.x + x
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            newBoard[boardY][boardX] = currentPiece.color
          }
        }
      })
    })

    const { clearedBoard, linesCleared } = clearLines(newBoard)
    setBoard(clearedBoard)

    if (linesCleared > 0) {
      // Play appropriate sound for lines cleared
      if (linesCleared === 4) {
        playTetrisSound()
        setShowTetris(true)
        setTimeout(() => setShowTetris(false), 1500)
      } else {
        playLineClearSound()
      }

      const points = [40, 100, 300, 1200][linesCleared - 1] * level
      setScore(prev => prev + points)
      setLines(prev => {
        const newLines = prev + linesCleared
        const newLevel = Math.floor(newLines / 10) + 1
        if (newLevel > level) {
          setLevel(newLevel)
          setGameSpeed(Math.max(100, 1000 - (newLevel - 1) * 100))
          playLevelUpSound()
        }
        return newLines
      })
    }

    setCurrentPiece(nextPiece)
    setNextPiece(getRandomPiece())
    setPosition({ x: 3, y: 0 })

    if (checkCollision(nextPiece.shape, clearedBoard, { x: 3, y: 0 })) {
      playGameOverSound()
      setGameState('gameOver')
    }
  }

  const clearLines = (board) => {
    let linesCleared = 0
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++
        return false
      }
      return true
    })

    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(0))
    }

    return { clearedBoard: newBoard, linesCleared }
  }

  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused')
    } else if (gameState === 'paused') {
      setGameState('playing')
    }
  }, [gameState])

  // Keep movePiece ref updated without restarting the interval
  const movePieceRef = useRef(movePiece)
  useEffect(() => {
    movePieceRef.current = movePiece
  }, [movePiece])

  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      movePieceRef.current('down')
    }, gameSpeed)

    return () => clearInterval(interval)
  }, [gameState, gameSpeed])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === 'start') {
        if (e.key === ' ') startGame()
        return
      }

      if (e.key === 'p' || e.key === 'P') {
        togglePause()
        return
      }

      if (gameState !== 'playing') return

      if (e.key === 'ArrowLeft') movePiece('left')
      else if (e.key === 'ArrowRight') movePiece('right')
      else if (e.key === 'ArrowDown') movePiece('down')
      else if (e.key === 'ArrowUp' || e.key === ' ') rotatePiece()
      else if (e.key === 'Enter') hardDrop()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState, movePiece, rotatePiece, hardDrop, togglePause])

  return (
    <div className="app">
      {gameState === 'start' && <StartScreen onStart={startGame} />}
      {(gameState === 'playing' || gameState === 'paused') && (
        <GameBoard
          board={board}
          currentPiece={currentPiece}
          position={position}
          nextPiece={nextPiece}
          score={score}
          lines={lines}
          level={level}
          isPaused={gameState === 'paused'}
          showTetris={showTetris}
          onMove={movePiece}
          onRotate={rotatePiece}
          onDrop={hardDrop}
          onPause={togglePause}
        />
      )}
      {gameState === 'gameOver' && (
        <GameOver score={score} lines={lines} level={level} onRestart={startGame} />
      )}
    </div>
  )
}

export default App
