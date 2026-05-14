import { useTranslation } from 'react-i18next'
import CatalogLayout from '@/components/sections/CatalogLayout'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function WomenPage() {
  const { t } = useTranslation()
  usePageTitle(t('nav.women'))
  return <CatalogLayout title={t('nav.women')} preFilter={{ gender: 'Women' }} />
}
