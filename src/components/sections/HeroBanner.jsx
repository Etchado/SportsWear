import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&auto=format&fit=crop',
    accent: '#FF2D78',
    badge: 'NEW SEASON',
    titleKey: 'home.hero_title',
    subtitleKey: 'home.hero_subtitle',
    cta: '/shop',
    ctaKey: 'home.shop_now',
    align: 'start',
  },
  {
    bg: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1600&auto=format&fit=crop',
    accent: '#0066FF',
    badge: 'DROPS LIVE',
    titleKey: 'drops.title',
    subtitleKey: 'home.hero_subtitle',
    cta: '/drops',
    ctaKey: 'drops.available',
    align: 'end',
  },
]

export default function HeroBanner() {
  const { t } = useTranslation()
  // Single hero for now — can extend to a carousel later
  const slide = SLIDES[0]

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '85vh' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={slide.bg}
          alt="Hero"
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-e from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center min-h-[85vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            {/* Badge pill */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-white mb-6"
              style={{ background: slide.accent }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {slide.badge}
            </motion.span>

            {/* Headline */}
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-white leading-none tracking-tight mb-6">
              {t(slide.titleKey).split('.').map((line, i) => (
                <motion.span
                  key={i}
                  className="block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={i === 1 ? { color: slide.accent } : { color: '#2D3748' }}
                >
                  {line.trim()}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl sm:text-2xl lg:text-3xl font-medium mb-10 max-w-2xl"
              style={{ color: '#1A202C' }}
            >
              {t(slide.subtitleKey)}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Link
                to={slide.cta}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-white text-base tracking-wide hover:opacity-90 transition-opacity"
                style={{ background: slide.accent }}
              >
                {t(slide.ctaKey)}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/drops"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-base tracking-wide hover:opacity-80 transition-opacity"
                style={{ background: '#1A202C', color: '#ffffff' }}
              >
                {t('drops.title')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 start-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-0.5 h-8 bg-white/30 rounded-full"
        />
      </motion.div>
    </section>
  )
}
