import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useScrolled } from '@/hooks/useScrolled'

export default function BackToTopButton() {
  const { t } = useTranslation()
  const scrolled = useScrolled(400)

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollTop}
          aria-label={t('common.back_to_top')}
          className="fixed bottom-20 md:bottom-6 end-4 sm:end-6 z-20 w-11 h-11 rounded-full text-white shadow-hover flex items-center justify-center"
          style={{ background: '#0066FF' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
