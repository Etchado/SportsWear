import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { supabase } from '@/lib/supabase'
import { handleImgError } from '@/lib/imgFallback'

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'stats',   icon: '📊', label: 'Stats'   },
  { id: 'orders',  icon: '📦', label: 'Orders'  },
  { id: 'reviews', icon: '⭐', label: 'Reviews' },
  { id: 'products',icon: '👟', label: 'Products'},
]

const ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES = {
  paid:       { bg: '#0066FF22', text: '#0066FF' },
  processing: { bg: '#F59E0B22', text: '#F59E0B' },
  shipped:    { bg: '#8B5CF622', text: '#8B5CF6' },
  delivered:  { bg: '#22C55E22', text: '#22C55E' },
  cancelled:  { bg: '#EF444422', text: '#EF4444' },
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, delta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-light-surface dark:bg-dark-surface p-5 flex items-start justify-between"
    >
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1">{label}</p>
        <p className="text-3xl font-black text-light-text dark:text-dark-text">{value}</p>
        {delta != null && (
          <p className={`text-xs font-semibold mt-1 ${delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% vs last month
          </p>
        )}
      </div>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: `${accent}22` }}
      >
        {icon}
      </div>
    </motion.div>
  )
}

// ─── Stats tab ────────────────────────────────────────────────────────────────
function StatsTab() {
  const { format } = useCurrency()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('total, status, created_at'),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]).then(([{ data: orders }, { count: reviewCount }, { count: productCount }, { count: userCount }]) => {
      const total_orders  = orders?.length ?? 0
      const total_revenue = orders?.reduce((s, o) => s + Number(o.total), 0) ?? 0
      const by_status     = ORDER_STATUSES.reduce((acc, s) => {
        acc[s] = orders?.filter(o => o.status === s).length ?? 0
        return acc
      }, {})
      setStats({ total_orders, total_revenue, reviewCount, productCount, userCount, by_status })
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-light-surface dark:bg-dark-surface animate-pulse" />)}
    </div>
  )

  const cards = [
    { label: 'Total Revenue',  value: format(stats.total_revenue), icon: '💰', accent: '#22C55E' },
    { label: 'Total Orders',   value: stats.total_orders,          icon: '📦', accent: '#0066FF' },
    { label: 'Total Reviews',  value: stats.reviewCount ?? 0,      icon: '⭐', accent: '#F59E0B' },
    { label: 'Products',       value: stats.productCount ?? 0,     icon: '👟', accent: '#FF2D78' },
    { label: 'Registered Users', value: stats.userCount ?? 0,      icon: '👥', accent: '#8B5CF6' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Orders by status */}
      <div className="rounded-2xl bg-light-surface dark:bg-dark-surface p-5">
        <h3 className="font-black text-sm text-light-text dark:text-dark-text mb-4 uppercase tracking-wider">Orders by Status</h3>
        <div className="space-y-3">
          {ORDER_STATUSES.map(status => {
            const count = stats.by_status[status]
            const pct = stats.total_orders > 0 ? (count / stats.total_orders) * 100 : 0
            const style = STATUS_STYLES[status]
            return (
              <div key={status} className="flex items-center gap-3">
                <span className="w-20 text-xs font-black capitalize" style={{ color: style.text }}>{status}</span>
                <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: style.text }} />
                </div>
                <span className="w-8 text-xs font-black text-light-muted dark:text-dark-muted text-end">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Orders tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const { format } = useCurrency()
  const { success, error: toastError } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => { setOrders(data ?? []); setLoading(false) })
  }, [])

  async function updateStatus(orderId, status) {
    setUpdating(orderId)
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) { toastError(error.message); setUpdating(null); return }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    success(`Order updated to ${status}`)
    setUpdating(null)
  }

  const displayed = orders.filter(o => {
    const matchSearch = !search || o.order_number?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search order number..."
          className="flex-1 min-w-[200px] border border-light-border dark:border-dark-border bg-transparent rounded-xl px-4 py-2.5 text-sm text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-brand-pink"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface rounded-xl px-3 py-2.5 text-sm font-semibold text-light-text dark:text-dark-text focus:outline-none"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-20 rounded-2xl bg-light-surface dark:bg-dark-surface animate-pulse" />)}
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-center text-light-muted dark:text-dark-muted py-12">No orders found.</p>
      ) : (
        <div className="space-y-2">
          {displayed.map(order => {
            const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.paid
            return (
              <div key={order.id} className="rounded-2xl bg-light-surface dark:bg-dark-surface p-4 flex items-center gap-4 flex-wrap">
                {/* Info */}
                <div className="flex-1 min-w-[160px]">
                  <p className="font-black text-sm text-light-text dark:text-dark-text">#{order.order_number}</p>
                  <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()} · {order.shipping_address?.city ?? '—'}
                  </p>
                </div>

                {/* Total */}
                <p className="font-black text-sm text-light-text dark:text-dark-text w-24 text-end">
                  {format(order.total)}
                </p>

                {/* Status badge + select */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-black px-2.5 py-1 rounded-full capitalize"
                    style={{ background: style.bg, color: style.text }}
                  >
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="text-xs font-black border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg rounded-lg px-2 py-1.5 text-light-text dark:text-dark-text focus:outline-none disabled:opacity-50 cursor-pointer"
                  >
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-light-muted dark:text-dark-muted">
        {displayed.length} order{displayed.length !== 1 ? 's' : ''} shown
      </p>
    </div>
  )
}

// ─── Reviews tab ──────────────────────────────────────────────────────────────
function ReviewsTab() {
  const { success, error: toastError } = useToast()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*, products(title, images)')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => { setReviews(data ?? []); setLoading(false) })
  }, [])

  async function deleteReview(id) {
    if (!confirm('Delete this review?')) return
    setDeleting(id)
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) { toastError(error.message); setDeleting(null); return }
    setReviews(prev => prev.filter(r => r.id !== id))
    success('Review deleted')
    setDeleting(null)
  }

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-light-surface dark:bg-dark-surface animate-pulse" />)}
    </div>
  )

  if (reviews.length === 0) return (
    <p className="text-center text-light-muted dark:text-dark-muted py-12">No reviews yet.</p>
  )

  return (
    <div className="space-y-3">
      {reviews.map(review => (
        <div key={review.id} className="rounded-2xl bg-light-surface dark:bg-dark-surface p-4 flex gap-4">
          {/* Product thumb */}
          {review.products?.images?.[0] && (
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-700">
              <img src={review.products.images[0]} alt="" onError={handleImgError} loading="lazy" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-black text-light-muted dark:text-dark-muted line-clamp-1">
                  {review.products?.title ?? '—'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} style={{ color: n <= review.rating ? '#FF2D78' : '#D1D5DB', fontSize: '12px' }}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-light-muted dark:text-dark-muted">
                    {review.user_name ?? 'Anonymous'} · {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteReview(review.id)}
                disabled={deleting === review.id}
                className="flex-shrink-0 text-xs font-black text-red-500 hover:opacity-70 disabled:opacity-40 transition-opacity px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                {deleting === review.id ? '…' : 'Delete'}
              </button>
            </div>
            <p className="text-sm text-light-text dark:text-dark-text mt-1.5 line-clamp-2">{review.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Products tab ─────────────────────────────────────────────────────────────
function ProductsTab() {
  const { format } = useCurrency()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('products')
      .select('id, title, brand, price, badge, in_stock, rating, reviews_count, images')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data ?? []); setLoading(false) })
  }, [])

  const displayed = products.filter(p =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full sm:w-80 border border-light-border dark:border-dark-border bg-transparent rounded-xl px-4 py-2.5 text-sm text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-brand-pink"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-2xl bg-light-surface dark:bg-dark-surface animate-pulse" />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-light-border dark:border-dark-border overflow-hidden">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="bg-light-surface dark:bg-dark-surface">
                {['Product', 'Brand', 'Price', 'Badge', 'Rating', 'Stock'].map(h => (
                  <th key={h} className="px-4 py-3 text-start text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? '' : 'bg-light-surface/50 dark:bg-dark-surface/50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-700">
                        <img src={p.images?.[0]} alt="" onError={handleImgError} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-light-text dark:text-dark-text line-clamp-1 max-w-[180px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-light-muted dark:text-dark-muted">{p.brand}</td>
                  <td className="px-4 py-3 font-black text-light-text dark:text-dark-text">{format(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.badge ? (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink">{p.badge}</span>
                    ) : <span className="text-light-muted dark:text-dark-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 text-light-text dark:text-dark-text">
                    {p.rating ? `★ ${p.rating} (${p.reviews_count})` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-black ${p.in_stock ? 'text-green-500' : 'text-red-500'}`}>
                      {p.in_stock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-light-muted dark:text-dark-muted">{displayed.length} products</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { t } = useTranslation()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [tab, setTab] = useState('stats')
  usePageTitle('Admin Panel')

  if (authLoading) return null
  if (!isAdmin) return <Navigate to="/" replace />

  const content = {
    stats:    <StatsTab />,
    orders:   <OrdersTab />,
    reviews:  <ReviewsTab />,
    products: <ProductsTab />,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#FF2D78' }}>
            Restricted Access
          </p>
          <h1 className="text-3xl font-black text-light-text dark:text-dark-text">
            {t('admin.title')}
          </h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-0.5">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-500 text-xs font-black">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Admin Session Active
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-2xl bg-light-surface dark:bg-dark-surface mb-8 w-full sm:w-auto overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text shadow-card'
                : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {content[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
