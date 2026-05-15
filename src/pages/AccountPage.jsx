import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useAuth } from '@/context/AuthContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useToast } from '@/context/ToastContext'
import { useProducts } from '@/context/ProductsContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { supabase } from '@/lib/supabase'
import { handleImgError } from '@/lib/imgFallback'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS } from '@/data/products'

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', icon: '🏠', labelKey: 'account.overview'  },
  { id: 'orders',   icon: '📦', labelKey: 'account.orders'    },
  { id: 'wishlist', icon: '❤️', labelKey: 'account.wishlist'  },
  { id: 'loyalty',  icon: '⭐', labelKey: 'account.loyalty'   },
  { id: 'profile',  icon: '👤', labelKey: 'account.profile'   },
]

const TIER_COLORS = {
  Bronze:   '#CD7F32',
  Silver:   '#9CA3AF',
  Gold:     '#F59E0B',
  Platinum: '#8B5CF6',
}

const STATUS_STYLES = {
  paid:        { bg: '#0066FF22', text: '#0066FF', label: 'Paid' },
  processing:  { bg: '#F59E0B22', text: '#F59E0B', label: 'Processing' },
  shipped:     { bg: '#22C55E22', text: '#22C55E', label: 'Shipped' },
  delivered:   { bg: '#22C55E22', text: '#22C55E', label: 'Delivered' },
  cancelled:   { bg: '#EF444422', text: '#EF4444', label: 'Cancelled' },
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({ user, profile, onTabChange }) {
  const { t } = useTranslation()
  const { points, tier, nextTier, pointsToNext, TIER_THRESHOLDS } = useLoyalty()
  const { ids: wishlistIds } = useWishlist()
  const { format } = useCurrency()
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    if (!user) return
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
      .then(({ count }) => setOrderCount(count ?? 0))
  }, [user])

  const tierColor = TIER_COLORS[tier] ?? '#FF2D78'
  const tierPct = nextTier
    ? ((points - TIER_THRESHOLDS[tier]) / (TIER_THRESHOLDS[nextTier] - TIER_THRESHOLDS[tier])) * 100
    : 100

  const stats = [
    { label: t('account.orders'),  value: orderCount, icon: '📦', tab: 'orders'  },
    { label: t('account.wishlist'), value: wishlistIds.length, icon: '❤️', tab: 'wishlist' },
    { label: t('loyalty.your_points'), value: `${points} pts`, icon: '⭐', tab: 'loyalty' },
  ]

  return (
    <div>
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #FF2D78, #0066FF)` }}
      >
        <div className="relative z-10">
          <p className="text-sm font-semibold opacity-80 mb-1">{t('account.welcome_back') ?? 'Welcome back'}</p>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            {profile?.display_name ?? user?.email?.split('@')[0] ?? 'Athlete'} 👋
          </h2>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <span style={{ color: tierColor }}>●</span> {tier} Member
          </span>
        </div>
        {/* Decorative circle */}
        <div className="absolute -end-12 -top-12 w-48 h-48 rounded-full opacity-20" style={{ background: '#CCFF00' }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(({ label, value, icon, tab }) => (
          <button key={tab} type="button" onClick={() => onTabChange(tab)}
            className="rounded-2xl bg-light-surface dark:bg-dark-surface p-4 text-center hover:ring-2 ring-brand-pink transition-all"
          >
            <span className="text-2xl mb-2 block">{icon}</span>
            <p className="text-lg font-black text-light-text dark:text-dark-text">{value}</p>
            <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Loyalty tier progress */}
      <div className="rounded-2xl bg-light-surface dark:bg-dark-surface p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted">{t('loyalty.tier')}</p>
            <p className="text-lg font-black mt-0.5" style={{ color: tierColor }}>{tier}</p>
          </div>
          {nextTier && (
            <div className="text-end">
              <p className="text-xs text-light-muted dark:text-dark-muted">{t('account.points_to_next', { count: pointsToNext, tier: nextTier })}</p>
              <p className="text-xs font-black text-light-text dark:text-dark-text mt-0.5">{nextTier} →</p>
            </div>
          )}
        </div>
        <div className="h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: tierColor }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, tierPct)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-light-muted dark:text-dark-muted mt-2">{points} / {nextTier ? TIER_THRESHOLDS[nextTier] : points} pts</p>
      </div>
    </div>
  )
}

// ─── Orders tab ───────────────────────────────────────────────────────────────
function OrdersTab({ user }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('orders').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false) })
  }, [user])

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-light-surface dark:bg-dark-surface animate-pulse" />)}
    </div>
  )

  if (orders.length === 0) return (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">📦</p>
      <p className="font-black text-light-text dark:text-dark-text mb-1">{t('account.no_orders')}</p>
      <Link to="/shop" className="mt-4 inline-flex px-6 py-2.5 rounded-xl text-sm font-black text-white" style={{ background: '#FF2D78' }}>
        {t('nav.shop')}
      </Link>
    </div>
  )

  return (
    <div className="space-y-3">
      {orders.map(order => {
        const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.paid
        return (
          <div key={order.id} className="rounded-2xl bg-light-surface dark:bg-dark-surface p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-black text-sm text-light-text dark:text-dark-text">
                  {t('checkout.order_number', { number: order.order_number })}
                </p>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ background: style.bg, color: style.text }}
                >
                  {style.label}
                </span>
                <p className="font-black text-light-text dark:text-dark-text">{format(order.total)}</p>
              </div>
            </div>
            {order.shipping_address?.city && (
              <p className="mt-2 text-xs text-light-muted dark:text-dark-muted">
                📍 {order.shipping_address.city}, {order.shipping_address.country}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Wishlist tab ─────────────────────────────────────────────────────────────
function WishlistTab() {
  const { t } = useTranslation()
  const { ids } = useWishlist()
  const { products: live } = useProducts()
  const source = live.length > 0 ? live : PRODUCTS
  const wishlisted = source.filter(p => ids.includes(p.id))

  if (wishlisted.length === 0) return (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">❤️</p>
      <p className="font-black text-light-text dark:text-dark-text mb-1">{t('wishlist.empty')}</p>
      <Link to="/shop" className="mt-4 inline-flex px-6 py-2.5 rounded-xl text-sm font-black text-white" style={{ background: '#FF2D78' }}>
        {t('nav.shop')}
      </Link>
    </div>
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {wishlisted.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <ProductCard product={p} />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Loyalty tab ──────────────────────────────────────────────────────────────
function LoyaltyTab() {
  const { t } = useTranslation()
  const { points, tier, history, nextTier, pointsToNext, TIER_THRESHOLDS } = useLoyalty()
  const { format } = useCurrency()

  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum']
  const tierIdx = tiers.indexOf(tier)

  return (
    <div className="space-y-6">
      {/* Points balance */}
      <div
        className="rounded-2xl p-6 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #FF2D78 0%, #0066FF 100%)' }}
      >
        <p className="text-sm font-semibold opacity-70 mb-1">{t('loyalty.your_points')}</p>
        <p className="text-5xl font-black mb-1">{points}</p>
        <p className="text-sm opacity-70">= {format(points / 10)} {t('loyalty.redeem_info')}</p>
      </div>

      {/* Tier ladder */}
      <div className="rounded-2xl bg-light-surface dark:bg-dark-surface p-5">
        <h3 className="font-black text-sm text-light-text dark:text-dark-text mb-4 uppercase tracking-wider">{t('loyalty.tier')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {tiers.map((t_name, i) => {
            const active = i === tierIdx
            const done   = i < tierIdx
            const color  = TIER_COLORS[t_name]
            return (
              <div key={t_name} className={`rounded-xl p-3 text-center border-2 transition-colors ${active ? 'border-current' : 'border-transparent bg-light-bg dark:bg-dark-bg'}`}
                style={active ? { borderColor: color } : {}}>
                <div className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-black"
                  style={{ background: done || active ? color : '#E5E7EB', color: done || active ? '#fff' : '#9CA3AF' }}>
                  {done ? '✓' : t_name[0]}
                </div>
                <p className="text-[10px] font-black" style={{ color: active ? color : undefined }}>{t_name}</p>
                <p className="text-[9px] text-light-muted dark:text-dark-muted">{TIER_THRESHOLDS[t_name]}+</p>
              </div>
            )
          })}
        </div>
        {nextTier && (
          <p className="mt-4 text-xs text-center text-light-muted dark:text-dark-muted">
            {t('account.points_to_next', { count: pointsToNext, tier: nextTier })}
          </p>
        )}
      </div>

      {/* Earn info */}
      <div className="rounded-2xl border border-light-border dark:border-dark-border p-5 space-y-3">
        <h3 className="font-black text-sm text-light-text dark:text-dark-text">{t('loyalty.earn_rate')}</h3>
        {[
          { icon: '🛍', text: '1 pt per 1 SAR spent' },
          { icon: '⭐', text: '100 pts = 10 SAR off your next order' },
          { icon: '🎂', text: 'Double points on your birthday' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-light-muted dark:text-dark-muted">
            <span className="text-lg">{icon}</span>{text}
          </div>
        ))}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="font-black text-sm text-light-text dark:text-dark-text mb-3 uppercase tracking-wider">{t('loyalty.history')}</h3>
          <div className="space-y-2">
            {history.slice(0, 10).map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-light-border dark:border-dark-border">
                <div>
                  <p className="text-sm font-semibold text-light-text dark:text-dark-text capitalize">{h.action}</p>
                  {h.note && <p className="text-xs text-light-muted dark:text-dark-muted">{h.note}</p>}
                </div>
                <p className={`font-black text-sm ${h.action === 'earned' ? 'text-green-500' : 'text-brand-pink'}`}>
                  {h.action === 'earned' ? '+' : '-'}{h.points} pts
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Profile tab ──────────────────────────────────────────────────────────────
const profileSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters'),
})

function ProfileTab({ user, profile }) {
  const { t } = useTranslation()
  const { updateProfile, signOut } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [name, setName]       = useState(profile?.display_name ?? '')
  const [error, setError]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function save(e) {
    e.preventDefault()
    const res = profileSchema.safeParse({ display_name: name })
    if (!res.success) { setError(res.error.errors[0].message); return }
    setSaving(true)
    try {
      await updateProfile({ display_name: name })
      success(t('account.profile_saved') ?? 'Profile saved')
    } catch { toastError(t('common.error')) }
    finally { setSaving(false) }
  }

  async function handleSignOut() {
    setSigningOut(true)
    try { await signOut(); navigate('/') }
    catch { toastError(t('common.error')); setSigningOut(false) }
  }

  return (
    <div className="max-w-md space-y-6">
      {/* Avatar placeholder */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white"
          style={{ background: '#FF2D78' }}
        >
          {(profile?.display_name ?? user?.email ?? 'U')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-black text-light-text dark:text-dark-text">
            {profile?.display_name ?? user?.email?.split('@')[0]}
          </p>
          <p className="text-xs text-light-muted dark:text-dark-muted">{user?.email}</p>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1.5">
            {t('auth.display_name')}
          </label>
          <input
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            placeholder="Your name"
            className={`w-full border rounded-xl px-4 py-3 text-sm bg-transparent text-light-text dark:text-dark-text focus:outline-none transition-colors ${
              error ? 'border-red-500' : 'border-light-border dark:border-dark-border focus:border-brand-pink'
            }`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1.5">
            {t('checkout.email')}
          </label>
          <input
            value={user?.email ?? ''}
            disabled
            className="w-full border border-light-border dark:border-dark-border rounded-xl px-4 py-3 text-sm text-light-muted dark:text-dark-muted bg-light-surface dark:bg-dark-surface opacity-60 cursor-not-allowed"
          />
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-xl font-black text-white text-sm disabled:opacity-50"
          style={{ background: '#FF2D78' }}
        >
          {saving ? t('common.loading') : t('common.save')}
        </button>
      </form>

      <div className="pt-4 border-t border-light-border dark:border-dark-border">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-2 text-sm font-black text-red-500 hover:opacity-70 transition-opacity disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {signingOut ? t('common.loading') : t('auth.sign_out')}
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { t } = useTranslation()
  const { user, profile } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'overview'
  usePageTitle(t('account.title'))

  function setTab(id) {
    setSearchParams(id === 'overview' ? {} : { tab: id })
  }

  const tabContent = {
    overview: <OverviewTab user={user} profile={profile} onTabChange={setTab} />,
    orders:   <OrdersTab user={user} />,
    wishlist: <WishlistTab />,
    loyalty:  <LoyaltyTab />,
    profile:  <ProfileTab user={user} profile={profile} />,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar nav */}
        <aside className="sm:w-48 flex-shrink-0">
          <nav className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-brand-pink/10 text-brand-pink'
                    : 'text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text dark:hover:text-dark-text'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{t(tab.labelKey)}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {tabContent[activeTab] ?? tabContent.overview}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
