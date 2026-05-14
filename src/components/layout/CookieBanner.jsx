import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'sw_cookie_choice'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'all')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'necessary')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="fixed bottom-16 md:bottom-4 inset-x-0 z-20 flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-center gap-3 bg-light-bg dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-hover px-5 py-4 max-w-xl w-full">
            <p className="flex-1 text-xs text-light-muted dark:text-dark-muted leading-relaxed">
              🍪 {t('common.cookie_message')}
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={decline}
                className="px-4 py-2 rounded-xl font-black text-xs border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
              >
                {t('common.cookie_necessary')}
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 rounded-xl font-black text-xs text-white hover:opacity-90 transition-opacity"
                style={{ background: '#FF2D78' }}
              >
                {t('common.accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
