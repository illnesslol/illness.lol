'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase-client'
import { useTransition } from '@/components/PageTransition'

export default function SignupPage() {
  const { navigate } = useTransition()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')
  const [agreed, setAgreed] = useState(false)

  /*
   * Username availability
   * 1–24 characters, letters / numbers / underscores
   * Uses the username_available() database function so the
   * profiles table doesn't need a public read policy.
   */
  useEffect(() => {
    const clean = username.trim().toLowerCase()

    if (!clean) {
      setUsernameStatus('idle')
      return
    }

    if (clean.length > 24 || !/^[a-z0-9_]+$/.test(clean)) {
      setUsernameStatus('invalid')
      return
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      setUsernameStatus('checking')

      const { data, error } = await supabase.rpc('username_available', {
        name: clean,
      })

      if (cancelled) return

      if (error) {
        console.error('Username check failed:', error)
        setUsernameStatus('error')
        return
      }

      setUsernameStatus(data ? 'available' : 'taken')
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

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  // 'error' means the check itself failed. We let the user continue and
  // the database (unique constraint) has the final say on duplicates.
  const usernameOk =
    usernameStatus === 'available' || usernameStatus === 'error'

  const canSubmit =
    username.trim().length >= 1 &&
    username.trim().length <= 24 &&
    usernameOk &&
    emailValid &&
    passwordStrong &&
    password === confirmPassword &&
    agreed &&
    !loading &&
    !oauthLoading

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setNotice('')

    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    if (
      cleanUsername.length < 1 ||
      cleanUsername.length > 24 ||
      !/^[a-z0-9_]+$/.test(cleanUsername)
    ) {
      setError(
        'Username must be 1–24 characters and can only contain letters, numbers, and underscores.'
      )
      return
    }

    if (!usernameOk) {
      setError('Please choose an available username.')
      return
    }

    if (!emailValid) {
      setError('Please enter a valid email address.')
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
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        console.error('Signup failed:', error)

        const msg = (error.message || '').toLowerCase()

        if (msg.includes('database error')) {
          setError(
            'That username may already be taken, or the profile could not be created. Try a different username.'
          )
        } else {
          setError(error.message)
        }

        setLoading(false)
        return
      }

      // Supabase returns a user with no identities when the email is
      // already registered (to avoid leaking which emails exist).
      if (data.user && data.user.identities?.length === 0) {
        setError('An account with this email already exists. Try signing in.')
        setLoading(false)
        return
      }

      if (data.session) {
        navigate('/dashboard')
        return
      }

      setNotice(
        'Account created! Check your email to confirm your account, then sign in.'
      )

      setLoading(false)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleOAuth = async (provider) => {
    setError('')
    setNotice('')
    setOauthLoading(provider)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        setError(error.message)
        setOauthLoading('')
      }
    } catch (err) {
      console.error(err)
      setError('Unable to continue with that provider.')
      setOauthLoading('')
    }
  }

  return (
    <main className="signup-page">
      <FallingLeaves />

      <div className="orange-glow glow-top" />
      <div className="orange-glow glow-left" />
      <div className="orange-glow glow-right" />

      <section className="signup-card">
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

        <h1>Create account</h1>

        <p className="subtitle">Create your illness.lol account</p>

        {/* SOCIAL */}

        <div className="social-row">
          <button
            type="button"
            className="social-button"
            onClick={() => handleOAuth('discord')}
            disabled={!!oauthLoading || loading}
          >
            <DiscordIcon />
            <span>
              {oauthLoading === 'discord' ? 'Connecting...' : 'Discord'}
            </span>
          </button>

          <button
            type="button"
            className="social-button"
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading || loading}
          >
            <GoogleIcon />
            <span>
              {oauthLoading === 'google' ? 'Connecting...' : 'Google'}
            </span>
          </button>
        </div>

        {/* DIVIDER */}

        <div className="divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}

          <div className="field">
            <label htmlFor="username">Username</label>

            <div
              className={`input-wrap ${
                usernameStatus === 'available'
                  ? 'success'
                  : usernameStatus === 'taken' || usernameStatus === 'invalid'
                    ? 'danger'
                    : ''
              }`}
            >
              <UserIcon />

              <input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                maxLength={24}
                autoComplete="username"
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                  )
                }
              />

              {usernameStatus === 'checking' && (
                <span className="status checking">Checking...</span>
              )}

              {usernameStatus === 'available' && (
                <span className="status available">✓ Available</span>
              )}

              {usernameStatus === 'taken' && (
                <span className="status taken">Taken</span>
              )}

              {usernameStatus === 'error' && (
                <span className="status checking">Couldn't check</span>
              )}
            </div>

            {usernameStatus === 'invalid' && username.length > 0 && (
              <small className="hint">
                1–24 characters. Letters, numbers, and underscores only.
              </small>
            )}
          </div>

          {/* EMAIL */}

          <div className="field">
            <label htmlFor="email">Email</label>

            <div className="input-wrap">
              <MailIcon />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="field">
            <label htmlFor="password">Password</label>

            <div className="input-wrap">
              <LockIcon />

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="password-hint">
                {passwordStrong ? (
                  <span className="good">✓ Strong password</span>
                ) : (
                  <span>
                    Use 8+ characters with uppercase, lowercase, and a number.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="field">
            <label htmlFor="confirmPassword">Confirm password</label>

            <div
              className={`input-wrap ${
                confirmPassword.length > 0
                  ? password === confirmPassword
                    ? 'success'
                    : 'danger'
                  : ''
              }`}
            >
              <LockIcon />

              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {confirmPassword.length > 0 && (
              <div className="password-hint">
                {password === confirmPassword ? (
                  <span className="good">✓ Passwords match</span>
                ) : (
                  <span className="bad">Passwords don't match</span>
                )}
              </div>
            )}
          </div>

          {/* TERMS */}

          <label className="terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />

            <span className="custom-check">{agreed ? '✓' : ''}</span>

            <span className="terms-text">
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </span>
          </label>

          {/* ERROR / NOTICE */}

          {error && <div className="error-box">{error}</div>}

          {notice && <div className="notice-box">{notice}</div>}

          {/* SIGN UP */}

          <button
            type="submit"
            className={`continue-button ${canSubmit ? 'ready' : ''}`}
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
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .signup-page {
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

        .signup-page::before {
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

        .signup-card {
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
        }

        .brand {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          margin-bottom: 20px;
          color: #fff;
          font-family: 'Space Grotesk', Inter, sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .brand-icon {
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(255, 106, 26, 0.35));
        }

        h1 {
          margin: 0;
          text-align: center;
          font-family: 'Space Grotesk', Inter, sans-serif;
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

        .social-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .social-button {
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: #fff;
          border-radius: 11px;
          cursor: pointer;
          font-family: inherit;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .social-button:hover:not(:disabled) {
          background: rgba(255, 106, 26, 0.08);
          border-color: rgba(255, 106, 26, 0.35);
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(255, 106, 26, 0.06);
        }

        .social-button:disabled {
          opacity: 0.55;
          cursor: default;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0;
        }

        .divider span {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .divider p {
          margin: 0;
          color: rgba(255, 255, 255, 0.32);
          font-size: 10px;
          font-weight: 600;
        }

        form {
          width: 100%;
        }

        .field {
          margin-bottom: 14px;
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
          box-shadow: 0 0 0 3px rgba(255, 106, 26, 0.08);
        }

        .input-wrap.success {
          border-color: rgba(72, 196, 112, 0.55);
        }

        .input-wrap.danger {
          border-color: rgba(235, 78, 69, 0.6);
        }

        /* Icons are separate components, so their classes must be global */
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

        .status {
          font-size: 10px;
          font-weight: 600;
          padding-right: 11px;
          white-space: nowrap;
        }

        .status.available {
          color: #65d38a;
        }

        .status.taken {
          color: #ef726b;
        }

        .status.checking {
          color: #ff9a62;
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
        }

        .eye-button:hover {
          color: rgba(255, 255, 255, 0.85);
        }

        .hint,
        .password-hint {
          display: block;
          margin-top: 5px;
          font-size: 10px;
          line-height: 1.35;
          color: rgba(255, 255, 255, 0.35);
        }

        .good {
          color: #65d38a;
        }

        .bad {
          color: #ef726b;
        }

        .terms {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          cursor: pointer;
          margin: 18px 0 14px;
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
          border-radius: 5px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.025);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-size: 11px;
          font-weight: 800;
          margin-top: 0;
          transition:
            background 0.15s ease,
            border-color 0.15s ease;
        }

        .terms input:checked + .custom-check {
          background: #ff6a1a;
          border-color: #ff6a1a;
        }

        .terms input:focus-visible + .custom-check {
          box-shadow: 0 0 0 3px rgba(255, 106, 26, 0.25);
        }

        .terms-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          line-height: 1.45;
          font-weight: 400;
        }

        .terms-text a {
          color: #ff8a3d;
          text-decoration: none;
        }

        .terms-text a:hover {
          color: #ffa561;
          text-decoration: underline;
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

        .notice-box {
          border: 1px solid rgba(72, 196, 112, 0.3);
          background: rgba(72, 196, 112, 0.08);
          color: #7fdc9f;
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
          box-shadow: 0 0 20px rgba(255, 106, 26, 0.25);
        }

        .continue-button.ready:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 0 28px rgba(255, 106, 26, 0.38);
        }

        .continue-button:disabled {
          cursor: not-allowed;
        }

        .continue-button.ready:disabled {
          cursor: default;
        }

        .spinner {
          display: inline-block;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.25);
          border-top-color: #000;
          animation: spin 0.7s linear infinite;
          margin-right: 7px;
          vertical-align: -2px;
        }

        .login-text {
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          margin: 17px 0 0;
        }

        .login-text a {
          color: #ff8a3d;
          text-decoration: none;
          font-weight: 600;
        }

        .login-text a:hover {
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
          background: rgba(255, 106, 26, 0.13);
        }

        .glow-left {
          width: 280px;
          height: 280px;
          left: -160px;
          top: 35%;
          background: rgba(255, 106, 26, 0.07);
        }

        .glow-right {
          width: 280px;
          height: 280px;
          right: -160px;
          bottom: 10%;
          background: rgba(255, 106, 26, 0.07);
        }

        /* Canvas is created with document.createElement, so it must be global */
        :global(.leaves-canvas) {
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
          .signup-page {
            padding: 20px 12px;
            align-items: flex-start;
          }

          .signup-card {
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
   FALLING LEAVES
========================================================= */

function FallingLeaves() {
  const [canvas, setCanvas] = useState(null)

  useEffect(() => {
    const element = document.createElement('canvas')
    element.className = 'leaves-canvas'
    element.setAttribute('aria-hidden', 'true')

    document.body.appendChild(element)
    setCanvas(element)

    return () => {
      element.remove()
    }
  }, [])

  useEffect(() => {
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

    const leaves = Array.from({ length: 12 }, makeLeaf)

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
  }, [canvas])

  return null
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
        <rect x="4" y="10" width="16" height="11" rx="2" />
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
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    </span>
  )
}

function MailIcon() {
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
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
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
      <circle cx="12" cy="12" r="2.5" />
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

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        fill="#fff"
        d="M19.54 5.27A16.2 16.2 0 0 0 15.57 4l-.5 1.02a14.7 14.7 0 0 0-6.14 0L8.43 4a16.2 16.2 0 0 0-3.97 1.27C1.95 9.08 1.27 12.8 1.61 16.47a16.3 16.3 0 0 0 4.88 2.5l1.18-1.62c-.65-.24-1.28-.55-1.86-.9l.45-.35c3.59 1.68 7.49 1.68 11.03 0l.45.35c-.59.35-1.21.65-1.86.9l1.18 1.62a16.3 16.3 0 0 0 4.88-2.5c.4-4.28-.68-7.97-2.4-11.2ZM8.03 14.05c-1.08 0-1.96-1-1.96-2.22s.86-2.22 1.96-2.22 1.98 1 1.96 2.22c0 1.22-.86 2.22-1.96 2.22Zm7.94 0c-1.08 0-1.96-1-1.96-2.22s.86-2.22 1.96-2.22 1.98 1 1.96 2.22c0 1.22-.86 2.22-1.96 2.22Z"
      />
    </svg>
  )
}