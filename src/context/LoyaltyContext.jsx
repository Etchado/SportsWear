import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

const LoyaltyContext = createContext(null)

const TIER_THRESHOLDS = { Bronze: 0, Silver: 500, Gold: 1500, Platinum: 5000 }
const TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum']

function getTier(points) {
  if (points >= 5000) return 'Platinum'
  if (points >= 1500) return 'Gold'
  if (points >= 500)  return 'Silver'
  return 'Bronze'
}

function getNextTier(tier) {
  const idx = TIERS.indexOf(tier)
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

export function LoyaltyProvider({ children }) {
  const { user } = useAuth()
  const [points, setPoints] = useState(0)
  const [tier, setTier]     = useState('Bronze')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { setPoints(0); setTier('Bronze'); setHistory([]); return }
    setLoading(true)
    Promise.all([
      supabase.from('loyalty_points').select('*').eq('user_id', user.id).single(),
      supabase.from('loyalty_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
    ]).then(([{ data: lp }, { data: lh }]) => {
      if (lp) { setPoints(lp.points); setTier(getTier(lp.points)) }
      if (lh) setHistory(lh)
    }).finally(() => setLoading(false))
  }, [user])

  const addPoints = useCallback(async (amount, note = '') => {
    if (!user) return
    const newPoints = points + amount
    const newTier   = getTier(newPoints)
    await Promise.all([
      supabase.from('loyalty_points').upsert({ user_id: user.id, points: newPoints, tier: newTier }),
      supabase.from('loyalty_history').insert({ user_id: user.id, action: 'earned', points: amount, note }),
    ])
    setPoints(newPoints)
    setTier(newTier)
    setHistory(prev => [{ action: 'earned', points: amount, note, created_at: new Date().toISOString() }, ...prev])
  }, [user, points])

  const redeemPoints = useCallback(async (amount) => {
    if (!user || amount > points) throw new Error('Insufficient points')
    const newPoints = points - amount
    const newTier   = getTier(newPoints)
    await Promise.all([
      supabase.from('loyalty_points').upsert({ user_id: user.id, points: newPoints, tier: newTier }),
      supabase.from('loyalty_history').insert({ user_id: user.id, action: 'redeemed', points: amount, note: 'Redeemed at checkout' }),
    ])
    setPoints(newPoints)
    setTier(newTier)
  }, [user, points])

  const pointsToSAR = useCallback((pts) => pts / 10, [])
  const sarToPoints = useCallback((sar) => Math.floor(sar), [])

  const nextTier    = getNextTier(tier)
  const pointsToNext = nextTier ? TIER_THRESHOLDS[nextTier] - points : 0

  return (
    <LoyaltyContext.Provider
      value={{
        points, tier, history, loading,
        addPoints, redeemPoints,
        pointsToSAR, sarToPoints,
        nextTier, pointsToNext,
        TIER_THRESHOLDS,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  )
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext)
  if (!ctx) throw new Error('useLoyalty must be used inside LoyaltyProvider')
  return ctx
}
