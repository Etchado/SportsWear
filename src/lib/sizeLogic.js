// Brand-specific size offset notes (Nike runs small, etc.)
const BRAND_OFFSET = {
  Nike:          0.5,
  Adidas:        0,
  Puma:          0,
  'Under Armour': 0,
  'New Balance': -0.5,
}

export function recommendShoeSize(brand, euSize) {
  const offset = BRAND_OFFSET[brand] ?? 0
  return euSize + offset
}

export function getClothingSize(chestCm) {
  if (chestCm < 86)  return 'XS'
  if (chestCm < 92)  return 'S'
  if (chestCm < 100) return 'M'
  if (chestCm < 108) return 'L'
  if (chestCm < 116) return 'XL'
  if (chestCm < 124) return '2XL'
  return '3XL'
}

export function euToUS(eu) { return eu - 33 }
export function euToUK(eu) { return eu - 33.5 }
export function cmToIn(cm) { return +(cm / 2.54).toFixed(1) }
export function kgToLbs(kg) { return +(kg * 2.205).toFixed(1) }
export function inToCm(inch) { return +(inch * 2.54).toFixed(1) }
export function lbsToKg(lbs) { return +(lbs / 2.205).toFixed(1) }
