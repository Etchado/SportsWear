import { useParams } from 'react-router-dom'

export default function SportPage() {
  const { category } = useParams()
  return <div className="min-h-screen p-8"><h1 className="text-3xl font-black capitalize">{category}</h1></div>
}
