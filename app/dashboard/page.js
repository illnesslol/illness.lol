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

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="signup-card">
        <div className="brand">
          <img
            src="/icon.png"
            alt=""
            width={32}
            height={32}
            className="brand-icon"
          />
          <span>illness.lol</span>
        </div>

        <div className="heading">
          <h1>Create account</h1>
          <p>Create your illness.lol account</p>
        </div>

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

        <div className="divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>

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
                <span className="status checking">Checking</span>
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
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
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

          {error && <div className="error-box">{error}</div>}

          {notice && <div className="notice-box">{notice}</div>}

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
          min-height: 100svh;
          width: 100%;
          position: relative;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 32px 20px;

          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(255, 106, 26, 0.08),
              transparent 36%
            ),
            #050505;

          color: #fff;

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
            rgba(255, 255, 255, 0.09) 1px,
            transparent 1px
          );

          background-size: 32px 32px;

          mask-image: radial-gradient(
            ellipse 65% 60% at 50% 45%,
            #000 0%,
            transparent 78%
          );

          -webkit-mask-image: radial-gradient(
            ellipse 65% 60% at 50% 45%,
            #000 0%,
            transparent 78%
          );

          opacity: 0.28;
        }

        .signup-card {
          position: relative;
          z-index: 5;

          width: 100%;
          max-width: 430px;

          padding: 31px 30px 25px;

          border: 1px solid rgba(255, 255, 255, 0.085);
          border-radius: 18px;

          background: rgba(9, 9, 9, 0.96);

          box-shadow:
            0 24px 80px rgba(0, 0, 0, 0.65),
            0 0 0 1px rgba(255, 255, 255, 0.015);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          margin-bottom: 22px;

          font-family:
            'Space Grotesk',
            Inter,
            system-ui,
            sans-serif;

          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.4px;
        }

        .brand-icon {
          display: block;
          width: 30px;
          height: 30px;
          object-fit: contain;

          filter: drop-shadow(
            0 0 8px rgba(255, 106, 26, 0.22)
          );
        }

        .heading {
          text-align: center;
        }

        h1 {
          margin: 0;

          font-family:
            'Space Grotesk',
            Inter,
            system-ui,
            sans-serif;

          font-size: 27px;
          line-height: 1.15;
          font-weight: 600;
          letter-spacing: -0.9px;
        }

        .heading p {
          margin: 8px 0 23px;

          color: rgba(255, 255, 255, 0.43);

          font-size: 12px;
          line-height: 1.4;
        }

        .social-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .social-button {
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          border: 1px solid rgba(255, 255, 255, 0.085);
          border-radius: 9px;

          background: rgba(255, 255, 255, 0.025);
          color: rgba(255, 255, 255, 0.9);

          font-family: inherit;
          font-size: 12px;
          font-weight: 500;

          cursor: pointer;

          transition:
            border-color 0.16s ease,
            background 0.16s ease,
            color 0.16s ease;
        }

        .social-button:hover:not(:disabled) {
          border-color: rgba(255, 106, 26, 0.3);
          background: rgba(255, 106, 26, 0.055);
          color: #fff;
        }

        .social-button:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 11px;

          margin: 20px 0;
        }

        .divider span {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.07);
        }

        .divider p {
          margin: 0;

          color: rgba(255, 255, 255, 0.27);

          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.7px;
        }

        form {
          width: 100%;
        }

        .field {
          margin-bottom: 13px;
        }

        .field label {
          display: block;

          margin: 0 0 6px;

          color: rgba(255, 255, 255, 0.7);

          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
        }

        .input-wrap {
          width: 100%;
          height: 44px;

          display: flex;
          align-items: center;

          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 9px;

          background: rgba(255, 255, 255, 0.025);

          transition:
            border-color 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease;
        }

        .input-wrap:hover {
          border-color: rgba(255, 255, 255, 0.14);
        }

        .input-wrap:focus-within {
          border-color: rgba(255, 106, 26, 0.55);

          background: rgba(255, 255, 255, 0.035);

          box-shadow: 0 0 0 3px rgba(255, 106, 26, 0.055);
        }

        .input-wrap.success {
          border-color: rgba(82, 197, 116, 0.48);
        }

        .input-wrap.danger {
          border-color: rgba(235, 78, 69, 0.52);
        }

        :global(.input-icon) {
          width: 40px;
          height: 100%;
          flex: 0 0 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: rgba(255, 255, 255, 0.32);
        }

        .input-wrap:focus-within :global(.input-icon) {
          color: rgba(255, 145, 85, 0.75);
        }

        .input-wrap input {
          flex: 1;
          min-width: 0;
          height: 100%;

          padding: 0;

          border: none;
          outline: none;

          background: transparent;

          color: #fff;

          font-family: inherit;
          font-size: 12px;
        }

        .input-wrap input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .status {
          padding-right: 10px;

          white-space: nowrap;

          font-size: 9px;
          font-weight: 600;
        }

        .status.available {
          color: #65d38a;
        }

        .status.taken {
          color: #ef726b;
        }

        .status.checking {
          color: #ff965e;
        }

        .eye-button {
          width: 40px;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: none;
          background: transparent;

          color: rgba(255, 255, 255, 0.3);

          cursor: pointer;
        }

        .eye-button:hover {
          color: rgba(255, 255, 255, 0.7);
        }

        .hint,
        .password-hint {
          display: block;

          margin-top: 5px;

          color: rgba(255, 255, 255, 0.29);

          font-size: 9px;
          line-height: 1.35;
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
          gap: 8px;

          margin: 17px 0 13px;

          cursor: pointer;
        }

        .terms input {
          position: absolute;

          width: 1px;
          height: 1px;

          opacity: 0;
          pointer-events: none;
        }

        .custom-check {
          width: 16px;
          height: 16px;
          flex: 0 0 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-top: 1px;

          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;

          background: rgba(255, 255, 255, 0.02);

          color: #050505;

          font-size: 10px;
          font-weight: 800;

          transition:
            background 0.15s ease,
            border-color 0.15s ease;
        }

        .terms input:checked + .custom-check {
          border-color: #ff6a1a;
          background: #ff6a1a;
        }

        .terms input:focus-visible + .custom-check {
          box-shadow: 0 0 0 3px rgba(255, 106, 26, 0.18);
        }

        .terms-text {
          color: rgba(255, 255, 255, 0.4);

          font-size: 10px;
          line-height: 1.5;
        }

        .terms-text a {
          color: #ff8740;
          text-decoration: none;
        }

        .terms-text a:hover {
          color: #ffa064;
          text-decoration: underline;
        }

        .error-box,
        .notice-box {
          margin-bottom: 10px;

          padding: 8px 10px;

          border-radius: 8px;

          font-size: 10px;
          line-height: 1.4;
        }

        .error-box {
          border: 1px solid rgba(235, 78, 69, 0.25);
          background: rgba(235, 78, 69, 0.065);
          color: #ef918a;
        }

        .notice-box {
          border: 1px solid rgba(72, 196, 112, 0.25);
          background: rgba(72, 196, 112, 0.065);
          color: #7fdc9f;
        }

        .continue-button {
          width: 100%;
          height: 44px;

          border: none;
          border-radius: 9px;

          background: #ff6a1a;
          color: #080808;

          font-family: inherit;
          font-size: 12px;
          font-weight: 700;

          opacity: 0.32;
          cursor: not-allowed;

          transition:
            opacity 0.16s ease,
            filter 0.16s ease,
            transform 0.16s ease,
            box-shadow 0.16s ease;
        }

        .continue-button.ready {
          opacity: 1;
          cursor: pointer;

          box-shadow: 0 7px 24px rgba(255, 106, 26, 0.16);
        }

        .continue-button.ready:hover {
          filter: brightness(1.07);
          transform: translateY(-1px);
          box-shadow: 0 9px 28px rgba(255, 106, 26, 0.23);
        }

        .continue-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .spinner {
          display: inline-block;

          width: 12px;
          height: 12px;

          margin-right: 7px;

          vertical-align: -2px;

          border: 2px solid rgba(0, 0, 0, 0.2);
          border-top-color: #000;

          border-radius: 50%;

          animation: spin 0.7s linear infinite;
        }

        .login-text {
          margin: 15px 0 0;

          text-align: center;

          color: rgba(255, 255, 255, 0.31);

          font-size: 10px;
        }

        .login-text a {
          color: #ff8740;
          text-decoration: none;
          font-weight: 600;
        }

        .login-text a:hover {
          color: #ffa064;
        }

        .ambient {
          position: fixed;

          width: 350px;
          height: 350px;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(100px);

          z-index: 0;
        }

        .ambient-one {
          top: -240px;
          left: 50%;

          transform: translateX(-50%);

          background: rgba(255, 106, 26, 0.075);
        }

        .ambient-two {
          right: -250px;
          bottom: -180px;

          background: rgba(255, 106, 26, 0.035);
        }

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
            align-items: flex-start;
            padding: 18px 12px;
          }

          .signup-card {
            margin-top: 8px;
            padding: 27px 19px 21px;
            border-radius: 16px;
          }

          .brand {
            margin-bottom: 19px;
          }

          h1 {
            font-size: 25px;
          }

          .heading p {
            margin-bottom: 21px;
          }

          .social-button {
            height: 42px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .social-button,
          .input-wrap,
          .continue-button {
            transition: none;
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

    const colors = [
      '#ff6a1a',
      '#ff8740',
      '#e85a0c',
      '#ffffff',
    ]

    const makeLeaf = () => ({
      x: Math.random() * window.innerWidth,
      y: -40 - Math.random() * window.innerHeight,

      size: Math.random() * 4 + 7,

      speed: Math.random() * 0.3 + 0.25,

      swayAmp: Math.random() * 24 + 16,

      swaySpeed: Math.random() * 0.01 + 0.005,

      phase: Math.random() * Math.PI * 2,

      rotation: Math.random() * Math.PI * 2,

      spin: (Math.random() - 0.5) * 0.009,

      opacity: Math.random() * 0.13 + 0.1,

      color: colors[Math.floor(Math.random() * colors.length)],

      baseX: 0,
    })

    const leaves = Array.from({ length: 9 }, makeLeaf)

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

      ctx.globalAlpha = opacity * 0.7
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 0.7

      ctx.beginPath()
      ctx.moveTo(0, -size * 0.85)
      ctx.lineTo(0, size * 1.15)
      ctx.stroke()

      ctx.globalAlpha = 1
    }

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
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
              tick * leaf.swaySpeed + leaf.phase
            ) * leaf.swayAmp

        const x = leaf.baseX + sway

        if (leaf.y > window.innerHeight + 50) {
          leaf.y = -40
          leaf.baseX = Math.random() * window.innerWidth
        }

        ctx.save()

        ctx.translate(x, leaf.y)

        ctx.rotate(
          leaf.rotation +
            Math.sin(
              tick * leaf.swaySpeed + leaf.phase
            ) *
              0.35
        )

        drawLeaf(
          leaf.size,
          leaf.color,
          leaf.opacity
        )

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
