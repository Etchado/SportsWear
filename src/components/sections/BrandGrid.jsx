import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BRAND_META } from '@/data/products'

const BRAND_IMAGES = {
  Nike:          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
  Adidas:        'https://images.unsplash.com/photo-1556906781-9d8a3276e6f0?w=600&auto=format&fit=crop',
  Puma:          'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop',
  'Under Armour':'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop',
  'New Balance': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop',
}

const BRAND_SLUGS = {
  Nike: 'nike', Adidas: 'adidas', Puma: 'puma',
  'Under Armour': 'under-armour', 'New Balance': 'new-balance',
}

export default function BrandGrid() {
  const { t } = useTranslation()
  const brands = Object.keys(BRAND_META)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#FF2D78' }}>
            {t('nav.brands')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-light-text dark:text-dark-text">
            {t('home.brand_grid_title')}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {brands.map((brand, i) => {
          const meta  = BRAND_META[brand]
          const slug  = BRAND_SLUGS[brand]
          const image = BRAND_IMAGES[brand]

          return (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/brand/${slug}`}
                className="group relative block aspect-square rounded-card overflow-hidden"
              >
                <img
                  src={image}
                  alt={brand}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${meta.color}99, #0A0A0Acc)` }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight text-center leading-tight">
                    {meta.logo}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-white/70 text-center hidden sm:block">
                    {meta.tagline}
                  </span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
