import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '@/context/CurrencyContext'

const SHOP_LINKS   = [
  { label: 'nav.men',   to: '/men' },
  { label: 'nav.women', to: '/women' },
  { label: 'nav.kids',  to: '/kids' },
  { label: 'nav.drops', to: '/drops' },
  { label: 'nav.shop',  to: '/shop' },
]
const BRAND_LINKS  = [
  { label: 'brands.nike',          to: '/brand/nike' },
  { label: 'brands.adidas',        to: '/brand/adidas' },
  { label: 'brands.puma',          to: '/brand/puma' },
  { label: 'brands.under_armour',  to: '/brand/under-armour' },
  { label: 'brands.new_balance',   to: '/brand/new-balance' },
]
const COMPANY_LINKS = [
  { label: 'about', to: '/about' },
  { label: 'support.faq',     to: '/support/faq' },
  { label: 'support.contact', to: '/support/contact' },
  { label: 'support.returns', to: '/support/returns' },
  { label: 'size_guide.title', to: '/size-guide' },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const { t, i18n } = useTranslation()
  const { currency, currencies, changeCurrency } = useCurrency()

  return (
    <footer className="bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border mt-16 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-black text-2xl tracking-tight">
              <span className="text-light-text dark:text-dark-text">SPORTS</span>
              <span style={{ color: '#FF2D78' }}>WEAR</span>
            </Link>
            <p className="mt-3 text-sm text-light-muted dark:text-dark-muted leading-relaxed max-w-[200px]">
              Premium sportswear from the world's top brands.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="p-2 rounded-xl bg-light-bg dark:bg-dark-bg text-light-muted dark:text-dark-muted hover:text-[#FF2D78] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4">{t('nav.shop')}</h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors">
                    {t(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4">{t('nav.brands')}</h3>
            <ul className="space-y-2.5">
              {BRAND_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors">
                    {t(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4">{t('support.title')}</h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors">
                    {t(label, label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-light-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-light-muted dark:text-dark-muted">
            © {new Date().getFullYear()} SportsWear. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/* Currency quick selector */}
            <select
              value={currency}
              onChange={e => changeCurrency(e.target.value)}
              className="text-xs font-semibold bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg px-2 py-1 text-light-text dark:text-dark-text"
            >
              {Object.keys(currencies).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Language */}
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
              className="text-xs font-semibold text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
            >
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
