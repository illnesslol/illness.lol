'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTransition } from '@/components/PageTransition'

export default function SignupPage() {
  const { navigate } = useTransition()
  const supabase = createClient()

  const canvasRef = useRef(null)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [focused, setFocused] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)

  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')

  /*
   * ---------------------------------------------------------
   * FALL BACKGROUND
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
      )
    }

    resize()
    window.addEventListener('resize', resize)

    /*
     * Stars
     */
    const stars = Array.from({ length: 170 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.1 + 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.01 + 0.003,
    }))

    /*
     * Falling leaves
     */
    const leaves = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,

      size: Math.random() * 7 + 5,

      speed: Math.random() * 0.55 + 0.25,
      drift: Math.random() * 0.7 + 0.2,

      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.035,

      sway: Math.random() * Math.PI * 2,

      color: [
        '#c96a22',
        '#df8a2e',
        '#a94420',
        '#e0a04b',
        '#8d3f1e',
        '#b85c25',
      ][Math.floor(Math.random() * 6)],

      opacity: Math.random() * 0.45 + 0.35,
    }))

    /*
     * Shooting stars
     */
    const shootingStars = []
    let frame = 0

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.45,
        length: Math.random() * 90 + 50,
        speed: Math.random() * 5 + 5,
        alpha: 1,
      })
    }

    const drawLeaf = (leaf) => {
      ctx.save()

      ctx.translate(leaf.x, leaf.y)
      ctx.rotate(leaf.rotation)

      ctx.globalAlpha = leaf.opacity

      ctx.fillStyle = leaf.color

      ctx.beginPath()

      /*
       * Simple maple-ish leaf shape
       */
      ctx.moveTo(0, -leaf.size)

      ctx.lineTo(leaf.size * 0.35, -leaf.size * 0.3)
      ctx.lineTo(leaf.size, -leaf.size * 0.15)

      ctx.lineTo(leaf.size * 0.42, leaf.size * 0.25)

      ctx.lineTo(leaf.size * 0.62, leaf.size * 0.85)

      ctx.lineTo(0, leaf.size * 0.45)

      ctx.lineTo(-leaf.size * 0.62, leaf.size * 0.85)

      ctx.lineTo(-leaf.size * 0.42, leaf.size * 0.25)

      ctx.lineTo(-leaf.size, -leaf.size * 0.15)

      ctx.lineTo(-leaf.size * 0.35, -leaf.size * 0.3)

      ctx.closePath()

      ctx.fill()

      /*
       * Leaf stem
       */
      ctx.strokeStyle = 'rgba(80,35,15,0.5)'
      ctx.lineWidth = 0.7

      ctx.beginPath()
      ctx.moveTo(0, leaf.size * 0.4)
      ctx.lineTo(0, leaf.size * 1.1)
      ctx.stroke()

      ctx.restore()
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      /*
       * Ambient autumn glow
       */
      const glows = [
        {
          x: width * 0.15,
          y: height * 0.15,
          radius: 320,
          color: 'rgba(170,65,15,0.11)',
        },
        {
          x: width * 0.85,
          y: height * 0.55,
          radius: 380,
          color: 'rgba(190,90,25,0.08)',
        },
        {
          x: width * 0.45,
          y: height * 1.0,
          radius: 300,
          color: 'rgba(110,40,15,0.12)',
        },
      ]

      glows.forEach((glow) => {
        const gradient = ctx.createRadialGradient(
          glow.x,
          glow.y,
          0,
          glow.x,
          glow.y,
          glow.radius
        )

        gradient.addColorStop(0, glow.color)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = gradient

        ctx.beginPath()
        ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      /*
       * Stars
       */
      stars.forEach((star) => {
        star.phase += star.speed

        const alpha =
          star.alpha *
          (0.55 + Math.sin(star.phase) * 0.35)

        ctx.beginPath()

        ctx.arc(
          star.x,
          star.y,
          star.r,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = `rgba(255,225,190,${alpha})`

        ctx.fill()
      })

      /*
       * Leaves
       */
      leaves.forEach((leaf) => {
        leaf.y += leaf.speed

        leaf.sway += 0.012

        leaf.x +=
          Math.sin(leaf.sway) * leaf.drift * 0.35

        leaf.rotation += leaf.rotationSpeed

        if (leaf.y > height + 30) {
          leaf.y = -30
          leaf.x = Math.random() * width
        }

        drawLeaf(leaf)
      })

      /*
       * Shooting stars
       */
      frame++

      if (frame % 260 === 0) {
        spawnShootingStar()
      }

      shootingStars.forEach((star, index) => {
        star.x += star.speed
        star.y += star.speed * 0.5
        star.alpha -= 0.018

        if (star.alpha <= 0) {
          shootingStars.splice(index, 1)
          return
        }

        const tailX = star.x - star.length
        const tailY = star.y - star.length * 0.5

        const gradient = ctx.createLinearGradient(
          tailX,
          tailY,
          star.x,
          star.y
        )

        gradient.addColorStop(
          0,
          'rgba(255,190,100,0)'
        )

        gradient.addColorStop(
          1,
          `rgba(255,210,150,${star.alpha})`
        )

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.3

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(star.x, star.y)
        ctx.stroke()
      })

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  /*
   * ---------------------------------------------------------
   * USERNAME AVAILABILITY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const cleanUsername = username
      .trim()
      .toLowerCase()

    if (!cleanUsername) {
      setUsernameAvailable(null)
      setCheckingUsername(false)
      return
    }

    if (
      cleanUsername.length < 3 ||
      !/^[a-z0-9_]+$/.test(cleanUsername)
    ) {
      setUsernameAvailable(false)
      setCheckingUsername(false)
      return
    }

    setCheckingUsername(true)
    setUsernameAvailable(null)

    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle()

      if (error) {
        setCheckingUsername(false)
        setUsernameAvailable(null)
        return
      }

      setUsernameAvailable(!data)
      setCheckingUsername(false)
    }, 350)

    return () => clearTimeout(timer)
  }, [username])

  /*
   * ---------------------------------------------------------
   * EMAIL/PASSWORD SIGNUP
   * ---------------------------------------------------------
   */

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    const cleanUsername = username
      .trim()
      .toLowerCase()

    const cleanEmail = email
      .trim()
      .toLowerCase()

    if (!cleanUsername || !cleanEmail || !password || !confirmPassword) {
      setError('Please fill in every field.')
      return
    }

    if (!/^[a-z0-9_]{3,24}$/.test(cleanUsername)) {
      setError(
        'Username must be 3–24 characters using letters, numbers, or _.'
      )
      return
    }

    if (usernameAvailable !== true) {
      setError('Please choose an available username.')
      return
    }

    if (password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    if (!acceptedTerms) {
      setError(
        'You must agree to the Terms of Service and Privacy Policy.'
      )
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

      /*
       * If email confirmation is disabled, Supabase gives
       * us a session immediately.
       */
      if (data.session) {
        navigate('/dashboard')
        return
      }

      /*
       * If email confirmation is enabled.
       */
      setSuccess(
        'Account created! Check your email to confirm your account.'
      )

      setLoading(false)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  /*
   * ---------------------------------------------------------
   * GOOGLE / DISCORD
   * ---------------------------------------------------------
   */

  const handleOAuth = async (provider) => {
    if (!acceptedTerms) {
      setError(
        'Please agree to the Terms of Service and Privacy Policy first.'
      )
      return
    }

    setError('')
    setOauthLoading(provider)

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setOauthLoading('')
    }
  }

  /*
   * ---------------------------------------------------------
   * PASSKEY
   * ---------------------------------------------------------
   *
   * This is for EXISTING passkey users.
   *
   * New users should register their passkey after
   * creating their account.
   */

  const handlePasskey = async () => {
    if (!acceptedTerms) {
      setError(
        'Please agree to the Terms of Service and Privacy Policy first.'
      )
      return
    }

    setError('')
    setOauthLoading('passkey')

    try {
      const { error } =
        await supabase.auth.signInWithPasskey()

      if (error) {
        setError(error.message)
        setOauthLoading('')
        return
      }

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Passkey authentication failed.')
      setOauthLoading('')
    }
  }

  /*
   * ---------------------------------------------------------
   * STYLES
   * ---------------------------------------------------------
   */

  const inputStyle = (name) => ({
    width: '100%',
    height: '44px',

    background:
      focused === name
        ? 'rgba(190,100,35,0.09)'
        : 'rgba(255,255,255,0.035)',

    border:
      focused === name
        ? '1px solid rgba(220,130,55,0.65)'
        : '1px solid rgba(255,255,255,0.10)',

    borderRadius: '10px',

    padding: '0 14px',

    fontSize: '14px',

    color: '#f7eee6',

    outline: 'none',

    fontFamily: 'inherit',

    transition:
      'border 0.15s, background 0.15s, box-shadow 0.15s',

    boxSizing: 'border-box',

    boxShadow:
      focused === name
        ? '0 0 0 3px rgba(190,100,35,0.07)'
        : 'none',
  })

  const labelStyle = {
    display: 'block',

    fontSize: '12px',

    fontWeight: 600,

    color: 'rgba(255,225,200,0.72)',

    marginBottom: '7px',
  }

  const socialButtonStyle = {
    flex: 1,

    height: '45px',

    borderRadius: '10px',

    border: '1px solid rgba(255,255,255,0.10)',

    background: 'rgba(255,255,255,0.035)',

    color: '#f7eee6',

    cursor: 'pointer',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    transition:
      'background .15s, border .15s, transform .15s',

    fontFamily: 'inherit',
  }

  return (
    <main
      style={{
        minHeight: '100vh',

        background:
          'radial-gradient(circle at 50% 0%, #25150d 0%, #100b09 38%, #070707 75%)',

        display: 'flex',

        alignItems: 'center',

        justifyContent: 'center',

        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',

        color: '#fff',

        position: 'relative',

        overflow: 'hidden',

        padding: '24px 16px',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,

          width: '100%',
          height: '100%',

          zIndex: 0,

          pointerEvents: 'none',
        }}
      />

      {/* Warm top glow */}
      <div
        style={{
          position: 'fixed',

          top: '-220px',
          left: '50%',

          transform: 'translateX(-50%)',

          width: '650px',
          height: '500px',

          background:
            'radial-gradient(circle, rgba(177,78,20,0.13), transparent 68%)',

          filter: 'blur(25px)',

          pointerEvents: 'none',

          zIndex: 0,
        }}
      />

      <section
        style={{
          position: 'relative',

          zIndex: 2,

          width: '100%',

          maxWidth: '448px',

          boxSizing: 'border-box',

          background:
            'linear-gradient(145deg, rgba(23,17,14,0.94), rgba(12,10,9,0.94))',

          border:
            '1px solid rgba(255,180,100,0.12)',

          borderRadius: '17px',

          padding: '30px 32px 26px',

          boxShadow:
            '0 25px 90px rgba(0,0,0,0.65), 0 0 70px rgba(155,65,15,0.07)',

          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '13px',
          }}
        >
          <div
            style={{
              width: '45px',
              height: '45px',

              borderRadius: '13px',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              background:
                'linear-gradient(135deg, rgba(218,119,40,0.22), rgba(117,45,18,0.12))',

              border:
                '1px solid rgba(224,137,62,0.22)',

              boxShadow:
                '0 0 30px rgba(201,91,25,0.12)',

              overflow: 'hidden',
            }}
          >
            <img
              src="/icon.png"
              alt="illness.lol"
              style={{
                width: '31px',
                height: '31px',
                objectFit: 'contain',

                filter:
                  'brightness(0) invert(1)',
              }}
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            margin: 0,

            textAlign: 'center',

            fontSize: '27px',

            lineHeight: 1.15,

            fontWeight: 700,

            letterSpacing: '-0.7px',

            color: '#fff',
          }}
        >
          Create account
        </h1>

        <p
          style={{
            margin:
              '7px 0 23px',

            textAlign: 'center',

            fontSize: '14px',

            color: 'rgba(255,225,200,0.55)',
          }}
        >
          Join and create your profile
        </p>

        {/* Social buttons */}
        <div
          style={{
            display: 'flex',

            gap: '10px',

            marginBottom: '11px',
          }}
        >
          {/* Discord */}
          <button
            type="button"
            disabled={!!oauthLoading}
            onClick={() => handleOAuth('discord')}
            style={{
              ...socialButtonStyle,

              opacity:
                oauthLoading && oauthLoading !== 'discord'
                  ? 0.5
                  : 1,
            }}
            title="Continue with Discord"
          >
            {oauthLoading === 'discord' ? (
              <Spinner />
            ) : (
              <DiscordIcon />
            )}
          </button>

          {/* Google */}
          <button
            type="button"
            disabled={!!oauthLoading}
            onClick={() => handleOAuth('google')}
            style={{
              ...socialButtonStyle,

              opacity:
                oauthLoading && oauthLoading !== 'google'
                  ? 0.5
                  : 1,
            }}
            title="Continue with Google"
          >
            {oauthLoading === 'google' ? (
              <Spinner />
            ) : (
              <GoogleIcon />
            )}
          </button>
        </div>

        {/* Passkey */}
        <button
          type="button"
          disabled={!!oauthLoading}
          onClick={handlePasskey}
          style={{
            width: '100%',

            height: '45px',

            borderRadius: '10px',

            border:
              '1px solid rgba(255,255,255,0.10)',

            background:
              'rgba(255,255,255,0.035)',

            color: '#f7eee6',

            cursor: 'pointer',

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'center',

            gap: '9px',

            fontSize: '13px',

            fontWeight: 600,

            fontFamily: 'inherit',

            transition:
              'background .15s, border .15s',
          }}
        >
          {oauthLoading === 'passkey' ? (
            <Spinner />
          ) : (
            <>
              <PasskeyIcon />
              Continue with passkey
            </>
          )}
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',

            alignItems: 'center',

            gap: '13px',

            margin: '20px 0',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background:
                'rgba(255,255,255,0.08)',
            }}
          />

          <span
            style={{
              fontSize: '12px',
              color:
                'rgba(255,225,200,0.38)',
            }}
          >
            OR
          </span>

          <div
            style={{
              flex: 1,
              height: '1px',
              background:
                'rgba(255,255,255,0.08)',
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>
              Username
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',

                  left: '13px',
                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  fontSize: '13px',

                  color:
                    'rgba(255,225,200,0.35)',

                  pointerEvents: 'none',

                  zIndex: 1,
                }}
              >
                illness.lol/
              </span>

              <input
                type="text"
                value={username}
                placeholder="your_username"
                autoComplete="username"

                onChange={(e) =>
                  setUsername(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, '')
                  )
                }

                onFocus={() =>
                  setFocused('username')
                }

                onBlur={() =>
                  setFocused('')
                }

                style={{
                  ...inputStyle('username'),

                  paddingLeft: '88px',

                  paddingRight: '42px',
                }}
              />

              {/* Username status */}
              {checkingUsername && (
                <div
                  style={{
                    position: 'absolute',

                    right: '13px',
                    top: '50%',

                    transform:
                      'translateY(-50%)',
                  }}
                >
                  <SmallSpinner />
                </div>
              )}

              {!checkingUsername &&
                username.length >= 3 &&
                usernameAvailable === true && (
                  <div
                    style={{
                      position: 'absolute',

                      right: '13px',
                      top: '50%',

                      transform:
                        'translateY(-50%)',

                      color: '#7fcf91',

                      fontSize: '18px',
                    }}
                  >
                    ✓
                  </div>
                )}

              {!checkingUsername &&
                username.length >= 3 &&
                usernameAvailable === false && (
                  <div
                    style={{
                      position: 'absolute',

                      right: '13px',
                      top: '50%',

                      transform:
                        'translateY(-50%)',

                      color: '#d87861',

                      fontSize: '18px',
                    }}
                  >
                    ×
                  </div>
                )}
            </div>

            {/* Username status text */}
            {username.length >= 3 &&
              !checkingUsername &&
              usernameAvailable === true && (
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '11px',
                    color: '#7fcf91',
                  }}
                >
                  Username is available
                </div>
              )}

            {username.length >= 3 &&
              !checkingUsername &&
              usernameAvailable === false && (
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '11px',
                    color: '#d87861',
                  }}
                >
                  Username is already taken
                </div>
              )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>
              Email
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',

                  left: '14px',
                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  color:
                    'rgba(255,225,200,0.35)',

                  pointerEvents: 'none',
                }}
              >
                <MailIcon />
              </span>

              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                autoComplete="email"

                onChange={(e) =>
                  setEmail(e.target.value)
                }

                onFocus={() =>
                  setFocused('email')
                }

                onBlur={() =>
                  setFocused('')
                }

                style={{
                  ...inputStyle('email'),

                  paddingLeft: '40px',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>
              Password
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',

                  left: '14px',
                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  color:
                    'rgba(255,225,200,0.35)',

                  pointerEvents: 'none',
                }}
              >
                <LockIcon />
              </span>

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }

                value={password}

                placeholder="Create a strong password"

                autoComplete="new-password"

                onChange={(e) =>
                  setPassword(e.target.value)
                }

                onFocus={() =>
                  setFocused('password')
                }

                onBlur={() =>
                  setFocused('')
                }

                style={{
                  ...inputStyle('password'),

                  paddingLeft: '40px',

                  paddingRight: '43px',
                }}
              />

              <button
                type="button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                style={eyeButtonStyle}
              >
                <EyeIcon
                  open={showPassword}
                />
              </button>
            </div>

            {password.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  marginTop: '7px',
                }}
              >
                {[1, 2, 3, 4].map((level) => {
                  const strength =
                    password.length >= 12
                      ? 4
                      : password.length >= 10
                        ? 3
                        : password.length >= 8
                          ? 2
                          : 1

                  return (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: '3px',
                        borderRadius: '10px',

                        background:
                          level <= strength
                            ? strength >= 4
                              ? '#78b77d'
                              : strength >= 3
                                ? '#d79a4d'
                                : '#a94f32'
                            : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>
              Confirm password
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',

                  left: '14px',
                  top: '50%',

                  transform:
                    'translateY(-50%)',

                  color:
                    'rgba(255,225,200,0.35)',

                  pointerEvents: 'none',
                }}
              >
                <LockIcon />
              </span>

              <input
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }

                value={confirmPassword}

                placeholder="Repeat your password"

                autoComplete="new-password"

                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }

                onFocus={() =>
                  setFocused('confirmPassword')
                }

                onBlur={() =>
                  setFocused('')
                }

                style={{
                  ...inputStyle(
                    'confirmPassword'
                  ),

                  paddingLeft: '40px',

                  paddingRight: '43px',

                  borderColor:
                    confirmPassword &&
                    confirmPassword !==
                      password
                      ? 'rgba(190,75,60,0.6)'
                      : focused ===
                          'confirmPassword'
                        ? 'rgba(220,130,55,0.65)'
                        : 'rgba(255,255,255,0.10)',
                }}
              />

              <button
                type="button"

                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

                style={eyeButtonStyle}
              >
                <EyeIcon
                  open={
                    showConfirmPassword
                  }
                />
              </button>
            </div>

            {confirmPassword &&
              confirmPassword ===
                password && (
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '11px',
                    color: '#7fcf91',
                  }}
                >
                  Passwords match
                </div>
              )}
          </div>

          {/* Terms */}
          <label
            style={{
              display: 'flex',

              alignItems: 'flex-start',

              gap: '9px',

              cursor: 'pointer',

              marginBottom: '17px',

              fontSize: '12px',

              lineHeight: 1.45,

              color:
                'rgba(255,225,200,0.55)',
            }}
          >
            <input
              type="checkbox"
              checked={acceptedTerms}

              onChange={(e) =>
                setAcceptedTerms(
                  e.target.checked
                )
              }

              style={{
                appearance: 'none',

                width: '16px',
                height: '16px',

                minWidth: '16px',

                margin: '1px 0 0',

                borderRadius: '4px',

                border:
                  acceptedTerms
                    ? '1px solid #cf7833'
                    : '1px solid rgba(255,255,255,0.25)',

                background:
                  acceptedTerms
                    ? '#b85d25'
                    : 'rgba(255,255,255,0.03)',

                cursor: 'pointer',

                position: 'relative',
              }}
            />

            <span>
              I agree to the{' '}
              <a
                href="https://illness.lol/terms"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="https://illness.lol/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: '13px',

                padding: '10px 11px',

                borderRadius: '8px',

                background:
                  'rgba(150,50,35,0.10)',

                border:
                  '1px solid rgba(200,80,55,0.18)',

                color: '#e28a75',

                fontSize: '12px',

                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              style={{
                marginBottom: '13px',

                padding: '10px 11px',

                borderRadius: '8px',

                background:
                  'rgba(75,145,85,0.10)',

                border:
                  '1px solid rgba(100,180,110,0.18)',

                color: '#8bc990',

                fontSize: '12px',

                lineHeight: 1.4,
              }}
            >
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"

            disabled={
              loading ||
              !acceptedTerms
            }

            style={{
              width: '100%',

              height: '45px',

              border: 'none',

              borderRadius: '10px',

              background:
                acceptedTerms
                  ? 'linear-gradient(135deg, #a9572a, #874322)'
                  : 'rgba(150,85,55,0.35)',

              color: '#fff',

              fontSize: '13px',

              fontWeight: 600,

              cursor:
                loading ||
                !acceptedTerms
                  ? 'default'
                  : 'pointer',

              fontFamily: 'inherit',

              opacity:
                loading ? 0.7 : 1,

              boxShadow:
                acceptedTerms
                  ? '0 8px 25px rgba(135,60,25,0.18)'
                  : 'none',

              transition:
                'all .15s',
            }}
          >
            {loading
              ? 'Creating account...'
              : 'Create account'}
          </button>
        </form>
      </section>

      {/* Bottom login */}
      <div
        style={{
          position: 'fixed',

          zIndex: 2,

          bottom: '18px',

          left: '50%',

          transform:
            'translateX(-50%)',

          fontSize: '13px',

          color:
            'rgba(255,225,200,0.45)',

          whiteSpace: 'nowrap',
        }}
      >
        Already have an account?{' '}
        <a
          href="/login"
          style={{
            color: '#d5793d',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Sign in
        </a>
      </div>
    </main>
  )
}

