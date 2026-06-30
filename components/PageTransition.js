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
    }, 420)
    setTimeout(() => {
      setActive(false)
    }, 820)
  }
 
  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '18px',
        background: '#06060f',
        pointerEvents: active ? 'auto' : 'none',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.32s ease',
      }}>
        <img
          src="/icon.png"
          alt=""
          style={{
            width: '110px',
            height: '110px',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: 0,
            animation: active ? 'illnessFlashIcon 0.82s ease forwards' : 'none',
          }}
        />
        <span style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.3px',
          fontFamily: 'Inter, system-ui, sans-serif',
          opacity: 0,
          animation: active ? 'illnessFlashText 0.82s ease forwards' : 'none',
        }}>
          illness.lol
        </span>
      </div>
 
      <style jsx global>{`
        @keyframes illnessFlashIcon {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.5);
            filter: brightness(0) invert(1) drop-shadow(0 0 0px rgba(255,255,255,0));
          }
          18% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(0) invert(1) drop-shadow(0 0 34px rgba(255,255,255,1)) drop-shadow(0 0 80px rgba(190,160,255,0.95)) drop-shadow(0 0 130px rgba(150,110,255,0.7));
          }
          36% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.4)) drop-shadow(0 0 20px rgba(190,160,255,0.3));
          }
          54% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(0) invert(1) drop-shadow(0 0 34px rgba(255,255,255,1)) drop-shadow(0 0 80px rgba(190,160,255,0.95)) drop-shadow(0 0 130px rgba(150,110,255,0.7));
          }
          80% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.4)) drop-shadow(0 0 24px rgba(190,160,255,0.3));
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(0) invert(1) drop-shadow(0 0 0px rgba(255,255,255,0));
          }
        }
 
        @keyframes illnessFlashText {
          0% {
            opacity: 0;
            transform: translateY(20px);
            text-shadow: 0 0 0px rgba(255,255,255,0);
          }
          18% {
            opacity: 1;
            transform: translateY(0);
            text-shadow: 0 0 16px rgba(255,255,255,1), 0 0 36px rgba(190,160,255,0.9), 0 0 60px rgba(150,110,255,0.6);
          }
          36% {
            opacity: 1;
            transform: translateY(0);
            text-shadow: 0 0 4px rgba(255,255,255,0.4), 0 0 10px rgba(190,160,255,0.3);
          }
          54% {
            opacity: 1;
            transform: translateY(0);
            text-shadow: 0 0 16px rgba(255,255,255,1), 0 0 36px rgba(190,160,255,0.9), 0 0 60px rgba(150,110,255,0.6);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
            text-shadow: 0 0 5px rgba(255,255,255,0.4), 0 0 12px rgba(190,160,255,0.3);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            text-shadow: 0 0 0px rgba(255,255,255,0);
          }
        }
      `}</style>
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