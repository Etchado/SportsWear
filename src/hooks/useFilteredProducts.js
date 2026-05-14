import { useMemo } from 'react'
import { useFilter } from '@/context/FilterContext'

const SORT_FNS = {
  newest:      (a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0),
  price_asc:   (a, b) => a.price - b.price,
  price_desc:  (a, b) => b.price - a.price,
  name_asc:    (a, b) => a.title.localeCompare(b.title),
  popular:     (a, b) => (b.review_count ?? 0) - (a.review_count ?? 0),
  rating:      (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
}

function matchesSearch(product, q) {
  if (!q) return true
  const lower = q.toLowerCase()
  return (
    product.title?.toLowerCase().includes(lower) ||
    product.brand?.toLowerCase().includes(lower) ||
    product.category?.toLowerCase().includes(lower) ||
    product.sport?.toLowerCase().includes(lower)
  )
}

function matchesArrayFilter(value, filterArr) {
  if (!filterArr || filterArr.length === 0) return true
  if (!value) return false
  return filterArr.some(f => f.toLowerCase() === value.toLowerCase())
}

function matchesSizeFilter(product, sizes) {
  if (!sizes || sizes.length === 0) return true
  const available = product.sizes ?? []
  return sizes.some(s => available.includes(s))
}

function matchesColorFilter(product, colors) {
  if (!colors || colors.length === 0) return true
  const available = product.colors ?? []
  return colors.some(c =>
    available.some(pc => pc.toLowerCase() === c.toLowerCase())
  )
}

export function useFilteredProducts(source, { preFilter = {}, query = '', badge = null, sort = 'newest', page = 1, perPage = 20 } = {}) {
  const { filters } = useFilter()

  const filtered = useMemo(() => {
    let list = [...source]

    // Pre-filters (from route context: gender, brand, sport)
    if (preFilter.gender) list = list.filter(p => p.gender === preFilter.gender)
    if (preFilter.brand)  list = list.filter(p => p.brand?.toLowerCase() === preFilter.brand.toLowerCase())
    if (preFilter.sport)  list = list.filter(p => p.sport?.toLowerCase() === preFilter.sport.toLowerCase())
    if (preFilter.badge)  list = list.filter(p => p.badge === preFilter.badge)

    // URL badge override
    if (badge) list = list.filter(p => p.badge === badge)

    // Search
    list = list.filter(p => matchesSearch(p, query))

    // Filter panel filters
    list = list.filter(p => matchesArrayFilter(p.gender,   filters.gender))
    list = list.filter(p => matchesArrayFilter(p.sport,    filters.sport))
    list = list.filter(p => matchesArrayFilter(p.brand,    filters.brand))
    list = list.filter(p => matchesArrayFilter(p.category, filters.category))
    list = list.filter(p => matchesSizeFilter(p,  filters.size))
    list = list.filter(p => matchesColorFilter(p, filters.color))
    list = list.filter(p => p.price >= (filters.priceMin ?? 0))
    if (filters.priceMax && filters.priceMax < 5000) {
      list = list.filter(p => p.price <= filters.priceMax)
    }
    if (filters.badge) list = list.filter(p => p.badge === filters.badge)

    return list
  }, [source, preFilter, query, badge, filters])

  const sorted = useMemo(() => {
    const fn = SORT_FNS[sort] ?? SORT_FNS.newest
    return [...filtered].sort(fn)
  }, [filtered, sort])

  const total = sorted.length
  const totalPages = Math.ceil(total / perPage)
  const paginated = sorted.slice(0, page * perPage)
  const hasMore = page * perPage < total

  return { products: paginated, total, hasMore, totalPages }
}
