export const CURRENCIES = {
  SAR: { symbol: 'SR',  locale: 'ar-SA', rate: 1 },
  AED: { symbol: 'AED', locale: 'ar-AE', rate: 1.02 },
  KWD: { symbol: 'KD',  locale: 'ar-KW', rate: 0.122 },
  BHD: { symbol: 'BD',  locale: 'ar-BH', rate: 0.141 },
  OMR: { symbol: 'OMR', locale: 'ar-OM', rate: 0.144 },
  QAR: { symbol: 'QR',  locale: 'ar-QA', rate: 1.363 },
  USD: { symbol: '$',   locale: 'en-US', rate: 0.267 },
  GBP: { symbol: '£',   locale: 'en-GB', rate: 0.210 },
  EUR: { symbol: '€',   locale: 'de-DE', rate: 0.246 },
}

export function convertPrice(amountInSAR, currency) {
  const config = CURRENCIES[currency] ?? CURRENCIES.SAR
  return amountInSAR * config.rate
}

export function formatCurrency(amountInSAR, currency = 'SAR') {
  const config = CURRENCIES[currency] ?? CURRENCIES.SAR
  const converted = convertPrice(amountInSAR, currency)
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(converted)
}
