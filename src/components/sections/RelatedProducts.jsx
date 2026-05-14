import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '@/context/ProductsContext'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS } from '@/data/products'

export default function RelatedProducts({ product }) {
  const { t } = useTranslation()
  const { products: live } = useProducts()

  const source = live.length > 0 ? live : PRODUCTS
  const related = source
    .filter(p => p.id !== product.id && (p.brand === product.brand || p.sport === product.sport))
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-black text-light-text dark:text-dark-text mb-6">
        {t('product.you_may_like')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
