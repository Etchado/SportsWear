import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '@/context/ProductsContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCompare } from '@/context/CompareContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { handleImgError } from '@/lib/imgFallback'
import Badge from '@/components/ui/Badge'
import ReviewsSection from '@/components/sections/ReviewsSection'
import RelatedProducts from '@/components/sections/RelatedProducts'
import { PRODUCTS } from '@/data/products'

// Rough color → hex for swatches (reused from ProductCard)
const COLOR_MAP = {
  Black: '#0A0A0A', 'Core Black': '#0A0A0A', 'Triple Black': '#0A0A0A', 'Black/White': '#0A0A0A', 'Black/Orange': '#0A0A0A', 'Black/Phantom': '#0A0A0A', 'Black/Gold': '#0A0A0A',
  White: '#FFFFFF', 'Cloud White': '#F5F5F5', 'Puma White': '#F5F5F5', 'White/Grey': '#F3F4F6', 'White/Pink': '#FDF2F8', 'White/Blue': '#EFF6FF', 'White/Bright Lapis': '#FFFFFF',
  Red: '#EF4444', 'Solar Red': '#FF4500', 'University Red': '#CC0000', 'Vivid Red': '#FF2D2D', 'Team Red': '#CC0000', 'Club Red': '#CC0000', 'Neon Coral': '#FF6B6B', 'Solar Red/Black': '#FF4500',
  Blue: '#3B82F6', 'Royal Blue': '#2563EB', 'Team Royal Blue': '#1D4ED8', Navy: '#1E3A5F', 'Midnight Navy': '#1E3A5F', 'Dark Navy': '#1E3A5F', 'Academy Blue': '#1D4ED8', 'Halo Blue': '#60A5FA', 'Blue/White': '#3B82F6',
  'Legacy Purple': '#7C3AED', 'Electric Orchid': '#A855F7', 'Magic Mauve': '#C084FC', Plum: '#7C3AED',
  'Smoke Grey': '#6B7280', 'Concrete Grey': '#9CA3AF', 'Pitch Grey': '#6B7280', 'Dark Grey': '#4B5563', 'Asphalt': '#374151', 'Grey/Navy': '#9CA3AF', 'Halo Grey': '#D1D5DB',
  'Army Green': '#4B5320', 'Volt Green': '#CCFF00', 'Lime Squeeze': '#CCFF00', 'Neon Dragonfly': '#39FF14', 'Neon Dragonfly/Black': '#39FF14', 'Wild Willow': '#84CC16',
  'Vivid Orange': '#F97316', 'Vibrant Orange Glo': '#FB923C', Yellow: '#EAB308', 'Yellow/Black': '#EAB308',
  'Pink Quartz': '#F9A8D4', 'Pink Elixir': '#EC4899',
  'Halo Ivory': '#FEFCE8', 'Sea Salt': '#E2E8F0', 'Natural Indigo': '#4338CA', Wheat: '#DEB887',
}

