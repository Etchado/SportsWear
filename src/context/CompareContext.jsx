import { createContext, useCallback, useContext, useState } from 'react'

const CompareContext = createContext(null)

const MAX = 3

export function CompareProvider({ children }) {
  const [items, setItems] = useState([])

  const add = useCallback((product) => {
    setItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev
      if (prev.length >= MAX) return prev
      return [...prev, product]
    })
  }, [])

  const remove = useCallback((productId) => {
    setItems(prev => prev.filter(p => p.id !== productId))
  }, [])

  const toggle = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) return prev.filter(p => p.id !== product.id)
      if (prev.length >= MAX) return prev
      return [...prev, product]
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const isComparing = useCallback((id) => items.some(p => p.id === id), [items])

  return (
    <CompareContext.Provider value={{ items, add, remove, toggle, clear, isComparing, isFull: items.length >= MAX }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider')
  return ctx
}
