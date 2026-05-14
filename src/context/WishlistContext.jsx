import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sw_wishlist')) ?? [] }
    catch { return [] }
  })

  // Sync from Supabase when user logs in
  useEffect(() => {
    if (!user) return
    supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          const remote = data.map(r => r.product_id)
          setIds(remote)
          localStorage.setItem('sw_wishlist', JSON.stringify(remote))
        }
      })
  }, [user])

  const toggle = useCallback(async (productId) => {
    const has = ids.includes(productId)
    const next = has ? ids.filter(id => id !== productId) : [...ids, productId]
    setIds(next)
    localStorage.setItem('sw_wishlist', JSON.stringify(next))

    if (user) {
      if (has) {
        await supabase.from('wishlists').delete()
          .eq('user_id', user.id).eq('product_id', productId)
      } else {
        await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
      }
    }
  }, [ids, user])

  const isWishlisted = useCallback((productId) => ids.includes(productId), [ids])

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
