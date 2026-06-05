import { useEffect, useRef } from 'react'

const BEAM_COUNT = 7
const MAX_SEGMENTS = 5
const MIN_SPEED = 0.2
const MAX_SPEED = 0.7

interface Segment { x1: number; y1: number; x2: number; y2: number }

interface Beam {
  x: number
  y: number
  dx: number
  dy: number
  speed: number
  cellProgress: number
  segments: Segment[]
}

const DIRS = [
  { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
  { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
]

function snap(v: number, gridSize: number) {
  return Math.round(v / gridSize) * gridSize
}

export default function GridBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let gridSize = window.innerWidth <= 640 ? 80 : 140

    const initBeam = (): Beam => {
      const dir = DIRS[Math.floor(Math.random() * DIRS.length)]
      return {
        x: Math.floor(Math.random() * (Math.ceil(canvas.width / gridSize) + 1)) * gridSize,
        y: Math.floor(Math.random() * (Math.ceil(canvas.height / gridSize) + 1)) * gridSize,
        dx: dir.dx, dy: dir.dy,
        speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
        cellProgress: 0,
        segments: [],
      }
    }

    let beams: Beam[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const oldGridSize = gridSize
      gridSize = window.innerWidth <= 640 ? 80 : 140

      // Re-initialize beams if they are empty or if grid size changed
      if (beams.length === 0 || oldGridSize !== gridSize) {
        beams = Array.from({ length: BEAM_COUNT }, initBeam)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#aa3bff'

      for (const beam of beams) {
        const hx = beam.x + beam.dx * beam.cellProgress
        const hy = beam.y + beam.dy * beam.cellProgress

        // Semua segments (trail + segment aktif)
        const allSegs: Segment[] = [
          ...beam.segments,
          { x1: beam.x, y1: beam.y, x2: hx, y2: hy },
        ]

        // Gambar trail sebagai garis — selalu presisi di garis grid
        for (let i = 0; i < allSegs.length; i++) {
          const t = (i + 1) / allSegs.length
          const s = allSegs[i]
          ctx.save()
          ctx.globalAlpha = t * 0.9
          ctx.strokeStyle = accent
          ctx.lineWidth = 1
          ctx.shadowBlur = 8
          ctx.shadowColor = accent
          ctx.beginPath()
          ctx.moveTo(s.x1, s.y1)
          ctx.lineTo(s.x2, s.y2)
          ctx.stroke()
          ctx.restore()
        }

        // Kepala cahaya
        ctx.save()
        ctx.shadowBlur = 14
        ctx.shadowColor = accent
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(hx, hy, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Gerak
        beam.cellProgress += beam.speed

        if (beam.cellProgress >= gridSize) {
          beam.cellProgress -= gridSize

          const nx = snap(beam.x + beam.dx * gridSize, gridSize)
          const ny = snap(beam.y + beam.dy * gridSize, gridSize)

          // Simpan segment yang selesai ke trail
          beam.segments.push({ x1: beam.x, y1: beam.y, x2: nx, y2: ny })
          if (beam.segments.length > MAX_SEGMENTS) beam.segments.shift()

          beam.x = nx
          beam.y = ny

          // Keluar layar → spawn ulang dari sisi berlawanan
          const margin = gridSize * 2
          if (beam.x < -margin || beam.x > canvas.width + margin ||
            beam.y < -margin || beam.y > canvas.height + margin) {
            const mc = Math.ceil(canvas.width / gridSize)
            const mr = Math.ceil(canvas.height / gridSize)
            if (beam.dx > 0) { beam.x = 0; beam.y = Math.floor(Math.random() * mr) * gridSize }
            else if (beam.dx < 0) { beam.x = mc * gridSize; beam.y = Math.floor(Math.random() * mr) * gridSize }
            else if (beam.dy > 0) { beam.y = 0; beam.x = Math.floor(Math.random() * mc) * gridSize }
            else { beam.y = mr * gridSize; beam.x = Math.floor(Math.random() * mc) * gridSize }
            beam.segments = []
          }

          // Random belok 90°
          if (Math.random() < 0.35) {
            if (beam.dx !== 0) { beam.dy = Math.random() < 0.5 ? 1 : -1; beam.dx = 0 }
            else { beam.dx = Math.random() < 0.5 ? 1 : -1; beam.dy = 0 }
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
