import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCompare } from '@/context/CompareContext'
import { useCurrency } from '@/context/CurrencyContext'

function CompareModal({ items, onClose }) {
  const { t } = useTranslation()
  const { format } = useCurrency()

  const ATTRS = [
    { key: 'brand',    label: t('filters.brand') },
    { key: 'sport',    label: t('filters.sport') },
    { key: 'category', label: t('filters.category') },
    { key: 'price',    label: t('filters.price'),    render: (v) => format(v) },
    { key: 'rating',   label: t('product.reviews'),  render: (v) => `★ ${v}` },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 w-full sm:max-w-3xl bg-light-bg dark:bg-dark-bg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-light-border dark:border-dark-border">
          <h2 className="font-black text-lg text-light-text dark:text-dark-text">{t('compare.title')}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-light-surface dark:bg-dark-surface flex items-center justify-center text-xl text-light-muted dark:text-dark-muted hover:text-red-500 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Product images + titles */}
            <thead>
              <tr>
                <th className="w-28 sm:w-36 p-4 text-start text-xs font-black uppercase tracking-widest text-light-muted dark:text-dark-muted">
                  &nbsp;
                </th>
                {items.map(p => (
                  <th key={p.id} className="p-4 text-center min-w-[140px]">
                    <Link to={`/product/${p.id}`} onClick={onClose} className="block hover:opacity-80 transition-opacity">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-light-surface dark:bg-dark-surface mx-auto mb-2">
                        <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-black text-light-muted dark:text-dark-muted uppercase tracking-wide">{p.brand}</p>
                      <p className="text-xs font-bold text-light-text dark:text-dark-text line-clamp-2 leading-tight mt-0.5">{p.title}</p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Attribute rows */}
            <tbody>
              {ATTRS.map(({ key, label, render }) => (
                <tr key={key} className="border-t border-light-border dark:border-dark-border">
                  <td className="p-4 text-xs font-bold text-light-muted dark:text-dark-muted uppercase tracking-wide whitespace-nowrap">
                    {label}
                  </td>
                  {items.map(p => (
                    <td key={p.id} className="p-4 text-center text-sm font-semibold text-light-text dark:text-dark-text">
                      {render ? render(p[key]) : (p[key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Add to cart row */}
              <tr className="border-t border-light-border dark:border-dark-border">
                <td className="p-4" />
                {items.map(p => (
                  <td key={p.id} className="p-4 text-center">
                    <Link
                      to={`/product/${p.id}`}
                      onClick={onClose}
                      className="inline-block px-4 py-2 rounded-xl font-black text-xs text-white"
                      style={{ background: '#FF2D78' }}
                    >
                      {t('product.add_to_cart')}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CompareBar() {
  const { t } = useTranslation()
  const { items, remove, clear } = useCompare()
  const [modalOpen, setModalOpen] = useState(false)

  if (items.length === 0) return null

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-16 md:bottom-0 inset-x-0 z-30 pointer-events-none"
        >
          <div className="max-w-3xl mx-auto px-4 pb-4 pointer-events-auto">
            <div className="flex items-center gap-3 bg-dark-bg/95 backdrop-blur-md rounded-2xl shadow-2xl px-4 py-3 border border-dark-border">
              {/* Thumbnails */}
              <div className="flex gap-2 flex-1">
                {items.map(p => (
                  <div key={p.id} className="relative group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-dark-surface shrink-0">
                      <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute -top-1.5 -end-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-dashed border-dark-border shrink-0 flex items-center justify-center text-dark-muted text-lg"
                  >
                    +
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:block text-xs text-dark-muted font-semibold">
                  {items.length}/3
                </span>
                <button
                  onClick={clear}
                  className="text-xs font-bold text-dark-muted hover:text-red-400 transition-colors px-2 py-1"
                >
                  {t('compare.clear')}
                </button>
                <button
                  onClick={() => setModalOpen(true)}
                  disabled={items.length < 2}
                  className="px-4 py-2 rounded-xl font-black text-xs text-white disabled:opacity-40 transition-opacity"
                  style={{ background: '#0066FF' }}
                >
                  {t('compare.title')} →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <CompareModal items={items} onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
