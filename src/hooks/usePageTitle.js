import { useEffect } from 'react'

const BASE = 'SportsWear'

export function usePageTitle(title) {
  useEffect(() => {
    const full = title ? `${title} — ${BASE}` : BASE
    document.title = full

    // Keep OG title in sync for social sharing
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', full)

    return () => {
      document.title = BASE
      if (ogTitle) ogTitle.setAttribute('content', BASE)
    }
  }, [title])
}
