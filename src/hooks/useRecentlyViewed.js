import { useState, useEffect, useCallback } from 'react'

const KEY = 'sw_recently_viewed'
const MAX = 8

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

function save(ids) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch {}
}

export function useRecentlyViewed(currentId = null) {
  const [ids, setIds] = useState(load)

  const track = useCallback((id) => {
    if (!id) return
    setIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, MAX)
      save(next)
      return next
    })
  }, [])

  useEffect(() => {
    if (currentId) track(currentId)
  }, [currentId, track])

  // Exclude current product from the displayed list
  const viewedIds = currentId ? ids.filter(x => x !== currentId) : ids

  return { viewedIds, track }
}
