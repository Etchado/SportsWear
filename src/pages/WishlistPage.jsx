import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useWishlist } from '@/context/WishlistContext'
import { useProducts } from '@/context/ProductsContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS } from '@/data/products'

export default function WishlistPage() {
  const { t } = useTranslation()
  const { ids } = useWishlist()
  const { products: live } = useProducts()
  usePageTitle(t('wishlist.title'))

  const source = live.length > 0 ? live : PRODUCTS
  const wishlisted = source.filter(p => ids.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-black text-light-text dark:text-dark-text mb-8">
        {t('wishlist.title')}
        {wishlisted.length > 0 && (
          <span className="ms-3 text-xl font-semibold text-light-muted dark:text-dark-muted">
            ({wishlisted.length})
          </span>
        )}
      </h1>

      {wishlisted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">❤️</p>
          <p className="text-xl font-black text-light-text dark:text-dark-text mb-2">{t('wishlist.empty')}</p>
          <p className="text-sm text-light-muted dark:text-dark-muted mb-8">
            Save products you love and come back to them later.
          </p>
          <Link
            to="/shop"
            className="inline-flex px-8 py-3 rounded-xl font-black text-sm text-white"
            style={{ background: '#FF2D78' }}
          >
            {t('nav.shop')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlisted.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
