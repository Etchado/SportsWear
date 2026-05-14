import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'sw_cookie_accepted'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  function accept() {
    localStorage.setItem(STORAGE_KEY, '1')
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
          <div className="pointer-events-auto flex items-center gap-4 bg-light-bg dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl shadow-hover px-5 py-3.5 max-w-lg w-full">
            <p className="flex-1 text-xs text-light-muted dark:text-dark-muted leading-relaxed">
              🍪 {t('common.cookie_message')}
            </p>
            <button
              onClick={accept}
              className="shrink-0 px-4 py-2 rounded-xl font-black text-xs text-white transition-opacity hover:opacity-90"
              style={{ background: '#FF2D78' }}
            >
              {t('common.accept')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
