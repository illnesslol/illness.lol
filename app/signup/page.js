'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase-client'
import { useTransition } from '@/components/PageTransition'

const COLORS = {
  bg: '#000000',
  surface: '#0c0c0c',
  orange: '#ff6a1a',
  orangeBright: '#ff8a3d',
  orangeSoft: 'rgba(255,106,26,.16)',
  orangeBorder: 'rgba(255,106,26,.5)',
  muted: 'rgba(255,255,255,.72)',
  faint: 'rgba(255,255,255,.4)',
}

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
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    const clean = username.trim().toLowerCase()

    if (!clean) {
      setUsernameStatus('idle')
      return
    }

    if (clean.length < 3 || !/^[a-z0-9_]+$/.test(clean)) {
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

      setUsernameStatus(data ? 'taken' : 'available')
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
    username.trim().length >= 3 &&
    usernameStatus === 'available' &&
    email.trim() &&
    passwordStrong &&
    password === confirmPassword &&
    agreed &&
    !loading

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    if (usernameStatus !== 'available') {
      setError('Please choose an available username.')
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
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleOAuth = async (provider) => {
    setError('')
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
      setError('Passkey sign in was cancelled or failed.')
      setOauthLoading('')
    }
  }

  return (
    <main className="signup-page">
      <div className="orange-glow glow-one" />
      <div className="orange-glow glow-two" />
      <div className="dot-grid" />

      <section className="signup-shell">
        <div className="brand">
          <img
            src="/icon.png"
            alt=""
            width="34"
            height="34"
          />

          <span>illness.lol</span>
        </div>

        <div className="signup-card">
          <div className="logo-wrap">
            <img
              src="/icon.png"
              alt=""
              width="42"
              height="42"
            />
          </div>

          <h1>Create your account</h1>

          <p className="subtitle">
            Join illness.lol and build your profile.
          </p>

          {/* OAuth */}

          <div className="social-row">
            <button
              type="button"
              className="social-button"
              onClick={() => handleOAuth('discord')}
              disabled={!!oauthLoading}
            >
              <DiscordIcon />
              <span>Discord</span>
            </button>

            <button
              type="button"
              className="social-button"
              onClick={() => handleOAuth('google')}
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
            <span className="passkey-icon">🔐</span>

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
                <span className="input-icon">@</span>

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
                        .replace(/[^a-z0-9_]/g, '')
                    )
                  }
                />

                {usernameStatus === 'checking' && (
                  <span className="status checking">
                    Checking...
                  </span>
                )}

                {usernameStatus === 'available' && (
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

              {usernameStatus === 'invalid' &&
                username.length > 0 && (
                  <small className="hint">
                    3–24 characters. Letters, numbers,
                    and underscores only.
                  </small>
                )}
            </div>

            {/* Email */}

            <div className="field">
              <label>Email</label>

              <div className="input-wrap">
                <span className="input-icon">✉</span>

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
                <span className="input-icon">●</span>

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
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? '🙈' : '👁'}
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
              <label>Confirm password</label>

              <div
                className={`input-wrap ${
                  confirmPassword.length > 0
                    ? password === confirmPassword
                      ? 'success'
                      : 'danger'
                    : ''
                }`}
              >
                <span className="input-icon">●</span>

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
                    setConfirmPassword(e.target.value)
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
                >
                  {showConfirmPassword
                    ? '🙈'
                    : '👁'}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div className="password-hint">
                  {password === confirmPassword ? (
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
        </div>
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
          align-items: center;
          justify-content: center;
          padding: 105px 20px 50px;
          position: relative;
          overflow: hidden;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .signup-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(255,106,26,.15),
              transparent 40%
            );
          pointer-events: none;
        }

        .signup-shell {
          width: 100%;
          max-width: 450px;
          position: relative;
          z-index: 3;
        }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 18px;
          font-family:
            'Space Grotesk',
            sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -.6px;
        }

        .brand img {
          filter:
            drop-shadow(
              0 0 12px
              rgba(255,106,26,.35)
            );
        }

        .signup-card {
          width: 100%;
          background: rgba(10,10,10,.94);
          border:
            1px solid
            rgba(255,255,255,.09);
          border-radius: 22px;
          padding: 30px 30px 26px;
          box-shadow:
            0 30px 100px rgba(0,0,0,.8),
            0 0 45px rgba(255,106,26,.08);
          backdrop-filter: blur(20px);
        }

        .logo-wrap {
          width: 50px;
          height: 50px;
          margin: 0 auto 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background:
            rgba(255,106,26,.1);
          border:
            1px solid
            rgba(255,106,26,.22);
          box-shadow:
            0 0 25px
            rgba(255,106,26,.1);
        }

        .logo-wrap img {
          filter:
            drop-shadow(
              0 0 9px
              rgba(255,106,26,.35)
            );
        }

        h1 {
          margin: 0;
          text-align: center;
          font-family:
            'Space Grotesk',
            sans-serif;
          font-size: 29px;
          line-height: 1.15;
          letter-spacing: -1px;
          font-weight: 600;
        }

        .subtitle {
          text-align: center;
          color: ${COLORS.muted};
          font-size: 14px;
          margin: 8px 0 25px;
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
            rgba(255,255,255,.1);
          background:
            rgba(255,255,255,.035);
          color: #fff;
          border-radius: 11px;
          cursor: pointer;
          font-family: inherit;
          transition: all .2s ease;
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
            rgba(255,106,26,.08);
          border-color:
            rgba(255,106,26,.35);
          box-shadow:
            0 0 18px
            rgba(255,106,26,.06);
          transform: translateY(-1px);
        }

        .social-button:disabled,
        .passkey-button:disabled {
          opacity: .55;
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

        .passkey-icon {
          font-size: 15px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .divider span {
          flex: 1;
          height: 1px;
          background:
            rgba(255,255,255,.08);
        }

        .divider p {
          margin: 0;
          color:
            rgba(255,255,255,.35);
          font-size: 11px;
          font-weight: 600;
        }

        .field {
          margin-bottom: 16px;
        }

        label {
          display: block;
          color:
            rgba(255,255,255,.75);
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
            rgba(255,255,255,.1);
          background: #0c0c0c;
          border-radius: 11px;
          transition: all .2s ease;
        }

        .input-wrap:focus-within {
          border-color:
            rgba(255,106,26,.65);
          background: #101010;
          box-shadow:
            0 0 0 3px
            rgba(255,106,26,.08),
            0 0 20px
            rgba(255,106,26,.04);
        }

        .input-wrap.success {
          border-color:
            rgba(70,190,110,.55);
        }

        .input-wrap.danger {
          border-color:
            rgba(220,80,70,.55);
        }

        .input-icon {
          width: 42px;
          text-align: center;
          color:
            rgba(255,255,255,.38);
          font-size: 13px;
        }

        .input-wrap input {
          flex: 1;
          min-width: 0;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
        }

        .input-wrap input::placeholder {
          color:
            rgba(255,255,255,.32);
        }

        .status {
          padding-right: 12px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status.available,
        .good {
          color: #65c982;
        }

        .status.taken,
        .bad {
          color: #ef726b;
        }

        .status.checking {
          color: #ff9a63;
        }

        .eye-button {
          border: 0;
          background: transparent;
          color:
            rgba(255,255,255,.4);
          cursor: pointer;
          padding: 10px;
          font-size: 14px;
        }

        .eye-button:hover {
          color: #fff;
        }

        .hint,
        .password-hint {
          display: block;
          margin-top: 6px;
          font-size: 11px;
          color:
            rgba(255,255,255,.35);
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
            rgba(255,255,255,.28);
          background: #0c0c0c;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-size: 11px;
          margin-top: 1px;
          transition: all .15s;
        }

        .terms input:checked + .custom-check {
          background: #ff6a1a;
          border-color: #ff8a3d;
        }

        .terms-text {
          color:
            rgba(255,255,255,.55);
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
            rgba(225,80,70,.25);
          background:
            rgba(225,80,70,.08);
          color: #f18a83;
          border-radius: 9px;
          padding: 10px 12px;
          font-size: 12px;
          line-height: 1.45;
          margin-bottom: 12px;
        }

        .continue-button {
          width: 100%;
          height: 47px;
          border: 0;
          border-radius: 11px;
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
            rgba(255,106,26,.22);
          transition: all .2s ease;
        }

        .continue-button:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
          box-shadow:
            0 0 28px
            rgba(255,106,26,.35);
        }

        .continue-button:disabled {
          opacity: .35;
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
            rgba(0,0,0,.25);
          border-top-color: #000;
          animation:
            spin .7s linear infinite;
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
            rgba(255,255,255,.4);
          font-size: 12px;
          margin: 20px 0 0;
        }

        .login-text a {
          color: #ff8a3d;
          text-decoration: none;
          font-weight: 600;
        }

        .login-text a:hover {
          color: #fff;
        }

        .orange-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }

        .glow-one {
          width: 420px;
          height: 420px;
          top: -240px;
          left: calc(50% - 210px);
          background:
            rgba(255,106,26,.1);
        }

        .glow-two {
          width: 300px;
          height: 300px;
          right: -160px;
          bottom: -100px;
          background:
            rgba(255,106,26,.07);
        }

        .dot-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .55;
          background-image:
            radial-gradient(
              rgba(255,255,255,.1) 1px,
              transparent 1px
            );
          background-size: 28px 28px;
          mask-image:
            radial-gradient(
              ellipse 70% 70% at 50% 45%,
              #000 10%,
              transparent 75%
            );
          -webkit-mask-image:
            radial-gradient(
              ellipse 70% 70% at 50% 45%,
              #000 10%,
              transparent 75%
            );
        }

        @media (max-width: 520px) {
          .signup-page {
            padding: 30px 12px;
            align-items: flex-start;
          }

          .signup-shell {
            margin-top: 10px;
          }

          .signup-card {
            padding: 27px 20px 24px;
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
