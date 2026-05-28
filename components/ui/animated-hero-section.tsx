"use client"

import { useEffect, useRef } from "react"

const COLOR = "#3fb950"           // green pixels — accent color
const HIT_COLOR = "#0e4429"       // dimmed green — contribution level 1
const BACKGROUND_COLOR = "#000000" // pure black
const BALL_COLOR = "#ffffff"       // white ball
const PADDLE_COLOR = "#238636"    // darker green paddles
const LETTER_SPACING = 1
const WORD_SPACING = 3

const getHeroLayout = (width: number, height: number) => {
  if (width < 640) {
    return {
      nameWidthRatio: 0.88,
      maxPixelSize: 4.4,
      textStartY: height * 0.22,
      bottomPaddleY: height * 0.64,
    }
  }

  if (width < 1024) {
    return {
      nameWidthRatio: 0.9,
      maxPixelSize: 6.5,
      textStartY: height * 0.28,
      bottomPaddleY: height * 0.72,
    }
  }

  return {
    nameWidthRatio: 0.85,
    maxPixelSize: Number.POSITIVE_INFINITY,
    textStartY: null,
    bottomPaddleY: null,
  }
}

const PIXEL_MAP = {
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  K: [
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  C: [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [0, 1, 1, 1],
  ],
  "!": [
    [1],
    [1],
    [1],
    [0],
    [1],
  ],
}

interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
}

