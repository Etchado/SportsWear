import { useEffect, useState } from 'react'

export default function ScrollProgressBar() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function update() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setPct(total > 0 ? (scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (pct <= 0) return null

  return (
    <div
      className="fixed top-0 start-0 z-[9999] h-0.5 transition-none pointer-events-none"
      style={{ width: `${pct}%`, background: '#FF2D78' }}
    />
  )
}
