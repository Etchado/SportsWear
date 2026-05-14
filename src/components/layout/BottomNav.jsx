import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { cn } from '@/lib/utils'

const TABS = [
  {
    key: 'home',
    to: '/',
    end: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    key: 'shop',
    to: '/shop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    key: 'drops',
    to: '/drops',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: 'wishlist',
    to: '/wishlist',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    key: 'account',
    to: '/account',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const { t } = useTranslation()
  const { count: wishCount } = useWishlist()
  const { totalItems } = useCart()

  const badges = { wishlist: wishCount, drops: null }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-md border-t border-light-border dark:border-dark-border safe-bottom">
      <div className="flex">
        {TABS.map(tab => (
          <NavLink
            key={tab.key}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative',
                isActive ? 'text-[#FF2D78]' : 'text-light-muted dark:text-dark-muted'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  {tab.icon}
                  {tab.key === 'wishlist' && wishCount > 0 && (
                    <span className="absolute -top-1 -end-1 w-4 h-4 text-[9px] font-black text-white rounded-full flex items-center justify-center" style={{ background: '#FF2D78' }}>
                      {wishCount > 9 ? '9+' : wishCount}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-semibold">{t(`nav.${tab.key}`)}</span>
                {isActive && (
                  <span className="absolute top-0 inset-x-1/4 h-0.5 rounded-full" style={{ background: '#FF2D78' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
