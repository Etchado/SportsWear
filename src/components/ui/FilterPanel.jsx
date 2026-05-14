import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilter } from '@/context/FilterContext'
import { BRANDS, SPORTS, GENDERS, CATEGORIES } from '@/data/products'

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
const SHOE_SIZES = ['EU36', 'EU37', 'EU38', 'EU39', 'EU40', 'EU41', 'EU42', 'EU43', 'EU44', 'EU45', 'EU46']
const COLORS = [
  { name: 'Black',  hex: '#1a1a1a' },
  { name: 'White',  hex: '#f5f5f5' },
  { name: 'Red',    hex: '#ef4444' },
  { name: 'Blue',   hex: '#3b82f6' },
  { name: 'Green',  hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Pink',   hex: '#ec4899' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Grey',   hex: '#9ca3af' },
  { name: 'Navy',   hex: '#1e3a5f' },
  { name: 'Volt',   hex: '#CCFF00' },
]

const PRICE_PRESETS = [
  { label: 'Under 100', min: 0,   max: 100  },
  { label: '100–300',   min: 100, max: 300  },
  { label: '300–600',   min: 300, max: 600  },
  { label: '600+',      min: 600, max: 5000 },
]

function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-light-border dark:border-dark-border">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 text-sm font-black text-light-text dark:text-dark-text"
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

function CheckboxGroup({ items, selected, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map(item => (
        <label key={item} className="flex items-center gap-2.5 cursor-pointer group">
          <span
            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
              selected.includes(item)
                ? 'border-brand-pink bg-brand-pink'
                : 'border-zinc-300 dark:border-zinc-600 group-hover:border-brand-pink'
            }`}
            onClick={() => onToggle(item)}
          >
            {selected.includes(item) && (
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-sm text-light-text dark:text-dark-text leading-none">{item}</span>
        </label>
      ))}
    </div>
  )
}

export default function FilterPanel({ className = '' }) {
  const { t } = useTranslation()
  const { filters, toggleArrayFilter, setFilter, clearFilters, hasActiveFilters } = useFilter()

  const handlePricePreset = (preset) => {
    setFilter('priceMin', preset.min)
    setFilter('priceMax', preset.max)
  }

  return (
    <aside className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-light-text dark:text-dark-text">
          {t('common.filters')}
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-black text-brand-pink hover:opacity-70 transition-opacity"
          >
            {t('common.clear_all')}
          </button>
        )}
      </div>

      <div className="space-y-0">
        <AccordionSection title={t('filters.gender')} defaultOpen>
          <CheckboxGroup
            items={GENDERS}
            selected={filters.gender}
            onToggle={v => toggleArrayFilter('gender', v)}
          />
        </AccordionSection>

        <AccordionSection title={t('filters.category')} defaultOpen>
          <CheckboxGroup
            items={CATEGORIES}
            selected={filters.category}
            onToggle={v => toggleArrayFilter('category', v)}
          />
        </AccordionSection>

        <AccordionSection title={t('filters.brand')}>
          <CheckboxGroup
            items={BRANDS}
            selected={filters.brand}
            onToggle={v => toggleArrayFilter('brand', v)}
          />
        </AccordionSection>

        <AccordionSection title={t('filters.sport')}>
          <CheckboxGroup
            items={SPORTS}
            selected={filters.sport}
            onToggle={v => toggleArrayFilter('sport', v)}
          />
        </AccordionSection>

        <AccordionSection title={t('filters.size')}>
          <div className="mb-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">Clothing</p>
            <div className="flex flex-wrap gap-1.5">
              {CLOTHING_SIZES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleArrayFilter('size', s)}
                  className={`px-2.5 py-1 rounded text-xs font-black border transition-colors ${
                    filters.size.includes(s)
                      ? 'border-brand-pink bg-brand-pink text-white'
                      : 'border-zinc-300 dark:border-zinc-600 text-light-text dark:text-dark-text hover:border-brand-pink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">Shoes (EU)</p>
            <div className="flex flex-wrap gap-1.5">
              {SHOE_SIZES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleArrayFilter('size', s)}
                  className={`px-2 py-1 rounded text-[10px] font-black border transition-colors ${
                    filters.size.includes(s)
                      ? 'border-brand-pink bg-brand-pink text-white'
                      : 'border-zinc-300 dark:border-zinc-600 text-light-text dark:text-dark-text hover:border-brand-pink'
                  }`}
                >
                  {s.replace('EU', '')}
                </button>
              ))}
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title={t('filters.color')}>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(({ name, hex }) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => toggleArrayFilter('color', name)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  filters.color.includes(name)
                    ? 'border-brand-pink scale-110 shadow-md'
                    : 'border-transparent hover:border-zinc-400'
                }`}
                style={{ background: hex }}
              />
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t('filters.price')}>
          <div className="space-y-1.5 mb-3">
            {PRICE_PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePricePreset(p)}
                className={`w-full text-start text-xs font-semibold py-1 px-2 rounded transition-colors ${
                  filters.priceMin === p.min && filters.priceMax === p.max
                    ? 'bg-brand-pink/10 text-brand-pink'
                    : 'text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface'
                }`}
              >
                {p.label} SAR
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={filters.priceMax}
              value={filters.priceMin}
              onChange={e => setFilter('priceMin', Number(e.target.value))}
              placeholder="Min"
              className="w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-2 py-1.5 text-xs text-light-text dark:text-dark-text focus:outline-none focus:border-brand-pink"
            />
            <span className="text-xs text-light-muted dark:text-dark-muted">–</span>
            <input
              type="number"
              min={filters.priceMin}
              max={5000}
              value={filters.priceMax}
              onChange={e => setFilter('priceMax', Number(e.target.value))}
              placeholder="Max"
              className="w-full border border-zinc-300 dark:border-zinc-600 bg-transparent rounded-lg px-2 py-1.5 text-xs text-light-text dark:text-dark-text focus:outline-none focus:border-brand-pink"
            />
          </div>
        </AccordionSection>
      </div>
    </aside>
  )
}
