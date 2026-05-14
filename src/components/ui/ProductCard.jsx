import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart }     from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useToast }    from '@/context/ToastContext'
import { handleImgError } from '@/lib/imgFallback'
import Badge from './Badge'

export default function ProductCard({ product }) {
  const { t } = useTranslation()
  const { addItem }      = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const { format }       = useCurrency()
  const { success }      = useToast()

  const [activeColor, setActiveColor] = useState(0)

  const wishlisted = isWishlisted(product.id)
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null

  const displayImage = product.images?.[activeColor] ?? product.images?.[0]

  function handleAddToCart(e) {
    e.preventDefault()
    addItem(product, product.colors[activeColor] ?? product.colors[0], product.sizes?.[0] ?? 'One Size')
    success(t('product.add_to_cart') + ' ✓')
  }

  function handleWishlist(e) {
    e.preventDefault()
    toggle(product.id)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-light-bg dark:bg-dark-surface rounded-card overflow-hidden shadow-card dark:shadow-card-dark hover:shadow-hover transition-shadow"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-light-surface dark:bg-dark-bg">
          <img
            src={displayImage}
            alt={product.title}
            onError={handleImgError}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 start-2 flex flex-col gap-1">
            {product.badge && <Badge label={product.badge} />}
            {discount && <Badge label={`-${discount}%`} className="!bg-[#FF2D78] !text-white" />}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 end-2 p-2 rounded-full bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm transition-all hover:scale-110"
            aria-label={t('product.add_to_wishlist')}
          >
            <svg
              className="w-4 h-4 transition-colors"
              fill={wishlisted ? '#FF2D78' : 'none'}
              stroke={wishlisted ? '#FF2D78' : 'currentColor'}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick add — appears on hover */}
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 text-xs font-black text-white tracking-wider"
              style={{ background: '#FF2D78' }}
            >
              + {t('product.add_to_cart').toUpperCase()}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Brand + color swatches row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted">
              {product.brand}
            </span>
            {product.colors.length > 1 && (
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((color, i) => (
                  <button
                    key={color}
                    onClick={e => { e.preventDefault(); setActiveColor(i) }}
                    title={color}
                    className="w-3.5 h-3.5 rounded-full border-2 transition-transform hover:scale-125"
                    style={{
                      background: COLOR_MAP[color] ?? '#ccc',
                      borderColor: activeColor === i ? '#FF2D78' : 'transparent',
                    }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-light-muted dark:text-dark-muted">+{product.colors.length - 4}</span>
                )}
              </div>
            )}
          </div>

          <h3 className="text-sm font-bold text-light-text dark:text-dark-text line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs font-semibold text-light-muted dark:text-dark-muted">
                {product.rating} ({product.reviews_count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-black text-sm">{format(product.price)}</span>
            {product.old_price && (
              <span className="text-xs text-light-muted dark:text-dark-muted line-through">
                {format(product.old_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Rough color → hex map for swatches
const COLOR_MAP = {
  Black: '#0A0A0A',
  White: '#FFFFFF',
  'Triple Black': '#0A0A0A',
  'Core Black': '#0A0A0A',
  'Cloud White': '#F5F5F5',
  'Puma White': '#F5F5F5',
  Red: '#EF4444',
  'Solar Red': '#FF4500',
  'University Red': '#CC0000',
  'Vivid Red': '#FF2D2D',
  'Team Red': '#CC0000',
  'Club Red': '#CC0000',
  'Neon Coral': '#FF6B6B',
  Blue: '#3B82F6',
  'Royal Blue': '#2563EB',
  'Team Royal Blue': '#1D4ED8',
  Navy: '#1E3A5F',
  'Midnight Navy': '#1E3A5F',
  'Dark Navy': '#1E3A5F',
  'Academy Blue': '#1D4ED8',
  'Halo Blue': '#60A5FA',
  'Legacy Purple': '#7C3AED',
  'Electric Orchid': '#A855F7',
  'Magic Mauve': '#C084FC',
  Plum: '#7C3AED',
  'Smoke Grey': '#6B7280',
  'Concrete Grey': '#9CA3AF',
  'Pitch Grey': '#6B7280',
  'Dark Grey': '#4B5563',
  'Asphalt': '#374151',
  'Army Green': '#4B5320',
  'Volt Green': '#CCFF00',
  'Lime Squeeze': '#CCFF00',
  'Neon Dragonfly': '#39FF14',
  'Vivid Orange': '#F97316',
  'Vibrant Orange Glo': '#FB923C',
  'Solar Red/Black': '#FF4500',
  'Yellow/Black': '#EAB308',
  'Blue/White': '#3B82F6',
  'Black/Gold': '#0A0A0A',
  'Pink Quartz': '#F9A8D4',
  'Pink Elixir': '#EC4899',
  'Halo Grey': '#D1D5DB',
  'Halo Ivory': '#FEFCE8',
  'Sea Salt': '#E2E8F0',
  'Natural Indigo': '#4338CA',
  'Wild Willow': '#84CC16',
  Wheat: '#DEB887',
  'White/Grey': '#F3F4F6',
  'White/Pink': '#FDF2F8',
  'White/Blue': '#EFF6FF',
  'Grey/Navy': '#9CA3AF',
  'Black/White': '#0A0A0A',
  'Black/Orange': '#0A0A0A',
  'Black/Phantom': '#0A0A0A',
  'White/Bright Lapis': '#FFFFFF',
  'Neon Dragonfly/Black': '#39FF14',
  Eclipse: '#312E81',
}
