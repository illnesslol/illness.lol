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
          background: '#06060f',
          pointerEvents: active ? 'auto' : 'none',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.32s ease',
        }}
      >
        <img
          src="/icon.png"
          alt=""
          style={{
            width: '110px',
            height: '110px',
            objectFit: 'contain',

            // Yellow/gold icon
            filter:
              'brightness(0) saturate(100%) invert(78%) sepia(96%) saturate(1200%) hue-rotate(5deg) brightness(105%)',

            opacity: 0,
            animation: active
              ? 'illnessFlash 0.82s ease forwards'
              : 'none',
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes illnessFlash {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.5);
            filter:
              brightness(0)
              saturate(100%)
              invert(78%)
              sepia(96%)
              saturate(1200%)
              hue-rotate(5deg)
              brightness(105%)
              drop-shadow(0 0 0px rgba(255, 220, 0, 0));
          }

          18% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter:
              brightness(0)
              saturate(100%)
              invert(78%)
              sepia(96%)
              saturate(1200%)
              hue-rotate(5deg)
              brightness(115%)
              drop-shadow(0 0 34px rgba(255, 230, 0, 1))
              drop-shadow(0 0 80px rgba(255, 190, 0, 0.95))
              drop-shadow(0 0 130px rgba(255, 150, 0, 0.7));
          }

          36% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter:
              brightness(0)
              saturate(100%)
              invert(78%)
              sepia(96%)
              saturate(1200%)
              hue-rotate(5deg)
              brightness(105%)
              drop-shadow(0 0 8px rgba(255, 220, 0, 0.4))
              drop-shadow(0 0 20px rgba(255, 190, 0, 0.3));
          }

          54% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter:
              brightness(0)
              saturate(100%)
              invert(78%)
              sepia(96%)
              saturate(1200%)
              hue-rotate(5deg)
              brightness(115%)
              drop-shadow(0 0 34px rgba(255, 230, 0, 1))
              drop-shadow(0 0 80px rgba(255, 190, 0, 0.95))
              drop-shadow(0 0 130px rgba(255, 150, 0, 0.7));
          }

          80% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter:
              brightness(0)
              saturate(100%)
              invert(78%)
              sepia(96%)
              saturate(1200%)
              hue-rotate(5deg)
              brightness(105%)
              drop-shadow(0 0 10px rgba(255, 220, 0, 0.4))
              drop-shadow(0 0 24px rgba(255, 190, 0, 0.3));
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter:
              brightness(0)
              saturate(100%)
              invert(78%)
              sepia(96%)
              saturate(1200%)
              hue-rotate(5deg)
              brightness(105%)
              drop-shadow(0 0 0px rgba(255, 220, 0, 0));
          }
        }
      `}</style>
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)

  if (!ctx) {
    // Fallback if provider isn't mounted
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

