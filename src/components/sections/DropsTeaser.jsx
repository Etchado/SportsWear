import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '@/context/ProductsContext'
import { useCurrency } from '@/context/CurrencyContext'
import { handleImgError } from '@/lib/imgFallback'
import Badge from '@/components/ui/Badge'
import { PRODUCTS } from '@/data/products'

function Countdown({ targetTime }) {
  const { t } = useTranslation()
  const [diff, setDiff] = useState(0)

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, new Date(targetTime) - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetTime])

  const d  = Math.floor(diff / 86400000)
  const h  = Math.floor((diff % 86400000) / 3600000)
  const m  = Math.floor((diff % 3600000)  / 60000)
  const s  = Math.floor((diff % 60000)    / 1000)

  const units = [
    { label: t('drops.days'),    val: d },
    { label: t('drops.hours'),   val: h },
    { label: t('drops.minutes'), val: m },
    { label: t('drops.seconds'), val: s },
  ]

  if (diff === 0) return (
    <span className="text-sm font-black" style={{ color: '#22c55e' }}>
      {t('drops.available')}
    </span>
  )

  return (
    <div className="flex items-center gap-2">
      {units.map(({ label, val }) => (
        <div key={label} className="flex flex-col items-center min-w-[48px] bg-black/30 backdrop-blur-sm rounded-xl p-2">
          <span className="text-xl font-black text-white tabular-nums leading-none">
            {String(val).padStart(2, '0')}
          </span>
          <span className="text-[9px] font-semibold text-white/60 uppercase tracking-wider mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function DropsTeaser() {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const { products } = useProducts()

  const source  = products.length > 0 ? products : PRODUCTS
  const drops   = source.filter(p => p.is_drop).slice(0, 3)

  if (drops.length === 0) return null

  // Simulate drop times for display (in real app these come from the drops table)
  const dropTimes = [
    Date.now() + 1 * 24 * 60 * 60 * 1000,
    Date.now() + 3 * 24 * 60 * 60 * 1000,
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ]

  return (
    <section className="py-16" style={{ background: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#FF2D78' }}>
              Limited Releases
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {t('home.featured_drops')}
            </h2>
          </div>
          <Link
            to="/drops"
            className="hidden sm:flex items-center gap-1 text-sm font-black transition-opacity hover:opacity-70"
            style={{ color: '#CCFF00' }}
          >
            {t('drops.title')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {drops.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/product/${product.id}`}
                className="group relative block rounded-card overflow-hidden aspect-[4/5] bg-zinc-900"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  onError={handleImgError}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 start-3">
                  <Badge label={product.badge} />
                </div>

                {/* Countdown */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
                    {t('drops.countdown')}
                  </p>
                  <Countdown targetTime={dropTimes[i]} />
                  <div className="mt-3">
                    <p className="text-xs font-black text-white/60 uppercase tracking-wider">{product.brand}</p>
                    <p className="text-sm font-black text-white line-clamp-1 mt-0.5">{product.title}</p>
                    <p className="text-base font-black mt-1" style={{ color: '#CCFF00' }}>
                      {format(product.price)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/drops"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm"
            style={{ background: '#FF2D78', color: '#fff' }}
          >
            {t('drops.title')}
          </Link>
        </div>
      </div>
    </section>
  )
}
