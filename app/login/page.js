'use client'

import { useEffect, useRef, useState } from 'react'
import { useTransition } from '@/components/PageTransition'

export default function LoginPage() {
  const { navigate } = useTransition()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr

      canvas.style.width = '100%'
      canvas.style.height = '100%'

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const colors = ['#ff6a1a', '#ff8a3d', '#e85a0c', '#ffffff']

    const makeLeaf = () => ({
      x: Math.random() * window.innerWidth,
      y: -40 - Math.random() * window.innerHeight,
      size: Math.random() * 5 + 8,
      speed: Math.random() * 0.35 + 0.3,
      swayAmp: Math.random() * 30 + 20,
      swaySpeed: Math.random() * 0.012 + 0.006,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.012,
      opacity: Math.random() * 0.18 + 0.18,
      color: colors[Math.floor(Math.random() * colors.length)],
      baseX: 0,
    })

    const leaves = Array.from({ length: 14 }, makeLeaf)

    leaves.forEach((leaf) => {
      leaf.baseX = leaf.x
      leaf.y = Math.random() * window.innerHeight
    })

    let animationFrame
    let tick = 0

    const drawLeaf = (size, color, opacity) => {
      ctx.globalAlpha = opacity
      ctx.fillStyle = color

      ctx.beginPath()

      ctx.moveTo(0, -size)

      ctx.bezierCurveTo(
        size * 0.95,
        -size * 0.45,
        size * 0.7,
        size * 0.65,
        0,
        size
      )

      ctx.bezierCurveTo(
        -size * 0.7,
        size * 0.65,
        -size * 0.95,
        -size * 0.45,
        0,
        -size
      )

      ctx.fill()

      ctx.globalAlpha = opacity * 0.85
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1

      ctx.beginPath()
      ctx.moveTo(0, -size * 0.85)
      ctx.lineTo(0, size * 1.15)
      ctx.stroke()

      ctx.globalAlpha = 1
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      tick += 1

      leaves.forEach((leaf) => {
        if (!reduceMotion) {
          leaf.y += leaf.speed
          leaf.rotation += leaf.spin
        }

        const sway = reduceMotion
          ? 0
          : Math.sin(tick * leaf.swaySpeed + leaf.phase) * leaf.swayAmp

        const x = leaf.baseX + sway

        if (leaf.y > window.innerHeight + 50) {
          leaf.y = -40
          leaf.baseX = Math.random() * window.innerWidth
        }

        ctx.save()

        ctx.translate(x, leaf.y)

        ctx.rotate(
          leaf.rotation +
            Math.sin(tick * leaf.swaySpeed + leaf.phase) * 0.5
        )

        drawLeaf(leaf.size, leaf.color, leaf.opacity)

        ctx.restore()
      })

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!identifier.trim() || !password) {
      setError('Please enter your username/email and password.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setLoading(false)
        return
      }

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <canvas
        ref={canvasRef}
        className="leaves-canvas"
        aria-hidden="true"
      />

      <div className="orange-glow glow-top" />
      <div className="orange-glow glow-left" />
      <div className="orange-glow glow-right" />

      <section className="login-card">
        {/* BRAND */}

        <div className="brand">
          <img
            src="/icon.png"
            alt=""
            width={34}
            height={34}
            className="brand-icon"
          />

          <span>illness.lol</span>
        </div>

        {/* HEADING */}

        <h1>Welcome back</h1>

        <p className="subtitle">
          Sign in to your illness.lol account
        </p>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          {/* USERNAME / EMAIL */}

          <div className="field">
            <label htmlFor="identifier">
              Username or Email
            </label>

            <div className="input-wrap">
              <UserIcon />

              <input
                id="identifier"
                type="text"
                placeholder="you@example.com"
                value={identifier}
                autoComplete="username"
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="field password-field">
            <label htmlFor="password">Password</label>

            <div className="input-wrap">
              <LockIcon />

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}

          <div className="forgot-row">
            <a href="/forgot-password">
              Forgot password?
            </a>
          </div>

          {/* ERROR */}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* LOGIN */}

          <button
            type="submit"
            className={`continue-button ${
              identifier.trim() && password && !loading
                ? 'ready'
                : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </button>
        </form>

        {/* SIGN UP */}

        <p className="signup-text">
          Don't have an account?{' '}
          <a href="/signup">Create one</a>
        </p>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          width: 100%;
          background: #000;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            sans-serif;
        }

        .login-page::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;

          background-image: radial-gradient(
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );

          background-size: 28px 28px;

          mask-image: radial-gradient(
            ellipse 75% 70% at 50% 40%,
            #000 15%,
            transparent 80%
          );

          -webkit-mask-image: radial-gradient(
            ellipse 75% 70% at 50% 40%,
            #000 15%,
            transparent 80%
          );

          opacity: 0.65;
        }

        .login-card {
          width: 100%;
          max-width: 460px;

          position: relative;
          z-index: 5;

          background: rgba(10, 10, 10, 0.94);

          border: 1px solid rgba(255, 255, 255, 0.09);

          border-radius: 22px;

          padding: 30px 30px 25px;

          box-shadow:
            0 30px 100px rgba(0, 0, 0, 0.85),
            0 0 40px rgba(255, 106, 26, 0.07);

          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .brand {
          display: flex;
          justify-content: center;
          align-items: center;

          gap: 9px;

          margin-bottom: 20px;

          color: #fff;

          font-family:
            'Space Grotesk',
            Inter,
            sans-serif;

          font-size: 20px;
          font-weight: 600;

          letter-spacing: -0.5px;
        }

        .brand-icon {
          display: block;
          object-fit: contain;

          filter:
            drop-shadow(
              0 0 10px rgba(255, 106, 26, 0.35)
            );
        }

        h1 {
          margin: 0;

          text-align: center;

          font-family:
            'Space Grotesk',
            Inter,
            sans-serif;

          font-size: 29px;
          line-height: 1.15;

          letter-spacing: -1px;

          font-weight: 600;
        }

        .subtitle {
          text-align: center;

          color: rgba(255, 255, 255, 0.48);

          font-size: 13px;

          margin: 8px 0 24px;

          line-height: 1.4;
        }

        form {
          width: 100%;
        }

        .field {
          margin-bottom: 14px;
        }

        .password-field {
          margin-bottom: 8px;
        }

        .field label {
          display: block;

          color: rgba(255, 255, 255, 0.78);

          font-size: 12px;
          font-weight: 600;

          margin: 0 0 6px;

          line-height: 1.2;
        }

        .input-wrap {
          width: 100%;
          height: 45px;

          display: flex;
          align-items: center;

          border: 1px solid rgba(255, 255, 255, 0.1);

          background: rgba(255, 255, 255, 0.035);

          border-radius: 10px;

          transition:
            border-color 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease;
        }

        .input-wrap:focus-within {
          border-color: rgba(255, 106, 26, 0.65);

          background: rgba(255, 255, 255, 0.045);

          box-shadow:
            0 0 0 3px rgba(255, 106, 26, 0.08);
        }

        :global(.input-icon) {
          width: 42px;
          flex: 0 0 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: rgba(255, 255, 255, 0.42);
        }

        .input-wrap input {
          flex: 1;
          min-width: 0;

          height: 100%;

          border: none;
          outline: none;

          background: transparent;

          color: #fff;

          font-family: inherit;
          font-size: 13px;

          padding: 0;
        }

        .input-wrap input::placeholder {
          color: rgba(255, 255, 255, 0.32);
        }

        .eye-button {
          width: 40px;
          height: 100%;

          border: none;
          background: transparent;

          color: rgba(255, 255, 255, 0.4);

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          transition: color 0.15s ease;
        }

        .eye-button:hover {
          color: rgba(255, 255, 255, 0.85);
        }

        .forgot-row {
          display: flex;
          justify-content: flex-end;

          margin: 2px 0 18px;
        }

        .forgot-row a {
          color: rgba(255, 255, 255, 0.35);

          font-size: 11px;

          text-decoration: none;

          transition:
            color 0.15s ease;
        }

        .forgot-row a:hover {
          color: #ff8a3d;
        }

        .error-box {
          border: 1px solid rgba(235, 78, 69, 0.3);

          background: rgba(235, 78, 69, 0.08);

          color: #f18a83;

          border-radius: 9px;

          padding: 9px 11px;

          font-size: 11px;

          line-height: 1.4;

          margin-bottom: 11px;
        }

        .continue-button {
          width: 100%;
          height: 46px;

          border: none;
          border-radius: 11px;

          background: #ff6a1a;

          color: #000;

          font-family: inherit;

          font-size: 13px;
          font-weight: 700;

          cursor: not-allowed;

          opacity: 0.35;

          transition:
            transform 0.18s ease,
            filter 0.18s ease,
            opacity 0.18s ease,
            box-shadow 0.18s ease;
        }

        .continue-button.ready {
          cursor: pointer;

          opacity: 1;

          box-shadow:
            0 0 20px rgba(255, 106, 26, 0.25);
        }

        .continue-button.ready:hover {
          filter: brightness(1.1);

          transform: translateY(-1px);

          box-shadow:
            0 0 28px rgba(255, 106, 26, 0.38);
        }

        .continue-button:disabled {
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;

          width: 13px;
          height: 13px;

          border-radius: 50%;

          border:
            2px solid rgba(0, 0, 0, 0.25);

          border-top-color: #000;

          animation:
            spin 0.7s linear infinite;

          margin-right: 7px;

          vertical-align: -2px;
        }

        .signup-text {
          text-align: center;

          color: rgba(255, 255, 255, 0.4);

          font-size: 11px;

          margin: 17px 0 0;
        }

        .signup-text a {
          color: #ff8a3d;

          text-decoration: none;

          font-weight: 600;

          transition: color 0.15s ease;
        }

        .signup-text a:hover {
          color: #ffa561;
        }

        .orange-glow {
          position: fixed;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(80px);

          z-index: 0;
        }

        .glow-top {
          width: 700px;
          height: 450px;

          top: -280px;
          left: 50%;

          transform: translateX(-50%);

          background:
            rgba(255, 106, 26, 0.13);
        }

        .glow-left {
          width: 280px;
          height: 280px;

          left: -160px;
          top: 35%;

          background:
            rgba(255, 106, 26, 0.07);
        }

        .glow-right {
          width: 280px;
          height: 280px;

          right: -160px;
          bottom: 10%;

          background:
            rgba(255, 106, 26, 0.07);
        }

        .leaves-canvas {
          position: fixed;

          inset: 0;

          width: 100%;
          height: 100%;

          pointer-events: none;

          z-index: 3;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .login-page {
            padding: 20px 12px;

            align-items: flex-start;
          }

          .login-card {
            margin-top: 12px;

            padding: 26px 19px 22px;
          }

          h1 {
            font-size: 26px;
          }
        }
      `}</style>
    </main>
  )
}

/* =========================================================
   ICONS
========================================================= */

function LockIcon() {
  return (
    <span className="input-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="4"
          y="10"
          width="16"
          height="11"
          rx="2"
        />

        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    </span>
  )
}

function UserIcon() {
  return (
    <span className="input-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle
          cx="12"
          cy="8"
          r="4"
        />

        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    </span>
  )
}

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 18 18" />

      <path d="M10.6 6.2A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.1 3.7" />

      <path d="M6.2 6.9C3.4 8.6 2 12 2 12s3.5 6 10 6c1.3 0 2.5-.2 3.5-.6" />

      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}
