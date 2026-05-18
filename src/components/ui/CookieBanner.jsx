import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('sw_cookies'))

  function accept() {
    localStorage.setItem('sw_cookies', 'all')
    setVisible(false)
  }

  function essential() {
    localStorage.setItem('sw_cookies', 'essential')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed bottom-0 inset-x-0 z-[150] p-4 bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border shadow-2xl"
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">
              🍪 We use cookies to enhance your shopping experience and analyze traffic.{' '}
              <a href="/support" className="underline font-semibold" style={{ color: '#FF2D78' }}>
                Learn more
              </a>
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={essential}
                className="px-4 py-2 text-sm font-black rounded-xl border-2 border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-brand-pink transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 text-sm font-black rounded-xl text-white"
                style={{ background: '#FF2D78' }}
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
