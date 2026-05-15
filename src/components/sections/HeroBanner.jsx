import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

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
  const { isDark } = useTheme()
  const slide = SLIDES[0]

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '85vh' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={slide.bg}
          alt="Hero"
          className="w-full h-full object-cover"
          style={{
            filter: isDark
              ? 'brightness(0.28) saturate(0.5) hue-rotate(200deg)'
              : 'none',
            transition: 'filter 0.9s ease',
          }}
          loading="eager"
          fetchpriority="high"
        />
        {/* Base gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-e from-black/70 via-black/30 to-transparent" />
        {/* Night atmosphere overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: isDark ? 1 : 0,
            background: 'linear-gradient(160deg, rgba(5,10,40,0.7) 0%, rgba(15,5,60,0.5) 40%, rgba(2,8,30,0.65) 100%)',
            transition: 'opacity 0.9s ease',
          }}
        />
        {/* Moon — top-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '8%',
            right: '12%',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,252,220,0.95) 0%, rgba(220,230,255,0.7) 50%, transparent 70%)',
            boxShadow: '0 0 40px 18px rgba(180,200,255,0.25)',
            opacity: isDark ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
        />
        {/* Moonlight spill down from moon */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: isDark ? 0.6 : 0,
            background: 'radial-gradient(ellipse at 88% 8%, rgba(180,200,255,0.3) 0%, rgba(100,130,255,0.1) 35%, transparent 65%)',
            transition: 'opacity 0.9s ease',
          }}
        />
        {/* Stars scattered top half */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: isDark ? 0.7 : 0,
            backgroundImage: [
              'radial-gradient(1px 1px at 20% 12%, rgba(255,255,255,0.9) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 35% 6%, rgba(255,255,255,0.8) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 55% 10%, rgba(255,255,255,0.95) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 70% 18%, rgba(255,255,255,0.7) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 45% 4%, rgba(255,255,255,0.85) 0%, transparent 100%)',
              'radial-gradient(1.5px 1.5px at 10% 8%, rgba(255,255,255,0.75) 0%, transparent 100%)',
              'radial-gradient(1px 1px at 62% 5%, rgba(255,255,255,0.6) 0%, transparent 100%)',
            ].join(','),
            transition: 'opacity 0.9s ease',
          }}
        />
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
                  style={i === 1 ? { color: slide.accent } : { color: isDark ? '#FFFFFF' : '#0A0A0A' }}
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
              style={{ color: 'rgba(255,255,255,0.85)' }}
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
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
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
