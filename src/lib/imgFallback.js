export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop'

export function handleImgError(e) {
  e.currentTarget.src = FALLBACK_IMAGE
  e.currentTarget.onerror = null
}
