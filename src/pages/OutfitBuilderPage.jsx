import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useProducts } from '@/context/ProductsContext'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PRODUCTS } from '@/data/products'
import { supabase } from '@/lib/supabase'

// ─── constants ────────────────────────────────────────────────────────────────
const SPORT_OPTIONS = ['All', 'Running', 'Football', 'Basketball', 'Gym', 'Yoga', 'Swimming', 'Casual']
const GENDER_OPTIONS = ['Men', 'Women', 'Kids', 'Unisex']

const SLOT_CONFIG = {
  top:         { key: 'top',         categories: ['Tops'],                  icon: '👕' },
  bottom:      { key: 'bottom',      categories: ['Bottoms'],               icon: '👖' },
  shoes:       { key: 'shoes',       categories: ['Shoes'],                 icon: '👟' },
  accessories: { key: 'accessories', categories: ['Jackets', 'Accessories'], icon: '🧥' },
}

const SAVED_KEY = 'sw_saved_outfits'

// ─── helpers ──────────────────────────────────────────────────────────────────
function loadSavedOutfits() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY)) ?? [] } catch { return [] }
}

// ─── sub-components ───────────────────────────────────────────────────────────
function SportPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
        active
          ? 'text-white shadow-lg scale-105'
          : 'bg-light-surface dark:bg-dark-surface text-light-muted dark:text-dark-muted hover:scale-105'
      }`}
      style={active ? { background: '#FF2D78' } : {}}
    >
      {label}
    </button>
  )
}

function GenderPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 ${
        active
          ? 'border-transparent text-white'
          : 'border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-pink-400'
      }`}
      style={active ? { background: '#0066FF', borderColor: 'transparent' } : {}}
    >
      {label}
    </button>
  )
}

function SlotCard({ slotKey, config, selected, onSelect, onRemove, format }) {
  const { t } = useTranslation()
  const label = t(`outfit_builder.${slotKey}`)

  return (
    <motion.div
      layout
      className="relative rounded-2xl overflow-hidden border-2 border-dashed border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface transition-colors"
      whileHover={{ scale: 1.02 }}
    >
      {selected ? (
        <div className="flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden bg-light-bg dark:bg-dark-bg">
            <img
              src={selected.images?.[0]}
              alt={selected.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onRemove(slotKey)}
              className="absolute top-2 end-2 w-7 h-7 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              ×
            </button>
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="p-3 flex-1 flex flex-col gap-1">
            <p className="text-xs text-light-muted dark:text-dark-muted font-semibold uppercase tracking-wide">
              {config.icon} {label}
            </p>
            <p className="text-sm font-bold text-light-text dark:text-dark-text line-clamp-2 leading-tight">
              {selected.title}
            </p>
            <p className="text-sm font-black mt-auto" style={{ color: '#FF2D78' }}>
              {format(selected.price)}
            </p>
            <button
              onClick={() => onSelect(slotKey)}
              className="mt-2 text-xs text-light-muted dark:text-dark-muted underline hover:text-pink-500"
            >
              {t('common.edit')}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onSelect(slotKey)}
          className="w-full h-full min-h-[220px] flex flex-col items-center justify-center gap-3 p-4 hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
        >
          <span className="text-4xl">{config.icon}</span>
          <div className="text-center">
            <p className="font-bold text-light-text dark:text-dark-text">{label}</p>
            <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
              {t('outfit_builder.slot_empty', { slot: label })}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-light"
            style={{ background: '#FF2D78' }}
          >
            +
          </div>
        </button>
      )}
    </motion.div>
  )
}

