import { useParams } from 'react-router-dom'
import { capitalize } from '@/lib/utils'
import CatalogLayout from '@/components/sections/CatalogLayout'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function SportPage() {
  const { category } = useParams()
  const title = capitalize(category ?? '')
  usePageTitle(title)
  return <CatalogLayout title={title} preFilter={{ sport: title }} />
}
