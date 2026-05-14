import { useTranslation } from 'react-i18next'
import CatalogLayout from '@/components/sections/CatalogLayout'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function MenPage() {
  const { t } = useTranslation()
  usePageTitle(t('nav.men'))
  return <CatalogLayout title={t('nav.men')} preFilter={{ gender: 'Men' }} />
}
