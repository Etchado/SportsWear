import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useQuickView }  from '@/context/QuickViewContext'
import { useCart }       from '@/context/CartContext'
import { useWishlist }   from '@/context/WishlistContext'
import { useCurrency }   from '@/context/CurrencyContext'
import { useToast }      from '@/context/ToastContext'
import { handleImgError } from '@/lib/imgFallback'
import Badge from './Badge'

const COLOR_MAP = {
  Black: '#0A0A0A', 'Core Black': '#0A0A0A', 'Triple Black': '#0A0A0A',
  White: '#FFFFFF', 'Cloud White': '#F5F5F5', 'Puma White': '#F5F5F5',
  Red: '#EF4444', 'Solar Red': '#FF4500', 'University Red': '#CC0000',
  Blue: '#3B82F6', 'Royal Blue': '#2563EB', Navy: '#1E3A5F',
  'Volt Green': '#CCFF00', 'Lime Squeeze': '#CCFF00', 'Neon Dragonfly': '#39FF14',
  'Legacy Purple': '#7C3AED', 'Magic Mauve': '#C084FC', Plum: '#7C3AED',
  'Smoke Grey': '#6B7280', 'Dark Grey': '#4B5563', 'Halo Grey': '#D1D5DB',
  'Pink Quartz': '#F9A8D4', 'Pink Elixir': '#EC4899',
  'Army Green': '#4B5320', Yellow: '#EAB308', 'Yellow/Black': '#EAB308',
}

export default function QuickViewModal() {
  const { t } = useTranslation()
  const { product, close } = useQuickView()
  const { addItem, openCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const { format } = useCurrency()
  const { success } = useToast()

  const [activeImg, setActiveImg]   = useState(0)
  const [activeColor, setColor]     = useState(0)
  const [activeSize, setSize]       = useState(null)
  const [sizeError, setSizeError]   = useState(false)

  useEffect(() => {
    if (product) { setActiveImg(0); setColor(0); setSize(null); setSizeError(false) }
  }, [product])

  useEffect(() => {
    if (!product) return
    function onKey(e) { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, close])

  function handleAddToCart() {
    if (!activeSize) { setSizeError(true); return }
    setSizeError(false)
    addItem(product, product.colors[activeColor] ?? product.colors[0], activeSize)
    openCart()
    success(t('cart.added'))
    close()
  }

  const discount = product?.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null

  const inStock = product?.in_stock !== false

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && close()}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-light-bg dark:bg-dark-bg shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 end-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-light-surface dark:bg-dark-surface hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-light-text dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Images */}
              <div className="relative bg-light-surface dark:bg-dark-surface rounded-s-2xl overflow-hidden">
                <div className="aspect-square">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${activeImg}-${activeColor}`}
                      src={product.images?.[activeImg] ?? product.images?.[0]}
                      alt={product.title}
                      onError={handleImgError}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>

                {/* Badges */}
                <div className="absolute top-3 start-3 flex flex-col gap-1">
                  {product.badge && <Badge label={product.badge} />}
                  {discount && <Badge label={`-${discount}%`} className="!bg-[#FF2D78] !text-white" />}
                </div>

                {/* Thumbnails */}
                {product.images?.length > 1 && (
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 px-3">
                    {product.images.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-colors ${
                          i === activeImg ? 'border-brand-pink' : 'border-transparent'
                        }`}
                      >
                        <img src={src} alt="" onError={handleImgError} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1">
                    {product.brand}
                  </p>
                  <h2 className="text-xl font-black text-light-text dark:text-dark-text leading-snug">
                    {product.title}
                  </h2>

                  {product.rating > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span style={{ color: '#FF2D78' }}>★</span>
                      <span className="text-sm font-semibold text-light-muted dark:text-dark-muted">
                        {product.rating} ({product.reviews_count})
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-light-text dark:text-dark-text">
                    {format(product.price)}
                  </span>
                  {product.old_price && (
                    <span className="text-sm text-light-muted dark:text-dark-muted line-through">
                      {format(product.old_price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Color picker */}
                {product.colors?.length > 0 && (
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                      {t('product.color')}: <span className="text-light-text dark:text-dark-text">{product.colors[activeColor]}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, i) => (
                        <button
                          key={color}
                          title={color}
                          onClick={() => setColor(i)}
                          className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                          style={{
                            background: COLOR_MAP[color] ?? '#ccc',
                            borderColor: activeColor === i ? '#FF2D78' : 'transparent',
                            boxShadow: activeColor === i ? '0 0 0 2px #FF2D78' : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size picker */}
                {product.sizes?.length > 0 && (
                  <div>
                    <p className={`text-xs font-black uppercase tracking-wider mb-2 ${sizeError ? 'text-red-500' : 'text-light-muted dark:text-dark-muted'}`}>
                      {sizeError ? t('product.select_size_required') : t('product.select_size')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map(s => (
                        <button
                          key={s}
                          onClick={() => { setSize(s); setSizeError(false) }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-colors ${
                            activeSize === s
                              ? 'border-brand-pink bg-brand-pink text-white'
                              : 'border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-brand-pink'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                  {inStock ? (
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-opacity hover:opacity-90"
                      style={{ background: '#FF2D78' }}
                    >
                      {t('product.add_to_cart')}
                    </button>
                  ) : (
                    <div className="w-full py-3.5 rounded-xl font-black text-sm text-center bg-zinc-200 dark:bg-zinc-700 text-light-muted dark:text-dark-muted">
                      {t('product.out_of_stock')}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggle(product.id)}
                      className={`flex-1 py-3 rounded-xl text-sm font-black border-2 transition-colors ${
                        isWishlisted(product.id)
                          ? 'border-brand-pink text-brand-pink'
                          : 'border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-brand-pink'
                      }`}
                    >
                      {isWishlisted(product.id) ? '♥ ' : '♡ '}{t('product.add_to_wishlist')}
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      onClick={close}
                      className="flex-1 py-3 rounded-xl text-sm font-black text-center border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-brand-pink transition-colors"
                    >
                      {t('product.view_details')} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
