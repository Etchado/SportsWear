import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '@/context/ProductsContext'
import { useFilter } from '@/context/FilterContext'
import { useFilteredProducts } from '@/hooks/useFilteredProducts'
import ProductCard from '@/components/ui/ProductCard'
import FilterPanel from '@/components/ui/FilterPanel'
import { PRODUCTS } from '@/data/products'

const SORT_OPTIONS = [
  { value: 'newest',     labelKey: 'sort.newest'     },
  { value: 'popular',    labelKey: 'sort.popular'    },
  { value: 'rating',     labelKey: 'sort.rating'     },
  { value: 'price_asc',  labelKey: 'sort.price_asc'  },
  { value: 'price_desc', labelKey: 'sort.price_desc' },
  { value: 'name_asc',   labelKey: 'sort.name_asc'   },
]

const PER_PAGE = 20

function ActiveFilterChips() {
  const { t } = useTranslation()
  const { filters, toggleArrayFilter, setFilter, clearFilters, hasActiveFilters } = useFilter()

  if (!hasActiveFilters) return null

  const chips = []

  const arrayKeys = ['gender', 'sport', 'brand', 'category', 'size', 'color']
  arrayKeys.forEach(key => {
    filters[key].forEach(val => {
      chips.push({ label: val, onRemove: () => toggleArrayFilter(key, val) })
    })
  })

  if (filters.priceMin > 0 || (filters.priceMax > 0 && filters.priceMax < 5000)) {
    chips.push({
      label: `${filters.priceMin}–${filters.priceMax} SAR`,
      onRemove: () => { setFilter('priceMin', 0); setFilter('priceMax', 5000) },
    })
  }

  if (filters.badge) {
    chips.push({ label: filters.badge, onRemove: () => setFilter('badge', null) })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map(({ label, onRemove }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-brand-pink/10 text-brand-pink"
        >
          {label}
          <button type="button" onClick={onRemove} className="hover:opacity-70">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={clearFilters}
        className="text-xs font-black text-light-muted dark:text-dark-muted hover:text-brand-pink transition-colors"
      >
        {t('common.clear_all')}
      </button>
    </div>
  )
}

function SortBar({ sort, onSort, total, loading }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <p className="text-sm text-light-muted dark:text-dark-muted">
        {loading ? '…' : t('common.results', { count: total })}
      </p>
      <select
        value={sort}
        onChange={e => onSort(e.target.value)}
        className="text-sm font-semibold bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl px-3 py-2 text-light-text dark:text-dark-text focus:outline-none focus:border-brand-pink cursor-pointer"
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
        ))}
      </select>
    </div>
  )
}

function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-card bg-light-surface dark:bg-dark-surface animate-pulse" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-lg font-black text-light-text dark:text-dark-text mb-1">No products found</p>
        <p className="text-sm text-light-muted dark:text-dark-muted">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i * 0.04, 0.4) }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  )
}

export default function CatalogLayout({ title, preFilter = {} }) {
  const { t } = useTranslation()
  const { products: liveProducts, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)

  const query = searchParams.get('q') ?? ''
  const badge = searchParams.get('badge') ?? null
  const sort  = searchParams.get('sort') ?? 'newest'

  const source = liveProducts.length > 0 ? liveProducts : PRODUCTS

  const { products, total, hasMore } = useFilteredProducts(source, {
    preFilter,
    query,
    badge,
    sort,
    page,
    perPage: PER_PAGE,
  })

  const handleSort = useCallback((value) => {
    setSearchParams(prev => { prev.set('sort', value); return prev })
    setPage(1)
  }, [setSearchParams])

  const handleSearch = useCallback((value) => {
    setSearchParams(prev => {
      if (value) prev.set('q', value)
      else prev.delete('q')
      return prev
    })
    setPage(1)
  }, [setSearchParams])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page heading */}
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-light-text dark:text-dark-text">{title}</h1>
        </div>
      )}

      {/* Search bar */}
      <div className="relative mb-6">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder={t('nav.search_placeholder')}
          className="w-full ps-9 pe-4 py-3 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-sm text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-brand-pink transition-colors"
        />
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterPanel />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button */}
          <div className="flex items-center gap-3 mb-4 lg:hidden">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-light-border dark:border-dark-border text-sm font-black text-light-text dark:text-dark-text"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
              </svg>
              {t('common.filters')}
            </button>
          </div>

          <ActiveFilterChips />
          <SortBar sort={sort} onSort={handleSort} total={total} loading={loading} />
          <ProductGrid products={products} loading={loading} />

          {/* Load more */}
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setPage(p => p + 1)}
                className="inline-flex items-center gap-2 px-10 py-3 rounded-xl font-black text-sm border-2 border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
              >
                {t('common.load_more')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 start-0 w-80 bg-light-bg dark:bg-dark-bg z-50 overflow-y-auto p-5 lg:hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-light-text dark:text-dark-text">{t('common.filters')}</h2>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface"
                >
                  <svg className="w-5 h-5 text-light-text dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterPanel />
              <div className="mt-6 sticky bottom-0 bg-light-bg dark:bg-dark-bg pt-3">
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="w-full py-3 rounded-xl font-black text-sm text-white"
                  style={{ background: '#FF2D78' }}
                >
                  {t('common.show_results', { count: total })}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
