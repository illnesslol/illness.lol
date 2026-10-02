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

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          // Halloween background
          background: `
            radial-gradient(
              circle at center,
              rgba(255, 85, 0, 0.16) 0%,
              rgba(180, 45, 0, 0.08) 22%,
              rgba(20, 7, 3, 0.96) 58%,
              #050203 100%
            )
          `,

          pointerEvents: active ? 'auto' : 'none',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.32s ease',

          overflow: 'hidden',
        }}
      >
        {/* Atmospheric orange glow */}
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255, 90, 0, 0.18) 0%, rgba(255, 60, 0, 0.06) 35%, transparent 70%)',
            filter: 'blur(25px)',
            animation: active ? 'halloweenGlow 0.82s ease forwards' : 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Secondary darker orange glow */}
        <div
          style={{
            position: 'absolute',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255, 60, 0, 0.06) 0%, transparent 65%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <img
          src="/icon.png"
          alt=""
          style={{
            position: 'relative',
            zIndex: 2,

            width: '110px',
            height: '110px',
            objectFit: 'contain',

            // Deep Halloween orange
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

            opacity: 0,

            animation: active
              ? 'illnessFlash 0.82s ease forwards'
              : 'none',
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes halloweenGlow {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }

          20% {
            opacity: 1;
            transform: scale(1);
          }

          40% {
            opacity: 0.45;
            transform: scale(0.9);
          }

          55% {
            opacity: 1;
            transform: scale(1.05);
          }

          80% {
            opacity: 0.5;
            transform: scale(0.95);
          }

          100% {
            opacity: 0.2;
            transform: scale(1);
          }
        }

        @keyframes illnessFlash {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.5);

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
            transform: translateY(0) scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(110%)
              contrast(105%)
              drop-shadow(0 0 20px rgba(255, 110, 0, 1))
              drop-shadow(0 0 50px rgba(255, 70, 0, 0.95))
              drop-shadow(0 0 100px rgba(255, 45, 0, 0.7));
          }

          36% {
            opacity: 1;
            transform: translateY(0) scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(105%)
              contrast(105%)
              drop-shadow(0 0 8px rgba(255, 90, 0, 0.5))
              drop-shadow(0 0 22px rgba(255, 60, 0, 0.35));
          }

          54% {
            opacity: 1;
            transform: translateY(0) scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(115%)
              contrast(105%)
              drop-shadow(0 0 25px rgba(255, 120, 0, 1))
              drop-shadow(0 0 60px rgba(255, 70, 0, 0.95))
              drop-shadow(0 0 120px rgba(255, 40, 0, 0.7));
          }

          80% {
            opacity: 1;
            transform: translateY(0) scale(1);

            filter:
              brightness(0)
              saturate(100%)
              invert(48%)
              sepia(99%)
              saturate(4500%)
              hue-rotate(359deg)
              brightness(105%)
              contrast(105%)
              drop-shadow(0 0 10px rgba(255, 90, 0, 0.45))
              drop-shadow(0 0 25px rgba(255, 60, 0, 0.3));
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);

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

