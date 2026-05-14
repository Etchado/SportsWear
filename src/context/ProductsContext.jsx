import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setProducts(data ?? [])
        setLoading(false)
      })
  }, [])

  async function getProduct(id) {
    const { data, error: err } = await supabase
      .from('products')
      .select('*, product_variants(*), reviews(*)')
      .eq('id', id)
      .single()
    if (err) throw err
    return data
  }

  return (
    <ProductsContext.Provider value={{ products, loading, error, getProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider')
  return ctx
}
