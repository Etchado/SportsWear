import { useTranslation } from 'react-i18next'
import CatalogLayout from '@/components/sections/CatalogLayout'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function ShopPage() {
  const { t } = useTranslation()
  usePageTitle(t('nav.shop'))
  return <CatalogLayout title={t('nav.shop')} />
}
