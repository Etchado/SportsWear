import { createContext, useCallback, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'

const FilterContext = createContext(null)

const DEFAULT_PRICEMIN = 0
const DEFAULT_PRICEMAX = 5000
const DEFAULT_SORT     = 'newest'
const ARRAY_KEYS       = ['gender', 'sport', 'brand', 'category', 'size', 'color']

function paramsToFilters(params) {
  return {
    gender:   params.get('gender')?.split(',').filter(Boolean)   ?? [],
    sport:    params.get('sport')?.split(',').filter(Boolean)    ?? [],
    brand:    params.get('brand')?.split(',').filter(Boolean)    ?? [],
    category: params.get('category')?.split(',').filter(Boolean) ?? [],
    size:     params.get('size')?.split(',').filter(Boolean)     ?? [],
    color:    params.get('color')?.split(',').filter(Boolean)    ?? [],
    priceMin: Number(params.get('priceMin') ?? DEFAULT_PRICEMIN),
    priceMax: Number(params.get('priceMax') ?? DEFAULT_PRICEMAX),
    badge:    params.get('badge') ?? null,
  }
}

function filtersToParams(filters, sort, prev) {
  const params = new URLSearchParams(prev)

  for (const key of ARRAY_KEYS) {
    if (filters[key]?.length > 0) params.set(key, filters[key].join(','))
    else params.delete(key)
  }

  filters.priceMin > DEFAULT_PRICEMIN
    ? params.set('priceMin', filters.priceMin)
    : params.delete('priceMin')

  filters.priceMax < DEFAULT_PRICEMAX
    ? params.set('priceMax', filters.priceMax)
    : params.delete('priceMax')

  filters.badge ? params.set('badge', filters.badge) : params.delete('badge')
  sort !== DEFAULT_SORT ? params.set('sort', sort) : params.delete('sort')

  return params
}

export function FilterProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = paramsToFilters(searchParams)
  const sort    = searchParams.get('sort') ?? DEFAULT_SORT

  const setFilter = useCallback((key, value) => {
    setSearchParams(prev => {
      const f = paramsToFilters(prev)
      f[key] = value
      return filtersToParams(f, prev.get('sort') ?? DEFAULT_SORT, prev)
    }, { replace: true })
  }, [setSearchParams])

  const toggleArrayFilter = useCallback((key, value) => {
    setSearchParams(prev => {
      const f   = paramsToFilters(prev)
      const arr = f[key]
      f[key]    = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      return filtersToParams(f, prev.get('sort') ?? DEFAULT_SORT, prev)
    }, { replace: true })
  }, [setSearchParams])

  const setSort = useCallback((value) => {
    setSearchParams(prev => {
      const f = paramsToFilters(prev)
      return filtersToParams(f, value, prev)
    }, { replace: true })
  }, [setSearchParams])

  const clearFilters = useCallback(() => {
    setSearchParams(prev => {
      const fresh = new URLSearchParams()
      if (prev.get('q')) fresh.set('q', prev.get('q'))
      return fresh
    }, { replace: true })
  }, [setSearchParams])

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => {
    if (k === 'priceMin') return v !== DEFAULT_PRICEMIN
    if (k === 'priceMax') return v !== DEFAULT_PRICEMAX
    if (k === 'badge')    return v !== null
    return Array.isArray(v) && v.length > 0
  })

  return (
    <FilterContext.Provider
      value={{ filters, sort, setFilter, toggleArrayFilter, setSort, clearFilters, hasActiveFilters }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilter must be used inside FilterProvider')
  return ctx
}
