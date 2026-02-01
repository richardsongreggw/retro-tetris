// Web Audio API sound generator for retro game sounds
let audioContext = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Initialize audio context on first user interaction
export const initAudio = () => {
  try {
    const ctx = getAudioContext()
    // Resume if suspended (Safari requirement)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    return true
  } catch (e) {
    console.warn('Audio not supported', e)
    return false
  }
}

// Play a simple beep tone
const playTone = (frequency, duration, volume = 0.3, type = 'square') => {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.value = frequency
    gainNode.gain.value = volume

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch (e) {
    console.warn('Could not play sound', e)
  }
}

// Movement sound (subtle click)
export const playMoveSound = () => {
  playTone(200, 0.05, 0.1, 'square')
}

// Rotation sound (quick beep)
export const playRotateSound = () => {
  playTone(400, 0.08, 0.15, 'square')
}

// Soft drop sound
export const playDropSound = () => {
  playTone(150, 0.06, 0.15, 'square')
}

// Hard drop sound (thud)
export const playHardDropSound = () => {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'square'
    oscillator.frequency.value = 100
    gainNode.gain.value = 0.3

    // Quick frequency drop for "thud" effect
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  } catch (e) {
    console.warn('Could not play sound', e)
  }
}

// Line clear sound (success)
export const playLineClearSound = () => {
  try {
    const ctx = getAudioContext()
    const frequencies = [523, 659, 784] // C, E, G chord

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'square'
      oscillator.frequency.value = freq
      gainNode.gain.value = 0.15

      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

      oscillator.start(ctx.currentTime + i * 0.05)
      oscillator.stop(ctx.currentTime + 0.3)
    })
  } catch (e) {
    console.warn('Could not play sound', e)
  }
}

// Tetris sound (4 lines - fanfare!)
export const playTetrisSound = () => {
  try {
    const ctx = getAudioContext()
    const melody = [
      { freq: 523, time: 0 },     // C
      { freq: 659, time: 0.1 },   // E
      { freq: 784, time: 0.2 },   // G
      { freq: 1047, time: 0.3 },  // C (high)
    ]

    melody.forEach(note => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'square'
      oscillator.frequency.value = note.freq
      gainNode.gain.value = 0.25

      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.15)

      oscillator.start(ctx.currentTime + note.time)
      oscillator.stop(ctx.currentTime + note.time + 0.15)
    })
  } catch (e) {
    console.warn('Could not play sound', e)
  }
}

// Level up sound
export const playLevelUpSound = () => {
  try {
    const ctx = getAudioContext()
    const frequencies = [523, 659, 784, 1047] // C major arpeggio

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'triangle'
      oscillator.frequency.value = freq
      gainNode.gain.value = 0.2

      oscillator.start(ctx.currentTime + i * 0.08)
      oscillator.stop(ctx.currentTime + i * 0.08 + 0.1)
    })
  } catch (e) {
    console.warn('Could not play sound', e)
  }
}

// Game over sound (sad trombone)
export const playGameOverSound = () => {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sawtooth'
    oscillator.frequency.value = 300
    gainNode.gain.value = 0.3

    // Descending pitch for sad effect
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)
  } catch (e) {
    console.warn('Could not play sound', e)
  }
}

// Piece lock sound (when piece lands)
export const playLockSound = () => {
  playTone(150, 0.1, 0.2, 'square')
}
