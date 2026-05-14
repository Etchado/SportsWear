import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const ToastContext = createContext(null)

const ICONS = {
  success: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
}

const COLORS = {
  success: { bg: '#22c55e', text: '#fff' },
  error:   { bg: '#FF2D78', text: '#fff' },
  info:    { bg: '#0066FF', text: '#fff' },
  warning: { bg: '#f59e0b', text: '#fff' },
}

function ToastItem({ toast, onDismiss }) {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => clearTimeout(timerRef.current)
  }, [toast.id, toast.duration, onDismiss])

  const color = COLORS[toast.type] ?? COLORS.info

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[260px] max-w-xs cursor-pointer select-none"
      style={{ background: color.bg, color: color.text }}
      onClick={() => onDismiss(toast.id)}
    >
      {ICONS[toast.type]}
      <p className="text-sm font-semibold leading-snug flex-1">{toast.message}</p>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev.slice(-4), { id, message, type, duration }])
    return id
  }, [])

  const success = useCallback((msg, dur) => toast(msg, 'success', dur), [toast])
  const error   = useCallback((msg, dur) => toast(msg, 'error',   dur), [toast])
  const info    = useCallback((msg, dur) => toast(msg, 'info',    dur), [toast])
  const warning = useCallback((msg, dur) => toast(msg, 'warning', dur), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, dismiss }}>
      {children}

      {/* Toast renderer — fixed bottom-right (desktop) / bottom-center (mobile) */}
      <div
        className="fixed z-[9999] bottom-20 sm:bottom-6 end-4 sm:end-6 flex flex-col gap-2 items-end pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
