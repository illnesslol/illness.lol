'use client'

import { useState, useEffect, createContext, useContext } from 'react'
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
    }, 380)
    setTimeout(() => {
      setActive(false)
    }, 760)
  }

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#06060f',
        pointerEvents: active ? 'auto' : 'none',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.28s ease',
      }}>
        <img
          src="/icon.png"
          alt=""
          style={{
            width: '56px',
            height: '56px',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            transform: active ? 'scale(1)' : 'scale(0.5)',
            opacity: active ? 1 : 0,
            transition: 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease',
          }}
        />
      </div>
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) {
    // fallback if provider isn't mounted — just behaves like a normal link
    return { navigate: (href) => { window.location.href = href } }
  }
  return ctx
}

// drop-in replacement for <a href="...">
export function TransitionLink({ href, children, style, onMouseEnter, onMouseLeave, target, rel }) {
  const { navigate } = useTransition()

  if (target === '_blank') {
    // external links skip the transition
    return (
      <a href={href} target={target} rel={rel} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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