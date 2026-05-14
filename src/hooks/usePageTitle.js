import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    const base = 'SportsWear'
    document.title = title ? `${title} — ${base}` : base
    return () => { document.title = base }
  }, [title])
}
