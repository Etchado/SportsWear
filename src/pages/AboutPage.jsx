import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { usePageTitle } from '@/hooks/usePageTitle'

const BRANDS = [
  { name: 'Nike',         logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas',       logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Puma',         logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Puma_logo.svg/320px-Puma_logo.svg.png' },
  { name: 'Under Armour', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Under_armour_logo.svg/320px-under_armour_logo.svg.png' },
  { name: 'New Balance',  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/320px-New_Balance_logo.svg.png' },
]

const VALUES = [
  { icon: '🏆', title: 'Premium Quality',    desc: 'Only authentic products from official brand partners.' },
  { icon: '🚀', title: 'Fast Delivery',      desc: 'Same-day dispatch on orders placed before 2 PM.' },
  { icon: '🔄', title: 'Easy Returns',       desc: '30-day hassle-free returns on all items.' },
  { icon: '🔒', title: 'Secure Payments',    desc: 'Bank-grade encryption on every transaction.' },
]

function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function AboutPage() {
  const { t } = useTranslation()
  usePageTitle('About Us')

  return (
    <div className="bg-light-bg dark:bg-dark-bg">

      {/* Hero */}
      <div
        className="relative overflow-hidden py-24 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1a0533 50%, #0A0F1E 100%)' }}
      >
        <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#FF2D78' }} />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: '#0066FF' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-black uppercase tracking-widest mb-4"
            style={{ color: '#CCFF00' }}
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6"
          >
            Built for
            <span style={{ color: '#FF2D78' }}> Athletes</span>,<br />
            By Athletes.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-lg leading-relaxed"
          >
            SportsWear is the Gulf's premier destination for premium sportswear —
            bringing the world's top brands directly to your door.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-20">

        {/* Mission */}
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#FF2D78' }}>Our Mission</p>
              <h2 className="text-3xl sm:text-4xl font-black text-light-text dark:text-dark-text mb-4 leading-tight">
                Gear that moves<br />as fast as you do.
              </h2>
              <p className="text-light-muted dark:text-dark-muted leading-relaxed">
                We believe every athlete — from weekend warriors to professionals — deserves access
                to the best gear on the planet. That's why we partner directly with the world's most
                iconic sports brands to bring you authentic products at honest prices.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-light-surface dark:bg-dark-surface">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop"
                alt="Athletes"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </FadeIn>

        {/* Values */}
        <FadeIn delay={0.1}>
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2 text-center" style={{ color: '#0066FF' }}>Why SportsWear</p>
            <h2 className="text-3xl font-black text-light-text dark:text-dark-text text-center mb-10">What sets us apart</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {VALUES.map(({ icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl bg-light-surface dark:bg-dark-surface p-5 text-center"
                >
                  <div className="text-4xl mb-3">{icon}</div>
                  <h3 className="font-black text-sm text-light-text dark:text-dark-text mb-1">{title}</h3>
                  <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Brands */}
        <FadeIn delay={0.1}>
          <div>
            <h2 className="text-3xl font-black text-light-text dark:text-dark-text text-center mb-10">Our Brand Partners</h2>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {BRANDS.map(b => (
                <Link key={b.name} to={`/brand/${b.name.toLowerCase().replace(' ', '-')}`}>
                  <div className="h-10 flex items-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                    <img src={b.logo} alt={b.name} className="h-full w-auto object-contain" loading="lazy" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.1}>
          <div
            className="rounded-3xl p-10 text-center text-white"
            style={{ background: 'linear-gradient(135deg, #FF2D78, #0066FF)' }}
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to gear up?</h2>
            <p className="text-white/80 mb-8 text-lg">Browse thousands of products from the world's best brands.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/shop"
                className="px-8 py-3 rounded-xl font-black text-sm bg-white transition-opacity hover:opacity-90"
                style={{ color: '#FF2D78' }}
              >
                Shop Now
              </Link>
              <Link
                to="/support/contact"
                className="px-8 py-3 rounded-xl font-black text-sm border-2 border-white/50 hover:border-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
