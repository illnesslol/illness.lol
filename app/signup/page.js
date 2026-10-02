'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/app/lib/supabase-client'
import { useTransition } from '@/components/PageTransition'

const COLORS = {
  bg: '#000000',
  surface: '#0c0c0c',
  surfaceAlt: '#141414',
  orange: '#ff6a1a',
  orangeBright: '#ff8a3d',
  orangeSoft: 'rgba(255,106,26,.16)',
  orangeBorder: 'rgba(255,106,26,.5)',
  white: '#ffffff',
  muted: 'rgba(255,255,255,.72)',
  faint: 'rgba(255,255,255,.4)',
  line: 'rgba(255,255,255,.08)',
}

export default function SignupPage() {
  const { navigate } = useTransition()
  const canvasRef = useRef(null)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')
  const [agreed, setAgreed] = useState(false)

  /*
   * FALLING LEAVES
   * Same style/behavior as the homepage.
   */
  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()

    window.addEventListener('resize', resize)

    const leafColors = [
      '#ff6a1a',
      '#ff8a3d',
      '#e85a0c',
      '#ffffff',
    ]

    const makeLeaf = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 9,
      speed: Math.random() * 0.35 + 0.35,
      swayAmp: Math.random() * 30 + 20,
      swaySpeed: Math.random() * 0.012 + 0.006,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.012,
      opacity: Math.random() * 0.2 + 0.22,
      color:
        leafColors[
          Math.floor(Math.random() * leafColors.length)
        ],
      baseX: 0,
    })

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

      ctx.globalAlpha = opacity * 0.9
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1

      ctx.beginPath()

      ctx.moveTo(0, -size * 0.85)
      ctx.lineTo(0, size * 1.15)

      ctx.stroke()

      ctx.globalAlpha = 1
    }

    const leaves = Array.from(
      { length: 10 },
      () => makeLeaf()
    )

    leaves.forEach((leaf) => {
      leaf.baseX = leaf.x
    })

    let animationFrame
    let tick = 0

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      tick += 1

      leaves.forEach((leaf) => {
        if (!reduceMotion) {
          leaf.y += leaf.speed
          leaf.rotation += leaf.spin
        }

        const sway = reduceMotion
          ? 0
          : Math.sin(
              tick * leaf.swaySpeed +
                leaf.phase
            ) * leaf.swayAmp

        const x = leaf.baseX + sway

        if (leaf.y > canvas.height + 40) {
          leaf.y = -30
          leaf.baseX =
            Math.random() * canvas.width
        }

        ctx.save()

        ctx.translate(x, leaf.y)

        ctx.rotate(
          leaf.rotation +
            Math.sin(
              tick * leaf.swaySpeed +
                leaf.phase
            ) *
              0.5
        )

        drawLeaf(
          leaf.size,
          leaf.color,
          leaf.opacity
        )

        ctx.restore()
      })

      animationFrame =
        requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)

      window.removeEventListener(
        'resize',
        resize
      )
    }
  }, [])

  /*
   * USERNAME AVAILABILITY
   *
   * 1-24 characters.
   * Letters, numbers and underscores.
   */
  useEffect(() => {
    const clean = username.trim().toLowerCase()

    if (!clean) {
      setUsernameStatus('idle')
      return
    }

    if (clean.length < 1 || clean.length > 24) {
      setUsernameStatus('invalid')
      return
    }

    if (!/^[a-z0-9_]+$/.test(clean)) {
      setUsernameStatus('invalid')
      return
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      setUsernameStatus('checking')

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', clean)
        .maybeSingle()

      if (cancelled) return

      if (error) {
        console.error(error)
        setUsernameStatus('error')
        return
      }

      setUsernameStatus(
        data ? 'taken' : 'available'
      )
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [username])

  const passwordStrong =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)

  const canSubmit =
    username.trim().length >= 1 &&
    username.trim().length <= 24 &&
    usernameStatus === 'available' &&
    email.trim() &&
    passwordStrong &&
    password === confirmPassword &&
    agreed &&
    !loading

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    const cleanUsername =
      username.trim().toLowerCase()

    const cleanEmail =
      email.trim().toLowerCase()

    if (
      cleanUsername.length < 1 ||
      cleanUsername.length > 24
    ) {
      setError(
        'Username must be between 1 and 24 characters.'
      )
      return
    }

    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      setError(
        'Username can only contain letters, numbers, and underscores.'
      )
      return
    }

    if (!agreed) {
      setError(
        'Please agree to the Terms of Service and Privacy Policy.'
      )
      return
    }

    if (usernameStatus !== 'available') {
      setError(
        'Please choose an available username.'
      )
      return
    }

    if (!passwordStrong) {
      setError(
        'Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              username: cleanUsername,
            },
          },
        })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.session) {
        navigate('/dashboard')
        return
      }

      setError(
        'Account created! Check your email to confirm your account, then log in.'
      )

      setLoading(false)
    } catch (err) {
      console.error(err)

      setError(
        'Something went wrong. Please try again.'
      )

      setLoading(false)
    }
  }

  const handleOAuth = async (provider) => {
    setError('')
    setOauthLoading(provider)

    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo:
              `${window.location.origin}/dashboard`,
          },
        })

      if (error) {
        setError(error.message)
        setOauthLoading('')
      }
    } catch (err) {
      console.error(err)

      setError(
        'Unable to continue with that provider.'
      )

      setOauthLoading('')
    }
  }

  const handlePasskey = async () => {
    setError('')
    setOauthLoading('passkey')

    try {
      if (!supabase.auth.signInWithPasskey) {
        setError(
          'Passkeys are not available yet. Enable Passkeys in your Supabase project first.'
        )

        setOauthLoading('')
        return
      }

      const { data, error } =
        await supabase.auth.signInWithPasskey()

      if (error) {
        setError(error.message)
        setOauthLoading('')
        return
      }

      if (data?.session) {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error(err)

      setError(
        'Passkey sign in was cancelled or failed.'
      )

      setOauthLoading('')
    }
  }

  return (
    <main className="signup-page">
      {/* Falling leaves */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="leaf-canvas"
      />

      {/* Homepage-style dot grid */}
      <div
        aria-hidden="true"
        className="dot-grid"
      />

      {/* Homepage-style orange glow */}
      <div
        aria-hidden="true"
        className="orange-glow"
      />

      <section className="signup-card">
        {/* illness.lol + leaf INSIDE the card */}
        <div className="brand">
          <img
            src="/icon.png"
            alt=""
            width={38}
            height={38}
          />

          <span>illness.lol</span>

          <span className="brand-leaf">
            🍂
          </span>
        </div>

        <h1>Create account</h1>

        <p className="subtitle">
          Join illness.lol and create your profile
        </p>

        {/* OAuth */}
        <div className="social-row">
          <button
            type="button"
            className="social-button"
            onClick={() =>
              handleOAuth('discord')
            }
            disabled={!!oauthLoading}
          >
            <DiscordIcon />
            <span>Discord</span>
          </button>

          <button
            type="button"
            className="social-button"
            onClick={() =>
              handleOAuth('google')
            }
            disabled={!!oauthLoading}
          >
            <GoogleIcon />
            <span>Google</span>
          </button>
        </div>

        {/* Passkey */}
        <button
          type="button"
          className="passkey-button"
          onClick={handlePasskey}
          disabled={!!oauthLoading}
        >
          {/* No emoji here */}
          <PasskeyIcon />

          <span>
            {oauthLoading === 'passkey'
              ? 'Opening passkey...'
              : 'Continue with passkey'}
          </span>
        </button>

        <div className="divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="field">
            <label>Username</label>

            <div
              className={`input-wrap ${
                usernameStatus === 'available'
                  ? 'success'
                  : usernameStatus === 'taken' ||
                    usernameStatus === 'invalid'
                  ? 'danger'
                  : ''
              }`}
            >
              <UserIcon />

              <input
                type="text"
                placeholder="your_username"
                value={username}
                maxLength={24}
                autoComplete="username"
                onChange={(e) =>
                  setUsername(
                    e.target.value
                      .toLowerCase()
                      .replace(
                        /[^a-z0-9_]/g,
                        ''
                      )
                  )
                }
              />

              {usernameStatus ===
                'checking' && (
                <span className="status checking">
                  Checking...
                </span>
              )}

              {usernameStatus ===
                'available' && (
                <span className="status available">
                  ✓ Available
                </span>
              )}

              {usernameStatus === 'taken' && (
                <span className="status taken">
                  Taken
                </span>
              )}
            </div>

            {usernameStatus ===
              'invalid' &&
              username.length > 0 && (
                <small className="hint">
                  1–24 characters. Letters,
                  numbers, and underscores only.
                </small>
              )}
          </div>

          {/* Email */}
          <div className="field">
            <label>Email</label>

            <div className="input-wrap">
              <EmailIcon />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <label>Password</label>

            <div className="input-wrap">
              {/* Little lock icon next to password */}
              <LockIcon />

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Create a strong password"
                value={password}
                autoComplete="new-password"
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
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

            {password.length > 0 && (
              <div className="password-hint">
                {passwordStrong ? (
                  <span className="good">
                    ✓ Strong password
                  </span>
                ) : (
                  <span>
                    Use 8+ characters with
                    uppercase, lowercase, and a
                    number.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="field">
            <label>
              Confirm password
            </label>

            <div
              className={`input-wrap ${
                confirmPassword.length > 0
                  ? password ===
                    confirmPassword
                    ? 'success'
                    : 'danger'
                  : ''
              }`}
            >
              <LockIcon />

              <input
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Repeat your password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>

            {confirmPassword.length >
              0 && (
              <div className="password-hint">
                {password ===
                confirmPassword ? (
                  <span className="good">
                    ✓ Passwords match
                  </span>
                ) : (
                  <span className="bad">
                    Passwords don't match
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Terms */}
          <label className="terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) =>
                setAgreed(e.target.checked)
              }
            />

            <span className="custom-check">
              {agreed ? '✓' : ''}
            </span>

            <span className="terms-text">
              I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </span>
          </label>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* Signup button */}
          <button
            type="submit"
            className="continue-button"
            disabled={!canSubmit}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{' '}
          <a href="/login">Sign in</a>
        </p>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .signup-page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
          font-family:
            'Inter',
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            sans-serif;
        }

        .leaf-canvas {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .dot-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;

          background-image:
            radial-gradient(
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            );

          background-size: 28px 28px;

          mask-image:
            radial-gradient(
              ellipse 75% 65% at 50% 35%,
              #000 20%,
              transparent 78%
            );

          -webkit-mask-image:
            radial-gradient(
              ellipse 75% 65% at 50% 35%,
              #000 20%,
              transparent 78%
            );
        }

        .orange-glow {
          position: fixed;
          top: -380px;
          left: 50%;
          transform: translateX(-50%);
          width: 1000px;
          height: 700px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(255, 106, 26, 0.16),
              transparent 68%
            );
          pointer-events: none;
          z-index: 0;
        }

        .signup-card {
          width: 100%;
          max-width: 450px;
          position: relative;
          z-index: 2;

          background:
            rgba(12, 12, 12, 0.94);

          border:
            1px solid rgba(255, 255, 255, 0.08);

          border-radius: 20px;

          padding:
            30px 32px 28px;

          box-shadow:
            0 30px 100px rgba(0, 0, 0, 0.85),
            0 0 40px rgba(255, 106, 26, 0.08);

          backdrop-filter: blur(20px);
        }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-bottom: 18px;

          font-family:
            'Space Grotesk',
            sans-serif;

          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .brand img {
          display: block;
          filter:
            drop-shadow(
              0 0 10px
                rgba(255, 106, 26, 0.35)
            );
        }

        .brand-leaf {
          font-size: 21px;
          line-height: 1;
        }

        h1 {
          margin: 0;
          text-align: center;

          font-family:
            'Space Grotesk',
            sans-serif;

          font-size: 28px;
          letter-spacing: -0.8px;
          font-weight: 600;
        }

        .subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          margin: 7px 0 25px;
        }

        .social-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .social-button,
        .passkey-button {
          border:
            1px solid
            rgba(255, 255, 255, 0.1);

          background:
            rgba(255, 255, 255, 0.035);

          color: white;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;

          transition:
            background 0.15s,
            border 0.15s,
            transform 0.15s,
            box-shadow 0.15s;
        }

        .social-button {
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          font-size: 13px;
          font-weight: 500;
        }

        .social-button:hover,
        .passkey-button:hover {
          background:
            rgba(255, 106, 26, 0.08);

          border-color:
            rgba(255, 106, 26, 0.35);

          transform: translateY(-1px);

          box-shadow:
            0 0 18px
              rgba(255, 106, 26, 0.08);
        }

        .social-button:disabled,
        .passkey-button:disabled {
          opacity: 0.55;
          cursor: default;
          transform: none;
        }

        .passkey-button {
          width: 100%;
          height: 46px;
          margin-top: 10px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          font-size: 13px;
          font-weight: 600;

          color: #fff;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 25px 0;
        }

        .divider span {
          flex: 1;
          height: 1px;
          background:
            rgba(255, 255, 255, 0.08);
        }

        .divider p {
          margin: 0;
          color:
            rgba(255, 255, 255, 0.35);
          font-size: 11px;
          font-weight: 600;
        }

        .field {
          margin-bottom: 16px;
        }

        label {
          display: block;
          color:
            rgba(255, 255, 255, 0.72);

          font-size: 13px;
          font-weight: 600;
          margin-bottom: 7px;
        }

        .input-wrap {
          height: 46px;

          display: flex;
          align-items: center;

          border:
            1px solid
            rgba(255, 255, 255, 0.1);

          background:
            rgba(255, 255, 255, 0.035);

          border-radius: 10px;

          transition:
            border 0.15s,
            background 0.15s,
            box-shadow 0.15s;
        }

        .input-wrap:focus-within {
          border-color:
            rgba(255, 106, 26, 0.65);

          background:
            rgba(255, 255, 255, 0.05);

          box-shadow:
            0 0 0 3px
              rgba(255, 106, 26, 0.08);
        }

        .input-wrap.success {
          border-color:
            rgba(75, 190, 115, 0.55);
        }

        .input-wrap.danger {
          border-color:
            rgba(220, 80, 70, 0.55);
        }

        .input-icon {
          width: 42px;
          display: flex;
          justify-content: center;
          align-items: center;
          color:
            rgba(255, 255, 255, 0.42);
          flex-shrink: 0;
        }

        .input-wrap input {
          flex: 1;
          min-width: 0;
          height: 100%;

          border: none;
          outline: none;
          background: transparent;
          color: white;

          font-family: inherit;
          font-size: 14px;
        }

        .input-wrap input::placeholder {
          color:
            rgba(255, 255, 255, 0.35);
        }

        .status {
          font-size: 11px;
          font-weight: 600;
          padding-right: 12px;
          white-space: nowrap;
        }

        .status.available {
          color: #65c982;
        }

        .status.taken {
          color: #ef726b;
        }

        .status.checking {
          color: #c89b72;
        }

        .eye-button {
          width: 40px;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;
          background: transparent;
          color:
            rgba(255, 255, 255, 0.4);

          cursor: pointer;
          padding: 0;
        }

        .eye-button:hover {
          color:
            rgba(255, 255, 255, 0.85);
        }

        .hint,
        .password-hint {
          display: block;
          margin-top: 6px;
          font-size: 11px;
          color:
            rgba(255, 255, 255, 0.35);
        }

        .good {
          color: #65c982;
        }

        .bad {
          color: #ef726b;
        }

        .terms {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          cursor: pointer;
          margin: 20px 0 16px;
        }

        .terms input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .custom-check {
          width: 17px;
          height: 17px;
          flex: 0 0 17px;

          border-radius: 4px;

          border:
            1px solid
            rgba(255, 255, 255, 0.28);

          background:
            rgba(255, 255, 255, 0.03);

          display: flex;
          align-items: center;
          justify-content: center;

          color: #fff;
          font-size: 11px;

          margin-top: 1px;

          transition: all 0.15s;
        }

        .terms input:checked
          + .custom-check {
          background: #ff6a1a;
          border-color: #ff8a3d;

          box-shadow:
            0 0 12px
              rgba(255, 106, 26, 0.2);
        }

        .terms-text {
          color:
            rgba(255, 255, 255, 0.55);

          font-size: 12px;
          line-height: 1.45;
          font-weight: 400;
        }

        .terms-text a {
          color: #ff8a3d;
          text-decoration: none;
        }

        .terms-text a:hover {
          color: #fff;
          text-decoration: underline;
        }

        .error-box {
          border:
            1px solid
            rgba(225, 80, 70, 0.25);

          background:
            rgba(225, 80, 70, 0.08);

          color: #f18a83;

          border-radius: 8px;

          padding: 10px 12px;

          font-size: 12px;
          line-height: 1.45;

          margin-bottom: 12px;
        }

        .continue-button {
          width: 100%;
          height: 46px;

          border: none;
          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #ff6a1a,
              #ff8a3d
            );

          color: #000;

          font-family: inherit;
          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 0 20px
              rgba(255, 106, 26, 0.25);

          transition:
            transform 0.15s,
            filter 0.15s,
            opacity 0.15s,
            box-shadow 0.15s;
        }

        .continue-button:hover:not(
            :disabled
          ) {
          filter: brightness(1.08);
          transform: translateY(-1px);

          box-shadow:
            0 0 25px
              rgba(255, 106, 26, 0.35),
            0 0 55px
              rgba(255, 106, 26, 0.12);
        }

        .continue-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .spinner {
          display: inline-block;

          width: 13px;
          height: 13px;

          border-radius: 50%;

          border:
            2px solid
            rgba(0, 0, 0, 0.25);

          border-top-color: #000;

          animation:
            spin 0.7s linear infinite;

          margin-right: 7px;

          vertical-align: -2px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .login-text {
          text-align: center;

          color:
            rgba(255, 255, 255, 0.4);

          font-size: 12px;

          margin: 21px 0 0;
        }

        .login-text a {
          color: #ff8a3d;
          text-decoration: none;
          font-weight: 600;
        }

        .login-text a:hover {
          color: #fff;
        }

        @media (max-width: 520px) {
          .signup-page {
            padding: 20px 12px;
            align-items: flex-start;
          }

          .signup-card {
            margin-top: 10px;
            padding: 28px 20px 24px;
          }

          h1 {
            font-size: 25px;
          }

          .social-button span {
            display: none;
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
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
      </svg>
    </span>
  )
}

function EmailIcon() {
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
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />
        <path d="m3 7 9 6 9-6" />
      </svg>
    </span>
  )
}

function EyeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.8" />
      <path d="M6.3 6.8C3.9 8.3 2.5 12 2.5 12s3.5 6 9.5 6c1 0 2-.2 2.8-.5" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}

function PasskeyIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l7-7" />
      <path d="m16 5 3 3" />
      <path d="m14 7 3 3" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
      />

      <path
        fill="#34A853"
        d="M12 21.6c2.63 0 4.84-.87 6.45-2.37l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.52A9.75 9.75 0 0 0 12 21.6Z"
      />

      <path
        fill="#FBBC05"
        d="M6.53 13.68A5.86 5.86 0 0 1 6.22 12c0-.58.1-1.14.31-1.68V7.8H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.2l3.24-2.52Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.29c1.43 0 2.72.49 3.74 1.46l2.8-2.8C16.84 3.38 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.4l3.24 2.52C7.3 8.01 9.46 6.29 12 6.29Z"
      />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fill="#fff"
        d="M19.54 5.27A16.2 16.2 0 0 0 15.57 4l-.5 1.02a14.7 14.7 0 0 0-6.14 0L8.43 4a16.2 16.2 0 0 0-3.97 1.27C1.95 9.08 1.27 12.8 1.61 16.47a16.3 16.3 0 0 0 4.88 2.5l1.18-1.62c-.65-.24-1.28-.55-1.86-.9l.45-.35c3.59 1.68 7.49 1.68 11.03 0l.45.35c-.59.35-1.21.65-1.86.9l1.18 1.62a16.3 16.3 0 0 0 4.88-2.5c.4-4.28-.68-7.97-2.4-11.2ZM8.03 14.05c-1.08 0-1.96-1-1.96-2.22s.86-2.22 1.96-2.22 1.98 1 1.96 2.22c0 1.22-.86 2.22-1.96 2.22Zm7.94 0c-1.08 0-1.96-1-1.96-2.22s.86-2.22 1.96-2.22 1.98 1 1.96 2.22c0 1.22-.86 2.22-1.96 2.22Z"
      />
    </svg>
  )
}