function ProductPickerModal({ slotKey, slotConfig, filteredProducts, onPick, onClose, format }) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const results = useMemo(() => {
    if (!search.trim()) return filteredProducts
    const q = search.toLowerCase()
    return filteredProducts.filter(p =>
      p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    )
  }, [filteredProducts, search])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full sm:max-w-2xl bg-light-bg dark:bg-dark-bg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-light-border dark:border-dark-border">
            <div>
              <h3 className="text-lg font-black text-light-text dark:text-dark-text">
                {slotConfig.icon} {t(`outfit_builder.${slotKey}`)}
              </h3>
              <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {results.length} items
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-light-surface dark:bg-dark-surface flex items-center justify-center text-light-muted dark:text-dark-muted hover:text-red-500 text-xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div className="px-5 pt-4 pb-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('common.search_placeholder')}
              className="w-full px-4 py-2.5 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-sm text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Products grid */}
          <div className="flex-1 overflow-y-auto p-5 pt-2">
            {results.length === 0 ? (
              <div className="text-center py-12 text-light-muted dark:text-dark-muted">
                <p className="text-4xl mb-3">🔍</p>
                <p>{t('common.error')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {results.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onPick(slotKey, p)}
                    className="text-start rounded-xl overflow-hidden border-2 border-transparent hover:border-pink-400 bg-light-surface dark:bg-dark-surface transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="aspect-square overflow-hidden bg-light-bg dark:bg-dark-bg">
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-light-muted dark:text-dark-muted font-semibold">{p.brand}</p>
                      <p className="text-xs font-bold text-light-text dark:text-dark-text line-clamp-2 mt-0.5 leading-tight">
                        {p.title}
                      </p>
                      <p className="text-sm font-black mt-1" style={{ color: '#FF2D78' }}>
                        {format(p.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function SavedOutfitCard({ outfit, onLoad, onDelete, format }) {
  const total = Object.values(outfit.slots).reduce((s, p) => s + (p?.price ?? 0), 0)
  const items = Object.values(outfit.slots).filter(Boolean)
  return (
    <div className="rounded-2xl bg-light-surface dark:bg-dark-surface p-4 flex gap-3 items-center">
      <div className="flex gap-1 flex-1 min-w-0">
        {items.slice(0, 3).map((p, i) => (
          <div key={i} className="w-12 h-12 rounded-lg overflow-hidden bg-light-bg dark:bg-dark-bg shrink-0">
            <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover" />
          </div>
        ))}
        {items.length > 3 && (
          <div className="w-12 h-12 rounded-lg bg-light-bg dark:bg-dark-bg shrink-0 flex items-center justify-center text-xs font-bold text-light-muted dark:text-dark-muted">
            +{items.length - 3}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-light-text dark:text-dark-text truncate">{outfit.name}</p>
        <p className="text-xs text-light-muted dark:text-dark-muted">{format(total)}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onLoad(outfit)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg text-white"
          style={{ background: '#0066FF' }}
        >
          Load
        </button>
        <button
          onClick={() => onDelete(outfit.id)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-light-bg dark:bg-dark-bg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function OutfitBuilderPage() {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { format } = useCurrency()
  const { products: live } = useProducts()
  const { toast } = useToast()
  const navigate = useNavigate()
  usePageTitle(t('outfit_builder.title'))

  const source = live.length > 0 ? live : PRODUCTS

  // Filters
  const [sport, setSport]   = useState('All')
  const [gender, setGender] = useState('Men')

  // Slots: { top: product|null, bottom: product|null, shoes: product|null, accessories: product|null }
  const [slots, setSlots] = useState({ top: null, bottom: null, shoes: null, accessories: null })

  // Active picker
  const [pickerSlot, setPickerSlot] = useState(null)

  // Saved outfits panel
  const [savedOutfits, setSavedOutfits] = useState(loadSavedOutfits)
  const [showSaved, setShowSaved]       = useState(false)
  const [addedAll, setAddedAll]         = useState(false)

  // Products filtered for a given slot
  const getSlotProducts = useCallback((slotKey) => {
    const { categories } = SLOT_CONFIG[slotKey]
    return source.filter(p => {
      const catMatch = categories.includes(p.category)
      const sportMatch = sport === 'All' || p.sport === sport
      const genderMatch = p.gender === gender || p.gender === 'Unisex'
      return catMatch && sportMatch && genderMatch
    })
  }, [source, sport, gender])

  // Total price of filled slots
  const total = useMemo(
    () => Object.values(slots).reduce((s, p) => s + (p?.price ?? 0), 0),
    [slots]
  )

  const filledCount = Object.values(slots).filter(Boolean).length

  function handleSelect(slotKey) {
    setPickerSlot(slotKey)
  }

  function handlePick(slotKey, product) {
    setSlots(prev => ({ ...prev, [slotKey]: product }))
    setPickerSlot(null)
  }

  function handleRemove(slotKey) {
    setSlots(prev => ({ ...prev, [slotKey]: null }))
  }

  function handleAddAll() {
    const filled = Object.entries(slots).filter(([, p]) => p)
    if (filled.length === 0) return
    filled.forEach(([, p]) => {
      const color = p.colors?.[0] ?? ''
      const size  = p.sizes?.[0] ?? ''
      addItem(p, color, size, 1)
    })
    setAddedAll(true)
    setTimeout(() => setAddedAll(false), 2000)
    toast?.(t('cart.added'), 'success')
  }

  function handleSave() {
    if (!user) {
      navigate('/auth?next=/outfit-builder')
      return
    }
    const name = `${gender} ${sport === 'All' ? 'Outfit' : sport} — ${new Date().toLocaleDateString()}`
    const outfit = { id: Date.now(), name, sport, gender, slots, createdAt: new Date().toISOString() }
    const updated = [outfit, ...savedOutfits].slice(0, 10)
    setSavedOutfits(updated)
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
    toast?.(t('outfit_builder.save_outfit'), 'success')

    // Optionally sync to Supabase outfits table if it exists
    supabase.from('outfits').insert({
      user_id: user.id,
      name,
      sport,
      gender,
      slot_top:         slots.top?.id ?? null,
      slot_bottom:      slots.bottom?.id ?? null,
      slot_shoes:       slots.shoes?.id ?? null,
      slot_accessories: slots.accessories?.id ?? null,
    }).then(() => {}) // fire-and-forget, table may not exist yet
  }

  function handleShare() {
    const ids = Object.entries(slots)
      .filter(([, p]) => p)
      .map(([k, p]) => `${k}=${p.id}`)
      .join('&')
    const url = `${window.location.origin}/outfit-builder?${ids}&sport=${sport}&gender=${gender}`
    navigator.clipboard?.writeText(url).then(() => {
      toast?.('Link copied!', 'success')
    })
  }

  function handleLoadSaved(outfit) {
    setSlots(outfit.slots)
    setSport(outfit.sport)
    setGender(outfit.gender)
    setShowSaved(false)
  }

  function handleDeleteSaved(id) {
    const updated = savedOutfits.filter(o => o.id !== id)
    setSavedOutfits(updated)
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
  }

  // Load outfit from URL params if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sportParam  = params.get('sport')
    const genderParam = params.get('gender')
    if (sportParam)  setSport(sportParam)
    if (genderParam) setGender(genderParam)
    const slotKeys = Object.keys(SLOT_CONFIG)
    slotKeys.forEach(k => {
      const id = params.get(k)
      if (id) {
        const found = source.find(p => p.id === id)
        if (found) setSlots(prev => ({ ...prev, [k]: found }))
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pickerProducts = pickerSlot ? getSlotProducts(pickerSlot) : []

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">

      {/* Hero banner */}
      <div
        className="relative overflow-hidden py-12 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1a0a2e 50%, #0A0F1E 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute -top-10 -start-10 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: '#FF2D78' }} />
        <div className="absolute -bottom-10 -end-10 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: '#0066FF' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#CCFF00' }}>
            {t('outfit_builder.title')}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
            Build Your
            <span style={{ color: '#FF2D78' }}> Perfect </span>
            Look
          </h1>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            Mix and match top pieces, bottoms, shoes, and jackets to create your ultimate outfit.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Sport selector */}
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-light-muted dark:text-dark-muted mb-3">
            {t('outfit_builder.choose_sport')}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {SPORT_OPTIONS.map(s => (
              <SportPill key={s} label={s} active={sport === s} onClick={() => setSport(s)} />
            ))}
          </div>
        </div>

        {/* Gender selector */}
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-light-muted dark:text-dark-muted mb-3">
            {t('outfit_builder.choose_gender')}
          </p>
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map(g => (
              <GenderPill key={g} label={g} active={gender === g} onClick={() => setGender(g)} />
            ))}
          </div>
        </div>

        {/* Saved outfits toggle */}
        {savedOutfits.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowSaved(v => !v)}
              className="flex items-center gap-2 text-sm font-bold text-light-text dark:text-dark-text hover:text-pink-500 transition-colors"
            >
              <span>🗂</span>
              <span>Saved Outfits ({savedOutfits.length})</span>
              <span className="text-xs">{showSaved ? '▲' : '▼'}</span>
            </button>
            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 overflow-hidden flex flex-col gap-2"
                >
                  {savedOutfits.map(outfit => (
                    <SavedOutfitCard
                      key={outfit.id}
                      outfit={outfit}
                      onLoad={handleLoadSaved}
                      onDelete={handleDeleteSaved}
                      format={format}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Outfit slots 2x2 grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(SLOT_CONFIG).map(([key, config]) => (
            <SlotCard
              key={key}
              slotKey={key}
              config={config}
              selected={slots[key]}
              onSelect={handleSelect}
              onRemove={handleRemove}
              format={format}
            />
          ))}
        </div>

        {/* Outfit summary bar */}
        <motion.div
          layout
          className="rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            {/* Slots mini preview */}
            <div className="flex gap-2 flex-1">
              {Object.entries(slots).map(([key, p]) => (
                <div
                  key={key}
                  className="w-12 h-12 rounded-xl overflow-hidden border-2 border-light-border dark:border-dark-border"
                  title={p?.title ?? key}
                >
                  {p ? (
                    <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-light-bg dark:bg-dark-bg flex items-center justify-center text-xl">
                      {SLOT_CONFIG[key].icon}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col justify-center ms-2">
                <p className="text-xs text-light-muted dark:text-dark-muted">{t('outfit_builder.total')}</p>
                <p className="text-xl font-black text-light-text dark:text-dark-text">
                  {format(total)}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <motion.button
                onClick={handleAddAll}
                disabled={filledCount === 0}
                whileTap={{ scale: 0.97 }}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl font-black text-sm text-white disabled:opacity-40 transition-all"
                style={{ background: addedAll ? '#22c55e' : '#FF2D78' }}
              >
                {addedAll ? '✓ Added!' : t('outfit_builder.add_all_to_cart')}
              </motion.button>

              <button
                onClick={handleSave}
                disabled={filledCount === 0}
                className="px-5 py-3 rounded-xl font-black text-sm border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-pink-400 disabled:opacity-40 transition-all"
              >
                {t('outfit_builder.save_outfit')}
              </button>

              <button
                onClick={handleShare}
                disabled={filledCount === 0}
                className="px-5 py-3 rounded-xl font-black text-sm border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-blue-400 disabled:opacity-40 transition-all"
              >
                🔗
              </button>
            </div>
          </div>

          {filledCount === 0 && (
            <p className="mt-3 text-xs text-center text-light-muted dark:text-dark-muted">
              Select items from each slot above to build your outfit
            </p>
          )}
        </motion.div>

        {/* Inspiration tip */}
        <div className="mt-8 rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #FF2D7808, #0066FF08)' }}>
          <p className="text-sm text-light-muted dark:text-dark-muted mb-3">
            Need inspiration? Browse our curated collections.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Running', 'Football', 'Gym'].map(s => (
              <Link
                key={s}
                to={`/sport/${s.toLowerCase()}`}
                className="px-4 py-2 rounded-full text-xs font-bold bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text hover:scale-105 transition-transform border border-light-border dark:border-dark-border"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Product picker modal */}
      {pickerSlot && (
        <ProductPickerModal
          slotKey={pickerSlot}
          slotConfig={SLOT_CONFIG[pickerSlot]}
          filteredProducts={pickerProducts}
          onPick={handlePick}
          onClose={() => setPickerSlot(null)}
          format={format}
        />
      )}
    </div>
  )
}
