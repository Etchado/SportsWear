import { useParams } from 'react-router-dom'

export default function BrandPage() {
  const { name } = useParams()
  return <div className="min-h-screen p-8"><h1 className="text-3xl font-black capitalize">{name}</h1></div>
}
