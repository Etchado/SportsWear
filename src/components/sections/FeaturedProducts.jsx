import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '@/context/ProductsContext'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS } from '@/data/products'

export default function FeaturedProducts({ title, titleKey, labelKey, filter, viewAllTo, accent = '#FF2D78' }) {
  const { t } = useTranslation()
  const { products, loading } = useProducts()

  // Use live data if available, else fall back to static seed data
  const source = products.length > 0 ? products : PRODUCTS
  const filtered = filter ? source.filter(filter) : source
  const displayed = filtered.slice(0, 8)

  const heading = title ?? (titleKey ? t(titleKey) : t('home.new_arrivals'))
  const label   = labelKey ? t(labelKey) : t('common.new')

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: accent }}>
            {label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-light-text dark:text-dark-text">
            {heading}
          </h2>
        </div>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="text-sm font-black hover:opacity-70 transition-opacity flex items-center gap-1"
            style={{ color: accent }}
          >
            {t('home.view_all')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-card bg-light-surface dark:bg-dark-surface animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
