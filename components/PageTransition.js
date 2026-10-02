'use client'

import { useState, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

const TransitionContext = createContext(null)

export function PageTransitionProvider({ children }) {
  const router = useRouter()
  const [active, setActive] = useState(false)

  const navigate = (href) => {
    if (active) return

    setActive(true)

    setTimeout(() => {
      router.push(href)
    }, 420)

    setTimeout(() => {
      setActive(false)
    }, 820)
  }

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Full-screen transition */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          // Completely opaque — previous page cannot show through
          background: '#050202',

          pointerEvents: active ? 'auto' : 'none',

          // No fade-in / fade-out
          visibility: active ? 'visible' : 'hidden',

          overflow: 'hidden',
        }}
      >
        {/* Main orange atmosphere */}
        <div
          style={{
            position: 'absolute',
            inset: 0,

            background: `
              radial-gradient(
                circle at 50% 50%,
                rgba(255, 72, 0, 0.22) 0%,
                rgba(255, 55, 0, 0.10) 20%,
                rgba(40, 8, 2, 0.35) 45%,
                rgba(5, 2, 2, 1) 78%
              )
            `,

            animation: active
              ? 'halloweenAtmosphere 0.82s ease forwards'
              : 'none',

            pointerEvents: 'none',
          }}
        />

        {/* Large soft orange glow */}
        <div
          style={{
            position: 'absolute',

            width: '500px',
            height: '500px',

            borderRadius: '50%',

            background:
              'radial-gradient(circle, rgba(255, 75, 0, 0.20) 0%, rgba(255, 45, 0, 0.08) 35%, transparent 70%)',

            filter: 'blur(35px)',

            animation: active
              ? 'orangePulse 0.82s ease forwards'
              : 'none',

            pointerEvents: 'none',
          }}
        />

        {/* Dark vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,

            background: `
              radial-gradient(
                ellipse at center,
                transparent 20%,
                rgba(0, 0, 0, 0.35) 55%,
                rgba(0, 0, 0, 0.85) 100%
              )
            `,

            pointerEvents: 'none',
          }}
        />

        {/* Icon */}
        <img
          src="/icon.png"
          alt=""
          style={{
            position: 'relative',
            zIndex: 5,

            width: '110px',
            height: '110px',

            objectFit: 'contain',

            opacity: 0,

            filter: `
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(105%)
              contrast(105%)
            `,

            animation: active
              ? 'illnessFlash 0.82s ease forwards'
              : 'none',
          }}
        />
      </div>

      <style jsx global>{`

        /* =========================================
           BACKGROUND ATMOSPHERE
        ========================================= */

        @keyframes halloweenAtmosphere {
          0% {
            opacity: 0;
            transform: scale(1.15);
          }

          18% {
            opacity: 1;
            transform: scale(1);
          }

          45% {
            opacity: 0.85;
            transform: scale(1.03);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }


        /* =========================================
           ORANGE AMBIENT GLOW
        ========================================= */

        @keyframes orangePulse {
          0% {
            opacity: 0;
            transform: scale(0.45);
          }

          18% {
            opacity: 1;
            transform: scale(1);
          }

          36% {
            opacity: 0.35;
            transform: scale(0.85);
          }

          54% {
            opacity: 1;
            transform: scale(1.12);
          }

          80% {
            opacity: 0.45;
            transform: scale(0.95);
          }

          100% {
            opacity: 0.25;
            transform: scale(1);
          }
        }


        /* =========================================
           ICON
        ========================================= */

        @keyframes illnessFlash {
          0% {
            opacity: 0;

            transform:
              translateY(40px)
              scale(0.5);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(105%)
              contrast(105%)
              drop-shadow(0 0 0 rgba(255, 70, 0, 0));
          }


          18% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(115%)
              contrast(110%)
              drop-shadow(0 0 18px rgba(255, 110, 0, 1))
              drop-shadow(0 0 45px rgba(255, 70, 0, 0.95))
              drop-shadow(0 0 100px rgba(255, 40, 0, 0.65));
          }


          36% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(105%)
              contrast(105%)
              drop-shadow(0 0 7px rgba(255, 90, 0, 0.45))
              drop-shadow(0 0 20px rgba(255, 60, 0, 0.3));
          }


          54% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(120%)
              contrast(110%)
              drop-shadow(0 0 25px rgba(255, 120, 0, 1))
              drop-shadow(0 0 60px rgba(255, 70, 0, 0.95))
              drop-shadow(0 0 120px rgba(255, 35, 0, 0.7));
          }


          80% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(105%)
              contrast(105%)
              drop-shadow(0 0 9px rgba(255, 90, 0, 0.45))
              drop-shadow(0 0 22px rgba(255, 60, 0, 0.3));
          }


          100% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(105%)
              contrast(105%)
              drop-shadow(0 0 0 rgba(255, 70, 0, 0));
          }
        }

      `}</style>
    </TransitionContext.Provider>
  )
}


export function useTransition() {
  const ctx = useContext(TransitionContext)

  if (!ctx) {
    return {
      navigate: (href) => {
        window.location.href = href
      },
    }
  }

  return ctx
}


// Drop-in replacement for <a href="...">
export function TransitionLink({
  href,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  target,
  rel,
}) {
  const { navigate } = useTransition()

  // External links skip the transition
  if (target === '_blank') {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        e.preventDefault()
        navigate(href)
      }}
    >
      {children}
    </a>
  )
}
