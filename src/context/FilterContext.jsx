import { createContext, useCallback, useContext, useState } from 'react'

const FilterContext = createContext(null)

const DEFAULT_FILTERS = {
  gender:   [],
  sport:    [],
  brand:    [],
  category: [],
  size:     [],
  color:    [],
  priceMin: 0,
  priceMax: 5000,
  badge:    null,
}

const DEFAULT_SORT = 'newest'

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort]       = useState(DEFAULT_SORT)

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters(prev => {
      const arr = prev[key]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSort(DEFAULT_SORT)
  }, [])

  const hasActiveFilters =
    Object.entries(filters).some(([k, v]) => {
      if (k === 'priceMin') return v !== DEFAULT_FILTERS.priceMin
      if (k === 'priceMax') return v !== DEFAULT_FILTERS.priceMax
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
