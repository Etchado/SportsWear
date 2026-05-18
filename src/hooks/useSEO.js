import { useEffect } from 'react'

const SITE_NAME = 'SportsWear'

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSEO({ title, description, image, url } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME
    document.title = fullTitle

    setMeta('name',     'description',       description)
    setMeta('property', 'og:title',          fullTitle)
    setMeta('property', 'og:description',    description)
    setMeta('property', 'og:image',          image)
    setMeta('property', 'og:url',            url ?? window.location.href)
    setMeta('property', 'og:type',           'website')
    setMeta('property', 'og:site_name',      SITE_NAME)
    setMeta('name',     'twitter:card',      'summary_large_image')
    setMeta('name',     'twitter:title',     fullTitle)
    setMeta('name',     'twitter:description', description)
    setMeta('name',     'twitter:image',     image)
  }, [title, description, image, url])
}