export function HeroPongAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddlesRef = useRef<Paddle[]>([])
  const scaleRef = useRef(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      // Use offsetParent or container size if available, fallback to window dimensions
      const width = canvas.parentElement?.clientWidth || window.innerWidth
      const height = canvas.parentElement?.clientHeight || window.innerHeight
      canvas.width = width
      canvas.height = height
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000)
      initializeGame()
    }

    const initializeGame = () => {
      const scale = scaleRef.current

      // Pixel sizes — large for name, small for greeting
      const LARGE_PIXEL_SIZE = 8 * scale
      const BALL_SPEED = 6 * scale

      pixelsRef.current = []

      const calcWordWidth = (word: string, pixelSize: number): number => {
        return (
          word.split("").reduce((w, letter) => {
            const map = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
            const lw = map?.[0]?.length ?? 0
            return w + lw * pixelSize + LETTER_SPACING * pixelSize
          }, 0) - LETTER_SPACING * pixelSize
        )
      }

      const calcLineWidth = (sentence: string, pixelSize: number): number => {
        return sentence.split(" ").reduce((total, word, i) => {
          return total + calcWordWidth(word, pixelSize) + (i > 0 ? WORD_SPACING * pixelSize : 0)
        }, 0)
      }

      // Scale each line independently so name stays large, greeting stays visible
      const nameRaw = calcLineWidth("SHIVPRASAD MAHIND", LARGE_PIXEL_SIZE)

      // Name drives the scale — fit it to 85% of canvas width
      const layout = getHeroLayout(canvas.width, canvas.height)
      const nameScale = (canvas.width * layout.nameWidthRatio) / nameRaw
      const cappedNameScale = Math.min(nameScale, layout.maxPixelSize / LARGE_PIXEL_SIZE)
      const adjustedLarge = LARGE_PIXEL_SIZE * cappedNameScale

      // Greeting uses same size as the adjusted large name
      const adjustedSmall = adjustedLarge * 0.45

      // Recalculate widths with adjusted sizes
      const nameWidth = calcLineWidth("SHIVPRASAD MAHIND", adjustedLarge)
      const greetWidth = calcLineWidth("HI I AM", adjustedSmall)

      // Heights (each letter is 5 rows tall)
      const nameHeight = 5 * adjustedLarge
      const greetHeight = 5 * adjustedSmall
      const gap = 1.5 * adjustedLarge

      const totalHeight = greetHeight + gap + nameHeight

      // Start Y — vertically centered, shifted slightly upward
      let currentY = layout.textStartY ?? (canvas.height - totalHeight) / 2 - adjustedLarge * 0.5

      // Render "HI I AM"
      let startX = (canvas.width - greetWidth) / 2

      "HI I AM".split(" ").forEach((word, wi) => {
        if (wi > 0) startX += WORD_SPACING * adjustedSmall

        word.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
          if (!pixelMap) return

          for (let row = 0; row < pixelMap.length; row++) {
            for (let col = 0; col < pixelMap[row].length; col++) {
              if (pixelMap[row][col]) {
                pixelsRef.current.push({
                  x: startX + col * adjustedSmall,
                  y: currentY + row * adjustedSmall,
                  size: adjustedSmall,
                  hit: false,
                })
              }
            }
          }
          startX += (pixelMap[0].length + LETTER_SPACING) * adjustedSmall
        })
      })

      // Advance Y to name line
      currentY += greetHeight + gap

      // Render "SHIVPRASAD MAHIND"
      startX = (canvas.width - nameWidth) / 2

      "SHIVPRASAD MAHIND".split(" ").forEach((word, wi) => {
        if (wi > 0) startX += WORD_SPACING * adjustedLarge

        word.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
          if (!pixelMap) return

          for (let row = 0; row < pixelMap.length; row++) {
            for (let col = 0; col < pixelMap[row].length; col++) {
              if (pixelMap[row][col]) {
                pixelsRef.current.push({
                  x: startX + col * adjustedLarge,
                  y: currentY + row * adjustedLarge,
                  size: adjustedLarge,
                  hit: false,
                })
              }
            }
          }
          startX += (pixelMap[0].length + LETTER_SPACING) * adjustedLarge
        })
      })

      // Ball
      ballRef.current = {
        x: canvas.width * 0.85,
        y: canvas.height * 0.15,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjustedLarge / 2,
      }

      // Paddles
      const paddleWidth = adjustedLarge
      const paddleLength = 10 * adjustedLarge

      paddlesRef.current = [
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: layout.bottomPaddleY ?? canvas.height - paddleWidth,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ]
    }

    const updateGame = () => {
      const ball = ballRef.current
      const paddles = paddlesRef.current
      const scale = scaleRef.current

      // Asymmetrical bounds
      const insetX = 40 * scale
      const insetTop = 60 * scale
      const bottomPaddle = paddles.find((paddle) => !paddle.isVertical && paddle.y > 0)
      const playfieldBottom = bottomPaddle ? bottomPaddle.y + bottomPaddle.height : canvas.height - 30 * scale

      ball.x += ball.dx
      ball.y += ball.dy

      // Bounce ball off asymmetrical playfield inset boundaries
      if (ball.y - ball.radius < insetTop || ball.y + ball.radius > playfieldBottom) {
        ball.dy = -ball.dy
      }
      if (ball.x - ball.radius < insetX || ball.x + ball.radius > canvas.width - insetX) {
        ball.dx = -ball.dx
      }

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            ball.dx = -ball.dx
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            ball.dy = -ball.dy
          }
        }
      })

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2
          paddle.targetY = Math.max(insetTop, Math.min(playfieldBottom - paddle.height, paddle.targetY))
          paddle.y += (paddle.targetY - paddle.y) * 0.1
        } else {
          paddle.targetY = ball.x - paddle.width / 2
          paddle.targetY = Math.max(insetX, Math.min(canvas.width - paddle.width - insetX, paddle.targetY))
          paddle.x += (paddle.targetY - paddle.x) * 0.1
        }
      })

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true
          const centerX = pixel.x + pixel.size / 2
          const centerY = pixel.y + pixel.size / 2
          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx
          } else {
            ball.dy = -ball.dy
          }
        }
      })
    }

    const drawGame = () => {
      if (!ctx) return

      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      ctx.fillStyle = BALL_COLOR
      ctx.beginPath()
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = PADDLE_COLOR
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
      })
    }

    let animationFrameId: number

    const gameLoop = () => {
      updateGame()
      drawGame()
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      aria-label="SHIVPRASAD: Fullscreen Pong game with pixel text"
    />
  )
}

export default HeroPongAnimation
