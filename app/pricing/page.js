'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../../components/PageTransition'

const COLORS = {
  bg: '#000000',
  surface: '#0c0c0c',
  orange: '#ff6a1a',
  orangeBright: '#ff8a3d',
  white: '#ffffff',
  muted: 'rgba(255,255,255,.72)',
  faint: 'rgba(255,255,255,.4)',
}

/* =========================================================
   PREMIUM / PRICING PAGE
========================================================= */

export default function PricingPage() {
  const canvasRef = useRef(null)

  const gameRef = useRef({
    bird: {
      x: 120,
      y: 250,
      velocity: 0,
      radius: 14,
    },

    pipes: [],

    score: 0,

    running: false,

    lastTime: 0,

    spawnTimer: 0,

    animationFrame: null,
  })

  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    let animationFrame

    /* =======================================================
       CANVAS SIZE
    ======================================================= */

    const resize = () => {
      const rect = canvas.getBoundingClientRect()

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      )

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      )
    }

    resize()

    window.addEventListener(
      'resize',
      resize
    )

    /* =======================================================
       LEAVES
    ======================================================= */

    const leafColors = [
      '#ff6a1a',
      '#ff8a3d',
      '#e85a0c',
      '#ffffff',
    ]

    const leaves = Array.from(
      { length: 18 },
      () => ({
        x:
          Math.random() *
          canvas.clientWidth,

        y:
          Math.random() *
          canvas.clientHeight,

        size:
          Math.random() * 5 + 5,

        speed:
          Math.random() * 0.7 + 0.3,

        sway:
          Math.random() * 30 + 15,

        phase:
          Math.random() *
          Math.PI *
          2,

        rotation:
          Math.random() *
          Math.PI *
          2,

        spin:
          (Math.random() - 0.5) *
          0.02,

        color:
          leafColors[
            Math.floor(
              Math.random() *
                leafColors.length
            )
          ],

        opacity:
          Math.random() * 0.3 + 0.2,
      })
    )

    /* =======================================================
       DRAW LEAF
    ======================================================= */

    const drawLeaf = (
      x,
      y,
      size,
      rotation,
      color,
      opacity
    ) => {
      ctx.save()

      ctx.translate(x, y)
      ctx.rotate(rotation)

      ctx.globalAlpha = opacity
      ctx.fillStyle = color

      ctx.beginPath()

      ctx.moveTo(
        0,
        -size
      )

      ctx.bezierCurveTo(
        size * 0.9,
        -size * 0.5,
        size * 0.8,
        size * 0.6,
        0,
        size
      )

      ctx.bezierCurveTo(
        -size * 0.8,
        size * 0.6,
        -size * 0.9,
        -size * 0.5,
        0,
        -size
      )

      ctx.fill()

      ctx.globalAlpha =
        opacity * 0.8

      ctx.strokeStyle =
        '#000000'

      ctx.lineWidth = 1

      ctx.beginPath()

      ctx.moveTo(
        0,
        -size * 0.8
      )

      ctx.lineTo(
        0,
        size
      )

      ctx.stroke()

      ctx.restore()
    }

    /* =======================================================
       RESET GAME
    ======================================================= */

    const resetGame = () => {
      const game =
        gameRef.current

      game.bird = {
        x: 120,
        y:
          canvas.clientHeight / 2,
        velocity: 0,
        radius: 14,
      }

      game.pipes = []

      game.score = 0

      game.spawnTimer = 0

      game.lastTime =
        performance.now()

      game.running = true

      setScore(0)
      setGameOver(false)
      setStarted(true)
    }

    /* =======================================================
       FLAP
    ======================================================= */

    const flap = () => {
      const game =
        gameRef.current

      if (!game.running) {
        resetGame()
      }

      game.bird.velocity = -6.8
    }

    /* =======================================================
       SPAWN PIPE
    ======================================================= */

    const spawnPipe = () => {
      const height =
        canvas.clientHeight

      const gap = 145

      const minTop = 55

      const maxTop =
        Math.max(
          minTop + 10,
          height -
            gap -
            55
        )

      const top =
        Math.random() *
          (maxTop - minTop) +
        minTop

      gameRef.current.pipes.push({
        x:
          canvas.clientWidth +
          40,

        width: 58,

        top,

        gap,

        passed: false,

        speed: 2.8,
      })
    }

    /* =======================================================
       COLLISION
    ======================================================= */

    const hasCollision = pipe => {
      const game =
        gameRef.current

      const bird =
        game.bird

      const birdLeft =
        bird.x -
        bird.radius

      const birdRight =
        bird.x +
        bird.radius

      const birdTop =
        bird.y -
        bird.radius

      const birdBottom =
        bird.y +
        bird.radius

      const pipeLeft =
        pipe.x

      const pipeRight =
        pipe.x +
        pipe.width

      const touchingPipe =
        birdRight >
          pipeLeft &&
        birdLeft <
          pipeRight

      if (!touchingPipe) {
        return false
      }

      const hitTop =
        birdTop <
        pipe.top

      const hitBottom =
        birdBottom >
        pipe.top +
          pipe.gap

      return (
        hitTop ||
        hitBottom
      )
    }

    /* =======================================================
       END GAME
    ======================================================= */

    const endGame = () => {
      const game =
        gameRef.current

      if (!game.running) {
        return
      }

      game.running = false

      setGameOver(true)

      setBest(currentBest =>
        Math.max(
          currentBest,
          game.score
        )
      )
    }

    /* =======================================================
       DRAW GAME
    ======================================================= */

    const drawGame = time => {
      const width =
        canvas.clientWidth

      const height =
        canvas.clientHeight

      /* CLEAR */

      ctx.clearRect(
        0,
        0,
        width,
        height
      )

      /* BACKGROUND */

      ctx.fillStyle =
        '#030303'

      ctx.fillRect(
        0,
        0,
        width,
        height
      )

      /* ORANGE GLOW */

      const gradient =
        ctx.createRadialGradient(
          width / 2,
          height / 2,
          10,
          width / 2,
          height / 2,
          width * 0.7
        )

      gradient.addColorStop(
        0,
        'rgba(255,106,26,.09)'
      )

      gradient.addColorStop(
        1,
        'rgba(0,0,0,0)'
      )

      ctx.fillStyle =
        gradient

      ctx.fillRect(
        0,
        0,
        width,
        height
      )

      /* GRID */

      ctx.strokeStyle =
        'rgba(255,255,255,.035)'

      ctx.lineWidth = 1

      for (
        let x = 0;
        x < width;
        x += 40
      ) {
        ctx.beginPath()

        ctx.moveTo(x, 0)

        ctx.lineTo(
          x,
          height
        )

        ctx.stroke()
      }

      for (
        let y = 0;
        y < height;
        y += 40
      ) {
        ctx.beginPath()

        ctx.moveTo(0, y)

        ctx.lineTo(
          width,
          y
        )

        ctx.stroke()
      }

      /* PIPES */

      gameRef.current.pipes.forEach(
        pipe => {
          const pipeGradient =
            ctx.createLinearGradient(
              pipe.x,
              0,
              pipe.x +
                pipe.width,
              0
            )

          pipeGradient.addColorStop(
            0,
            '#c84708'
          )

          pipeGradient.addColorStop(
            0.5,
            '#ff6a1a'
          )

          pipeGradient.addColorStop(
            1,
            '#ff8a3d'
          )

          ctx.fillStyle =
            pipeGradient

          /* TOP PIPE */

          ctx.fillRect(
            pipe.x,
            0,
            pipe.width,
            pipe.top
          )

          /* BOTTOM PIPE */

          ctx.fillRect(
            pipe.x,
            pipe.top +
              pipe.gap,
            pipe.width,
            height -
              pipe.top -
              pipe.gap
          )

          /* CAPS */

          ctx.fillStyle =
            '#ff8a3d'

          ctx.fillRect(
            pipe.x - 5,
            pipe.top - 10,
            pipe.width + 10,
            10
          )

          ctx.fillRect(
            pipe.x - 5,
            pipe.top +
              pipe.gap,
            pipe.width + 10,
            10
          )

          /* GLOW */

          ctx.shadowColor =
            'rgba(255,106,26,.35)'

          ctx.shadowBlur = 15

          ctx.strokeStyle =
            'rgba(255,106,26,.5)'

          ctx.strokeRect(
            pipe.x,
            0,
            pipe.width,
            pipe.top
          )

          ctx.strokeRect(
            pipe.x,
            pipe.top +
              pipe.gap,
            pipe.width,
            height -
              pipe.top -
              pipe.gap
          )

          ctx.shadowBlur = 0
        }
      )

      /* BIRD */

      const bird =
        gameRef.current.bird

      ctx.save()

      ctx.translate(
        bird.x,
        bird.y
      )

      const angle =
        Math.max(
          -0.45,
          Math.min(
            0.8,
            bird.velocity *
              0.08
          )
        )

      ctx.rotate(angle)

      /* BIRD GLOW */

      ctx.shadowColor =
        'rgba(255,106,26,.65)'

      ctx.shadowBlur = 20

      ctx.fillStyle =
        '#ff6a1a'

      ctx.beginPath()

      ctx.arc(
        0,
        0,
        bird.radius,
        0,
        Math.PI * 2
      )

      ctx.fill()

      ctx.shadowBlur = 0

      /* WING */

      ctx.fillStyle =
        '#ffb07a'

      ctx.beginPath()

      ctx.ellipse(
        -4,
        5,
        8,
        5,
        -0.3,
        0,
        Math.PI * 2
      )

      ctx.fill()

      /* EYE */

      ctx.fillStyle =
        '#ffffff'

      ctx.beginPath()

      ctx.arc(
        5,
        -5,
        4,
        0,
        Math.PI * 2
      )

      ctx.fill()

      ctx.fillStyle =
        '#000000'

      ctx.beginPath()

      ctx.arc(
        6,
        -5,
        2,
        0,
        Math.PI * 2
      )

      ctx.fill()

      /* BEAK */

      ctx.fillStyle =
        '#ffffff'

      ctx.beginPath()

      ctx.moveTo(
        bird.radius - 2,
        -1
      )

      ctx.lineTo(
        bird.radius + 9,
        3
      )

      ctx.lineTo(
        bird.radius - 2,
        7
      )

      ctx.closePath()

      ctx.fill()

      ctx.restore()

      /* FALLING LEAVES */

      leaves.forEach(
        leaf => {
          const sway =
            Math.sin(
              time * 0.001 +
                leaf.phase
            ) *
            leaf.sway

          drawLeaf(
            leaf.x + sway,
            leaf.y,
            leaf.size,
            leaf.rotation,
            leaf.color,
            leaf.opacity
          )
        }
      )

      /* SCORE */

      if (
        gameRef.current.running
      ) {
        ctx.font =
          '700 32px "Space Grotesk", sans-serif'

        ctx.textAlign =
          'center'

        ctx.fillStyle =
          'rgba(255,255,255,.95)'

        ctx.shadowColor =
          'rgba(255,106,26,.5)'

        ctx.shadowBlur = 15

        ctx.fillText(
          gameRef.current.score,
          width / 2,
          55
        )

        ctx.shadowBlur = 0
      }
    }

    /* =======================================================
       GAME LOOP
    ======================================================= */

    const loop = timestamp => {
      const game =
        gameRef.current

      const delta =
        Math.min(
          (timestamp -
            game.lastTime) /
            16.67,
          2
        )

      game.lastTime =
        timestamp

      /* LEAVES */

      leaves.forEach(
        leaf => {
          leaf.y +=
            leaf.speed *
            delta

          leaf.rotation +=
            leaf.spin *
            delta

          if (
            leaf.y >
            canvas.clientHeight +
              30
          ) {
            leaf.y = -30

            leaf.x =
              Math.random() *
              canvas.clientWidth
          }
        }
      )

      /* GAME */

      if (game.running) {
        game.bird.velocity +=
          0.32 * delta

        game.bird.y +=
          game.bird.velocity *
          delta

        game.spawnTimer +=
          delta

        if (
          game.spawnTimer >
          85
        ) {
          spawnPipe()

          game.spawnTimer = 0
        }

        game.pipes.forEach(
          pipe => {
            pipe.x -=
              pipe.speed *
              delta

            if (
              !pipe.passed &&
              pipe.x +
                pipe.width <
                game.bird.x
            ) {
              pipe.passed = true

              game.score += 1

              setScore(
                game.score
              )
            }

            if (
              hasCollision(
                pipe
              )
            ) {
              endGame()
            }
          }
        )

        game.pipes =
          game.pipes.filter(
            pipe =>
              pipe.x >
              -pipe.width - 20
          )

        if (
          game.bird.y -
            game.bird.radius <
            0 ||
          game.bird.y +
            game.bird.radius >
            canvas.clientHeight
        ) {
          endGame()
        }
      }

      drawGame(timestamp)

      animationFrame =
        requestAnimationFrame(
          loop
        )

      game.animationFrame =
        animationFrame
    }

    /* =======================================================
       INPUT
    ======================================================= */

    const handleFlap = event => {
      if (
        event.code === 'Space' ||
        event.code === 'ArrowUp'
      ) {
        event.preventDefault()

        flap()
      }
    }

    const handleCanvasClick = () => {
      flap()
    }

    window.addEventListener(
      'keydown',
      handleFlap
    )

    canvas.addEventListener(
      'mousedown',
      handleCanvasClick
    )

    /* INITIAL GAME STATE */

    gameRef.current.lastTime =
      performance.now()

    animationFrame =
      requestAnimationFrame(
        loop
      )

    return () => {
      cancelAnimationFrame(
        animationFrame
      )

      window.removeEventListener(
        'resize',
        resize
      )

      window.removeEventListener(
        'keydown',
        handleFlap
      )

      canvas.removeEventListener(
        'mousedown',
        handleCanvasClick
      )
    }
  }, [])

  /* =========================================================
     PLAY AGAIN
  ========================================================= */

  const playAgain = () => {
    const event =
      new KeyboardEvent(
        'keydown',
        {
          code: 'Space',
        }
      )

    window.dispatchEvent(event)
  }

  return (
    <main
      style={{
        minHeight: '100vh',

        background:
          COLORS.bg,

        color:
          COLORS.white,

        fontFamily:
          "'Inter', system-ui, sans-serif",

        position:
          'relative',

        overflow:
          'hidden',

        paddingBottom:
          100,
      }}
    >

      {/* =====================================================
          GLOBAL STYLES
      ===================================================== */}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #000000;
        }

        ::selection {
          background: rgba(255,106,26,.4);
          color: #ffffff;
        }

        a:focus-visible,
        button:focus-visible {
          outline: 2px solid #ff6a1a;
          outline-offset: 3px;
        }

        .premium-nav-link {
          transition:
            color .2s ease,
            background .2s ease,
            border-color .2s ease,
            box-shadow .2s ease,
            transform .2s ease;
        }

        .premium-nav-link:hover {
          color: #ffffff !important;

          background:
            rgba(255,106,26,.1) !important;

          border-color:
            rgba(255,106,26,.3) !important;

          box-shadow:
            0 0 18px rgba(255,106,26,.06);

          transform:
            translateY(-1px);
        }

        .game-container {
          width:
            min(760px, calc(100vw - 32px));
        }

        .game-canvas {
          width: 100%;
          height: 480px;
          display: block;
          cursor: pointer;
          touch-action: manipulation;
        }

        .game-button {
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .game-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 0 30px rgba(255,106,26,.4);
        }

        @media (max-width: 900px) {
          .desktop-links {
            display: none !important;
          }
        }

        @media (max-width: 700px) {
          .game-canvas {
            height: 420px;
          }

          .premium-nav {
            width:
              calc(100% - 24px) !important;
          }

          .nav-brand {
            font-size: 16px !important;
          }

          .nav-home {
            display: none !important;
          }
        }

        @media (max-width: 500px) {
          .game-canvas {
            height: 380px;
          }

          .premium-title {
            font-size: 42px !important;
          }

          .premium-subtitle {
            font-size: 14px !important;
          }

          .game-info {
            flex-wrap: wrap;
            gap: 12px !important;
          }
        }
      `}</style>


      {/* =====================================================
          DOT GRID
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position:
            'fixed',

          inset: 0,

          zIndex: 0,

          pointerEvents:
            'none',

          backgroundImage:
            'radial-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',

          backgroundSize:
            '28px 28px',

          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 78%)',

          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 78%)',
        }}
      />


      {/* =====================================================
          ORANGE GLOW
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position:
            'fixed',

          top: -380,

          left: '50%',

          transform:
            'translateX(-50%)',

          width: 1000,

          height: 700,

          borderRadius:
            '50%',

          background:
            'radial-gradient(circle,rgba(255,106,26,.16),transparent 68%)',

          pointerEvents:
            'none',

          zIndex: 0,
        }}
      />


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        className="premium-nav"
        style={{
          position:
            'relative',

          top: 21,

          left: '50%',

          transform:
            'translateX(-50%)',

          width:
            'min(1180px, calc(100% - 40px))',

          height: 70,

          borderRadius:
            40,

          background:
            'rgba(10,10,10,.92)',

          border:
            '1px solid rgba(255,255,255,.06)',

          boxShadow:
            '0 15px 50px rgba(0,0,0,.4)',

          display:
            'flex',

          alignItems:
            'center',

          padding:
            '0 22px 0 28px',

          zIndex: 20,
        }}
      >

        {/* BRAND */}

        <TransitionLink
          href="/"
          style={{
            display:
              'flex',

            alignItems:
              'center',

            gap: 12,

            color:
              '#ffffff',

            textDecoration:
              'none',

            minWidth:
              200,
          }}
        >
          <img
            src="/icon.png"
            alt=""
            width={30}
            height={30}
            style={{
              display:
                'block',

              filter:
                'drop-shadow(0 0 10px rgba(255,106,26,.35))',
            }}
          />

          <span
            className="nav-brand"
            style={{
              fontFamily:
                "'Space Grotesk', sans-serif",

              fontSize: 21,

              fontWeight: 600,

              letterSpacing:
                '-.7px',
            }}
          >
            illness.lol
          </span>
        </TransitionLink>


        {/* CENTER LINKS */}

        <div
          className="desktop-links"
          style={{
            position:
              'absolute',

            left: '50%',

            transform:
              'translateX(-50%)',

            display:
              'flex',

            alignItems:
              'center',

            gap: 5,
          }}
        >
          {[
            [
              'Help Center',
              '/help',
            ],
            [
              'Discord',
              'https://discord.gg/R4tyQ4h3K5',
            ],
            [
              'Leaderboard',
              '/leaderboard',
            ],
            [
              'Pricing',
              '/pricing',
            ],
            [
              'Questions',
              '/questions',
            ],
          ].map(
            ([label, href]) => (
              <TransitionLink
                key={label}
                href={href}
                target={
                  label === 'Discord'
                    ? '_blank'
                    : undefined
                }
                rel={
                  label === 'Discord'
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="premium-nav-link"
                style={{
                  color:
                    COLORS.muted,

                  textDecoration:
                    'none',

                  fontSize:
                    14,

                  padding:
                    '9px 13px',

                  whiteSpace:
                    'nowrap',

                  border:
                    '1px solid transparent',

                  borderRadius:
                    12,
                }}
              >
                {label}
              </TransitionLink>
            )
          )}
        </div>


        {/* RIGHT SIDE */}

        <div
          style={{
            marginLeft:
              'auto',

            display:
              'flex',

            alignItems:
              'center',

            gap: 8,
          }}
        >
          <TransitionLink
            href="/"
            className="premium-nav-link nav-home"
            style={{
              color:
                COLORS.muted,

              textDecoration:
                'none',

              fontSize:
                14,

              padding:
                '9px 13px',

              border:
                '1px solid transparent',

              borderRadius:
                12,
            }}
          >
            Home
          </TransitionLink>

          <TransitionLink
            href="/dashboard"
            style={{
              color:
                '#000000',

              background:
                COLORS.orange,

              textDecoration:
                'none',

              fontSize:
                14,

              fontWeight:
                600,

              padding:
                '12px 18px',

              borderRadius:
                25,

              border:
                '1px solid transparent',

              boxShadow:
                '0 0 18px rgba(255,106,26,.25)',
            }}
          >
            Dashboard
          </TransitionLink>
        </div>
      </nav>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section
        style={{
          position:
            'relative',

          zIndex: 2,

          textAlign:
            'center',

          padding:
            '150px 20px 55px',
        }}
      >

        <div
          style={{
            display:
              'inline-flex',

            alignItems:
              'center',

            gap: 8,

            padding:
              '7px 12px',

            borderRadius:
              20,

            border:
              '1px solid rgba(255,106,26,.25)',

            background:
              'rgba(255,106,26,.07)',

            color:
              COLORS.orangeBright,

            fontSize:
              12,

            fontWeight:
              600,

            marginBottom:
              20,
          }}
        >
          ✦ PREMIUM
        </div>


        <h1
          className="premium-title"
          style={{
            fontFamily:
              "'Space Grotesk', sans-serif",

            fontSize:
              58,

            lineHeight:
              1.05,

            letterSpacing:
              '-2px',

            margin:
              0,

            fontWeight:
              600,
          }}
        >
          Coming Soon
          <span
            style={{
              color:
                COLORS.orange,
            }}
          >
            .
          </span>
        </h1>


        <p
          className="premium-subtitle"
          style={{
            maxWidth:
              560,

            margin:
              '18px auto 0',

            color:
              COLORS.muted,

            fontSize:
              16,

            lineHeight:
              1.7,
          }}
        >
          Premium features are
          currently being crafted.
          While you wait, take a
          break and see how high
          you can score.
        </p>
      </section>


      {/* =====================================================
          GAME
      ===================================================== */}

      <section
        style={{
          position:
            'relative',

          zIndex: 3,

          display:
            'flex',

          flexDirection:
            'column',

          alignItems:
            'center',

          padding:
            '0 16px',
        }}
      >

        <div
          className="game-container"
          style={{
            position:
              'relative',

            borderRadius:
              26,

            padding:
              2,

            background:
              'linear-gradient(135deg,rgba(255,106,26,.7),rgba(255,255,255,.08),rgba(255,106,26,.35))',

            boxShadow:
              '0 0 40px rgba(255,106,26,.12), 0 30px 100px rgba(0,0,0,.8)',
          }}
        >

          <div
            style={{
              position:
                'relative',

              overflow:
                'hidden',

              borderRadius:
                24,

              background:
                '#030303',
            }}
          >

            <canvas
              ref={canvasRef}
              className="game-canvas"
              aria-label="Flappy Bird mini game"
            />


            {/* START OVERLAY */}

            {!started && (
              <div
                style={{
                  position:
                    'absolute',

                  inset: 0,

                  display:
                    'flex',

                  flexDirection:
                    'column',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  background:
                    'rgba(0,0,0,.35)',

                  pointerEvents:
                    'none',
                }}
              >
                <div
                  style={{
                    fontFamily:
                      "'Space Grotesk', sans-serif",

                    fontSize:
                      26,

                    fontWeight:
                      600,

                    marginBottom:
                      8,
                  }}
                >
                  Flappy
                  <span
                    style={{
                      color:
                        COLORS.orange,
                    }}
                  >
                    .
                  </span>
                </div>

                <div
                  style={{
                    color:
                      COLORS.muted,

                    fontSize:
                      13,
                  }}
                >
                  Click or press
                  SPACE to start
                </div>
              </div>
            )}


            {/* GAME OVER */}

            {gameOver && (
              <div
                style={{
                  position:
                    'absolute',

                  inset: 0,

                  display:
                    'flex',

                  flexDirection:
                    'column',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  background:
                    'rgba(0,0,0,.62)',

                  backdropFilter:
                    'blur(5px)',
                }}
              >
                <div
                  style={{
                    fontFamily:
                      "'Space Grotesk', sans-serif",

                    fontSize:
                      28,

                    fontWeight:
                      600,
                  }}
                >
                  Game Over
                </div>

                <div
                  style={{
                    marginTop:
                      8,

                    color:
                      COLORS.muted,

                    fontSize:
                      14,
                  }}
                >
                  Score: {score}
                </div>

                <div
                  style={{
                    marginTop:
                      3,

                    color:
                      COLORS.orangeBright,

                    fontSize:
                      13,
                  }}
                >
                  Best: {best}
                </div>

                <button
                  type="button"
                  onClick={playAgain}
                  className="game-button"
                  style={{
                    marginTop:
                      20,

                    border:
                      '1px solid rgba(255,255,255,.1)',

                    padding:
                      '11px 20px',

                    borderRadius:
                      12,

                    background:
                      COLORS.orange,

                    color:
                      '#000000',

                    fontWeight:
                      600,

                    cursor:
                      'pointer',

                    boxShadow:
                      '0 0 25px rgba(255,106,26,.25)',
                  }}
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>


        {/* GAME INFO */}

        <div
          className="game-info"
          style={{
            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            gap:
              30,

            marginTop:
              20,

            color:
              COLORS.faint,

            fontSize:
              12,
          }}
        >
          <span>
            🖱 Click to flap
          </span>

          <span>
            ⌨ SPACE to flap
          </span>

          <span>
            🏆 Best: {best}
          </span>
        </div>
      </section>


      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div
        style={{
          position:
            'relative',

          zIndex: 2,

          textAlign:
            'center',

          marginTop:
            80,

          color:
            'rgba(255,255,255,.28)',

          fontSize:
            12,
        }}
      >
        More premium features
        coming soon.
      </div>
    </main>
  )
}
