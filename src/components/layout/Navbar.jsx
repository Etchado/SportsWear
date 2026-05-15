import { useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useTheme }    from '@/context/ThemeContext'
import { useCart }     from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth }     from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useScrolled } from '@/hooks/useScrolled'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { key: 'men',   to: '/men' },
  { key: 'women', to: '/women' },
  { key: 'kids',  to: '/kids' },
]

const SPORT_LINKS = [
  { label: 'Running',    to: '/sport/running' },
  { label: 'Football',   to: '/sport/football' },
  { label: 'Basketball', to: '/sport/basketball' },
  { label: 'Gym',        to: '/sport/gym' },
  { label: 'Yoga',       to: '/sport/yoga' },
  { label: 'Swimming',   to: '/sport/swimming' },
]

const BRAND_LINKS = [
  { label: 'Nike',          to: '/brand/nike' },
  { label: 'Adidas',        to: '/brand/adidas' },
  { label: 'Puma',          to: '/brand/puma' },
  { label: 'Under Armour',  to: '/brand/under-armour' },
  { label: 'New Balance',   to: '/brand/new-balance' },
]

function Dropdown({ label, items, accent = '#FF2D78' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 text-base font-semibold text-light-text dark:text-dark-text hover:opacity-70 transition-opacity py-2"
      >
        {label}
        <svg className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full start-0 mt-1 bg-light-bg dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-hover min-w-[160px] z-50 overflow-hidden"
          >
            {items.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-bg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SearchOverlay({ onClose }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-light-bg dark:bg-dark-surface rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <svg className="w-5 h-5 text-light-muted dark:text-dark-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('common.search_placeholder')}
            className="flex-1 bg-transparent text-base font-medium text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted outline-none"
          />
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-light-surface dark:hover:bg-dark-bg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

function CurrencyPicker() {
  const { currency, currencies, changeCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="text-xs font-bold text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors px-1.5 py-1 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface"
      >
        {currency}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute top-full end-0 mt-1 bg-light-bg dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-hover z-50 overflow-hidden min-w-[120px]"
          >
            {Object.keys(currencies).map(code => (
              <button
                key={code}
                onClick={() => { changeCurrency(code); setOpen(false) }}
                className={cn(
                  'w-full text-start px-4 py-2 text-xs font-semibold transition-colors',
                  code === currency
                    ? 'text-white'
                    : 'text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-bg'
                )}
                style={code === currency ? { background: '#FF2D78' } : {}}
              >
                {code}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const { totalItems, openCart } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, signOut } = useAuth()
  const scrolled = useScrolled()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen]  = useState(false)

  const isAR = i18n.language === 'ar'

  function toggleLang() {
    i18n.changeLanguage(isAR ? 'en' : 'ar')
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-card dark:shadow-card-dark'
            : 'bg-light-bg dark:bg-dark-bg'
        )}
      >
        {/* Top utility bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-1.5 border-b border-light-border dark:border-dark-border text-xs">
          <span className="text-light-muted dark:text-dark-muted font-medium">
            🚚 {t('cart.free_shipping', { amount: '500 SAR' })}
          </span>
          <div className="flex items-center gap-4">
            <CurrencyPicker />
            <button
              onClick={toggleLang}
              className="font-bold text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              {isAR ? 'EN' : 'ع'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-1 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-light-muted dark:text-dark-muted"
              aria-label={isDark ? t('common.light_mode') : t('common.dark_mode')}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Main navbar */}
        <div className="flex items-center justify-between px-4 md:px-8 h-20">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 font-black text-3xl tracking-tight">
            <span className="text-light-text dark:text-dark-text">SPORTS</span>
            <span style={{ color: '#FF2D78' }}>WEAR</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8 ms-10">
            {NAV_LINKS.map(({ key, to }) => (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) =>
                  cn('text-base font-semibold transition-colors hover:opacity-70',
                    isActive ? 'text-[#FF2D78]' : 'text-light-text dark:text-dark-text')
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
            <NavLink
              to="/drops"
              className={({ isActive }) =>
                cn('text-base font-semibold transition-colors',
                  isActive ? 'text-[#FF2D78]' : 'text-light-text dark:text-dark-text')
              }
              style={{ color: undefined }}
            >
              <span className="flex items-center gap-1.5">
                {t('nav.drops')}
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ background: '#FF2D78' }}>LIVE</span>
              </span>
            </NavLink>
            <Dropdown label={t('nav.sport')} items={SPORT_LINKS} />
            <Dropdown label={t('nav.brands')} items={BRAND_LINKS} />
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
              aria-label={t('nav.search')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors hidden sm:flex">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishCount > 0 && (
                <span className="absolute top-1 end-1 w-4 h-4 text-[10px] font-black text-white rounded-full flex items-center justify-center" style={{ background: '#FF2D78' }}>
                  {wishCount > 9 ? '9+' : wishCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              to={user ? '/account' : '/account/login'}
              className="p-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors hidden sm:flex"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
              aria-label={t('nav.cart')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 end-1 w-4 h-4 text-[10px] font-black text-white rounded-full flex items-center justify-center"
                    style={{ background: '#FF2D78' }}
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: isAR ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAR ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 start-0 z-50 w-72 bg-light-bg dark:bg-dark-bg shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
                <Link to="/" onClick={() => setMobileOpen(false)} className="font-black text-xl">
                  <span>SPORTS</span><span style={{ color: '#FF2D78' }}>WEAR</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {[
                  { label: t('nav.men'),   to: '/men' },
                  { label: t('nav.women'), to: '/women' },
                  { label: t('nav.kids'),  to: '/kids' },
                  { label: t('nav.shop'),  to: '/shop' },
                  { label: t('nav.drops'), to: '/drops' },
                ].map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl font-semibold text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                  >
                    {label}
                  </Link>
                ))}

                <div className="pt-3 pb-1">
                  <p className="px-4 text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">{t('nav.sport')}</p>
                  {SPORT_LINKS.map(({ label, to }) => (
                    <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface rounded-xl transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="pt-3 pb-1">
                  <p className="px-4 text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">{t('nav.brands')}</p>
                  {BRAND_LINKS.map(({ label, to }) => (
                    <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface rounded-xl transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="p-4 border-t border-light-border dark:border-dark-border flex items-center gap-3">
                <button onClick={toggleLang} className="flex-1 py-2 rounded-xl text-sm font-bold bg-light-surface dark:bg-dark-surface transition-colors">
                  {isAR ? 'English' : 'العربية'}
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-xl bg-light-surface dark:bg-dark-surface transition-colors">
                  {isDark ? '☀️' : '🌙'}
                </button>
                {user && (
                  <button onClick={() => { signOut(); setMobileOpen(false) }}
                    className="p-2 rounded-xl bg-light-surface dark:bg-dark-surface transition-colors text-sm font-bold">
                    {t('auth.sign_out')}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Navbar height spacer */}
      <div className="h-20 md:h-[calc(80px+33px)]" />
    </>
  )
}
