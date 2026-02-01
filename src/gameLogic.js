// Tetromino shapes and colors (Game Boy Color style)
export const TETROMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f0f0' // Cyan
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000' // Yellow
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a000f0' // Purple
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#f0a000' // Orange
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000f0' // Blue
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00f000' // Green
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#f00000' // Red
  }
}

// Create empty 20x10 board
export const createBoard = () => {
  return Array(20).fill(null).map(() => Array(10).fill(0))
}

// Check collision with board boundaries and existing pieces
export const checkCollision = (shape, board, position) => {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const newY = y + position.y
        const newX = x + position.x

        // Check boundaries
        if (
          newX < 0 ||
          newX >= board[0].length ||
          newY >= board.length
        ) {
          return true
        }

        // Check collision with existing pieces (if not above board)
        if (newY >= 0 && board[newY][newX] !== 0) {
          return true
        }
      }
    }
  }
  return false
}
