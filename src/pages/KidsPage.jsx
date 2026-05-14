import { useTranslation } from 'react-i18next'
import CatalogLayout from '@/components/sections/CatalogLayout'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function KidsPage() {
  const { t } = useTranslation()
  usePageTitle(t('nav.kids'))
  return <CatalogLayout title={t('nav.kids')} preFilter={{ gender: 'Kids' }} />
}