/*
 * ===========================================================
 * ICONS
 * ===========================================================
 */

function DiscordIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19.54 5.08A16.91 16.91 0 0 0 15.41 3.8l-.51 1.04a15.16 15.16 0 0 0-5.8 0L8.59 3.8a16.91 16.91 0 0 0-4.13 1.28C1.84 9.14 1.13 13.1 1.49 17c1.72 1.27 3.39 2.04 5.03 2.55l1.22-1.66c-.67-.25-1.31-.56-1.91-.92l.47-.36c3.68 1.7 7.68 1.7 11.32 0l.48.36c-.6.36-1.24.67-1.91.92l1.22 1.66c1.64-.51 3.31-1.28 5.03-2.55.42-4.51-.72-8.43-2.9-11.92ZM8.03 15.04c-1.1 0-2-.99-2-2.21s.88-2.21 2-2.21c1.13 0 2.02.99 2 2.21 0 1.22-.88 2.21-2 2.21Zm7.94 0c-1.1 0-2-.99-2-2.21s.88-2.21 2-2.21c1.13 0 2.02.99 2 2.21 0 1.22-.88 2.21-2 2.21Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.68-.06-1.35-.17-1.98H12v3.75h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.93-4.2 2.93-7.13Z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.75 9.75 0 0 0 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.61A5.86 5.86 0 0 1 6.23 12c0-.56.1-1.1.31-1.61v-2.5H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.39l3.24-2.78Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.36c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.45 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.39l3.24 2.5C7.31 8.08 9.46 6.36 12 6.36Z"
      />
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
      stroke="#e08a4a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9" />
      <path d="M17 5l2 2" />
      <path d="M14 8l2 2" />
      <path d="M8 15h.01" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
  )
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
  )
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 4.3A10.7 10.7 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-3.1 4.3" />
      <path d="M6.1 6.1C3.4 8 2 12 2 12s3.5 8 10 8a9.8 9.8 0 0 0 3.1-.5" />
    </svg>
  )
}

function Spinner() {
  return (
    <span
      style={{
        width: '16px',
        height: '16px',

        border:
          '2px solid rgba(255,255,255,0.2)',

        borderTopColor: '#e08a4a',

        borderRadius: '50%',

        display: 'block',

        animation:
          'illness-spin 0.7s linear infinite',
      }}
    />
  )
}

function SmallSpinner() {
  return (
    <span
      style={{
        width: '13px',
        height: '13px',

        border:
          '2px solid rgba(255,255,255,0.12)',

        borderTopColor: '#d47b3a',

        borderRadius: '50%',

        display: 'block',

        animation:
          'illness-spin 0.7s linear infinite',
      }}
    />
  )
}

const eyeButtonStyle = {
  position: 'absolute',

  right: '13px',
  top: '50%',

  transform: 'translateY(-50%)',

  padding: 0,

  border: 'none',

  background: 'transparent',

  color: 'rgba(255,225,200,0.38)',

  cursor: 'pointer',

  display: 'flex',

  alignItems: 'center',

  justifyContent: 'center',
}

const linkStyle = {
  color: '#df8246',

  textDecoration: 'none',

  fontWeight: 600,
}
