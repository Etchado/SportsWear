import { createContext, useContext, useState } from 'react'
import { CURRENCIES, formatCurrency, convertPrice } from '@/lib/currency'

const STORAGE_KEY = 'sw_currency'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'SAR'
  )

  function changeCurrency(code) {
    if (!CURRENCIES[code]) return
    setCurrency(code)
    localStorage.setItem(STORAGE_KEY, code)
  }

  function format(amountInSAR) {
    return formatCurrency(amountInSAR, currency)
  }

  function convert(amountInSAR) {
    return convertPrice(amountInSAR, currency)
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencies: CURRENCIES,
        changeCurrency,
        format,
        convert,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}
