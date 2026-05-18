import { createContext, useCallback, useContext, useState } from 'react'

const QuickViewContext = createContext(null)

export function QuickViewProvider({ children }) {
  const [product, setProduct] = useState(null)

  const open  = useCallback((p) => setProduct(p), [])
  const close = useCallback(() => setProduct(null), [])

  return (
    <QuickViewContext.Provider value={{ product, open, close }}>
      {children}
    </QuickViewContext.Provider>
  )
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext)
  if (!ctx) throw new Error('useQuickView must be used inside QuickViewProvider')
  return ctx
}
