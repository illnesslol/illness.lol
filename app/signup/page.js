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
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')
  const [agreed, setAgreed] = useState(false)

  // Check whether a username exists.
  useEffect(() => {
    const clean = username.trim().toLowerCase()

    if (!clean) {
      setUsernameStatus('idle')
      return
    }

    if (clean.length < 3) {
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
      /*
       * The username is stored in Supabase Auth metadata.
       * Our database trigger below copies it into profiles.
       */
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

      /*
       * If email confirmation is disabled, Supabase gives us
       * a session immediately and we can go straight to dashboard.
       */
      if (data.session) {
        navigate('/dashboard')
        return
      }

      /*
       * If email confirmation is enabled, there won't be a session yet.
       */
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

      const { data, error } = await supabase.auth.signInWithPasskey()

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
      {/* Fall background */}
      <div className="fall-glow glow-one" />
      <div className="fall-glow glow-two" />
      <div className="fall-glow glow-three" />

      <div className="leaves">
        <span>🍂</span>
        <span>🍁</span>
        <span>🍂</span>
        <span>🍁</span>
        <span>🍂</span>
        <span>🍁</span>
      </div>

      <section className="signup-card">
        <div className="logo-wrap">
          <div className="logo">🍂</div>
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
              <span className="input-icon">👤</span>

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
                <span className="status checking">Checking...</span>
              )}

              {usernameStatus === 'available' && (
                <span className="status available">✓ Available</span>
              )}

              {usernameStatus === 'taken' && (
                <span className="status taken">Taken</span>
              )}
            </div>

            {usernameStatus === 'invalid' && username.length > 0 && (
              <small className="hint">
                3–24 characters. Letters, numbers, and underscores only.
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <label>Password</label>

            <div className="input-wrap">
              <span className="input-icon">🔒</span>

              <input
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
              >
                {showPassword ? '🙈' : '👁'}
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
              <span className="input-icon">🔒</span>

              <input
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
              >
                {showConfirmPassword ? '🙈' : '👁'}
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

          {/* Terms */}
          <label className="terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
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
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .signup-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 10%,
              rgba(135, 67, 25, 0.14),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #090807 0%,
              #110c09 50%,
              #080706 100%
            );
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
            "Segoe UI",
            sans-serif;
        }

        .signup-card {
          width: 100%;
          max-width: 450px;
          position: relative;
          z-index: 2;
          background: rgba(17, 14, 12, 0.91);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 34px 32px 28px;
          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.55),
            0 0 70px rgba(177, 87, 34, 0.06);
          backdrop-filter: blur(20px);
        }

        .logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }

        .logo {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            rgba(194, 105, 44, 0.2),
            rgba(109, 52, 25, 0.15)
          );
          border: 1px solid rgba(213, 126, 64, 0.22);
        }

        h1 {
          margin: 0;
          text-align: center;
          font-size: 28px;
          letter-spacing: -0.8px;
          font-weight: 700;
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
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: white;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit;
          transition:
            background 0.15s,
            border 0.15s,
            transform 0.15s;
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
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(205, 116, 54, 0.35);
          transform: translateY(-1px);
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
          color: #f1c39e;
        }

        .passkey-icon {
          font-size: 16px;
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
          background: rgba(255, 255, 255, 0.08);
        }

        .divider p {
          margin: 0;
          color: rgba(255, 255, 255, 0.35);
          font-size: 11px;
          font-weight: 600;
        }

        .field {
          margin-bottom: 16px;
        }

        label {
          display: block;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 7px;
        }

        .input-wrap {
          height: 46px;
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          border-radius: 10px;
          transition:
            border 0.15s,
            background 0.15s,
            box-shadow 0.15s;
        }

        .input-wrap:focus-within {
          border-color: rgba(204, 112, 51, 0.65);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 3px rgba(194, 91, 34, 0.08);
        }

        .input-wrap.success {
          border-color: rgba(75, 190, 115, 0.55);
        }

        .input-wrap.danger {
          border-color: rgba(220, 80, 70, 0.55);
        }

        .input-icon {
          width: 42px;
          text-align: center;
          opacity: 0.45;
          font-size: 14px;
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
          color: rgba(255, 255, 255, 0.35);
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
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          padding: 10px;
          font-size: 14px;
        }

        .eye-button:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .hint,
        .password-hint {
          display: block;
          margin-top: 6px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.35);
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
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 11px;
          margin-top: 1px;
          transition: all 0.15s;
        }

        .terms input:checked + .custom-check {
          background: #a85b35;
          border-color: #c7794c;
        }

        .terms-text {
          color: rgba(255, 255, 255, 0.55);
          font-size: 12px;
          line-height: 1.45;
          font-weight: 400;
        }

        .terms-text a {
          color: #d38b62;
          text-decoration: none;
        }

        .terms-text a:hover {
          color: #edaa7d;
          text-decoration: underline;
        }

        .error-box {
          border: 1px solid rgba(225, 80, 70, 0.25);
          background: rgba(225, 80, 70, 0.08);
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
          background: linear-gradient(
            135deg,
            #a35435,
            #88452e
          );
          color: white;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(147, 71, 39, 0.2);
          transition:
            transform 0.15s,
            filter 0.15s,
            opacity 0.15s;
        }

        .continue-button:hover:not(:disabled) {
          filter: brightness(1.12);
          transform: translateY(-1px);
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
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          animation: spin 0.7s linear infinite;
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
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
          margin: 21px 0 0;
        }

        .login-text a {
          color: #d68b61;
          text-decoration: none;
          font-weight: 600;
        }

        .login-text a:hover {
          color: #efaa7e;
        }

        .fall-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          pointer-events: none;
        }

        .glow-one {
          width: 350px;
          height: 350px;
          left: -120px;
          top: 10%;
          background: rgba(177, 76, 25, 0.09);
        }

        .glow-two {
          width: 300px;
          height: 300px;
          right: -100px;
          bottom: 5%;
          background: rgba(126, 65, 24, 0.1);
        }

        .glow-three {
          width: 220px;
          height: 220px;
          left: 40%;
          bottom: -100px;
          background: rgba(91, 45, 19, 0.14);
        }

        .leaves {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.12;
          z-index: 1;
        }

        .leaves span {
          position: absolute;
          font-size: 35px;
          animation: float 9s ease-in-out infinite;
        }

        .leaves span:nth-child(1) {
          left: 8%;
          top: 15%;
        }

        .leaves span:nth-child(2) {
          left: 87%;
          top: 20%;
          animation-delay: -2s;
        }

        .leaves span:nth-child(3) {
          left: 13%;
          top: 75%;
          animation-delay: -4s;
        }

        .leaves span:nth-child(4) {
          left: 92%;
          top: 72%;
          animation-delay: -5s;
        }

        .leaves span:nth-child(5) {
          left: 25%;
          top: 7%;
          animation-delay: -6s;
        }

        .leaves span:nth-child(6) {
          left: 73%;
          top: 90%;
          animation-delay: -1s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(18px) rotate(12deg);
          }
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
