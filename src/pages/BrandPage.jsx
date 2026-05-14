import { useParams } from 'react-router-dom'
import { BRAND_META } from '@/data/products'
import CatalogLayout from '@/components/sections/CatalogLayout'
import { usePageTitle } from '@/hooks/usePageTitle'

const SLUG_TO_BRAND = {
  'nike':          'Nike',
  'adidas':        'Adidas',
  'puma':          'Puma',
  'under-armour':  'Under Armour',
  'new-balance':   'New Balance',
}

export default function BrandPage() {
  const { name } = useParams()
  const brand = SLUG_TO_BRAND[name] ?? name
  const meta  = BRAND_META[brand]
  usePageTitle(brand)

  return (
    <>
      {meta && (
        <div
          className="py-12 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${meta.color}33, #0A0A0Acc)` }}
        >
          <p className="text-4xl font-black mb-1">{meta.logo}</p>
          <p className="text-sm font-semibold text-white/60">{meta.tagline}</p>
        </div>
      )}
      <CatalogLayout title={brand} preFilter={{ brand }} />
    </>
  )
}
