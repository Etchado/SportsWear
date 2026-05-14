import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart }     from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { handleImgError } from '@/lib/imgFallback'

function CartItem({ item }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const { removeItem, updateQty } = useCart()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-3 py-4 border-b border-light-border dark:border-dark-border last:border-0"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-light-surface dark:bg-dark-surface shrink-0">
        <img
          src={item.image}
          alt={item.title}
          onError={handleImgError}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted">{item.brand}</p>
        <p className="text-sm font-bold text-light-text dark:text-dark-text line-clamp-2 leading-tight mt-0.5">{item.title}</p>
        <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
          {item.color} · {item.size}
        </p>

        <div className="flex items-center justify-between mt-2">
          {/* Qty controls */}
          <div className="flex items-center gap-2 bg-light-surface dark:bg-dark-bg rounded-xl overflow-hidden">
            <button
              onClick={() => updateQty(item.productId, item.color, item.size, item.qty - 1)}
              disabled={item.qty <= 1}
              className="w-7 h-7 flex items-center justify-center text-lg font-bold hover:bg-light-border dark:hover:bg-dark-border transition-colors disabled:opacity-30"
            >−</button>
            <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
            <button
              onClick={() => updateQty(item.productId, item.color, item.size, item.qty + 1)}
              className="w-7 h-7 flex items-center justify-center text-lg font-bold hover:bg-light-border dark:hover:bg-dark-border transition-colors"
            >+</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-black">{format(item.price * item.qty)}</span>
            <button
              onClick={() => removeItem(item.productId, item.color, item.size)}
              className="p-1 rounded-lg text-light-muted dark:text-dark-muted hover:text-red-500 transition-colors"
              aria-label={t('cart.remove')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CartDrawer() {
  const { t } = useTranslation()
  const { items, subtotal, totalItems, isOpen, closeCart } = useCart()
  const { format } = useCurrency()
  const FREE_SHIPPING_THRESHOLD = 500
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 30
  const vat = subtotal * 0.15

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 end-0 z-50 w-full max-w-sm bg-light-bg dark:bg-dark-bg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-light-border dark:border-dark-border">
              <div>
                <h2 className="font-black text-lg">{t('cart.title')}</h2>
                {totalItems > 0 && (
                  <p className="text-xs text-light-muted dark:text-dark-muted">{t('common.results', { count: totalItems })}</p>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                  <svg className="w-16 h-16 text-light-muted dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="font-bold text-light-muted dark:text-dark-muted">{t('cart.empty')}</p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                    style={{ background: '#FF2D78' }}
                  >
                    {t('nav.shop')}
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <CartItem key={`${item.productId}-${item.color}-${item.size}`} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-light-border dark:border-dark-border space-y-3">
                {/* Free shipping progress */}
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <div>
                    <p className="text-xs text-light-muted dark:text-dark-muted mb-1.5">
                      {t('cart.free_shipping', { amount: format(FREE_SHIPPING_THRESHOLD) })}
                    </p>
                    <div className="w-full h-1.5 bg-light-surface dark:bg-dark-surface rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%`, background: '#FF2D78' }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">{t('cart.subtotal')}</span>
                    <span className="font-semibold">{format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">{t('cart.shipping')}</span>
                    <span className="font-semibold">
                      {shipping === 0
                        ? <span style={{ color: '#22c55e' }}>{t('common.free_shipping_label')}</span>
                        : format(shipping)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">{t('cart.vat')}</span>
                    <span className="font-semibold">{format(vat)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-light-border dark:border-dark-border">
                    <span className="font-black">{t('cart.total')}</span>
                    <span className="font-black text-base">{format(subtotal + shipping + vat)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full py-3.5 rounded-xl font-black text-white text-center text-sm tracking-wide transition-opacity hover:opacity-90"
                  style={{ background: '#FF2D78' }}
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
