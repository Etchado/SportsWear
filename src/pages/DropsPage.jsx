import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '@/context/ProductsContext'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { handleImgError } from '@/lib/imgFallback'
import { supabase } from '@/lib/supabase'
import Badge from '@/components/ui/Badge'
import { PRODUCTS } from '@/data/products'

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(targetMs) {
  const [diff, setDiff] = useState(() => Math.max(0, targetMs - Date.now()))

  useEffect(() => {
    if (diff === 0) return
    const id = setInterval(() => {
      const d = Math.max(0, targetMs - Date.now())
      setDiff(d)
      if (d === 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [targetMs])

  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    live: diff > 0,
  }
}

// ─── Countdown display ────────────────────────────────────────────────────────
function CountdownTiles({ targetMs, size = 'md' }) {
  const { t } = useTranslation()
  const { d, h, m, s, live } = useCountdown(targetMs)

  if (!live) return (
    <span className="inline-flex items-center gap-1.5 text-sm font-black" style={{ color: '#22c55e' }}>
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      {t('drops.available')}
    </span>
  )

  const units = [
    { val: d, label: t('drops.days')    },
    { val: h, label: t('drops.hours')   },
    { val: m, label: t('drops.minutes') },
    { val: s, label: t('drops.seconds') },
  ]

  const tileBase = size === 'lg'
    ? 'min-w-[60px] py-3 px-2 rounded-xl'
    : 'min-w-[46px] py-2 px-1.5 rounded-lg'

  const numClass = size === 'lg'
    ? 'text-3xl font-black text-white tabular-nums leading-none'
    : 'text-xl font-black text-white tabular-nums leading-none'

  return (
    <div className="flex items-center gap-2">
      {units.map(({ val, label }) => (
        <div key={label} className={`${tileBase} bg-black/40 backdrop-blur-sm flex flex-col items-center`}>
          <span className={numClass}>{String(val).padStart(2, '0')}</span>
          <span className="text-[9px] font-semibold text-white/50 uppercase tracking-widest mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Raffle modal ─────────────────────────────────────────────────────────────
function RaffleModal({ product, dropId, onClose }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { success, error: toastError } = useToast()
  const [size, setSize] = useState(product.sizes?.[0] ?? '')
  const [loading, setLoading] = useState(false)
  const [entered, setEntered] = useState(false)

  async function enterRaffle() {
    if (!size) return
    setLoading(true)
    try {
      if (user && dropId) {
        const { error } = await supabase.from('drop_entries').insert({
          drop_id: dropId,
          user_id: user.id,
          size,
        })
        if (error && error.code !== '23505' && error.code !== '42P01') throw error // ignore duplicate + missing table
      }
      setEntered(true)
      success(t('drops.raffle_entered') ?? 'You\'re in the raffle!')
    } catch (err) {
      toastError(err.message ?? t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="w-full max-w-sm bg-light-bg dark:bg-dark-bg rounded-2xl overflow-hidden"
      >
        {/* Product image header */}
        <div className="relative h-48 bg-zinc-900">
          <img
            src={product.images?.[0]}
            alt={product.title}
            onError={handleImgError}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 start-4 end-4">
            <p className="text-xs font-black text-white/60 uppercase tracking-widest">{product.brand}</p>
            <p className="text-lg font-black text-white line-clamp-1">{product.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 end-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60"
          >✕</button>
        </div>

        <div className="p-5">
          {entered ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-black text-light-text dark:text-dark-text mb-1">
                {t('drops.raffle_confirmed') ?? "You're in!"}
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted mb-4">
                {t('drops.raffle_notice') ?? "Winners are selected at random and notified by email."}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl font-black text-sm text-white"
                style={{ background: '#FF2D78' }}
              >
                {t('common.close')}
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-black text-light-text dark:text-dark-text mb-4">
                {t('drops.enter_raffle')}
              </h3>

              {!user && (
                <p className="text-xs text-brand-pink font-semibold mb-3 p-3 rounded-xl bg-brand-pink/10">
                  {t('auth.login_required')} —{' '}
                  <Link to="/auth?next=/drops" onClick={onClose} className="underline font-black">
                    {t('auth.sign_in')}
                  </Link>
                </p>
              )}

              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                  {t('product.select_size')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-colors ${
                        size === s
                          ? 'border-brand-pink bg-brand-pink text-white'
                          : 'border-zinc-300 dark:border-zinc-600 text-light-text dark:text-dark-text hover:border-brand-pink'
                      }`}
                    >
                      {s.startsWith('EU') ? s.replace('EU', '') + ' EU' : s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={enterRaffle}
                disabled={!size || loading || !user}
                className="w-full py-3.5 rounded-xl font-black text-sm text-white disabled:opacity-50 transition-opacity"
                style={{ background: '#FF2D78' }}
              >
                {loading ? t('common.loading') : t('drops.enter_raffle')}
              </button>
              <p className="mt-2 text-center text-[10px] text-light-muted dark:text-dark-muted">
                {t('drops.raffle_notice') ?? 'Winners notified by email. Free to enter.'}
              </p>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Drop card ────────────────────────────────────────────────────────────────
function DropCard({ product, dropTime, dropId, units, unitsSold, index }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const { addItem, openCart } = useCart()
  const { success } = useToast()
  const { live } = useCountdown(dropTime)
  const [raffleOpen, setRaffleOpen] = useState(false)
  const isLive      = !live
  const isSoldOut   = units > 0 && unitsSold >= units
  const pctSold     = units > 0 ? Math.min(100, (unitsSold / units) * 100) : 0
  const unitsLeft   = Math.max(0, units - unitsSold)

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        className="group relative rounded-2xl overflow-hidden bg-zinc-900"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.title}
            onError={handleImgError}
            loading="lazy"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 start-3">
            <Badge label={product.badge} />
          </div>

          {/* Live indicator */}
          {isLive && !isSoldOut && (
            <div className="absolute top-3 end-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500 text-white text-[10px] font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 inset-x-0 p-4">
            {/* Countdown or sold-out */}
            <div className="mb-3">
              {isSoldOut ? (
                <span className="text-sm font-black text-red-400">{t('drops.sold_out')}</span>
              ) : (
                <>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1.5">
                    {isLive ? t('drops.available') : t('drops.countdown')}
                  </p>
                  <CountdownTiles targetMs={dropTime} size="md" />
                </>
              )}
            </div>

            {/* Units bar */}
            {units > 0 && (
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-white/50 mb-1">
                  <span>{t('drops.units_left', { count: unitsLeft })}</span>
                  <span>{Math.round(pctSold)}% claimed</span>
                </div>
                <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pctSold}%`,
                      background: pctSold > 80 ? '#EF4444' : '#FF2D78',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Product info */}
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{product.brand}</p>
            <p className="text-sm font-black text-white line-clamp-1 mt-0.5">{product.title}</p>
            <p className="text-base font-black mt-1" style={{ color: '#CCFF00' }}>
              {format(product.price)}
            </p>

            {/* CTA */}
            <div className="mt-3 flex gap-2">
              {isSoldOut ? (
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-center border border-white/30 text-white hover:border-white transition-colors"
                >
                  {t('product.description')}
                </Link>
              ) : isLive ? (
                <>
                  <button
                    type="button"
                    onClick={() => { addItem(product, product.colors?.[0], product.sizes?.[0], 1); openCart(); success(t('cart.added')) }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-black text-white"
                    style={{ background: '#FF2D78' }}
                  >
                    {t('product.add_to_cart')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRaffleOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-sm font-black border border-white/30 text-white hover:border-white transition-colors"
                  >
                    {t('drops.enter_raffle')}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setRaffleOpen(true)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white"
                  style={{ background: '#0066FF' }}
                >
                  {t('drops.notify_me')}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {raffleOpen && (
          <RaffleModal
            product={product}
            dropId={dropId}
            onClose={() => setRaffleOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Hero banner ──────────────────────────────────────────────────────────────
function DropsHero() {
  const { t } = useTranslation()
  return (
    <div
      className="relative py-16 sm:py-24 text-center overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: '#FF2D7833' }}
      />
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-black uppercase tracking-widest mb-3"
          style={{ color: '#FF2D78' }}
        >
          Limited Releases
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-white leading-none mb-4"
        >
          {t('drops.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-sm sm:text-base"
        >
          Enter the raffle before they drop. Winners get priority access.
        </motion.p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DropsPage() {
  const { t } = useTranslation()
  const { products: liveProducts } = useProducts()
  const [drops, setDrops] = useState([])
  const [filter, setFilter] = useState('all') // all | upcoming | live | ended
  usePageTitle(t('drops.title'))

  const source = liveProducts.length > 0 ? liveProducts : PRODUCTS
  const dropProducts = source.filter(p => p.is_drop)

  // Try to fetch live drop records; fall back to simulated times
  useEffect(() => {
    supabase
      .from('drops')
      .select('*')
      .order('drop_time', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setDrops(data)
      })
  }, [])

  // Build display list: join dropProducts with drop metadata
  const displayItems = dropProducts.map((product, i) => {
    const dropRecord = drops.find(d => d.product_id === product.id)
    const simulatedTime = Date.now() + [
      -2 * 86400000,      // past (available now)
       1 * 86400000,      // tomorrow
       3 * 86400000,      // 3 days
       7 * 86400000,      // 1 week
      14 * 86400000,      // 2 weeks
    ][i % 5]

    return {
      product,
      dropTime:   dropRecord ? new Date(dropRecord.drop_time).getTime() : simulatedTime,
      dropId:     dropRecord?.id ?? null,
      units:      dropRecord?.units_total ?? 100,
      unitsSold:  dropRecord?.units_sold  ?? Math.floor(Math.random() * 60),
    }
  })

  const now = Date.now()
  const filtered = displayItems.filter(({ dropTime, units, unitsSold }) => {
    const isLive    = dropTime <= now
    const isSoldOut = units > 0 && unitsSold >= units
    if (filter === 'live')     return isLive && !isSoldOut
    if (filter === 'upcoming') return dropTime > now
    if (filter === 'ended')    return isSoldOut
    return true
  })

  const filters = [
    { id: 'all',      label: 'All Drops' },
    { id: 'live',     label: '🔴 Live Now' },
    { id: 'upcoming', label: '⏳ Upcoming' },
    { id: 'ended',    label: '✓ Ended' },
  ]

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <DropsHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filter pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-black transition-colors ${
                filter === f.id
                  ? 'text-black'
                  : 'border border-white/20 text-white/60 hover:text-white hover:border-white/50'
              }`}
              style={filter === f.id ? { background: '#CCFF00' } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Drops grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-black text-white/60">No drops in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(({ product, dropTime, dropId, units, unitsSold }, i) => (
              <DropCard
                key={product.id}
                product={product}
                dropTime={dropTime}
                dropId={dropId}
                units={units}
                unitsSold={unitsSold}
                index={i}
              />
            ))}
          </div>
        )}

        {/* FAQ strip */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-10">
          {[
            { icon: '🎯', title: 'How it works', body: 'Enter the raffle before the drop time. Winners are selected at random and notified by email with a purchase link.' },
            { icon: '⚡', title: 'First come, first served', body: "Once a drop goes live, it's open to all. If no raffle was held, products sell on a first-come basis." },
            { icon: '🔔', title: 'Never miss a drop', body: 'Create an account and turn on notifications to get alerted the moment a new drop is announced.' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-white/10 p-5">
              <p className="text-2xl mb-2">{icon}</p>
              <h3 className="font-black text-white mb-1">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
