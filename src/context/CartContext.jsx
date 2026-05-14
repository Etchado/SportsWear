import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'sw_cart'

const CartContext = createContext(null)

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function cartKey(productId, color, size) {
  return `${productId}__${color}__${size}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, color, size, qty = 1) => {
    setItems(prev => {
      const key = cartKey(product.id, color, size)
      const exists = prev.find(i => cartKey(i.productId, i.color, i.size) === key)
      if (exists) {
        return prev.map(i =>
          cartKey(i.productId, i.color, i.size) === key
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          title:     product.title,
          price:     product.price,
          image:     product.images?.[0] ?? '',
          brand:     product.brand,
          color,
          size,
          qty,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId, color, size) => {
    setItems(prev =>
      prev.filter(i => cartKey(i.productId, i.color, i.size) !== cartKey(productId, color, size))
    )
  }, [])

  const updateQty = useCallback((productId, color, size, qty) => {
    if (qty < 1) return
    setItems(prev =>
      prev.map(i =>
        cartKey(i.productId, i.color, i.size) === cartKey(productId, color, size)
          ? { ...i, qty }
          : i
      )
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        isOpen,
        openCart:  () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