function ImageGallery({ images = [], title }) {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-colors ${
              i === active ? 'border-brand-pink' : 'border-transparent'
            }`}
          >
            <img src={src} alt={`${title} ${i + 1}`} onError={handleImgError} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-light-surface dark:bg-dark-surface aspect-square sm:aspect-[4/5]">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={title}
            onError={handleImgError}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  )
}

function SizePicker({ sizes = [], selected, onSelect, category }) {
  const { t } = useTranslation()
  const isShoe = category === 'Shoes'
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-black text-light-text dark:text-dark-text">{t('product.select_size')}</p>
        <Link to="/size-guide" className="text-xs font-black text-brand-pink hover:opacity-70 transition-opacity flex items-center gap-1">
          {t('product.size_guide')}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map(size => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 transition-all ${
              selected === size
                ? 'border-brand-pink bg-brand-pink text-white'
                : 'border-zinc-300 dark:border-zinc-600 text-light-text dark:text-dark-text hover:border-brand-pink'
            }`}
          >
            {isShoe ? size.replace('EU', '') : size}
            {isShoe && <span className="text-[9px] ms-0.5 opacity-60">EU</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorPicker({ colors = [], selected, onSelect }) {
  const { t } = useTranslation()
  return (
    <div>
      <p className="text-sm font-black text-light-text dark:text-dark-text mb-2">
        {t('product.color')}: <span className="font-semibold text-light-muted dark:text-dark-muted">{selected}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map(color => {
          const hex = COLOR_MAP[color] ?? '#ccc'
          const isLight = ['White', 'Cloud White', 'Puma White', 'Sea Salt', 'Halo Ivory', 'Volt Green', 'Lime Squeeze'].includes(color)
          return (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => onSelect(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selected === color ? 'border-brand-pink scale-110 shadow-md' : `border-transparent hover:border-zinc-400 ${isLight ? 'ring-1 ring-zinc-200' : ''}`
              }`}
              style={{ background: hex }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { getProduct, products: liveProducts } = useProducts()
  const { addItem, openCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const { toggle: toggleCompare, isComparing, isFull } = useCompare()
  const { format } = useCurrency()
  const { sarToPoints } = useLoyalty()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [selectedColor, setColor] = useState(null)
  const [selectedSize,  setSize]  = useState(null)
  const [qty, setQty]           = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded]       = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySent, setNotifySent]   = useState(false)

  usePageTitle(product?.title ?? '')

  useEffect(() => {
    setLoading(true)
    setSizeError(false)
    setSize(null)
    setQty(1)
    setAdded(false)

    // Try live fetch first, fall back to static data
    getProduct(id)
      .then(data => {
        setProduct(data)
        setColor(data.colors?.[0] ?? null)
      })
      .catch(() => {
        const fallback = (liveProducts.length > 0 ? liveProducts : PRODUCTS).find(p => p.id === id)
        if (fallback) {
          setProduct(fallback)
          setColor(fallback.colors?.[0] ?? null)
        } else {
          navigate('/404', { replace: true })
        }
      })
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleAddToCart() {
    if (!selectedSize) { setSizeError(true); return }
    setSizeError(false)
    addItem(product, selectedColor, selectedSize, qty)
    setAdded(true)
    openCart()
    toast.success(t('cart.added'))
    setTimeout(() => setAdded(false), 2500)
  }

  function handleNotifyMe(e) {
    e.preventDefault()
    if (!notifyEmail.trim()) return
    setNotifySent(true)
    toast.success(t('product.notify_me_success'))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl bg-light-surface dark:bg-dark-surface animate-pulse" />
        <div className="space-y-4">
          {[80, 60, 40, 100, 60].map((w, i) => (
            <div key={i} className={`h-5 rounded-full bg-light-surface dark:bg-dark-surface animate-pulse`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!product) return null

  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : null

  const earnPoints = sarToPoints(product.price * qty)
  const wishlisted = isWishlisted(product.id)
  const comparing  = isComparing(product.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-light-muted dark:text-dark-muted mb-6 flex-wrap">
        <Link to="/" className="hover:text-brand-pink transition-colors">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-pink transition-colors">{t('nav.shop')}</Link>
        {product.brand && (
          <>
            <span>/</span>
            <Link to={`/brand/${product.brand.toLowerCase().replace(' ', '-')}`} className="hover:text-brand-pink transition-colors">{product.brand}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-light-text dark:text-dark-text line-clamp-1">{product.title}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <ImageGallery images={product.images ?? []} title={product.title} />

        {/* Info panel */}
        <div className="flex flex-col gap-5">
          {/* Badge + brand */}
          <div className="flex items-center gap-2">
            {product.badge && <Badge label={product.badge} />}
            <span className="text-xs font-black uppercase tracking-widest text-light-muted dark:text-dark-muted">{product.brand}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-light-text dark:text-dark-text leading-tight">
            {product.title}
          </h1>

          {/* Rating */}
          {(product.rating ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} style={{ color: n <= Math.round(product.rating) ? '#FF2D78' : '#D1D5DB' }}>★</span>
                ))}
              </div>
              <span className="text-sm font-black text-light-text dark:text-dark-text">{product.rating}</span>
              <span className="text-xs text-light-muted dark:text-dark-muted">
                ({product.reviews_count ?? product.review_count ?? 0} {t('product.reviews')})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-light-text dark:text-dark-text">
              {format(product.price)}
            </span>
            {product.old_price && (
              <span className="text-lg text-light-muted dark:text-dark-muted line-through">
                {format(product.old_price)}
              </span>
            )}
            {discount && (
              <span className="text-sm font-black px-2 py-0.5 rounded-full text-white" style={{ background: '#FF2D78' }}>
                -{discount}%
              </span>
            )}
          </div>

          {/* Loyalty preview */}
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-light-surface dark:bg-dark-surface text-xs font-semibold text-light-muted dark:text-dark-muted">
            <span className="text-base">⭐</span>
            {t('loyalty.earn_points', { points: earnPoints * qty })}
          </div>

          {/* Description */}
          <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">{product.description}</p>

          {/* Color picker */}
          {product.colors?.length > 0 && (
            <ColorPicker colors={product.colors} selected={selectedColor} onSelect={setColor} />
          )}

          {/* Size picker */}
          {product.sizes?.length > 0 && (
            <div>
              <SizePicker
                sizes={product.sizes}
                selected={selectedSize}
                onSelect={s => { setSize(s); setSizeError(false) }}
                category={product.category}
              />
              {sizeError && (
                <p className="text-xs font-black text-red-500 mt-1">{t('product.select_size_error')}</p>
              )}
            </div>
          )}

          {/* Qty + Add to cart / Notify Me */}
          {product.in_stock !== false ? (
            <div className="flex gap-3">
              <div className="flex items-center border-2 border-light-border dark:border-dark-border rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="px-3 py-2.5 font-black text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface disabled:opacity-40 transition-colors"
                >−</button>
                <span className="px-4 font-black text-light-text dark:text-dark-text tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(q => q + 1)}
                  className="px-3 py-2.5 font-black text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                >+</button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl font-black text-sm text-white transition-all relative overflow-hidden"
                style={{ background: '#FF2D78' }}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center justify-center gap-2">
                      ✓ {t('cart.added')}
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      {t('product.add_to_cart')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          ) : (
            /* Out-of-stock: Notify Me panel */
            <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <p className="font-black text-sm text-amber-900 dark:text-amber-200">{t('product.notify_me_title')}</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{t('product.notify_me_desc')}</p>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {notifySent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm font-black text-amber-800 dark:text-amber-300"
                  >
                    <span>✅</span> {t('product.notify_me_success')}
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleNotifyMe}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      required
                      value={notifyEmail}
                      onChange={e => setNotifyEmail(e.target.value)}
                      placeholder={t('product.notify_me_email')}
                      className="flex-1 px-3 py-2.5 rounded-xl text-sm border-2 border-amber-200 dark:border-amber-700 bg-white dark:bg-dark-surface text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl font-black text-sm text-white whitespace-nowrap"
                      style={{ background: '#F59E0B' }}
                    >
                      {t('product.notify_me')}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Wishlist + Compare */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (!user) { toast.info(t('auth.login_required')); return }
                toggle(product.id)
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-black transition-colors ${
                wishlisted
                  ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                  : 'border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-brand-pink'
              }`}
            >
              <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlisted ? t('wishlist.saved') : t('wishlist.save')}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!comparing && isFull) { toast.info(t('compare.full')); return }
                toggleCompare(product)
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-black transition-colors ${
                comparing
                  ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                  : 'border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-brand-blue'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {comparing ? t('compare.added') : t('compare.add')}
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: '🚚', label: t('cart.free_shipping') },
              { icon: '↩️', label: t('product.easy_returns') },
              { icon: '🔒', label: t('product.secure_payment') },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center p-3 rounded-xl bg-light-surface dark:bg-dark-surface">
                <span className="text-xl">{icon}</span>
                <span className="text-[10px] font-semibold text-light-muted dark:text-dark-muted leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs + long description */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {product.long_description && (
          <div>
            <h2 className="text-xl font-black text-light-text dark:text-dark-text mb-3">{t('product.description')}</h2>
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">{product.long_description}</p>
          </div>
        )}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div>
            <h2 className="text-xl font-black text-light-text dark:text-dark-text mb-3">{t('product.specs')}</h2>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key} className="border-b border-light-border dark:border-dark-border">
                    <td className="py-2 font-black text-light-text dark:text-dark-text capitalize">{key}</td>
                    <td className="py-2 text-light-muted dark:text-dark-muted text-end">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reviews */}
      <ReviewsSection
        productId={product.id}
        rating={product.rating}
        reviewCount={product.reviews_count ?? product.review_count ?? 0}
        reviews={product.reviews ?? []}
      />

      {/* Related */}
      <RelatedProducts product={product} />
    </div>
  )
}
